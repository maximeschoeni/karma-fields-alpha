
KarmaFieldsAlpha.Event = class {

  constructor(args = null, target = null) {

    this.target = target;
    this.data = []; // -> should be undefined ?
    this.path = [];
    this.type = "array";

    this.index = 0;
    // this.relativeIndex = new Map();
    // this.relativePath = new Map();
    // this.relativeDispatcher = new Map();

    if (args) {
      Object.assign(this, args);
    }

  }

  setArray(value) {
    this.data = value;
  }

  setString(value) {
    this.data = [value.toString()];
  }

  setNumber(value) {
    this.data = [Number(value)];
  }

  setBoolean(value) {
    this.data = [Boolean(value)];
  }

  setObject(value) {
    this.data = [value];
  }

  setValue(value) {
    if (Array.isArray(value)) {
      this.data = value;
    } else if (value === undefined || value === null) {
      this.data = [];
    } else {
      this.data = [value];
    }
  }

  getValue() {
    if (this.type === "string") {
      return this.getString();
    } else if (this.type === "number") {
      return this.getNumber();
    } else if (this.type === "boolean") {
      return this.getBoolean();
    } else if (this.type === "object") {
      return this.getObject();
    } else {
      return this.getArray();
    }
  }


  getString() {
    if (this.data[0]) {
      return this.data[0].toString();
    } else {
      return "";
    }
  }

  getNumber() {
    return Number(this.data[0]) || 0;
  }

  getBoolean() {
    return Boolean(this.data[0]);
  }

  getObject() {
    return this.data[0];
  }

  getArray() {
    return this.data;
  }


  hasValue() {
    return this.data.length > 0;
  }

  duplicate() {
    const event = new KarmaFieldsAlpha.Event();
    event.target = this.target;
    event.data = [...this.data];
    event.path = [...this.path];
    event.type = this.type;
    event.action = this.action;
    event.default = this.default;

    return event;
  }

  getDispatcher(field) {
    return field && this.relativeDispatcher.get(field) || this.dispatcher;
  }

  getPath(field) {

    // return field && this.relativePath.get(field) || this.path;
    const index = this.relativeIndex.get(field) || 0;
    return index && this.path.slice(index) || [];
  }

}
