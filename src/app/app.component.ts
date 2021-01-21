import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /**
   * Titulo de la aplicacion
   */
  public title = 'Tutorial-RxJS';
  /**
   * Informacion del Observable
   */
  public info = '';
  /**
   * Resultado que muestra la suscripcion
   */
  public result = '';
  /**
   *  Suscripcion
   */
  public subcription: Subscription = new Subscription();
  /**
   * Lista de Observables
   */
  public observables = [
    {
      name: 'interval',
      info:
        'El operador interval se ejecuta cada vez hasta el infinito o nos desuscribamos, el perido de tiempo que le ' +
        'hayamos asignado en este caso 1 segundo (1000 milisegundos)',
    },
    {
      name: 'timer',
      info:
        'Este observable se ejecuta pasado el tiempo que le hemos asignado en este caso 3 segundos.',
    },
    { name: 'fromEvent', info: '' },
  ];

  /**
   * observableMethods
   */
  public observableMethods(method: string, info: string): void {
    this.unsubcribe();
    this.info = info;

    switch (method) {
      case 'interval':
        this.methodInterval();
        break;
      case 'timer':
        this.methodTimer();
        break;

      default:
        break;
    }
  }

  /**
   * methodTimer. Creamos un observable de la variable Timer.
   */
  private methodTimer(): void {
    const contador = timer(3000);
    this.subcription = contador.subscribe(() => {
      this.result = '------------> Timer <------------';
    });
  }

  /**
   * methodInterval. Creamos un observable de la variable Interval.
   */
  private methodInterval(): void {
    const contador = interval(1000);

    this.subcription = contador.subscribe((n) => {
      this.result += `Cada ${n} segundos \n`;
    });
  }

  /**
   * unsubcribe. Vaciamos la informacion de la consola y nos desuscribimos.
   */
  private unsubcribe(): void {
    this.info = '';
    this.result = '';
    this.subcription.unsubscribe();
  }
}
