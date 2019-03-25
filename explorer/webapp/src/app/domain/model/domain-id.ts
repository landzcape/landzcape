import {ContextId} from './context-id';

export class DomainId {

  private static IDS = new Map<string, DomainId>();

  private constructor(public readonly contextId: ContextId,
                      public readonly  name: string) {
  }

  static fromNames(context: string, domain: string) {
    const key = `${context}/${domain}`;
    if (DomainId.IDS.has(key)) {
      return DomainId.IDS.get(key);
    }
    const id = new DomainId(ContextId.fromName(context), domain);
    DomainId.IDS.set(key, id);
    return id;
  }
}
