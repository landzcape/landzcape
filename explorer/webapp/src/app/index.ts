import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
  ActionReducer,
  MetaReducer,
} from '@ngrx/store';
import { environment } from '../environments/environment';
import * as fromLandscape from './landscape.reducer';
import {LandscapeState} from './landscape.reducer';

export interface State {
  landscape?: LandscapeState;
}

export const reducers: ActionReducerMap<State> = {
  landscape: fromLandscape.reducer
};

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function(state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger]
  : [];

export const getLandscapeState = createFeatureSelector<fromLandscape.LandscapeState>('landscape');

export const getCapabilityOptionsSelector = createSelector(getLandscapeState, fromLandscape.getCapabilityOptions);
export const getCommonsOptionsSelector = createSelector(getLandscapeState, fromLandscape.getCommonsOptions);
export const getLayerOptionsSelector = createSelector(getLandscapeState, fromLandscape.getLayerOptions);
export const getStructureOptionsSelector = createSelector(getLandscapeState, fromLandscape.getStructureOptions);
export const getApplicationOptionsSelector = createSelector(getLandscapeState, fromLandscape.getApplicationOptions);
export const getLandscapeLayoutSelector = createSelector(getLandscapeState, fromLandscape.getLayoutMapping);
