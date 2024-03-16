import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CustomIconsService } from './services/custom-icons.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  providers: [
    CustomIconsService,
  ],
})
export class AppComponent {
  constructor(private customIcons: CustomIconsService) {
    this.customIcons.init();
  }
}
