
KarmaFieldsAlpha.core.queryField = class extends KarmaFieldsAlpha.core.coreField {

  constructor(resource, domain) {
    super(resource, domain || {});
    this.history = {};
  }

  getModifiedValue() {
    if (this.getRawValue() !== this.originalValue) {
      return this.parse(this.getRawValue());
    }
  }

  // maybe deprecated -> use setValue
  updateOriginal() {
    this.originalValue = this.getRawValue();
  }

  isModified() {
    return this.getRawValue() === this.value;
  }

  getRawValue() {
    this.historyMin = Math.min(this.historyMax, this.domain.index);
    while (this.history[this.historyMin] === undefined && this.historyMin > 0) {
      this.historyMin--;
    }
    return this.history[this.historyMin];
    // let index = this.domain.index;
    // while (this.history[index] === undefined && index >= 0) {
    //   index--;
    // }
    // return this.history[index];
  }

  getValue() {
    if (this.hasValue()) {
      return this.parse(this.getRawValue());
    }

    return this.resource.default || this.resource.value || this.getDefault();
  }

  fetchValue() {
    return this.triggerEvent("init") || Promise.resolve(this.getValue());
  }

  hasValue() {
    // return this.value !== undefined;
    return this.getRawValue() !== undefined;
  }

  setValue(value, context) { // context = {'change' | 'set' | 'undo'}
    let response;

    if (value === undefined) {
      return;
    }

    if (!context) {
      context = "change";
    }

    value = this.sanitize(value);

    // this.isDifferent = this.history[this.domain.index] !== value;


    this.historyMin++;
    while (this.historyMin < this.domain.index) {
      this.history[this.historyMin] = undefined;
      this.historyMin++;
    }
    this.historyMax = this.domain.index;

    this.history[this.domain.index] = value;


    if (context === "set") {
      this.originalValue = value;
      // this.saveHistory();
      // this.triggerEvent("set", true); // -> will save history

    }

    if (context === "undo") {
      // this.triggerEvent("undo");
    }

    if (context === "change") {
      response = this.triggerEvent("change", true);
    }

    // this.isModified = value !== this.originalValue;
    // this.lastValue = value;

    this.triggerEvent("set"); // -> reload node

    return response;
  }

};
