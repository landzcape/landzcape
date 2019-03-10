import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ComponentId} from '../../../../domain/model/component-id';
import {TreeNode} from 'primeng/api';
import {SelectableTreeNode} from './selectable-tree-node';

@Component({
  selector: 'selectable-tree',
  templateUrl: './selectable-tree.component.html',
  styleUrls: ['./selectable-tree.component.css']
})
export class SelectableTreeComponent implements OnInit {

  structures: SelectableTreeNode[];
  selectedStructures: SelectableTreeNode[] = [];

  expanded = new Set();

  @Output()
  select = new EventEmitter();

  @Output()
  unselect = new EventEmitter();

  constructor() {
  }

  @Input()
  set nodes(nodes: SelectableTreeNode[]) {
    if (nodes) {
      this.markExpanded(nodes);
      this.selectedStructures = this.getSelected(nodes);
      this.structures = nodes;
    }
  }


  ngOnInit() {
  }

  selectStructureNode(event) {
    const node: TreeNode = event.node;
    const componentIds = this.getComponentIdsFromNodes(node);
    this.select.emit(componentIds);
  }

  unselectStructureNode(event) {
    const node: TreeNode = event.node;
    const componentIds = this.getComponentIdsFromNodes(node);
    this.unselect.emit(componentIds);
  }

  expandNode(event: any) {
    const node: SelectableTreeNode = event.node;
    this.expanded.add(node.id);
  }

  collapseNode(event: any) {
    const node: SelectableTreeNode = event.node;
    this.expanded.delete(node.id);
  }

  private getComponentIdsFromNodes(node: TreeNode): ComponentId[] {
    if (node.data) {
      return [node.data];
    }
    if (node.children) {
      return node.children
        .map(child => this.getComponentIdsFromNodes(child))
        .reduce((a, b) => a.concat(b));
    }
  }

  private getSelected(treeNodes?: SelectableTreeNode[]): SelectableTreeNode[] {
    if (!treeNodes) { return []; }
    const selectedNodes = treeNodes
      .filter(node => node.selected);
    const childNodes = treeNodes
      .filter(node => node.selected || node.partialSelected)
      .map(c => this.getSelected(c.children))
      .reduce((a, b) => a.concat(b), []);
    return selectedNodes.concat(childNodes);
  }


  private markExpanded(nodes: SelectableTreeNode[]) {
    if (nodes !== undefined) {
      nodes.forEach(node => {
        if (this.expanded.has(node.id)) {
          node.expanded = true;
        }
        this.markExpanded(node.children);
      });
    }
  }
}
