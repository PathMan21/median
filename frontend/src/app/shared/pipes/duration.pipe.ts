import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'duration',
    standalone: true
})
export class DurationPipe implements PipeTransform {
    transform(minutes: number | undefined): string {
        if (!minutes) return '';

        if (minutes < 60) {
            return `${minutes}min`;
        }

        const h = Math.floor(minutes / 60);
        const m = minutes % 60;

        if (m === 0) {
            return `${h}h`;
        }

        return `${h}h ${m}min`;
    }
}
