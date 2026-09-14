# Bangla Regional Dialect Translator — Frontend Web UI

A modern, responsive Single Page Application (SPA) built with **React** and **Vite** for translating 7 regional dialects of Bangladesh (*Chittagong, Noakhali, Barishal, Rangpur, Pabna, Mymensingh, Jashore*) into Standard Bengali.

---

## ✨ Features
- **Modern Glassmorphic Dark UI**: Tailored with ambient glow effects, responsive card grids, and smooth micro-animations.
- **Authentic Bengali Typography**: Uses Google Fonts (`Hind Siliguri`, `Noto Sans Bengali`, `Outfit`).
- **Interactive 7-Region Selector**: Direct selection of regional dialects with administrative division badges.
- **Quick Sample Dialect Sentences**: Clickable sample chips pre-loaded with authentic dialect phrases per region.
- **Speech Synthesis (Text-to-Speech)**: Listen to the translated Standard Bengali sentences with browser native speech synthesis.
- **One-Click Copy**: Instant clipboard copy with visual feedback.
- **Thesis & Research Insights Modal**: Interactive dashboard displaying model evaluation benchmarks (BanglaT5 vs. mT5-base vs. mT5-small across BLEU, chrF, BERTScore, STS Cosine) and linguistic distance findings (Jashore 34.84% lexical overlap vs. Chittagong 0.44%).
- **In-App Settings Modal**: Configure custom Hugging Face model repository IDs and API tokens with live connectivity verification.
- **Fully Responsive**: Optimized for smartphones (360px+), tablets, laptops, and desktop displays.
- **Production Ready**: Multi-stage Dockerfile and Nginx configuration included.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at: **http://localhost:5173**

### 3. Build for Production
```bash
npm run build
```
Generates optimized static assets in the `dist/` directory.

---

## 🐳 Docker Containerization

Run the production frontend container with Nginx:
```bash
docker build -t bangla-dialect-frontend .
docker run -p 3000:80 bangla-dialect-frontend
```
Open: **http://localhost:3000**

---

## 🔗 Backend Connection
The frontend connects to the live FastAPI backend service:
- **Production Backend URL:** `https://bangla-dialect-api-backend.onrender.com`
- **Interactive API Docs:** `https://bangla-dialect-api-backend.onrender.com/docs`
- **Health Check:** `https://bangla-dialect-api-backend.onrender.com/api/health`
