import os
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi
from dotenv import load_dotenv

# Load .env from the same directory as this file
from pathlib import Path
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="Learning Assistance AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration for Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: int
    explanation: str

class VideoAnalysisRequest(BaseModel):
    youtube_url: str

class VideoAnalysisResponse(BaseModel):
    explanation: str
    key_points: List[str]
    scenarios: List[str]
    quiz: List[QuizQuestion]

@app.get("/")
async def root():
    print("Welcome to Learning Assistance AI API")
    return {"message": "Welcome to Learning Assistance AI API"}

def extract_video_id(url: str):
    """
    Extracts the video ID from a YouTube URL.
    """
    import re
    # Patterns for different YouTube URL formats
    patterns = [
        r"(?:v=|\/)([0-9A-Za-z_-]{11}).*",
        r"(?:youtu\.be\/)([0-9A-Za-z_-]{11})",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def get_video_transcript(video_id: str) -> str:
    """
    Retrieves transcript for a video, trying manual English, then auto-generated English.
    """
    try:
        # Create an instance of the API class (required in this version)
        yt_api = YouTubeTranscriptApi()
        
        # fetch() automatically tries to find a transcript in the given languages.
        # It searches manually created transcripts first, then generated ones for each language.
        transcript = yt_api.fetch(video_id, languages=['en', 'en-US', 'en-GB'])
        
        return " ".join([snippet.text for snippet in transcript])
        
    except Exception as e:
        print(f"Transcript Fetch Error: {e}")
        raise e


@app.post("/analyze-youtube", response_model=VideoAnalysisResponse)
async def analyze_youtube(request: VideoAnalysisRequest):
    print(request.youtube_url)
    try:
        video_id = extract_video_id(request.youtube_url)
        if not video_id:
             raise HTTPException(status_code=400, detail="Invalid YouTube URL")

        # 1. Get Transcript
        print(f"Fetching transcript for: {video_id}...")
        try:
            transcript_text = get_video_transcript(video_id)
        except Exception as e:
            print(f"Transcript Error: {str(e)}")
            raise HTTPException(status_code=400, detail="Could not retrieve transcript. Video might not have captions or they are disabled.")

        # 2. Prompt for Explanation and Quiz
        prompt = f"""
        You are an expert tutor for a Software developer who know basic programming concepts. 
        Read the following video transcript and provide:
        1. A simple, engaging explanation of the topic.
        2. Give key points form the video.
        3. Provide real scenario based examples to understand the topic better.
        4. A quiz with 5 multiple-choice questions to test understanding.
        
        Transcript:
        {transcript_text[:25000]} 
        (Truncated if too long, focus on the main content provided)

        Return the result in valid JSON format with this structure:
        {{
            "explanation": "string",
            "key_points": ["string", "string", "string", "string"],
            "scenarios": ["string", "string", "string", "string"],
            "quiz": [
                {{
                    "question": "string",
                    "options": ["string", "string", "string", "string"],
                    "correct_answer": int (0-3 index),
                    "explanation": "string"
                }}
            ]
        }}
        """

        model = genai.GenerativeModel(model_name="gemini-3-flash-preview")
        print("Generating content from transcript...")
        # Check if transcript is very long, might need token management, 
        # but 1.5 Pro context window is huge.
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        
        print("Content generated.")
        import json
        return json.loads(response.text)

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
