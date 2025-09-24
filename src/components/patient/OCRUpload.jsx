import React, { useState } from 'react'

const OCRUpload = () => {
  const [file, setFile] = useState(null)
  const [ocrResult, setOcrResult] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = () => {
    // Simulate OCR processing
    setOcrResult('OCR Result: Amoxicillin 500mg, Take twice daily')
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Prescription Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Process OCR
      </button>
      {ocrResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p>{ocrResult}</p>
        </div>
      )}
    </div>
  )
}

export default OCRUpload
