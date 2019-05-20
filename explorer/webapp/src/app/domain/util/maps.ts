export class Maps {

  /**
   * Groups by extracted key. If the key is undefined, the element is dropped.
   * @param list
   * @param extractor
   */
  public static groupBy<K, V>(list: V[], extractor: (value: V) => K): Map<K, V[]> {
    const map = new Map<K, V[]>();
    if (list) {
      list.forEach(element => {
        const key = extractor(element);
        if (key !== undefined) {
          if (map.has(key)) {
            map.get(key).push(element);
          } else {
            map.set(key, [element]);
          }
        }
      });
    }
    return map;
  }
}
