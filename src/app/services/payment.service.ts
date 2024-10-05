import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly payPerHour = environment.payPerHour;
  private readonly payPerMin = environment.payPerMin;

  constructor() { }

  calculatePayment(entryTime: Date): number[] {
    const currentTime = Date.now();
    const minutes = this.calculateMinutes(entryTime, currentTime);

    if (minutes < 0) {
      throw new Error('Invalid parking time');
    }

    return this.calculateAmount(minutes);
  }

  private calculateMinutes(entryTime: Date, currentTime: number): number {
    return Math.round(Math.abs(currentTime - entryTime.getTime()) / 60000);
  }

  private calculateAmount(minutes: number): number[] {
    if (minutes < 60) {
      return [this.payPerMin * minutes, minutes];
    } else {
      const hours = Math.floor(minutes / 60);
      const balanceMin = minutes % 60;
      return [(this.payPerHour * hours) + (this.payPerMin * balanceMin), minutes];
    }
  }

}
