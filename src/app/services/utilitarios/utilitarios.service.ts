import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitariosService {

  constructor() { }

  converterUint16ArrayParaImagem(array: Uint8Array): string {
    return 'data:image/png;base64,' + array;
  }


  converterUint16ArrayParaImagemSrc(array: Uint8Array): string {
    const blob = new Blob([array], { type: 'image/png' });
    return URL.createObjectURL(blob);
  }
}
