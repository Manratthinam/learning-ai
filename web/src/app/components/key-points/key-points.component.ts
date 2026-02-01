import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-key-points',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './key-points.component.html',
})
export class KeyPointsComponent {
    @Input() points: string[] = [];
}
