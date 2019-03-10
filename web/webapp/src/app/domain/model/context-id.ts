export class ContextId {

  private static IDS = new Map<string, ContextId>();

  private constructor(public readonly name: string) {
  }

  static fromName(name: string) {
    if (ContextId.IDS.has(name)) {
      return ContextId.IDS.get(name);
    }
    const id = new ContextId(name);
    ContextId.IDS.set(name, id);
    return id;
  }

}
