import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.sass'],
})
export class TrainingComponent {
  ongoingTraining$ = new Observable<boolean>();

  constructor(private store: Store<fromTraining.State>) {}

  ngOnInit() {
    this.ongoingTraining$ = this.store.select(fromTraining.getIsTraining);
  }
}
