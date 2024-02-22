import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-idle-timeout',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatDialogActions, MatDialogContent, MatDialogClose],
  template: `
   <h2 mat-dialog-title>Extend Session?</h2>
   <mat-dialog-content>
      <p>Due to inactivity, your login session will expire shortly. Do you want to continue?</p>
   </mat-dialog-content>
   <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Click to stay logged in</button>
   </mat-dialog-actions>
  `,
  styles: ``
})
export class IdleTimeoutComponent {

}
