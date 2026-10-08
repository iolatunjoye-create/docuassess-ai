# DocuAssess AI

Upload a document and generate exams, mark schemes, student test runner, AI grading and examiner chat — powered by Claude.

## Run locally
```bash
cp .env.example .env      # then set ANTHROPIC_API_KEY
npm install
npm run dev               # http://localhost:3000
```
Check `http://localhost:3000/api/health` to confirm the key is detected.

## Deploy to Vercel (recommended)
Frontend is static (`dist/`), the API runs as serverless functions in `/api`.
```bash
npm i -g vercel
vercel                      # follow prompts, then:
vercel env add ANTHROPIC_API_KEY
vercel --prod
```
Or push to GitHub and import the repo at vercel.com, then add `ANTHROPIC_API_KEY` under Project Settings > Environment Variables.

Limits to know: request bodies max 4.5 MB (so uploads of roughly 3 MB or less; the UI warns), and `vercel.json` sets a 60s function timeout for generation/marking. Netlify's default function timeout (10-26s) is too short for generating a full paper, so Vercel (or the Docker/Node option below) is the better fit.

## Production (self-hosted Node)
```bash
npm install
npm run build             # builds the frontend into dist/
npm start                 # serves dist/ + API on $PORT (default 3000)
```

### Docker
```bash
docker build -t docuassess .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=sk-ant-... docuassess
```

## Notes
- Supported uploads: PDF, images (PNG/JPG/GIF/WEBP), plain text. `.docx` is not read natively — convert to PDF or paste text.
- All app data (assessments, submissions, teacher codes) is stored in the browser's localStorage. Admin default passcode is `ADMIN-2026`. Treat this as a demo until a real backend and auth are added.
