import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import './Categories.css'
import './Contact.css'

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [sent, setSent] = useState(false)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  const handle = e => { e.preventDefault(); setSent(true) }

  return (
    <main className="page-with-navbar">
      <div className="page-hero">
        <div className="container">
          <div className="section-tag" style={{display:'inline-flex',margin:'0 auto 16px'}}>Contact Us</div>
          <h1>Let's <span style={{color:'var(--primary)'}}>talk</span></h1>
          <p style={{fontSize:'1.05rem',color:'var(--gray-600)',maxWidth:'480px',margin:'12px auto 0'}}>Have a question, feedback, or want to book a demo? Our team responds within 2 hours.</p>
        </div>
      </div>

      <div className="container" style={{padding:'60px 24px 80px'}}>
        <div className="contact-layout">
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p style={{marginTop:'12px',marginBottom:'32px'}}>We'd love to hear from you. Choose the best way to reach us or fill in the form.</p>
            <div className="contact-details">
              {[
                { icon:<Mail size={20}/>, label:'Email', value:'hello@humanforce.ai', href:'mailto:hello@humanforce.ai' },
                { icon:<Phone size={20}/>, label:'Phone', value:'+1 (800) 123-4567', href:'tel:+18001234567' },
                { icon:<MapPin size={20}/>, label:'Office', value:'123 Market St, San Francisco, CA 94102', href:'#' },
                { icon:<Clock size={20}/>, label:'Hours', value:'Mon–Fri: 9AM–6PM PST', href:null },
              ].map((d,i) => (
                <div key={i} className="contact-detail">
                  <div className="contact-detail-icon">{d.icon}</div>
                  <div>
                    <div className="contact-detail-label">{d.label}</div>
                    {d.href ? <a href={d.href} className="contact-detail-value">{d.value}</a> : <div className="contact-detail-value">{d.value}</div>}
                  </div>
                </div>
              ))}
            </div>
            <a href="https://wa.me/18001234567" target="_blank" rel="noopener noreferrer" className="whatsapp-cta">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
          </div>

          <div className="contact-form-wrap">
            {sent ? (
              <div className="contact-success">
                <CheckCircle size={48} style={{color:'var(--success)',margin:'0 auto 16px',display:'block'}}/>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. Our team will respond within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handle} className="contact-form">
                <h3 style={{marginBottom:'24px'}}>Send a Message</h3>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Your name" required/></div>
                  <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@company.com" required/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Phone (optional)</label><input className="form-input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+1 (555) 000-0000"/></div>
                  <div className="form-group"><label className="form-label">Subject</label>
                    <select className="form-input" value={form.subject} onChange={e=>set('subject',e.target.value)} required>
                      <option value="">Select a topic</option>
                      <option>General Enquiry</option>
                      <option>Book a Demo</option>
                      <option>Enterprise Sales</option>
                      <option>Technical Support</option>
                      <option>Partnership</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label className="form-label">Message</label><textarea className="form-input" value={form.message} onChange={e=>set('message',e.target.value)} rows={5} placeholder="Tell us how we can help..." style={{resize:'vertical'}} required/></div>
                <button type="submit" className="btn-primary" style={{justifyContent:'center',width:'100%',padding:'15px'}}>
                  <Send size={18}/> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
