
KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field.container {

  getId() {

    return this.resource.id;

  }

  getIndex() {

    return this.resource.index;

  }

  // -> same as grid !
  getValue(...path) {

    // return KarmaFieldsAlpha.Store.get("delta", this.resource.driver, this.resource.id, ...path) || KarmaFieldsAlpha.Query.getValue(this.resource.driver, this.resource.id, ...path);

    const id = this.getId();

    return KarmaFieldsAlpha.Query.getValue(this.resource.driver, id, ...path);

	}

  // -> same as grid !
	setValue(value, ...path) {

    // value = KarmaFieldsAlpha.Type.toArray(value);
    //
		// let currentValue = this.getValue(...path);
    //
		// if (!KarmaFieldsAlpha.DeepObject.equal(value, currentValue)) {
    //
    //   KarmaFieldsAlpha.History.backup(value, currentValue, "delta", this.resource.driver, this.resource.id, ...path);
    //
    //   KarmaFieldsAlpha.Store.set(value, "delta", this.resource.driver, this.resource.id, ...path);
    //
    //   this.save();
    //
    //   this.render();
    //
		// }

    value = KarmaFieldsAlpha.Type.toArray(value);

    const id = this.getId();

    KarmaFieldsAlpha.Store.setValue(value, this.resource.driver, id, ...path)

    this.render();

	}

  // -> same as grid
  modified(...path) {

    // return !KarmaFieldsAlpha.DeepObject.include(KarmaFieldsAlpha.Query.vars, KarmaFieldsAlpha.Store.get("delta", this.resource.driver, this.resource.id, ...path), this.resource.driver, this.resource.id, ...path);

    const id = this.getId();

    return !KarmaFieldsAlpha.DeepObject.include(KarmaFieldsAlpha.Query.vars, KarmaFieldsAlpha.Store.get("delta", this.resource.driver, id, ...path), this.resource.driver, id, ...path);

  }

  getDriver() {

    return this.resource.driver;

  }

  submit() {

    KarmaFieldsAlpha.Query.send();

    this.render();

  }


}
