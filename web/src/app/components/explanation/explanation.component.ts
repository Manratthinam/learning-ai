import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-explanation',
    standalone: true,
    templateUrl: './explanation.component.html',
})
export class ExplanationComponent {
    @Input() text: string = '';
}
