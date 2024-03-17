import { Injectable, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class IconsRegistryService {
  private readonly iconsFolder = 'assets/icons';
  private readonly icons = ['google'];

  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly domSanitzer = inject(DomSanitizer);

  init() {
    this.icons.forEach(i => this.register(i));
  }

  private getPath(name: string, ext = 'svg') {
    const path = `${this.iconsFolder}/${name}.${ext}`;
    return this.domSanitzer.bypassSecurityTrustResourceUrl(path);
  }

  private register(name: string) {
    this.matIconRegistry.addSvgIcon(name, this.getPath(name));
  }
}
