import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { SessionStore } from '@data/session';
import { UserStore } from '@data/user';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatIcon,
    RouterLink,
    FlexLayoutModule,
    MatListModule,
    MatDividerModule,
    DatePipe,
  ]
})
export class HomeSidenavComponent {
  readonly session = inject(SessionStore);
  readonly user = inject(UserStore);
}
