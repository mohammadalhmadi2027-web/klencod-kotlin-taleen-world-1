import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { EmptyState, LessonCard, ProgressBar, SectionHeading, StatChip } from "@/components/taleen-ui";
import { seedLessons } from "@/lib/taleen-content";
import { useTaleen } from "@/lib/taleen-store";

export default function ProgressScreen() {
  const { state, completedCount, toggleFavorite } = useTaleen();
  const favorites = seedLessons.filter((item) => state.favorites.includes(item.id));
  const total = seedLessons.length;
  const percentage = Math.round((completedCount / total) * 100);
  const badges = [
    { icon: "school", title: "بداية مشرقة", body: "أكملت أول درس", unlocked: completedCount >= 1, color: "#5B4FE8" },
    { icon: "auto-stories", title: "قارئ فضولي", body: "أكملت قصة", unlocked: Object.keys(state.lessonRecords).some((id) => seedLessons.find((item) => item.id === id)?.kind === "قصة"), color: "#EC6B9C" },
    { icon: "shield", title: "بطل الأمان", body: "تعلمت أمانًا رقميًا", unlocked: Object.keys(state.lessonRecords).some((id) => seedLessons.find((item) => item.id === id)?.subject === "الأمان الرقمي"), color: "#00A6A6" },
    { icon: "local-fire-department", title: "مستمر بلطف", body: "سلسلة 7 أيام", unlocked: state.streak >= 7, color: "#FF7A59" },
  ];
  const skills = [
    { name: "الجمع الأساسي", value: 78, status: "تتطور" },
    { name: "القراءة الأولى", value: 66, status: "تتعلم" },
    { name: "الوعي الرقمي", value: 48, status: "بداية رائعة" },
  ];

  return <ScreenContainer className="flex-1" containerClassName="bg-background"><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
    <View style={styles.header}><View style={styles.headerIcon}><MaterialIcons name="emoji-events" size={31} color="#F5A524" /></View><View><Text style={styles.title}>رحلتي التعليمية</Text><Text style={styles.subtitle}>نحتفل بما تعلمته ونكمل بهدوء</Text></View></View>
    <View style={styles.overviewCard}><View style={styles.overviewTop}><View><Text style={styles.percentage}>{percentage}%</Text><Text style={styles.overviewLabel}>من محتوى عالمك</Text></View><View style={styles.ring}><Text style={styles.ringText}>{completedCount}</Text><Text style={styles.ringSmall}>درس</Text></View></View><ProgressBar value={percentage} color="#5B4FE8" /><Text style={styles.overviewFooter}>{completedCount} من {total} درسًا موجودًا في مكتبتك. ليس هناك سباق، تعلّم بطريقتك.</Text></View>
    <View style={styles.statsRow}><StatChip icon="bolt" label="XP" value={state.xp} color="#5B4FE8" /><StatChip icon="stars" label="نجوم" value={state.stars} color="#F5A524" /><StatChip icon="toll" label="عملات" value={state.coins} color="#14B8A6" /></View>
    <SectionHeading title="مهاراتي" />
    <View style={styles.skillsCard}>{skills.map((skill) => <View key={skill.name} style={styles.skillRow}><View style={styles.skillTitleRow}><Text style={styles.skillStatus}>{skill.status}</Text><Text style={styles.skillName}>{skill.name}</Text></View><ProgressBar value={skill.value} color={skill.value > 70 ? "#14B8A6" : "#5B4FE8"} /></View>)}</View>
    <SectionHeading title="شاراتي" />
    <View style={styles.badgeGrid}>{badges.map((badge) => <View key={badge.title} style={[styles.badge, !badge.unlocked && styles.badgeLocked]}><View style={[styles.badgeIcon, { backgroundColor: `${badge.color}18` }]}><MaterialIcons name={badge.unlocked ? badge.icon as keyof typeof MaterialIcons.glyphMap : "lock"} size={22} color={badge.unlocked ? badge.color : "#9999AF"} /></View><Text style={styles.badgeTitle}>{badge.title}</Text><Text style={styles.badgeBody}>{badge.unlocked ? badge.body : "استمر لتفتحها"}</Text></View>)}</View>
    <SectionHeading title="مفضلتي" />
    {favorites.length ? <View style={styles.favoriteList}>{favorites.map((item) => <LessonCard key={item.id} item={item} completed={Boolean(state.lessonRecords[item.id]?.completed)} favorite onPress={() => router.push(`/learn/${item.id}` as never)} onFavorite={() => toggleFavorite(item.id)} />)}</View> : <EmptyState icon="favorite-border" title="قائمة مفضلتك فارغة" body="اضغط القلب بجانب أي درس أو قصة لتعود إليه بسهولة." />}
  </ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 34, gap: 18 }, header: { flexDirection: "row-reverse", alignItems: "center", gap: 12, marginTop: 4 }, headerIcon: { width: 54, height: 54, borderRadius: 19, backgroundColor: "#FFF5D7", alignItems: "center", justifyContent: "center" }, title: { color: "#1B1B3A", fontWeight: "900", fontSize: 24, textAlign: "right" }, subtitle: { color: "#62627E", fontSize: 13, marginTop: 3, textAlign: "right" },
  overviewCard: { padding: 18, backgroundColor: "#FFFFFF", borderRadius: 23, borderWidth: 1, borderColor: "#E7E8F6", gap: 14 }, overviewTop: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }, percentage: { color: "#5B4FE8", fontWeight: "900", fontSize: 34, textAlign: "right" }, overviewLabel: { color: "#75758D", fontSize: 12, textAlign: "right" }, ring: { width: 66, height: 66, borderRadius: 33, backgroundColor: "#F0EFFF", alignItems: "center", justifyContent: "center" }, ringText: { color: "#5B4FE8", fontSize: 20, fontWeight: "900" }, ringSmall: { color: "#5B4FE8", fontSize: 10, fontWeight: "700" }, overviewFooter: { color: "#62627E", fontSize: 12, lineHeight: 20, textAlign: "right" },
  statsRow: { flexDirection: "row-reverse", gap: 8, flexWrap: "wrap" }, skillsCard: { backgroundColor: "#FFFFFF", borderRadius: 21, padding: 16, borderWidth: 1, borderColor: "#E7E8F6", gap: 15 }, skillRow: { gap: 8 }, skillTitleRow: { flexDirection: "row", justifyContent: "space-between" }, skillName: { color: "#34344F", fontWeight: "800", fontSize: 14, textAlign: "right" }, skillStatus: { color: "#75758D", fontSize: 12, fontWeight: "700" },
  badgeGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 }, badge: { width: "47%", minHeight: 141, padding: 13, borderRadius: 19, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E7E8F6", alignItems: "flex-end" }, badgeLocked: { opacity: 0.6 }, badgeIcon: { width: 41, height: 41, borderRadius: 14, justifyContent: "center", alignItems: "center", alignSelf: "flex-end" }, badgeTitle: { color: "#34344F", fontSize: 13, fontWeight: "900", marginTop: 10, textAlign: "right" }, badgeBody: { color: "#75758D", fontSize: 11, lineHeight: 17, textAlign: "right", marginTop: 3 }, favoriteList: { gap: 10 },
});
