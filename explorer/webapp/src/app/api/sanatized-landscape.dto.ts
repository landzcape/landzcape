import {LandscapeDto} from './model/landscape.dto';
import {DomainId} from '../domain/model/domain-id';
import {ContextId} from '../domain/model/context-id';

export class SanatizedLandscapeDto {
  landscape: LandscapeDto;
  shadowDomains: DomainId[];
  shadowContexts: ContextId[];
}
