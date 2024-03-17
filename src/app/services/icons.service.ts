import { Injectable, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

class Icon {
  private static readonly folder = 'assets/icons';
  public readonly path: string;

  constructor(public name: string) {
    this.path = `${Icon.folder}/${name}.svg`;
  }
}

@Injectable()
export class IconsService {
  private icons = [new Icon('google')];

  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly domSanitzer = inject(DomSanitizer);

  init() {
    for (const icon of this.icons) {
      this.registerIcon(icon);
    }
  }

  private registerIcon({ name, path }: Icon) {
    this.matIconRegistry.addSvgIcon(name, this.domSanitzer.bypassSecurityTrustResourceUrl(path));
  }
}