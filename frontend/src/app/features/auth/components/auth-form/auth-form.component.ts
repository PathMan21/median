import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-auth-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './auth-form.component.html',
    styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent {
    @Input() form!: FormGroup;
    @Input() loading = false;
    @Input() isLogin = true;
    @Input() submitLabel = 'Valider';
    @Input() loadingLabel = 'Traitement...';
    @Input() loginPlaceholder = 'Entrez votre login';

    @Output() submit = new EventEmitter<void>();
}
