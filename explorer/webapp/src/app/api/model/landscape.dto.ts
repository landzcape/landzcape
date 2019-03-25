import {ComponentDto} from './component.dto';
import {LayerDto} from './layer.dto';
import {ContextDto} from './context.dto';
import {DomainDto} from './domain.dto';

export class LandscapeDto {
  components: ComponentDto[];
  contexts: ContextDto[];
  domains: DomainDto[];
  layers: LayerDto[];
}
