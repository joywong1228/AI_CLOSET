# AI Closet Style Backend

An Express + TypeScript backend API for generating trendy, AI-powered outfit style ideas for a closet app.  
Connects to OpenAI (GPT-4) and returns 5 fresh outfit suggestions on each POST request.

## Features

- Returns 5 unique, AI-generated outfit ideas (name, description, image prompt)
- Securely hides your OpenAI API key (never exposed to users)
- Ready for deployment (e.g., [Render.com](https://render.com))

---

## Usage

### 1. Local Development

**Install dependencies:**
```sh
npm install

Set your OpenAI key in a .env file:

OPENAI_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXXXX

Build and start the server:

npm run build
npm start

By default, the API will listen on http://localhost:3001.

⸻

2. API Endpoint

POST /api/get-style-ideas

No request body required.

Response:

[
  {
    "name": "Cozy Pastel Dream",
    "description": "Soft knits and pastel layers for a dreamy, comfy vibe.",
    "imagePrompt": "A pastel cozy outfit, oversized sweater, pleated skirt, soft lighting"
  },
  ...
]


⸻

3. Deploy to Render
	•	Push this repo to GitHub.
	•	Connect to Render, select “Web Service”, and link your repo.
	•	Set build command: npm install && npm run build
	•	Set start command: npm start
	•	Add your OPENAI_KEY as an environment variable in the Render dashboard.

⸻

Project Structure

backend/
  ├─ index.ts          # Express API
  ├─ package.json      # Scripts and dependencies
  ├─ tsconfig.json     # TypeScript config
  ├─ .env.example      # Example env file


⸻

Credits
	•	Powered by OpenAI GPT-4
	•	Built for AI Closet mobile app (Expo + React Native)

