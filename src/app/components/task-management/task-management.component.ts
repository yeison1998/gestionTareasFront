import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskManagement } from '../interfaces/task-management';
import { ToastrService } from 'ngx-toastr';
import { TaskManagementService } from '../services/task-management.service';

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.scss'
})
export class TaskManagementComponent {
  tasks = signal<TaskManagement[]>([]);
  badgeCompleted = signal(0);
  badge = signal(0);

  formTask!: FormGroup;

  fb = inject(FormBuilder);
  taskManagementService = inject(TaskManagementService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.setForm();
    this.getTasks();
  }

  setForm() {
    this.formTask = this.fb.group({
      id: 0,
      isComplete: false,
      isImportant: false,
      description: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  getTasks(): void {
    this.taskManagementService.getTasks().subscribe({
      next: (res) => {
        this.tasks.set(res);
        let countCompleted = 0;
        let countIncomplete = 0;
        if (this.tasks().length > 0) {
          this.tasks().forEach(task => {
            task.isCompleted ? countCompleted++ : countIncomplete++;
            this.badgeCompleted.set(countCompleted);
            this.badge.set(countIncomplete);
          });
        } else {
          this.badgeCompleted.set(countCompleted);
          this.badge.set(countIncomplete);
        }
      }
    });
  }

  saveTask(): void {
    this.formTask.markAllAsTouched();
    if (this.formTask.valid)
      this.taskManagementService.saveTask(this.formTask.value).subscribe({
        next: () => {
          this.getTasks();
          this.description.reset();
          this.toastr.success('', 'Tarea agregada con éxito!');
        }, error: () => {
          this.toastr.error('Ha ocurrido un error al intentar actualizar, Vuélvalo a intentar mas tarde', 'Error!');
        }
      });
  }

  updateIsImportantTask(task: TaskManagement, section: string): void {
    section === 'isComplete' ? task.isCompleted = !task.isCompleted : task.isImportant = !task.isImportant;
    this.taskManagementService.updateTask(task).subscribe({
      next: (res) => {
        this.getTasks();
        section === 'isComplete' ? this.showMessageChangeComplete(res.data) : this.showMessageChangeImportant(res.data);
      }, error: () => {
        this.toastr.error('Ha ocurrido un error al intentar actualizar, Vuélvalo a intentar mas tarde', 'Error!');
      }
    });
  }

  taskDelete(id: number): void {
    this.taskManagementService.deleteTask(id).subscribe({
      next: () => {
        this.toastr.success('', 'Tarea eliminada con éxito!');
        this.getTasks();
      }, error: () => {
        this.toastr.error('Ha ocurrido un error al intentar actualizar, Vuélvalo a intentar mas tarde', 'Error!');
      }
    });
  }

  showMessageChangeComplete(task: TaskManagement) {
    if (task.isCompleted) {
      this.toastr.info('Has completado esta tarea!', '¡Genial!');
    } else {
      this.toastr.warning('La tarea ha sido marcada como pendiente nuevamente!', 'Importante!');
    }
  }

  showMessageChangeImportant(task: TaskManagement) {
    if (task.isImportant) {
      this.toastr.info('Has agregado una nueva tarea importante!', '¡Genial!');
    } else {
      this.toastr.warning('La tarea ya no esta marcada como importante!', 'Importante!');
    }
  }
  get id(): AbstractControl { return this.formTask.get('id')! }
  get description(): AbstractControl { return this.formTask.get('description')! }
  get isImportant(): AbstractControl { return this.formTask.get('isImportant')! }
  get isComplete(): AbstractControl { return this.formTask.get('isComplete')! }

}
