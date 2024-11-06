import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TareaService } from '../../services/tarea/tarea.service';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-tarea-list',
  imports: [TableModule, DialogModule, FormsModule, ReactiveFormsModule],
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

  constructor(
    private tareaService: TareaService,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.tareaForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.email]],
    });
    this.loadTareas();
  }

  loadTareas() {
    this.tareaService.getTareas().subscribe((data) => {
      this.tareas = data;
    });
  }

  openDialog(usuario?: any) {
    this.displayDialog = true;
    if (usuario) {
      this.tareaForm.patchValue(usuario);
    } else {
      this.tareaForm.reset();
    }
  }

  saveTarea() {
    if (this.tareaForm.valid) {
      const tareaData = this.tareaForm.value;
      if (tareaData.id) {
        this.tareaService.updateTarea(tareaData.id, tareaData).subscribe(() => this.loadTareas());
      } else {
        this.tareaService.createTarea(tareaData).subscribe(() => this.loadTareas());
      }
      this.displayDialog = false;
    }
  }

  deleteTarea(id: number) {
    this.tareaService.deleteTarea(id).subscribe(() => this.loadTareas());
  }
}
