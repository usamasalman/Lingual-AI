# LinguaAI — AI-Powered Language Translation Tool

**Version:** 1.0.0  
**Last Updated:** March 2026  
**Platform:** Windows/macOS/Linux

---

## Table of Contents

1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Installation Guide](#installation-guide)
6. [Configuration](#configuration)
7. [Usage Guide](#usage-guide)
8. [Features](#features)
9. [API Documentation](#api-documentation)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)
12. [Development](#development)

---

## Overview

**LinguaAI** is a full-stack AI-powered language translation application built for the **SoftGrowTech AI Internship Program**. It provides:

- ✨ Real-time translation across **48+ world languages**
- 🎙️ **Text-to-Speech** support with proper language voices
- 📋 **Copy-to-Clipboard** functionality
- 🔄 **Language Auto-Detection** capability
- 🎨 **Dark mode glassmorphism UI** design
- ⌨️ **Keyboard shortcuts** for faster workflow
- 📊 **Character counter** with 5,000 character limit
- 🔄 **Swap source/target languages** with one click

The application uses the **free MyMemory API** for translations, requiring no API keys or billing setup.

---

## System Requirements

### Minimum Requirements
- **OS:** Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Python:** 3.8 or higher
- **Node.js:** 16.0 or higher
- **npm:** 8.0 or higher
- **RAM:** 2GB minimum
- **Disk Space:** 500MB

### Recommended Requirements
- **Python:** 3.11+
- **Node.js:** 18.0+
- **RAM:** 4GB+
- **Modern browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Frontend Framework** | React + TypeScript | 18.x |
| **Build Tool** | Vite | 7.x |
| **Frontend Styling** | Vanilla CSS (Dark Mode) | - |
| **Backend Framework** | Flask | 3.0+ |
| **Backend Language** | Python | 3.8+ |
| **Testing Framework** | pytest | 8.2+ |
| **API Client** | fetch API | Native |
| **Translation Service** | MyMemory API | REST |
| **Package Manager** | npm (Frontend), pip (Backend) | Latest |

---

## Project Structure

```
Internship/
│
├── README.md                          ← This file
├── package-lock.json
├── package.json
│
├── backend/                           ← Flask REST API
│   ├── app.py                         ← Main Flask application
│   ├── test_app.py                    ← Unit tests (pytest)
│   ├── requirements.txt                ← Python dependencies
│   ├── .env                           ← Local configuration (not in repo)
│   ├── .env.example                   ← Configuration template
│   └── __pycache__/                   ← Compiled Python files
│
└── frontend/                          ← React TypeScript application
    ├── src/
    │   ├── components/
    │   │   ├── Header.tsx             ← App header with title
    │   │   ├── TranslatorCard.tsx      ← Main translator UI
    │   │   ├── LanguageSelector.tsx    ← Language dropdown selector
    │   │   ├── TextArea.tsx            ← Reusable textarea component
    │   │   └── ToastContainer.tsx      ← Notification toasts
    │   ├── services/
    │   │   └── api.ts                 ← API client & types
    │   ├── App.tsx                    ← Root component
    │   ├── App.css                    ← App-specific styles
    │   ├── index.css                  ← Global design system
    │   ├── main.tsx                   ← React DOM entry point
    │   └── assets/                    ← Static images/icons
    ├── public/                        ← Static files served as-is
    ├── index.html                     ← HTML entry point
    ├── vite.config.ts                 ← Vite build configuration
    ├── tsconfig.json                  ← TypeScript configuration
    ├── eslint.config.js               ← ESLint rules
    ├── package.json                   ← Frontend dependencies
    ├── package-lock.json
    └── dist/                          ← Production build output
```

---

## Installation Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/usamasalman/Internship.git
cd Internship
```

### Step 2: Backend Setup

#### On Windows (PowerShell):

```powershell
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt

# Verify installation
python -c "import flask; print(f'Flask installed')"
```

#### On macOS/Linux:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 -c "import flask; print(f'Flask installed')"
```

### Step 3: Frontend Setup

#### All Platforms:

```bash
# From Internship root directory (in a NEW terminal)
cd frontend

# Install Node dependencies
npm install

# Verify installation
npm -v
```

### Step 4: Verify Installation

```bash
# Backend test
cd backend
pytest test_app.py -v

# Frontend build test
cd ../frontend
npm run build
```

---

## Configuration

### Backend Configuration (.env)

The backend uses a `.env` file to configure the translation API. A template is provided:

**Location:** `backend/.env`

```env
# Translation API choice: mymemory | google | microsoft
TRANSLATION_API=mymemory

# Google Translate API (only if TRANSLATION_API=google)
GOOGLE_API_KEY=your_google_api_key_here

# Microsoft Translator API (only if TRANSLATION_API=microsoft)
MICROSOFT_API_KEY=your_microsoft_api_key_here
MICROSOFT_REGION=eastus
```

#### Option 1: MyMemory (Default - Free)
```env
TRANSLATION_API=mymemory
```
- No API key required
- Free for up to 1,000 words per day
- No billing setup needed

#### Option 2: Google Translate
```env
TRANSLATION_API=google
GOOGLE_API_KEY=AIzaSyD...your_key_here
```
- Requires Google Cloud API key
- Better translation quality
- Billing required after free tier

#### Option 3: Microsoft Translator
```env
TRANSLATION_API=microsoft
MICROSOFT_API_KEY=your_key_here
MICROSOFT_REGION=eastus
```
- Requires Microsoft Azure subscription
- Excellent quality and language support
- Billing applies after free tier

### Frontend Configuration

Frontend configuration is in `frontend/vite.config.ts`. The API proxy is already configured:

```typescript
server: {
  port: 5173,
  proxy: {
    "/api": {
      target: "http://localhost:5000",  // Backend URL
      changeOrigin: true,
    },
  },
},
```

No changes needed unless you run backend on a different port.

---

## Usage Guide

### Running the Application

#### Terminal 1: Start Backend

**Windows (PowerShell):**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python app.py
```

**macOS/Linux:**
```bash
cd backend
source venv/bin/activate
python app.py
```

Expected output:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

#### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v7.3.1 ready in 638 ms
  ➜  Local:   http://localhost:5173/
```

#### Access Application

Open your browser and navigate to:
```
http://localhost:5173
```

### Using the Translator

1. **Select Source Language**
   - Click the "FROM" dropdown
   - Choose language or "Auto Detect"
   
2. **Select Target Language**
   - Click the "TO" dropdown
   - Choose your desired translation language

3. **Enter Text**
   - Type or paste text in the left panel
   - Character counter shows usage (max 5,000)

4. **Translate**
   - Click "✨ Translate" button, or
   - Press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (macOS)

5. **Copy Translation**
   - Click "⎘ Copy" to copy to clipboard
   - Button shows "✓ Copied" confirmation

6. **Listen to Translation**
   - Click "🔊 Speak" to hear the translation
   - Click "⏹ Stop" to pause speech

7. **Swap Languages**
   - Click "⇄" button to swap source and target
   - Previous translation becomes new input

8. **Clear Fields**
   - Click "✕ Clear" to reset both inputs

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Translate text |
| `Cmd+Enter` | Translate (macOS) |

---

## Features

### Implemented Features

| Feature | Status | Details |
|---------|--------|---------|
| Text Input & Translation | ✅ | Real-time translation via API |
| 48+ Language Support | ✅ | All major world languages |
| Language Auto-Detection | ✅ | Automatic source language detection |
| Language Swap | ✅ | Quick source/target reversal |
| Copy to Clipboard | ✅ | One-click copy functionality |
| Text-to-Speech | ✅ | Browser native speech synthesis |
| Clear Button | ✅ | Reset all fields instantly |
| Loading Indicator | ✅ | Visual feedback during translation |
| Error Notifications | ✅ | Toast notifications for errors |
| Success Notifications | ✅ | Toast confirmation messages |
| Responsive UI | ✅ | Works on desktop and tablet |
| Dark Mode | ✅ | Eye-friendly dark theme |
| Character Counter | ✅ | Shows usage (max 5,000) |
| Warning Color | ✅ | Counter turns red above 4,500 characters |
| Keyboard Shortcuts | ✅ | Ctrl+Enter to translate |
| API Flexibility | ✅ | MyMemory, Google, Microsoft support |

---

## API Documentation

### Backend Endpoints

#### GET /api/languages

Returns list of all supported languages.

**Request:**
```bash
GET http://localhost:5000/api/languages
```

**Response (200 OK):**
```json
[
  {
    "code": "auto",
    "name": "Auto Detect",
    "speechCode": "en-US"
  },
  {
    "code": "en",
    "name": "English",
    "speechCode": "en-US"
  },
  {
    "code": "es",
    "name": "Spanish",
    "speechCode": "es-ES"
  }
]
```

#### POST /api/translate

Translates text from source to target language.

**Request:**
```bash
POST http://localhost:5000/api/translate
Content-Type: application/json

{
  "text": "Hello, how are you?",
  "source": "en",
  "target": "es"
}
```

**Request Parameters:**
- `text` (string, required): Text to translate (max 5,000 characters)
- `source` (string, required): Source language code (use "auto" for detection)
- `target` (string, required): Target language code

**Response (200 OK):**
```json
{
  "translatedText": "Hola, ¿cómo estás?"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Please enter text to translate."
}
```

**Response (502 Bad Gateway):**
```json
{
  "error": "Translation service error: [details]"
}
```

**Error Codes:**
- `400` - Invalid input (empty text, same language, too long)
- `500` - Server error
- `502` - Translation API error

---

## Testing

### Running Backend Tests

```bash
cd backend

# Run all tests
pytest test_app.py -v

# Run specific test
pytest test_app.py::test_get_languages -v

# Run with coverage
pytest test_app.py --cov=app
```

### Test Coverage

Current tests cover:

1. **Language Listing** (`test_get_languages`)
   - Verifies API returns list of languages
   - Checks for English in language list

2. **Empty Text Validation** (`test_translate_empty_text`)
   - Ensures empty input returns 400 error

3. **Same Language Check** (`test_translate_same_language`)
   - Validates source ≠ target requirement

4. **Character Limit** (`test_translate_text_too_long`)
   - Tests 5,000 character limit enforcement

5. **Valid Translation** (`test_translate_valid_request`)
   - Tests successful translation request

### Running Frontend Tests

```bash
cd frontend

# Build test
npm run build

# Type checking
npm run type-check  # (if available)
```

---

## Troubleshooting

### Backend Issues

#### Problem: `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
cd backend
source venv/bin/activate  # macOS/Linux
# or .\venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt
```

#### Problem: Port 5000 already in use

**Solution (Windows PowerShell):**
```powershell
# Find process on port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess
# Kill the process
Stop-Process -Id <PID> -Force
```

**Solution (macOS/Linux):**
```bash
lsof -i :5000
kill -9 <PID>
```

#### Problem: Connection refused when accessing API

**Verify backend is running:**
```bash
# Should return language list
curl http://localhost:5000/api/languages
```

**Check proxy in `vite.config.ts`** points to correct backend URL.

---

### Frontend Issues

#### Problem: `npm: command not found`

**Solution:**
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

#### Problem: Port 5173 already in use

**Solution:**
- Another dev server is running
- Stop other dev servers or use different port:
```bash
npm run dev -- --port 5174
```

#### Problem: Cannot reach backend (`Could not reach the translation server`)

**Solution:**
1. Verify backend is running on http://localhost:5000
2. Check `frontend/vite.config.ts` proxy configuration
3. Ensure both frontend and backend are running

---

### Translation Issues

#### Problem: Auto-detection not working

**Solution:**
- Ensure source language is set to "Auto Detect"
- MyMemory may have daily limits (1,000 words/day free)
- Try Google or Microsoft API for better detection

#### Problem: Text-to-Speech not working

**Solution:**
- Browser support varies (Chrome/Edge best support)
- Ensure speaker volume is on
- Some languages may not have voices available in your OS
- Try different browser

#### Problem: "Translation request timed out"

**Solution:**
- MyMemory API may be slow
- Try smaller text chunks
- Check your internet connection
- Switch to Google/Microsoft API if available

---

## Development

### Project Setup for Development

```bash
# Install all dependencies
npm install          # Frontend
pip install -r requirements.txt  # Backend

# Run both servers
# Terminal 1
cd backend
python app.py

# Terminal 2
cd frontend
npm run dev
```

### Code Structure

#### Frontend Architecture
- **Components:** Reusable React components
- **Services:** API communication layer
- **Styles:** Global CSS variables design system
- **Types:** TypeScript interfaces

#### Backend Architecture
- **Routes:** Flask endpoints
- **Handlers:** Translation logic for each API
- **Validation:** Input checking
- **Error Handling:** Comprehensive error responses

### Building for Production

**Backend:**
```bash
cd backend
pip install gunicorn
gunicorn -w 4 app:app  # Run with production WSGI
```

**Frontend:**
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

---

## FAQ

**Q: Do I need API keys to use LinguaAI?**
A: No! MyMemory is free and requires no keys. Only needed for Google/Microsoft.

**Q: What's the translation character limit?**
A: 5,000 characters per request.

**Q: How many languages are supported?**
A: 48 major world languages.

**Q: Can I change the translation API?**
A: Yes! Edit `backend/.env` and set `TRANSLATION_API=google` or `microsoft`.

**Q: Does it work offline?**
A: No, it requires internet for translation API calls.

**Q: Can I deploy this?**
A: Yes! Use Flask server (Gunicorn) + React build (nginx/Vercel).

---

## Support & Contact

**Project:** LinguaAI  
**Author:** Usama Salman AI Intern @ SoftGrowTech  
**Date:** March 2026  
**GitHub:** https://github.com/usamasalman/Internship

For issues or questions, please check the Troubleshooting section above.

---

## License

This project is part of the SoftGrowTech AI Internship Program.

---

**Last Updated:** March 3, 2026
