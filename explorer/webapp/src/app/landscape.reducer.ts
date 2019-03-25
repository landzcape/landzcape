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
  landscape?: Landscape;
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
      const loadedLandscapeLo = new Polygraph(action.landscape).layout();
      return {
        landscape: action.landscape,
        tools: OptionMapper.toToolsState(action.landscape),
        layout: loadedLandscapeLo,
      };

    case LandscapeActionTypes.ShowContextAction:
      state.landscape.getContext(action.contextId).show();
      const showContextLandscapeLo = new Polygraph(state.landscape).layout();
      return {
        landscape: state.landscape,
        tools: OptionMapper.toToolsState(state.landscape),
        layout: showContextLandscapeLo,
      };

    case LandscapeActionTypes.ShowDomainAction:
      state.landscape.getDomain(action.domainId).show();
      const showDomainLandscapeLo = new Polygraph(state.landscape).layout();
      return {
        landscape: state.landscape,
        tools: OptionMapper.toToolsState(state.landscape),
        layout: showDomainLandscapeLo,
      };

    case LandscapeActionTypes.HideComponentsAction:
      action.componentIds.forEach(componentId => {
        state.landscape.getComponent(componentId).hide();
      });
      const hiddenComponentsLandscapeLo = new Polygraph(state.landscape).layout();
      return {
        landscape: state.landscape,
        tools: OptionMapper.toToolsState(state.landscape),
        layout: hiddenComponentsLandscapeLo
      };
    case LandscapeActionTypes.ShowComponentsAction:
      action.componentIds.forEach(componentId => {
        state.landscape.getComponent(componentId).show();
      });
      const shownComponentsLandscapeLo = new Polygraph(state.landscape).layout();
      return {
        landscape: state.landscape,
        tools: OptionMapper.toToolsState(state.landscape),
        layout: shownComponentsLandscapeLo
      };
    case LandscapeActionTypes.ShowCapabilitiesAction:
      state.landscape.getCapabilities()
        .forEach(c => c.visible = action.componentIds.includes(c.id));
      const capabilityComponentLandscapeLo = new Polygraph(state.landscape).layout();
      return {
        landscape: state.landscape,
        tools: OptionMapper.toToolsState(state.landscape),
        layout: capabilityComponentLandscapeLo
      };
    case LandscapeActionTypes.ShowCommonsAction:
      state.landscape.getCommons()
        .forEach(c => c.visible = action.componentIds.includes(c.id));
      const commonComponentsLandscapeLo = new Polygraph(state.landscape).layout();
      return {
        landscape: state.landscape,
        tools: OptionMapper.toToolsState(state.landscape),
        layout: commonComponentsLandscapeLo
      };
    default:
      return state;
  }
}


export const getLayoutMapping = (state: LandscapeState) => state.layout;
export const getCapabilityOptions = (state: LandscapeState) => state.tools.capabilityOptions;
export const getCommonsOptions = (state: LandscapeState) => state.tools.commonOptions;
export const getLayerOptions = (state: LandscapeState) => state.tools.layerOptions;
export const getStructureOptions = (state: LandscapeState) => state.tools.structureOptions;
export const getApplicationOptions = (state: LandscapeState) => state.tools.applicationOptions;
