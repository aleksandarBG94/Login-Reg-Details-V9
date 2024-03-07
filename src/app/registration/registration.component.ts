import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface UserType {
  username: string,
  email: string
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  showPassword: boolean = false;
  errorUserMessage: string | null = null;
  errorEmailMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(40)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      confirmPassword: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(40)]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(15)]],
      country: ['', [Validators.required]]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const newUser = this.registrationForm.value;
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Check if the username already exists
      const usernameExists = users.some((user: UserType) => user.username === newUser.username);
      const emailExists = users.some((user: UserType) => user.email === newUser.email);

      if (usernameExists) {
        // Handel the case where the username already exists (show an error message)
        this.errorUserMessage = 'Username already exists!';
        return;
      } else if (emailExists) {
        this.errorEmailMessage = 'Email already exists!';
        return;
      } else {
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        sessionStorage.setItem('currentUserEmail', newUser.email); // Store email in session storage upon successful registration
        this.router.navigate(['/login']);
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}