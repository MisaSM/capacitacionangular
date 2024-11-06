export interface UpdateTareaModel {
    idTarea: number;
    tarea: string;
    descripcion: string;
    idUsuario: number;  // ID del usuario asignado a la tarea
    completada?: boolean;
  }