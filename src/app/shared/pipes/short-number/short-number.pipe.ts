import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})
export class ShortNumberPipe implements PipeTransform {

  transform(value: number): string {
    if (value === null || value === undefined) return '';

    const abs = Math.abs(value);

    if (abs >= 1.0e12) {
      return (value / 1.0e12).toFixed(2) + ' T';
    }
    if (abs >= 1.0e9) {
      return (value / 1.0e9).toFixed(2) + ' B';
    }
    if (abs >= 1.0e6) {
      return (value / 1.0e6).toFixed(2) + ' M';
    }
    if (abs >= 1.0e3) {
      return (value / 1.0e3).toFixed(2) + ' K';
    }

    return value.toString();
  }
}
