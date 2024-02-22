import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { IdleTimeoutComponent } from './idle-timeout.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface IIdleSettings {
  timeIntervalExpiredTime: number;
  timeIntervalExpiringTime: number;
  timeIntervalCheckIdleStatus: number;
}

export interface IIdleTimeoutModel {
  expired: boolean;
  expiring: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {

  loggedInSignal = signal(true);
  timer: any;
  private timeOutMilliSeconds: number = 0;
  private timeOutWarningMilliSeconds: number = 0;

  dialogRef!: MatDialogRef<any, any>;

  idleTimeout: IIdleTimeoutModel = { expired: false, expiring: false };
  private idleSignal: WritableSignal<IIdleTimeoutModel> = signal(this.idleTimeout);
  //readonly idleSignalModel: Signal<IIdleTimeoutModel> = this.idleSignal.asReadonly();

  constructor(public dialog: MatDialog) { }

  startWatching(settings: IIdleSettings): void {
    this.timeOutMilliSeconds = settings.timeIntervalExpiredTime;
    this.timeOutWarningMilliSeconds = settings.timeIntervalExpiringTime;
    document.addEventListener('click', this.resetIdle.bind(this));
    document.addEventListener('keypress', this.resetIdle.bind(this));
    this.resetIdle();
    this.startTimer(settings.timeIntervalCheckIdleStatus);
  }

  startWatchingAgain() {
    this.loggedInSignal.set(true);
  }

  private resetIdle(): void {

    if (this.loggedInSignal() == true) {

      let initDatetime = new Date();
      let timeoutSeconds = initDatetime.getSeconds() + this.timeOutWarningMilliSeconds / 1000;
      let warningSeconds = initDatetime.getSeconds() + this.timeOutMilliSeconds / 1000;
      let expiringDatetime = new Date().setSeconds(timeoutSeconds);
      let expiredDatetime = new Date().setSeconds(warningSeconds);

      localStorage.setItem('expiringDatetime', expiringDatetime.toString());
      localStorage.setItem('expiredDatetime', expiredDatetime.toString());
    }
  }

  startTimer(timeInterval: number): void {
    this.timer = setInterval(() => this.verifyIdleStatus(), timeInterval);
  }

  private openDialog() {
    this.dialogRef = this.dialog.open(IdleTimeoutComponent);
  }

  private verifyIdleStatus() {
    if (this.loggedInSignal() == true) {

      let idleTimeoutModel = this.idleSignal();
      let nowDatetime = new Date();

      // expiringDatetime
      let checkExpiringDatetimeValue = localStorage.getItem('expiringDatetime');
      if (checkExpiringDatetimeValue) {
        if (nowDatetime.getTime() >= parseInt(checkExpiringDatetimeValue)) {
          if (idleTimeoutModel.expiring === false) {
            this.idleTimeout.expiring = true;
            this.idleSignal.set(this.idleTimeout);

            if (this.loggedInSignal() == true)
              this.openDialog();
          }
        } else {
          if (idleTimeoutModel.expiring === true) {
            idleTimeoutModel.expiring = false;
            this.idleSignal.set(this.idleTimeout);
          }
        }
      } else {
        this.resetIdle();
      }

      // expiredDatetime
      let checkExpiredDatetimeValue = localStorage.getItem('expiredDatetime');
      if (checkExpiredDatetimeValue) {
        if (nowDatetime.getTime() >= parseInt(checkExpiredDatetimeValue)) {
          if (idleTimeoutModel.expired === false) {
            idleTimeoutModel.expired = true;
            console.log('Expired=true');
            this.idleSignal.set(this.idleTimeout);

            this.loggedInSignal.set(false);

            this.dialogRef.close();
          }
        } else {
          if (idleTimeoutModel.expired === true) {
            idleTimeoutModel.expired = false;
            this.idleSignal.set(this.idleTimeout);
          }
        }
      } else {
        this.resetIdle();
      }
    } else {
      console.log('User is NOT logged in');
    }

  }
}
