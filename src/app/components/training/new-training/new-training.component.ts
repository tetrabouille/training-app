import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TrainingService } from '@services/training.service';
import { Exercise } from '@models/exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  public exercises: Exercise[];

  private exercisesSub: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.exercisesSub = this.trainingService.exercisesChanged.subscribe(
      (exercises) => {
        this.exercises = exercises;
      }
    );
    this.trainingService.fetchExercises();
  }

  ngOnDestroy(): void {
    this.exercisesSub.unsubscribe();
  }

  onSubmit(form: NgForm): void {
    if (form.valid) this.trainingService.startSession(form.value.exercise);
  }
}
