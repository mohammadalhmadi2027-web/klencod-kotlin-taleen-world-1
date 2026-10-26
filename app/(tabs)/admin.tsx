import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { uiStyles } from "@/components/taleen-ui";
import type { Lesson } from "@/lib/taleen-content";
import { useTaleen } from "@/lib/taleen-store";

const subjects = ["الرياضيات", "العلوم", "اللغة العربية", "اللغة الإنجليزية", "البرمجة", "الذكاء الاصطناعي", "الأمان الرقمي", "إسلامي"];

export default function AdminStudioScreen() {
  const { state, addCustomLesson } = useTaleen();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("العلوم");
  const [source, setSource] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [saved, setSaved] = useState(false);
  const religious = subject === "إسلامي";
  const canSave = title.trim().length >= 3 && description.trim().length >= 12 && (!religious || (source.trim().length >= 4 && reviewed));

  const publish = () => {
    if (!canSave) return;
    const id = `local-${Date.now()}`;
    const lesson: Lesson = { id, title: title.trim(), subtitle: description.trim(), subject, zone: religious ? "islamic" : subject === "البرمجة" ? "coding" : subject === "الذكاء الاصطناعي" ? "ai" : subject === "الأمان الرقمي" ? "cyber" : subject === "الرياضيات" ? "math" : subject === "العلوم" ? "science" : "languages", kind: "درس", minAge: 7, maxAge: 15, duration: 10, xp: 30, color: religious ? "#16A085" : "#5B4FE8", icon: religious ? "auto-stories" : "school", skill: "محتوى مضاف", reviewed: !religious || reviewed, source: religious ? source.trim() : undefined, goals: ["فهم الفكرة", "تطبيق بسيط", "مراجعة لطيفة"], pages: [{ heading: "فكرة الدرس", body: description.trim() }, { heading: "نتأمل", body: "أضف في لوحة الإدارة الكاملة أمثلة ووسائط وأسئلة مناسبة للعمر قبل النشر العام." }, { heading: "تطبيق", body: "اطلب من المتعلم تنفيذ نشاط قصير يثبت فهم الفكرة، ثم راجع النتيجة بلطف." }], activity: "أضف نشاطًا عمليًا مناسبًا لهذا الدرس من نظام إدارة المحتوى الكامل.", quiz: { prompt: "هل فهمت الفكرة الأساسية للدرس؟", options: ["نعم، وأستطيع شرحها", "أحتاج إلى تلميح", "لم أبدأ بعد"], correctIndex: 0, hint: "راجع الفكرة الأولى ثم حاول مرة أخرى.", explanation: "أحسنت. تستطيع الآن متابعة النشاط أو إضافة أسئلة أكثر تفصيلًا من لوحة الإدارة." } };
    addCustomLesson(lesson); setSaved(true); setTitle(""); setDescription(""); setSource(""); setReviewed(false);
  };

  return <ScreenContainer className="flex-1" containerClassName="bg-background"><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
    <View style={styles.nav}><Pressable accessibilityRole="button" onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && styles.pressed]}><MaterialIcons name="arrow-forward" size={22} color="#3D3D5A" /></Pressable><Text style={styles.navTitle}>استوديو المحتوى</Text><View style={styles.back} /></View>
    <View style={styles.hero}><View style={styles.heroIcon}><MaterialIcons name="edit-note" size={31} color="#5B4FE8" /></View><View style={styles.heroCopy}><Text style={styles.heroTitle}>إضافة محتوى جديد</Text><Text style={styles.heroText}>يُحفظ الدرس في هذا الجهاز ويظهر فورًا في المكتبة. للمحتوى الإسلامي يلزم مصدر ومراجعة قبل إتاحته.</Text></View></View>
    {saved ? <View style={styles.saved}><MaterialIcons name="check-circle" size={20} color="#138A6A" /><Text style={styles.savedText}>تمت إضافة الدرس إلى المكتبة المحلية بنجاح.</Text></View> : null}
    <Text style={styles.label}>عنوان الدرس</Text><TextInput value={title} onChangeText={setTitle} placeholder="مثال: لماذا يتغير الطقس؟" placeholderTextColor="#9696A9" textAlign="right" style={styles.input} returnKeyType="next" />
    <Text style={styles.label}>وصف وفكرة الدرس</Text><TextInput value={description} onChangeText={setDescription} placeholder="اكتب فكرة تعليمية واضحة ومناسبة للعمر..." placeholderTextColor="#9696A9" textAlign="right" multiline style={[styles.input, styles.textarea]} />
    <Text style={styles.label}>المسار</Text><View style={styles.subjects}>{subjects.map((item) => <Pressable key={item} accessibilityRole="button" onPress={() => setSubject(item)} style={({ pressed }) => [styles.subject, subject === item && styles.subjectSelected, pressed && styles.pressed]}><Text style={[styles.subjectText, subject === item && styles.subjectTextSelected]}>{item}</Text></Pressable>)}</View>
    {religious ? <View style={styles.reviewCard}><Text style={styles.reviewTitle}>مراجعة المحتوى الإسلامي</Text><Text style={styles.reviewText}>لن يحفظ الدرس كمحتوى مراجع حتى تضيف مرجعًا وتؤكد المراجعة. لا تستخدم نصًا بلا مصدر كحقيقة دينية.</Text><TextInput value={source} onChangeText={setSource} placeholder="المصدر والمرجع، مثل اسم السورة أو الحديث" placeholderTextColor="#9696A9" textAlign="right" style={styles.input} /><View style={styles.switchRow}><Switch value={reviewed} onValueChange={setReviewed} trackColor={{ false: "#D9D9E6", true: "#82CDB8" }} thumbColor={reviewed ? "#138A6A" : "#FFFFFF"} /><Text style={styles.switchText}>تمت مراجعة المحتوى من مختص مؤهل</Text></View></View> : null}
    <Pressable accessibilityRole="button" disabled={!canSave} onPress={publish} style={({ pressed }) => [uiStyles.primaryButton, !canSave && styles.disabled, pressed && styles.pressed]}><MaterialIcons name="publish" size={18} color="#FFFFFF" /><Text style={uiStyles.primaryButtonText}>حفظ وإتاحة الدرس محليًا</Text></Pressable>
    <View style={styles.queue}><Text style={styles.queueTitle}>سير عمل المحتوى</Text><Text style={styles.queueText}>مسودة ← مراجعة ← اعتماد ← نشر. البنية الخلفية تحفظ هذه المراحل وتدعم مصادر المحتوى وسجل المراجعات عند ربط حساب المدير.</Text><Text style={styles.queueCount}>{state.customLessons.length} درس مضاف محليًا</Text></View>
  </ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 36, gap: 12 }, nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, back: { width: 42, height: 42, borderRadius: 15, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E7E8F6", alignItems: "center", justifyContent: "center" }, navTitle: { color: "#34344F", fontSize: 16, fontWeight: "900" }, hero: { flexDirection: "row-reverse", gap: 11, padding: 16, backgroundColor: "#F0EFFF", borderRadius: 20 }, heroIcon: { width: 51, height: 51, borderRadius: 18, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }, heroCopy: { flex: 1 }, heroTitle: { color: "#4B4697", fontSize: 17, fontWeight: "900", textAlign: "right" }, heroText: { color: "#625DA6", fontSize: 12, lineHeight: 19, textAlign: "right", marginTop: 4 }, saved: { flexDirection: "row-reverse", gap: 7, backgroundColor: "#E8FAF2", padding: 12, borderRadius: 15, alignItems: "center" }, savedText: { color: "#138A6A", fontSize: 12, fontWeight: "800", flex: 1, textAlign: "right" }, label: { color: "#34344F", fontSize: 13, fontWeight: "900", textAlign: "right", marginTop: 4 }, input: { minHeight: 51, paddingHorizontal: 13, paddingVertical: 12, backgroundColor: "#FFFFFF", borderRadius: 15, borderWidth: 1, borderColor: "#E7E8F6", color: "#34344F", fontSize: 14, writingDirection: "rtl" }, textarea: { minHeight: 116, textAlignVertical: "top" }, subjects: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 }, subject: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E7E8F6", borderRadius: 99, paddingHorizontal: 12, paddingVertical: 8 }, subjectSelected: { backgroundColor: "#5B4FE8", borderColor: "#5B4FE8" }, subjectText: { color: "#62627E", fontSize: 12, fontWeight: "800" }, subjectTextSelected: { color: "#FFFFFF" }, reviewCard: { backgroundColor: "#EFFBF7", padding: 14, borderRadius: 18, gap: 9 }, reviewTitle: { color: "#107154", fontSize: 14, fontWeight: "900", textAlign: "right" }, reviewText: { color: "#347361", fontSize: 12, lineHeight: 19, textAlign: "right" }, switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, switchText: { color: "#347361", fontSize: 12, fontWeight: "700", textAlign: "right", flex: 1, marginRight: 10 }, queue: { backgroundColor: "#FFFFFF", padding: 15, borderWidth: 1, borderColor: "#E7E8F6", borderRadius: 19 }, queueTitle: { color: "#34344F", fontSize: 14, fontWeight: "900", textAlign: "right" }, queueText: { color: "#62627E", fontSize: 12, lineHeight: 19, textAlign: "right", marginTop: 4 }, queueCount: { color: "#5B4FE8", fontSize: 12, fontWeight: "800", textAlign: "right", marginTop: 10 }, disabled: { opacity: 0.45 }, pressed: { opacity: 0.76, transform: [{ scale: 0.98 }] },
});
