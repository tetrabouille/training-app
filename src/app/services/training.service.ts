import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';

import { Exercise } from '@models/exercise.model';
import { Session } from '@models/session.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  public runningSessionChanged = new Subject<Session>();

  private exercises: Exercise[] = [
    { id: 'crunch', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  ];

  private runningSession: Session;

  constructor() {}

  startSession(exerciseId: string) {
    const selectedExercise = this.exercises.find((ex) => ex.id === exerciseId);
    if (!selectedExercise) return;
    this.runningSession = {
      id: `${Math.round(Math.random() * 10000).toString()}-${exerciseId}`,
      exercise: selectedExercise,
      date: new Date(),
      progress: 0,
      state: null,
    };
    this.runningSessionChanged.next(this.getRunningSession());
  }

  getExercises(): Exercise[] {
    return cloneDeep(this.exercises);
  }

  getRunningSession(): Session {
    return cloneDeep(this.runningSession);
  }
}
