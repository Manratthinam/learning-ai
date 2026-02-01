import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-youtube-input',
    standalone: true, // Assuming standalone based on ng new defaults
    templateUrl: './youtube-input.component.html',
})
export class YoutubeInputComponent {
    @Output() analyze = new EventEmitter<string>();
    loading = false;

    onSubmit(url: string) {
        if (url && !this.loading) {
            this.loading = true;
            this.analyze.emit(url);
        }
    }

    reset() {
        this.loading = false;
    }
}
