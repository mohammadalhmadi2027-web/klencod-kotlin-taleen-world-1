import { boolean, index, int, json, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/** Core account table supplied by the authentication template. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const platformRoles = mysqlTable("platform_roles", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 64 }).notNull().unique(),
  label: varchar("label", { length: 120 }).notNull(),
  permissions: json("permissions").$type<string[]>().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const parentProfiles = mysqlTable("parent_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  country: varchar("country", { length: 80 }),
  privacyConsentAt: timestamp("privacyConsentAt"),
  communicationPreference: mysqlEnum("communicationPreference", ["email", "in_app", "none"]).default("in_app").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("parent_profiles_user_unique").on(table.userId)]);

export const childProfiles = mysqlTable("child_profiles", {
  id: int("id").autoincrement().primaryKey(),
  parentId: int("parentId").notNull(),
  nickname: varchar("nickname", { length: 80 }).notNull(),
  ageBand: mysqlEnum("ageBand", ["4_6", "7_9", "10_12", "13_15"]).notNull(),
  birthYear: int("birthYear"),
  avatarKey: varchar("avatarKey", { length: 120 }).default("star").notNull(),
  interests: json("interests").$type<string[]>().notNull(),
  learningLevel: mysqlEnum("learningLevel", ["explorer", "foundation", "builder", "future_ready"]).default("foundation").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("child_profiles_parent_index").on(table.parentId)]);

export const subjects = mysqlTable("subjects", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  titleAr: varchar("titleAr", { length: 160 }).notNull(),
  titleEn: varchar("titleEn", { length: 160 }),
  zone: varchar("zone", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 80 }).notNull(),
  color: varchar("color", { length: 16 }).notNull(),
  isPublished: boolean("isPublished").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  subjectId: int("subjectId").notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  descriptionAr: text("descriptionAr").notNull(),
  minAge: int("minAge").notNull(),
  maxAge: int("maxAge").notNull(),
  level: mysqlEnum("level", ["explorer", "foundation", "builder", "future_ready"]).notNull(),
  coverUrl: text("coverUrl"),
  xpReward: int("xpReward").default(0).notNull(),
  publicationStatus: mysqlEnum("publicationStatus", ["draft", "review", "approved", "published", "archived"]).default("draft").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  authorUserId: int("authorUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("courses_subject_index").on(table.subjectId)]);

export const units = mysqlTable("units", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  descriptionAr: text("descriptionAr"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("units_course_index").on(table.courseId)]);

export const contentItems = mysqlTable("content_items", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId"),
  unitId: int("unitId"),
  subjectId: int("subjectId").notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  type: mysqlEnum("type", ["lesson", "activity", "quiz", "story", "game", "project", "challenge", "assessment", "video", "audio", "pdf", "simulation"]).notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  descriptionAr: text("descriptionAr").notNull(),
  body: json("body").$type<Array<{ heading: string; body: string; note?: string }>>(),
  minAge: int("minAge").notNull(),
  maxAge: int("maxAge").notNull(),
  level: mysqlEnum("level", ["explorer", "foundation", "builder", "future_ready"]).notNull(),
  skills: json("skills").$type<string[]>().notNull(),
  durationMinutes: int("durationMinutes").default(0).notNull(),
  xpReward: int("xpReward").default(0).notNull(),
  coverUrl: text("coverUrl"),
  media: json("media").$type<Array<{ type: string; url: string; captionsUrl?: string }>>(),
  quiz: json("quiz").$type<{ prompt: string; options: string[]; correctIndex: number; hint: string; explanation: string }>(),
  isReligious: boolean("isReligious").default(false).notNull(),
  publicationStatus: mysqlEnum("publicationStatus", ["draft", "review", "approved", "published", "archived"]).default("draft").notNull(),
  publishAt: timestamp("publishAt"),
  sortOrder: int("sortOrder").default(0).notNull(),
  authorUserId: int("authorUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("content_subject_age_status_index").on(table.subjectId, table.minAge, table.publicationStatus), index("content_course_index").on(table.courseId)]);

export const contentSources = mysqlTable("content_sources", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  sourceType: mysqlEnum("sourceType", ["quran", "hadith", "seerah", "book", "article", "curriculum", "other"]).notNull(),
  citation: text("citation").notNull(),
  url: text("url"),
  hadithGrade: varchar("hadithGrade", { length: 100 }),
  reviewerName: varchar("reviewerName", { length: 160 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const contentSourceLinks = mysqlTable("content_source_links", {
  id: int("id").autoincrement().primaryKey(),
  contentItemId: int("contentItemId").notNull(),
  sourceId: int("sourceId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [uniqueIndex("content_source_link_unique").on(table.contentItemId, table.sourceId)]);

export const contentReviews = mysqlTable("content_reviews", {
  id: int("id").autoincrement().primaryKey(),
  contentItemId: int("contentItemId").notNull(),
  reviewerUserId: int("reviewerUserId").notNull(),
  reviewType: mysqlEnum("reviewType", ["editorial", "islamic", "safety", "curriculum"]).notNull(),
  status: mysqlEnum("status", ["requested", "changes_requested", "approved", "rejected"]).default("requested").notNull(),
  notes: text("notes"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("content_reviews_content_index").on(table.contentItemId)]);

export const skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 150 }).notNull().unique(),
  titleAr: varchar("titleAr", { length: 160 }).notNull(),
  subjectId: int("subjectId").notNull(),
  descriptionAr: text("descriptionAr"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const childProgress = mysqlTable("child_progress", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  contentItemId: int("contentItemId").notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed", "review_needed"]).default("not_started").notNull(),
  score: int("score"),
  attempts: int("attempts").default(0).notNull(),
  timeSpentSeconds: int("timeSpentSeconds").default(0).notNull(),
  completedAt: timestamp("completedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("child_progress_unique").on(table.childId, table.contentItemId), index("child_progress_child_status_index").on(table.childId, table.status)]);

export const skillMastery = mysqlTable("skill_mastery", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  skillId: int("skillId").notNull(),
  status: mysqlEnum("status", ["not_started", "learning", "developing", "mastered", "review_needed"]).default("not_started").notNull(),
  score: int("score").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("skill_mastery_unique").on(table.childId, table.skillId)]);

export const rewards = mysqlTable("rewards", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  kind: mysqlEnum("kind", ["xp", "star", "coin", "badge", "achievement"]).notNull(),
  amount: int("amount").default(0).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  contentItemId: int("contentItemId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("rewards_child_created_index").on(table.childId, table.createdAt)]);

export const parentalControls = mysqlTable("parental_controls", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  dailyMinutesLimit: int("dailyMinutesLimit").default(45).notNull(),
  aiEnabled: boolean("aiEnabled").default(false).notNull(),
  aiMinutesLimit: int("aiMinutesLimit").default(0).notNull(),
  notificationsEnabled: boolean("notificationsEnabled").default(true).notNull(),
  allowedSubjects: json("allowedSubjects").$type<string[]>(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("parental_controls_child_unique").on(table.childId)]);

export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  contentItemId: int("contentItemId"),
  certificateType: mysqlEnum("certificateType", ["course", "achievement", "project"]).notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  verificationCode: varchar("verificationCode", { length: 80 }).notNull().unique(),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
});

export const featureFlags = mysqlTable("feature_flags", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  enabled: boolean("enabled").default(false).notNull(),
  description: text("description"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  actorUserId: int("actorUserId"),
  action: varchar("action", { length: 160 }).notNull(),
  entityType: varchar("entityType", { length: 100 }).notNull(),
  entityId: varchar("entityId", { length: 100 }),
  oldValue: json("oldValue"),
  newValue: json("newValue"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("audit_logs_entity_index").on(table.entityType, table.entityId)]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type ChildProfile = typeof childProfiles.$inferSelect;
export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = typeof contentItems.$inferInsert;
