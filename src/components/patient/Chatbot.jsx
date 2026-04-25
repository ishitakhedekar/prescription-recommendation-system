import React, { useState, useEffect, useRef } from 'react'
import API from '../../api/axios'

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm MediBot, your medical assistant. I can help you understand your medications, dosages, side effects, and general health questions. How can I help you today?",
      sender: 'bot'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [prescriptions, setPrescriptions] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await API.get('/patients/prescriptions')
        setPrescriptions(res.data.data || [])
      } catch (err) {
        console.error('Could not load prescriptions for context')
      }
    }
    fetchPrescriptions()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const buildSystemPrompt = () => {
    let prompt = `You are MediBot, a helpful medical assistant integrated into MediScript, a digital prescription management system. You help patients understand their medications, dosages, side effects, drug interactions, and general health questions.

Important guidelines:
- Be helpful, clear, and compassionate
- Always recommend consulting their doctor for serious concerns
- Keep responses concise and easy to understand
- Never diagnose conditions or replace professional medical advice
- If asked about something outside medical topics, politely redirect to health-related questions`

    if (prescriptions.length > 0) {
      prompt += `\n\nThe patient's current prescriptions are:\n`
      prescriptions.forEach((rx, i) => {
        prompt += `\nPrescription ${i + 1}: ${rx.diagnosis}\n`
        rx.medications?.forEach(med => {
          prompt += `  - ${med.name} ${med.dosage}, ${med.frequency} for ${med.duration}`
          if (med.instructions) prompt += ` (${med.instructions})`
          prompt += '\n'
        })
      })
      prompt += `\nUse this context to give personalized answers when relevant.`
    }

    return prompt
  }

  const buildConversationHistory = (currentMessages) => {
    return currentMessages
      .slice(1)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = { id: messages.length + 1, text: input.trim(), sender: 'user' }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await API.post('/recommendations/chat', {
        systemPrompt: buildSystemPrompt(),
        messages: [
          ...buildConversationHistory(updatedMessages),
          { role: 'user', content: input.trim() }
        ]
      })

      const botReply = response.data.reply || "I'm sorry, I couldn't process that. Please try again."
      setMessages(prev => [...prev, { id: prev.length + 1, text: botReply, sender: 'bot' }])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([{
      id: 1,
      text: "Hello! I'm MediBot, your medical assistant. How can I help you today?",
      sender: 'bot'
    }])
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <p className="font-semibold text-gray-800">MediBot</p>
            <p className="text-xs text-green-600 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
              <span>Online — Powered by AI</span>
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1 rounded-lg transition"
        >
          Clear chat
        </button>
      </div>

      {prescriptions.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700">
          💊 MediBot has access to your {prescriptions.length} prescription{prescriptions.length > 1 ? 's' : ''} for personalized answers
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 p-3 border border-gray-200 rounded-xl bg-gray-50 min-h-80 max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                🤖
              </div>
            )}
            <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              message.sender === 'user'
                ? 'bg-green-600 text-white rounded-tr-sm'
                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm'
            }`}>
              {message.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-sm mr-2 flex-shrink-0">
              🤖
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
          placeholder="Ask about your medications, side effects, dosage..."
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50 flex-shrink-0"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        MediBot provides general information only. Always consult your doctor for medical decisions.
      </p>
    </div>
  )
}

export default Chatbot
