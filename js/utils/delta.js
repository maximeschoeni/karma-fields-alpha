

KarmaFieldsAlpha.Delta = class {

  static empty() {
    console.error("deprecated method");
    this.object = {};

  }

  static get(...path) {
console.error("deprecated method");
    return KarmaFieldsAlpha.DeepObject.get(this.object, ...path);

  }

  static set(value, ...path) {
console.error("deprecated method");
    KarmaFieldsAlpha.DeepObject.assign(this.object, value, ...path);

  }

  static remove(...path) {
console.error("deprecated method");
    KarmaFieldsAlpha.DeepObject.remove(this.object, ...path);

  }

  static has(...path) {
console.error("deprecated method");
    return KarmaFieldsAlpha.DeepObject.has(this.object, ...path);
  }

  static merge(value) {
console.error("deprecated method");
    KarmaFieldsAlpha.DeepObject.merge(this.object, value);

  }

  static compare(...path) {
console.error("deprecated method");
    return KarmaFieldsAlpha.DeepObject.equal(this.get(...path), KarmaFieldsAlpha.Query.getValue(...path));

  }

  static isModified(...path) {
console.error("deprecated method");
    return !this.compare(...path);

  }

  // static async *updater() {

  //   for (let driver in this.object) {

  //     for (let id in this.object[driver]) {

  //       KarmaFieldsAlpha.DeepObject.merge(KarmaFieldsAlpha.Query.vars[driver][id], this.object[driver][id]); // -> needed for autosave

  //       await KarmaFieldsAlpha.Gateway.post(`update/${driver}/${id}`, this.object[driver][id]);

  //       yield;

  //     }

  //   }

  // }

  static send() {

    if (!this.updateTasks) {

      this.updateTasks = [];

    }

    const data = this.object;

    for (let driver in data) {

      for (let id in data[driver]) {

        this.updateTasks.push(() => KarmaFieldsAlpha.Gateway.post(`update/${driver}/${id}`, data[driver][id]));

      }

    }

    KarmaFieldsAlpha.DeepObject.merge(KarmaFieldsAlpha.Query.vars, this.object); // -> needed for autosave

    this.object = {};

  }


  static async processUpdate() {

    if (this.updateTasks && this.updateTasks.length) {

      const task = this.updateTasks.pop();

      await task();

      return true;

    }

    return false;
  }


}

KarmaFieldsAlpha.Delta.object = {};
