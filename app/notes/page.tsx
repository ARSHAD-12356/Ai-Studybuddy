"use client";
import { useNotes } from "@/contexts/notes-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil, Trash, FileText } from "lucide-react";

export default function NotesPage() {
  const { notes, addNote, deleteNote, updateNote, exportNotesAsMarkdown, exportNotesAsPDF } = useNotes();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportNotesAsMarkdown}>
            <FileText className="w-4 h-4 mr-2" /> Export Markdown
          </Button>
          <Button variant="outline" onClick={exportNotesAsPDF}>
            <FileText className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>
      <div className="mb-6">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (editValue.trim()) {
              addNote(editValue);
              setEditValue("");
            }
          }}
          className="flex gap-2"
        >
          <Input
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            placeholder="Write a new note..."
            className="flex-1"
          />
          <Button type="submit">Add</Button>
        </form>
      </div>
      <div className="grid gap-4">
        {notes.length === 0 ? (
          <div className="text-center text-muted-foreground">No notes yet. Save some from the chat!</div>
        ) : (
          notes.map(note => (
            <Card key={note.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                {editingId === note.id ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      updateNote(note.id, editValue);
                      setEditingId(null);
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">Save</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <>
                    <div className="whitespace-pre-wrap text-base mb-1">{note.content}</div>
                    <div className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleString()}</div>
                  </>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {editingId !== note.id && (
                  <Button size="icon" variant="ghost" onClick={() => { setEditingId(note.id); setEditValue(note.content); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
                <Button size="icon" variant="ghost" onClick={() => deleteNote(note.id)}>
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
