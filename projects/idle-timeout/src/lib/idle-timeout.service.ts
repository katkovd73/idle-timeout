import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  isLoggedIn: boolean = false;

  constructor() { }

  startWatchingTimer(): void {
    this.isLoggedIn = true;
  }

  getLoggenInStatus(): boolean {
    return this.isLoggedIn;
  }
}
