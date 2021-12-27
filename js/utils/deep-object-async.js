
KarmaFieldsAlpha.DeepObjectAsync = class extends KarmaFieldsAlpha.DeepObject {

  static async some(object, callback, ...path) {
    if (object && typeof object === "object" && !Array.isArray(object)) {
      for (let i in object) {
        if (await this.some(object[i], callback, ...path, i)) {
          return true;
        }
      }
    } else if (object !== undefined && await callback(object, ...path)) {
      return true;
    }
    return false;
  }

}
