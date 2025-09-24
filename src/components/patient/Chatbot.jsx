import React, { useState } from 'react'

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you with your medication?', sender: 'bot' }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: input, sender: 'user' }])
      setInput('')
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { id: prev.length + 1, text: 'I understand. Let me check that for you.', sender: 'bot' }])
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col h-64">
      <div className="flex-1 overflow-y-auto space-y-2 p-2 border border-gray-200 rounded">
        {messages.map((message) => (
          <div key={message.id} className={`p-2 rounded ${message.sender === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'}`}>
            <p className="text-sm">{message.text}</p>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Ask about your medication..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chatbot
