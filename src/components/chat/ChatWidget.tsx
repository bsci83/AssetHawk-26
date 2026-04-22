'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatWidgetProps {
  ctrlAUrl?: string
  appKey?: string
  businessName?: string
  position?: 'bottom-right' | 'bottom-left'
}

export default function ChatWidget({
  ctrlAUrl = 'https://ctrl-a-workspace.onrender.com',
  appKey = 'assethawk-customer-chat',
  businessName = 'AssetHawk Assistant',
  position = 'bottom-right'
}: ChatWidgetProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [open, messages])

  async function sendMessage() {
    if (!input.trim() || loading) return
    
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch(`${ctrlAUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${appKey}`
        },
        body: JSON.stringify({
          model: 'MiniMax-M2.7',
          messages: [
            { role: 'system', content: `You are ${businessName}, a helpful AI assistant. Be friendly, concise, and helpful.` },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMsg }
          ],
          max_tokens: 500,
          stream: false
        })
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'
      
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I am having trouble connecting. Please try again in a moment.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const positionClass = position === 'bottom-right' ? 'right-6 bottom-6' : 'left-6 bottom-6'

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div 
          className={`absolute ${positionClass} w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden`}
          style={{ height: '500px', maxHeight: '80vh' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold text-sm">{businessName}</span>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bot className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Ask me anything about what you scanned!</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-purple-600' : 'bg-gray-200'
                }`}>
                  {msg.role === 'user' 
                    ? <User className="w-4 h-4 text-white" />
                    : <Bot className="w-4 h-4 text-gray-600" />
                  }
                </div>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-sm' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-2xl rounded-tl-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`absolute ${positionClass} w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50`}
        style={{ boxShadow: '0 4px 20px rgba(109, 40, 217, 0.4)' }}
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
          </>
        )}
      </button>
    </>
  )
}