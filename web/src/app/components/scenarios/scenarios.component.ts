import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-scenarios',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './scenarios.component.html',
})
export class ScenariosComponent {
    @Input() scenarios: string[] = [];
}
