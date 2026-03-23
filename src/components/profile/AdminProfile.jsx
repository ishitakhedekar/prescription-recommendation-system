import React, { useState } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const AdminProfile = () => {
  const { user, login } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await API.put('/auth/me', form)
      setSuccess('Profile updated successfully!')
      login({ ...user, name: form.name }, localStorage.getItem('token'))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm"
  const labelClass = "block text-sm font-semibold text-gray-700"

  return (
    <div className="max-w-2xl">
      {success && <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-r text-sm">{success}</div>}
      {error && <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl">
            ⚙️
          </div>
          <div>
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Admin</span>
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
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

export default AdminProfile