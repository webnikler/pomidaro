import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

class CustomIcon {
  private static readonly folder = 'assets/custom-icons';
  public readonly path: string;

  constructor(public name: string) {
    this.path = `${CustomIcon.folder}/${name}.svg`;
  }
}

@Injectable()
export class CustomIconsService {
  private icons = [new CustomIcon('google')];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
  ) { }

  public init() {
    for (const icon of this.icons) {
      this.registerIcon(icon);
    }
  }

  private registerIcon({ name, path }: CustomIcon) {
    this.matIconRegistry.addSvgIcon(name, this.domSanitzer.bypassSecurityTrustResourceUrl(path));
  }
}