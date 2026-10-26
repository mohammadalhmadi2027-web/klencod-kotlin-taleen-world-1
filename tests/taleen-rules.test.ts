import { describe, expect, it } from "vitest";
import { calculateDailyProgress, calculateLessonReward, isAgeAppropriate } from "../lib/taleen-rules";

describe("قواعد عالم تالين التعليمية", () => {
  it("يمنح المكافأة مرة واحدة عند إكمال درس جديد", () => {
    expect(calculateLessonReward(40, false)).toEqual({ xp: 40, stars: 2, coins: 3 });
    expect(calculateLessonReward(40, true)).toEqual({ xp: 0, stars: 0, coins: 0 });
  });

  it("يحد تقدم الهدف اليومي بين صفر ومئة", () => {
    expect(calculateDailyProgress(1, 2)).toBe(50);
    expect(calculateDailyProgress(8, 2)).toBe(100);
    expect(calculateDailyProgress(0, 2)).toBe(0);
  });

  it("يتحقق من ملاءمة المحتوى لعمر الطفل", () => {
    expect(isAgeAppropriate(7, 9, 8)).toBe(true);
    expect(isAgeAppropriate(7, 9, 10)).toBe(false);
  });
});
