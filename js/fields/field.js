
KarmaFieldsAlpha.loading = Symbol("loading");
KarmaFieldsAlpha.mixed = Symbol("mixed");

KarmaFieldsAlpha.field = class {

  static fieldId = 0;
  static uniqueId = 1;

  static getData() {

    return this.data;

  }

  static setData(value) {

    this.data = value;

  }

  constructor(resource = {}) {
		// this.children = [];
    // this.childMap = {};
		this.resource = resource || {};

		this.fieldId = KarmaFieldsAlpha.field.fieldId++;

    // this.expressionCache = new KarmaFieldsAlpha.Buffer("expressions");

  }


  // static create(resource, parent) {
  //   return new KarmaFieldsAlpha.field[resource && resource.type || "group"](resource, parent);
  // }

  getKey() {
    return this.resource.key;
  }

  getLabel() {
    return this.resource.label;
  }

  // getId() {
  //   // return "karma-fields-"+this.fieldId;
  //   return this.resource.uid;
  // }

  getUid() {
    return this.resource.uid;
  }

  getUniqueId() {
    return KarmaFieldsAlpha.field.uniqueId++;
  }

  getScrollContainer() {

    if (this.parent) {

      return this.parent.getScrollContainer();

    }

  }

  // addChild(child, id) {
  //   this.children.push(child);

  //   this.childMap[id || child.resource.id || child.resource.type] = child;

  //   child.parent = this;
  // }

  createField(resource) {

    if (typeof resource === "string") {

      resource = {
        type: resource
      };

    }

    const constructor = this.constructor;

    const type = resource.type || "group";

    // if (KarmaFieldsAlpha.field[type]) {
    //   return new KarmaFieldsAlpha.field[type](resource);
    // }

    // if (resource.uid !== undefined) {
    //   console.log(resource);
    // }

    // if (resource.type === "row") console.log("createField", resource.uid, resource.index);
    //
    // if (resource.uid === undefined) {

      resource.uid = `${this.resource.uid}-${resource.index}`;

    // }





    if (this.constructor[type] && typeof this.constructor[type] === "function") {
      return new this.constructor[type](resource);
    }

    if (this.constructor[type] && typeof this.constructor[type] === "object" && this.constructor[type].type !== type) {
      return this.createField({...this.constructor[type], ...resource, type: this.constructor[type].type});
    }

    if (this.parent) {
      return this.parent.createField(resource);
    }



    console.error("Field type does not exist", resource, this);

  }


  // getChild(resource, ...resources) {
  //
  //   const child = this.createChild(resource);
  //
  //   if (resources.length) {
  //
  //     return child.getChild(...resources);
  //
  //   }
  //
  //   return child;
  // }

  getChildren() {
		return this.resource.children || [];
	}

	getChild(index) {

		const children = this.getChildren();

		if (children) {

			let resource = children[index];

			if (resource) {

				if (typeof resource === "string") {

					resource = {type: resource};

				}

				return this.createChild({
					id: index,
					...resource,
					index: index
				});

			}

		}

	}

  getSelectionChild(selection) {
    console.error("deprecated");
    // if (selection && selection.path && selection.path.length) {
    //
    //   return this.getChild(selection.path[0]);
    //
    // }

    const children = this.getChildren();

    if (selection && children) {

      for (let i in children) {

        if (selection[i]) {

          return this.getChild(i);

        }

      }

    }

  }


  getSelectedChild(selection) {

    if (selection && selection.child) {

      return this.getChild(selection.childId);

    }

  }


  delete(selection = this.getSelection()) {

    // if (selection && selection.path && selection.path.length > 0) {
    //
    //   const [index, ...path] = selection.path;
    //
    //   const child = this.getChild(index);
    //
    //   child.delete({...selection, path: path});
    //
    // }



    // const child = this.getSelectionChild(selection);
    //
    // if (child) {
    //
    //   child.delete(selection[child.resource.index]);
    //
    // }

    // if (selection && selection[selection.index]) {
    //
    //   const child = this.getChild(selection.index);
    //
    //   if (child) {
    //
    //     child.delete(selection[selection.index]);
    //
    //   }
    //
    // }


    // if (selection && selection.child) {
    //
    //   const child = this.getChild(selection.childId);
    //
    //   if (child) {
    //
    //     child.delete(selection.child);
    //
    //   }
    //
    // }

    const child = this.getSelectedChild(selection);

    if (child) {

      child.delete(selection.child);

    }

  }

  copy(selection = this.getSelection()) {

    // if (selection && selection.path && selection.path.length > 0) {
    //
    //   const [index, ...path] = selection.path;
    //
    //   const child = this.getChild(index);
    //
    //   return child.copy({...selection, path: path});
    //
    // }

    // if (selection && selection[selection.index]) {
    //
    //   const child = this.getChild(selection.index);
    //
    //   if (child) {
    //
    //     return child.copy(selection[selection.index]);
    //
    //   }
    //
    // }

    if (selection && selection.child) {

      const child = this.getChild(selection.childId);

      if (child) {

        return child.copy(selection.child);

      }

    }

  }

  paste(string, selection = this.getSelection()) { // -> same as base method

    // if (selection && selection.path && selection.path.length > 0) {
    //
    //   const [index, ...path] = selection.path;
    //
    //   const child = this.getChild(index);
    //
    //   return child.paste(string, {...selection, path: path});
    //
    // }


    // if (selection && selection[selection.index]) {
    //
    //   const child = this.getChild(selection.index);
    //
    //   if (child) {
    //
    //     return child.paste(string, selection[selection.index]);
    //
    //   }
    //
    // }

    if (selection && selection.child) {

      const child = this.getChild(selection.childId);

      if (child) {

        return child.paste(string, selection.child);

      }

    }

  }


  execute(command, ...params) {

    this.parent.execute(command, ...params);

  }


  getSelectedValue(selection = this.getSelection()) {

    const child = this.getSelectedChild(selection);

    if (child) {

      return child.getSelectedValue(selection.child);

    } else {

      return this.getValue();

    }

  }



  // createChild(resource, id) {
  //
  //   let child = this.childMap[id || resource.id || resource.type || resource];
  //
  //   if (!child) {
  //
  //     child = this.createField(resource);
  //
  //     this.children.push(child);
  //     this.childMap[id || resource.id || resource.type] = child;
  //     child.parent = this;
  //
  //
  //   }
  //
  //   return child;
  // }

  createChild(resource) {

    const child = this.createField(resource);

    child.parent = this;


    // console.log("createChild", );
    //
    // if (this.selection && this.selection.childId === resource.index) {
    //
    //   child.selection = this.selection.child;
    //
    // }

    // const selection = this.getSelection();
    //
    // if (selection && selection.childId === child.resource.index) {
    //
    //   this.selection = selection.child;
    //
    // }



    return child;
  }

  getRoot() {

    if (this.parent) {

      return this.parent.getRoot();

    }

    return this;
  }

  // getDescendants() {

  //   let descendants = [];

  //   if (this.resource.children) {

  //     for (let resource of this.resource.children) {

  //       const child = this.createChild(resource);

  //       descendants = [...descendants, child, ...child.getDescendants()];

  //     }

  //   }

  //   return descendants;
  // }

  //
  // getDescendants() {
  //   const gen = function * (field) {
  //     for (let child of field.children) {
  //       if (child.resource.key !==  undefined) {
  //         yield child;
  //       } else {
  //         yield * gen(child);
  //       }
  //     }
  //   }
  //   return gen(this) || [];
  // }
  //
  // getResourceKeys(resource) {
  //   if (resource.key !== undefined) {
  //     return [resource.key];
  //   } else if (resource.children) {
  //     return resource.children.reduce((array, item) => {
  //       return [
  //         ...array,
  //         ...this.getResourceKeys(item)
  //       ];
  //     }, []);
  //   }
  //   return [];
  // }
  //
  // getKeyedResources(resource) {
  //
  //   if (!resource) {
  //     resource = this.resource;
  //   }
  //
  //   if (resource.children) {
  //
  //     return resource.children.reduce((array, child) => {
  //
  //       if (child.key !== undefined) {
  //
  //         return [...array, child];
  //
  //       } else {
  //
  //         return [
  //           ...array,
  //           ...this.getKeyedResources(child)
  //         ];
  //
  //       }
  //
  //     }, []);
  //
  //   }
  //
  //   return [];
  //
  //   // return KarmaFieldsAlpha.Resource.getSubResources(resource);
  //
  // }

  // getChild(id, ...path) {
  //   let child = this.childMap[id];

  //   // if (path.length) {
  //   //   child = child || [...this.getDescendants()].find(child => child.resource.id === id);
  //   //   child = child && child.getChild(...path);
  //   // }

  //   return child;
  // }

  // getRelativeParent() {
  //   if (this.resource.key !==  undefined || !this.parent) {
	// 		return this;
	// 	} else {
	// 		return this.parent.getRelativeParent();
	// 	}
  // }
  //
  // getPath() {
  //   let path = this.parent && this.parent.getPath() || [];
  //   if (this.resource.key !==  undefined) {
  //     path.push(this.resource.key);
  //   }
  //   return path;
  // }


  getDefault(defaults = {}) {
console.error("deprecated");
    if (this.resource.children) {

      for (let resource of this.resource.children) {

        this.createChild(resource).getDefault(defaults);

      }

    }

		return defaults;
	}

  async render() {

    // if (this.onrender) {
    //
    //   await this.onrender();
    //
    // } else {
    //
    //   await this.parent.render();
    //
    // }

    await this.parent.render();

  }

  save(name, label) {

    if (name) {

      this.parent.save(`${this.resource.index}-${name}`, label);

    }

    this.parent.save();

  }


  // async isModified() {

  //   const key = this.getKey();
  //   return this.parent.request("modified", {}, key);

  // }


  // async dispatch2(request, ...path) {
  //
  //   if (this.parent) {
  //
  //     const key = this.getKey();
  //
  //     if (key !== undefined) {
  //
  //       return this.parent.dispatch(request, key, ...path);
  //
  //     }
  //
  //     return this.parent.dispatch(request, ...path);
  //
  //   }
  //
  // }
  //
  //
  // async dispatch(event, parent, origin) {
  //   if (!event.path) {
  //     event.path = [];
  //   }
  //   // if (!event.trace) {
  //   //   event.trace = [];
  //   // }
  //   // event.trace.push(this);
  //   const key = this.getKey();
  //
  //   if (key !== undefined) {
  //
  //     if (event.path[0] === "..") {
  //       event.path.shift();
  //     } else {
  //
  //
  //       event.path.unshift(key);
  //
  //     }
  //   }
  //   if (!event.field) {
  //     event.field = this;
  //   }
  //
  //   if (this.parent) {
  //
  //     // event.dispatcher = this;
  //     // event.relativeDispatcher.set(this.parent, this);
  //
  //
  //     event = await this.parent.dispatch(event, this, origin || this);
  //
  //
  //
  //   }
  //
  //   return event;
  // }

  // request(subject, content, ...path) {

  //   if (this.parent) {

  //     return this.parent.request(subject, content, ...path);

  //   }

  // }

  request(action, ...values) {

    if (this[action]) {

      return this[action](...values);

    } else if (this.parent) {

      return this.parent.request(action, ...values);

    }

  }

  getResource(key) {

    if (this.resource[key] !== undefined) {

      return this.resource[key];

    } else if (this.parent) {

      return this.parent.getResource(key);
    }

  }

  // expect(action, object, ...path) {

  //   if (this.resource.children) {

  //     // if (!path.length || this.getKey() === path.shift()) {

  //       for (let resource of this.resource.children) {

  //         const child = this.createChild(resource);

  //         child.expect(action, object, ...path);

  //       }

  //     // }

  //   }

  // }





  // async parse(expression) {

  //   // const expressionKey = JSON.stringify(expression);
  //   //
  //   // let promise = this.cache.get(expressionKey);
  //   //
  //   // if (!promise) {
  //   //
  //   //   promise = KarmaFieldsAlpha.Expression.resolve(this, expression);
  //   //
  //   //   this.cache.set(promise, expressionKey);
  //   //
  //   // }
  //   //
  //   // return promise;

  //   return KarmaFieldsAlpha.Expression.resolve(this, expression);
  // }

  // async get(type, ...path) {
  //   const key = this.getKey();
  //   if (key) {
  //     path = [key, ...path];
  //   }
  //   const response = await this.request("get", {}, ...path);
  //   return KarmaFieldsAlpha.Type.convert(response, type);
  // }

  // async getString(...path) {
  //   return this.get("string", ...path);
  // }

  // async getNumber(...path) {
  //   return this.get("number", ...path);
  // }

  // async getArray(...path) {
  //   return this.get("array", ...path);
  // }

  // async getObject(...path) {
  //   return this.get("object", ...path);
  // }

  // used for export cells
  // async exportValue() {
  //   return "";
	// }
  //
  // // used for import cells
	// async importValue(value) {
  //   // noop
	// }

  // async export() {
  //   // noop
	// }

	// async import(object) {
  //   // noop
	// }

  initValue() {

	}

  getValue(...path) {

    const key = this.getKey();

    if (key !== undefined) {

      return this.parent.getValue(key, ...path);

    }

    return this.parent.getValue(...path);

  }

  getId() {

    if (this.parent) {

      return this.parent.getId();

    }

  }

  getName(...path) {

    return this.parent.getName(...path);

  }

  getParent(...path) {

    return this.parent.getParent(...path);

  }

  getPosition(...path) {

    return this.parent.getPosition(...path);

  }

  // getAliasedValue(key) {
  //
  //   return this.parent.getAliasedValue(...path);
  //
  // }

  getSingleValue(...path) {

    const values = this.getValue(...path);

    if (values === KarmaFieldsAlpha.mixed) {

			return KarmaFieldsAlpha.mixed;

		}

    if (!values || values === KarmaFieldsAlpha.loading) {

			return KarmaFieldsAlpha.loading;

		}

    return values[0];
  }


  getMixedValues(...path) {

    const key = this.getKey();

    if (key !== undefined) {

      return this.parent.getMixedValues(key, ...path);

    }

    return this.parent.getMixedValues(...path);

  }



  // getValue(...path) {
  //
  //   return this.parent.getValue(...path);
  //
  // }

  setValue(value, ...path) {

    // this.parent.setValue(value, ...path);

    const key = this.getKey();

    if (key !== undefined) {

      this.parent.setValue(value, key, ...path);

    } else {

      this.parent.setValue(value, ...path);

    }



  }

  getDriver() {

		return this.resource.driver || this.parent.getDriver();

	}

  // getDelta() {

  //   return this.parent.getDelta();

  // }

  modified(...path) {

    const key = this.getKey();

    if (key !== undefined) {

      return this.parent.modified(key, ...path);

    } else {

      return this.parent.modified(...path);

    }

  }


  // !
  getIdXXX() {
    return this.parent.getId();
  }

  getIndex() {
    return this.parent.getIndex();
  }

  // getKeys(set = new Set()) {

  //   const key = this.getKey();

  //   if (key) {

  //     set.add(key);

  //   } else if (this.resource.children) {

  //     for (let resource of this.resource.children) {

  // 			this.createChild(resource).getKeys(set);

  // 		}

  //   }

  //   return set;
  // }

  getKeys(set = new Set()) {

    if (this.resource.children) {

      for (let resource of this.resource.children) {

        const child = this.createChild(resource);
        const key = child.getKey();

        if (key) {

          set.add(key);

        } else {

          child.getKeys(set);

        }

  		}

    }

    return set;
  }

  follow(selection, callback) {

    const child = this.getSelectedChild(selection);

    if (child) {

      child.follow(selection.child, callback);

    } else if (selection) {

      return callback(this, selection);

    }




    // if (selection) {
    //
    //   if (selection.child) {
    //
    //     const child = this.getChild(selection.childId);
    //
    //     if (child) {
    //
    //       return child.follow(selection.child, callback);
    //
    //     }
    //
    //   } else {
    //
    //     return callback(this, selection);
    //
    //   }

  }


      // if (selection.index) {
      //
      //   const child = this.createChild({
      //     ...this.resource.children[selection.index],
      //     index: selection.index,
      //     uid: `${this.resource.uid}-${selection.index}`
      //   });
      //
      //   return child.follow(selection[selection.index], callback);
      //
      // }





  descend(selection, action) {

    if (this[action]) {

      return this[action](selection);

    } else if (this.resource.children) {

      for (let i = 0; i < this.resource.children.length; i++) {

        if (selection[i]) {

          const child = this.createChild({...this.resource.children[i], index: i});

          return child.descend(selection[child.resource.index], action);

        }

      }

    }

  }





  // paste(value, selection) {
  //
  //   this.import([value], selection.index || 0, selection.length || 0);
  //
  // }

  // copy(selection) {
  //
  //   const [value] = this.export([], selection.index || 0, selection.length || 0);
  //
  //   return value;
  //
  // }


  // export(object = {}) {

	// 	if (this.resource.children) {

	// 		for (let resource of this.resource.children) {

	// 			this.createChild(resource).export(object);

	// 		}

	// 	}

	// 	return object;
	// }

  export(items = []) {

    if (this.resource.children) {

			for (let resource of this.resource.children) {

				const child = this.createChild(resource);

        child.export(items);

			}

		}

		return items;
  }

  import(items) {

    if (this.resource.children) {

			for (let resource of this.resource.children) {

				const child = this.createChild(resource);

        child.import(items);

			}

		}

  }

	// import(object) {

	// 	if (this.resource.children) {

	// 		for (let resource of this.resource.children) {

	// 			this.createChild(resource).import(object);

	// 		}

	// 	}

	// }



  // follow(resource, ...resPath) {
  //
	// 	return this.createChild(resource).follow(...resPath);
  //
	// }


  // getAlias(key) {
  //   return this.resource.alias && this.resource.alias[key] || key;
  // }


  // setAbsoluteSelection(segment, ...path) {
  //
  //   this.parent.setAbsoluteSelection(segment, this.resource.index, ...path);
  //
  // }




  getSelection() {

    // return this.selection;


    // const selection = this.parent.getSelection();
    //
    // if (selection && selection.path && selection.path > 0) {
    //
    //   return {...selection, path: selection.path.slice(1)};
    //
    // }


    // const selection = this.parent.getSelection();
    //
    // if (selection) {
    //
    //   return selection[this.resource.index];
    //
    // }

    const selection = this.parent.getSelection();

    // console.log("getSelection", selection && selection.child, this.selection);

    if (selection && selection.childId === this.resource.index) {

      return selection.child;

    }

  }

  hasSelection() {

    const selection = this.getSelection();

    return Boolean(selection && selection.length);

    // return {};
  }

  setSelection(selection) {

    // if (selection) {
    //
    //   selection = {
    //     [this.resource.index]: selection,
    //     index: this.resource.index,
    //     length: 0
    //   };
    //
    // }
    //
    // this.parent.setSelection(selection);


    if (selection) {

      selection = {
        // ...this.parent.getSelection(),
        childId: this.resource.index,
        child: selection
      };

    }

    this.parent.setSelection(selection);





  }

  clearSelection(selection) {
console.error("deprecated");
    if (!selection || selection.final) {

      this.setSelection();

    } else if (this.resource.children) {

      for (let index in this.resource.children) {

        if (selection[index]) {

          const child = this.createChild({
            ...this.resource.children[index],
            index: index
          });

          child.clearSelection(selection[index]);

        }

      }

    }

  }


  deferFocus() { // -> defer focus to clipboard textarea

    this.parent.deferFocus();

  }



  getData() {

    const data = this.parent.getData();

    if (!data[this.resource.index]) {

      data[this.resource.index] = {};

    }

    return data[this.resource.index];

    // if (data) {
    //
    //   return data[this.resource.index];
    //
    // }

  }

  setData(value) {

    this.parent.setData({...this.parent.getData(), [this.resource.index]: value});

  }

  debounce(name, callback, interval = 500) {

    // const data = this.getData() || {};

    const data = this.getData();

    if (data[name]) {

      clearTimeout(data[name]);

    }

    data[name] = setTimeout(callback, interval);

    // this.setData(data);

  }

  // parseObject(objectExpression) {
  //
  //   const object = {};
  //
  //   for (let key in objectExpression) {
  //
  //     object[key] = this.parse(objectExpression[key]);
  //
  //   }
  //
  //   return object;
  // }

  submit() {

    this.parent.submit();

  }

  parseParams(params) {

    return KarmaFieldsAlpha.Expression.parseParams(params, this);

  }

  parse(expression) {

    return new KarmaFieldsAlpha.Expression(expression, this).parse();

    // if (Array.isArray(expression)) {
    //
    //   const [operation, ...expressions] = expression;
    //
    //   if (operation === "esc") {
    //
    //     return expressions[0];
    //
    //   } else if (operation === "debugger") {
    //
    //     debugger;
    //
    //   }
    //
    //   const values = expressions.map(expression => this.parse(expression));
    //
    //   if (values.some(value => value === KarmaFieldsAlpha.loading)) {
    //
    //     return KarmaFieldsAlpha.loading;
    //
    //   }
    //
    //   switch (operation) {
    //     case "=":
    //     case "==": return KarmaFieldsAlpha.Type.toObject(values[0]) == KarmaFieldsAlpha.Type.toObject(values[1]);
    //     case "===": return KarmaFieldsAlpha.Type.toObject(values[0]) === KarmaFieldsAlpha.Type.toObject(values[1]);
    //     case "!=": return KarmaFieldsAlpha.Type.toObject(values[0]) != KarmaFieldsAlpha.Type.toObject(values[1]);
    //     case "!==": return KarmaFieldsAlpha.Type.toObject(values[0]) !== KarmaFieldsAlpha.Type.toObject(values[1]);
    //     case ">": return KarmaFieldsAlpha.Type.toObject(values[0]) > KarmaFieldsAlpha.Type.toObject(values[1]);
    //     case "<": return KarmaFieldsAlpha.Type.toObject(values[0]) < KarmaFieldsAlpha.Type.toObject(values[1]);
    //     case ">=": return KarmaFieldsAlpha.Type.toObject(values[0]) >= KarmaFieldsAlpha.Type.toObject(values[1]);
    //     case "<=": return KarmaFieldsAlpha.Type.toObject(values[0]) <= KarmaFieldsAlpha.Type.toObject(values[1]);
    //     case "+": return KarmaFieldsAlpha.Type.toNumber(values[0]) + KarmaFieldsAlpha.Type.toNumber(values[1]);
    //     case "-": return KarmaFieldsAlpha.Type.toNumber(values[0]) - KarmaFieldsAlpha.Type.toNumber(values[1]);
    //     case "*": return KarmaFieldsAlpha.Type.toNumber(values[0]) * KarmaFieldsAlpha.Type.toNumber(values[1]);
    //     case "/": return KarmaFieldsAlpha.Type.toNumber(values[0]) / KarmaFieldsAlpha.Type.toNumber(values[1]);
    //     case "%": return KarmaFieldsAlpha.Type.toNumber(values[0]) % KarmaFieldsAlpha.Type.toNumber(values[1]);;
    //     case "&&": return KarmaFieldsAlpha.Type.toObject(values[0]) && KarmaFieldsAlpha.Type.toObject(values[1]);
    //     case "||": return KarmaFieldsAlpha.Type.toObject(values[0]) || KarmaFieldsAlpha.Type.toObject(values[1]);
    //     case "in": return KarmaFieldsAlpha.Type.toArray(values[1]).includes(KarmaFieldsAlpha.Type.toObject(values[0]));
    //     case "!": return !KarmaFieldsAlpha.Type.toBoolean(values[0]);
    //     case "?": return KarmaFieldsAlpha.Type.toBoolean(values[0]) ? values[1] : values[2];
    //     case "concat":
    //     case "...": return [].concat(...values.map(value => KarmaFieldsAlpha.Type.toArray(value)));
    //     case "max": return Math.max(...values.map(value => KarmaFieldsAlpha.Type.toNumber(value)));
    //     case "min": return Math.min(...values.map(value => KarmaFieldsAlpha.Type.toNumber(value)));
    //     case "replace": {
    //       const [string, wildcard, ...replacements] = values.map(value => KarmaFieldsAlpha.Type.toObject(value));
    //       return replacements.reduce((string, replacement) => string.replace(wildcard, replacement), KarmaFieldsAlpha.Type.toString(string));
    //     }
    //     case "date": {
    //       const [date, option, locale] = values.map(value => KarmaFieldsAlpha.Type.toObject(value));
    //       return new Intl.DateTimeFormat(locale || KarmaFieldsAlpha.locale, option).format(new Date(date));
    //     }
    //     case "request": {
    //       return this.parent.request(...values);
    //     }
    //     case "getValue": return this.parent.getValue(...values.map(value => KarmaFieldsAlpha.Type.toString(value))) || KarmaFieldsAlpha.loading;
    //     case "queryValue": {
    //       const driver =  KarmaFieldsAlpha.Type.toString(values[0]);
    //       const id =  KarmaFieldsAlpha.Type.toString(values[1]);
    //       const key =  KarmaFieldsAlpha.Type.toString(values[2]);
    //       return KarmaFieldsAlpha.Query.getValue(driver, id, key) || KarmaFieldsAlpha.loading;
    //     }
    //     case "query": {
    //
    //       return KarmaFieldsAlpha.Query.getResults(...values.map(value => KarmaFieldsAlpha.Type.toObject(value))) || KarmaFieldsAlpha.loading;
    //     }
    //     case "parseParams": {
    //       const params =  {...values[0]};
    //       for (let key in params) {
    //         params[key] = KarmaFieldsAlpha.Type.toString(this.parse(params[key]));
    //       }
    //       return params;
    //     }
    //     case "getOptions": {
    //       const driver =  KarmaFieldsAlpha.Type.toString(values[0]);
    //       const params =  {...KarmaFieldsAlpha.Type.toObject(values[1])};
    //       for (let key in params) {
    //         params[key] = KarmaFieldsAlpha.Type.toString(this.parse(params[key]));
    //       }
    //       return KarmaFieldsAlpha.Query.getOptions(driver, params) || KarmaFieldsAlpha.loading;
    //     }
    //     case "id": return this.parent.getId();
    //     case "modified": return this.modified(...values.map(value => KarmaFieldsAlpha.Type.toString(value)));
    //     case "map": {
    //       let [array, replacement] = values; // ! replacement is already parsed !
    //       replacement = expression[2];
    //       this.loopItem = null;
    //       return KarmaFieldsAlpha.Type.toArray(array).map(value => {
    //         this.loopItem = value;
    //         return this.parse(replacement);
    //       });
    //     }
    //     case "item": return KarmaFieldsAlpha.DeepObject.get(this.loopItem, ...values.map(value => KarmaFieldsAlpha.Type.toString(value)));
    //     case "join": return KarmaFieldsAlpha.Type.toArray(values[0]).join(KarmaFieldsAlpha.Type.toString(values[1]), values[2] || ", ");
    //
    //     case "length":
    //     case "count": return KarmaFieldsAlpha.Type.toArray(values[0]).length;
    //     // case "count": return KarmaFieldsAlpha.Query.getCount(...values.map(value => KarmaFieldsAlpha.Type.toObject(value))) || KarmaFieldsAlpha.loading;
    //
    //     case "key": return this.getKey();
    //     case "index": return this.parent.getIndex();
    //
    //     case "getParam": return KarmaFieldsAlpha.Type.toString(this.parent.request("getParam", ...values));
    //
    //     case "debugger": return values[0];
    //
    //     case "get": { // -> compat
    //       const [type, ...path] = values;
    //       let value = this.parent.getValue(...path.map(value => KarmaFieldsAlpha.Type.toString(value))) || KarmaFieldsAlpha.loading;
    //       if (value !== KarmaFieldsAlpha.loading) {
    //         value = KarmaFieldsAlpha.Type.convert(value, KarmaFieldsAlpha.Type.toString(type));
    //       }
    //       return value;
    //     }
    //
    //   }
    //
    // }
    //
    // return expression;
  }


  getOptions() {

		let options = [];

		if (this.resource.options) {

			options = this.parse(this.resource.options);

      if (!options || options === KarmaFieldsAlpha.loading) {

        return;

      }

		}

    let moreOptions;

		if (this.resource.driver) {

      moreOptions = KarmaFieldsAlpha.Query.getOptions(this.resource.driver, this.resource.params || {});

		} else if (this.resource.table) {

      const grid = this.request("getGrid", this.resource.table);

      if (grid && grid.resource.driver) {

        moreOptions =  KarmaFieldsAlpha.Query.getOptions(grid.resource.driver, grid.resource.params || {});

      }

		}

    if (moreOptions) {

      options = [...options, ...moreOptions];

    }

		return options;

	}





};
