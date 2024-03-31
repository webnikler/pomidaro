import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

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
  ]
})
export class HomeSidenavComponent {

}
