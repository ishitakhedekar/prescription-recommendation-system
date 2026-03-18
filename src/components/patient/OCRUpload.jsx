import React, { useState } from 'react'
import Tesseract from 'tesseract.js'
import API from '../../api/axios'

const OCRUpload = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [ocrText, setOcrText] = useState('')
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [parsedData, setParsedData] = useState({
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    notes: '',
  })

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setOcrText('')
    setParsedData({
      diagnosis: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      notes: '',
    })
    setSuccess('')
    setError('')
  }

  const handleOCR = async () => {
    if (!file) return setError('Please select an image first')
    setProcessing(true)
    setError('')
    setProgress(0)

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        },
      })

      const text = result.data.text
      setOcrText(text)
      parseText(text)
    } catch (err) {
      setError('OCR failed. Please try a clearer image.')
    } finally {
      setProcessing(false)
    }
  }

  const parseText = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

    // Try to extract diagnosis
    let diagnosis = ''
    const diagnosisLine = lines.find(l =>
      /diagnosis|condition|impression|assessment/i.test(l)
    )
    if (diagnosisLine) {
      diagnosis = diagnosisLine.replace(/diagnosis|condition|impression|assessment/gi, '').replace(/[:\-]/g, '').trim()
    }

    // Try to extract medications — look for lines with dosage patterns like mg, ml, tablet
    const medLines = lines.filter(l =>
      /\d+\s*mg|\d+\s*ml|tablet|capsule|syrup|injection|drops/i.test(l)
    )

    const medications = medLines.length > 0
      ? medLines.map(line => {
          const dosageMatch = line.match(/\d+\s*(mg|ml|mcg)/i)
          const freqMatch = line.match(/once|twice|three times|daily|hourly|every \d+ hours/i)
          return {
            name: line.split(/\d/)[0].trim() || line,
            dosage: dosageMatch ? dosageMatch[0] : '',
            frequency: freqMatch ? freqMatch[0] : '',
            duration: '',
            instructions: '',
          }
        })
      : [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]

    setParsedData({
      diagnosis,
      medications,
      notes: text,
    })
  }

  const handleFieldChange = (e) => {
    setParsedData({ ...parsedData, [e.target.name]: e.target.value })
  }

  const handleMedChange = (index, e) => {
    const updated = [...parsedData.medications]
    updated[index][e.target.name] = e.target.value
    setParsedData({ ...parsedData, medications: updated })
  }

  const addMedication = () => {
    setParsedData({
      ...parsedData,
      medications: [...parsedData.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    })
  }

  const removeMedication = (index) => {
    setParsedData({
      ...parsedData,
      medications: parsedData.medications.filter((_, i) => i !== index),
    })
  }

  const handleSave = async () => {
    if (!parsedData.diagnosis) return setError('Please enter a diagnosis before saving')
    setSaving(true)
    setError('')

    try {
      await API.post('/prescriptions/ocr', {
        diagnosis: parsedData.diagnosis,
        medications: parsedData.medications,
        notes: parsedData.notes,
        rawText: ocrText,
      })
      setSuccess('Prescription saved successfully!')
      setFile(null)
      setPreview(null)
      setOcrText('')
      setParsedData({
        diagnosis: '',
        medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
        notes: '',
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save prescription')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {success && <div className="bg-green-100 text-green-700 px-4 py-3 rounded">{success}</div>}
      {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded">{error}</div>}

      {/* Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Prescription Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Image preview */}
      {preview && (
        <div>
          <img src={preview} alt="Preview" className="max-h-48 rounded border border-gray-200 object-contain" />
        </div>
      )}

      {/* OCR button */}
      {file && !ocrText && (
        <button
          onClick={handleOCR}
          disabled={processing}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 w-full"
        >
          {processing ? `Processing... ${progress}%` : 'Extract Text (OCR)'}
        </button>
      )}

      {/* Progress bar */}
      {processing && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Extracted text */}
      {ocrText && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Extracted Text</label>
          <textarea
            value={ocrText}
            readOnly
            rows={4}
            className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-sm text-gray-600"
          />
        </div>
      )}

      {/* Parsed & editable form */}
      {ocrText && (
        <div className="space-y-4 border-t pt-4">
          <p className="text-sm font-medium text-blue-600">Review & Edit Before Saving</p>

          <div>
            <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
            <input
              name="diagnosis"
              type="text"
              value={parsedData.diagnosis}
              onChange={handleFieldChange}
              placeholder="Enter diagnosis"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medications</label>
            {parsedData.medications.map((med, index) => (
              <div key={index} className="border border-gray-200 rounded p-3 mb-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    name="name"
                    value={med.name}
                    onChange={(e) => handleMedChange(index, e)}
                    placeholder="Drug name"
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    name="dosage"
                    value={med.dosage}
                    onChange={(e) => handleMedChange(index, e)}
                    placeholder="Dosage (e.g. 500mg)"
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    name="frequency"
                    value={med.frequency}
                    onChange={(e) => handleMedChange(index, e)}
                    placeholder="Frequency"
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    name="duration"
                    value={med.duration}
                    onChange={(e) => handleMedChange(index, e)}
                    placeholder="Duration"
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <input
                  name="instructions"
                  value={med.instructions}
                  onChange={(e) => handleMedChange(index, e)}
                  placeholder="Instructions"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
                {parsedData.medications.length > 1 && (
                  <button type="button" onClick={() => removeMedication(index)} className="text-red-500 text-xs">
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addMedication} className="text-blue-600 text-sm hover:underline">
              + Add medication
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={parsedData.notes}
              onChange={handleFieldChange}
              rows={2}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Prescription'}
          </button>
        </div>
      )}
    </div>
  )
}

export default OCRUpload