import React, { useState, useEffect } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const DoctorProfile = () => {
  const { user, login } = useAuth()
  const [form, setForm] = useState({
    name: '', phone: '', specialization: '', hospital: '', licenseNumber: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/doctors/profile')
        const d = res.data.data
        setForm({
          name: d.name || '',
          phone: d.phone || '',
          specialization: d.specialization || '',
          hospital: d.hospital || '',
          licenseNumber: d.licenseNumber || '',
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
      await API.put('/doctors/profile', form)
      setSuccess('Profile updated successfully!')
      login({ ...user, name: form.name }, localStorage.getItem('token'))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
  const labelClass = "block text-sm font-semibold text-gray-700"

  if (loading) return <p className="text-sm text-gray-500">Loading profile...</p>

  return (
    <div className="max-w-2xl">
      {success && <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-r text-sm">{success}</div>}
      {error && <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
            👨‍⚕️
          </div>
          <div>
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Doctor</span>
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
            <label className={labelClass}>Specialization</label>
            <input name="specialization" type="text" value={form.specialization} onChange={handleChange} className={inputClass} placeholder="e.g. Cardiologist" />
          </div>
          <div>
            <label className={labelClass}>Hospital</label>
            <input name="hospital" type="text" value={form.hospital} onChange={handleChange} className={inputClass} placeholder="Hospital name" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>License Number</label>
            <input name="licenseNumber" type="text" value={form.licenseNumber} onChange={handleChange} className={inputClass} placeholder="MCI-12345" />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

export default DoctorProfile