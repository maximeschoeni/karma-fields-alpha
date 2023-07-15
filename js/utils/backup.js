
KarmaFieldsAlpha.Backup = class {

  static before = {};
  static after = {};

  static add(newValue, currentValue, ...path) {

    if (!KarmaFieldsAlpha.DeepObject.has(this.before, ...path)) {

      KarmaFieldsAlpha.DeepObject.set(this.before, currentValue, ...path);

    }

    KarmaFieldsAlpha.DeepObject.set(this.after, newValue, ...path);

  }

  static update(value, ...path) {

    const object = {};

    KarmaFieldsAlpha.DeepObject.set(object, value, ...path);
    KarmaFieldsAlpha.History.merge(object);

  }

  static save(ref, force) {

    if (ref && ref !== this.ref) {

      // if (!KarmaFieldsAlpha.DeepObject.equal(this.before, this.after)) {

        // -> array::add must always save even when no change

        KarmaFieldsAlpha.History.merge(this.before);
        KarmaFieldsAlpha.History.addState(this.after);

        this.ref = ref;

      // }

    } else {

      KarmaFieldsAlpha.History.merge(this.after);

    }



    this.before = {};
    this.after = {};

  }

}
