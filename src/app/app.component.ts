import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconsRegistryService } from '@data/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  providers: [
    IconsRegistryService,
  ],
})
export class AppComponent {
  private readonly iconRegistry = inject(IconsRegistryService);

  constructor() {
    this.iconRegistry.init();
  }
}
