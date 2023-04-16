import { inject, Injectable } from '@angular/core';
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
import { map, Subscription, take } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
import * as trainingActions from './training.actions';

@Injectable()
export class TrainingService {
  firestore: Firestore = inject(Firestore);
  private sub1 = new Subscription();
  private sub2 = new Subscription();

  constructor(
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    this.sub1 = collectionData(
      collection(this.firestore, 'availableExercises'),
      {
        idField: 'id',
      }
    )
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
        next: (exercises: Exercise[]) => {
          this.store.dispatch(
            new trainingActions.SetAvailableTrainings(exercises)
          );
        },
        error: (error) => {
          this.uiService.showSnackbar(
            'Fetching Exercise failed, please try again later',
            undefined,
            3000
          );
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
    this.store.dispatch(new trainingActions.StartTraining(selectedId));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...(ex as Exercise),
          date: new Date(),
          state: 'completed',
        });
        this.store.dispatch(new trainingActions.StopTraining());
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...(ex as Exercise),
          duration: (ex as Exercise).duration * (progress / 100),
          calories: (ex as Exercise).calories * (progress / 100),
          date: new Date(),
          state: 'cancelled',
        });
        this.store.dispatch(new trainingActions.StopTraining());
      });
  }

  fetchCompletedOrCancelledExercises() {
    this.sub2 = collectionData(collection(this.firestore, 'finishedExercises'))
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
        next: (exercises: Exercise[]) => {
          this.store.dispatch(
            new trainingActions.SetFinishedTrainings(exercises)
          );
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  private addDataToDatabase(exercise: Exercise) {
    addDoc(collection(this.firestore, 'finishedExercises'), exercise);
  }

  clearFirestoreSubscription() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
}
