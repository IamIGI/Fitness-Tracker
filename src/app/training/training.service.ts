import { inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Exercise } from './exercise.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs';

export class TrainingService {
  firestore: Firestore = inject(Firestore);

  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise!: Exercise | null;
  private exercises: Exercise[] = [];

  fetchAvailableExercises() {
    collectionData(collection(this.firestore, 'availableExercises'), {
      idField: 'id',
    })
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              ...doc,
            } as Exercise;
          });
        })
      )
      .subscribe((exercise: Exercise[]) => {
        this.availableExercises = exercise;
        this.exercisesChanged.next([...this.availableExercises]);
      });
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
      calories: (this.runningExercise as Exercise).calories * (progress / 100),
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

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }
}
