<![CDATA[<div align="center">

<h1>
  <img src="public/favicon.ico" width="32" height="32" alt="XamHub icon" />
  <strong>XamHub</strong>
</h1>

<p><em>Futuristic GitHub Developer Analytics — visualize, analyze, and compare any developer profile in seconds.</em></p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

</div>

---

## ✨ What is XamHub?

**XamHub** is a sleek, zero-config GitHub analytics dashboard built for developers who want **real insight** into any GitHub profile — theirs or anyone else's.

Enter a username and instantly surface:
- Developer impact score & open source grade
- Language distribution, top starred repos, and activity timeline
- A downloadable **Developer Resume Card** (shareable PNG)
- A **Roast Engine** — an honest, funny system diagnostics of your GitHub habits
- A **GitHub Addiction Meter** measuring commit frequency, late-night coding streaks, and more
- **Side-by-side developer comparison** across key metrics

All wrapped in a cinematic, neon glass-morphism UI with smooth Framer Motion animations.

---

## 🖥️ Preview

> Search any GitHub username → get a full analytics dashboard in milliseconds.

```
https://xamhub.vercel.app   ← (deploy your own below)
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** `v18+`
- **npm** or **bun**

### Clone & Install

```bash
# 1. Clone the repo
git clone https://github.com/mdjameee400/xamhub.git
cd xamhub

# 2. Install dependencies
npm install
```

### Run Locally

```bash
# Start the development server (runs on http://localhost:8080)
npm run dev
```

### Build for Production

```bash
# Compile and optimize for production
npm run build

# Preview the production build locally
npm run preview
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [React 18](https://reactjs.org/) + [TypeScript 5](https://www.typescriptlang.org/) |
| Build Tool | [Vite 5](https://vitejs.dev/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) (Radix primitives) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Charts | [Recharts](https://recharts.org/) |
| Image Export | [html2canvas](https://html2canvas.hertzen.com/) |
| Data Source | [GitHub REST API v3](https://docs.github.com/en/rest) (unauthenticated) |

---

## 📁 Project Structure

```
xamhub/
├── public/             # Static assets (favicon, OG image, robots.txt)
├── src/
│   ├── components/     # All UI components
│   │   ├── ui/         # shadcn/ui base primitives (accordion, badge, etc.)
│   │   ├── Analytics.tsx        # Language pie chart + activity timeline
│   │   ├── Background.tsx       # Animated neon background
│   │   ├── AddictionMeter.tsx   # Commit addiction score visualizer
│   │   ├── CompareView.tsx      # Side-by-side developer comparison
│   │   ├── ProfilePanel.tsx     # User profile card
│   │   ├── RepoGrid.tsx         # Repository grid with health indicators
│   │   ├── RepoHealthAssessment.tsx  # Repo quality scoring
│   │   ├── ResumeCard.tsx       # Downloadable Developer Resume PNG
│   │   ├── RoastCard.tsx        # System diagnostics / roast engine
│   │   └── SearchBar.tsx        # Username search input
│   ├── hooks/
│   │   ├── useGitHub.ts         # Fetch & cache GitHub profile data
│   │   └── useCompare.ts        # Compare two GitHub profiles
│   ├── pages/
│   │   ├── Index.tsx            # Main dashboard page
│   │   └── NotFound.tsx         # 404 page
│   ├── services/
│   │   └── github.ts            # GitHub API calls (typed interfaces)
│   ├── utils/
│   │   ├── scoring.ts           # Impact score, freshness index, stats
│   │   └── realityCheck.ts      # Roast engine + addiction calculator
│   ├── App.tsx                  # Root app with routing
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles, CSS tokens, animations
├── .gitignore
├── components.json              # shadcn/ui config
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🔒 Security & Environment

- **No API key required** — XamHub uses the GitHub public REST API (unauthenticated).
- All unauthenticated requests are subject to GitHub's rate limit of **60 requests/hour per IP**.
- If you want higher limits, set a `VITE_GITHUB_TOKEN` in a `.env.local` file (**never commit this file** — it is already in `.gitignore`).

```env
# .env.local  ← DO NOT COMMIT
VITE_GITHUB_TOKEN=your_personal_access_token_here
```

> ⚠️ **The `.env.local` file is gitignored. Never push API keys or tokens to version control.**

---

## 📈 Feature Roadmap

- [x] GitHub profile analytics
- [x] Language distribution chart
- [x] Developer Resume Card (downloadable PNG)
- [x] System Diagnostics / Roast Engine
- [x] GitHub Addiction Meter
- [x] Repo health assessment
- [x] Side-by-side developer comparison
- [ ] GitHub Token support for higher rate limits
- [ ] Contribution heatmap visualization
- [ ] Organization analytics
- [ ] Dark/Light theme toggle
- [ ] Share-to-social improvements

---

## 🤝 Contributing

Contributions are warmly welcomed! Whether it's fixing a typo, reporting a bug, or adding a whole new feature — every bit helps.

### How to Contribute

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/<your-username>/xamhub.git
cd xamhub

# 3. Create a feature branch
git checkout -b feat/your-feature-name

# 4. Make your changes and commit
git add .
git commit -m "feat: describe what you did"

# 5. Push to your fork
git push origin feat/your-feature-name

# 6. Open a Pull Request on GitHub
```

### Guidelines

- **Code style**: Follow the existing TypeScript + Tailwind patterns. Run `npm run lint` before committing.
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:` etc.)
- **PR title**: Keep it clear and concise. Reference any related issue.
- **Tests**: Run `npm test` and make sure nothing breaks.
- **No secrets**: Never commit `.env` files or tokens. Ever.

### Found a Bug?

Open an [issue](https://github.com/mdjameee400/xamhub/issues) with:
1. Steps to reproduce
2. Expected vs actual behavior
3. Browser/OS/Node version

---

## 🧪 Running Tests

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## ⭐ Show Your Support

If XamHub helped you or you simply think it's cool — drop a ⭐ on the repo! It genuinely helps the project grow and reach more developers.

---

<div align="center">
  <sub>Built with ❤️ and a lot of late-night commits.</sub>
</div>
]]>
