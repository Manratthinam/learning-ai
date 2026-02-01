# Learning Assistance AI

Learning Assistance AI is a powerful web application designed to help users learn from YouTube videos more effectively. It uses Google's Gemini AI to analyze video transcripts, provide simplified explanations, and generate interactive quizzes to test understanding.

## Features

- **Video Analysis**: Paste any YouTube video URL to generate instant insights.
- **Smart Simplification**: explanations customized for software developers (or your target audience) to break down complex topics.
- **Key Takeaways & Real-World Scenarios**: Get bulleted key points and practical examples to solidify concepts.
- **Interactive Quizzes**: Auto-generated 5-question multiple-choice quizzes with explanations for each answer.

## Tech Stack

### Frontend
- **Framework**: Angular 21
- **Styling**: Tailwind CSS
- **Platform**: Node.js

### Backend
- **Framework**: FastAPI (Python)
- **AI Model**: Google Gemini (`gemini-3-flash-preview`)
- **Libraries**: 
  - `youtube-transcript-api` (for fetching video captions)
  - `google-generativeai` (for content processing)
  - `uvicorn` (ASGI server)

## Prerequisites

Before running the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Python](https://www.python.org/) (v3.9+ recommended)
- A [Google Gemini API Key](https://aistudio.google.com/)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd learning-ai
```

### 2. Backend Setup (API)
Navigate to the `api` directory and set up the Python environment.

```bash
cd api

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configuration:**
Create a `.env` file in the `api` directory and add your Google API key:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

**Run the Server:**
```bash
uvicorn main:app --reload
```
The backend will start at `http://127.0.0.1:8000`.

### 3. Frontend Setup (Web)
Open a new terminal, navigate to the `web` directory, and set up the Angular application.

```bash
cd web

# Install dependencies
npm install

# Start the development server
npm start
```
The application will be available at `http://localhost:4200`.

### 4. Running with Docker

Alternatively, you can run the application using Docker.

**API (Backend):**
Build and run the API container on port 8000. You must provide your `GOOGLE_API_KEY` (either via `.env` file or `-e` flag).
```bash
docker build -t learning-ai-api ./api
docker run -p 8000:8000 --env-file ./api/.env learning-ai-api
```

**Web (Frontend):**
Build and run the Web container on port 4200.
```bash
docker build -t learning-ai-web ./web
docker run -p 4200:80 learning-ai-web
```

## Usage

1. Start both the Backend and Frontend servers.
2. Open your browser and go to `http://localhost:4200`.
3. Paste a YouTube video link into the input field.
4. Click **Analyze** to see the summary, key points, scenarios, and take the quiz.

## Troubleshooting

- **"Could not retrieve transcript"**: This error occurs if the YouTube video does not have captions/subtitles available (either manual or auto-generated). Try a different video that has captions.
- **CORS Errors**: Ensure the backend is running and the frontend requests are being sent to the correct port (default 8000). The backend is configured to accept requests from `http://localhost:4200`.

## License

[MIT](LICENSE)
