import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { createAudioPlayer, setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ProgressBar, uiStyles } from "@/components/taleen-ui";
import { getLesson } from "@/lib/taleen-content";
import { useTaleen } from "@/lib/taleen-store";

const QURAN_ART = "/manus-storage/taleen-quran-corner_282c1d46.png";
const MATH_ART = "/manus-storage/taleen-math-island_92815105.png";
const CELEBRATION_ART = "/manus-storage/taleen-celebration-stars_d9862661.png";
const MATH_COUNT_AUDIO = require("../../../assets/audio/math-count-lesson.wav");
const MATH_ADDITION_AUDIO = require("../../../assets/audio/math-addition-lesson.wav");
const MATH_SUBTRACTION_AUDIO = require("../../../assets/audio/math-subtraction-lesson.wav");
const MATH_MULTIPLICATION_AUDIO = require("../../../assets/audio/math-multiplication-lesson.wav");
const QURAN_FATIHA_AUDIO = require("../../../assets/audio/quran-fatiha-lesson.wav");
const QURAN_SHORT_AUDIO = require("../../../assets/audio/quran-short-lesson.wav");

function lessonAudioSource(id: string, zone: string): number | null {
  if (id === "math-count-4-6" || id === "math-compare-4-6" || id === "math-shapes") return MATH_COUNT_AUDIO;
  if (id === "math-addition" || id === "math-money-7-9") return MATH_ADDITION_AUDIO;
  if (id === "math-subtraction") return MATH_SUBTRACTION_AUDIO;
  if (id === "math-multiplication" || id === "math-division-10-12") return MATH_MULTIPLICATION_AUDIO;
  if (id === "quran-fatiha") return QURAN_FATIHA_AUDIO;
  if (zone === "quran") return QURAN_SHORT_AUDIO;
  return null;
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, completeLesson, toggleFavorite } = useTaleen();
  const item = state.customLessons.find((candidate) => candidate.id === id) ?? getLesson(id);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [finished, setFinished] = useState(Boolean(state.lessonRecords[item.id]?.completed));
  const successPlayer = useAudioPlayer(require("../../../assets/audio/success.wav"));
  const teachingPlayerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const isQuiz = page === item.pages.length;
  const totalSteps = item.pages.length + 1;
  const score = selected === item.quiz.correctIndex ? 1 : 0;
  const art = item.zone === "quran" || item.zone === "islamic" ? QURAN_ART : item.zone === "math" ? MATH_ART : null;
  const teachingAudio = lessonAudioSource(item.id, item.zone);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true });
    return () => { teachingPlayerRef.current?.remove(); };
  }, []);
  const playTeachingAudio = () => {
    if (!teachingAudio) return;
    teachingPlayerRef.current?.remove();
    const player = createAudioPlayer(teachingAudio);
    teachingPlayerRef.current = player;
    player.play();
  };

  const next = () => {
    if (!isQuiz) { setPage((value) => value + 1); return; }
    if (selected === null) return;
    completeLesson(item.id, score);
    if (score) { successPlayer.seekTo(0); successPlayer.play(); }
    setFinished(true);
  };

  return <ScreenContainer className="flex-1" containerClassName="bg-background">
    <View style={styles.nav}>
      <Pressable accessibilityRole="button" accessibilityLabel="العودة" onPress={() => router.back()} style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}><MaterialIcons name="arrow-forward" size={23} color="#3D3D5A" /></Pressable>
      <Text numberOfLines={1} style={styles.navTitle}>{item.subject}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="المفضلة" onPress={() => toggleFavorite(item.id)} style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}><MaterialIcons name={state.favorites.includes(item.id) ? "favorite" : "favorite-border"} size={22} color={state.favorites.includes(item.id) ? "#E85D75" : "#3D3D5A"} /></Pressable>
    </View>
    <View style={styles.progressBlock}><View style={styles.progressLabels}><Text style={styles.stepText}>{Math.min(page + 1, totalSteps)} من {totalSteps}</Text><Text style={styles.typeText}>{isQuiz ? "اختبر فهمك" : "نتعلم معًا"}</Text></View><ProgressBar value={((page + 1) / totalSteps) * 100} color={item.color} /></View>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      {art ? <View style={styles.artFrame}><Image source={{ uri: art }} style={styles.art} resizeMode="cover" /><View style={[styles.artBadge, { backgroundColor: item.color }]}><MaterialIcons name={isQuiz ? "quiz" : item.icon as keyof typeof MaterialIcons.glyphMap} size={26} color="#FFFFFF" /></View></View> : <View style={[styles.heroIcon, { backgroundColor: `${item.color}18` }]}><MaterialIcons name={isQuiz ? "quiz" : item.icon as keyof typeof MaterialIcons.glyphMap} size={39} color={item.color} /></View>}
      {!isQuiz && teachingAudio ? <Pressable accessibilityRole="button" accessibilityLabel="استمع إلى شرح الدرس" onPress={playTeachingAudio} style={({ pressed }) => [styles.audioPrompt, pressed && styles.pressed]}><MaterialIcons name="volume-up" size={20} color="#4B4697" /><Text style={styles.audioPromptText}>استمع إلى شرح الدرس</Text></Pressable> : null}
      {!isQuiz ? <LessonPage item={item} page={page} /> : <QuizPage item={item} selected={selected} setSelected={setSelected} hintOpen={hintOpen} setHintOpen={setHintOpen} finished={finished} />}
      {!isQuiz ? <View style={styles.activityCard}><View style={styles.activityIcon}><MaterialIcons name="lightbulb" size={22} color="#E19300" /></View><View style={styles.activityCopy}><Text style={styles.activityTitle}>تطبيق صغير</Text><Text style={styles.activityText}>{item.activity}</Text></View></View> : null}
      {item.reviewed && item.source ? <View style={styles.sourceCard}><MaterialIcons name="verified" size={19} color="#138A6A" /><View style={styles.sourceCopy}><Text style={styles.sourceTitle}>المصدر والمراجعة</Text><Text style={styles.sourceText}>{item.source}</Text></View></View> : null}
      {finished ? <View style={styles.successCard}>{score ? <Image source={{ uri: CELEBRATION_ART }} style={styles.successArt} resizeMode="contain" /> : <View style={styles.successIcon}><MaterialIcons name="workspace-premium" size={33} color="#D68B00" /></View>}<Text style={styles.successTitle}>{score ? "أحسنت يا بطل!" : "أحسنت المحاولة!"}</Text><Text style={styles.successBody}>{score ? "اجتزت هذا الدرس وحصلت على نجوم جديدة. هيا نكمل خطوة صغيرة أخرى." : "كل محاولة تساعدك على الفهم أكثر. راجع الدرس أو جرّب درسًا جديدًا."}</Text><Pressable accessibilityRole="button" onPress={() => router.replace("/")} style={({ pressed }) => [uiStyles.primaryButton, styles.fullButton, pressed && styles.pressed]}><MaterialIcons name="home" size={18} color="#FFFFFF" /><Text style={uiStyles.primaryButtonText}>العودة إلى عالمي</Text></Pressable></View> : <Pressable accessibilityRole="button" onPress={next} disabled={isQuiz && selected === null} style={({ pressed }) => [uiStyles.primaryButton, styles.fullButton, (isQuiz && selected === null) && styles.disabled, pressed && styles.pressed]}><Text style={uiStyles.primaryButtonText}>{isQuiz ? "إنهاء الدرس" : "التالي"}</Text><MaterialIcons name="arrow-back" size={19} color="#FFFFFF" /></Pressable>}
    </ScrollView>
  </ScreenContainer>;
}

