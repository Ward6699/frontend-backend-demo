import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [records, setRecords] = useState([]);
  const recordsCollection = collection(db, "students");

  const addRecord = async () => {
    if (name.trim() === "" || course.trim() === "" || yearLevel === "") return;
    await addDoc(recordsCollection, {
      name: name,
      course: course,
      yearLevel: yearLevel,
      createdAt: new Date()
    });
    setName("");
    setCourse("");
    setYearLevel("");
    fetchRecords();
  };

  const fetchRecords = async () => {
    const data = await getDocs(recordsCollection);
    setRecords(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteRecord = async (id) => {
    const recordDoc = doc(db, "students", id);
    await deleteDoc(recordDoc);
    fetchRecords();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchRecords(); }, []);

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <h1>WARD React App</h1>
          <p className="subtitle">Student Record Form</p>
        </div>

        <div className="form">
          <input
            type="text"
            placeholder="Full Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Course..."
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <select
            value={yearLevel}
            onChange={(e) => setYearLevel(e.target.value)}
          >
            <option value="">Select Year Level...</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
          <button onClick={addRecord}>Save Record</button>
        </div>

        <div className="notes-list">
          {records.length === 0 && (
            <p className="empty">No records yet. Add one above.</p>
          )}
          {records.map((r) => (
            <div className="note-item" key={r.id}>
              <div className="note-content">
                <span className="note-title">{r.name}</span>
                <span className="note-text">{r.course} — {r.yearLevel}</span>
              </div>
              <button className="delete-btn" onClick={() => deleteRecord(r.id)}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;