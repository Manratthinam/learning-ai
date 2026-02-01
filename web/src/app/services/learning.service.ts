import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QuizQuestion {
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
}

export interface VideoAnalysisResponse {
    explanation: string;
    key_points: string[];
    scenarios: string[];
    quiz: QuizQuestion[];
}

@Injectable({
    providedIn: 'root'
})
export class LearningService {
    private apiUrl = 'http://127.0.0.1:8000';

    constructor(private http: HttpClient) { }

    analyzeVideo(youtubeUrl: string): Observable<VideoAnalysisResponse> {
        return this.http.post<VideoAnalysisResponse>(`${this.apiUrl}/analyze-youtube`, { youtube_url: youtubeUrl });
    }
}
