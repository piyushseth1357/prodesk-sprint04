# Prompts.md — AI Usage Log
Sprint 04 | Piyush Seth | Prodesk IT

---

## About
I built this AI Cover Letter Generator myself.
I used Claude AI only when I was stuck on 
specific concepts or errors.
All logic and structure was done by me.

---

## Prompt 1 — Form State Management
**Prompt:**
> "how to capture form input values 
in vanilla javascript onsubmit"

**What I did:**
I learned to use document.getElementById 
and .value.trim() to capture form data.
I implemented this myself in my 
generate button click handler.

---

## Prompt 2 — Template String Interpolation
**Prompt:**
> "how to use template literals to 
inject variables into a string in javascript"

**What I did:**
I learned about backtick strings and 
${variable} syntax. I used this to build 
the hardcoded cover letter template in 
generateTemplate() function.

---

## Prompt 3 — Gemini API Integration
**Prompt:**
> "how to call google gemini api 
using fetch in javascript"

**What I did:**
I learned about the Gemini API endpoint 
and request format. I implemented the 
generateWithGemini() async function myself 
using fetch with POST method and JSON body.

---

## Prompt 4 — API Key Security
**Prompt:**
> "how to protect api key in frontend 
javascript project using vercel"

**What I did:**
I learned about .env files and .gitignore.
I created a Vercel serverless function 
in api/generate.js to proxy API calls 
so the key is never exposed in frontend code.

---

## Prompt 5 — PDF Text Extraction
**Prompt:**
> "how to extract text from pdf file 
using pdf.js library in browser"

**What I did:**
I learned about pdfjsLib.getDocument() 
and page.getTextContent() methods.
I implemented the resume file upload 
and text extraction myself.

---

## Prompt 6 — Copy to Clipboard
**Prompt:**
> "how to copy text to clipboard 
using javascript navigator.clipboard"

**What I did:**
I learned about navigator.clipboard
.writeText() method. I added success 
message that disappears after 3 seconds.

---

## Summary
Total AI interactions: 6
AI was used to understand concepts only.
All features were built and modified by me.
I understood every line before using it.
