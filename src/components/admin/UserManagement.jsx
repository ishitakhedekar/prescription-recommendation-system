import React, { useState } from 'react'

const UserManagement = () => {
  const [users] = useState([
    { id: 1, name: 'Dr. Smith', role: 'Doctor', status: 'Active' },
    { id: 2, name: 'John Doe', role: 'Patient', status: 'Active' },
    { id: 3, name: 'Jane Smith', role: 'Patient', status: 'Inactive' },
  ])

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-600">Role: {user.role}</p>
          <p className="text-sm text-gray-600">Status: {user.status}</p>
          <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
            Edit
          </button>
        </div>
      ))}
    </div>
  )
}

export default UserManagement
