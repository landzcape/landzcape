import {ComponentOptionLo} from './drawing/tools/model/component-option.lo';
import {Landscape} from './domain/model/landscape';
import {SelectionTypeLo, StructureOptionLo} from './drawing/tools/model/structure-option.lo';
import {Component} from './domain/model/component';
import {ToolsState} from './landscape.reducer';

export class OptionMapper {

  static toToolsState(landscape: Landscape): ToolsState {
    const capabilities: ComponentOptionLo[] = landscape.getCapabilities().map(m => OptionMapper.toComponentOptionLo(m));
    const commons: ComponentOptionLo[] = landscape.getCommons().map(m => OptionMapper.toComponentOptionLo(m));
    const application: StructureOptionLo[] = OptionMapper.toApplicationOptionLo(landscape);
    const layers: StructureOptionLo[] = OptionMapper.toLayerStructureOptionLo(landscape);
    const structures: StructureOptionLo[] = OptionMapper.toStructureOptionLo(landscape);
    return {
      capabilityOptions: capabilities,
      commonOptions: commons,
      layerOptions: layers,
      structureOptions: structures,
      applicationOptions: application
    };
  }

  private static toComponentOptionLo(m: Component): ComponentOptionLo {
    return {
      label: m.label,
      id: m.id
    };
  }

  private static toLayerStructureOptionLo(landscape: Landscape): StructureOptionLo[] {
    return landscape.layers.map(layer => {
      const components = landscape.getComponents()
        .filter(m => m.layer === layer)
        .map(m => {
          return {
            label: m.label,
            component: m.id,
            id: m.id,
            selected: m.visible ? SelectionTypeLo.SELECTED : SelectionTypeLo.UNSELECTED
          };
        });
      return {
        label: layer.label,
        children: components,
        id: layer.name,
        selected: SelectionTypeLo.combine(components.map(d => d.selected))
      };
    });
  }

  private static toStructureOptionLo(landscape: Landscape): StructureOptionLo[] {
    return landscape.contexts.map(context => {
      const domains = context.domains.map(domain => {
        const components = domain.components
          .filter(component => component.isBusiness())
          .map(component => {
            return {
              label: component.label,
              component: component.id,
              id: component.id,
              selected: component.visible ? SelectionTypeLo.SELECTED : SelectionTypeLo.UNSELECTED
            };
          });
        return {
          label: domain.label,
          id: domain.id,
          children: components,
          selected: SelectionTypeLo.combine(components.map(c => c.selected))
        };
      }).filter(d => d.children.length > 0);
      return {
        label: context.label,
        children: domains,
        id: context.id,
        selected: SelectionTypeLo.combine(domains.map(d => d.selected))
      };
    }).filter(c => c.children.length > 0);
  }

  private static toApplicationOptionLo(landscape: Landscape) {
    const applications = landscape.getApplications();
    const applicationComponents = new Set<Component>();
    const applicationOptions = applications
      .map(application => {
        const components = application.getTransitiveBusinessDependencies()
          .map(component => {
            applicationComponents.add(component);
            return {
              label: component.label,
              component: component.id,
              id: component.id,
              selected: component.visible ? SelectionTypeLo.SELECTED : SelectionTypeLo.UNSELECTED
            };
          });
        return {
          label: application.label,
          children: components,
          id: application.id,
          selected: SelectionTypeLo.combine(components.map(d => d.selected))
        };
      });

    const otherComponentOptions = landscape.getBusinessComponents()
      .filter(component => !applicationComponents.has(component))
      .map(component => {
        return {
          label: component.label,
          component: component.id,
          id: component.id,
          selected: component.visible ? SelectionTypeLo.SELECTED : SelectionTypeLo.UNSELECTED
        };
      });

    const otherOption = {
        label: 'No Application',
        id: 'landscape.no.application',
        children: otherComponentOptions,
        selected: SelectionTypeLo.combine(otherComponentOptions.map(d => d.selected))
      };

    return [...applicationOptions, otherOption];
  }
}
