import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, Clock, Search, BookOpen, ChevronRight } from 'lucide-react'
import './Blog.css'

export const POSTS = [
  { id:1, title:'How AI Matching is Revolutionizing Remote Work Hiring', cat:'AI & Tech', date:'May 15, 2026', read:'5 min read', excerpt:'Explore how advanced AI algorithms are reducing time-to-hire from weeks to seconds, and what it means for the future of work.' },
  { id:2, title:'10 Tasks Every Executive Should Delegate to a Virtual PA', cat:'Productivity', date:'May 12, 2026', read:'4 min read', excerpt:'Discover the top tasks that are stealing executive time and how delegating them can unlock 20+ hours per week.' },
  { id:3, title:'Building a Remote-First Operations Team in 2026', cat:'Operations', date:'May 8, 2026', read:'6 min read', excerpt:'A practical guide to structuring, managing, and scaling a fully remote operations team with human and AI collaboration.' },
  { id:4, title:'The Complete Guide to Customer Support Outsourcing', cat:'Customer Success', date:'May 5, 2026', read:'7 min read', excerpt:'Everything you need to know about outsourcing customer support — from pricing models to quality benchmarks.' },
  { id:5, title:'Why Your Sales Team Needs an SDR Support Specialist', cat:'Sales', date:'Apr 28, 2026', read:'4 min read', excerpt:'Sales Development Reps who have dedicated support close 34% more deals. Here\'s how to set that up.' },
  { id:6, title:'HumanForce vs Traditional Staffing Agencies: A 2026 Comparison', cat:'Industry Insights', date:'Apr 22, 2026', read:'5 min read', excerpt:'An honest comparison of AI-powered staffing platforms versus traditional agencies — cost, speed, and quality.' },
]

export const COLORS = { 
  'AI & Tech': '#E53935', 
  'Productivity': '#1E88E5', 
  'Operations': '#43A047', 
  'Customer Success': '#FB8C00', 
  'Sales': '#8E24AA', 
  'Industry Insights': '#546E7A' 
}

const CATEGORIES = ['All', 'AI & Tech', 'Productivity', 'Operations', 'Customer Success', 'Sales', 'Industry Insights']

export default function Blog() {
  const [selectedCat, setSelectedCat] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPosts, setFilteredPosts] = useState(POSTS)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    let result = POSTS
    if (selectedCat !== 'All') {
      result = result.filter(p => p.cat === selectedCat)
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
    }
    setFilteredPosts(result)
  }, [selectedCat, searchQuery])

  // Featured article is the first post matching selected filter (or post 1 if All)
  const featuredArticle = selectedCat === 'All' && searchQuery === '' ? POSTS[0] : null
  const gridArticles = featuredArticle ? filteredPosts.slice(1) : filteredPosts

  return (
    <main className="page-with-navbar blog-page-root">
      {/* Decorative Blur Blobs */}
      <div className="blob blob-red"></div>
      <div className="blob blob-blue"></div>

      <div className="page-hero blog-hero">
        <div className="container">
          <div className="section-tag-animated">
            <span>✨ HumanForce Insights</span>
          </div>
          <h1 className="hero-title">Perspective & <span className="gradient-text">expert advice</span></h1>
          <p className="hero-subtitle">
            Practical playbooks, technology trends, and operations management tips to build and run high-performing teams.
          </p>
        </div>
      </div>

      <div className="container blog-main-container">
        {/* Search & Filter Bar */}
        <div className="blog-controls">
          <div className="search-box-wrap">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="categories-filter-bar">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                className={`filter-badge ${selectedCat === cat ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        {featuredArticle && (
          <div className="blog-featured-card">
            <div className="blog-featured-img-container" style={{
              background: `linear-gradient(135deg, ${COLORS[featuredArticle.cat]}22, ${COLORS[featuredArticle.cat]}44)`
            }}>
              <span className="featured-tag">FEATURED READ</span>
              <div className="tech-pattern">AI</div>
            </div>
            <div className="blog-featured-detail">
              <span className="blog-category-badge" style={{ backgroundColor: COLORS[featuredArticle.cat] }}>
                {featuredArticle.cat}
              </span>
              <h2 className="featured-title">{featuredArticle.title}</h2>
              <p className="featured-excerpt">{featuredArticle.excerpt}</p>
              <div className="blog-meta">
                <span><Calendar size={15}/> {featuredArticle.date}</span>
                <span><Clock size={15}/> {featuredArticle.read}</span>
              </div>
              <Link to={`/blog/${featuredArticle.id}`} className="read-more-btn">
                Read Full Story <ArrowRight size={16}/>
              </Link>
            </div>
          </div>
        )}

        {/* Grid Section */}
        <div className="latest-header-row">
          <h3>{selectedCat === 'All' ? 'Latest Publications' : `${selectedCat} Articles`}</h3>
          <span className="article-count">{filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found</span>
        </div>

        {gridArticles.length === 0 ? (
          <div className="empty-search-state">
            <BookOpen size={48} />
            <h4>No articles matched your search</h4>
            <p>Try resetting the category filter or searching for another keyword.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCat('All') }} className="btn-primary" style={{ marginTop: '16px' }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="blog-cards-grid">
            {gridArticles.map((p) => (
              <Link to={`/blog/${p.id}`} key={p.id} className="blog-grid-card">
                <div className="blog-card-visual" style={{
                  background: `linear-gradient(135deg, ${COLORS[p.cat]}15, ${COLORS[p.cat]}35)`
                }}>
                  <span className="card-category-badge" style={{ background: COLORS[p.cat] }}>{p.cat}</span>
                  <div className="card-visual-overlay"></div>
                </div>
                <div className="blog-card-text">
                  <h3 className="card-title">{p.title}</h3>
                  <p className="card-excerpt">{p.excerpt}</p>
                  <div className="blog-meta">
                    <span><Calendar size={14}/> {p.date}</span>
                    <span><Clock size={14}/> {p.read}</span>
                  </div>
                  <div className="card-footer-action">
                    <span>Read Article</span>
                    <ChevronRight size={14} className="chevron-icon" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
