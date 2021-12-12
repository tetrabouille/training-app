import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { Session } from '@models/session.model';
import { TrainingService } from '@services/training.service';
import { ValidationComponent } from '@components/dialog/validation/validation.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss'],
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  @Output() finish = new EventEmitter<void>();

  public exerciseDone = false;
  public session: Session;

  private timerSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService
  ) {}

  ngOnInit(): void {
    this.trainingService.runningSessionChanged
      .pipe(take(1))
      .subscribe((session) => {
        if (session) {
          this.session = session;
          switch (session.state) {
            case 'running':
              this.startTimer();
              break;
            case 'paused':
              this.resumeSessionDialog();
              break;
            default:
              break;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.stopTimer();
    if (this.trainingService.getRunningSession()?.state === 'running') {
      this.trainingService.pauseSession(this.session.progress);
    }
  }

  startTimer(): void {
    if (this.timerSub) return;
    this.timerSub = interval(this.session.exercise.duration * 1) // (duration / 100) * 1000
      .pipe(takeWhile(() => this.session.progress < 100))
      .subscribe(() => {
        this.session.progress += 1;
        if (this.session.progress >= 100) {
          this.exerciseDone = true;
          this.trainingService.completeSession();
        }
      });
  }

  stopTimer(): void {
    if (this.timerSub) this.timerSub.unsubscribe();
    this.timerSub = null;
  }

  resumeSessionDialog(): void {
    const stopDialog = this.dialog.open(ValidationComponent, {
      data: {
        title: 'This exercise was left unfinished',
        content: 'Do you want to restart it ?',
        positive: "Let's go !",
        negative: 'Cancel it',
      },
    });
    stopDialog.afterClosed().subscribe((answer: boolean) => {
      if (answer || answer == null) {
        this.session.progress = 0;
        this.startTimer();
        this.trainingService.resumeSession();
      } else {
        this.trainingService.cancelSession(this.session.progress);
        this.finish.emit();
      }
    });
  }

  onStopClick(): void {
    this.stopTimer();
    this.trainingService.pauseSession(this.session.progress);
    const stopDialog = this.dialog.open(ValidationComponent, {
      data: {
        title: "Don't give up !",
        content: `Are you sure you want to stop ? You did ${this.session.progress}%`,
        positive: 'I can do it !',
        negative: 'Yes please',
      },
    });
    stopDialog.afterClosed().subscribe((answer) => {
      if (answer || answer == null) {
        this.startTimer();
        this.trainingService.resumeSession();
      } else {
        this.trainingService.cancelSession(this.session.progress);
        this.finish.emit();
      }
    });
  }

  onBackClick(): void {
    this.finish.emit();
  }
}
