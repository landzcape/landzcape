import {TreeNode} from 'primeng/api';

export interface SelectableTreeNode extends TreeNode {
  id: any;
  selected: boolean;
  children?: SelectableTreeNode[];
}
