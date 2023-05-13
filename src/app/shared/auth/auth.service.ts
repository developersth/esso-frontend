import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from 'firebase/app'
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { delay, tap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  token: string;
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = "jwt";
  private readonly fullName = "fullName";
  //public isLoggedIn: boolean = false; // กำหนดสถานะล็อกอินเริ่มต้นเป็น false
  public redirectUrl: string; // กำหนดตัวแปรสำหรับเก็บ url ที่จะลิ้งค์ไป

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  constructor(public _firebaseAuth: AngularFireAuth, public router: Router,private http: HttpClient) {
    this.user = _firebaseAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
        }
        else {
          this.userDetails = null;
        }
      }
    );

  }

  signupUser(email: string, password: string) {
    //your code for signing up the new user
  }

  signinUser(username: string, password: string):Observable<any> {
    //your code for checking credentials and getting tokens for for signing in user
    // return this._firebaseAuth.signInWithEmailAndPassword(email, password)

    const payload = { username, password };
    let data: any = [];
    return  this.http.post<string>(`${this.apiUrl}/login`, payload).pipe(
      delay(500),
      tap((response: any) => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.fullName, response.user.name);
      }),
      tap(() => this.isAuthenticatedSubject.next(true))
    );
    //uncomment above firebase auth code and remove this temp code
    // return new Promise(function(resolve, reject) {
    //   setTimeout(function() {
    //     resolve(true);
    //   }, 1000);
    // });

  }

  logoutFirebase() {
    this._firebaseAuth.signOut();
    this.router.navigate(['YOUR_LOGOUT_URL']);
  }

  // isAuthenticated() {
  //   return true;
  // }
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.fullName);
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn() {
    return !!this.getToken();
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return token !== null;
    //return true;
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
}
