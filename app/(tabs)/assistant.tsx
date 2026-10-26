import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { uiStyles } from "@/components/taleen-ui";
import { trpc } from "@/lib/trpc";
import { useTaleen } from "@/lib/taleen-store";

const examples = ["اشرح لي لماذا يحدث المطر", "كيف أرتب خطوات مسألة جمع؟", "كيف أتحقق من معلومة؟"];

export default function TaleenAssistantScreen() {
  const { state } = useTaleen();
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const ask = trpc.taleenAi.ask.useMutation({ onSuccess: (result) => setReply(result.reply), onError: () => setReply("حدثت مشكلة مؤقتة. ارجع إلى درس من المكتبة أو جرّب لاحقًا.") });
  const ageBand = state.childAge <= 6 ? "4_6" : state.childAge <= 9 ? "7_9" : state.childAge <= 12 ? "10_12" : "13_15";
  const send = () => { if (question.trim().length) ask.mutate({ question: question.trim(), ageBand }); };

  return <ScreenContainer className="flex-1" containerClassName="bg-background"><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <View style={styles.nav}><Pressable accessibilityRole="button" onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}><MaterialIcons name="arrow-forward" size={22} color="#3D3D5A" /></Pressable><Text style={styles.navTitle}>مساعد تالين</Text><View style={styles.navSpacer} /></View>
    <View style={styles.hero}><View style={styles.heroAvatar}><MaterialIcons name="smart-toy" size={40} color="#5B4FE8" /></View><Text style={styles.heroTitle}>أفكر معك، ولا أفكر بدلاً عنك</Text><Text style={styles.heroText}>اسأل عن درس أو مهارة. لا تكتب اسمك الكامل أو عنوانك أو كلمة مرورك.</Text></View>
    {!state.aiEnabled ? <View style={styles.locked}><MaterialIcons name="lock" size={28} color="#7A62A7" /><Text style={styles.lockedTitle}>المساعد متوقف حاليًا</Text><Text style={styles.lockedText}>هذه ميزة تحت إشراف ولي الأمر. اطلب منه تفعيلها من لوحة ولي الأمر إن كان مناسبًا لك.</Text><Pressable accessibilityRole="button" onPress={() => router.push("/parent" as never)} style={({ pressed }) => [uiStyles.secondaryButton, styles.fullButton, pressed && styles.pressed]}><Text style={uiStyles.secondaryButtonText}>فتح لوحة ولي الأمر</Text></Pressable></View> : <>
      <View style={styles.rules}><MaterialIcons name="verified-user" size={21} color="#138A6A" /><Text style={styles.rulesText}>لا يحل المساعد واجبك كاملًا، ولا يقدم فتوى أو تفسيرًا دينيًا. عند الحاجة سيوجهك إلى درس مراجع أو بالغ موثوق.</Text></View>
      <Text style={styles.sectionTitle}>جرّب سؤالًا تعليميًا</Text><View style={styles.exampleRow}>{examples.map((example) => <Pressable key={example} accessibilityRole="button" onPress={() => setQuestion(example)} style={({ pressed }) => [styles.example, pressed && styles.pressed]}><Text style={styles.exampleText}>{example}</Text></Pressable>)}</View>
      <View style={styles.inputCard}><TextInput value={question} onChangeText={setQuestion} multiline textAlign="right" placeholder="اكتب سؤالك هنا..." placeholderTextColor="#9090A5" style={styles.input} maxLength={600} /><View style={styles.inputFooter}><Text style={styles.counter}>{question.length}/600</Text><Pressable accessibilityRole="button" disabled={!question.trim() || ask.isPending} onPress={send} style={({ pressed }) => [uiStyles.primaryButton, styles.send, (!question.trim() || ask.isPending) && styles.disabled, pressed && styles.pressed]}>{ask.isPending ? <ActivityIndicator color="#FFFFFF" /> : <><MaterialIcons name="send" size={18} color="#FFFFFF" /><Text style={uiStyles.primaryButtonText}>اسأل</Text></>}</Pressable></View></View>
      {reply ? <View style={styles.replyCard}><View style={styles.replyTop}><View style={styles.replyIcon}><MaterialIcons name="auto-awesome" size={20} color="#5B4FE8" /></View><Text style={styles.replyTitle}>إجابة تالين</Text></View><Text style={styles.replyText}>{reply}</Text></View> : null}
    </>}
  </ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 36, gap: 18 }, nav: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, backButton: { width: 42, height: 42, borderRadius: 15, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E7E8F6", alignItems: "center", justifyContent: "center" }, navTitle: { color: "#34344F", fontSize: 16, fontWeight: "900" }, navSpacer: { width: 42 },
  hero: { alignItems: "center", paddingHorizontal: 16 }, heroAvatar: { width: 84, height: 84, borderRadius: 31, backgroundColor: "#F0EFFF", alignItems: "center", justifyContent: "center" }, heroTitle: { color: "#1B1B3A", fontWeight: "900", fontSize: 21, textAlign: "center", marginTop: 13 }, heroText: { color: "#62627E", fontSize: 13, lineHeight: 21, textAlign: "center", marginTop: 6 },
  locked: { backgroundColor: "#F0EFFF", borderRadius: 22, padding: 20, alignItems: "center" }, lockedTitle: { color: "#4B4697", fontSize: 18, fontWeight: "900", marginTop: 8 }, lockedText: { color: "#625DA6", fontSize: 13, lineHeight: 21, textAlign: "center", marginTop: 5 }, fullButton: { width: "100%", marginTop: 15 },
  rules: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 9, backgroundColor: "#EFFBF7", borderRadius: 17, padding: 14 }, rulesText: { flex: 1, color: "#347361", fontSize: 12, lineHeight: 19, textAlign: "right" }, sectionTitle: { color: "#34344F", fontSize: 16, fontWeight: "900", textAlign: "right" }, exampleRow: { gap: 8 }, example: { backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#E7E8F6", padding: 12 }, exampleText: { color: "#4D4D69", fontSize: 13, fontWeight: "700", textAlign: "right" },
  inputCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E7E8F6", borderRadius: 20, padding: 14, gap: 12 }, input: { minHeight: 100, color: "#34344F", fontSize: 15, lineHeight: 23, textAlignVertical: "top", writingDirection: "rtl" }, inputFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, counter: { color: "#9090A5", fontSize: 11 }, send: { paddingHorizontal: 16, paddingVertical: 10, minWidth: 86 }, disabled: { opacity: 0.45 },
  replyCard: { backgroundColor: "#FFFFFF", borderRadius: 21, padding: 16, borderWidth: 1, borderColor: "#E7E8F6" }, replyTop: { flexDirection: "row-reverse", alignItems: "center", gap: 8 }, replyIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: "#F0EFFF", alignItems: "center", justifyContent: "center" }, replyTitle: { color: "#4B4697", fontSize: 14, fontWeight: "900" }, replyText: { color: "#45455F", fontSize: 14, lineHeight: 24, textAlign: "right", marginTop: 10 }, pressed: { opacity: 0.76, transform: [{ scale: 0.98 }] },
});
