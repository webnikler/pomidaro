import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconsService } from '@services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  providers: [
    IconsService,
  ],
})
export class AppComponent {
  private readonly icons = inject(IconsService);

  constructor() {
    this.icons.init();
  }
}
