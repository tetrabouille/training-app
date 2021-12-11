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
  @Output() finish = new EventEmitter<void>();

  public progress = 0;

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
    this.timerSub = interval(500)
      .pipe(takeWhile(() => this.progress < 100))
      .subscribe(() => {
        console.log('tick');
        this.progress += 5;
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
      if (finish) return this.finish.emit();
      else this.startTimer();
    });
  }
}
