import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Session } from '@models/session.model';
import { TrainingService } from '@services/training.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.scss'],
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  public dataSource = new MatTableDataSource<{
    date: Date;
    name: string;
    duration: number;
    calories: number;
    progress: number;
    state: string;
  }>();
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
    this.dataSource.data = this.trainingService
      .getPastSessions()
      .map((session) => {
        const {
          startDate: date,
          exercise: { name },
          duration,
          calories,
          progress,
          state,
        } = session;
        return {
          date,
          name,
          duration,
          calories,
          progress,
          state,
        };
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
