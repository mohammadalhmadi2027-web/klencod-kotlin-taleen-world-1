import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Lesson } from "@/lib/taleen-content";

export function ProgressBar({ value, color = "#5B4FE8" }: { value: number; color?: string }) {
  return <View style={styles.progressTrack}><View style={[styles.progressValue, { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }]} /></View>;
}

export function SectionHeading({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  return <View style={styles.sectionHeading}><Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.headingAction, pressed && styles.pressed]}><Text style={styles.headingActionText}>{action}</Text></Pressable><Text style={styles.sectionTitle}>{title}</Text></View>;
}

export function StatChip({ icon, label, value, color }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string | number; color: string }) {
  return <View style={styles.statChip}><MaterialIcons name={icon} size={18} color={color} /><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

export function LessonCard({ item, completed, favorite, onPress, onFavorite }: { item: Lesson; completed?: boolean; favorite?: boolean; onPress: () => void; onFavorite?: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.lessonCard, pressed && styles.pressed]}>
    <View style={styles.cardTopRow}>
      <Pressable accessibilityRole="button" accessibilityLabel="إضافة إلى المفضلة" onPress={(event) => { event.stopPropagation(); onFavorite?.(); }} style={({ pressed }) => [styles.favoriteButton, pressed && styles.pressed]}>
        <MaterialIcons name={favorite ? "favorite" : "favorite-border"} size={21} color={favorite ? "#E85D75" : "#8A8AA4"} />
      </Pressable>
      <View style={[styles.iconBubble, { backgroundColor: `${item.color}18` }]}><MaterialIcons name={item.icon as keyof typeof MaterialIcons.glyphMap} size={28} color={item.color} /></View>
    </View>
    <Text style={styles.cardEyebrow}>{item.subject} · {item.kind}</Text>
    <Text style={styles.lessonTitle}>{item.title}</Text>
    <Text style={styles.lessonSubtitle} numberOfLines={2}>{item.subtitle}</Text>
    <View style={styles.cardFooter}>
      <View style={styles.metaItem}><MaterialIcons name="schedule" size={15} color="#75758D" /><Text style={styles.metaText}>{item.duration} د</Text></View>
      <View style={styles.metaItem}><MaterialIcons name="stars" size={15} color="#F5A524" /><Text style={styles.metaText}>{item.xp} XP</Text></View>
      {completed ? <View style={styles.donePill}><MaterialIcons name="check" size={15} color="#138A6A" /><Text style={styles.doneText}>مكتمل</Text></View> : null}
    </View>
  </Pressable>;
}

export function EmptyState({ icon, title, body, children }: { icon: keyof typeof MaterialIcons.glyphMap; title: string; body: string; children?: ReactNode }) {
  return <View style={styles.emptyState}><View style={styles.emptyIcon}><MaterialIcons name={icon} size={30} color="#5B4FE8" /></View><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyBody}>{body}</Text>{children}</View>;
}

export const uiStyles = StyleSheet.create({
  pill: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#F0EFFF" },
  pillText: { color: "#5B4FE8", fontWeight: "700", fontSize: 12, textAlign: "right" },
  primaryButton: { borderRadius: 16, backgroundColor: "#5B4FE8", paddingHorizontal: 18, paddingVertical: 14, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  secondaryButton: { borderRadius: 16, backgroundColor: "#F0EFFF", paddingHorizontal: 18, paddingVertical: 14, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  secondaryButtonText: { color: "#5B4FE8", fontWeight: "800", fontSize: 15 },
});

const styles = StyleSheet.create({
  progressTrack: { width: "100%", height: 9, backgroundColor: "#ECECF7", borderRadius: 99, overflow: "hidden" },
  progressValue: { height: "100%", borderRadius: 99 },
  sectionHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: "#1B1B3A", textAlign: "right" },
  headingAction: { minHeight: 30, justifyContent: "center" },
  headingActionText: { color: "#5B4FE8", fontWeight: "800", fontSize: 13 },
  statChip: { flexDirection: "row-reverse", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 15, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E7E8F6" },
  statValue: { fontWeight: "800", color: "#29294B", fontSize: 13 },
  statLabel: { color: "#75758D", fontSize: 11 },
  lessonCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#E7E8F6", shadowColor: "#1B1B3A", shadowOpacity: 0.04, shadowRadius: 12, elevation: 1 },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  favoriteButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F8F8FD", alignItems: "center", justifyContent: "center" },
  iconBubble: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  cardEyebrow: { color: "#75758D", fontSize: 12, fontWeight: "700", textAlign: "right", marginBottom: 5 },
  lessonTitle: { color: "#1B1B3A", fontWeight: "800", fontSize: 17, lineHeight: 24, textAlign: "right" },
  lessonSubtitle: { color: "#62627E", fontSize: 13, lineHeight: 20, textAlign: "right", marginTop: 5 },
  cardFooter: { flexDirection: "row-reverse", alignItems: "center", gap: 12, marginTop: 14 },
  metaItem: { flexDirection: "row-reverse", gap: 4, alignItems: "center" },
  metaText: { fontSize: 12, color: "#75758D", fontWeight: "600" },
  donePill: { marginRight: "auto", flexDirection: "row-reverse", alignItems: "center", gap: 3, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 10, backgroundColor: "#E8FAF2" },
  doneText: { color: "#138A6A", fontSize: 11, fontWeight: "800" },
  emptyState: { alignItems: "center", padding: 28, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E7E8F6", borderRadius: 22 },
  emptyIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: "#F0EFFF", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  emptyTitle: { color: "#1B1B3A", fontSize: 17, fontWeight: "800", textAlign: "center" },
  emptyBody: { color: "#62627E", fontSize: 13, lineHeight: 20, textAlign: "center", marginTop: 7 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
