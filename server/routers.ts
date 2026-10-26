import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM, listLLMModels } from "./_core/llm";
import * as db from "./db";
import { getAgeLanguage, getSafetyDecision } from "./taleen-ai-safety";

const ageBandSchema = z.enum(["4_6", "7_9", "10_12", "13_15"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  content: router({
    catalog: publicProcedure.input(z.object({ age: z.number().int().min(4).max(15).optional(), subjectId: z.number().int().positive().optional(), limit: z.number().int().min(1).max(100).optional() }).optional()).query(({ input }) => db.listPublishedContent(input)),
  }),
  children: router({
    list: protectedProcedure.query(({ ctx }) => db.listChildrenForUser(ctx.user.id)),
    create: protectedProcedure.input(z.object({ nickname: z.string().trim().min(2).max(80), ageBand: ageBandSchema, interests: z.array(z.string().trim().min(1).max(60)).max(12), avatarKey: z.string().trim().max(120).optional() })).mutation(({ ctx, input }) => db.createChildForUser({ userId: ctx.user.id, ...input })),
  }),
  progress: router({
    record: protectedProcedure.input(z.object({ childId: z.number().int().positive(), contentItemId: z.number().int().positive(), score: z.number().int().min(0).max(100).optional(), timeSpentSeconds: z.number().int().min(0).max(14400).optional(), status: z.enum(["in_progress", "completed", "review_needed"]) })).mutation(({ ctx, input }) => db.recordChildProgress({ userId: ctx.user.id, ...input })),
  }),
  taleenAi: router({
    ask: publicProcedure.input(z.object({ question: z.string().trim().min(1).max(600), ageBand: ageBandSchema })).mutation(async ({ input }) => {
      const decision = getSafetyDecision(input.question);
      if (!decision.allowed) return { reply: decision.reply, status: "redirected" as const };
      const { data: models } = await listLLMModels();
      const model = models.find((item) => item.id === "gpt-5-mini")?.id ?? models[0]?.id;
      if (!model) return { reply: "المساعد غير متاح الآن. يمكنك اختيار درس من المكتبة أو سؤال ولي أمرك.", status: "unavailable" as const };
      try {
        const response = await invokeLLM({
          model,
          maxTokens: 350,
          messages: [
            { role: "system", content: `أنت «مساعد تالين»، مساعد تعليمي عربي مقيد بالسلامة للأطفال. ${getAgeLanguage(input.ageBand)} اشرح المفهوم فقط، ثم قدم سؤالًا صغيرًا أو خطوة عملية واحدة. لا تطلب ولا تكرر بيانات شخصية، ولا تقترح تواصلًا خارجيًا، ولا تدّعي أنك إنسان أو صديق حميم. ارفض المحتوى الجنسي أو العنيف أو الخطر أو المتعلق بالاختراق أو التنمر، ووجّه الطفل إلى بالغ موثوق. لا تجب عن الفتاوى أو تفسير القرآن أو الحديث أو الأحكام الدينية؛ قل إن المحتوى الديني يحتاج إلى درس مراجع وولي أمر أو معلم مؤهل. لا تؤد واجبات الطفل كاملة؛ أعط تلميحًا وخطوة تعلم. لا تستخدم أكثر من رمزين نقطيين إن لزم.` },
            { role: "user", content: input.question },
          ],
        });
        const rawReply = response.choices[0]?.message?.content;
        const reply = typeof rawReply === "string" ? rawReply.trim() : "";
        return { reply: reply || "لم أتمكن من صياغة إجابة الآن. جرّب سؤالًا أقصر عن الدرس.", status: "answered" as const };
      } catch {
        return { reply: "المساعد يحتاج إلى استراحة قصيرة. يمكنك العودة إلى الدرس أو المحاولة لاحقًا.", status: "unavailable" as const };
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
