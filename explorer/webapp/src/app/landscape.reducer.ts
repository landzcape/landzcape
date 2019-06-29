import {Landscape} from './domain/model/landscape';
import {LandscapeActionsUnion, LandscapeActionTypes} from './landscape.actions';
import {LandscapeLo} from './drawing/landscape/model/landscape.lo';
import {Polygraph} from './domain/layout/polygraph';
import {ComponentOptionLo} from './drawing/tools/model/component-option.lo';
import {StructureOptionLo} from './drawing/tools/model/structure-option.lo';
import {OptionMapper} from './option-mapper';

export interface ToolsState {
  capabilityOptions?: ComponentOptionLo[];
  commonOptions?: ComponentOptionLo[];
  layerOptions?: StructureOptionLo[];
  structureOptions?: StructureOptionLo[];
  applicationOptions?: StructureOptionLo[];
}

export interface LandscapeState {
  polygraph?: Polygraph;
  layout?: LandscapeLo;
  tools: ToolsState;
}

const initialState: LandscapeState = {
  tools: {}
};

export function reducer(
  state: LandscapeState = initialState,
  action: LandscapeActionsUnion
): LandscapeState {
  switch (action.type) {
    case LandscapeActionTypes.InitializeLandscapeAction:
      return layout(new Polygraph(action.landscape));
    case LandscapeActionTypes.ShowContextAction:
      state.polygraph.showContext(action.contextId);
      return layout(state.polygraph, state.layout);
    case LandscapeActionTypes.ShowDomainAction:
      state.polygraph.showDomain(action.domainId);
      return layout(state.polygraph, state.layout);
    case LandscapeActionTypes.HideComponentsAction:
      state.polygraph.hideComponents(action.componentIds);
      return layout(state.polygraph, state.layout);
    case LandscapeActionTypes.ShowComponentsAction:
      state.polygraph.showComponents(action.componentIds);
      return layout(state.polygraph, state.layout);
    case LandscapeActionTypes.ShowCapabilitiesAction:
      state.polygraph.showCapabilities(action.componentIds);
      return layout(state.polygraph, state.layout);
    case LandscapeActionTypes.ShowCommonsAction:
      state.polygraph.showCommons(action.componentIds);
      return layout(state.polygraph, state.layout);
    case LandscapeActionTypes.ActivateComponentsAction:
      state.polygraph.activateComponents(action.componentIds);
      return layout(state.polygraph, state.layout);
    case LandscapeActionTypes.DeactivateComponentsAction:
      state.polygraph.deactivateComponents(action.componentIds);
      return layout(state.polygraph, state.layout);
    case LandscapeActionTypes.PinComponentsAction:
      state.polygraph.pinDependencies(action.componentIds);
      return layout(state.polygraph, state.layout);
    case LandscapeActionTypes.UnpinComponentsAction:
      state.polygraph.unpinDependencies(action.componentIds);
      return layout(state.polygraph, state.layout);
    default:
      return state;
  }
}

const layout = (polygraph: Polygraph, existingLayout: LandscapeLo = undefined): LandscapeState => {
  const newLayout = polygraph.layout(existingLayout);
  return {
    polygraph: polygraph,
    tools: OptionMapper.toToolsState(polygraph.landscape),
    layout: newLayout
  };
}


export const getLayoutMapping = (state: LandscapeState) => state.layout;
export const getCapabilityOptions = (state: LandscapeState) => state.tools.capabilityOptions;
export const getCommonsOptions = (state: LandscapeState) => state.tools.commonOptions;
export const getLayerOptions = (state: LandscapeState) => state.tools.layerOptions;
export const getStructureOptions = (state: LandscapeState) => state.tools.structureOptions;
export const getApplicationOptions = (state: LandscapeState) => state.tools.applicationOptions;
