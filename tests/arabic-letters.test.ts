import { describe, expect, it } from "vitest";
import { arabicLetters, getLetterQuizChoices } from "../lib/arabic-letters";

describe("رحلة الحروف الهجائية", () => {
  it("تضم الحروف العربية الثمانية والعشرين بترتيب يبدأ بألف وينتهي بياء", () => {
    expect(arabicLetters).toHaveLength(28);
    expect(arabicLetters[0]).toMatchObject({ letter: "أ", word: "أرنب" });
    expect(arabicLetters.at(-1)).toMatchObject({ letter: "ي", word: "يد" });
  });

  it("لا يكرر حرفًا أو كلمة ضمن البطاقات", () => {
    expect(new Set(arabicLetters.map((item) => item.letter)).size).toBe(28);
    expect(new Set(arabicLetters.map((item) => item.word)).size).toBe(28);
  });

  it("يضع كلمة الحرف الصحيح ضمن اختيارات الاختبار", () => {
    const target = arabicLetters[4];
    expect(getLetterQuizChoices(4)).toContain(target.word);
  });
});
