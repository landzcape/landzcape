import {Layouter} from "./layouter";
import {Landscape} from "../model/landscape";
import {ContextId} from "../model/context-id";
import {DomainId} from "../model/domain-id";
import {ComponentId} from "../model/component-id";
import {LandscapeLo} from "../../drawing/landscape/model/landscape.lo";

export class Polygraph {

  readonly landscape: Landscape;
  private layouter: Layouter;

  private structureTouched = true;
  private dependenciesTouched = true;

  constructor(landscape: Landscape) {
    this.landscape = landscape;
    this.layouter = new Layouter(landscape);
  }

  layout(existing: LandscapeLo): LandscapeLo {
    if (this.structureTouched) {
      this.layouter.recomputePositions();
    }
    const newLayout = this.layouter.layout();
    const mergedLayout = new LandscapeLo({
      layers: this.structureTouched ? newLayout.layers : existing.layers,
      components: this.structureTouched ? newLayout.components : existing.components,
      contexts: this.structureTouched ? newLayout.contexts : existing.contexts,
      domains: this.structureTouched ? newLayout.domains : existing.domains,
      dependencies: this.dependenciesTouched ? newLayout.dependencies : existing.dependencies
    });
    this.structureTouched = false;
    this.dependenciesTouched = false;
    return mergedLayout;
  }

  showContext(contextId: ContextId) {
    this.landscape.getContext(contextId).show();
    this.structureTouched = true;
    this.dependenciesTouched = true;
  }

  showDomain(domainId: DomainId) {
    this.landscape.getDomain(domainId).show();
    this.structureTouched = true;
    this.dependenciesTouched = true;
  }

  hideComponents(componentIds: ComponentId[]) {
    componentIds.forEach(componentId => {
      this.landscape.getComponent(componentId).hide();
    });
    this.structureTouched = true;
    this.dependenciesTouched = true;
  }

  showComponents(componentIds: ComponentId[]) {
    componentIds.forEach(componentId => {
      this.landscape.getComponent(componentId).show();
    });
    this.structureTouched = true;
    this.dependenciesTouched = true;
  }

  showCapabilities(componentIds: ComponentId[]) {
    this.landscape.getCapabilities()
      .forEach(c => c.visible = componentIds.includes(c.id));
    this.structureTouched = true;
  }

  showCommons(componentIds: ComponentId[]) {
    this.landscape.getCommons()
      .forEach(c => c.visible = componentIds.includes(c.id));
    this.structureTouched = true;
  }

  activateComponents(componentIds: ComponentId[]) {
    componentIds.forEach(id => {
      this.landscape.getComponent(id).activate();
    });
    this.dependenciesTouched = true;
  }

  deactivateComponents(componentIds: ComponentId[]) {
    componentIds.forEach(id => {
      this.landscape.getComponent(id).deactivate();
    });
    this.dependenciesTouched = true;
  }

  pinDependencies(componentIds: ComponentId[]) {
    componentIds.forEach(id => {
      this.landscape.getComponent(id).pin();
    });
    this.structureTouched = true;
    this.dependenciesTouched = true;
  }

  unpinDependencies(componentIds: ComponentId[]) {
    componentIds.forEach(id => {
      this.landscape.getComponent(id).unpin();
    });
    this.structureTouched = true;
    this.dependenciesTouched = true;
  }


}