function LessonPage({ item, page }: { item: ReturnType<typeof getLesson>; page: number }) {
  const current = item.pages[page];
  const stepLabel = page === 0 ? "1. نتعلم الفكرة" : page === 1 ? "2. نشاهد مثالًا" : "3. نتدرّب";
  const isMath = item.zone === "math";
  const isQuran = item.zone === "quran";
  return <View><Text style={styles.eyebrow}>{stepLabel}</Text><Text style={styles.lessonTitle}>{item.title}</Text>{isMath ? <MathExample lessonId={item.id} page={page} /> : null}{isQuran && page === 0 ? <View style={styles.quranGuide}><MaterialIcons name="headphones" size={21} color="#168A7A" /><Text style={styles.quranGuideText}>اضغط «استمع إلى شرح الدرس»، ثم اقرأ مقطعًا صغيرًا ببطء مع معلمك أو ولي أمرك. الاختبار لا يظهر إلا بعد إكمال الدرس.</Text></View> : null}<Text style={styles.pageHeading}>{current.heading}</Text>{isQuran && page === 0 ? <QuranReading lessonId={item.id} fallback={current.body} /> : <Text style={styles.pageBody}>{current.body}</Text>}{current.note ? <View style={styles.note}><MaterialIcons name="info-outline" size={18} color="#5B4FE8" /><Text style={styles.noteText}>{current.note}</Text></View> : null}</View>;
}

