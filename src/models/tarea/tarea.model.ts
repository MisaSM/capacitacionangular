export interface TareaModel {
    idTarea: number;
    tarea: string;
    descripcion: string;
    idUsuario: number; 
    completada?: boolean;
  }