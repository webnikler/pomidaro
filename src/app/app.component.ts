import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomIconsService } from '@services';

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
  private readonly customIcons = inject(CustomIconsService);

  constructor() {
    this.customIcons.init();
  }
}
