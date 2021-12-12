import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';

import { Exercise } from '@models/exercise.model';
import { Session } from '@models/session.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  public runningSessionChanged = new BehaviorSubject<Session>(null);

  private exercises: Exercise[] = [
    { id: 'crunch', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  ];

  private runningSession: Session;
  private pastSessions: Session[] = [];

  constructor() {}

  startSession(exerciseId: string) {
    const selectedExercise = this.exercises.find((ex) => ex.id === exerciseId);
    if (!selectedExercise) return;
    this.runningSession = {
      id: `${Math.round(Math.random() * 10000).toString()}-${exerciseId}`,
      exercise: selectedExercise,
      startDate: new Date(),
      endDate: null,
      duration: 0,
      calories: 0,
      progress: 0,
      state: 'running',
    };
    this.sessionChanged();
  }

  pauseSession(progress = 0) {
    this.runningSession.state = 'paused';
    this.runningSession.progress = progress;
    this.sessionChanged();
  }

  resumeSession() {
    this.runningSession.state = 'running';
    this.sessionChanged();
  }

  cancelSession(progress = 0) {
    this.runningSession.state = 'canceled';
    this.runningSession.endDate = new Date();
    this.runningSession.progress = progress;
    this.terminateSession();
  }

  completeSession() {
    this.runningSession.state = 'completed';
    this.runningSession.endDate = new Date();
    this.runningSession.progress = 100;
    this.terminateSession();
  }

  sessionChanged(): void {
    this.runningSessionChanged.next(this.getRunningSession());
  }

  terminateSession(): void {
    const { exercise, progress } = this.runningSession;
    this.runningSession.duration = exercise.duration * (progress / 100);
    this.runningSession.calories = exercise.calories * (progress / 100);
    this.pastSessions.push(cloneDeep(this.runningSession));
    this.runningSession = null;
    this.sessionChanged();
  }

  getExercises(): Exercise[] {
    return cloneDeep(this.exercises);
  }

  getRunningSession(): Session {
    return cloneDeep(this.runningSession);
  }

  getPastSessions(): Session[] {
    return cloneDeep(this.pastSessions);
  }
}
