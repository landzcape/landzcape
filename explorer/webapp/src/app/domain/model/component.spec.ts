import {Component} from "./component";
import {ComponentId} from "./component-id";
import {Layer} from "./layer";
import {ComponentType} from "./component-type";

describe('Component', () => {

  it('should exclude circular dependencies', () => {
    const topLayer = new Layer({name: "top", label: "Top", order: 1});
    const one = new Component({
      id: ComponentId.fromNames("context", "domain", "one"),
      name: "one",
      group: "group",
      version: "1",
      label: "One",
      layer: topLayer,
      type: ComponentType.BUSINESS
    });

    const two = new Component({
      id: ComponentId.fromNames("context", "domain", "two"),
      name: "two",
      group: "group",
      version: "1",
      label: "Two",
      layer: topLayer,
      type: ComponentType.BUSINESS
    });

    const three = new Component({
      id: ComponentId.fromNames("context", "domain", "three"),
      name: "three",
      group: "group",
      version: "1",
      label: "Three",
      layer: topLayer,
      type: ComponentType.BUSINESS
    });


    two.dependencies.push(one);
    two.dependencies.push(three);
    one.dependencies.push(two);
    expect(two.getTransitiveBusinessDependencies()).toEqual([one, three]);
    expect(one.getTransitiveBusinessDependencies()).toEqual([three, two]);
  });
});
