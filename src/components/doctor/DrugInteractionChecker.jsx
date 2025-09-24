import React, { useState } from 'react'

const DrugInteractionChecker = () => {
  const [drug1, setDrug1] = useState('')
  const [drug2, setDrug2] = useState('')
  const [result, setResult] = useState('')

  const handleCheck = () => {
    // Simulate drug interaction check
    setResult('No known interactions between these drugs.')
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Drug 1</label>
        <input
          type="text"
          value={drug1}
          onChange={(e) => setDrug1(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter first drug"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Drug 2</label>
        <input
          type="text"
          value={drug2}
          onChange={(e) => setDrug2(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter second drug"
        />
      </div>
      <button
        onClick={handleCheck}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
      >
        Check Interactions
      </button>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p>{result}</p>
        </div>
      )}
    </div>
  )
}

export default DrugInteractionChecker
