import {ComponentId} from '../../../domain/model/component-id';

export interface StructureOptionLo {
  label: string;
  children?: StructureOptionLo[];
  component?: ComponentId;
  id: any;
  selected: SelectionTypeLo;
}

export enum SelectionTypeLo {
  SELECTED = 'selected',
  PARTIAL = 'partial',
  UNSELECTED = 'unselected'
}

export namespace SelectionTypeLo {
  export function combine(selections: SelectionTypeLo[]): SelectionTypeLo {
    let hasSelected = false;
    let hasUnselected  = false;
    for (const s of selections) {
      if (s === SelectionTypeLo.UNSELECTED) {
        if (hasSelected) {
          return SelectionTypeLo.PARTIAL;
        }
        hasUnselected = true;
      } else if (s === SelectionTypeLo.SELECTED) {
        if (hasUnselected) {
          return SelectionTypeLo.PARTIAL;
        }
        hasSelected = true;
      } else if (s === SelectionTypeLo.PARTIAL) {
        return SelectionTypeLo.PARTIAL;
      }
    }
    if (hasSelected && !hasUnselected) {
      return SelectionTypeLo.SELECTED;
    }
    return SelectionTypeLo.UNSELECTED;
  }
}
