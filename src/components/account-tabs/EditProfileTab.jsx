import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function EditProfileTab() {
  const { staffProfile, updateProfile } = useAuth()
  const [form, setForm] = useState({
    displayName: staffProfile?.displayName || '',
    age: staffProfile?.age || '',
    sex: staffProfile?.sex || '',
    birthday: staffProfile?.birthday || '',
    photoURL: staffProfile?.photoURL || ''
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleBirthdayInput = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 8)
    if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2)
    if (val.length > 5) val = val.slice(0, 5) + '/' + val.slice(5)
    setForm(f => ({ ...f, birthday: val }))
  }

  const handleSave = async () => {
    if (form.birthday.trim()) {
      const parts = form.birthday.split('/')
      if (parts.length !== 3) return
      const month = parseInt(parts[0], 10)
      const day = parseInt(parts[1], 10)
      const year = parseInt(parts[2], 10)
      if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > new Date().getFullYear()) return
      const dateObj = new Date(year, month - 1, day)
      if (dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) return
    }
    setSaving(true)
    setSaved(false)
    const { error } = await updateProfile({
      displayName: form.displayName,
      age: form.age ? Number(form.age) : null,
      sex: form.sex || null,
      birthday: form.birthday || null,
      photoURL: form.photoURL || null
    })
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="edit-profile-layout">
      <div className="edit-profile-form">
        <div className="edit-field">
          <label>Display Name</label>
          <input type="text" value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} />
        </div>
        <div className="edit-row">
          <div className="edit-field">
            <label>Age</label>
            <input type="number" min="16" max="100" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
          </div>
          <div className="edit-field">
            <label>Sex</label>
            <select value={form.sex} onChange={e => setForm(f => ({ ...f, sex: e.target.value }))}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div className="edit-field">
          <label>Birthday</label>
          <input type="text" placeholder="MM/DD/YYYY" maxLength="10" value={form.birthday} onChange={handleBirthdayInput} />
        </div>
        <div className="edit-field">
          <label>Photo URL</label>
          <input type="text" placeholder="https://..." value={form.photoURL} onChange={e => setForm(f => ({ ...f, photoURL: e.target.value }))} />
        </div>
        <div className="edit-actions">
          {saved && <span className="edit-saved-msg">Saved!</span>}
          <button className="edit-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
