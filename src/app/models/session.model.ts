import { Exercise } from './exercise.model';

export interface Session {
  id: string;
  exercise: Exercise;
  date: Date;
  state: 'completed' | 'canceled' | null;
  progress: number;
}
