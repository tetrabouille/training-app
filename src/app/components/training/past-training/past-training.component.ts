import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Session } from '@models/session.model';
import { TrainingService } from '@services/training.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.scss'],
})
export class PastTrainingComponent implements OnInit {
  public dataSource = new MatTableDataSource<Session>();
  public displayedColumns = [
    'date',
    'name',
    'duration',
    'calories',
    'progress',
    'state',
  ];

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.dataSource.data = this.trainingService.getPastSessions();
  }
}
