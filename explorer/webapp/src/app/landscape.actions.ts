import { Action } from '@ngrx/store';
import {Landscape} from './domain/model/landscape';
import {ComponentId} from './domain/model/component-id';
import {DomainId} from './domain/model/domain-id';
import {ContextId} from './domain/model/context-id';

export enum LandscapeActionTypes {
  ShowLayersAction = '[Landscape] Show Layers',
  HideLayersAction = '[Landscape] Hide Layers',
  ActivateComponentsAction = '[Landscape] Activate Components',
  DeactivateComponentsAction = '[Landscape] Deactivate Components',
  PinComponentsAction = '[Landscape] Pin Components',
  UnpinComponentsAction = '[Landscape] Unpin Components',
  InitializeLandscapeAction = '[Landscape] Initialize',
  ShowDomainAction = '[Landscape] Show Domain',
  ShowContextAction = '[Landscape] Show Context',
  ShowCapabilitiesAction = '[Tools] Show Capabilities',
  ShowCommonsAction = '[Tools] Show Commons',
  ShowComponentsAction = '[Landscape] Show Components',
  HideComponentsAction = '[Landscape] Hide Components'
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

export class PinComponentsAction implements Action {
  readonly type = LandscapeActionTypes.PinComponentsAction;
  constructor(readonly componentIds: ComponentId[]) {
  }
}

export class UnpinComponentsAction implements Action {
  readonly type = LandscapeActionTypes.UnpinComponentsAction;
  constructor(readonly componentIds: ComponentId[]) {
  }
}

export class DeactivateComponentsAction implements Action {
  readonly type = LandscapeActionTypes.DeactivateComponentsAction;
  constructor(readonly componentIds: ComponentId[]) {
  }
}

export class ActiveComponentsAction implements Action {
  readonly type = LandscapeActionTypes.ActivateComponentsAction;
  constructor(readonly componentIds: ComponentId[]) {
  }
}

export type LandscapeActionsUnion = ShowDomainAction
  | ShowContextAction
  | InitializeLandscapeAction
  | ShowCommonsAction
  | ShowCapabilitiesAction
  | ShowComponentsAction
  | HideComponentsAction
  | PinComponentsAction
  | UnpinComponentsAction
  | ActiveComponentsAction
  | DeactivateComponentsAction;
