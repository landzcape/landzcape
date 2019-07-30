import {Layer} from './layer';
import {ComponentType} from './component-type';
import {ComponentId} from './component-id';

export class Component {

  active: boolean;
  visible: boolean;
  pinned: boolean;

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
    this.active = component.active === undefined ? false : component.active;
    this.pinned = component.pinned === undefined ? false : component.pinned;
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

  activate(): void {
    this.active = true;
  }

  deactivate(): void {
    this.active = false;
  }

  pin(): void {
    this.pinned = true;
  }

  unpin(): void {
    this.pinned = false;
  }

  private getTransitiveDependencies(type: ComponentType) {
    const transitiveDependenciesRecursive: Set<Component> = this.getTransitiveDependenciesRecursive(c => c.type == type);
    transitiveDependenciesRecursive.delete(this);
    return Array.from(transitiveDependenciesRecursive);
  }

  private getTransitiveDependenciesRecursive(
      filter: (c: Component) => boolean,
      visited: Set<Component> = new Set<Component>(),
      dependencies: Set<Component> = new Set<Component>()): Set<Component> {
    if(!visited.has(this)) {
      visited.add(this);
      this.dependencies
        .forEach(m => m.getTransitiveDependenciesRecursive(filter, visited, dependencies));

      if (filter(this)) {
        dependencies.add(this);
      }
    } else {
      console.log(`Warning: Circular dependency to ${this.id.name} detected.`)
    }
    return dependencies;
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
  active?: boolean;
  pinned?: boolean;
}
