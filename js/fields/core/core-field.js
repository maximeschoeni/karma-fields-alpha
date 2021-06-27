
KarmaFieldsAlpha.core.coreField = class CoreField {

  constructor(resource, domain) {
    this.domain = domain;
		this.resource = resource || {};
		this.data = {};
		this.events = {};
    this.datatype = this.resource.datatype || "string";
		this.fieldId = Field.fieldId++;
  }

  static create(resource, domain, defaultType) {
    return new KarmaFieldsAlpha.fields[resource && resource.type || defaultType || "field"](resource, domain);
  }

  getId() {
    return "karma-fields-"+this.fieldId;
  }

  createField(resource) {
    return Field.create(resource, this.domain, this.defaultChildType);
  }

  getPath(field, keys) {
    if (!keys) {
      keys = [];
    }
    if (this !== field && this.parent) {
      if (this.resource.key) {
        keys.unshift(this.resource.key);
      }
      keys = this.parent.getPath(field, keys);
    }
    return keys;
  }

  triggerEvent(eventName, bubbleUp, target, ...params) {
    if (this.events[eventName] && typeof this.events[eventName] === "function") {
      return this.events[eventName](target || this, ...params);
    } else if (bubbleUp && this.parent) {
      return this.parent.triggerEvent(eventName, true, target || this, ...params);
    }
  }

  findAncestor(callback) {
    if (callback(this)) {
      return this;
    } else if (this.parent) {
      return this.parent.findAncestor(callback);
    }
  }

  getRoot() {
    return this.findAncestor(field => !field.parent);
  }

  stringify(value) {

    let datatype = this.datatype;

    switch (datatype) {
      case "object":
        if (!value || typeof value !== "object") {
          value = {};
        }
        break;

      case "array":
        // if (!value) {
        //   value = [];
        // } else
        if (!Array.isArray(value)) {
          value = [value];
        }
        break;

      case "number":
        if (!value || isNaN(value)) {
          value = 0;
        }
        break;

      case "boolean":
        value = !!value;
        break;
    }

    if (typeof value !== "string") {
      value = JSON.stringify(value);
    }

    return value;
  }

  parse(value) {
    switch (this.datatype) {
      case "object":
        value = value && JSON.parse(value) || {};
        break;
      case "array":
        value = value && JSON.parse(value) || [];
        break;
      case "number":
        value = value && JSON.parse(value) || 0;
        break;
      case "boolean":
        value = value && JSON.parse(value) || false;
        break;
    }
    return value || "";
  }

  getDefault() {
    let value;
    switch (this.datatype) {
      case "object":
        value = {};
        break;
      case "array":
        value = [];
        break;
      case "number":
        value = 0;
        break;
      case "boolean":
        value = false;
        break;
      default:
        value = "";
        break;
    }
    return value;
  }

  build() {
    const field = this;

    if (this.render) {
      return {
        render: function() {
          field.render(this.element, field);
        }
      }
    }
  }

  // query API
  queryOptions(driver, params) {
    return KarmaFieldsAlpha.Form.fetch(field.resource.driver, "querykey", params);
  }

  queryKey(driver, path) {
    return KarmaFieldsAlpha.Form.get(field.resource.driver, path);
  }

};

KarmaFieldsAlpha.fields.field.fieldId = 1;
