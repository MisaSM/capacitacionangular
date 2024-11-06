import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Button, ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TableModule, DialogModule, ButtonModule],
  templateUrl: './usuario-list.component.html',
  providers: [DialogService],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('500ms ease-in')]),
      transition(':leave', [animate('500ms ease-out', style({ opacity: 0 }))]),
    ])
  ]
})
export class UsuarioListComponent implements OnInit {
  usuarios: any[] = [];
  displayDialog: boolean = false;
  usuarioForm!: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.usuarioForm = this.fb.group({
      idUsuario: [null],
      names: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.loadUsuarios();
  }

  loadUsuarios() {
    
    this.usuarioService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
      console.log(this.usuarios)
    });
  }

  openDialog(usuario?: any) {
    console.log(usuario);
    this.displayDialog = true;
    if (usuario?.idUsuario) {
      this.usuarioForm.patchValue({
        idUsuario: usuario.idUsuario, // Cambiado de idUser a idUsuario
        names: usuario.nombres,
        userName: usuario.usuario,
        password: ''
      });
    } else {
      // Modo creación: Reiniciar el formulario y limpiar idUsuario
      this.usuarioForm.reset();
      this.usuarioForm.get('idUsuario')?.setValue(null);
    }
  }

  saveUsuario() {
    if (this.usuarioForm.valid) {
      const usuarioData = this.usuarioForm.value;
      if (usuarioData.idUsuario) {
        // Si el idUsuario existe, es una actualización
        this.usuarioService.updateUsuario(usuarioData.idUsuario, usuarioData).subscribe(() => {
          this.loadUsuarios();
          this.displayDialog = false;
        });
      } else {
        // Si no hay idUsuario, es una creación
        this.usuarioService.createUsuario(usuarioData).subscribe(() => {
          this.loadUsuarios();
          this.displayDialog = false;
        });
      }
    }
  }

  deleteUsuario(id: number) {
    this.usuarioService.deleteUsuario(id).subscribe(() => this.loadUsuarios());
  }
}
