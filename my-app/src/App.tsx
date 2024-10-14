import { Label, Note } from "./types"; // Import the Label type from the appropriate module
import { dummyNotesList } from "./constants";
import './App.css';
import { useContext, useState } from "react";
import { ClickCounter, ToggleTheme } from "./hookExercise";
import { ThemeContext, themes } from "./themeContext";

function App() {
  const initialNote = {
    id: -1,
    title: "",
    content: "",
    label: Label.other,
  };

  const [favorites, setFavorites] = useState<Set<number>>(new Set<number>());
  const [curId, setCurId] = useState(dummyNotesList.length)
  const [notes, setNotes] = useState(dummyNotesList);
  const [createNote, setCreateNote] = useState(initialNote);
  const [selectedNote, setSelectedNote] = useState<Note>(initialNote);
  const [currentTheme, setCurrentTheme] = useState(themes.light);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === themes.light ? themes.dark : themes.light);
  };
  
  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites); // Create a new Set

    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }

    setFavorites(newFavorites);
  }

  const convertToLabel = (label: string) => {
    switch(label) {
      case 'personal':
        return Label.personal;
      case 'study':
        return Label.study;
      case 'work':
        return Label.work;
      case 'other':
        return Label.other;
      default:
        return Label.other
    }
  }

  const createNoteHandler = (event: React.FormEvent) => {
    event.preventDefault();
    createNote.id = curId+1;
    const newNotes = notes.map(x => x);
    newNotes.push(createNote);
    setNotes(newNotes);
    setCurId(curId+1);
    setCreateNote(initialNote);
  }

  const deleteNote = (id: number) => {
    setNotes(notes.filter(x => x.id != id));
  }

  return (
    <div className='app-container'>
      <div/>
      <button onClick={toggleTheme}> Toggle Theme </button>
      <form className="note-form" onSubmit={createNoteHandler}>
        <div>
          <input
            placeholder="Note Title"
            onChange={(event) =>
              setCreateNote({ ...createNote, title: event.target.value })}
            required>
          </input>
        </div>

        <div>
          <textarea
            onChange={(event) =>
              setCreateNote({ ...createNote, content: event.target.value })}
            required>
          </textarea>
        </div>

        <div>
          <select
            onChange={(event) =>
              setCreateNote({ ...createNote, label: convertToLabel(event.target.value) })}
            required>
            <option value={Label.personal}>Personal</option>
            <option value={Label.study}>Study</option>
            <option value={Label.work}>Work</option>
            <option value={Label.other}>Other</option>
          </select>
        </div>

        <div><button type="submit">Create Note</button></div>
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-item"
            style={{
              background: currentTheme.background,
              color: currentTheme.foreground,
              padding: "20px",
            }}>
            <div className="notes-header">
              <button
                id="fav-button"
                onClick={() => toggleFavorite(note.id)}>
                {favorites.has(note.id) ? "❤️" : "🤍"}
              </button>
              <button onClick={() => {deleteNote(note.id)}}>x</button>
            </div>
            <h2 contentEditable="true"> {note.title} </h2>
            <p contentEditable="true"> {note.content} </p>
            <p contentEditable="true"> {note.label} </p>
          </div>
        ))}
      </div>

      <div>
        <h1>List of favorites</h1>
        <ul>
          {Array.from(favorites.keys()).map((id: number) => <li>{notes.find(x => x.id == id)?.title}</li>)}
        </ul>
      </div>
    </div>

  );
}

export default App;