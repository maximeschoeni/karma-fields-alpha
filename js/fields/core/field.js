
KarmaFieldsAlpha.fields.field = class Field {

  constructor(resource, domain) {
    this.domain = domain || new KarmaFieldsAlpha.Domain();
    this.parent = null;
		this.children = [];
		this.resource = resource || {};
		this.data = {};
		this.events = {};
    // this.loading = 0;
    this.history = {};
    this.historyIndex = 0;
    this.datatype = this.resource.datatype || "string";
		this.fieldId = Field.fieldId++;

    // this.setValue(resource.value || resource.default);

    if (this.resource.children) {
  		for (let i = 0; i < this.resource.children.length; i++) {
  			this.createChild(this.resource.children[i], this.domain);
  		}
  	}

    // let field = this;
    // this.history = {
    //   undos: {},
    //   save: function() {
    //     let index = KarmaFieldsAlpha.History.getIndex(field);
    //     this.undos[index] = field.value;
    //   },
    //   go: function(index) {
    //     if (this.undos[index]) {
    //       field.setValue(this.undos[index], "undo");
    //     }
    //     field.children.forEach(function(child) {
    //       child.history.go(index);
    //     });
    //   },
    //   delete: function(index) {
    //     this.undos[index] = undefined;
    //     field.children.forEach(function(child) {
    //       child.history.delete(index);
    //     });
    //   }
    // }




  }

  static create(resource, domain, defaultType) {
    return new KarmaFieldsAlpha.fields[resource && resource.type || defaultType || "field"](resource, domain);
  }

  getId() {
    return "karma-fields-"+this.fieldId;
  }

  addChild(child) {
    this.children.push(child);
    child.parent = this;
  }

  addChildren(children) {
    this.children = children;
    for (let i = 0; i < children.length; i++) {
      children[i].parent = this;
    }
  }

  createField(resource) {
    return Field.create(resource, this.domain, this.defaultChildType);
  }

  createChild(resource) {
    let child = this.createField(resource);
    this.addChild(child);
    return child;
  }

  getDescendant(key) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].resource.key === key) {
        return this.children[i];
      } else if (!this.children[i].resource.key) {
        const child = this.children[i].getDescendant(key);
        if (child) {
          return child;
        }
      }
    }
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

  // triggerEvent(eventName, bubbleUp, target, ...params) {
  //   if (this.events[eventName] && typeof this.events[eventName] === "function") {
  //     return this.events[eventName].call(this, target || this, ...params);
  //   } else if (bubbleUp && this.parent) {
  //     return this.parent.triggerEvent(eventName, true, target || this, ...params);
  //   }
  // }

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

  getClosest(type) {
    if (this.resource.type === type) {
      return this;
    } else {
      return this.parent.getClosest(type);
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
    if (this.parent) {
      return this.parent.getRoot();
    } else {
      return this;
    }
  }

  sanitize(value) {

    let datatype = this.datatype || this.resource.datatype;

    switch (datatype) {
      case "object":
        if (!value || typeof value !== "object") {
          value = {};
        }
        break;

      case "array":
        if (!value) {
          value = [];
        } else if (!Array.isArray(value)) {
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
    switch (this.datatype || this.resource.datatype) {
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
    switch (this.datatype || this.resource.datatype) {
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

    let field = this;
    if (this.render) {
      return {
        render: function() {
          field.render(this.element, field);
        }
      }
    }
    // if (KarmaFieldsAlpha.renderers[this.resource.type || "group"]) {
    //   return {
    //     render: KarmaFieldsAlpha.renderers[this.resource.type || "group"]
    //   }
    // }
    return KarmaFieldsAlpha.templates[this.resource.type || "group"](this);
  }

  // history API
  getHistoryIndex() {
    let driver = this.getRoot().resource.driver;
    return KarmaFieldsAlpha.History.getDriverIndex(driver);
  }
  historySave() {
    let index = KarmaFieldsAlpha.History.getIndex(field);
    this.history[index] = this.getValue();
  }

  historyGo(index) {
    if (this.history[index]) {
      this.setValue(this.history[index], "undo");
    }
    this.children.forEach(function(child) {
      child.historyGo(index);
    });
  }

  historyDelete(index) {
    this.history[index] = undefined;
    this.children.forEach(function(child) {
      child.historyDelete(index);
    });
  }

  // query API
  queryOptions(driver, params) {
    return KarmaFieldsAlpha.Form.fetch(field.resource.driver, "querykey", params);
  }

  queryKey(driver, path) {
    return KarmaFieldsAlpha.Form.get(field.resource.driver, path);
  }


  // option API
  hasOptions() {
    return this.data.options !== undefined;
  }
  getOptions() {
    return this.data.options || [];
  }
  setOptions(options) {
    this.data.options = options;
    this.triggerEvent("options");
  }
  fetchOptions(options) {
    if (this.resource.options) {
      return Promise.resolve(this.resource.options)
    }
    return this.triggerEvent("fetch") || Promise.resolve([]);
  }



};

KarmaFieldsAlpha.fields.field.fieldId = 1;


//
// KarmaFieldsAlpha.createField = function(resource) {
//   let obj = KarmaFieldsAlpha.fields[resource && resource.type || "group"];
// 	let field;
// 	if (obj && obj.create) {
// 		field = obj.create(resource || {});
// 	} else {
// 		field = KarmaFieldsAlpha.Field(resource || {});
// 	}
// 	return field;
// }
//
// KarmaFieldsAlpha.FieldID = 1;
//
// KarmaFieldsAlpha.Field = function(resource, parent, events) {
//
//
//
// 	let field = {
// 		parent: parent,
// 		directory: {},
// 		children: [],
// 		resource: resource || {},
// 		data: {},
// 		events: events || {},
// 		// events: resource || {},
// 		requests: {},
//     loading: 0,
//
// 		fieldId: KarmaFieldsAlpha.FieldID++, // -> debug
//
// 		getId: function() {
// 			// let id = this.resource.key || this.resource.type || "group";
// 			// if (this.parent) {
// 			// 	id = this.parent.getId()+"-"+id
// 			// }
// 			// return id;
//       return "karma-fields-"+this.fieldId;
// 		},
//
// 		// add: function(child) {
// 		// 	// let child = KarmaFieldsAlpha.Field();
// 		// 	if (child.resource.key) {
// 		// 		this.children.push(child);
// 		// 		this.directory[child.resource.key] = child;
// 		// 		child.parent = this;
// 		// 	} else {
// 		// 		console.log(child.resource);
// 		// 		console.error("No key!");
// 		// 	}
// 		// },
// 		addChild: function(child) {
// 			this.children.push(child);
// 			child.parent = this;
// 		},
//     addChildren: function(children) {
// 			this.children = children;
//       for (let i = 0; i < children.length; i++) {
//         children[i].parent = this;
//       }
// 		},
// 		createChild: function(resource) {
// 			let child = KarmaFieldsAlpha.createField(resource);
// 			this.addChild(child);
//       return child;
// 		},
//
//     // deprecated
// 		getResourceAttribute: function(attribute) {
// 			if (this.resource[attribute] !== undefined) {
// 				return this.resource[attribute];
// 			} else if (this.parent) {
// 				return this.parent.getResourceAttribute(attribute);
// 			}
// 		},
//
//     // deprecated
//     getAttribute: function(attribute) {
// 			if (this[attribute] !== undefined) {
// 				return this[attribute];
// 			} else if (this.parent) {
// 				return this.parent.getAttribute(attribute);
// 			}
// 		},
//
//     // deprecated
// 		get: function(key) {
// 			return this.getDescendant(key);
// 		},
//
// 		getDescendant: function(key) {
// 			for (let i = 0; i < this.children.length; i++) {
// 				if (this.children[i].resource.key === key) {
// 					return this.children[i];
// 				} else if (!this.children[i].resource.key) {
// 					const child = this.children[i].getDescendant(key);
// 					if (child) {
// 						return child;
// 					}
// 				}
// 			}
// 		},
//
//     // deprecated
// 		getByKeyPath: function(keys) {
// 			if (keys.length === 1) {
// 				return this.getDescendant(keys[0]);
// 			} else if (keys.length > 1) {
// 				keys.shift();
// 				return this.getByKeyPath(keys);
// 			}
// 		},
//
//     // deprecated
// 		getByPath: function(path) {
// 			return this.getByKeyPath(path.split("/"));
// 		},
//
//     // deprecated
// 		trigger: function(eventName, ...param) {
// 			if (this.events[eventName] && typeof this.events[eventName] === "function") {
// 				return this.events[eventName].call(this, ...param);
// 			} else if (this.parent) {
// 				return this.parent.trigger.call(this.parent, eventName, ...param);
// 			}
// 		},
//
// 		triggerEvent: function(eventName, bubbleUp, target, ...params) {
// 			if (this.events[eventName] && typeof this.events[eventName] === "function") {
// 				return this.events[eventName](target || this, ...params);
// 			} else if (bubbleUp && this.parent) {
// 				return this.parent.triggerEvent(eventName, true, target || this, ...params);
// 			}
// 		},
//
//
//     fetch: function(targetField) {
//       if (!targetField) {
//         targetField = this;
//       }
//       let key = targetField.resource.option_key || targetField.resource.key;
//       if (!key) {
//         return Promise.reject("field has no key");
//       } else if (this.resource.driver) {
//         return KarmaFieldsAlpha.Form.fetch(this.resource.driver, "querykey", {
//   				key: key,
//           ...this.resource.args || {}
//   			});
//       } else if (this.parent) {
//         return this.parent.fetch(targetField);
//       } else {
//         return Promise.reject("no parent and no driver found");
//       }
//     },
//     // field.events.init = function(currentField) {
//     //   if (currentField.resource.key) {
//     //     KarmaFieldsAlpha.Form.get(field.resource.driver, field.resource.key+"/"+currentField.resource.key).then(function(results) {
//     //       currentField.setValue(results, "set");
//     //     });
//     //   }
//     // };
//
//
//     // not tested yet!!
//     init: function() {
//       if (this.value === undefined) {
//         return this.fetchKey(targetField);
//       }
//     },
//
//     fetchKey: function(targetField, path) {
//       if (!path) {
//         path = [];
//       }
//       if (this.resource.key) {
//         path.unshift(targetField.resource.key);
//       }
//       if (this.resource.driver && path.length) {
//         // targetField.loading++;
//         KarmaFieldsAlpha.Form.get(this.resource.driver, path.join("/")).then(function(results) {
//           // targetField.loading--;
//           targetField.setValue(results, "set");
//         });
//       } else if (this.parent) {
//         return this.parent.fetchKey(targetField, path);
//       }
//     },
//
// 		// getModifiedValue: function() {
// 		// 	let value;
// 		// 	if (this.children.length) {
// 		// 		this.children.forEach(function(child) {
// 		// 			let childValue = child.getModifiedValue();
// 		// 			if (childValue !== undefined) {
// 		// 				if (!value) {
// 		// 					value = {};
// 		// 				}
// 		// 				if (child.resource.key) {
// 		// 					value[child.resource.key] = childValue;
// 		// 				} else {
// 		// 					Object.assign(value, childValue);
// 		// 				}
// 		// 				value[child.resource.key] = childValue;
// 		// 			}
// 		// 		});
// 		// 	} else {
// 		// 		if (this.value !== this.originalValue) {
// 		// 			return this.parse(this.value);
// 		// 		}
// 		// 	}
// 		// 	return value;
// 		// },
//     getModifiedValue: function() {
//       if (this.value !== this.originalValue) {
//         return this.parse(this.value);
//       }
// 		},
//     updateOriginal: function() {
//       this.originalValue = this.value;
// 		},
//     isModified: function() {
//       return this.originalValue === this.value;
//     },
//
// 		getValue: function() {
//       return this.parse(this.value);
//
// 			// let value;
// 			// if (this.children.length) {
// 			// 	value = {};
// 			// 	this.children.forEach(function(child) {
// 			// 		if (child.resource.key) {
// 			// 			value[child.resource.key] = child.getValue();
// 			// 		} else {
// 			// 			Object.assign(value, child.getValue());
// 			// 		}
// 			// 	});
// 			// } else {
// 			// 	value = this.parse(this.value);
// 			// }
// 			// return value;
// 		},
// 		hasValue: function() {
// 			// return this.children.length && this.children.some(function(child) {
// 			// 	return child.hasValue();
// 			// }) || this.value && true || false;
// 			// return false;
//
//       return this.value !== undefined;
// 		},
// 		setValue: function(value, context) { // context = {'change' | 'set' | 'undo'}
//
//
// 			// if (!context) {
// 			// 	context = "change";
// 			// }
// 			// if (this.children.length) {
// 			// 	if (value && typeof value === "object") {
// 			// 		for (let key in value) {
// 			// 			const child = this.getDescendant(key);
// 			// 			if (child) {
// 			// 				child.setValue(value[key], context);
// 			// 			}
// 			// 		}
// 			// 	}
//       //
// 			// } else {
//       //
// 			// 	value = this.sanitize(value);
//       //
// 			// 	this.isDifferent = this.value !== value;
//       //
// 			// 	this.value = value;
//       //
// 			// 	if (context === "set") {
// 			// 		this.originalValue = value;
// 			// 		this.history.save();
// 			// 		this.triggerEvent("render");
//       //
// 			// 	}
// 			// 	if (context === "undo") {
// 			// 		// this.trigger("render");
// 			// 	}
// 			// 	if (context === "change" && value !== this.lastValue) {
// 			// 		this.triggerEvent("change", true);
// 			// 	}
//       //
// 			// 	this.isModified = value !== this.originalValue;
// 			// 	this.lastValue = value;
// 			// 	this.triggerEvent("update");
//       //
// 			// 	// }
// 			// }
//
//       let response;
//
//       if (value === undefined) {
//         return;
//       }
//
//       if (!context) {
// 				context = "change";
// 			}
//
// 			value = this.sanitize(value);
//
// 			this.isDifferent = this.value !== value;
// 			this.value = value;
//
// 			if (context === "set") {
// 				this.originalValue = value;
// 				// this.history.save();
// 				this.triggerEvent("set", true); // -> will save history
//
// 			}
// 			if (context === "undo") {
// 				// this.trigger("render");
// 			}
// 			if (context === "change" && value !== this.lastValue) {
// 				response = this.triggerEvent("change", true);
// 			}
//
// 			this.isModified = value !== this.originalValue;
// 			this.lastValue = value;
// 			this.triggerEvent("update");
//
//       return response;
// 		},
// 		getPath: function(fromField) {
// 			let keys = [];
// 			if (this.resource.key) {
// 				keys.push(this.resource.key);
// 			}
// 			if (this.parent && this.parent !== fromField) {
// 				keys.push(this.parent.getPath(fromField));
// 			}
// 			return keys.join("/");
//
// 			// let path = this.resource.key || "";
// 			// if (this.parent && this.parent !== fromField) {
// 			// 	path = this.parent.getPath()+"/"+path
// 			// }
// 			// return path;
// 		},
// 		getClosest: function(type) {
// 			if (this.resource.type === type) {
// 				return this;
// 			} else {
// 				return this.parent.getClosest(type);
// 			}
// 		},
// 		getRoot: function() {
// 			if (this.parent) {
// 				return this.parent.getRoot();
// 			} else {
// 				return this;
// 			}
// 		},
// 		sanitize: function(value) {
//
// 			let datatype = this.datatype || this.resource.datatype;
//
// 			switch (datatype) {
// 				case "object":
// 					if (!value || typeof value !== "object") {
// 						value = {};
// 					}
// 					break;
//
// 				case "array":
// 					if (!value) {
// 						value = [];
// 					} else if (!Array.isArray(value)) {
// 						// value = [JSON.parse(value)];
//             value = [value];
// 					}
// 					break;
//
// 				case "number":
// 					if (!value || isNaN(value)) {
// 						value = 0;
// 					}
// 					break;
//
// 				case "boolean":
// 					// value = value && JSON.parse(value) === true || false;
//           value = !!value;
// 					break;
// 			}
//
// 			if (typeof value !== "string") {
// 				value = JSON.stringify(value);
// 			}
//
// 			return value;
// 		},
// 		parse: function(value) {
// 			let datatype = this.datatype || this.resource.datatype;
//
// 			switch (datatype) {
// 				case "object":
// 					value = value && JSON.parse(value) || {};
// 					break;
// 				case "array":
// 					value = value && JSON.parse(value) || [];
// 					break;
// 				case "number":
// 					value = value && JSON.parse(value) || 0;
// 					break;
// 				case "boolean":
// 					value = value && JSON.parse(value) || false;
// 					break;
// 			}
// 			return value || "";
// 		},
//     getDefault: function() {
//       let value;
//       switch (this.datatype || this.resource.datatype) {
//         case "object":
// 					value = {};
// 					break;
// 				case "array":
// 					value = [];
// 					break;
// 				case "number":
// 					value = 0;
// 					break;
// 				case "boolean":
// 					value = false;
// 					break;
// 				default:
// 					value = "";
// 					break;
// 			}
//       return value;
//     },
//
//
// 		// build: function() {
// 		// 	let nodes = [];
// 		//
// 		// 	if (this.resource.label) {
// 		// 		nodes.push({
// 		// 			tag: "label",
// 		// 			init: function(label) {
// 		// 				this.element.htmlFor = field.getId();
// 		// 				this.element.textContent = field.resource.label;
// 		// 			}
// 		// 		});
// 		// 	}
// 		//
// 		// 	if (KarmaFieldsAlpha.fields[child.resource.type]) {
// 		// 		nodes = nodes.concat(builder(KarmaFieldsAlpha.fields[child.resource.type]));
// 		// 		nodes.push({
// 		// 			class: "karma-field-spinner"
// 		// 		});
// 		// 	}
// 		//
// 		// 	return nodes;
// 		//
// 		//
// 		// },
//
// 		build: function() {
// 			let obj = KarmaFieldsAlpha.fields[this.resource.type || "group"];
// 			if (typeof obj === "function") {
// 				return obj(this);
// 			} else {
// 				return obj.build(this);
// 			}
// 		},
//
//
//
// 		history: {
// 			undos: {},
// 			save: function() {
// 				let index = KarmaFieldsAlpha.History.getIndex(field);
// 				this.undos[index] = field.value;
// 			},
// 			go: function(index) {
// 				if (this.undos[index]) {
// 					field.setValue(this.undos[index], "undo");
// 				}
// 				field.children.forEach(function(child) {
// 					child.history.go(index);
// 				});
// 			},
// 			delete: function(index) {
// 				this.undos[index] = undefined;
// 				field.children.forEach(function(child) {
// 					child.history.delete(index);
// 				});
// 			}
// 		}
// 	}
//
// 	if (resource.value || resource.default) {
// 		field.setValue(resource.value || resource.default);
// 	}
//
// 	if (parent) {
// 		parent.children.push(field);
// 		// if (resource.key) {
// 		// 	parent.directory[resource.key] = field;
// 		// }
// 	}
//
// 	// if (resource.children) {
// 	// 	resource.children.forEach(function(childResource) {
// 	// 		KarmaFieldsAlpha.Field(childResource, field);
// 	// 	});
// 	// }
//
// 	if (resource.children) {
// 		for (let i = 0; i < resource.children.length; i++) {
// 			field.createChild(resource.children[i]);
// 		}
// 	}
// 	return field;
// };
