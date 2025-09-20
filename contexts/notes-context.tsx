"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Note } from "@/types/note";
import { jsPDF } from "jspdf";

interface NotesContextType {
  notes: Note[];
  addNote: (content: string) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, newContent: string) => void;
  exportNotesAsMarkdown: () => void;
  exportNotesAsPDF: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

function getInitialNotes(): Note[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("ai-studybuddy-notes");
    if (stored) return JSON.parse(stored);
  }
  return [];
}

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setNotes(getInitialNotes());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ai-studybuddy-notes", JSON.stringify(notes));
    }
  }, [notes]);

  const addNote = (content: string) => {
    setNotes((prev) => [
      { id: Date.now().toString(), content, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const updateNote = (id: string, newContent: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, content: newContent } : n)));
  };

  const exportNotesAsMarkdown = () => {
    const md = notes.map((n) => `### Note (${new Date(n.createdAt).toLocaleString()})\n\n${n.content}\n`).join("\n---\n\n");
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-notes.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportNotesAsPDF = () => {
    const doc = new jsPDF();
    notes.forEach((n, i) => {
      if (i !== 0) doc.addPage();
      doc.text(`Note (${new Date(n.createdAt).toLocaleString()})`, 10, 10);
      doc.text(n.content, 10, 20);
    });
    doc.save("my-notes.pdf");
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote, updateNote, exportNotesAsMarkdown, exportNotesAsPDF }}>
      {children}
    </NotesContext.Provider>
  );
};

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within a NotesProvider");
  return ctx;
}
