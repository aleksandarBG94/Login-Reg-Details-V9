import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

interface UserType {
  username: string;
  password: string;
  email: string;
} // Just defining the structure of the object

@Injectable({
  providedIn: 'root' //Injectable decorator is used to make this class injectable; making it available across the app
})
export class AuthService {
  private isAuthenticated = false; //default; If the user is not logged in, it will remain false

  constructor() {}

  login(username: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') ?? '[]');
    const userFound = users.find((user: UserType) => user.username === username && user.password === password);
    
    if (userFound) {
      this.isAuthenticated = true; // Set user = authenticated;
      sessionStorage.setItem('currentUserEmail', userFound.email); // Store user email in session storage
      return true;
    } else {
      this.isAuthenticated = false; // Reset authentication status on fail
      return false;
    }
  }

  logout(): void {
    this.isAuthenticated = false;
  } //simple logout method for logging out

  checkLogin(): Observable<boolean> {
    return of(this.isAuthenticated);
  }
}