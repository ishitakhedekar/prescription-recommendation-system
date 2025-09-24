import React from 'react'

const InsurancePharmacy = () => {
  return (
    <div className="space-y-4">
      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
        Check Insurance Coverage
      </button>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
        Find Nearby Pharmacies
      </button>
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">Insurance and pharmacy information will appear here</p>
      </div>
    </div>
  )
}

export default InsurancePharmacy
