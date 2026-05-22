import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft, Share2, Copy, Check, Send } from 'lucide-react'
import { POSTS, COLORS } from './Blog'
import './Blog.css'

const Twitter = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const Linkedin = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const Facebook = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)


const FULL_ARTICLES = {
  1: {
    author: 'Ana Kowalski',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100',
    role: 'Staffing Architect, HumanForce',
    content: (
      <>
        <p className="lead">
          The recruitment industry is undergoing its most significant disruption in a century. Traditional hiring processes—riddled with resume screening backlogs, communication gaps, and unconscious bias—are being replaced by intelligent real-time matching algorithms.
        </p>
        
        <h3>The Crisis of Traditional Sourcing</h3>
        <p>
          In a world where project cycles are measured in days rather than quarters, waiting four to six weeks to hire a skilled operations specialist is no longer viable. Hiring managers spend countless hours reviewing bloated resumes that often fail to represent an applicant's actual performance potential. Furthermore, manual vetting processes introduce systemic bias, leaving highly capable candidates overlooked simply because of non-standard career trajectories.
        </p>

        <blockquote>
          "AI-driven matching isn't about removing human judgment; it is about providing humans with the absolute best candidates instantly, so they can focus on synergy rather than screening."
        </blockquote>

        <h3>How AI Matching Works Under the Hood</h3>
        <p>
          Platforms like HumanForce utilize multi-dimensional semantic mapping. Instead of searching for simple keyword matches (such as "Excel" or "Scheduling"), our algorithm evaluates candidate profiles across several vectors:
        </p>
        <ul>
          <li><strong>Cognitive Alignment:</strong> Matching the complexity of past client projects to the current task requirements.</li>
          <li><strong>Availability Syncing:</strong> Dynamic calendar matching ensuring that when you hire a buddy, they are ready to start immediately.</li>
          <li><strong>Behavioral Telemetry:</strong> Analyzing past completion rates, client ratings, and dispute-free logs to predict project success.</li>
        </ul>

        <h3>The HumanForce Advantage</h3>
        <p>
          By automating the initial assessment and matching sequence, the average time-to-hire drops from 28 days to under 10 minutes. When a client books a service, they are matched with a verified buddy whose skill set is cryptographically aligned with their business needs. The result is a frictionless, escrow-protected contract that guarantees project completion.
        </p>
      </>
    )
  },
  2: {
    author: 'Marcus Reyes',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    role: 'Operations Consultant',
    content: (
      <>
        <p className="lead">
          If you are an executive, startup founder, or busy team lead, your time is your most precious asset. Yet research shows that the average leader spends up to 41% of their day on low-leverage administrative tasks.
        </p>
        
        <h3>The Cost of Administrative Friction</h3>
        <p>
          Every minute you spend scheduling a Zoom call, formatting an internal slide deck, or chasing unpaid invoices is a minute you aren't spending on product strategy, customer acquisition, or high-value partnerships. Delegating administrative overhead is not a luxury; it is a fundamental operational necessity to prevent burnout and scale your impact.
        </p>

        <h3>10 Tasks You Should Delegate Today</h3>
        <ol>
          <li><strong>Calendar Management & Triaging:</strong> Let your buddy handle booking links, resolve double-bookings, and buffer meeting times.</li>
          <li><strong>Email Inbox Organization:</strong> Filtering out spam, categorizing priority threads, and preparing draft responses.</li>
          <li><strong>Travel Logistics & Itineraries:</strong> Sourcing flight options, arranging hotel bookings, and organizing local transport coordinates.</li>
          <li><strong>Client Invoicing & Follow-ups:</strong> Sending invoices and politely following up on outstanding accounts.</li>
          <li><strong>CRM Updates & Lead Entry:</strong> Logging meeting notes, pipeline statuses, and contact details into Salesforce or HubSpot.</li>
          <li><strong>Market Research & Competitor Digests:</strong> Collecting data points and summarizing them into bulleted briefings.</li>
          <li><strong>Presentation Polish:</strong> Formatting slides, adjusting margins, and aligning fonts to keep slide decks looking professional.</li>
          <li><strong>Meeting Transcription & Action Items:</strong> Summarizing Zoom recordings into clear actionable items.</li>
          <li><strong>Expense Reporting:</strong> Matching receipts to credit card statements and preparing spreadsheets for accounting.</li>
          <li><strong>Social Media Scheduling:</strong> Staging posts across LinkedIn and X using scheduler tools.</li>
        </ol>

        <h3>Getting Started with Your Virtual Buddy</h3>
        <p>
          The secret to successful delegation is starting small. Choose one repetitive, well-defined task. Document the process via a 3-minute Loom video, assign it to your HumanForce buddy, and watch your weekly schedule open up.
        </p>
      </>
    )
  },
  3: {
    author: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    role: 'VP of Remote Culture, HumanForce',
    content: (
      <>
        <p className="lead">
          Building a remote operations team in 2026 is no longer about replicating the office environment virtually. It requires a fundamental shift toward asynchronous collaboration, output-driven performance metrics, and automated workflows.
        </p>
        
        <h3>Asynchronous by Default</h3>
        <p>
          The biggest mistake remote companies make is forcing team members into constant real-time synchronization. Endless Zoom meetings and expectations of instant Slack replies destroy deep focus work. High-performing teams organize their communication around structured documentation (using Notion or Linear) and clear context handoffs, allowing individuals to work autonomously.
        </p>

        <blockquote>
          "A team's operational maturity is directly proportional to how long they can run without real-time meetings."
        </blockquote>

        <h3>The 2026 Remote Operations Stack</h3>
        <p>
          Your tech stack should minimize operational friction and maximize team autonomy:
        </p>
        <ul>
          <li><strong>Knowledge Base:</strong> A single source of truth for standard operating procedures (SOPs).</li>
          <li><strong>Project Planning:</strong> Issue tracking linked to code repositories and client requests.</li>
          <li><strong>Escrow Payments:</strong> HumanForce escrow system to handle global provider payments instantly and securely upon completion.</li>
          <li><strong>Async Video:</strong> Loom or native screen recordings to replace face-to-face feedback sessions.</li>
        </ul>

        <h3>Leading with Trust, Not Surveillance</h3>
        <p>
          Ditch activity monitoring software. True remote operations rely on setting clear, measurable weekly objectives (OKRs). If a buddy is delivering high-quality client results and meeting their project milestones, their exact desk hours are irrelevant. Cultivating this level of trust leads to happier, more creative, and highly loyal professionals.
        </p>
      </>
    )
  },
  4: {
    author: 'David Vance',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    role: 'Director of Customer Experience',
    content: (
      <>
        <p className="lead">
          Outsourcing customer support doesn't have to mean sacrificing quality. With structured onboarding, clear brand voice manuals, and direct platform communication, you can build a support team that increases customer retention.
        </p>
        
        <h3>When is the Right Time to Outsource?</h3>
        <p>
          If your founders or core engineers are spending more than 2 hours a day answering support tickets, or if your average response time is slipping past 4 hours during business days, you are ready to scale. Delegating front-line tickets frees your technical team to fix bugs permanently.
        </p>

        <h3>Establishing the Playbooks</h3>
        <p>
          Before bringing on an outsourced buddy, draft a Brand Voice and Q&A document. Populate it with standard responses, guidelines on tone (e.g. empathetic, helpful, brief), and step-by-step resolution workflows for the top 20 common customer inquiries.
        </p>
        <p>
          HumanForce matches you with support experts who have passed communication benchmarks. Once matched, they study your playbooks, shadows your internal team for 2 days, and takes over the queue with escrow-backed milestone assurances.
        </p>
      </>
    )
  },
  5: {
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100',
    role: 'Growth Lead, Matchpoint Inc.',
    content: (
      <>
        <p className="lead">
          Your Sales Development Representatives (SDRs) should be talking to prospects, not scraping email addresses, building spreadsheets, or sorting through outdated databases.
        </p>
        
        <h3>The Productivity Gap in Sales</h3>
        <p>
          The average sales representative spends only 34% of their day actually selling. The remaining 66% is eaten up by writing email sequences, compiling prospect lists, and searching for contact info. By pairing your core sales team with dedicated support specialists, you ensure they spend all day in high-impact sales conversations.
        </p>

        <blockquote>
          "When support specialists manage CRM updates and data verification, core sales reps report a 34% increase in closed-won contracts."
        </blockquote>

        <h3>Tasks for a Sales Support Buddy</h3>
        <ul>
          <li><strong>Prospect List Building:</strong> Finding decision-maker names, email addresses, and phone numbers based on target personas.</li>
          <li><strong>CRM Hygiene:</strong> Keeping account cards updated, logging calls, and removing duplicates.</li>
          <li><strong>Calendar Coordination:</strong> Booking demo slots directly into sales representatives' calendars.</li>
        </ul>
        <p>
          By taking care of lists and admin work, you allow your SDRs to focus on outbound calls and personal emails, dramatically increasing your pipeline conversion.
        </p>
      </>
    )
  },
  6: {
    author: 'Rajesh Patel',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    role: 'Founder & CEO, HumanForce',
    content: (
      <>
        <p className="lead">
          Hiring specialized business support used to mean choosing between slow, expensive staffing agencies or risky, unvetted freelancer boards. In 2026, AI-driven escrow marketplaces offer a better path.
        </p>
        
        <h3>A Side-by-Side Comparison</h3>
        <p>
          Let's look at the metrics that matter when scaling your operational capability:
        </p>
        
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Traditional Staffing Agency</th>
              <th>HumanForce Platform</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Placement Fees</strong></td>
              <td>15% to 25% of candidate annual salary</td>
              <td>0% placement fees (flat hourly escrow)</td>
            </tr>
            <tr>
              <td><strong>Matching Speed</strong></td>
              <td>2 to 5 weeks of recruiting search</td>
              <td>Under 10 minutes (AI-vetted matches)</td>
            </tr>
            <tr>
              <td><strong>Contracts & Escrow</strong></td>
              <td>Fixed monthly placement commits</td>
              <td>Secured deposit with 80% post-completion</td>
            </tr>
            <tr>
              <td><strong>Buddy Replacement</strong></td>
              <td>Requires new agency contract search</td>
              <td>Instant reassignment via admin panel</td>
            </tr>
          </tbody>
        </table>

        <h3>Why the Escrow Model Wins</h3>
        <p>
          Traditional agencies take high commissions while providing limited ongoing quality control. Freelance marketplaces leave clients exposed to project abandonment and quality disputes. HumanForce's secure deposit and buddy reassignment workflows guarantee that your business operations run continuously, backed by automated compliance checks and client protection.
        </p>
      </>
    )
  }
}

