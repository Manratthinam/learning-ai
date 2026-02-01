import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizQuestion } from '../../services/learning.service';

@Component({
    selector: 'app-quiz',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './quiz.component.html',
})
export class QuizComponent {
    @Input() questions: QuizQuestion[] = [];

    selectedAnswers: { [key: number]: number } = {};
    isSubmitted = false;
    score = 0;

    selectAnswer(questionIndex: number, optionIndex: number) {
        if (!this.isSubmitted) {
            this.selectedAnswers[questionIndex] = optionIndex;
        }
    }

    allAnswered(): boolean {
        return this.questions.length > 0 &&
            Object.keys(this.selectedAnswers).length === this.questions.length;
    }

    submit() {
        this.isSubmitted = true;
        this.score = 0;
        this.questions.forEach((q, index) => {
            if (this.selectedAnswers[index] === q.correct_answer) {
                this.score++;
            }
        });
    }

    reset() {
        // Logic to reset app state (handled by parent usually, but here for local reset)
        window.location.reload();
    }
}
