import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import './AIChatbot.css'

const RESPONSES = {
  default: "Hi! I'm Aria, your HumanForce AI assistant. How can I help you today?",
  hi: "Hello! 👋 I'm here to help you find the perfect human service. What are you looking for?",
  services: "We offer Personal Assistant, Business Assistant, Marketing Support, Customer Support, Sales Support, Travel Assistant, Event Support, and more! Which interests you?",
  price: "Our pricing starts from $29/hr for basic services. We also have monthly packages from $499. Check our Pricing page for details!",
  how: "It's simple! 1) Select a service, 2) Customize your requirements, 3) Get matched instantly, 4) Start working. Want to get started?",
  contact: "You can reach us at hello@humanforce.ai or call +1-800-123-4567. Or I can connect you with a specialist!",
}

function getReply(msg) {
  const m = msg.toLowerCase()
  if (m.includes('hi') || m.includes('hello') || m.includes('hey')) return RESPONSES.hi
  if (m.includes('service') || m.includes('what do')) return RESPONSES.services
  if (m.includes('price') || m.includes('cost') || m.includes('how much')) return RESPONSES.price
  if (m.includes('how') || m.includes('work')) return RESPONSES.how
  if (m.includes('contact') || m.includes('email') || m.includes('phone')) return RESPONSES.contact
  return "Great question! Our team of AI-matched professionals can help with that. Would you like me to connect you with a specialist, or browse our services?"
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ from: 'bot', text: RESPONSES.default }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(m => [...m, { from: 'user', text: userMsg }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages(m => [...m, { from: 'bot', text: getReply(userMsg) }])
      setTyping(false)
    }, 900)
  }

  const handleKey = e => { if (e.key === 'Enter') send() }

  return (
    <div className="chatbot-wrapper">
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <div className="chatbot-avatar"><Bot size={18} /></div>
            <div>
              <div className="chatbot-name">Aria <span className="chatbot-online">● Online</span></div>
              <div className="chatbot-subtitle">HumanForce AI Assistant</div>
            </div>
            <button onClick={() => setOpen(false)} className="chatbot-close"><X size={18} /></button>
          </div>
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>
                {m.from === 'bot' && <div className="msg-avatar-bot"><Bot size={12} /></div>}
                <div className="msg-bubble">{m.text}</div>
              </div>
            ))}
            {typing && (
              <div className="chat-msg bot">
                <div className="msg-avatar-bot"><Bot size={12} /></div>
                <div className="msg-bubble typing"><span/><span/><span/></div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="chatbot-input">
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey} placeholder="Ask me anything..."
              className="form-input"
            />
            <button onClick={send} className="btn-primary chatbot-send"><Send size={16} /></button>
          </div>
        </div>
      )}
      <button className="chatbot-fab" onClick={() => setOpen(!open)} aria-label="Open chat">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && <span className="chatbot-badge">1</span>}
      </button>
    </div>
  )
}
