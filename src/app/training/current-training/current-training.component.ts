import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { StopTrainingComponent } from './stop-training/stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss'],
})
export class CurrentTrainingComponent implements OnInit {
  @Output() finish = new EventEmitter<boolean>();

  public progress = 0;
  public exerciseDone = false;

  private timerSub: Subscription;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startTimer(): void {
    if (this.timerSub) return;
    this.timerSub = interval(100)
      .pipe(takeWhile(() => this.progress < 100))
      .subscribe(() => {
        this.progress += 5;
        if (this.progress >= 100) this.exerciseDone = true;
      });
  }

  stopTimer(): void {
    if (this.timerSub) this.timerSub.unsubscribe();
    this.timerSub = null;
  }

  onStopClick(): void {
    this.stopTimer();
    const stopDialog = this.dialog.open(StopTrainingComponent, {
      data: { progress: this.progress },
    });
    stopDialog.afterClosed().subscribe((finish) => {
      if (finish) return this.finish.emit(false);
      else this.startTimer();
    });
  }

  onBackClick(): void {
    this.finish.emit(true);
  }
}
