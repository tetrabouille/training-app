import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

import { Exercise } from '@models/exercise.model';
import { Session } from '@models/session.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  public runningSessionChanged = new BehaviorSubject<Session>(null);
  public exercisesChanged = new BehaviorSubject<Exercise[]>([]);
  public pastSessionsChanged = new BehaviorSubject<Session[]>([]);

  private runningSession: Session;
  private exercises: Exercise[];
  private pastSessions: Session[];
  private exercisesSub: Subscription;
  private pastSessionsSub: Subscription;

  constructor(private database: AngularFirestore) {}

  startSession(exerciseId: string) {
    this.waitForExercises().then((exercises) => {
      this.exercises = exercises;
      const selectedExercise = exercises.find((ex) => ex.id === exerciseId);
      if (!selectedExercise) return;
      this.runningSession = {
        exercise: selectedExercise,
        startDate: new Date(),
        endDate: null,
        duration: 0,
        calories: 0,
        progress: 0,
        state: 'running',
      };
      this.runningSessionChanged.next(this.runningSession);
    });
  }

  pauseSession(progress = 0) {
    this.runningSession.state = 'paused';
    this.runningSession.progress = progress;
    this.runningSessionChanged.next(cloneDeep(this.runningSession));
  }

  resumeSession() {
    this.runningSession.state = 'running';
    this.runningSessionChanged.next(cloneDeep(this.runningSession));
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

  fetchExercises(): void {
    if (this.exercisesSub) return;
    this.exercisesSub = this.database
      .collection<Exercise>('exercises')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            const { name, calories, duration } = doc.payload.doc.data();
            return {
              id: doc.payload.doc.id,
              name,
              duration,
              calories,
            };
          });
        })
      )
      .subscribe((exercises) => {
        console.log('fetch exercises : ', exercises);

        this.exercises = exercises;
        this.exercisesChanged.next(cloneDeep(exercises));
      });
  }

  fetchPastSessions(): void {
    this.waitForExercises().then((exercises: Exercise[]) => {
      if (this.pastSessionsSub) return;
      this.pastSessionsSub = this.database
        .collection<Session>('sessions')
        .snapshotChanges()
        .pipe(
          map((docArray) => {
            return docArray.map((doc) => {
              const {
                startDate,
                endDate,
                calories,
                duration,
                exerciseId,
                progress,
                state,
              } = doc.payload.doc.data();
              return {
                id: doc.payload.doc.id,
                exercise: exercises.find((e) => e.id === exerciseId),
                startDate: (startDate as any as Timestamp).toDate(),
                endDate: (endDate as any as Timestamp).toDate(),
                calories,
                duration,
                progress,
                state,
              };
            });
          })
        )
        .subscribe((sessions) => {
          console.log('fetch past sessions : ', sessions);

          this.pastSessions = sessions;
          this.pastSessionsChanged.next(cloneDeep(sessions));
        });
    });
  }

  cancelFireSubscription(): void {
    const subs = ['exercisesSub', 'pastSessionsSub'];
    subs.forEach((sub) => {
      if (!this[sub]) return;
      this[sub].unsubscribe();
      delete this[sub];
    });
  }

  private terminateSession(): void {
    const { exercise, progress } = this.runningSession;
    this.runningSession.duration = exercise.duration * (progress / 100);
    this.runningSession.calories = exercise.calories * (progress / 100);
    this.addTerminatedSession();
    this.runningSession = null;
    this.runningSessionChanged.next(null);
  }

  private addTerminatedSession(): void {
    this.runningSession.exerciseId = this.runningSession.exercise.id;
    delete this.runningSession.exercise;
    this.database.collection<Session>('sessions').add(this.runningSession);
  }

  private waitForExercises(): Promise<Exercise[]> {
    return new Promise((resolve, reject) => {
      let needFetch = false;
      let stop = false;
      this.exercisesChanged
        .pipe(takeWhile(() => !stop))
        .subscribe((exercises) => {
          if (exercises.length === 0) {
            if (needFetch) {
              stop = true;
              reject('no exercises');
            }
            needFetch = true;
            return;
          }
          stop = true;
          resolve(exercises);
        });
      if (needFetch) this.fetchExercises();
    });
  }

  getRunningSession(): Session {
    return cloneDeep(this.runningSession);
  }
  getPastSessions(): Session[] {
    return cloneDeep(this.pastSessions);
  }
  getExercises(): Exercise[] {
    return cloneDeep(this.exercises);
  }
}