export default function BlogDetail() {
  const { id } = useParams()
  const post = POSTS.find(p => p.id === parseInt(id))
  const details = FULL_ARTICLES[parseInt(id)]

  const [scrollProgress, setScrollProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [id])

  if (!post || !details) {
    return (
      <main className="page-with-navbar blog-detail-empty">
        <div className="container text-center">
          <h2>Article not found</h2>
          <p>The post you are looking for does not exist or has been removed.</p>
          <Link to="/blog" className="btn-primary" style={{ marginTop: '24px' }}>
            Back to Blog
          </Link>
        </div>
      </main>
    )
  }

  // Find 2 related posts
  const relatedPosts = POSTS
    .filter(p => p.id !== post.id)
    .slice(0, 2)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (newsletterEmail.trim()) {
      setSubscribed(true)
      setNewsletterEmail('')
    }
  }

  const shareText = encodeURIComponent(post.title)
  const shareUrl = encodeURIComponent(window.location.href)

  return (
    <main className="page-with-navbar blog-detail-root">
      {/* Top Scroll Indicator */}
      <div 
        className="scroll-progress-indicator" 
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Decorative Blob */}
      <div className="detail-blob" style={{ backgroundColor: `${COLORS[post.cat]}15` }}></div>

      <div className="container blog-detail-container">
        {/* Navigation / Header controls */}
        <div className="detail-nav-row">
          <Link to="/blog" className="back-link">
            <ArrowLeft size={16} /> Back to Articles
          </Link>
          <span className="detail-category-label" style={{ color: COLORS[post.cat] }}>
            {post.cat}
          </span>
        </div>

        {/* Article Headline */}
        <h1 className="article-headline">{post.title}</h1>

        {/* Author & Meta Row */}
        <div className="article-author-card">
          <div className="author-image-wrap">
            <img src={details.avatar} alt={details.author} />
          </div>
          <div className="author-details">
            <div className="author-name">{details.author}</div>
            <div className="author-role">{details.role}</div>
          </div>
          <div className="meta-divider"></div>
          <div className="article-meta-info">
            <div className="meta-item">
              <Calendar size={14} />
              <span>{post.date}</span>
            </div>
            <div className="meta-item">
              <Clock size={14} />
              <span>{post.read}</span>
            </div>
          </div>
        </div>

        {/* Visual Header Image Container */}
        <div className="article-visual-hero" style={{
          background: `linear-gradient(135deg, ${COLORS[post.cat]}25, ${COLORS[post.cat]}45)`
        }}>
          <span className="visual-badge" style={{ backgroundColor: COLORS[post.cat] }}>
            {post.cat}
          </span>
          <div className="pattern-large">{post.cat[0]}</div>
        </div>

        {/* Layout: Main Article Body + Share bar */}
        <div className="article-body-layout">
          {/* Left Share Toolkit */}
          <aside className="share-aside">
            <div className="share-sticky-box">
              <span className="share-label">SHARE</span>
              <a 
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} 
                target="_blank" 
                rel="noreferrer" 
                className="share-btn twitter-btn"
                title="Share on X"
              >
                <Twitter size={16} />
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} 
                target="_blank" 
                rel="noreferrer" 
                className="share-btn linkedin-btn"
                title="Share on LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} 
                target="_blank" 
                rel="noreferrer" 
                className="share-btn facebook-btn"
                title="Share on Facebook"
              >
                <Facebook size={16} />
              </a>
              <button 
                onClick={handleCopyLink} 
                className={`share-btn copy-btn ${copied ? 'copied' : ''}`}
                title="Copy link to clipboard"
              >
                {copied ? <Check size={16} color="#43A047" /> : <Copy size={16} />}
              </button>
              {copied && <span className="copied-toast">Link Copied!</span>}
            </div>
          </aside>

          {/* Main text content */}
          <article className="article-body-content">
            {details.content}
          </article>
        </div>

        {/* Newsletter Signup Inside Article */}
        <div className="article-newsletter-card">
          <div className="newsletter-text">
            <h3>Subscribe to HumanForce Insights</h3>
            <p>Get high-value operational playbooks and Remote-First organizational strategies delivered directly to your inbox once a week.</p>
          </div>
          {subscribed ? (
            <div className="newsletter-success-message">
              <Check size={20} color="#43A047" />
              <span>Thanks for subscribing! Check your email inbox shortly.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-form-row">
              <input 
                type="email" 
                required 
                placeholder="Enter your work email" 
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className="newsletter-input"
              />
              <button type="submit" className="btn-primary newsletter-submit-btn">
                Subscribe <Send size={14} />
              </button>
            </form>
          )}
        </div>

        {/* Related Articles Footer section */}
        <div className="related-articles-section">
          <h3 className="section-title">You might also read</h3>
          <div className="related-grid">
            {relatedPosts.map(p => (
              <Link to={`/blog/${p.id}`} key={p.id} className="related-card">
                <div className="related-card-img" style={{
                  background: `linear-gradient(135deg, ${COLORS[p.cat]}15, ${COLORS[p.cat]}35)`
                }}>
                  <span className="badge" style={{ backgroundColor: COLORS[p.cat], color: 'white', fontSize: '0.68rem', padding: '2px 8px' }}>
                    {p.cat}
                  </span>
                </div>
                <div className="related-card-body">
                  <h4>{p.title}</h4>
                  <div className="blog-meta" style={{ marginTop: '8px', fontSize: '0.78rem' }}>
                    <span><Calendar size={12}/> {p.date}</span>
                    <span><Clock size={12}/> {p.read}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
