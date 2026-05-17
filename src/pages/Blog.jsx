import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, Clock } from 'lucide-react'
import './Categories.css'

const POSTS = [
  { id:1, title:'How AI Matching is Revolutionizing Remote Work Hiring', cat:'AI & Tech', date:'May 15, 2026', read:'5 min read', excerpt:'Explore how advanced AI algorithms are reducing time-to-hire from weeks to seconds, and what it means for the future of work.' },
  { id:2, title:'10 Tasks Every Executive Should Delegate to a Virtual PA', cat:'Productivity', date:'May 12, 2026', read:'4 min read', excerpt:'Discover the top tasks that are stealing executive time and how delegating them can unlock 20+ hours per week.' },
  { id:3, title:'Building a Remote-First Operations Team in 2026', cat:'Operations', date:'May 8, 2026', read:'6 min read', excerpt:'A practical guide to structuring, managing, and scaling a fully remote operations team with human and AI collaboration.' },
  { id:4, title:'The Complete Guide to Customer Support Outsourcing', cat:'Customer Success', date:'May 5, 2026', read:'7 min read', excerpt:'Everything you need to know about outsourcing customer support — from pricing models to quality benchmarks.' },
  { id:5, title:'Why Your Sales Team Needs an SDR Support Specialist', cat:'Sales', date:'Apr 28, 2026', read:'4 min read', excerpt:'Sales Development Reps who have dedicated support close 34% more deals. Here\'s how to set that up.' },
  { id:6, title:'HumanForce vs Traditional Staffing Agencies: A 2026 Comparison', cat:'Industry Insights', date:'Apr 22, 2026', read:'5 min read', excerpt:'An honest comparison of AI-powered staffing platforms versus traditional agencies — cost, speed, and quality.' },
]

const COLORS = { 'AI & Tech':'#E53935', 'Productivity':'#1E88E5', 'Operations':'#43A047', 'Customer Success':'#FB8C00', 'Sales':'#8E24AA', 'Industry Insights':'#546E7A' }

export default function Blog() {
  return (
    <main className="page-with-navbar">
      <div className="page-hero">
        <div className="container">
          <div className="section-tag" style={{display:'inline-flex',margin:'0 auto 16px'}}>Blog</div>
          <h1>Insights for <span style={{color:'var(--primary)'}}>modern teams</span></h1>
          <p style={{fontSize:'1.05rem',color:'var(--gray-600)',maxWidth:'480px',margin:'12px auto 0'}}>Practical guides, industry trends, and expert perspectives on scaling your business with human talent and AI.</p>
        </div>
      </div>

      <div className="container" style={{padding:'60px 24px 80px'}}>
        <div className="blog-featured">
          <div className="blog-featured-img" style={{background:'linear-gradient(135deg, #E5393522, #E5393544)'}}>
            <span className="blog-cat-badge" style={{background:'#E53935'}}>Featured</span>
            <div style={{fontSize:'4rem',opacity:0.2,fontWeight:900,color:'#E53935',position:'absolute',bottom:20,right:24}}>AI</div>
          </div>
          <div className="blog-featured-content">
            <span className="badge badge-red">{POSTS[0].cat}</span>
            <h2 style={{marginTop:'12px',marginBottom:'16px'}}>{POSTS[0].title}</h2>
            <p>{POSTS[0].excerpt}</p>
            <div className="blog-meta">
              <span><Calendar size={14}/> {POSTS[0].date}</span>
              <span><Clock size={14}/> {POSTS[0].read}</span>
            </div>
            <Link to="/blog/1" className="btn-primary" style={{marginTop:'20px',display:'inline-flex'}}>Read Article <ArrowRight size={16}/></Link>
          </div>
        </div>

        <h3 style={{marginBottom:'24px',marginTop:'56px'}}>Latest Articles</h3>
        <div className="blog-grid">
          {POSTS.slice(1).map((p,i) => (
            <Link to={`/blog/${p.id}`} key={i} className="blog-card">
              <div className="blog-card-img" style={{background:`linear-gradient(135deg, ${COLORS[p.cat] || '#E53935'}15, ${COLORS[p.cat] || '#E53935'}30)`}}>
                <span className="blog-cat-badge" style={{background: COLORS[p.cat] || '#E53935'}}>{p.cat}</span>
              </div>
              <div className="blog-card-body">
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <div className="blog-meta">
                  <span><Calendar size={13}/> {p.date}</span>
                  <span><Clock size={13}/> {p.read}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
