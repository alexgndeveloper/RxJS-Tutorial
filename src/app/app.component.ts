import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Meta, Title } from '@angular/platform-browser';
import {
  timer,
  interval,
  Subscription,
  fromEvent,
  of,
  range,
  concat,
  Observable,
  forkJoin,
  Subject,
  ConnectableObservable,
  ReplaySubject,
  BehaviorSubject,
  merge
} from 'rxjs';
import { bufferTime, concatMap, debounceTime, delay, filter, map, mapTo, mergeMap, multicast, scan, share, switchMap, take, tap } from 'rxjs/operators';

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
   * Muestra los botones de Error o Complete
   */
  public showInput = false;
  /**
   * Cargando muestra o no la terminal
   */
  public loading = false;
  /**
   * Ruta de la Imagen de Codigo
   */
  public urlImageCode = '';

  /**
   *  Suscripcion
   */
  private subcription: Subscription = new Subscription();

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private http: HttpClient
  ) {
    // Titulo de la aplicacion
    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      { name: 'keywords', content: 'Angular, RXJS, Tutorial' },
      { name: 'description', content: 'Tutorial Angular RXJS' },
      { name: 'robots', content: 'index, follow' }
    ]);
  }

  ngOnInit(): void {
    // Cargar los observables
    this.http
      .get<TypeObservable[]>('assets/data/observables.json')
      .subscribe((res: TypeObservable[]) => {
        this.observables = res;
      });
  }

  /**
   * HTTP GET a la API con la url que le pasamos como parametro. Devuelve un Observable
   * @param url Url de la API
   */
  public getClient(url: string): Observable<any> {
    const gh$ = this.http.get(url);

    const data$ = new Observable(obs => {
      gh$.subscribe(
        (res) => {
          obs.next(res);
          obs.complete();
        },
        (err: HttpErrorResponse) => {
          obs.error(err);
          alert(err.message);
        }
      );
    });

    return data$;
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
    this.urlImageCode = `assets/images/${method}.png`;

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
      case 'bufferTime':
        this.methodBufferTime();
        break;
      case 'switchMap':
        this.methodSwitchMap();
        break;
      case 'forkJoin':
        this.methodForkJoin();
        break;
      case 'concatMap':
        this.methodConcatMap();
        break;
      case 'mergeMap':
        this.methodMergeMap();
        break;
      case 'scan':
        this.methodScan();
        break;
      case 'subject':
        this.methodSubject();
        break;
      case 'multicast':
        this.methodMulticastSubject();
        break;
      case 'behaviorSubject':
        this.methodBehaviorSubject();
        break;
      case 'replaySubject':
        this.methodReplaySubject();
        break;
      case 'debounceTime':
        this.methodDebounceTime();
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
    this.showInput = false;
    this.info = '';
    this.result = '';
    this.urlImageCode = '';
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
   * Creamos un observable del operador DebounceTime
   */
  private methodDebounceTime(): void {
    const keyup = fromEvent(document, 'click');

    this.subcription = keyup.pipe(
      map((e: any) => e.clientX),
      debounceTime(1000)
    ).subscribe(res => this.result += `Posición x:${res}\n`);
  }

  /**
   * Creamos un observable del operador ReplaySubject
   */
  private methodReplaySubject(): void {
    const obs = new ReplaySubject(2); // Numero de buffer

    obs.next(1);
    obs.next(2);
    obs.next(3);
    obs.subscribe(res => this.result += `Suscripcion: 1 ${res}\n`);
    obs.next(4);
    obs.next(5);
    obs.subscribe(res => this.result += `Suscripcion: 2 ${res}\n`);
  }

  /**
   * Creamos un observable del operador BehaviorSubject
   */
  private methodBehaviorSubject(): void {
    this.showButtonUnsubcribe = true;
    const subject = new BehaviorSubject(0);

    const click$ = fromEvent(document, 'click').pipe(
      map((e: any) => ({
        x: e.clientX,
        y: e.clientY
      }))
    );

    const interval$ = interval(1000).pipe(
      tap((res) => subject.next(res))
    );

    // Unimos ambos observables
    this.subcription = merge(click$, interval$).subscribe(res => this.result += JSON.stringify(res) + '\n');
  }

  /**
   * Creamos un observable del operador Multicast en Subject
   */
  private methodMulticastSubject(): void {
    this.showButtonUnsubcribe = true;

    const source = interval(3000).pipe(
      tap((n) => this.result += `ID: ${n}\n`)
    );

    const subject = new Subject();

    const multi = source.pipe(multicast(subject)) as ConnectableObservable<any>;

    multi.subscribe(v => this.result += `localhost:4200/${v}\n`);
    multi.subscribe(v => {
      if (v !== 0) {
        this.result += `localhost:4200/${(v - 1)}\n`;
      }
    });

    this.subcription = multi.connect();
  }

  /**
   * Creamos un observable del operador Subject
   */
  private methodSubject(): void {
    const subject = new Subject<number>();

    subject.subscribe({
      next: (n) => this.result += `ObsA: ${n}\n`
    });
    subject.subscribe({
      next: (n) => this.result += `ObsB: ${n + 100}\n`
    });

    subject.next(1);
    subject.next(2);
  }

  /**
   * Creamos un observable del operador Scan
   */
  private methodScan(): void {
    const src = of(1, 2, 3, 4, 5);

    const scanObs = src.pipe(scan((a, c) => a + c, 0));

    this.subcription = scanObs.subscribe((res) => {
      this.result += `${res}\n`;
    });
  }

  /**
   * Creamos un observable del operador MergeMap
   */
  private methodMergeMap(): void {
    this.loading = true;

    const source = of(
      this.getClient('https://api.github.com/users/google'),
      this.getClient('https://api.github.com/users/microsoft'),
      this.getClient('https://api.github.com/users/alexgndeveloper'),
    );

    const obsMergeMap = source.pipe(
      mergeMap((v) => v)
    );

    this.subcription = obsMergeMap.subscribe((res) => {
      this.result += `${JSON.stringify(res)}\n`;

      this.loading = false;
    });
  }

  /**
   * Creamos un observable del operador ConcatMap
   */
  private methodConcatMap(): void {
    const source = of(2000, 1000, 3000);

    const obsConcatMap = source.pipe(
      concatMap((v) => of(`Valor: ${v}`).pipe(delay(v)))
    );

    this.subcription = obsConcatMap.subscribe((res) => {
      this.result += `${res}\n`;
    });
  }

  /**
   * Creamos un observable del operador ForkJoin
   */
  private methodForkJoin(): void {
    this.loading = true;

    const fork = forkJoin({
      google: this.getClient('https://api.github.com/users/google'),
      microsoft: this.getClient('https://api.github.com/users/microsoft'),
      alexgndeveloper: this.getClient('https://api.github.com/users/alexgndeveloper')
    });

    this.subcription = fork.subscribe((res) => {
      this.result += `${JSON.stringify(res.google)}\n`;
      this.result += `${JSON.stringify(res.microsoft)}\n`;
      this.result += `${JSON.stringify(res.alexgndeveloper)}\n`;

      this.loading = false;
    });
  }

  /**
   * Creamos un observable del operador SwitchMap
   */
  private methodSwitchMap(): void {
    this.showButtonUnsubcribe = true;

    this.subcription = fromEvent(document, 'click').pipe(
      switchMap(() => interval(1000))).subscribe((res) => {
        this.result += res + '\n';
      });
  }

  /**
   * Creamos un observable del operador BufferTime
   */
  private methodBufferTime(): void {
    this.showButtonUnsubcribe = true;

    const time = interval(500);
    const buffer = time.pipe(bufferTime(2000));
    this.subcription = buffer.subscribe(val => {
      this.result += `Buffer: ${val}\n`;
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

    this.subcription = shareObs.subscribe((val) => { this.result += val; });
    this.subcription = shareObs.subscribe((val) => { this.result += val; });
    this.subcription = shareObs.subscribe((val) => { this.result += val; });
    this.subcription = shareObs.subscribe((val) => { this.result += val; });
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
