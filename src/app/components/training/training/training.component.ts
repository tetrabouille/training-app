import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { TrainingService } from '@services/training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent implements OnInit, OnDestroy {
  public ongoingTraining = false;

  private sessionSub: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.sessionSub = this.trainingService.runningSessionChanged.subscribe(
      (session) => {
        if (session) this.ongoingTraining = true;
      }
    );
  }

  ngOnDestroy(): void {
    this.sessionSub.unsubscribe();
  }
}
