import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioLogeado } from 'src/app/interfaces/UsuarioLogeado';
import { CuerpoLogin } from 'src/app/interfaces/CuerpoLogin';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly URL_LOGIN: string = 'https://dummyjson.com/auth/login';
  public usuarioLogeado: UsuarioLogeado | null = null;
  public accessToken: string | null = null;

  // Observador para el estado de carga
  private $cargando = new BehaviorSubject<boolean>(false);
  public cargando = this.$cargando.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  public iniciarSesion(nombre_usuario: string, contrasenia: string) {
    this.$cargando.next(true);

    const cuerpo: CuerpoLogin = {
      username: nombre_usuario,
      password: contrasenia
    };

    this.http.post<UsuarioLogeado>(this.URL_LOGIN, JSON.stringify(cuerpo), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .subscribe({
      next: (resultado) => {
        this.usuarioLogeado = resultado;
        this.accessToken = resultado.accessToken;
        this.$cargando.next(false);
        console.log(resultado);

        // Redirige a la página de productos después de autenticarse
        if (this.router.url !== '/productos') {
          this.router.navigate(['/productos']);
        }
      },
      error: (err) => {
        console.error('Error en el inicio de sesión:', err);
        this.$cargando.next(false); // Asegura que el spinner se detenga en caso de error
      }
    });
  }

  public cerrarSesion() {
    this.usuarioLogeado = null;
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    this.router.navigate(['/iniciar-sesion']);
  }
}
