import { Component, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { YoutubeInputComponent } from './components/youtube-input/youtube-input.component';
import { ExplanationComponent } from './components/explanation/explanation.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { KeyPointsComponent } from './components/key-points/key-points.component';
import { ScenariosComponent } from './components/scenarios/scenarios.component';
import { LearningService, VideoAnalysisResponse } from './services/learning.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        YoutubeInputComponent,
        ExplanationComponent,
        QuizComponent,
        KeyPointsComponent,
        ScenariosComponent
    ], // Add CommonModule
    templateUrl: './app.component.html',
    styleUrl: './app.component.css' // Changed from app.component.css to match convention if needed, or remove
})
export class AppComponent {
    analysisResult = signal<VideoAnalysisResponse | null>(null);
    error: string | null = null;

    @ViewChild('inputComponent') inputComponent!: YoutubeInputComponent;

    constructor(private learningService: LearningService) { }

    onAnalyze(url: string) {
        this.error = null;
        this.analysisResult.set(null);

        this.learningService.analyzeVideo(url).subscribe({
            next: (result) => {
                this.analysisResult.set(result);
                this.inputComponent.reset();
            },
            error: (err) => {
                console.error(err);
                this.error = 'Failed to analyze video. Please check the URL or try again later.';
                this.inputComponent.reset();
            }
        });
    }
}
