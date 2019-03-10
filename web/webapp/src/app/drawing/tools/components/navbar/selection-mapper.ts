import {ComponentOptionLo} from '../../model/component-option.lo';
import {SelectItem} from 'primeng/api';
import {SelectionTypeLo, StructureOptionLo} from '../../model/structure-option.lo';
import {SelectableTreeNode} from '../selectable-tree/selectable-tree-node';

export class SelectionMapper {

  static fromComponentOptions(options?: ComponentOptionLo[]): SelectItem[] {
    if (options) {
      return options.map(option => {
        return {label: option.label, value: option.id};
      });
    }
    return [];
  }

  static fromStructureOptions(options: StructureOptionLo[]): SelectableTreeNode[] {
    if (options) {
      return options.map(option => {
        return {
          label: option.label,
          data: option.component,
          id: option.id,
          children: this.fromStructureOptions(option.children),
          partialSelected: option.selected === SelectionTypeLo.PARTIAL,
          selected: option.selected === SelectionTypeLo.SELECTED,
          leaf: !!option.component,
        };
      });
    }
    return [];
  }

}
