export type ChildAgeBand = "4_6" | "7_9" | "10_12" | "13_15";

const personalDataPatterns = [
  /\b\d{7,}\b/,
  /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/,
  /(عنواني|رقم هاتفي|كلمة المرور|موقعي|مدرستي هي|my address|my password|phone number)/i,
];

const highRiskPatterns = [
  /(محتوى جنسي|صور عارية|عنف شديد|اصنع سلاح|إيذاء نفسي|انتحار|مخدرات|hack|اختراق حساب|steal password)/i,
];

const religiousPatterns = [/(فتوى|حلال|حرام|هل يجوز|حديث|تفسير|القرآن|السنة|الصلاة|الوضوء)/i];

export function getSafetyDecision(question: string) {
  const cleaned = question.trim();
  if (!cleaned) return { allowed: false, reply: "اكتب سؤالًا قصيرًا عن درس أو مهارة، وسأحاول مساعدتك بطريقة آمنة." };
  if (personalDataPatterns.some((pattern) => pattern.test(cleaned))) return { allowed: false, reply: "لأمانك، لا تكتب بياناتك الخاصة مثل الاسم الكامل أو العنوان أو رقم الهاتف أو كلمة المرور. يمكنك أن تسأل السؤال من دون هذه المعلومات." };
  if (highRiskPatterns.some((pattern) => pattern.test(cleaned))) return { allowed: false, reply: "لا أستطيع المساعدة في هذا النوع من المحتوى. إذا جعلك شيء ما غير مرتاح، أخبر ولي أمرك أو شخصًا بالغًا موثوقًا الآن." };
  if (religiousPatterns.some((pattern) => pattern.test(cleaned))) return { allowed: false, reply: "في الأسئلة الدينية، عالم تالين لا يجعل المساعد مصدرًا شرعيًا. افتح الدرس المراجع في أكاديمية تالين الإسلامية، أو اسأل ولي أمرك أو معلمًا مؤهلًا." };
  return { allowed: true as const };
}

export function getAgeLanguage(ageBand: ChildAgeBand) {
  return ageBand === "4_6" ? "استخدم جملًا شديدة القصر ومفردات محسوسة، ولا تزيد عن 80 كلمة." : ageBand === "7_9" ? "استخدم شرحًا بسيطًا في فقرات قصيرة، ولا تزيد عن 120 كلمة." : ageBand === "10_12" ? "استخدم شرحًا واضحًا مع مثال صغير وخطوة عملية، ولا تزيد عن 160 كلمة." : "استخدم شرحًا دقيقًا ومختصرًا مع مثال وخطوة للتحقق، ولا تزيد عن 180 كلمة.";
}
