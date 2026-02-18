export declare class RegisterComponent {
    private auth;
    private router;
    private fb;
    form: import("@angular/forms", { with: { "resolution-mode": "import" } }).FormGroup<{
        login: import("@angular/forms", { with: { "resolution-mode": "import" } }).FormControl<string | null>;
        password: import("@angular/forms", { with: { "resolution-mode": "import" } }).FormControl<string | null>;
    }>;
    loading: boolean;
    error: string;
    success: string;
    submit(): void;
}
