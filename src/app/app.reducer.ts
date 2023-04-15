import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromUI from './shared/ui.reducer';
import { UIActions } from './shared/ui.actions';

export interface State {
  ui: fromUI.State;
}

export const reducers: ActionReducerMap<State, UIActions> = {
  ui: fromUI.uiReducer,
};

// call function and get the given state
export const getUIState = createFeatureSelector<fromUI.State>('ui');
export const getIsLoading = createSelector(getUIState, fromUI.getIsLoading);
