import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, interval, Subscription, fromEvent } from 'rxjs';
import { TypeObservable } from './models/type-observable';

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
  public observables: TypeObservable[] = [];
  /**
   * Muestra el boton de Desuscripcion
   */
  public showButtonUnsubcribe = false;
  /**
   *  Suscripcion
   */
  private subcription: Subscription = new Subscription();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Cargar los observables
    this.http
      .get<TypeObservable[]>('assets/data/observables.json')
      .subscribe((res: TypeObservable[]) => {
        this.observables = res;
      });
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
      case 'map':
        this.methodMap();
        break;
      case 'filter':
        this.methodFilter();
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
   * Creamos un observable de la variable Filter
   */
  private methodFilter(): void {
    // TODO Metodo Filter
  }

  /**
   * Creamos un observable de la variable Map
   */
  private methodMap(): void {
    // TODO Metodo Map
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
