import { describe, expect, it } from "vitest";
import { getSafetyDecision } from "../server/taleen-ai-safety";

describe("ضوابط مساعد تالين", () => {
  it("يحجب البيانات الشخصية", () => {
    const result = getSafetyDecision("رقم هاتفي 0501234567، ساعدني في واجبي");
    expect(result.allowed).toBe(false);
    expect(result.reply).toContain("بياناتك الخاصة");
  });

  it("يحيل السؤال الديني إلى المحتوى المراجع", () => {
    const result = getSafetyDecision("هل يجوز أن أفعل كذا؟");
    expect(result.allowed).toBe(false);
    expect(result.reply).toContain("مصدرًا شرعيًا");
  });

  it("يسمح بسؤال تعليمي آمن", () => {
    expect(getSafetyDecision("اشرح لي دورة الماء").allowed).toBe(true);
  });
});
