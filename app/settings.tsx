import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TabBar from "../components/TabBar";
import { SortOption } from "../types";
import { saveNotes } from "../storage";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [defaultSort, setDefaultSort] = useState<SortOption>("date");

  async function handleClearAll() {
    Alert.alert(
      "Clear All Notes",
      "This will permanently delete all notes including archived ones. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await saveNotes([]);
            Alert.alert("Done", "All notes have been deleted.");
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="bg-[#D9A341] px-6 pt-4 pb-6">
        <Text className="text-white text-2xl font-bold">Settings</Text>
        <Text className="text-white/75 text-xs mt-0.5">Customize your experience</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4 pb-10">

          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 mt-4 ml-1">
            Appearance
          </Text>
          <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <View className="flex-row items-center justify-between p-4">
              <View className="flex-1 mr-4">
                <Text className="text-slate-900 text-sm font-semibold mb-0.5">Dark Mode</Text>
                <Text className="text-slate-400 text-xs leading-4">Switch to a darker color theme</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#e2e8f0", true: "#325AD2" }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 mt-4 ml-1">
            Default Sort Order
          </Text>
          <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <TouchableOpacity
              className="flex-row items-center justify-between p-4"
              onPress={() => setDefaultSort("date")}
              activeOpacity={0.7}
            >
              <View className="flex-1 mr-4">
                <Text className="text-slate-900 text-sm font-semibold mb-0.5">By Date</Text>
                <Text className="text-slate-400 text-xs leading-4">Most recently edited notes appear first</Text>
              </View>
              {defaultSort === "date" ? (
                <View className="w-5 h-5 rounded-full border-2 border-[#325AD2] items-center justify-center">
                  <View className="w-2.5 h-2.5 rounded-full bg-[#325AD2]" />
                </View>
              ) : (
                <View className="w-5 h-5 rounded-full border-2 border-slate-300" />
              )}
            </TouchableOpacity>

            <View className="h-px bg-slate-100 ml-4" />

            <TouchableOpacity
              className="flex-row items-center justify-between p-4"
              onPress={() => setDefaultSort("alpha")}
              activeOpacity={0.7}
            >
              <View className="flex-1 mr-4">
                <Text className="text-slate-900 text-sm font-semibold mb-0.5">Alphabetically</Text>
                <Text className="text-slate-400 text-xs leading-4">Notes sorted A to Z by title</Text>
              </View>
              {defaultSort === "alpha" ? (
                <View className="w-5 h-5 rounded-full border-2 border-[#325AD2] items-center justify-center">
                  <View className="w-2.5 h-2.5 rounded-full bg-[#325AD2]" />
                </View>
              ) : (
                <View className="w-5 h-5 rounded-full border-2 border-slate-300" />
              )}
            </TouchableOpacity>
          </View>

          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 mt-4 ml-1">
            About
          </Text>
          <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {([ ["App Name", "The Note Taker"], ["Version", "1.0.0"], ["Built With", "Expo + React Native"] ] as const).map(([label, value], i, arr) => (
              <View key={label}>
                <View className="flex-row justify-between items-center p-4">
                  <Text className="text-slate-400 text-sm">{label}</Text>
                  <Text className="text-slate-900 text-sm font-semibold">{value}</Text>
                </View>
                {i < arr.length - 1 && <View className="h-px bg-slate-100 ml-4" />}
              </View>
            ))}
          </View>

          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 mt-4 ml-1">
            Data
          </Text>
          <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <TouchableOpacity className="p-4" onPress={handleClearAll} activeOpacity={0.8}>
              <Text className="text-red-500 text-sm font-semibold mb-0.5">Clear All Notes</Text>
              <Text className="text-slate-400 text-xs">Permanently delete all notes and archive</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      <TabBar />
    </SafeAreaView>
  );
}
