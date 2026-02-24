import { Component, Input } from '@angular/core';

export type AlertType = 'error' | 'success' | 'info';

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [],
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
    @Input() message = '';
    @Input() type: AlertType = 'error';
}
