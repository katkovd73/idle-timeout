import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'lib-idle-timeout',
  standalone: true,
  imports: [MatDialogModule],
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
