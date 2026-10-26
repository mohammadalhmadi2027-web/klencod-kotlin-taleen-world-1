import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import type { Lesson } from "@/lib/taleen-content";
import { seedLessons } from "@/lib/taleen-content";
import { useTaleen } from "@/lib/taleen-store";

type KidFilter = "الكل" | "القرآن" | "الرياضيات";
const choices: KidFilter[] = ["القرآن", "الرياضيات", "الكل"];

export default function ExploreScreen() {
  const [filter, setFilter] = useState<KidFilter>("القرآن");
  const { state } = useTaleen();
  const lessons = useMemo(() => {
    const all = [...state.customLessons, ...seedLessons];
    if (filter === "الكل") return all;
    return all.filter((lesson) => lesson.subject === filter);
  }, [filter, state.customLessons]);
  return <ScreenContainer className="flex-1" containerClassName="bg-background"><FlatList data={lessons} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} ListHeaderComponent={<><View style={styles.header}><View style={styles.headIcon}><MaterialIcons name={filter === "الرياضيات" ? "calculate" : "menu-book"} size={29} color="#5B4FE8" /></View><View><Text style={styles.title}>دروسي</Text><Text style={styles.subtitle}>اختر درسًا واحدًا واستمتع.</Text></View></View><View style={styles.choiceRow}>{choices.map((choice) => <Pressable key={choice} accessibilityRole="button" onPress={() => setFilter(choice)} style={({ pressed }) => [styles.choice, filter === choice && styles.choiceActive, pressed && styles.pressed]}><Text style={[styles.choiceText, filter === choice && styles.choiceTextActive]}>{choice === "الكل" ? "كل الدروس" : choice}</Text></Pressable>)}</View><Text style={styles.count}>{lessons.length} درسًا لطيفًا</Text></>} renderItem={({ item }) => <KidLesson lesson={item} done={Boolean(state.lessonRecords[item.id]?.completed)} onPress={() => router.push(`/learn/${item.id}` as never)} />} /> </ScreenContainer>;
}

function KidLesson({ lesson, done, onPress }: { lesson: Lesson; done: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.lesson, pressed && styles.pressed]}><View style={[styles.lessonIcon, { backgroundColor: `${lesson.color}18` }]}><MaterialIcons name={lesson.icon as keyof typeof MaterialIcons.glyphMap} size={28} color={lesson.color} /></View><View style={styles.lessonCopy}><Text style={styles.lessonTitle}>{lesson.title}</Text><Text numberOfLines={2} style={styles.lessonText}>{lesson.subtitle}</Text><Text style={[styles.lessonAction, { color: lesson.color }]}>{done ? "أعد الدرس" : "ابدأ الآن"}</Text></View>{done ? <MaterialIcons name="check-circle" size={22} color="#18A16B" /> : <MaterialIcons name="arrow-back" size={21} color="#7B7894" />}</Pressable>;
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 34 }, header: { flexDirection: "row-reverse", alignItems: "center", gap: 11, marginTop: 5 }, headIcon: { width: 54, height: 54, borderRadius: 19, backgroundColor: "#F0EFFF", alignItems: "center", justifyContent: "center" }, title: { color: "#282641", fontSize: 24, fontWeight: "900", textAlign: "right" }, subtitle: { color: "#77758F", fontSize: 13, fontWeight: "700", textAlign: "right", marginTop: 2 }, choiceRow: { flexDirection: "row-reverse", gap: 8, marginTop: 19 }, choice: { flex: 1, alignItems: "center", paddingVertical: 11, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E4E3F6", borderRadius: 15 }, choiceActive: { backgroundColor: "#5B4FE8", borderColor: "#5B4FE8" }, choiceText: { color: "#66637D", fontSize: 12, fontWeight: "900" }, choiceTextActive: { color: "#FFFFFF" }, count: { color: "#77758F", fontSize: 12, fontWeight: "800", textAlign: "right", marginTop: 19, marginBottom: 6 }, lesson: { flexDirection: "row-reverse", alignItems: "center", gap: 11, padding: 13, backgroundColor: "#FFFFFF", borderRadius: 19, borderWidth: 1, borderColor: "#E8E7F4", marginTop: 10 }, lessonIcon: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" }, lessonCopy: { flex: 1 }, lessonTitle: { color: "#37354F", fontSize: 16, fontWeight: "900", textAlign: "right" }, lessonText: { color: "#77758F", fontSize: 12, lineHeight: 18, textAlign: "right", marginTop: 2 }, lessonAction: { fontSize: 12, fontWeight: "900", textAlign: "right", marginTop: 7 }, pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
