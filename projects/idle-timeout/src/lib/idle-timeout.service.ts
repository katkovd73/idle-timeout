import { Injectable, WritableSignal, signal } from '@angular/core';
import { IdleTimeoutComponent } from './idle-timeout.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface IIdleSettings {
  timeIntervalExpiredTime: number;
  timeIntervalExpiringTime: number;
  timeIntervalCheckIdleStatus: number;
  dialogWidth: number;
  dialogHeight: number;
  dialogLeftPosition: number;
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
  private timer: any;
  private timeOutMilliSeconds: number = 0;
  private timeOutWarningMilliSeconds: number = 0;
  private timeIntervalCheckIdleStatus: number = 0;

  private dialogRef!: MatDialogRef<any, any>;
  private dialogWidth: string | undefined;
  private dialogHeight: string | undefined;
  private dialogLeftPosition: string | undefined;

  private idleTimeout: IIdleTimeoutModel = { expired: false, expiring: false };
  private idleSignal: WritableSignal<IIdleTimeoutModel> = signal(this.idleTimeout);

  constructor(public dialog: MatDialog) { }

  startWatching(settings: IIdleSettings): void {

    //settings
    this.dialogWidth = settings.dialogWidth + 'px';
    this.dialogHeight = settings.dialogHeight + 'px';
    this.dialogLeftPosition = settings.dialogLeftPosition + 'px';
    this.timeOutMilliSeconds = settings.timeIntervalExpiredTime;
    this.timeOutWarningMilliSeconds = settings.timeIntervalExpiringTime;
    this.timeIntervalCheckIdleStatus = settings.timeIntervalCheckIdleStatus;

    document.addEventListener('click', this.resetIdle.bind(this));
    document.addEventListener('keypress', this.resetIdle.bind(this));
    this.resetIdle();
    this.startTimer(this.timeIntervalCheckIdleStatus);
  }

  startWatchingAgain() {
    this.loggedInSignal.set(true);
    this.startTimer(this.timeIntervalCheckIdleStatus);
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

  private startTimer(timeInterval: number): void {
    this.timer = setInterval(() => this.verifyIdleStatus(), timeInterval);
  }

  private stopTimer() {
    clearInterval(this.timer);
  }

  private openDialog() {
    this.dialogRef = this.dialog.open(IdleTimeoutComponent,
      {
        height: this.dialogHeight,
        width: this.dialogWidth,
        position: { left: this.dialogLeftPosition }
      });
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
            this.stopTimer();
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
    }
  }
}
