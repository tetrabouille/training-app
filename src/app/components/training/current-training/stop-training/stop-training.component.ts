import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stop-training',
  templateUrl: './stop-training.component.html',
  styleUrls: ['./stop-training.component.scss'],
})
export class StopTrainingComponent {
  public progress;

  constructor(@Inject(MAT_DIALOG_DATA) private data: { progress: number }) {
    this.progress = data.progress;
  }
}
