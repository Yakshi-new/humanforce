# 🤝 HumanForce — Book a Buddy for Any Occasion

> A full-featured, AI-powered human services marketplace inspired by [HumanOnRent.AI](https://humanonrent.ai). Book verified companions for Movies, Travel, Elder Care, Tutoring, Parties, and 15 more services — starting at just ₹1,000/hr.

---

## 📸 Preview

| Services Page | Booking Modal | Home Page |
|---|---|---|
| Colorful HumanOnRent-style cards | Date, time & duration picker | Hero with animated stats |

---

## 🚀 Features

- **20 Buddy Services** — Movies, Shopping, Travel, Medical Help, Elder Care, Domestic Help, Business Events, Outdoor Events, Baking/Cooking, Sporting Events, Playing Sports, Comedy Club, Going to Bar, Hanging Out, Tutoring, Clubbing, Dinner, Music, Culture, Parties
- **Booking Modal** — Pick date, time, duration (1–8 hrs), special requests, with real-time price estimate
- **Category Filtering** — Filter by Entertainment, Lifestyle, Adventure, Care, Professional, Nightlife
- **Live Search** — Instant service filtering as you type
- **AI Chatbot (Aria)** — Context-aware assistant with typing indicator
- **WhatsApp FAB** — Floating icon with hover label, links to WhatsApp chat
- **Multi-Page App** — Home, Services, Categories, How It Works, Pricing, About, Blog, Contact
- **Auth Pages** — Login & Register with form validation
- **Dashboards** — User Dashboard, Provider Dashboard, Admin Panel
- **Lead Capture Popup** — Timed email capture modal
- **Sticky CTA Bar** — Persistent bottom call-to-action
- **Fully Responsive** — Mobile, tablet, and desktop layouts

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | [React](https://react.dev/) | 18.3.1 |
| **Build Tool** | [Vite](https://vite.dev/) | 6.3.5 |
| **Routing** | [React Router DOM](https://reactrouter.com/) | 7.5.3 |
| **Icons** | [Lucide React](https://lucide.dev/) | 0.454.0 |
| **Styling** | Vanilla CSS (CSS Variables) | — |
| **Language** | JavaScript (ES Modules) | — |
| **Package Manager** | npm | — |

> **No Tailwind. No UI libraries.** All styles are hand-crafted with CSS variables for maximum control and performance.

---

## 📦 Installation & Setup

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** — v18 or higher → [Download](https://nodejs.org/)
- **npm** — comes with Node.js (v9+)
- **Git** → [Download](https://git-scm.com/)

Check versions:
```bash
node -v   # should be v18+
npm -v    # should be v9+
```

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/humanforce.git
cd humanforce
```

Or if you already have the project folder:
```bash
cd path/to/meet_your_buddy
```

---

### 2. Install Dependencies

```bash
npm install
```

This will install all packages listed in `package.json`:
- `react` & `react-dom`
- `react-router-dom`
- `lucide-react`
- `vite` & `@vitejs/plugin-react` (dev)

---

### 3. Start the Development Server

```bash
npm run dev
```

The app will open automatically at:
```
http://localhost:5173/
```

> If port `5173` is in use, Vite will automatically pick the next available port (e.g., `5174`).

---

### 4. Build for Production

```bash
npm run build
```

Output will be in the `/dist` folder — ready to deploy to any static host (Vercel, Netlify, GitHub Pages, etc.).

---

### 5. Preview Production Build Locally

```bash
npm run preview
```

---

## 📁 Project Structure

```
meet_your_buddy/
├── public/                    # Static assets (favicon, images)
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── AIChatbot.jsx      # Floating AI chat assistant (Aria)
│   │   ├── AIChatbot.css
│   │   ├── Footer.jsx         # Site footer with links
│   │   ├── Footer.css
│   │   ├── LeadCapturePopup.jsx  # Email capture popup
│   │   ├── LeadCapturePopup.css
│   │   ├── Navbar.jsx         # Responsive navigation bar
│   │   ├── Navbar.css
│   │   ├── StickyCTA.jsx      # Persistent bottom CTA bar
│   │   ├── StickyCTA.css
│   │   ├── WhatsAppButton.jsx # Floating WhatsApp FAB
│   │   └── WhatsAppButton.css
│   ├── pages/                 # Page-level components
│   │   ├── Home.jsx           # Landing page with hero, stats, categories
│   │   ├── Home.css
│   │   ├── Services.jsx       # 20-service grid with booking modal
│   │   ├── Services.css
│   │   ├── ServiceDetail.jsx  # Individual service detail page
│   │   ├── ServiceDetail.css
│   │   ├── Categories.jsx     # Browse by category
│   │   ├── Categories.css
│   │   ├── HowItWorks.jsx     # Step-by-step explainer
│   │   ├── HowItWorks.css
│   │   ├── Pricing.jsx        # Pricing plans
│   │   ├── Pricing.css
│   │   ├── About.jsx          # About page
│   │   ├── About.css
│   │   ├── Blog.jsx           # Blog listing
│   │   ├── Blog.css
│   │   ├── Contact.jsx        # Contact form + WhatsApp CTA
│   │   ├── Contact.css
│   │   ├── Login.jsx          # Sign in page
│   │   ├── Register.jsx       # Register page
│   │   ├── Register.css
│   │   ├── UserDashboard.jsx  # Logged-in user dashboard
│   │   ├── ProviderDashboard.jsx  # Service provider dashboard
│   │   ├── ProviderDashboard.css
│   │   ├── AdminPanel.jsx     # Admin control panel
│   │   ├── AdminPanel.css
│   │   ├── Dashboard.css      # Shared dashboard styles
│   │   └── Auth.css           # Shared auth page styles
│   ├── App.jsx                # Root component, routes, layout
│   └── index.css              # Global CSS variables & base styles
├── index.html                 # HTML entry point
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies & scripts
└── README.md                  # You are here!
```

---

## 🗺️ Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, stats, category preview, features, testimonials |
| `/services` | Services | All 20 buddy services with booking modal |
| `/services/:id` | Service Detail | Individual service information |
| `/categories` | Categories | Browse by category |
| `/how-it-works` | How It Works | Step-by-step guide |
| `/pricing` | Pricing | Plans and packages |
| `/about` | About | Company & mission |
| `/blog` | Blog | Articles & updates |
| `/contact` | Contact | Contact form & WhatsApp |
| `/login` | Login | Sign in |
| `/register` | Register | Create account |
| `/dashboard/*` | User Dashboard | Booking history, profile |
| `/provider/*` | Provider Dashboard | Manage service listings |
| `/admin/*` | Admin Panel | Platform administration |

---

## 🎨 Design System

All design tokens are defined in `src/index.css` as CSS custom properties:

```css
:root {
  --primary: #E53935;          /* Brand red */
  --primary-dark: #C62828;
  --primary-bg: #FFF5F5;
  --primary-light: #FFCDD2;
  --navbar-h: 68px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;
  --shadow-sm: ...;
  --shadow-md: ...;
  --shadow-red: ...;
  --transition: all 0.2s ease;
}
```

---

## 💡 Services & Pricing

All services are provided as part of the HumanOnRent.AI model:

| Service | Category | Price |
|---|---|---|
| Movies | Entertainment | ₹1,000/hr |
| Shopping | Lifestyle | ₹1,000/hr |
| Travel | Adventure | ₹1,000/hr |
| Medical Help | Care | ₹3,000/hr |
| Elder Care | Care | ₹1,000/hr |
| Domestic Help | Lifestyle | ₹1,000/hr |
| Business Events | Professional | ₹1,000/hr |
| Outdoor Events | Adventure | ₹1,000/hr |
| Baking/Cooking | Lifestyle | ₹1,000/hr |
| Sporting Events | Entertainment | ₹3,000/hr |
| Playing Sports | Adventure | ₹1,000/hr |
| Comedy Club | Entertainment | ₹1,000/hr |
| Going to Bar | Nightlife | ₹1,000/hr |
| Hanging Out | Lifestyle | ₹1,000/hr |
| Tutoring | Professional | ₹1,000/hr |
| Clubbing | Nightlife | ₹1,000/hr |
| Dinner | Lifestyle | ₹1,000/hr |
| Music | Entertainment | ₹1,000/hr |
| Culture | Adventure | ₹1,000/hr |
| Parties | Nightlife | ₹1,000/hr |

> GST applicable as per government norms. Registered on HumanOnRent.AI.

---

## 🔧 Available Scripts

```bash
# Start development server (hot reload)
npm run dev

# Create production build in /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag & drop the /dist folder at netlify.com/drop
```

### GitHub Pages
```bash
npm install -D gh-pages
# Add to package.json scripts: "deploy": "gh-pages -d dist"
npm run build && npm run deploy
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is for educational and portfolio purposes.  
Inspired by the business model of [HumanOnRent.AI](https://humanonrent.ai).

---

## 📬 Contact

Built with ❤️ by **Harsdiya**

- WhatsApp: [Chat Now](https://wa.me/18001234567)
- Email: hello@humanforce.ai

---

<div align="center">
  <strong>⭐ If you found this helpful, give it a star on GitHub!</strong>
</div>



{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-app.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
// {
//   "rewrites": [
//     { "source": "/(.*)", "destination": "/index.html" }
//   ]
// }