import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';

import { Exercise } from '@models/exercise.model';
import { Session } from '@models/session.model';
import { UiService } from './ui.service';

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

  constructor(
    private database: AngularFirestore,
    private uiService: UiService
  ) {}

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

  fetchExercises(refresh = false): void {
    if (refresh) {
      delete this.exercisesSub;
      delete this.exercises;
    } else if (this.exercisesSub || this.exercises) return;
    // console.log('fetch exercises');

    this.uiService.loadingStateChanged.next(true);
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
      .subscribe(
        (exercises) => {
          // console.log('exercises fetched');

          this.uiService.loadingStateChanged.next(false);
          this.exercises = exercises;
          this.exercisesChanged.next(cloneDeep(exercises));
        },
        () => {
          // console.log('failed to fetch exercises');

          this.uiService.loadingStateChanged.next(false);
          this.uiService.displayMessage('Fetching exercises failed');
          delete this.exercises;
          this.exercisesChanged.next([]);
        }
      );
  }

  fetchPastSessions(refresh = false): void {
    if (refresh) {
      delete this.pastSessionsSub;
      delete this.pastSessions;
    } else if (this.pastSessions || this.pastSessionsSub) return;
    // console.log('fetch past sessions');

    this.waitForExercises().then((exercises: Exercise[]) => {
      if (!exercises?.length) return;
      this.uiService.loadingStateChanged.next(true);
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
                exercise: this.exercises.find((e) => e.id === exerciseId),
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
        .subscribe(
          (sessions) => {
            // console.log('past sessions fetched');

            this.uiService.loadingStateChanged.next(false);
            this.pastSessions = sessions;
            this.pastSessionsChanged.next(cloneDeep(sessions));
          },
          () => {
            // console.log('failed to fetch past sessions');

            this.uiService.loadingStateChanged.next(false);
            this.uiService.displayMessage('Fetching past sessions failed');
            delete this.pastSessions;
            this.pastSessionsChanged.next([]);
          }
        );
    });
  }

  removeFetchedData(): void {
    this.exercisesChanged.next([]);
    this.pastSessionsChanged.next([]);
  }

  cancelFireSubscription(): void {
    const subs = ['exercises', 'pastSessions'];
    subs.forEach((key) => {
      const sub = `${key}Sub`;
      if (!this[sub] || !this[key]) return;
      this[sub].unsubscribe();
      delete this[sub];
      delete this[key];
    });
    this.removeFetchedData();
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
    return new Promise((resolve) => {
      let fetched = false;
      let stop = false;
      this.exercisesChanged
        .pipe(takeWhile(() => !stop))
        .subscribe((exercises) => {
          this.uiService.loadingStateChanged
            .pipe(take(1))
            .subscribe((isLoading) => {
              if (isLoading) return;
              if (exercises.length === 0) {
                if (fetched) {
                  stop = true;
                  return resolve([]);
                }
                this.fetchExercises(true);
                fetched = true;
              } else {
                stop = true;
                resolve(exercises);
              }
            });
        });
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
