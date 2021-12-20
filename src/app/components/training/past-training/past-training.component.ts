import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { TrainingService } from '@services/training.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.scss'],
})
export class PastTrainingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
  public filterValue = '';

  private filterChange = new Subject<string>();
  private filterSub: Subscription;
  private pastSessionsSub: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.pastSessionsSub = this.trainingService.pastSessionsChanged.subscribe(
      (sessions) => {
        this.dataSource.data = sessions.map((session) => {
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
    );
    this.trainingService.fetchPastSessions();

    this.filterSub = this.filterChange
      .pipe(debounceTime(250))
      .subscribe((filterValue) => {
        this.dataSource.filter = filterValue;
      });
  }

  ngOnDestroy(): void {
    this.filterSub.unsubscribe();
    this.pastSessionsSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public onFilter(event: any): void {
    this.filterChange.next(event.target.value.trim().toLowerCase());
  }

  public onCancelFilter(): void {
    this.filterValue = '';
    this.dataSource.filter = '';
  }
}
