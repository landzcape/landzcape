import { Action } from '@ngrx/store';
import {Landscape} from './domain/model/landscape';
import {ComponentId} from './domain/model/component-id';
import {DomainId} from './domain/model/domain-id';
import {ContextId} from './domain/model/context-id';

export enum LandscapeActionTypes {
  ShowComponentsAction = '[Landscape] Show Components',
  ShowLayersAction = '[Landscape] Show Layers',
  HideLayersAction = '[Landscape] Hide Layers',
  HideComponentsAction = '[Landscape] Hide Components',
  InitializeLandscapeAction = '[Landscape] Initialize',
  ShowDomainAction = '[Landscape] Show Domain',
  ShowContextAction = '[Landscape] Show Context',
  ShowCapabilitiesAction = '[Tools] Show Capabilities',
  ShowCommonsAction = '[Tools] Show Commons'
}

export class ShowDomainAction implements Action {
  readonly type = LandscapeActionTypes.ShowDomainAction;
  constructor(readonly domainId: DomainId) {
  }
}

export class ShowContextAction implements Action {
  readonly type = LandscapeActionTypes.ShowContextAction;
  constructor(readonly contextId: ContextId) {
  }
}

export class InitializeLandscapeAction implements Action {
  readonly type = LandscapeActionTypes.InitializeLandscapeAction;
  constructor(readonly landscape: Landscape) {
  }
}


export class HideComponentsAction implements Action {
  readonly type = LandscapeActionTypes.HideComponentsAction;
  constructor(readonly componentIds: ComponentId[]) {
  }
}

export class ShowComponentsAction implements Action {
  readonly type = LandscapeActionTypes.ShowComponentsAction;
  constructor(readonly componentIds: ComponentId[]) {
  }
}

export class ShowCapabilitiesAction implements Action {
  readonly type = LandscapeActionTypes.ShowCapabilitiesAction;
  constructor(readonly componentIds: ComponentId[]) {
  }
}

export class ShowCommonsAction implements Action {
  readonly type = LandscapeActionTypes.ShowCommonsAction;
  constructor(readonly componentIds: ComponentId[]) {
  }
}

export type LandscapeActionsUnion = ShowDomainAction
  | ShowContextAction
  | InitializeLandscapeAction
  | ShowCommonsAction
  | ShowCapabilitiesAction
  | ShowComponentsAction
  | HideComponentsAction;
