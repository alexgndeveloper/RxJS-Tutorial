import { Component, OnInit } from '@angular/core';
import { timer, interval, Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
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
        'Este observable se ejecuta pasado el tiempo que le hemos asignado, en este caso 3 segundos.',
    },
    {
      name: 'fromEvent',
      info:
        'Clickea en la pagina y te muestra las coordenadas, es muy parecido a un listening pero en observable.',
    },
  ];

  public showButtonUnsubcribe = false;
  /**
   *  Suscripcion
   */
  private subcription: Subscription = new Subscription();

  ngOnInit(): void {
    // TODO Cargar los observables, de un json
  }

  /**
   * Metodo para llamar a los diferentes metodos de los Observables
   * y mostrar su informacion
   * @param method Nombre del metodo
   * @param info Informacion del observable que vamos a mostrar
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
      case 'fromEvent':
        this.methodFromEvent();
        break;
      default:
        break;
    }
  }

  /**
   * Quitamos la informacion del terminal grafico y nos desuscribimos del observable
   */
  public unsubcribe(): void {
    this.showButtonUnsubcribe = false;
    this.info = '';
    this.result = '';
    this.subcription.unsubscribe();
  }

  /**
   * Creamos un observable de la variable FromEvent
   */
  private methodFromEvent(): void {
    const mouseClick = fromEvent(document, 'click');
    this.subcription = mouseClick.subscribe((e: any) => {
      this.result += `Coords: X: ${e.clientX}, Y: ${e.clientY}\n`;
    });
  }

  /**
   * Creamos un observable de la variable Timer
   */
  private methodTimer(): void {
    const contador = timer(3000);
    this.subcription = contador.subscribe(() => {
      this.result = '-----> Ejecuta el Observable <-----';
    });
  }

  /**
   * Creamos un observable de la variable Interval
   */
  private methodInterval(): void {
    this.showButtonUnsubcribe = true;
    const contador = interval(1000);
    this.subcription = contador.subscribe((n) => {
      this.result += `Cada ${n} segundos \n`;
    });
  }
}
