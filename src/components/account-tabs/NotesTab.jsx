import { useState, useEffect } from 'react'

function getStorageKey(uid) {
  return `notes_${uid}`
}

function loadNotes(uid) {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey(uid))) || []
  } catch { return [] }
}

function saveNotes(uid, notes) {
  localStorage.setItem(getStorageKey(uid), JSON.stringify(notes))
}

export default function NotesTab({ uid }) {
  const [notes, setNotes] = useState(() => loadNotes(uid))
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    setNotes(loadNotes(uid))
    setActiveId(null)
  }, [uid])

  const activeNote = notes.find(n => n.id === activeId)

  const addNote = () => {
    const newNote = { id: Date.now(), title: 'Untitled', body: '', createdAt: new Date().toISOString() }
    const updated = [newNote, ...notes]
    setNotes(updated)
    saveNotes(uid, updated)
    setActiveId(newNote.id)
  }

  const updateTitle = (title) => {
    const updated = notes.map(n => {
      if (n.id !== activeId) return n
      return { ...n, title }
    })
    setNotes(updated)
    saveNotes(uid, updated)
  }

  const updateBody = (body) => {
    const updated = notes.map(n => {
      if (n.id !== activeId) return n
      return { ...n, body }
    })
    setNotes(updated)
    saveNotes(uid, updated)
  }

  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    saveNotes(uid, updated)
    if (activeId === id) setActiveId(null)
  }

  return (
    <div className="notes-layout">
      <div className="notes-sidebar">
        <button className="notes-add-btn" onClick={addNote}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Note
        </button>
        <div className="notes-list">
          {notes.length === 0 && <div className="notes-empty">No notes yet.</div>}
          {notes.map(note => (
            <div
              key={note.id}
              className={`notes-item${activeId === note.id ? ' active' : ''}`}
              onClick={() => setActiveId(note.id)}
            >
              <div className="notes-item-title">{note.title}</div>
              <div className="notes-item-preview">{note.body ? note.body.slice(0, 40) : 'Empty note'}</div>
              <button className="notes-item-delete" onClick={(e) => { e.stopPropagation(); deleteNote(note.id) }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="notes-editor">
        {activeNote ? (
          <div className="notes-editor-inner">
            <input
              className="notes-title-input"
              type="text"
              value={activeNote.title}
              onChange={e => updateTitle(e.target.value)}
              placeholder="Note title..."
            />
            <textarea
              className="notes-textarea"
              placeholder="Start writing..."
              value={activeNote.body}
              onChange={e => updateBody(e.target.value)}
            />
          </div>
        ) : (
          <div className="notes-placeholder">Select a note or create a new one.</div>
        )}
      </div>
    </div>
  )
}
