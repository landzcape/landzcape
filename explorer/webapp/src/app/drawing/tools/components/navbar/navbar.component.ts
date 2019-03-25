import {Component, OnInit} from '@angular/core';
import {
  getCapabilityOptionsSelector,
  getCommonsOptionsSelector,
  getLayerOptionsSelector,
  getStructureOptionsSelector,
  getApplicationOptionsSelector,
} from '../../../../index';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs/index';
import {FormControl, FormGroup} from '@angular/forms';
import {ComponentId} from '../../../../domain/model/component-id';
import {
  HideComponentsAction,
  ShowCapabilitiesAction,
  ShowCommonsAction,
  ShowComponentsAction
} from '../../../../landscape.actions';
import {map} from 'rxjs/operators';
import {SelectItem, TreeNode} from 'primeng/api';
import {SelectionMapper} from './selection-mapper';
import {LandscapeState} from '../../../../landscape.reducer';
import {SelectableTreeNode} from '../selectable-tree/selectable-tree-node';

@Component({
  selector: 'appNavbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  CAPABILTIES = 'capabilities';
  COMMONS = 'commons';
  LAYERS = 'layers';
  STRUCTURE = 'structure';
  APPLICATIONS = 'applications';

  capabiltiesControl = new FormControl('');
  commonsControl = new FormControl('');

  navbarFormGroup = new FormGroup({
    capabilities: this.capabiltiesControl,
    commons: this.commonsControl,
  });

  capabilities: Observable<SelectItem[]>;
  commons: Observable<SelectItem[]>;

  layers: Observable<SelectableTreeNode[]>;
  structures: Observable<SelectableTreeNode[]>;
  applications: Observable<SelectableTreeNode[]>;

  nav: string;
  private hider: number;

  constructor(private store: Store<LandscapeState>) {
  }

  ngOnInit() {
    this.capabilities = this.store
      .pipe(select(getCapabilityOptionsSelector))
      .pipe(map(options => SelectionMapper.fromComponentOptions(options)));

    this.commons = this.store
      .pipe(select(getCommonsOptionsSelector))
      .pipe(map(options => SelectionMapper.fromComponentOptions(options)));

    this.layers = this.store
      .pipe(select(getLayerOptionsSelector))
      .pipe(map(options => SelectionMapper.fromStructureOptions(options)));

    this.structures = this.store
      .pipe(select(getStructureOptionsSelector))
      .pipe(map(options => SelectionMapper.fromStructureOptions(options)));

    this.applications = this.store
      .pipe(select(getApplicationOptionsSelector))
      .pipe(map(options => SelectionMapper.fromStructureOptions(options)));

    this.capabiltiesControl.valueChanges.subscribe((value: ComponentId[]) => {
      this.store.dispatch(new ShowCapabilitiesAction(value));
    });

    this.commonsControl.valueChanges.subscribe((value: ComponentId[]) => {
      this.store.dispatch(new ShowCommonsAction(value));
    });

  }

  selectStructureNode(componentIds: ComponentId[]) {
    this.store.dispatch(new ShowComponentsAction(componentIds));
  }

  unselectStructureNode(componentIds: ComponentId[]) {
    this.store.dispatch(new HideComponentsAction(componentIds));
  }

  startHiding() {
    this.hider = setTimeout(() => {
      delete this.nav;
    }, 200);
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


}
