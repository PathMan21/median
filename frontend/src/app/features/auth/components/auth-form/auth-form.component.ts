import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-auth-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
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
    private passwordSubs?: Subscription;

    strength = 0;
    strengthLabel = 'Empty';
    hints = {
        minLength: false,
        lowercase: false,
        uppercase: false,
        numbers: false,
        special: false,
    };
    private labels = ['Empty', 'Weak', 'Medium', 'Strong', 'Very Strong', 'Super Strong'];

    ngOnInit(): void {
        const pc = this.form?.get('password');
        if (pc) {
            this.passwordSubs = pc.valueChanges.subscribe(v => this.updateStrength(v || ''));
            this.updateStrength(pc.value || '');
        }
    }

    ngOnDestroy(): void {
        this.passwordSubs?.unsubscribe();
    }

    private updateStrength(value: string) {
        const minLength = value.length >= 8;
        const lowercase = /[a-z]/.test(value);
        const uppercase = /[A-Z]/.test(value);
        const numbers = /[0-9]/.test(value);
        const special = /[!@#$%^&*(),.?"':{}|<>\[\]\\/\\\\_+=-]/.test(value);

        this.hints = { minLength, lowercase, uppercase, numbers, special };
        this.strength = [minLength, lowercase, uppercase, numbers, special].filter(Boolean).length;
        this.strengthLabel = this.labels[Math.min(this.strength, this.labels.length - 1)];
    }
}
