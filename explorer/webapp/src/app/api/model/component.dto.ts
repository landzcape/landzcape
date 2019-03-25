import {DependencyDto} from './dependency.dto';

export class ComponentDto {
  name: string;
  group: string;
  version: string;
  label: string;
  layer: string;
  domain: string;
  context: string;
  type: string;
  interfaces: DependencyDto[];
  dependencies: DependencyDto[];
}
