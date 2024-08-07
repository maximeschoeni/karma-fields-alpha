
KarmaFieldsAlpha.Content = class {


  constructor(value) {

    // if (value instanceof KarmaFieldsAlpha.Content) {
    //
    //   this.value = value.value;
    //
    // } else {
    //
    //   this.value = value;
    //
    // }
    //
    // if (params) {
    //
    //   Object.assign(this, params);
    //
    // }

    this.value = value;

  }

  // state(state) {
  //
  //   Object.assign(this, state);
  //
  //   return this;
  //
  // }

  // loading() {
  //
  //   this.loading = true;
  //
  //   return this;
  //
  // }
  //
  // mixed() {
  //
  //   this.mixed = true;
  //
  //   return this;
  //
  // }

  // value(value) {
  //
  //   this.value = value;
  //
  //   return this;
  // }

  // getAt(index) {
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   if (this.loading) {
  //
  //     content.loading = true;
  //
  //   } else {
  //
  //     content.value = this.toArray()[index];
  //
  //   }
  //
  //   return content;
  // }
  //
  // getChild(key) {
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   if (this.loading) {
  //
  //     content.loading = true;
  //
  //   } else {
  //
  //     content.value = this.toObject()[key];
  //
  //   }
  //
  //   return content;
  // }
  //
  // set(content) { // deprecated
  //
  //   if (content.loading) {
  //
  //     this.loading = true;
  //
  //   } else {
  //
  //     this.value = content.value;
  //
  //   }
  //
  // }

  equals(content) {

    return KarmaFieldsAlpha.DeepObject.equal(content.toArray(), this.toArray());

  }

  // assign(content) {
  //
  //   this.value = content.value;
  //   this.loading = content.loading;
  //
  // }

  isEmpty() {

    return this.toArray().length === 0;
  }

  clone() {

    const clone = new this.constructor();

    this.value = clone.value;

    return clone;

  }

  // slice(index = 0, length = this.toArray().length) {
  //
  //   return this.toArray().slice(index, index + length);
  //
  // }

  toSingle() {

    if (this.loading || this.mixed || this.value === undefined) {

      return;

    }

    if (Array.isArray(this.value)) {

      return this.value[0];

    }

    return this.value;
  }

  toObject() {

    if (this.loading || this.mixed || this.value === undefined) {

      return {};

    }

    if (Array.isArray(this.value)) {

      return this.value[0] || {};

    }

    return this.value || {};
  }

  toString() {

    if (this.loading || this.mixed || this.value === undefined) {

      return "";

    }

    let value = this.value;

    if (Array.isArray(value)) {

      value = value[0];

    }

    if (typeof value === "string") {

      return value;

    } else if (value || value === 0) {

      return JSON.stringify(value);

    } else {

      return "";

    }

  }

  toNumber() {

    if (this.loading || this.mixed || this.value === undefined) {

      return 0;

    }

    if (Array.isArray(this.value)) {

      return Number(this.value[0]);

    } else {

      return Number(this.value);

    }

  }

  toBoolean() {

    if (this.loading || this.mixed || this.value === undefined) {

      return false;

    }

    let value = this.value;

    if (Array.isArray(value)) {

      value = value[0];

    }

    return Boolean(value);

  }

  toArray() {

    if (this.loading || this.mixed || this.value === undefined) {

      return [];

    }

    if (this.value === undefined) {

      return [];

    } else if (!Array.isArray(this.value)) {

      return [this.value];

    }

    return this.value;

  }

}

KarmaFieldsAlpha.Content.Loading = class {

  constructor() {

    this.loading = true;

  }

}


KarmaFieldsAlpha.Content.Request = class extends KarmaFieldsAlpha.Content {

  constructor(value) {

    super(value);

    this.loading = value === undefined;

  }

}

KarmaFieldsAlpha.Content.Collection = class extends KarmaFieldsAlpha.Content {

  constructor(value = []) {

    if (!Array.isArray(value)) {

      console.error("collection must contain an array");

    }

    super(value);

  }

  merge(content) {

    if (content.loading) {

      this.loading = true;

    } else {

      this.value = [...this.toArray(), ...content.toArray()];

    }

  }

  add(content) {

    if (content.loading) {

      this.loading = true;

    } else {

      this.value = [...this.toArray(), ...content.toSingle()];

    }

  }

  pick() {

    const string = this.value.shift();

    return new KarmaFieldsAlpha.Content(string);

  }

}


KarmaFieldsAlpha.Content.Grid = class extends KarmaFieldsAlpha.Content.Collection {

  constructor(value) {

    if (typeof value === "string") {

      const array = Papa.parse(value, {
        delimiter: '\t'
      }).data;

      super(array);

    } else {

      super(value || []);

    }

  }

  add(collection) {

    if (collection.loading) {

      this.loading = true;

    } else {

      this.value.push(collection.value);

    }

  }

  toString() {

    return Papa.unparse(this.value, {
      delimiter: "\t",
      newline: "\n"
    });

  }

}
