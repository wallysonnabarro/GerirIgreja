import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyBrl'
})
export class monetario implements PipeTransform {
    transform(value: number): string {
        if (isNaN(value)) return ''; 

        return 'R$ ' + value.toFixed(2).replace('.', ',');
    }
}