import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TareaService } from '../../services/tarea/tarea.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DropdownModule } from 'primeng/dropdown';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-tarea-list',
  imports: [TableModule, DialogModule, FormsModule, ReactiveFormsModule, DropdownModule, ButtonModule],
  standalone: true,
  templateUrl: './tarea-list.component.html',
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
export class TareaListComponent implements OnInit {
  tareas: any[] = [];
  displayDialog: boolean = false;
  tareaForm!: FormGroup;
  usuarios: any[] = [];
  isEditing: boolean = false;

  constructor(
    private tareaService: TareaService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    // Configuración del formulario con los campos según TareaModel
    this.tareaForm = this.fb.group({
      idTarea: [null],  // Campo oculto para el ID de la tarea
      tarea: ['', Validators.required],
      descripcion: ['', Validators.required],
      completada: [false],  // Campo booleano para indicar si la tarea está completada
      usuarioo: [null, Validators.required]  // Usuario es requerido
    });

    this.loadTareas();
    this.loadUsuarios();
  }

  loadTareas() {
    this.tareaService.getTareas().subscribe((data) => {
      this.tareas = data;
      console.log(data);
    });
  }

  // Método para cargar usuarios y llenar el dropdown
  loadUsuarios() {
    this.usuarioService.getUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;  // Aquí asumes que el servicio regresa una lista de usuarios
    });
  }

  openDialog(tarea?: any) {
    this.displayDialog = true;
    this.isEditing = !!tarea;  // Si tarea existe, se está editando
    if (tarea) {
      this.tareaForm.patchValue({
        idTarea: tarea.idTarea, // Asignar el ID de la tarea
        tarea: tarea.tarea,
        descripcion: tarea.descripcion,
        completada: tarea.completada,
        usuarioo: tarea.usuarioo?.idUsuario
      });
    } else {
      this.tareaForm.reset({ completada: false });
    }
  }

  toggleCompletada(tarea: any) {
    tarea.Completada = !tarea.Completada; // Cambia el estado de completada
    this.tareaService.finishTarea(tarea.idTarea).subscribe(() => this.loadTareas());
  }

  saveTarea() {
    if (this.tareaForm.valid) {
      const tareaData = this.tareaForm.value;
    
      if (tareaData.idTarea) {
        // Si existe idTarea, se actualiza
        this.tareaService.updateTarea(tareaData.idTarea, {
          tarea: tareaData.tarea,
          descripcion: tareaData.descripcion,
        }).subscribe(() => {
          this.loadTareas();
          this.displayDialog = false;
        });
      } else {
        // Si no existe idTarea, se crea una nueva
        this.tareaService.createTarea({
          tarea: tareaData.tarea,
          descripcion: tareaData.descripcion,
          idUsuario: tareaData.usuarioo?.idUsuario || 0
        }).subscribe(() => {
          this.loadTareas();
          this.displayDialog = false;
        });
      }
    }
  }
  
  deleteTarea(id: number) {
    this.tareaService.deleteTarea(id).subscribe(() => this.loadTareas());
  }
}
