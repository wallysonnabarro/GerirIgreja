import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitariosService {

  constructor() { }

  converterUint16ArrayParaImagem(array: Uint16Array): string {
    return 'data:image/png;base64,' + array;
  }
}
