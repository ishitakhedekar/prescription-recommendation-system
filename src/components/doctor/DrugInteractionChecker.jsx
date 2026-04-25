import React, { useState } from 'react'

const DrugInteractionChecker = () => {
  const [drugs, setDrugs] = useState(['', ''])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('pairs')

  const addDrug = () => {
    if (drugs.length < 6) setDrugs([...drugs, ''])
  }

  const removeDrug = (index) => {
    if (drugs.length > 2) setDrugs(drugs.filter((_, i) => i !== index))
  }

  const updateDrug = (index, value) => {
    const updated = [...drugs]
    updated[index] = value
    setDrugs(updated)
  }

  const searchDrug = async (drugName) => {
    const res = await fetch(
      `https://api.fda.gov/drug/label.json?search=drug_interactions:"${encodeURIComponent(drugName)}"&limit=1`
    )
    if (!res.ok) throw new Error(`No data found for ${drugName}`)
    const data = await res.json()
    return data.results?.[0]
  }

  const handleCheck = async () => {
    const filledDrugs = drugs.filter(d => d.trim())
    if (filledDrugs.length < 2) return setError('Please enter at least 2 drug names')
    setLoading(true)
    setError('')
    setResults(null)

    try {
      const drugData = await Promise.all(filledDrugs.map(d => searchDrug(d)))

      const interactions = []
      for (let i = 0; i < filledDrugs.length; i++) {
        for (let j = i + 1; j < filledDrugs.length; j++) {
          const drug1Text = drugData[i]?.drug_interactions?.[0] || ''
          const drug2Text = drugData[j]?.drug_interactions?.[0] || ''
          const found =
            drug1Text.toLowerCase().includes(filledDrugs[j].toLowerCase()) ||
            drug2Text.toLowerCase().includes(filledDrugs[i].toLowerCase())

          interactions.push({
            drug1: filledDrugs[i],
            drug2: filledDrugs[j],
            hasInteraction: found,
          })
        }
      }

      const drugDetails = filledDrugs.map((name, i) => ({
        name,
        brandName: drugData[i]?.openfda?.brand_name?.[0] || name,
        interactions: drugData[i]?.drug_interactions?.[0]?.slice(0, 600) || 'No interaction data available.',
        warnings: drugData[i]?.warnings?.[0]?.slice(0, 300) || null,
        manufacturer: drugData[i]?.openfda?.manufacturer_name?.[0] || null,
        route: drugData[i]?.openfda?.route?.[0] || null,
        dosageForm: drugData[i]?.openfda?.dosage_form?.[0] || null,
      }))

      setResults({ interactions, drugDetails })
      setActiveTab('pairs')
    } catch (err) {
      setError('Could not find one or more drugs. Try generic names like "ibuprofen" or "amoxicillin".')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setDrugs(['', ''])
    setResults(null)
    setError('')
  }

  const interactionCount = results?.interactions.filter(i => i.hasInteraction).length || 0
  const totalPairs = results?.interactions.length || 0

  return (
    <div style={{ fontFamily: "'Georgia', serif" }} className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header banner */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Drug Interaction Checker</h1>
              <p className="text-red-200 text-sm mt-1">Powered by OpenFDA Drug Label Database</p>
            </div>
            <div className="text-5xl opacity-20">💊</div>
          </div>
          {results && (
            <div className="mt-4 flex space-x-4">
              <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 text-center">
                <p className="text-2xl font-bold">{drugs.filter(d => d.trim()).length}</p>
                <p className="text-red-200 text-xs">Drugs Checked</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 text-center">
                <p className="text-2xl font-bold">{totalPairs}</p>
                <p className="text-red-200 text-xs">Pairs Analyzed</p>
              </div>
              <div className={`rounded-xl px-4 py-2 text-center ${interactionCount > 0 ? 'bg-yellow-400 bg-opacity-30' : 'bg-green-400 bg-opacity-30'}`}>
                <p className="text-2xl font-bold">{interactionCount}</p>
                <p className="text-red-200 text-xs">Interactions Found</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Input panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Enter Medications</h2>

              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded-r text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                {drugs.map((drug, index) => (
                  <div key={index} className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={drug}
                      onChange={(e) => updateDrug(index, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                      placeholder={index === 0 ? 'e.g. ibuprofen' : index === 1 ? 'e.g. aspirin' : 'e.g. metformin'}
                      className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    />
                    {drugs.length > 2 && (
                      <button
                        onClick={() => removeDrug(index)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 text-lg font-bold transition"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {drugs.length < 6 && (
                <button
                  onClick={addDrug}
                  className="mt-3 w-full border border-dashed border-gray-300 text-gray-400 hover:border-red-400 hover:text-red-500 text-sm py-2 rounded-lg transition"
                >
                  + Add Drug ({drugs.length}/6)
                </button>
              )}

              <button
                onClick={handleCheck}
                disabled={loading}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="animate-spin">⟳</span>
                    <span>Analyzing...</span>
                  </span>
                ) : 'Check Interactions'}
              </button>

              {results && (
                <button
                  onClick={handleReset}
                  className="mt-2 w-full border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm py-2 rounded-xl transition"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Quick guide */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">💡 Tips</p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Use generic names for best results</li>
                <li>• e.g. "ibuprofen" not "Advil"</li>
                <li>• Check up to 6 drugs at once</li>
                <li>• Press Enter to check quickly</li>
                <li>• Always verify with clinical judgment</li>
              </ul>
            </div>
          </div>

          {/* Right — Results panel */}
          <div className="lg:col-span-2">
            {!results && !loading && (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 shadow-sm flex flex-col items-center justify-center text-center h-full">
                <div className="text-6xl mb-4 opacity-20">🔬</div>
                <p className="text-gray-400 font-medium">Enter at least 2 drug names and click Check Interactions</p>
                <p className="text-gray-300 text-sm mt-2">Results will appear here</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 shadow-sm flex flex-col items-center justify-center h-full">
                <div className="text-4xl animate-bounce mb-4">🔬</div>
                <p className="text-gray-500 font-medium">Querying FDA database...</p>
                <p className="text-gray-300 text-sm mt-2">This may take a few seconds</p>
              </div>
            )}

            {results && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Overall verdict */}
                <div className={`px-6 py-4 ${interactionCount > 0 ? 'bg-red-50 border-b border-red-100' : 'bg-green-50 border-b border-green-100'}`}>
                  <p className={`font-bold text-lg ${interactionCount > 0 ? 'text-red-700' : 'text-green-700'}`}>
                    {interactionCount > 0
                      ? `⚠️ ${interactionCount} potential interaction${interactionCount > 1 ? 's' : ''} detected across ${totalPairs} pair${totalPairs > 1 ? 's' : ''}`
                      : `✅ No direct interactions found across ${totalPairs} pair${totalPairs > 1 ? 's' : ''}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Source: OpenFDA. For clinical use only — always consult pharmacological references.</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                  {['pairs', 'details'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-sm font-semibold capitalize transition ${activeTab === tab ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {tab === 'pairs' ? `Interaction Pairs (${totalPairs})` : `Drug Details (${results.drugDetails.length})`}
                    </button>
                  ))}
                </div>

                <div className="p-5">
                  {/* Pairs tab */}
                  {activeTab === 'pairs' && (
                    <div className="space-y-3">
                      {results.interactions.map((pair, i) => (
                        <div key={i} className={`rounded-xl border p-4 ${pair.hasInteraction ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <span className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">{pair.drug1}</span>
                                <span className="text-gray-400 text-xs font-bold">↔</span>
                                <span className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">{pair.drug2}</span>
                              </div>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${pair.hasInteraction ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {pair.hasInteraction ? '⚠️ Interaction' : '✅ Clear'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Details tab */}
                  {activeTab === 'details' && (
                    <div className="space-y-4">
                      {results.drugDetails.map((drug, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                          {/* Drug header */}
                          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-100">
                            <div>
                              <p className="font-bold text-gray-800 capitalize">{drug.name}</p>
                              {drug.brandName !== drug.name && (
                                <p className="text-xs text-blue-600">Brand: {drug.brandName}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {drug.route && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">{drug.route}</span>
                              )}
                              {drug.dosageForm && (
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full capitalize">{drug.dosageForm}</span>
                              )}
                            </div>
                          </div>

                          <div className="p-4 space-y-3">
                            {drug.manufacturer && (
                              <p className="text-xs text-gray-400">Manufacturer: {drug.manufacturer}</p>
                            )}

                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Interaction Notes</p>
                              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                                {drug.interactions}
                              </p>
                            </div>

                            {drug.warnings && (
                              <div>
                                <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-1">⚠️ Warnings</p>
                                <p className="text-xs text-gray-600 leading-relaxed bg-orange-50 p-3 rounded-lg border border-orange-100">
                                  {drug.warnings}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DrugInteractionChecker