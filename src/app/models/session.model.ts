import { Exercise } from './exercise.model';

export interface Session {
  id?: string;
  exerciseId?: string;
  exercise: Exercise;
  startDate: Date;
  endDate: Date;
  duration: number;
  calories: number;
  state: 'running' | 'paused' | 'completed' | 'canceled';
  progress: number;
}
