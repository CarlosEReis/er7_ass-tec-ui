import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly KEY_TOKEN = 'token'

  constructor() { }

  public salvaToken(token: string) : void {
    localStorage.setItem(this.KEY_TOKEN, token);
  }

  public removeToken() :void {
    localStorage.removeItem(this.KEY_TOKEN);
  }

  public retornaToken() : string {
    return localStorage.getItem(this.KEY_TOKEN) ?? '';
  }

  public possuiToken() {
    return !!this.retornaToken();
  }

  public isTokenValido() : boolean {
    const token: any = jwtDecode(this.retornaToken());
    const expToken = token?.exp; 
    return  Date.now() / 1000 < expToken;
  }

}
