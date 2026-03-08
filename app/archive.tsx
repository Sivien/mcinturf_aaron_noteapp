import { View, Text, ScrollView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TabBar from "../components/TabBar";
import NoteCard from "../components/NoteCard";
import { Note } from "../types";
import { loadNotes, saveNotes } from "../storage";

export default function ArchiveScreen() {
  const [archived, setArchived] = useState<Note[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadNotes().then((all) => setArchived(all.filter((n) => n.archived)));
    }, [])
  );

  async function refreshArchive() {
    const all = await loadNotes();
    setArchived(all.filter((n) => n.archived));
  }

  async function handleUnarchive(id: string) {
    const all = await loadNotes();
    await saveNotes(all.map((n) => (n.id === id ? { ...n, archived: false } : n)));
    refreshArchive();
  }

  async function handleDelete(id: string) {
    const all = await loadNotes();
    await saveNotes(all.filter((n) => n.id !== id));
    refreshArchive();
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="bg-[#4492E6] px-6 pt-4 pb-6">
        <Text className="text-white text-2xl font-bold">Archive</Text>
        <Text className="text-[#D6E4EB] text-xs mt-0.5">
          {archived.length} archived note{archived.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4 pb-10">
          {archived.length === 0 ? (
            <View className="items-center pt-20 px-8">
              <Text className="text-slate-500 text-lg font-semibold mb-2">No archived notes</Text>
              <Text className="text-slate-400 text-sm text-center leading-5">
                Notes you archive will appear here. You can unarchive them at any time.
              </Text>
            </View>
          ) : (
            archived.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => {}}
                onDelete={handleDelete}
                onArchive={handleUnarchive}
                showUnarchive
              />
            ))
          )}
        </View>
      </ScrollView>

      <TabBar />
    </SafeAreaView>
  );
}
