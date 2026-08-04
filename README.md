# Background Remover Application

A full-stack AI-powered background removal application with React frontend and FastAPI backend.

## Author

**Andrew San Antonio**  
Email: sgandrew290@gmail.com

## Project Structure

```
.
├── frontend/          # React + Vite frontend application
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── README.md
│
└── backend/           # FastAPI backend with rembg
    ├── app/
    ├── requirements.txt
    └── README.md
```

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**

## Features

- 🎨 Modern React UI with drag-and-drop image upload
- 🤖 AI-powered background removal using rembg
- 🖼️ Support for JPG, PNG, and WEBP formats
- 📦 Transparent PNG output
- ⚡ Fast processing with progress tracking
- 📱 Fully responsive design
- ♿ Accessibility compliant

## Tech Stack

### Frontend
- React 18
- Vite
- Axios
- React Router
- CSS (no frameworks)

### Backend
- Python 3.12+
- FastAPI
- rembg (AI background removal)
- Pillow
- Uvicorn

## Documentation

- Frontend documentation: [`frontend/README.md`](frontend/README.md)
- Backend documentation: [`backend/README.md`](backend/README.md)

## Environment Setup

### Frontend `.env.local`

```env
VITE_API_BASE_URL=
VITE_USE_MOCK_API=false
```

### Backend

No environment variables required for local development.

## Deployment

### Frontend
- Deploy to Vercel, Netlify, or any static hosting
- Build command: `npm run build`
- Output directory: `dist`

### Backend
- Deploy to Railway, Heroku, or AWS
- See [`backend/README.md`](backend/README.md) for Railway deployment guide

## Development

Both servers support hot reload:
- Frontend: File changes automatically refresh the browser
- Backend: Code changes automatically restart the server

## License

MIT

## Support

For questions or issues, contact: sgandrew290@gmail.com
