import React, { useState, useEffect } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const PatientProfile = () => {
  const { user, login } = useAuth()
  const [form, setForm] = useState({
    name: '', phone: '', dateOfBirth: '', gender: '', bloodGroup: '', allergies: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/patients/profile')
        const d = res.data.data
        setForm({
          name: d.name || '',
          phone: d.phone || '',
          dateOfBirth: d.dateOfBirth ? d.dateOfBirth.split('T')[0] : '',
          gender: d.gender || '',
          bloodGroup: d.bloodGroup || '',
          allergies: d.allergies?.join(', ') || '',
        })
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await API.put('/patients/profile', {
        ...form,
        allergies: form.allergies.split(',').map(a => a.trim()).filter(Boolean),
      })
      setSuccess('Profile updated successfully!')
      login({ ...user, name: form.name }, localStorage.getItem('token'))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
  const labelClass = "block text-sm font-semibold text-gray-700"

  if (loading) return <p className="text-sm text-gray-500">Loading profile...</p>

  return (
    <div className="max-w-2xl">
      {success && <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-r text-sm">{success}</div>}
      {error && <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Patient</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Full Name</label>
            <input name="name" type="text" value={form.name} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input name="phone" type="text" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+91 9999999999" />
          </div>
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Blood Group</label>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={inputClass}>
              <option value="">Select blood group</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Allergies <span className="text-gray-400 font-normal text-xs">(comma separated)</span></label>
            <input name="allergies" type="text" value={form.allergies} onChange={handleChange} className={inputClass} placeholder="e.g. Penicillin, Aspirin" />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

export default PatientProfile