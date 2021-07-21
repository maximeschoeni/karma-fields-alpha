KarmaFieldsAlpha.tables = {};

KarmaFieldsAlpha.fields.table = class extends KarmaFieldsAlpha.fields.form {

  constructor(resource, parent, form) {
    super(resource, parent);

    const field = this;

    // window.karma_table = this; // -> debug
    KarmaFieldsAlpha.tables[resource.driver] = this;

    // compat!
    resource.columns = resource.columns.filter(function(column) {
      if (column.type === "index") {
        resource.index = column;
        return false;
      }
      return true;
    });

    // select
    this.select = new KarmaFieldsAlpha.SelectionManager();
    this.select.events.copy = function() {
      field.copy(this.selection);
			// if (navigator.clipboard && navigator.clipboard.writeText) {
			// 	var rows = [];
      //   const ids = field.ids.getValue();
			// 	for (var j = 0; j < this.selection.height; j++) {
			// 		var cols = [];
      //     const row = field.getDirectChild(ids[j+this.selection.y]);
      //     // console.log(row);
			// 		for (var i = 0; i < this.selection.width; i++) {
      //       const cell = row.children[i+1+this.selection.x];
      //       const value = cell.exportValue();
      //       cols.push(value);
			// 		}
			// 		rows.push(cols.join("\t"));
			// 	}
			// 	if (rows.length) {
			// 		var text = rows.join("\n");
			// 		navigator.clipboard.writeText(text);
			// 	}
			// }
    }
    this.select.events.paste = function() {
      field.paste(this.selection).then(function() {
        // field.try("render");

        // field.try("onSetHeader");
        // field.try("onSetBody");
        // field.try("onSetFooter");
        field.render();
      })


      // const x = this.selection.x;
      // const y = this.selection.y;
      // const ids = field.ids.getValue();
			// navigator.clipboard.readText().then(function(text) {
			// 	if (text) {
			// 		var rows = text.split(/[\r\n]+/).map(function(row) {
			// 			return row.split("\t");
			// 		});
      //     field.triggerEvent("history", true);
			// 		for (var j = 0; j < rows.length; j++) {
      //       const rowField = field.getDirectChild(ids[j+y]);
			// 			for (var i = 0; i < rows[j].length; i++) {
      //         const cellField = rowField.children[i+1+x];
      //         const value = rows[j][i];
      //         cellField.importValue(value);
      //         cellField.triggerEvent("modify");
      //         cellField.triggerEvent("set");
			// 			}
			// 		}
			// 		field.triggerEvent("change", true);
			// 	}
			// });
    }

    field.select.events.select = function() {
      // footer.render();

      // field.try("onSetFooter");
      field.renderFooter();
    };





    // this.pagination = new KarmaFieldsAlpha.fields.tablePagination(resource, this.domain, this);
    // this.pagination.events.change = function() {
    //   return field.query().then(function() {
    //     // field.try("onSetHeader");
    //     field.try("onSetBody");
    //     field.try("onSetFooter");
    //
    //
    //     // field.try("render");
    //   });
    // }

    this.page = new KarmaFieldsAlpha.fields.field({
      type: "numberField",
      key: "page",
      value: 1
    }, this, this);

    this.ppp = new KarmaFieldsAlpha.fields.field({
      type: "numberField",
      key: "ppp",
      value: this.resource.ppp || 50
    }, this, this);

    // this.count = new KarmaFieldsAlpha.fields.field({
    //   type: "numberField",
    //   key: "count",
    //   value: 0
    // }, this, this);

    this.queryString = new KarmaFieldsAlpha.fields.field({
      key: "query"
    }, this, this);



    // this.ordering = new KarmaFieldsAlpha.fields.tableOrdering(resource, this.domain, this);
    // this.ordering.events.change = function() {
    //   field.page.seValue(1);
    //   field.query().then(function() {
    //     // field.try("render");
    //
    //     // field.try("onSetHeader");
    //     field.try("onSetBody");
    //     field.try("onSetFooter");
    //   });
    // }

    this.orderby = this.createChild({
      type: "field",
      key: "orderby",
      value: this.resource.orderby
    });

    this.order = this.createChild({
      type: "field",
      key: "order",
      value: "asc"
    });









    // filters

    this.filters = new KarmaFieldsAlpha.fields.group(resource.filters, this, this);

    this.filters.events.change = async (target, value) => {



      this.page.setValue(1);

      // await this.update();


      // if (this.modified) {
      //   await this.render();
      // }

      await this.render();

      // this.promise = this.promise && this.promise.then(() => {
      //   this.update();
      // }) || this.update();
      //
      // await this.promise;

      // await this.update();


      // await this.enqueue(this.update());
      // if (this.modified) {
      //
      //   // await this.render();
      //   await this.enqueue(this.render());
      //
      // }

    }


    this.filters.events.optionparams = function(origin, optionparamlist) {

      console.error("deprecated event optionparams");
      if (optionparamlist) {

      }
      let params = this.getValue();


      // don't send self value
      if (params[origin.resource.key]) {
        params[origin.resource.key] = undefined;
      }

      return params;

      // return this.getValueAsync().then(function(params) {
      //   // don't send self value
      //   if (params[origin.resource.key]) {
      //     params[origin.resource.key] = undefined;
      //   }
      //   return params;
      // });

    }

    // this.addChild(this.filters);

    // this.filters.events.fetch = function(currentField, params) {
    //
    //   // Object.assign(params, field.filters.getValue());
    //   //
    //   // // don't send value of target field
    //   // if (params[currentField.resource.key]) {
    //   //   params[currentField.resource.key] = undefined;
    //   // }
    //
    //   return field.queryOptions(field.resource.driver, params);
    //
		// };

    // this.filters.getDriver = function() {
    //   return field.resource.driver;
    // }


    // modal
    this.modal = new KarmaFieldsAlpha.fields.field({
      key: "modal"
    }, this, this);

    this.modal.events.change = function() {
      // field.try("render");

      // field.try("onSetHeader");
      // field.try("onSetBody");
      field.try("onSetFooter");


      return Promise.resolve();
    }








    this.content = new KarmaFieldsAlpha.fields.form({
      driver: resource.driver
      // key: "content"
    }, this);

    // this.data.ids = new KarmaFieldsAlpha.fields.field({
    this.content.ids = new KarmaFieldsAlpha.fields.arrayField({
      key: "ids",
    }, this.content, this.content);

    this.content.events.history = function(targetField, state) {
      console.log("Deprecated Event history");
      // console.log("updatehistory", targetField);
      // this.domain.update(targetField.getId(), state);
      // field.domain.index = this.domain.index;
    };

    this.content.events.openmodal = function(modalField) {
      document.activeElement.blur();
      return field.modal.changeValue(modalField.parent.resource.key);

      // field.modal.setValue(modalField.parent.resource.key);
      //
      // field.triggerEvent("render");
    }

    this.content.events.closemodal = function(modalField) {
      // let rowId = field.modal.getValue();
      // field.selectRow(rowId);
      // field.modal.setValue("");
      // field.triggerEvent("render");

      return field.modal.getValueAsync().then(function(rowId) {
        field.selectRow(rowId);
        field.modal.changeValue("");
      });


    }

    this.content.events.optionparams = function(origin) {
      console.error("deprecated event optionparams");
      let params = field.filters.getValue();

      // don't send self value
      // if (params[origin.resource.key]) {
      //   params[origin.resource.key] = undefined;
      // }

      return params;

      // return field.filters.getValueAsync();
    }

    this.content.getRelatedValue = key => {
      return this.filters.getRelatedValue(key);
    }

    // -> for link fields
    this.content.events.nav = params => {

      // targetField.startLoad();
      // return targetField.getValueAsync().then(function(value) {
      //   const wrap = {};
      //   wrap[targetField.resource.key] = value;
      //   return field.updateValue(wrap);
      // }).then(function() {
      //   return field.query()
      // }).then(function() {
      //   targetField.endLoad();
      //   // field.try("render");
      //
      //   field.try("onSetHeader");
      //   field.try("onSetBody");
      //   field.try("onSetFooter");
      // });


      // const wrap = {};
      // wrap[targetField.resource.key] = targetField.getValue();
      // field.setValue(wrap);

      // field.setValue({[targetField.resource.key]: targetField.getValue()});
      //
      // await targetField.load(field.query());
      //
      // field.try("onSetHeader");
      // field.try("onSetBody");
      // field.try("onSetFooter");

      // const paramString = KarmaFieldsAlpha.Form.encodeParams({...this.getValue(), ...params}, "");

      this.setValue(params);
      return this.render();


    };


    this.content.events.change = async function(targetField, value) {
      await field.editAll(targetField, value);
      await field.renderFooter();
    };

    // this.addChild(this.content);


    // this.controls = new KarmaFieldsAlpha.fields.tableControl(field);

    let nav;
    if (location.hash) {
      nav = this.decodeParams(location.hash.slice(1));
    } else if (resource.default) {
      nav = resource.default;
    } else {
      nav = {};
    }
    nav.page = this.page.getValue() || 1;
    nav.ppp = this.ppp.getValue() || 100;
    if (this.resource.orderby) {
      nav.orderby = this.resource.orderby;
    }
    const column = this.resource.orderby && this.resource.columns.find(column => {
      return column.field && column.field.key === this.resource.orderby;
    });
    if (column && column.field.order) {
      nav.order = column.field.order;
    }
    location.hash = this.encodeParams(nav);


    this.nav = KarmaFieldsAlpha.fields.form.getForm("nav");
  }


  // getDefaultOrder() {
  //   const column = this.resource.orderby && this.resource.columns.find(column => {
  //     return column.field && column.field.key === this.resource.orderby;
  //   });
  //   return column && column.field.order || "asc";
  // }

  async enqueue(promise) {

    if (this.promise) {
      this.promise = this.promise.then(() => promise);
    } else {
      this.promise = promise;
    }
    // await this.promise;
    // this.promise = promise;
    // return await this.promise;

    return this.promise;
  }


  // readPath(keys) {
  //   return this.domain.readPath(keys.join("/"));
  // }
  //
  // writePath(keys, rawValue) {
  //   this.domain.writePath(keys.join("/"), rawValue);
  // }

  // fetch(queryString) {
	// 	return KarmaFieldsAlpha.Form.fetch2(this.resource.driver, queryString);
  // }

  async getRemoteValue() {
    return;
  }

  async setRemoteValue() {
  }

  getFormOriginal(keys) {
    return;
  }

	removeFormOriginal(keys) {
  }

  setFormOriginal(value, keys) {
  }

  decodeParams(paramString) {
    return paramString.split("&").reduce((object, item) => {
      const parts = item.split("=");
      if (parts.length === 2) {
        let key = decodeURIComponent(parts[0]);
        let value = decodeURIComponent(parts[1]);
        object[key] = value;
      }
      return object;
    }, {});
  }

  encodeParams(object) {
    return KarmaFieldsAlpha.Form.encodeParams(object, "");
  }

  getDeltaValue(keys) {
		const path = keys.join("/");
    const hash = location.hash.slice(1);
    const nav = this.decodeParams(hash);
    return nav[path];
  }

	removeDeltaValue(keys) {
    this.setDeltaValue(undefined, keys);
  }

  setDeltaValue(value, keys) {
		const path = keys.join("/");
    let hash = location.hash.slice(1);
    let nav = this.decodeParams(hash);
    nav[path] = value;
    hash = this.encodeParams(nav);
    this.nav.writeHistory("nav", hash);
    location.hash = "#"+hash;
  }

	getDeltaPathes() {
		return [];
  }

  hasModifiedValue() {
		return false;
	}

	getModifiedValue() {
	}



  async update() {
    // let paramString = this.getValue();
    // this.modified = paramString !== this.getOriginal(["paramString"]);
    //
    // if (this.modified) {
    //   this.setOriginal(paramString, ["paramString"]);
    //   await this.query();
    // }



    // let paramString = this.getParamString();

    let paramString = location.hash.slice(1);

    // if (paramString !== this.getFormOriginal(["paramString"])) {
    //   this.setFormOriginal(paramString, ["paramString"]);
    if (paramString !== this.paramString) {
      this.paramString = paramString;
      await this.query();
      this.modified = true;
    } else {
      this.modified = false;
    }
  }

  async render() {
    //
  }

  async renderFooter() {
    //
  }

  getValue() {
    // const params = {
    //   page: this.page.getValue(),
    //   ppp: this.ppp.getValue() || 1000,
    //   order: this.order.getValue(),
    //   orderby: this.orderby.getValue(),
    //   ...this.filters.getValue()
    // };
    // return params;

    const hash = location.hash.slice(1);
    return this.decodeParams(hash);
  }

  // async getValueAsync() {
	// 	return {
  //     ...this.getValue(),
  //     ...await this.filters.getValueAsync()
  //   }
	// }



  setValue(params) {
    // for (let key in params) {
    //   this.setDeltaValue(params[key], [key]);
    // }
    // paramString.split("&").forEach((item) => {
    //   const parts = item.split("=");
    //   let key, value;
    //   if (parts.length === 2) {
    //     key = decodeURIComponent(parts[0]);
    //     value = decodeURIComponent(parts[1]);
    //   }
    //   if (key && value) {
    //     this.setDeltaValue(value, [key]);
    //   }
    // });


    let hash = encodeParams(params);
    this.writeHistory("nav", hash);
    location.hash = "#"+hash;
  }

  // getParamString() {
  //   const params = this.getValue();
  //   return KarmaFieldsAlpha.Form.encodeParams(params);
  // }

  // async getParamStringAsync() {
  //   const params = await this.getValueAsync();
  //   return KarmaFieldsAlpha.Form.encodeParams(params);
  // }

  // setParamString(paramString) {
  //   paramString.split("&").forEach((item) => {
  //     const parts = item.split("=");
  //     let key, value;
  //     if (parts.length === 2) {
  //       key = decodeURIComponent(parts[0]);
  //       value = decodeURIComponent(parts[1]);
  //     }
  //     this.setDeltaValue(value, [key]);
  //   });
  // }

  // getValueAsync() {
	// 	const field = this;
	// 	return Promise.all([
  //     this.ordering.orderby,
  //     this.ordering.order,
  //     this.pagination.page,
  //     this.pagination.ppp,
  //     this.filters
  //   ].map(function(child) {
	// 		return child.getValueAsync();
	// 	})).then(function(values) {
	// 		return values.reduce(function(acc, value, index) {
	// 			const child = field.children[index];
	// 			if (child.resource.key) {
	// 				acc[child.resource.key] = value;
	// 			} else {
	// 				Object.assign(acc, value);
	// 			}
  //       return acc;
	// 		}, {});
	// 	});
	// }

  async query() {
    // const field = this;
    // let params = await this.getValue();
    //
    //
    // if (!params.ppp) {
    //   console.error("no ppp");
    //   return false;
    // }
    // const paramString = KarmaFieldsAlpha.Form.encodeParams(params);
    //
    // if (paramString === this.lastParamString) {
    //   return false;
    // }
    // this.lastParamString = paramString;

    // if (this.modified) {

      // let paramString = this.getParamString();
      // let paramString = this.getFormOriginal(["paramString"])

      // console.log(paramString);

      // await this.queryResults;
      //
      // this.queryResults = this.content.getRemoteTable(paramString, this.resource.driver);
      //
      // const results = await this.queryResults;

      const nav = this.decodeParams(this.paramString);
      if (!nav.page) nav.page = 1;
      if (!nav.ppp) nav.ppp = 100;
      let paramString = this.encodeParams(nav);


      const results = await this.content.getRemoteTable(paramString, this.resource.driver);

      if (results.items.length && results.items.some(item => !item.id || typeof item.id !== "string")) {
        console.log(results.items);
        console.error("Invalid item.id");
      }

      // this.count.setValue(results.count);
      this.count = results.count;

      // const ids = results.items.map(function(item) {
      //   return item.id;
      // });
      //
      // this.ids.setValue(ids);


      this.queriedIds = results.items.map(item => item.id);

      results.items.forEach(item => {
        const row = this.content.getChild(item.id) || this.content.createChild({
          type: "tableRow",
          key: item.id
        });
        row.create(this.resource.columns || []);
        // row.setValue(item, "set");

        row.initValue(item);
      });

      return results;
    // }


  };

  async sync() {
    // KarmaFieldsAlpha.Form.cache = {};
    // const results = await this.content.bubble("submit");

    // this.queriedIds = this.getCurrentIds(); // extra ids are to be deleted -> merge to queriedIds

    const results = await this.content.save();

    if (results === false) {
      return this.query();
    } else if (results && typeof results === "object") {

      // when item id is edited
      // for (let key in results) {
      //   const item = results[key];
      //   if (item.id) {
      //     if (key !== item.id) {
      //       this.ids.replace(key, item.id);
      //     }
      //   }
      // }

    }
    return results;
  };

  // add(num) {
  //   const field = this;
  //   return KarmaFieldsAlpha.Form.add(this.resource.driver, {num: num || 1}).then(function(results) {
  //
  //     if (results.length) {
  //       const item = results.shift();
  //       let id = (item.id || item).toString();
  //
  //       let row = field.content.createChild({
  //         type: "tableRow",
  //         value: 1,
  //         key: id
  //       });
  //
  //
  //       row.create(field.resource.columns);
  //       row.fill(field.resource.columns);
  //       row.trash.initValue(1);
  //       row.trash.backup();
  //       return row.trash.saveValue(0, false, true).then(function() {
  //         return field.ids.add(id);
  //       }).then(function() {
  //         return id;
  //       });
  //     }
  //
  //   });
  // }

  async add(num, noBackup) {
    const results = await KarmaFieldsAlpha.Form.add(this.resource.driver, {num: num || 1})



    // const ids = results.map(item => (item.id || item).toString());
    // const rows = await Promise.all(ids.map(async id => {
    //   let row = this.content.createChild({
    //     type: "tableRow",
    //     key: id
    //   });
    //   row.create(this.resource.columns);
    //   await row.fill(this.resource.columns);
    //   // row.trash.initValue(1);
    //
    //   row.trash.initValue("1");
    //   row.trash.setValue("1");
    //   return row;
    // }));
    //
    // if (!noBackup) {
    //   this.content.backup(["add"]);
    //   // this.backup(["add"]);
    // }

    const ids = results.map(item => (item.id || item).toString());
    const rows = ids.map(id => {
      let row = this.content.createChild({
        type: "tableRow",
        key: id
      });
      row.create(this.resource.columns);
      // row.trash.initValue(1);
      row.trash.initValue("1");
      row.trash.setValue("1");
      return row;
    });

    if (!noBackup) {
      this.content.backup(["add"]);
      // this.backup(["add"]);
    }

    await Promise.all(rows.map(row => {
      return row.fill(this.resource.columns); // -> also set trash to "0"
    }));


    this.queriedIds = ids.concat(this.queriedIds);
    //this.content.ids.add(ids);

    // for (let i = 0; i < rows.length; i++) {
    //   await rows[i].trash.saveValue(0, false, true);
    // }

    // await Promise.all(rows.map(function(row) {
    //   // return row.trash.saveValue(0, false, true);
    //   return row.trash.setValue(0);
    // }));

    // rows.forEach(row => {
    //   return row.trash.setValue("0");
    // });

  }

  // add(num) {
  //   const field = this;
  //   return KarmaFieldsAlpha.Form.add(this.resource.driver, {num: num || 1}).then(function(results) {
  //
  //     const ids = results.map(function(item) {
  //       let id = (item.id || item).toString();
  //
  //       let row = field.content.createChild({
  //         type: "tableRow",
  //         value: 1,
  //         key: id
  //       });
  //
  //       row.create(field.resource.columns);
  //       row.fill(field.resource.columns);
  //       row.trash.initValue(1);
  //
  //       return row.trash.saveValue(0, false, true)
  //
  //       return id;
  //     });
  //
  //     field.getChild(ids[0]).trash.backup();
  //
  //     // rows[0].trash.backup();
  //
  //     field.ids.add(ids).then(function() {
  //       Promise.all();
  //     });
  //
  //     return row.trash.saveValue(0, false, true).then(function() {
  //       return field.ids.add(id);
  //     }).then(function() {
  //       return id;
  //     });
  //
  //
  //   });
  // }

  // async remove() {
  //   const field = this;
  //
  //   if (field.select.selection && field.select.selection.width === field.select.grid.width) {
  //
  //     // let ids = field.ids.getValue().slice(field.select.selection.y, field.select.selection.y+field.select.selection.height);
  //     // if (ids.length) {
  //     //   field.content.getDirectChild(ids[0]).trash.triggerEvent("history", true);
  //     //   ids.forEach(function(id) {
  //     //     field.ids.remove(id, "noop");
  //     //     field.content.getDirectChild(id).trash.setValue(1, "noop");
  //     //   });
  //     //   this.triggerEvent("change", true);
  //     // }
  //     return field.ids.getValueAsync().then(function(ids) {
  //       ids = ids.slice(field.select.selection.y, field.select.selection.y+field.select.selection.height);
  //       if (ids.length) {
  //         field.content.getChild(ids[0]).trash.backup();
  //         return field.ids.remove(ids).then(function() {
  //           return Promise.all(ids.map(function(id) {
  //             return field.content.getChild(id).trash.saveValue(1, false, true);
  //           }));
  //         });
  //
  //         // return Promise.all(ids.map(function(id) {
  //         //   return field.ids.remove(id).then(function() {
  //         //     return field.content.getChild(id).trash.saveValue(1, false, true);
  //         //   });
  //         // })).then(function() {
  //         //   // return field.content.bubble("change");
  //         // });
  //       }
  //     });
  //   }
  // }

  async remove() {
    if (this.select.selection && this.select.selection.width === this.select.grid.width) {
      let ids = this.getCurrentIds();

      ids = ids.slice(this.select.selection.y, this.select.selection.y+this.select.selection.height);
      if (ids.length) {
        const rows = ids.map(id => this.content.getChild(id));
        rows.forEach(row => {
          row.trash.setValue("0");
        });

        this.content.backup(["remove"]);
        // this.content.ids.remove(ids);

        rows.forEach(row => {
          row.children.forEach(cellField => {
            cellField.removeDeltaValue();
          });
          row.trash.setValue("1");
        });

        // ids.forEach(id => {
        //   const child = this.content.getChild(id);
        //   child.children.forEach(cellField => {
        //     cellField.removeDeltaValue();
        //   });
        //   child.trash.setValue("1");
        // });
      }
    }
  }

  getModal(rowId) {
    let row = rowId && this.content.getChild(rowId);
    let modal = row && row.children.find(function(child) {
      return child instanceof KarmaFieldsAlpha.fields.modal;
    });
    if (modal) {
      return modal;
    }
  }

  getCurrentModal() {
    // let rowId = this.modal.getValue();
    // return rowId && this.getModal(rowId);
    const rowId = this.modal.getValue();
    return rowId && this.getModal(rowId);
  }

  selectRow(rowId) {
    // let ids = this.ids.getValue();
    // let index = ids.indexOf(rowId);
    // if (index > -1) {
    //   this.select.setFocus({x:0, y:index});
    // }
    // const ids = this.ids.getValue();
    const ids = this.getCurrentIds();
    let index = ids.indexOf(rowId);
    if (index > -1) {
      this.select.setFocus({x:0, y:index});
    }

  }

  copy(selection) {
    const field = this;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      let ids = this.getCurrentIds();

      // return this.ids.getValueAsync().then(function(ids) {
        var rows = [];
        for (var j = 0; j < selection.height; j++) {
          var cols = [];
          const row = field.content.getChild(ids[j+selection.y]);
          for (var i = 0; i < selection.width; i++) {
            console.log(ids[j+selection.y], i+1+selection.x);
            const cell = row.children[i+1+selection.x];
            const valuePromise = cell.exportValue();
            cols.push(valuePromise);
          }
          rows.push(cols);
        }

        if (rows.length) {
          return Promise.all(rows.map(function(cols) {
            return Promise.all(cols).then(function(cols) {
              return cols.join("\t");
            });
          })).then(function(rows) {
            return rows.join("\n");
          }).then(function(text) {
            console.log(text);
            navigator.clipboard.writeText(text);
          });
        }
      // });
    }
  }

  // paste(selection) {
  //
  //   const field = this;
  //   const x = selection.x;
  //   const y = selection.y;
  //   const ppp = this.page.ppp.getValue();
  //   const ids = this.ids.getValue();
  //   navigator.clipboard.readText().then(function(text) {
  //     if (text) {
  //       var rows = text.split(/[\r\n]+/).map(function(row) {
  //         return row.split("\t");
  //       });
  //       // -> should create rows if rows.length + y > ids.length
  //
  //       console.log(x, ppp);
  //
  //
  //       field.backup();
  //       const promises = [];
  //       for (var j = 0; j < rows.length; j++) {
  //         const rowField = field.content.getChild(ids[j+y]);
  //         for (var i = 0; i < rows[j].length; i++) {
  //           const cellField = rowField.children[i+1+x];
  //           const value = rows[j][i];
  //           const promise = cellField.importValue(value);
  //           promises.push(promise);
  //         }
  //       }
  //       return Promise.all(promises).then(function() {
  //         return field.content.bubble("change");
  //       });
  //     }
  //   });
  // }

  async paste(selection) {

    const field = this;
    const x = selection.x;
    const y = selection.y;
    const ppp = await this.ppp.getValueAsync();
    // let ids = await this.ids.getValueAsync();
    let ids = this.getCurrentIds();
    const text = await navigator.clipboard.readText();

    if (text) {
      let rows = text.split(/[\r\n]+/).map(function(row) {
        return row.split("\t");
      });
      // rows = rows.slice(0, ppp-y);

      field.content.backup(["paste"]);

      if (rows.length > ids.length-y) {
        await this.add(rows.length-(ids.length-y), false);
        // ids = this.ids.getValue();
        ids = this.getCurrentIds();
      }

      const promises = [];
      for (let j = 0; j < rows.length; j++) {
        const rowField = field.content.getChild(ids[j+y]);
        for (let i = 0; i < rows[j].length; i++) {
          const cellField = rowField.children[i+1+x];
          const value = rows[j][i];
          const promise = cellField.importValue(value);
          promises.push(promise);
        }
      }
      await Promise.all(promises);
      await field.content.bubble("change");
    }
  }

  async editAll(field, value) {
    // console.log(conductor, value);
    if (field && this.select && this.select.selection && this.select.focusRect && this.select.selection.height > 1) {
      const selection = this.select.selection;
      const focusRect = this.select.focusRect;
      const x = selection.x;
      const y = selection.y;
      // const ids = this.ids.getValue();
      let ids = this.getCurrentIds();
      // return this.ids.getValueAsync().then(function(ids) {
        // return conductor.getValueAsync().then(function(value) {
          field.backup();
          const promises = [];
          for (var j = 0; j < selection.height; j++) {
            const rowField = this.content.getChild(ids[j+y]);
            const cellField = rowField.children[focusRect.x+1];
            if (cellField !== field) {
              const promise = cellField.importValue(value);
              promises.push(promise);
            }
          }
          await Promise.all(promises);

          await this.render();
        // });
      // });
    }
  }

  getIds() {
    // return this.content.ids.getValue().concat(this.content.children.map(child => child.resource.id));
    return this.queriedIds;
  }
  getCurrentIds() {
    // return this.content.ids.getValue().concat(this.queriedIds || []);
    return this.queriedIds;
  }
  getCount() {
    return this.queriedIds.length;
  }


  hasIndex() {
    return this.resource.index || this.resource.index === undefined;
  }

  getIndexTitle() {
    return this.resource.index && this.resource.index.title || "#";
  }

  getIndexWidth() {
    return this.resource.index && this.resource.index.width || "auto";
  }

  getColumns() {
    return this.resource.columns || [];
  }

  hasHeader() {
    return true;
  }

  buildHeaderCell(column) {
    return {
      class: "th karma-field",
      update: th => {
        th.children = [
          {
            tag: "a",
            class: "header-cell-title",
            init: a => {
              a.element.textContent = column.title;
            }
          }
        ];
        if (column.sortable) {
          const orderBtn = new KarmaFieldsAlpha.fields.tableControls.order();
          th.children.push(orderBtn.build(column, this));
        }
      }
    };
  }

  buildIndexCell(rowIndex) {
    return {
      class: "th table-row-index karma-field",
      update: th => {
        let page = this.page.getValue();
        let ppp = this.ppp.getValue();
        th.element.textContent = (page - 1)*ppp + rowIndex + 1;
      }
    };
  }

  buildGrid() {
    return {
      class: "table grid",
      update: async grid => {

        // await 0; // -> delay rendering in order to registerTable after rendering

        grid.children = [];

        // table header index cell
        if (this.hasIndex() && this.hasHeader()) {
          grid.children.push({
            class: "th table-header-index karma-field",
            init: th => {
              th.element.textContent = this.getIndexTitle();
            }
          });
        }

        // table header cells
        if (this.hasHeader()) {
          this.getColumns().forEach((column, colIndex) => {
            grid.children.push(this.buildHeaderCell(column));
          });
        }

        // table body cells

        // this.content.children.forEach((rowField, rowIndex) => {
        //   if (this.hasIndex()) {
        //     grid.children.push(this.buildIndexCell(rowIndex));
        //   }
        //   this.getColumns().forEach((column, colIndex) => {
        //     grid.children.push(rowField.getChild(column.field.key).build());
        //   });
        // });

        // const ids = this.ids.getValue();
        // const ids = this.getCurrentIds();


        const rows = this.queriedIds.map(id => this.content.getChild(id) || this.content.createChild({
          type: "tableRow",
          key: id
        })).filter(row => row.trash.getValue() !== "1").forEach((rowField, rowIndex) => {
          if (this.hasIndex()) {
            grid.children.push(this.buildIndexCell(rowIndex));
          }

        // ids.forEach((id, rowIndex) => {
        //   if (this.hasIndex()) {
        //     grid.children.push(this.buildIndexCell(rowIndex));
        //   }
        //   // const rowField = this.content.getChild(id);
        //   const rowField = this.content.getChild(id) || this.content.createChild({
        //     type: "tableRow",
        //     key: id
        //   });

          this.getColumns().forEach((column, colIndex) => {
            const cellField = rowField.getChild(column.field.key) || rowField.createChild(column.field);
            // cellField.render = grid.render;
            grid.children.push(cellField.build());
          });
        });

        grid.element.style.gridTemplateColumns = (this.hasIndex() && this.hasHeader() && [this.getIndexWidth()] || []).concat(this.getColumns().map((column) => {
          return column.width || "1fr";
        })).join(" ");

      },
      complete: grid => {
        this.select.registerTable(grid.element, this.getColumns().length, this.content.children.length, this.hasIndex(), this.hasHeader());
      }
    };

  }

  buildModalNav() {
    const field = this;
    return {
      class: "footer-group table-modal-nav",
      clear: true,
      update: function() {
        this.children = [
          {
            tag: "button",
            class: "karma-button footer-item",
            init: function(button) {
              this.element.innerText = "<";
            },
            update: function(button) {
              this.element.onclick = function() {
                // const rowId = field.modal.getValue();
                // const next = field.ids.getPrev(rowId);
                // if (next) {
                //   field.modal.setValue(next);
                //   field.triggerEvent("render");
                // }
                const id = field.modal.getValue();
                const prevId = field.ids.getPrev(id);
                field.modal.setValue(prevId);
                field.try("onSetModal");
              }
                // const currentRowId = field.modal.getValue();
              // this.element.disabled = field.ids.getPrev(currentRowId) ? false : true;
              const currentRowId = field.modal.getValue();
              const prevId = field.ids.getPrev(currentRowId);
              button.element.disabled = prevId ? false : true;
            }
          },
          {
            tag: "button",
            class: "karma-button footer-item",
            init: function(button) {
              this.element.innerText = ">";
            },
            update: function(button) {
              this.element.onclick = function() {
                // const rowId = field.modal.getValue();
                // const next = field.ids.getNext(rowId);
                //
                // if (next) {
                //   field.modal.setValue(next);
                //   field.triggerEvent("render");
                // }
                // field.modal.getValueAsync().then(function(id) {
                //   return field.ids.getNext(id);
                // }).then(function(id) {
                //   field.modal.write(id);
                //   field.triggerEvent("render");
                // });
                const id = field.modal.getValue();
                const nextId = field.ids.getNext(id);
                field.modal.setValue(nextId);
                field.try("onSetModal");
              };
              // const currentRowId = field.modal.getValue();
              // this.element.disabled = field.ids.getNext(currentRowId) ? false : true;

              // field.modal.getValueAsync().then(function(currentRowId) {
              //   return field.ids.getNext(currentRowId);
              // }).then(function(id) {
              //   button.element.disabled = id ? false : true;
              // });
              const currentRowId = field.modal.getValue();
              const nextId = field.ids.getNext(currentRowId);
              button.element.disabled = nextId ? false : true;
            }
          }
        ];
      }
    };
  }


  buildFooterBar() {
    return {
      class: "footer-bar",
      children: [
        {
          class: "footer-group table-info",
          update: group => {
            let buttons = this.resource.controls || [
              {
                type: "save",
                name: "Save",
                primary: true
              },
              {
                type: "undo",
                name: "Undo"
              },
              {
                type: "redo",
                name: "Redo"
              },
              {
                type: "add",
                name: "Add"
              },
              {
                type: "delete",
                name: "Delete"
              }
            ];
            group.children = buttons.map(resource => {
              if (KarmaFieldsAlpha.fields.tableControls[resource.type]) {
                const button = new KarmaFieldsAlpha.fields.tableControls[resource.type](resource);
                return button.build(this);
              }
            });
          }
        },
        {
          class: "footer-group table-pagination",
          update: group => {
            let buttons = [
              {
                type: "ppp"
              },
              {
                type: "firstPage",
                name: "«"
              },
              {
                type: "prevPage",
                name: "‹"
              },
              {
                type: "currentPage",
              },
              {
                type: "nextPage",
                name: "›"
              },
              {
                type: "lastPage",
                name: "»"
              }
            ];
            group.children = buttons.map(resource => {
              if (KarmaFieldsAlpha.fields.tableControls[resource.type]) {
                const button = new KarmaFieldsAlpha.fields.tableControls[resource.type](resource);
                return button.build(this);
              }
            });
          }
        }
        // this.buildModalNav()
      ]
    };
  }

  build() {

    return {
      class: "karma-field-table",
      init: container => {

        // DEPRECATED for modals + filters + order + pagination
        // this.render = () => {
        //   console.error("deprecated field.render!");
        // };




        this.render = container.render;

        // -> first load table
        // this.query().then(results => {
        //   this.try("onSetHeader");
        //   this.try("onSetModal");
        //   this.try("onSetBody");
        //   this.try("onSetFooter");
        // });
      },
      update: async container => {



        await this.update();

        if (this.modified) {
          container.children = [
            {
              class: "table-header",
              update: (header) => {
                // this.onSetHeader = () => {
                  header.children = [
                    {
                      tag: "h1",
                      init: h1 => {
                        h1.element.textContent = this.resource.title || "";
                      }
                    },
                    this.filters.build()
                  ];
                  // header.render();
                // }
              }
            },

            // modal
            {
              class: "modal-container",
              update: modalContainer => {
                // this.onSetModal = () => {
                //   const modal = this.getCurrentModal();
                //   if (modal) {
                //     modalContainer.children = [
                //       modal.buildModal()
                //     ];
                //     document.body.style.overflow = "hidden";
                //   } else {
                //     modalContainer.children = [];
                //     document.body.style.overflow = "visible";
                //   }
                //   modalContainer.render();
                // }

              }
            },

            // table body
            {
              class: "table-body",
              update: async body => {
                // this.onSetBody = async () => {
                //   body.child = await this.buildGrid();
                //
                //   await body.render();
                // }

                this.content.render = body.render;

                body.child = this.buildGrid();
              },
              complete: () => {
                this.renderFooter();
              }
            },

            // table footer
            {
              class: "table-footer",
              update: footer => {
                this.renderFooter = footer.render;

                const modal = this.modal.getValue();
                footer.element.classList.toggle("modal-open", modal || false);

                // this.onSetFooter = () => {
                //   footer.child = this.buildFooterBar();
                //   footer.render();
                // }
                footer.child = this.buildFooterBar();
              }
            }
          ];
        }



      }

    };
  }

}
