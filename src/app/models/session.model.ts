import { Exercise } from './exercise.model';

export interface Session {
  id: string;
  exercise: Exercise;
  startDate: Date;
  endDate: Date;
  state: 'running' | 'paused' | 'completed' | 'canceled';
  progress: number;
}