function QuranReading({ lessonId, fallback }: { lessonId: string; fallback: string }) {
  const pieces: Record<string, string[]> = {
    "quran-fatiha": ["بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "الرَّحْمَٰنِ الرَّحِيمِ"],
    "quran-kawthar": ["إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", "فَصَلِّ لِرَبِّكَ وَانْحَرْ", "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ"],
    "quran-asr": ["وَالْعَصْرِ", "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ"],
  };
  const lines = pieces[lessonId] ?? [fallback];
  return <View style={styles.quranReading}>{lines.map((line) => <Text key={line} style={styles.ayahLine}>{line}</Text>)}<Text style={styles.quranTip}>نقرأ سطرًا واحدًا، ثم نتوقف ونكرره بهدوء.</Text></View>;
}

function MathExample({ lessonId, page }: { lessonId: string; page: number }) {
  const visual = lessonId.includes("subtraction") ? "🍎 🍎 🍎 🍎 🍎  −  🍎 🍎  =  🍎 🍎 🍎" : lessonId.includes("multiplication") ? "★★   ★★   ★★" : lessonId.includes("addition") || lessonId.includes("money") ? "★★  +  ★  =  ★★★" : lessonId.includes("count") || lessonId.includes("compare") ? "★  ★  ★  ★  ★" : "●  ●  ●";
  const title = page === 0 ? "انظر إلى المثال" : page === 1 ? "عدّ معي ببطء" : "جرّب بأصابعك";
  return <View style={styles.mathExample}><Text style={styles.mathExampleTitle}>{title}</Text><Text style={styles.mathSymbols}>{visual}</Text></View>;
}

function QuizPage({ item, selected, setSelected, hintOpen, setHintOpen, finished }: { item: ReturnType<typeof getLesson>; selected: number | null; setSelected: (value: number) => void; hintOpen: boolean; setHintOpen: (value: boolean) => void; finished: boolean }) {
  return <View><Text style={styles.eyebrow}>اختبار لطيف</Text><Text style={styles.lessonTitle}>هل أنت مستعد؟</Text><Text style={styles.question}>{item.quiz.prompt}</Text><View style={styles.options}>{item.quiz.options.map((option, index) => {
    const isSelected = selected === index;
    const isCorrect = index === item.quiz.correctIndex;
    const resolved = finished && isSelected;
    const backgroundColor = resolved ? (isCorrect ? "#E8FAF2" : "#FFF1F3") : isSelected ? "#F0EFFF" : "#FFFFFF";
    const borderColor = resolved ? (isCorrect ? "#138A6A" : "#D94B66") : isSelected ? "#5B4FE8" : "#E7E8F6";
    return <Pressable key={option} accessibilityRole="radio" accessibilityState={{ checked: isSelected }} disabled={finished} onPress={() => setSelected(index)} style={({ pressed }) => [styles.option, { backgroundColor, borderColor }, pressed && styles.pressed]}><View style={[styles.optionMarker, { borderColor }, isSelected && { backgroundColor: isCorrect && finished ? "#138A6A" : "#5B4FE8" }]}>{isSelected ? <MaterialIcons name={isCorrect && finished ? "check" : "circle"} size={14} color="#FFFFFF" /> : null}</View><Text style={styles.optionText}>{option}</Text></Pressable>;
  })}</View><Pressable accessibilityRole="button" onPress={() => setHintOpen(!hintOpen)} style={({ pressed }) => [styles.hintButton, pressed && styles.pressed]}><MaterialIcons name="lightbulb" size={18} color="#A06A00" /><Text style={styles.hintText}>{hintOpen ? item.quiz.hint : "هل تريد تلميحًا؟"}</Text></Pressable>{finished ? <View style={[styles.feedback, { backgroundColor: selected === item.quiz.correctIndex ? "#E8FAF2" : "#FFF7E5" }]}><Text style={styles.feedbackText}>{selected === item.quiz.correctIndex ? item.quiz.explanation : `اقتربت! ${item.quiz.explanation}`}</Text></View> : null}</View>;
}

const styles = StyleSheet.create({
  nav: { paddingHorizontal: 20, paddingTop: 7, paddingBottom: 13, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  navButton: { width: 42, height: 42, borderRadius: 15, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E7E8F6", alignItems: "center", justifyContent: "center" },
  navTitle: { color: "#3D3D5A", fontSize: 14, fontWeight: "800", maxWidth: "60%", textAlign: "center" },
  progressBlock: { paddingHorizontal: 20, gap: 8 },
  progressLabels: { flexDirection: "row", justifyContent: "space-between" },
  stepText: { color: "#5B4FE8", fontSize: 12, fontWeight: "800" }, typeText: { color: "#75758D", fontSize: 12, fontWeight: "700" },
  content: { padding: 20, paddingTop: 26, paddingBottom: 38, gap: 20 },
  heroIcon: { width: 74, height: 74, borderRadius: 27, alignItems: "center", justifyContent: "center", alignSelf: "flex-end" }, artFrame: { height: 145, borderRadius: 23, overflow: "hidden", position: "relative" }, art: { width: "100%", height: "100%" }, artBadge: { width: 53, height: 53, borderRadius: 18, alignItems: "center", justifyContent: "center", position: "absolute", right: 13, bottom: 13, elevation: 2 }, audioPrompt: { alignSelf: "flex-end", flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 13, borderRadius: 13, backgroundColor: "#F0EFFF" }, audioPromptText: { color: "#4B4697", fontSize: 12, fontWeight: "900" },
  eyebrow: { color: "#75758D", fontWeight: "800", fontSize: 12, textAlign: "right" },
  lessonTitle: { color: "#1B1B3A", fontWeight: "900", fontSize: 26, lineHeight: 36, textAlign: "right", marginTop: 7 },
  mathExample: { backgroundColor: "#FFF7E4", borderRadius: 19, padding: 15, marginTop: 16, alignItems: "center" }, mathExampleTitle: { color: "#9A6200", fontWeight: "900", fontSize: 13, alignSelf: "flex-end" }, mathSymbols: { color: "#554A32", fontSize: 22, lineHeight: 35, fontWeight: "900", textAlign: "center", marginTop: 5 }, quranGuide: { flexDirection: "row-reverse", gap: 9, padding: 13, alignItems: "flex-start", backgroundColor: "#EAF9F5", borderRadius: 16, marginTop: 16 }, quranGuideText: { flex: 1, color: "#216B60", lineHeight: 20, fontSize: 12, fontWeight: "700", textAlign: "right" }, quranReading: { gap: 8, padding: 16, marginTop: 14, borderRadius: 19, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D5EFE7" }, ayahLine: { color: "#245B54", fontSize: 18, fontWeight: "800", lineHeight: 31, textAlign: "right" }, quranTip: { color: "#5D857E", fontSize: 12, fontWeight: "700", lineHeight: 19, textAlign: "right", borderTopWidth: 1, borderTopColor: "#E6F3EF", paddingTop: 9, marginTop: 4 }, pageHeading: { color: "#454161", fontWeight: "900", fontSize: 19, lineHeight: 27, textAlign: "right", marginTop: 20 },
  pageBody: { color: "#474761", fontSize: 16, lineHeight: 28, textAlign: "right", marginTop: 10 },
  note: { flexDirection: "row-reverse", gap: 9, borderRadius: 15, backgroundColor: "#F0EFFF", padding: 13, marginTop: 18, alignItems: "flex-start" },
  noteText: { flex: 1, color: "#504BA2", fontSize: 13, lineHeight: 21, textAlign: "right" },
  activityCard: { flexDirection: "row-reverse", gap: 11, backgroundColor: "#FFF8E7", borderRadius: 18, padding: 14, alignItems: "flex-start" },
  activityIcon: { width: 35, height: 35, borderRadius: 12, backgroundColor: "#FFF0BE", alignItems: "center", justifyContent: "center" },
  activityCopy: { flex: 1 }, activityTitle: { color: "#8F5B00", fontWeight: "900", fontSize: 14, textAlign: "right" }, activityText: { color: "#725C30", fontSize: 13, lineHeight: 21, textAlign: "right", marginTop: 3 },
  sourceCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 8, padding: 13, borderRadius: 16, backgroundColor: "#F0FBF7", borderWidth: 1, borderColor: "#D6F2E7" },
  sourceCopy: { flex: 1 }, sourceTitle: { color: "#107154", fontWeight: "900", fontSize: 13, textAlign: "right" }, sourceText: { color: "#347361", fontSize: 12, lineHeight: 19, textAlign: "right", marginTop: 3 },
  fullButton: { width: "100%", minHeight: 53 }, disabled: { opacity: 0.45 },
  question: { color: "#3D3D5A", fontSize: 17, fontWeight: "700", lineHeight: 27, textAlign: "right", marginTop: 22 },
  options: { gap: 10, marginTop: 17 }, option: { borderWidth: 1.5, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 13, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  optionMarker: { width: 23, height: 23, borderRadius: 12, borderWidth: 1.5, alignItems: "center", justifyContent: "center" }, optionText: { flex: 1, color: "#34344F", fontSize: 15, fontWeight: "700", textAlign: "right" },
  hintButton: { flexDirection: "row-reverse", alignSelf: "flex-end", alignItems: "center", gap: 6, padding: 11, marginTop: 12, borderRadius: 13, backgroundColor: "#FFF8E7" }, hintText: { color: "#8F5B00", fontWeight: "800", fontSize: 12 },
  feedback: { padding: 14, borderRadius: 15, marginTop: 12 }, feedbackText: { color: "#40504A", fontSize: 13, lineHeight: 21, fontWeight: "700", textAlign: "right" },
  successCard: { alignItems: "center", padding: 22, backgroundColor: "#FFFFFF", borderRadius: 23, borderWidth: 1, borderColor: "#E7E8F6" },
  successIcon: { width: 62, height: 62, borderRadius: 24, backgroundColor: "#FFF5D7", alignItems: "center", justifyContent: "center" }, successArt: { width: 116, height: 116 }, successTitle: { color: "#1B1B3A", fontSize: 22, fontWeight: "900", marginTop: 8 }, successBody: { color: "#62627E", fontSize: 14, lineHeight: 22, textAlign: "center", marginTop: 7, marginBottom: 17 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
