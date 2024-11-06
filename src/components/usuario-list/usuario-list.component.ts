import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TableModule, DialogModule],
  templateUrl: './usuario-list.component.html',
  providers: [DialogService],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter', [
        animate('500ms 0s ease-in')
      ]),
      transition(':leave', [
        animate('500ms 0s ease-out', style({
          opacity: 0
        }))
      ])
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
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.usuarioService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }

  openDialog(usuario?: any) {
    this.displayDialog = true;
    if (usuario) {
      this.usuarioForm.patchValue(usuario);
    } else {
      this.usuarioForm.reset();
    }
  }

  saveUsuario() {
    if (this.usuarioForm.valid) {
      const usuarioData = this.usuarioForm.value;
      if (usuarioData.id) {
        this.usuarioService.updateUsuario(usuarioData.id, usuarioData).subscribe(() => this.loadUsuarios());
      } else {
        this.usuarioService.createUsuario(usuarioData).subscribe(() => this.loadUsuarios());
      }
      this.displayDialog = false;
    }
  }

  deleteUsuario(id: number) {
    this.usuarioService.deleteUsuario(id).subscribe(() => this.loadUsuarios());
  }
}
