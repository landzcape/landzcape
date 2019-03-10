import {DomainId} from './domain-id';

export class ComponentId {

  private static IDS = new Map<string, ComponentId>();

  private constructor(public readonly  domainId: DomainId,
                      public readonly  name: string) {
  }

  static fromNames(context: string, domain: string, component: string) {
    const key = `${context}/${domain}/${component}`;
    if (ComponentId.IDS.has(key)) {
      return ComponentId.IDS.get(key);
    }
    const id = new ComponentId(DomainId.fromNames(context, domain), component);
    ComponentId.IDS.set(key, id);
    return id;
  }
}
