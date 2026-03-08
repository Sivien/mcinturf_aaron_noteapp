import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";

type Tab = { label: string; route: string };

const TABS: Tab[] = [
  { label: "Notes",    route: "/" },
  { label: "Archive",  route: "/archive" },
  { label: "Settings", route: "/settings" },
];

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="flex-row bg-white border-t border-slate-200 pb-5 pt-1">
      {TABS.map((tab) => {
        const isActive = pathname === tab.route;
        if (isActive) {
          return (
            <TouchableOpacity
              key={tab.route}
              className="flex-1 items-center py-2"
              onPress={() => router.push(tab.route as any)}
              activeOpacity={0.8}
            >
              <Text className="text-[#325AD2] text-sm font-bold">{tab.label}</Text>
              <View className="absolute bottom-0 w-6 h-0.5 bg-[#325AD2] rounded-full" />
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            key={tab.route}
            className="flex-1 items-center py-2"
            onPress={() => router.push(tab.route as any)}
            activeOpacity={0.8}
          >
            <Text className="text-slate-400 text-sm font-medium">{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
