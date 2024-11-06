import { Component } from '@angular/core';
import { ViewWillEnter, ViewDidLeave } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../servicio/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})
export class IniciarSesionPage implements ViewWillEnter, ViewDidLeave {
  // Definimos un formulario de tipo FormGroup que representará los campos del formulario de inicio de sesión.
  public formulario!: FormGroup;

  // Variable para mostrar un indicador de carga (bloqueo) mientras se procesa la solicitud de inicio de sesión.
  public cargando_bloqueo: boolean = false;

  // Almacenará la suscripción al observable que controla el estado de carga para gestionarlo adecuadamente.
  private subCargando!: Subscription;

  constructor(
    private fb: FormBuilder, // Inyección del servicio FormBuilder para construir el formulario reactivo.
    private auth: AuthService // Inyección del servicio de autenticación para manejar el inicio de sesión.
  ) {
    // Inicialización del formulario de inicio de sesión con los campos 'usuario' y 'contrasenia', ambos obligatorios.
    this.formulario = fb.group({
      usuario: ["", Validators.required],
      contrasenia: ["", Validators.required]
    });
  }

  /**
   * Método para validar el formulario y procesar el inicio de sesión si es válido.
   */
  public validarFormulario() {
    const esValido = this.formulario.valid; // Verifica si el formulario es válido.

    if (!esValido) {
      return;
    }

    const datos = this.formulario.getRawValue(); // Obtiene los valores actuales del formulario sin modificaciones.
    const usuario = datos['usuario']; // Obtiene el valor del campo 'usuario'.
    const contrasenia = datos['contrasenia']; // Obtiene el valor del campo 'contrasenia'.

    // Llama al método de inicio de sesión del servicio de autenticación, pasando los datos del usuario y la contraseña.
    this.auth.iniciarSesion(usuario, contrasenia);
  }

  /**
   * Hook del ciclo de vida de Ionic que se ejecuta cuando la vista está a punto de mostrarse.
   * Aquí se suscribe al observable 'cargando' del servicio de autenticación para recibir actualizaciones de estado.
   */
  public ionViewWillEnter(): void {
    this.subCargando = this.auth.cargando.subscribe(nuevoValor => {
      this.cargando_bloqueo = nuevoValor; // Actualiza el indicador de carga según el valor emitido por el observable.
    });
  }

  /**
   * Hook del ciclo de vida de Ionic que se ejecuta cuando la vista está a punto de salir.
   * Aquí se cancela la suscripción al observable para evitar fugas de memoria.
   */
  public ionViewDidLeave(): void {
    if (this.subCargando) {
      this.subCargando.unsubscribe(); // Cancela la suscripción si está activa.
    }
  }
}
