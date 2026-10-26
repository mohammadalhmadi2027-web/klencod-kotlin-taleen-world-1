import { and, eq, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { childProfiles, childProgress, contentItems, InsertUser, parentProfiles, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

/** Lazily creates a connection so the app can still run in a local, offline-first mode. */
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn };
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listPublishedContent(options: { age?: number; subjectId?: number; limit?: number } = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(contentItems.publicationStatus, "published")];
  if (options.age !== undefined) conditions.push(lte(contentItems.minAge, options.age), gte(contentItems.maxAge, options.age));
  if (options.subjectId !== undefined) conditions.push(eq(contentItems.subjectId, options.subjectId));
  return db.select().from(contentItems).where(and(...conditions)).limit(options.limit ?? 50);
}

export async function ensureParentProfile(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const found = await db.select().from(parentProfiles).where(eq(parentProfiles.userId, userId)).limit(1);
  if (found[0]) return found[0];
  const result = await db.insert(parentProfiles).values({ userId });
  const created = await db.select().from(parentProfiles).where(eq(parentProfiles.id, Number(result[0].insertId))).limit(1);
  return created[0];
}

export async function listChildrenForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const parent = await ensureParentProfile(userId);
  return db.select().from(childProfiles).where(eq(childProfiles.parentId, parent.id));
}

export async function createChildForUser(input: { userId: number; nickname: string; ageBand: "4_6" | "7_9" | "10_12" | "13_15"; interests: string[]; avatarKey?: string }) {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const parent = await ensureParentProfile(input.userId);
  const result = await db.insert(childProfiles).values({ parentId: parent.id, nickname: input.nickname, ageBand: input.ageBand, interests: input.interests, avatarKey: input.avatarKey ?? "star" });
  const created = await db.select().from(childProfiles).where(eq(childProfiles.id, Number(result[0].insertId))).limit(1);
  return created[0];
}

export async function recordChildProgress(input: { userId: number; childId: number; contentItemId: number; score?: number; timeSpentSeconds?: number; status: "in_progress" | "completed" | "review_needed" }) {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const parent = await ensureParentProfile(input.userId);
  const child = await db.select().from(childProfiles).where(and(eq(childProfiles.id, input.childId), eq(childProfiles.parentId, parent.id))).limit(1);
  if (!child[0]) throw new Error("CHILD_NOT_FOUND");
  const values = { childId: input.childId, contentItemId: input.contentItemId, status: input.status, score: input.score, timeSpentSeconds: input.timeSpentSeconds ?? 0, attempts: 1, completedAt: input.status === "completed" ? new Date() : null } as const;
  await db.insert(childProgress).values(values).onDuplicateKeyUpdate({ set: { status: values.status, score: values.score, timeSpentSeconds: values.timeSpentSeconds, completedAt: values.completedAt } });
  return { success: true } as const;
}
