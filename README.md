<div align="center">

<br/>

<br/>

<h1>XamHub</h1>

<p><strong>Futuristic GitHub Developer Analytics Dashboard</strong></p>

<p>Visualize, analyze, and compare any GitHub developer profile in seconds — no setup, no login required.</p>

<br/>

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](https://github.com/mdjameee400/xamhub/pulls)

<br/>

[🚀 Live Demo](https://xamhub.vercel.app) · [🐛 Report Bug](https://github.com/mdjameee400/xamhub/issues) · [✨ Request Feature](https://github.com/mdjameee400/xamhub/issues)

<br/>

</div>

---

## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 About The Project

**XamHub** is an open-source GitHub analytics dashboard that turns raw GitHub data into beautiful, actionable insights. Whether you're a developer evaluating your own open source impact, comparing yourself to peers, or just curious — XamHub delivers it all instantly, with zero configuration.

Built with a cinematic neon glass-morphism UI, smooth Framer Motion animations, and powered entirely by the public GitHub REST API.

> **No account. No API key. No setup. Just results.**

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🔍 **Instant Profile Search** | Search any GitHub username and get a full analytics dashboard in milliseconds |
| 📊 **Developer Analytics** | Language breakdown, top repos, activity timeline, and contribution stats |
| 🏆 **Impact Score & Grade** | Algorithmic open source grade based on stars, forks, commits, and activity |
| 📄 **Developer Resume Card** | Generate and download a shareable PNG resume card from your GitHub profile |
| 🔥 **Roast Engine** | Honest, funny system diagnostics of your GitHub habits and patterns |
| 🧪 **GitHub Addiction Meter** | Measures commit frequency, late-night coding streaks, and weekend warrior scores |
| ⚖️ **Side-by-Side Comparison** | Compare two GitHub profiles head-to-head across all key metrics |
| 🏥 **Repo Health Assessment** | Quality scoring for each repository based on documentation, activity, and more |
| 🎨 **Cinematic UI** | Neon glass-morphism design with smooth Framer Motion animations |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [React 18](https://reactjs.org/) + [TypeScript 5](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 5](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Image Export** | [html2canvas](https://html2canvas.hertzen.com/) |
| **Data Fetching** | [TanStack Query v5](https://tanstack.com/query/latest) |
| **Routing** | [React Router v6](https://reactrouter.com/) |
| **Data Source** | [GitHub REST API v3](https://docs.github.com/en/rest) |
| **Testing** | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** `v18.0.0` or higher
- **npm** `v9+` or **bun**

```bash
node --version   # v18+
npm --version    # v9+
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mdjameee400/xamhub.git

# 2. Navigate into the project folder
cd xamhub/starfall-analytics

# 3. Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The page hot-reloads on every save.

---

## 📁 Project Structure

```
starfall-analytics/
├── public/                      # Static assets (favicon, OG image)
├── src/
│   ├── components/              # All UI components
│   │   ├── ui/                  # shadcn/ui base primitives
│   │   ├── AddictionMeter.tsx   # GitHub Addiction Meter visualizer
│   │   ├── Analytics.tsx        # Language chart + activity timeline
│   │   ├── Background.tsx       # Animated neon background
│   │   ├── CompareView.tsx      # Side-by-side developer comparison
│   │   ├── ProfilePanel.tsx     # User profile card
│   │   ├── RepoGrid.tsx         # Repository grid with indicators
│   │   ├── RepoHealthAssessment.tsx  # Repo quality scoring
│   │   ├── ResumeCard.tsx       # Downloadable Developer Resume PNG
│   │   ├── RoastCard.tsx        # Roast engine diagnostics
│   │   ├── SearchBar.tsx        # Username search input
│   │   └── SkeletonDashboard.tsx # Loading skeleton UI
│   ├── hooks/
│   │   ├── useGitHub.ts         # Fetch & cache GitHub profile data
│   │   └── useCompare.ts        # Compare two GitHub profiles
│   ├── pages/
│   │   ├── Index.tsx            # Main dashboard page
│   │   └── NotFound.tsx         # 404 page
│   ├── services/
│   │   └── github.ts            # GitHub API calls (typed interfaces)
│   ├── utils/
│   │   ├── scoring.ts           # Impact score + freshness index
│   │   └── realityCheck.ts      # Roast engine + addiction calculator
│   ├── lib/
│   │   └── utils.ts             # Shared utilities (cn, etc.)
│   ├── App.tsx                  # Root app with routing
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles + CSS tokens
├── .gitignore
├── components.json              # shadcn/ui configuration
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🔐 Environment Variables

XamHub works fully **without any API key**. It uses the public GitHub REST API (unauthenticated, 60 req/hour per IP).

For higher rate limits, create a `.env.local` file in the project root:

```env
# .env.local — ⚠️ DO NOT COMMIT THIS FILE
VITE_GITHUB_TOKEN=your_personal_access_token_here
```

> **⚠️ Warning:** The `.env.local` file is already in `.gitignore`. Never commit tokens or secrets to version control.

To generate a GitHub token: [Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the local development server at `localhost:5173` |
| `npm run build` | Build the production bundle to `./dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the entire codebase |
| `npm test` | Run tests once with Vitest |
| `npm run test:watch` | Run tests in interactive watch mode |

---

## 🗺️ Roadmap

- [x] GitHub profile analytics dashboard
- [x] Language distribution chart
- [x] Developer Impact Score & Grade
- [x] Developer Resume Card (downloadable PNG)
- [x] Roast Engine / System Diagnostics
- [x] GitHub Addiction Meter
- [x] Repo health assessment
- [x] Side-by-side developer comparison
- [ ] GitHub Token support for higher API rate limits
- [ ] Contribution heatmap visualization
- [ ] Organization profile analytics
- [ ] Dark / Light theme toggle
- [ ] Share to social media improvements
- [ ] Public API endpoints

See the [open issues](https://github.com/mdjameee400/xamhub/issues) for a full list of proposed features and known issues.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also open an issue tagged `enhancement`.

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/<your-username>/xamhub.git
cd xamhub/starfall-analytics

# 3. Create your feature branch
git checkout -b feat/amazing-feature

# 4. Make your changes, then commit
git add .
git commit -m "feat: add some amazing feature"

# 5. Push to your branch
git push origin feat/amazing-feature

# 6. Open a Pull Request
```

### Contribution Guidelines

- Follow the existing **TypeScript + Tailwind** code patterns
- Use [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `docs:`, `chore:`
- Run `npm run lint` and `npm test` before submitting a PR
- Keep PRs focused — one feature or fix per PR
- **Never commit** `.env` files, API keys, or secrets

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 📬 Contact

**Md Jamee** — [@mdjameee400](https://github.com/mdjameee400)

Project Link: [https://github.com/mdjameee400/xamhub](https://github.com/mdjameee400/xamhub)

---

<div align="center">

If XamHub helped you or you think it's cool, please consider giving it a ⭐ — it helps the project grow!

<br/>

<sub>Built with ❤️ and a lot of late-night commits.</sub>

</div>
