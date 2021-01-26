import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  timer,
  interval,
  Subscription,
  fromEvent,
  of,
  range,
  concat,
  Observable,
} from 'rxjs';
import { filter, map, mapTo, share, take, tap } from 'rxjs/operators';

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
  public title = 'Tutorial RxJS';
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
   * Muestra los botones de Error o Complete
   */
  public showButtonsErrorOrComplete = false;

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
   * @param info Informacion del observable
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
      case 'tap':
        this.methodTap();
        break;
      case 'share':
        this.methodShare();
        break;
      case 'concat':
        this.methodConcat();
        break;
      case 'nextErrorComplete':
        this.showButtonsErrorOrComplete = true;
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
    this.showButtonsErrorOrComplete = false;
    this.info = '';
    this.result = '';
    this.subcription.unsubscribe();
  }

  /**
   * Creamos un observable y vemos los estados de la suscripción
   */
  public methodNextErrorComplete(error: boolean): void {
    this.result = '';
    this.subcription.unsubscribe();

    let myObservable: Observable<any>;

    if (error) {
      myObservable = new Observable((observer) => {
        observer.next(1);
        observer.next(2);
        observer.next(3);
        observer.error('ERROR TERRIBLE');
        observer.complete();
      });
    } else {
      myObservable = new Observable((observer) => {
        observer.next(1);
        observer.next(2);
        observer.next(3);
        observer.complete();
      });
    }

    this.subcription = myObservable.subscribe({
      next: (x) => {
        this.result += `El siguiente valor es ${x}\n`;
      },
      error: (err) => {
        this.result += `Error ---> ${err}`;
      },
      complete: () => {
        this.result += 'Suscripción Completa';
      },
    });
  }

  /**
   * Creamos un observable del operador Concat
   */
  private methodConcat(): void {
    const time = interval(1000).pipe(take(4));
    const rango = range(1, 10);

    const result = concat(time, rango);

    this.subcription = result.subscribe((x) => {
      this.result += x + '\n';
    });
  }

  /**
   * Creamos un observable del operador Share
   */
  private methodShare(): void {
    const time = timer(1000);
    const obs = time.pipe(
      tap(() => (this.result += 'TAP ON\n')),
      mapTo('END OBS\n')
    );

    const shareObs = obs.pipe(share());

    this.subcription = shareObs.subscribe((val) => (this.result += val));
    this.subcription = shareObs.subscribe((val) => (this.result += val));
    this.subcription = shareObs.subscribe((val) => (this.result += val));
    this.subcription = shareObs.subscribe((val) => (this.result += val));
  }

  /**
   * Creamos un observable del operador Tap
   */
  private methodTap(): void {
    const clicks = fromEvent(document, 'click');
    const positions = clicks.pipe(
      tap(
        (event) => (this.result += JSON.stringify(event) + '\n'),
        (error) => (this.result += error + '\n'),
        () => (this.result += 'Complete' + '\n')
      )
    );
    this.subcription = positions.subscribe();
  }

  /**
   * Creamos un observable del operador Filter
   */
  private methodFilter(): void {
    const nums = of(1, 2, 3, 4, 5);
    const evenNumbers = filter((n: number) => n % 2 === 0);
    this.subcription = evenNumbers(nums).subscribe((n: number) => {
      this.result += `Número par: ${n} \n`;
    });
  }

  /**
   * Creamos un observable del operador Map
   */
  private methodMap(): void {
    const nums = of(1, 2, 3, 4, 5);
    const numbersSquared = map((n: number) => n * n);
    this.subcription = numbersSquared(nums).subscribe((n: number) => {
      this.result += `Número: ${n}\n`;
    });
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
