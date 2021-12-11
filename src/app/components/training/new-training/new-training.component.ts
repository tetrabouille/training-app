import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TrainingService } from '@services/training.service';
import { Exercise } from '@models/exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit {
  @Output() startClick = new EventEmitter<void>();

  public exercises: Exercise[];

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.exercises = this.trainingService.getExercises();
  }

  onSubmit(form: NgForm): void {
    if (form.valid) this.trainingService.startSession(form.value.exercise);
  }
}
