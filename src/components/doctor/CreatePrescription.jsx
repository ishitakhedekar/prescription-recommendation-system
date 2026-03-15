import React, { useState, useEffect } from 'react'
import API from '../../api/axios'

const CreatePrescription = () => {
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState({
    patientId: '',
    symptoms: '',
    diagnosis: '',
    notes: '',
    followUpDate: '',
  })
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get('/doctors/patients')
        setPatients(res.data.data)
      } catch (err) {
        console.error('Failed to load patients')
      }
    }
    fetchPatients()
  }, [])

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleMedChange = (index, e) => {
    const updated = [...medications]
    updated[index][e.target.name] = e.target.value
    setMedications(updated)
  }

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }])
  }

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await API.post('/prescriptions', {
        patientId: form.patientId,
        symptoms: form.symptoms.split(',').map(s => s.trim()),
        diagnosis: form.diagnosis,
        medications,
        notes: form.notes,
        followUpDate: form.followUpDate || undefined,
      })
      setSuccess('Prescription created successfully!')
      setForm({ patientId: '', symptoms: '', diagnosis: '', notes: '', followUpDate: '' })
      setMedications([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create prescription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded">{success}</div>}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Patient</label>
        <select
          name="patientId"
          value={form.patientId}
          onChange={handleFormChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a patient</option>
          {patients.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Symptoms <span className="text-gray-400 text-xs">(comma separated)</span></label>
        <input
          type="text"
          name="symptoms"
          value={form.symptoms}
          onChange={handleFormChange}
          placeholder="e.g. fever, headache, cough"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
        <input
          type="text"
          name="diagnosis"
          value={form.diagnosis}
          onChange={handleFormChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Medications</label>
        {medications.map((med, index) => (
          <div key={index} className="border border-gray-200 rounded p-3 mb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                name="name"
                value={med.name}
                onChange={(e) => handleMedChange(index, e)}
                placeholder="Drug name"
                required
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <input
                name="dosage"
                value={med.dosage}
                onChange={(e) => handleMedChange(index, e)}
                placeholder="Dosage (e.g. 500mg)"
                required
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <input
                name="frequency"
                value={med.frequency}
                onChange={(e) => handleMedChange(index, e)}
                placeholder="Frequency (e.g. Twice daily)"
                required
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <input
                name="duration"
                value={med.duration}
                onChange={(e) => handleMedChange(index, e)}
                placeholder="Duration (e.g. 7 days)"
                required
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <input
              name="instructions"
              value={med.instructions}
              onChange={(e) => handleMedChange(index, e)}
              placeholder="Instructions (e.g. Take after meals)"
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
            {medications.length > 1 && (
              <button type="button" onClick={() => removeMedication(index)} className="text-red-500 text-xs">
                Remove medication
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addMedication} className="text-blue-600 text-sm hover:underline">
          + Add another medication
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleFormChange}
          rows={2}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Follow-up Date</label>
        <input
          type="date"
          name="followUpDate"
          value={form.followUpDate}
          onChange={handleFormChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Prescription'}
      </button>
    </form>
  )
}

export default CreatePrescription