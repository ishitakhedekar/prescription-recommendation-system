import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'patient', phone: '',
    specialization: '', licenseNumber: '', hospital: '',
    dateOfBirth: '', gender: '', bloodGroup: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await API.post('/auth/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1"

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 flex-col justify-between p-12">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-700 text-xl">🏥</span>
          </div>
          <span className="text-white text-xl font-bold tracking-wide">MediScript</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Join the future<br />
            <span className="text-blue-200">of healthcare.</span>
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Register as a doctor or patient and be part of a smarter, faster prescription management system.
          </p>
        </div>
        <p className="text-blue-400 text-sm">© 2026 MediScript. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="text-gray-500 mt-2">Fill in your details to get started</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Full Name</label>
                <input name="name" type="text" required value={form.name} onChange={handleChange} className={inputClass} placeholder="John Doe" />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Email</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input name="password" type="password" required minLength={6} value={form.password} onChange={handleChange} className={inputClass} placeholder="••••••••" />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input name="phone" type="text" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+91 9999999999" />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Role</label>
                <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
            </div>

            {/* Doctor fields */}
            {form.role === 'doctor' && (
              <div className="space-y-4 border-t border-blue-100 pt-4">
                <p className="text-sm font-bold text-blue-700 uppercase tracking-wide">Doctor Details</p>
                <div>
                  <label className={labelClass}>Specialization</label>
                  <input name="specialization" type="text" value={form.specialization} onChange={handleChange} className={inputClass} placeholder="e.g. Cardiologist" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>License Number</label>
                    <input name="licenseNumber" type="text" value={form.licenseNumber} onChange={handleChange} className={inputClass} placeholder="MCI-12345" />
                  </div>
                  <div>
                    <label className={labelClass}>Hospital</label>
                    <input name="hospital" type="text" value={form.hospital} onChange={handleChange} className={inputClass} placeholder="Hospital name" />
                  </div>
                </div>
              </div>
            )}

            {/* Patient fields */}
            {form.role === 'patient' && (
              <div className="space-y-4 border-t border-blue-100 pt-4">
                <p className="text-sm font-bold text-blue-700 uppercase tracking-wide">Patient Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Blood Group</label>
                    <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={inputClass}>
                      <option value="">Select blood group</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-700 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register