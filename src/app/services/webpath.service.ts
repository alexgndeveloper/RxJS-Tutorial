import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebpathService {
  // Observables
  public static OBSERVABLES = `${environment.dataFirebase}observable.json`;
  // Usuario Google
  public static USERS_GOOGLE = `${environment.apiGitHub}users/google`;
  // Usuario Microsoft
  public static USERS_MICROSOFT = `${environment.apiGitHub}users/microsoft`;
  // Usuario AlexgnDeveloper
  public static USERS_ALEXGNDEVELOPER = `${environment.apiGitHub}users/alexgndeveloper`;
}
