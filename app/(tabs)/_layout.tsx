import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { TaleenProvider } from "@/lib/taleen-store";

export default function TaleenTabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(9, insets.bottom);

  return <TaleenProvider>
    <Tabs screenOptions={{
      headerShown: false,
      tabBarButton: HapticTab,
      tabBarActiveTintColor: "#5B4FE8",
      tabBarInactiveTintColor: "#8B8BA1",
      tabBarStyle: { height: 61 + bottomPadding, paddingTop: 8, paddingBottom: bottomPadding, backgroundColor: "#FFFFFF", borderTopColor: "#E7E8F6", borderTopWidth: 1 },
      tabBarLabelStyle: { fontFamily: undefined, fontSize: 11, fontWeight: "700" },
    }}>
      <Tabs.Screen name="index" options={{ title: "عالمي", tabBarIcon: ({ color }) => <MaterialIcons name="home-filled" size={25} color={color} /> }} />
      <Tabs.Screen name="explore" options={{ title: "اكتشف", tabBarIcon: ({ color }) => <MaterialIcons name="explore" size={25} color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: "تقدمي", tabBarIcon: ({ color }) => <MaterialIcons name="emoji-events" size={25} color={color} /> }} />
      <Tabs.Screen name="parent" options={{ title: "ولي الأمر", tabBarIcon: ({ color }) => <MaterialIcons name="family-restroom" size={25} color={color} /> }} />
      <Tabs.Screen name="assistant" options={{ href: null }} />
      <Tabs.Screen name="letters" options={{ href: null }} />
      <Tabs.Screen name="admin" options={{ href: null }} />
      <Tabs.Screen name="learn/[id]" options={{ href: null }} />
    </Tabs>
  </TaleenProvider>;
}
