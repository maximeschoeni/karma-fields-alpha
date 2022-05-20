
KarmaFieldsAlpha.Resource = class {

  static getSubResources(resource) {
    if (resource.children) {
      return resource.children.reduce((array, item) => {
        if (item.key !== undefined) {
          return [...array, item];
        } else {
          return [
            ...array,
            ...this.getSubResources(item)
          ];
        }
      }, []);
    }
    return [];
  }

}
