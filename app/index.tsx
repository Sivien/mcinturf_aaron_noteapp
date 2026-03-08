import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Modal, KeyboardAvoidingView, Platform,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TabBar from "../components/TabBar";
import NoteCard from "../components/NoteCard";
import { Note, SortOption } from "../types";
import { loadNotes, saveNotes, createNote, updateNote } from "../storage";

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [sort, setSort] = useState<SortOption>("date");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [bodyInput, setBodyInput] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadNotes().then((all) => setNotes(all.filter((n) => !n.archived)));
    }, [])
  );

  async function refreshNotes() {
    const all = await loadNotes();
    setNotes(all.filter((n) => !n.archived));
  }

  function openAddModal() {
    setEditingNote(null);
    setTitleInput("");
    setBodyInput("");
    setModalVisible(true);
  }

  function openEditModal(note: Note) {
    setEditingNote(note);
    setTitleInput(note.title);
    setBodyInput(note.body);
    setModalVisible(true);
  }

  async function handleSave() {
    if (!titleInput.trim() && !bodyInput.trim()) {
      setModalVisible(false);
      return;
    }
    const all = await loadNotes();
    let updated: Note[];
    if (editingNote) {
      updated = all.map((n) =>
        n.id === editingNote.id ? updateNote(n, titleInput, bodyInput) : n
      );
    } else {
      updated = [createNote(titleInput, bodyInput), ...all];
    }
    await saveNotes(updated);
    setModalVisible(false);
    refreshNotes();
  }

  async function handleDelete(id: string) {
    const all = await loadNotes();
    await saveNotes(all.filter((n) => n.id !== id));
    refreshNotes();
  }

  async function handleArchive(id: string) {
    const all = await loadNotes();
    await saveNotes(all.map((n) => (n.id === id ? { ...n, archived: true } : n)));
    refreshNotes();
  }

  const sorted = [...notes].sort((a, b) =>
    sort === "alpha" ? a.title.localeCompare(b.title) : b.updatedAt - a.updatedAt
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      {/* Header */}
      <View className="bg-[#325AD2] px-6 pt-4 pb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-white text-2xl font-bold">My Notes</Text>
          <Text className="text-[#94D2FD] text-xs mt-0.5">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <View className="flex-row gap-2">
          {sort === "date" ? (
            <TouchableOpacity
              className="px-4 py-1.5 rounded-full bg-white"
              onPress={() => setSort("date")}
            >
              <Text className="text-[#325AD2] text-xs font-semibold">Date</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="px-4 py-1.5 rounded-full bg-white/20"
              onPress={() => setSort("date")}
            >
              <Text className="text-[#94D2FD] text-xs font-semibold">Date</Text>
            </TouchableOpacity>
          )}
          {sort === "alpha" ? (
            <TouchableOpacity
              className="px-4 py-1.5 rounded-full bg-white"
              onPress={() => setSort("alpha")}
            >
              <Text className="text-[#325AD2] text-xs font-semibold">A-Z</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="px-4 py-1.5 rounded-full bg-white/20"
              onPress={() => setSort("alpha")}
            >
              <Text className="text-[#94D2FD] text-xs font-semibold">A-Z</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Notes List */}
      <ScrollView className="flex-1">
        <View className="p-4 pb-24">
          {sorted.length === 0 ? (
            <View className="items-center pt-20">
              <Text className="text-slate-500 text-lg font-semibold mb-2">No notes yet</Text>
              <Text className="text-slate-400 text-sm text-center">
                Tap the + button to create your first note.
              </Text>
            </View>
          ) : (
            sorted.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onArchive={handleArchive}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-24 right-6 w-14 h-14 rounded-full bg-[#325AD2] items-center justify-center shadow-lg"
        onPress={openAddModal}
        activeOpacity={0.85}
      >
        <Text className="text-white text-3xl font-light leading-8">+</Text>
      </TouchableOpacity>

      <TabBar />

      {/* Add / Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          className="flex-1 bg-black/40 justify-end"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="bg-white rounded-t-3xl p-6 pb-10">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-slate-900 text-lg font-bold">
                {editingNote ? "Edit Note" : "New Note"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-slate-400 text-base">Cancel</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              className="bg-slate-50 rounded-xl px-4 py-3 text-base font-semibold text-slate-900 mb-2 border border-slate-200"
              placeholder="Title"
              placeholderTextColor="#94a3b8"
              value={titleInput}
              onChangeText={setTitleInput}
              maxLength={80}
            />
            <TextInput
              className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-900 mb-4 border border-slate-200 h-40"
              placeholder="Write your note here..."
              placeholderTextColor="#94a3b8"
              value={bodyInput}
              onChangeText={setBodyInput}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              className="bg-[#325AD2] rounded-xl py-3.5 items-center"
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text className="text-white text-base font-bold">Save Note</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
