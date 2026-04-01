import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const notesCollection = collection(db, "notes");

  const addNote = async () => {
    if (note.trim() === "" || title.trim() === "") return;
    await addDoc(notesCollection, {
      title: title,
      text: note,
      createdAt: new Date()
    });
    setTitle("");
    setNote("");
    fetchNotes();
  };

  const fetchNotes = async () => {
    const data = await getDocs(notesCollection);
    setNotes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteNote = async (id) => {
    const noteDoc = doc(db, "notes", id);
    await deleteDoc(noteDoc);
    fetchNotes();
  };

  useEffect(() => { fetchNotes(); }, []);

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <h1>WARD React App</h1>
          <p className="subtitle">Frontend & Backend Demo</p>
        </div>

        <div className="form">
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Write your note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button onClick={addNote}>Add Note</button>
        </div>

        <div className="notes-list">
          {notes.length === 0 && (
            <p className="empty">No notes yet. Add one above.</p>
          )}
          {notes.map((n) => (
            <div className="note-item" key={n.id}>
              <div className="note-content">
                <span className="note-title">{n.title}</span>
                <span className="note-text">{n.text}</span>
              </div>
              <button className="delete-btn" onClick={() => deleteNote(n.id)}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;