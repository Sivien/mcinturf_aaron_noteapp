import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Note } from "../types";

type NoteCardProps = {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  showUnarchive?: boolean;
};

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onArchive,
  showUnarchive = false,
}: NoteCardProps) {
  function handleDelete() {
    Alert.alert(
      "Delete Note",
      `Are you sure you want to delete "${note.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete(note.id) },
      ]
    );
  }

  return (
    <View className="bg-white rounded-2xl border border-slate-100 mb-4 p-4 shadow-sm">
      <Text className="text-slate-900 text-base font-bold mb-0.5" numberOfLines={1}>
        {note.title}
      </Text>
      <Text className="text-slate-400 text-xs mb-1">
        {note.updatedAt !== note.createdAt ? "Edited " : "Created "}
        {formatDate(note.updatedAt)}
      </Text>

      {note.body ? (
        <Text className="text-slate-600 text-sm leading-5 mt-1" numberOfLines={2}>
          {note.body}
        </Text>
      ) : null}

      <View className="flex-row mt-3 pt-3 border-t border-slate-100 gap-2">
        {!showUnarchive && (
          <TouchableOpacity
            className="px-4 py-1.5 rounded-full bg-slate-100"
            onPress={() => onEdit(note)}
          >
            <Text className="text-[#325AD2] text-xs font-semibold">Edit</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="px-4 py-1.5 rounded-full bg-slate-100"
          onPress={() => onArchive(note.id)}
        >
          <Text className="text-[#325AD2] text-xs font-semibold">
            {showUnarchive ? "Unarchive" : "Archive"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-1.5 rounded-full bg-slate-100"
          onPress={handleDelete}
        >
          <Text className="text-red-500 text-xs font-semibold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
