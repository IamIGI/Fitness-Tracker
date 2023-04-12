import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Exercise } from './exercise.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs';

export class TrainingService {
  firestore: Firestore = inject(Firestore);

  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise!: Exercise | null;

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
      .subscribe({
        next: (exercise: Exercise[]) => {
          this.availableExercises = exercise;
          this.exercisesChanged.next([...this.availableExercises]);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  startExercise(selectedId: string) {
    //dummy update --------------
    // updateDoc(
    //   doc(collection(this.firestore, 'availableExercises'), selectedId),
    //   { lastSelected: new Date() }
    // );
    //-------------------------

    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id == selectedId
    ) as Exercise;
    this.exerciseChanged.next({ ...this.runningExercise }); //pass the copy
  }

  completeExercise() {
    this.addDataToDatabase({
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
    this.addDataToDatabase(currentExercise);
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises() {
    collectionData(collection(this.firestore, 'finishedExercises'))
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              ...doc,
            } as Exercise;
          });
        })
      )
      .subscribe({
        next: (exercise: Exercise[]) => {
          this.finishedExercisesChanged.next(exercise);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  private addDataToDatabase(exercise: Exercise) {
    addDoc(collection(this.firestore, 'finishedExercises'), exercise);
  }
}
