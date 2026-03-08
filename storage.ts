import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "./types";

const NOTES_KEY = "notes_data";

export async function loadNotes(): Promise<Note[]> {
  try {
    const raw = await AsyncStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Note[];
  } catch {
    return [];
  }
}

export async function saveNotes(notes: Note[]): Promise<void> {
  try {
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {}
}

export function createNote(title: string, body: string): Note {
  const now = Date.now();
  return {
    id: now.toString(),
    title: title.trim() || "Untitled",
    body: body.trim(),
    createdAt: now,
    updatedAt: now,
    archived: false,
  };
}

export function updateNote(note: Note, title: string, body: string): Note {
  return {
    ...note,
    title: title.trim() || "Untitled",
    body: body.trim(),
    updatedAt: Date.now(),
  };
}
