# Background Remover API

A lightweight FastAPI backend for removing image backgrounds using AI (rembg).

## Features

- 🚀 Single endpoint: `POST /remove-background`
- 🖼️ Supports JPG, JPEG, PNG, and WEBP formats
- 📦 Returns transparent PNG images
- ✅ File validation (type, size, format)
- 🔒 CORS enabled for React frontend
- ⚡ Built with FastAPI for high performance

## Tech Stack

- **Python 3.12+**
- **FastAPI** - Modern web framework
- **rembg** - AI-powered background removal
- **Pillow** - Image processing
- **Uvicorn** - ASGI server
- **python-multipart** - File upload handling

## Project Structure

```
backend/
├── app/
│   ├── __init__.py      # Package initialization
│   ├── main.py          # FastAPI app and CORS setup
│   ├── routes.py        # API endpoint definitions
│   ├── services.py      # Background removal logic
│   └── utils.py         # File validation helpers
├── requirements.txt     # Python dependencies
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Local Setup

### Prerequisites

- Python 3.12 or higher
- pip (Python package manager)

### Installation

1. **Navigate to the backend directory:**

```bash
cd backend
```

2. **Create a virtual environment:**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
```

This will install:
- FastAPI
- Uvicorn (ASGI server)
- rembg (background removal)
- Pillow (image processing)
- python-multipart (file uploads)

### Running the Server

**Start the development server:**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

### Testing the API

**Health Check:**

```bash
curl http://localhost:8000/health
```

**Remove Background:**

```bash
curl -X POST http://localhost:8000/remove-background \
  -F "image=@path/to/your/image.jpg" \
  --output result.png
```

## API Documentation

### POST /remove-background

Remove background from an uploaded image.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `image` field with file data

**Accepted Formats:**
- JPG / JPEG
- PNG
- WEBP

**Constraints:**
- Maximum file size: 10MB
- File must be a valid image

**Response:**
- Success (200): PNG image with transparent background
- Content-Type: `image/png`

**Error Responses:**
- `400` - Invalid file format or empty file
- `413` - File too large (>10MB)
- `415` - Unsupported media type
- `500` - Processing error

**Example with JavaScript (Axios):**

```javascript
const formData = new FormData()
formData.append('image', fileInput.files[0])

const response = await axios.post('http://localhost:8000/remove-background', formData, {
  responseType: 'blob',
  headers: { 'Content-Type': 'multipart/form-data' }
})

const imageUrl = URL.createObjectURL(response.data)
```

## Connecting with Frontend

Your React frontend is already configured to work with this backend.

1. **Update frontend `.env.local`:**

```env
VITE_API_BASE_URL=
VITE_USE_MOCK_API=false
```

2. **Start both servers:**

```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
cd ..
npm run dev
```

The Vite proxy (configured in `vite.config.js`) will forward `/api/*` requests to `http://localhost:8000`.

## Railway Deployment

### Option 1: Using Railway CLI

1. **Install Railway CLI:**

```bash
npm install -g @railway/cli
```

2. **Login to Railway:**

```bash
railway login
```

3. **Initialize Railway project:**

```bash
cd backend
railway init
```

4. **Deploy:**

```bash
railway up
```

### Option 2: Using Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set the **Root Directory** to `backend`
5. Railway will auto-detect the Python project

### Environment Configuration

Railway will automatically:
- Detect `requirements.txt`
- Install dependencies
- Start the server using Uvicorn

**Custom Start Command (if needed):**

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Add this in Railway Settings → Deploy → Start Command

### Post-Deployment

1. **Get your Railway URL:** `https://your-project.railway.app`

2. **Update frontend `.env.local`:**

```env
VITE_API_BASE_URL=https://your-project.railway.app
VITE_USE_MOCK_API=false
```

3. **Update CORS origins in `app/main.py`** to include your production frontend URL:

```python
allow_origins=[
    "http://localhost:5173",
    "https://your-frontend-domain.com",  # Add your frontend URL
]
```

Redeploy after updating CORS settings.

## Development Notes

- **Clean code**: Separated concerns (routes, services, utilities)
- **No authentication**: Designed for simplicity
- **No database**: Stateless API
- **Dependency injection**: FastAPI's built-in DI system
- **Error handling**: User-friendly error messages matching frontend expectations

## Production Considerations

For production deployments, consider:

1. **CORS**: Update allowed origins with your actual frontend domain
2. **Rate limiting**: Add rate limiting middleware to prevent abuse
3. **Logging**: Implement structured logging (e.g., using `loguru`)
4. **Monitoring**: Add health checks and metrics
5. **File size limits**: Adjust based on your needs
6. **Caching**: Consider caching processed images
7. **CDN**: Serve processed images from CDN for better performance

## Troubleshooting

**Issue: Port already in use**

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

**Issue: rembg installation fails**

Ensure you have Python 3.12+ and pip is updated:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Issue: CORS errors in browser**

Check that:
1. Backend is running on port 8000
2. Frontend CORS origin matches your dev server URL
3. Both servers are running

## Author

**Andrew San Antonio**  
Email: sgandrew290@gmail.com

## License

MIT

## Support

For issues or questions, check:
- FastAPI docs: https://fastapi.tiangolo.com
- rembg docs: https://github.com/danielgatis/rembg
