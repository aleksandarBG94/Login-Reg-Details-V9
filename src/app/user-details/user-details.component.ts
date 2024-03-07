import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface UserType {
  username: string;
  email: string;
}
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  userDetailsForm!: FormGroup;
  showPassword = false;
  errorMessage: string | null = null;
  canSubmit = false;
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.userDetailsForm = this.fb.group({
      username: ['', [Validators.maxLength(40)]],
      phone: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(15)]],
      country: [''],
      password: ['', [Validators.minLength(6), Validators.maxLength(40)]],
      confirmPassword: [''],
      // Email is not included as it's not updtable per requirements
    }, {validator: this.checkPasswords });
    this.userDetailsForm.valueChanges.subscribe((values) => {
      this.canSubmit = Object.keys(values).some(key => values[key]);
    });
  }

  checkPasswords(group: FormGroup): {notSame: boolean} | null {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true }
  }

  onSubmit() {
    this.submitted = true; // Mark the form as attempted to submit for validation messages
    this.errorMessage = null;
  
    if (this.userDetailsForm.valid) {
        const updatedDetails = this.userDetailsForm.value;
        const users = JSON.parse(localStorage.getItem('users') ?? '[]');
        const currentUserEmail = sessionStorage.getItem('currentUserEmail');
        const currentUserIndex = users.findIndex((user: UserType) => user.email === currentUserEmail);
  
        if (currentUserIndex !== -1) {
            const currentUser = users[currentUserIndex];
            // Check if any filld is modified and update accordingly
            if (updatedDetails.username && updatedDetails.username !== currentUser.username) {
                const isUsernameTaken = users.some((user: UserType) => user.username === updatedDetails.username && user.email !== currentUserEmail);
                if (isUsernameTaken) {
                    this.errorMessage = 'Username already exists!';
                    return;
                } else {
                    currentUser.username = updatedDetails.username;
                }
            }
            if (updatedDetails.password) currentUser.password = updatedDetails.password;
            if (updatedDetails.phone) currentUser.phone = updatedDetails.phone;
            if (updatedDetails.country) currentUser.country = updatedDetails.country;
            
            // Save the updated users array back to local storage
            localStorage.setItem('users', JSON.stringify(users));
            console.log('User details updated', updatedDetails);
        } else {
            console.log('User not found');
        }
    }
}
  

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  logout() {
    // Clear user data...
    this.router.navigate(['/login']); // Redirect to login  
    sessionStorage.removeItem('currentUserEmail');
  }
}
