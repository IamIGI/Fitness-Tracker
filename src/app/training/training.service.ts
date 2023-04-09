import { Exercise } from './exercise.model';
import { Subject } from 'rxjs';

export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  ];

  private runningExercise!: Exercise | null;
  private exercises: Exercise[] = [];

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id == selectedId
    ) as Exercise;
    this.exerciseChanged.next({ ...this.runningExercise }); //pass the copy
  }

  completeExercise() {
    this.exercises.push({
      ...(this.runningExercise as Exercise),
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    const currentExercise: Exercise = {
      ...(this.runningExercise as Exercise),
      duration: (this.runningExercise as Exercise).duration * (progress / 100),
      calories: (this.runningExercise as Exercise).duration * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    };
    this.exercises.push(currentExercise);
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }
}
