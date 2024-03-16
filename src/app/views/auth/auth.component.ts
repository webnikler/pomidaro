import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  imports: [MatButtonModule, MatIconModule],
})
export class AuthComponent { }
