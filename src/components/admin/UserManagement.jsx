import React, { useState, useEffect } from 'react'
import API from '../../api/axios'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')
  const [assigningId, setAssigningId] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState({})

  const fetchUsers = async () => {
    try {
      const url = filter ? `/admin/users?role=${filter}` : '/admin/users'
      const res = await API.get(url)
      setUsers(res.data.data)
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctors = async () => {
    try {
      const res = await API.get('/admin/users?role=doctor')
      setDoctors(res.data.data)
    } catch (err) {
      console.error('Failed to load doctors')
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchDoctors()
  }, [filter])

  const handleToggle = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/toggle-status`)
      fetchUsers()
    } catch (err) {
      alert('Failed to update user status')
    }
  }

  const handleAssignDoctor = async (patientId) => {
    const doctorId = selectedDoctor[patientId]
    if (!doctorId) return alert('Please select a doctor first')

    try {
      await API.put(`/admin/patients/${patientId}/assign-doctor`, { doctorId })
      alert('Doctor assigned successfully!')
      fetchUsers()
    } catch (err) {
      alert('Failed to assign doctor')
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading users...</p>
  if (error) return <p className="text-sm text-red-500">{error}</p>

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex space-x-2">
        {['', 'doctor', 'patient', 'admin'].map((role) => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            className={`px-3 py-1 rounded text-sm capitalize ${
              filter === role ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {role === '' ? 'All' : role}
          </button>
        ))}
      </div>

      {users.length === 0 ? (
        <p className="text-sm text-gray-500">No users found.</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600 capitalize">Role: {user.role}</p>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button
                onClick={() => handleToggle(user._id)}
                className={`px-3 py-1 rounded text-sm text-white ${
                  user.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {user.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>

            {/* Assign doctor — only show for patients */}
            {user.role === 'patient' && (
              <div className="flex items-center space-x-2 border-t pt-3">
                <div className="flex-1">
                  <select
                    value={selectedDoctor[user._id] || ''}
                    onChange={(e) => setSelectedDoctor({ ...selectedDoctor, [user._id]: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">
                      {user.assignedDoctor ? 'Reassign doctor' : 'Select a doctor'}
                    </option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name} {doc.specialization ? `— ${doc.specialization}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => handleAssignDoctor(user._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  {user.assignedDoctor ? 'Reassign' : 'Assign'}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default UserManagement