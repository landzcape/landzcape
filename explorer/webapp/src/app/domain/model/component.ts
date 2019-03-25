import {Layer} from './layer';
import {ComponentType} from './component-type';
import {ComponentId} from './component-id';

export class Component {

  visible: boolean;

  readonly id: ComponentId;
  readonly name: string;
  readonly group: string;
  readonly version: string;
  readonly label: string;
  readonly layer: Layer;
  readonly type: ComponentType;

  readonly dependencies: Component[] = [];
  readonly interfaces: Component[] = [];
  readonly implementations: Component[] = [];

  constructor(component: ComponentParameters) {
    this.id = component.id;
    this.name = component.name;
    this.group = component.group;
    this.version = component.version;
    this.label = component.label;
    this.layer = component.layer;
    this.type = component.type;
    this.visible = component.visible === undefined ? false : component.visible;
  }

  hide(): any {
    this.visible = false;
  }

  show(): any {
    this.visible = true;
  }

  isBusiness(): boolean {
    return this.type === ComponentType.BUSINESS;
  }

  isInterface(): boolean {
    return this.implementations.length > 0 && this.dependencies.every(d => !d.isBusiness());
  }

  getDependenciesIncludingInterfaces(): Component[] {
    return [...this.dependencies, ...this.getInterfaceDependencies()];
  }

  getInterfaceDependencies(): Component[] {
    const ifd = this.dependencies
      .filter(d => d.isInterface())
      .filter(d => d.implementations.length === 1 && d.implementations[0] !== this)
      .map(d => d.implementations[0]);
    return ifd;
  }

  getTransitiveBusinessDependencies() {
    return this.getTransitiveDependencies(ComponentType.BUSINESS);
  }

  getCapabilities(): Component[] {
    return this.getTransitiveDependencies(ComponentType.CAPABILITY);
  }

  getCommons(): Component[] {
    return this.getTransitiveDependencies(ComponentType.COMMON);
  }

  private getTransitiveDependencies(type: ComponentType) {
    const transitive = new Set<Component>();
    this.dependencies
      .forEach(m => m.getTransitiveDependencies(type)
        .forEach(c => transitive.add(c))
      );

    if (this.type === type) {
      transitive.add(this);
    }
    return Array.from(transitive);
  }
}

export interface ComponentParameters {
  id: ComponentId;
  name: string;
  group: string;
  version: string;
  label: string;
  layer: Layer;
  type: ComponentType;
  visible?: boolean;
}
