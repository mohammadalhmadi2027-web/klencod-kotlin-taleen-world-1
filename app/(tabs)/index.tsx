import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { router } from "expo-router";
import { useEffect } from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useTaleen } from "@/lib/taleen-store";

const WELCOME_GARDEN = "/manus-storage/taleen-welcome-garden_d2bad846.png";
const QURAN_CORNER = "/manus-storage/taleen-quran-corner_282c1d46.png";
const MATH_ISLAND = "/manus-storage/taleen-math-island_92815105.png";

export default function HomeScreen() {
  const { state } = useTaleen();
  const welcomePlayer = useAudioPlayer(require("../../assets/audio/welcome.wav"));

  useEffect(() => { void setAudioModeAsync({ playsInSilentMode: true }); }, []);
  const welcome = () => { welcomePlayer.seekTo(0); welcomePlayer.play(); };
  const openLesson = (id: string) => { welcome(); router.push(`/learn/${id}` as never); };

  return <ScreenContainer className="flex-1" containerClassName="bg-background">
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <ImageBackground source={{ uri: WELCOME_GARDEN }} imageStyle={styles.heroImage} style={styles.hero}>
        <View style={styles.heroShade} />
        <View style={styles.heroTop}><Pressable accessibilityRole="button" accessibilityLabel="ولي الأمر" onPress={() => router.push("/parent" as never)} style={({ pressed }) => [styles.parentButton, pressed && styles.pressed]}><MaterialIcons name="family-restroom" size={21} color="#4B4697" /></Pressable><Pressable accessibilityRole="button" accessibilityLabel="استمع إلى الترحيب" onPress={welcome} style={({ pressed }) => [styles.listenButton, pressed && styles.pressed]}><MaterialIcons name="volume-up" size={20} color="#FFFFFF" /><Text style={styles.listenText}>اسمع الترحيب</Text></Pressable></View>
        <View style={styles.heroWords}><Text style={styles.hello}>مرحبًا يا {state.childName}</Text><Text style={styles.heroTitle}>اختر درسًا واحدًا فقط</Text><Text style={styles.heroHint}>استمع، تعلّم، ثم جرّب بهدوء.</Text></View>
      </ImageBackground>

      <Text style={styles.chooseTitle}>ماذا نبدأ اليوم؟</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="ابدأ رحلة القرآن" onPress={() => openLesson("quran-fatiha") } style={({ pressed }) => [styles.bigCard, pressed && styles.pressed]}>
        <ImageBackground source={{ uri: QURAN_CORNER }} style={styles.cardImage} imageStyle={styles.cardImageRadius}><View style={styles.cardOverlay} /><View style={styles.cardCopy}><View style={styles.cardChip}><MaterialIcons name="menu-book" size={18} color="#FFFFFF" /><Text style={styles.chipText}>رحلة القرآن</Text></View><Text style={styles.cardTitle}>سور قصيرة وقصص لطيفة</Text><Text style={styles.cardBody}>نقرأ آية، نفهم معنى بسيطًا، ثم نجيب عن سؤال صغير.</Text><View style={styles.startButton}><Text style={styles.startText}>ابدأ القرآن</Text><MaterialIcons name="arrow-back" size={18} color="#174B4A" /></View></View></ImageBackground>
      </Pressable>

      <Pressable accessibilityRole="button" accessibilityLabel="ابدأ مدينة الرياضيات" onPress={() => openLesson("math-count-4-6") } style={({ pressed }) => [styles.bigCard, pressed && styles.pressed]}>
        <ImageBackground source={{ uri: MATH_ISLAND }} style={styles.cardImage} imageStyle={styles.cardImageRadius}><View style={[styles.cardOverlay, styles.mathOverlay]} /><View style={styles.cardCopy}><View style={styles.cardChip}><MaterialIcons name="calculate" size={18} color="#FFFFFF" /><Text style={styles.chipText}>مدينة الرياضيات</Text></View><Text style={styles.cardTitle}>عدّ، أشكال، وحلول ممتعة</Text><Text style={styles.cardBody}>اختر ما يناسب عمرك وابدأ بخطوة واحدة سهلة.</Text><View style={styles.startButton}><Text style={styles.startText}>ابدأ الرياضيات</Text><MaterialIcons name="arrow-back" size={18} color="#174B4A" /></View></View></ImageBackground>
      </Pressable>

      <Pressable accessibilityRole="button" accessibilityLabel="ابدأ رحلة الحروف" onPress={() => { welcome(); router.push("/letters" as never); }} style={({ pressed }) => [styles.lettersCard, pressed && styles.pressed]}><View style={styles.lettersSparkles}><Text style={styles.lettersEmoji}>أ ب ت</Text></View><View style={styles.lettersCopy}><Text style={styles.lettersTitle}>رحلة الحروف</Text><Text style={styles.lettersBody}>الحرف، صورته، صوته، ثم اختبار صغير.</Text><Text style={styles.lettersProgress}>{state.lettersCompleted.length} من 28 حرفًا</Text></View><MaterialIcons name="arrow-back" size={22} color="#4B4697" /></Pressable>

      <Pressable accessibilityRole="button" accessibilityLabel="شاهد كل الدروس" onPress={() => router.push("/explore" as never)} style={({ pressed }) => [styles.libraryCard, pressed && styles.pressed]}><View style={styles.libraryIcon}><MaterialIcons name="auto-stories" size={29} color="#5B4FE8" /></View><View style={styles.libraryCopy}><Text style={styles.libraryTitle}>كل الدروس</Text><Text style={styles.libraryText}>قصص، لغة، علوم، أخلاق، وأكثر.</Text></View><MaterialIcons name="arrow-back" size={22} color="#5B4FE8" /></Pressable>
      <Text style={styles.footer}>عالم تالين مساحة هادئة. تستطيع طلب مساعدة ولي أمرك في أي وقت.</Text>
    </ScrollView>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32, gap: 15 }, hero: { minHeight: 254, borderRadius: 28, overflow: "hidden", justifyContent: "space-between", padding: 16 }, heroImage: { borderRadius: 28 }, heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(22, 30, 74, 0.16)" }, heroTop: { flexDirection: "row", justifyContent: "space-between", zIndex: 1 }, parentButton: { width: 43, height: 43, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.94)", alignItems: "center", justifyContent: "center" }, listenButton: { flexDirection: "row-reverse", alignItems: "center", gap: 6, backgroundColor: "rgba(75,70,151,0.92)", borderRadius: 15, paddingHorizontal: 11, height: 43 }, listenText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" }, heroWords: { zIndex: 1, alignItems: "flex-end", gap: 3, paddingTop: 42 }, hello: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", textAlign: "right" }, heroTitle: { color: "#FFFFFF", fontSize: 27, lineHeight: 35, fontWeight: "900", textAlign: "right" }, heroHint: { color: "#F7F4FF", fontSize: 14, lineHeight: 21, fontWeight: "700", textAlign: "right" },
  chooseTitle: { color: "#2B2A48", fontSize: 18, fontWeight: "900", textAlign: "right", marginTop: 5 }, bigCard: { borderRadius: 25, overflow: "hidden", minHeight: 207 }, cardImage: { flex: 1, minHeight: 207, justifyContent: "flex-end", padding: 16 }, cardImageRadius: { borderRadius: 25 }, cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10, 100, 95, 0.47)", borderRadius: 25 }, mathOverlay: { backgroundColor: "rgba(117, 70, 6, 0.41)" }, cardCopy: { alignItems: "flex-end", zIndex: 1 }, cardChip: { flexDirection: "row-reverse", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.20)", borderRadius: 99, paddingVertical: 6, paddingHorizontal: 10 }, chipText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" }, cardTitle: { color: "#FFFFFF", fontSize: 22, lineHeight: 30, fontWeight: "900", textAlign: "right", marginTop: 9 }, cardBody: { color: "#FFFFFF", fontSize: 13, lineHeight: 19, fontWeight: "700", textAlign: "right", marginTop: 4, maxWidth: "89%" }, startButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 13, backgroundColor: "#FFFFFF", marginTop: 12 }, startText: { color: "#174B4A", fontSize: 13, fontWeight: "900" },
  libraryCard: { flexDirection: "row-reverse", gap: 12, alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 21, padding: 15, borderWidth: 1, borderColor: "#E4E3F6" }, libraryIcon: { width: 50, height: 50, borderRadius: 18, backgroundColor: "#F0EFFF", alignItems: "center", justifyContent: "center" }, libraryCopy: { flex: 1 }, libraryTitle: { color: "#353352", fontSize: 16, fontWeight: "900", textAlign: "right" }, libraryText: { color: "#77758F", fontSize: 12, lineHeight: 19, fontWeight: "600", textAlign: "right", marginTop: 2 }, footer: { color: "#77758F", fontSize: 12, lineHeight: 19, textAlign: "center", paddingHorizontal: 16 }, pressed: { opacity: 0.83, transform: [{ scale: 0.98 }] },
  lettersCard: { flexDirection: "row-reverse", alignItems: "center", gap: 11, backgroundColor: "#F0EFFF", borderRadius: 21, padding: 15 }, lettersSparkles: { width: 68, height: 56, borderRadius: 18, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }, lettersEmoji: { color: "#5B4FE8", fontSize: 20, fontWeight: "900" }, lettersCopy: { flex: 1 }, lettersTitle: { color: "#4B4697", fontSize: 17, fontWeight: "900", textAlign: "right" }, lettersBody: { color: "#625DA6", fontSize: 12, lineHeight: 18, fontWeight: "700", textAlign: "right", marginTop: 2 }, lettersProgress: { color: "#5B4FE8", fontSize: 11, fontWeight: "900", textAlign: "right", marginTop: 4 },
});
