import {Box, BoxParameters} from '../../../domain/common/box';
import {DomainId} from '../../../domain/model/domain-id';

export class DomainLo {

  constructor(parameters: DomainLoParameters) {
    this.box = parameters.box;
    this.id = parameters.id;
    this.name = parameters.name;
    this.label = parameters.label;
  }

  id: DomainId;
  name: string;
  label: string;
  box: Box;
}

export interface DomainLoParameters {
  id: DomainId;
  name: string;
  label: string;
  box: Box;
}
