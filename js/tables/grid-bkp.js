
KarmaFieldsAlpha.field.grid = class extends KarmaFieldsAlpha.field {

  getDriver() {

    if (!this.resource.driver) {

      console.error("Driver not set");

    }

    return this.resource.driver;

  }

  getContent(...path) {

    const driver = this.getDriver();

    return KarmaFieldsAlpha.Query.getValue(driver, ...path);

    // const content = new KarmaFieldsAlpha.Content(value);
    //
    // content.loading = value === undefined;
    // content.modified = KarmaFieldsAlpha.Store.modified();
    //
    // return content;

  }

  // getValue(...path) {
  //
  //   const driver = this.getDriver();
  //
  //   return KarmaFieldsAlpha.Query.getValue(driver, ...path);
  //
  // }

  async setContent(content, ...path) {

    const driver = this.getDriver();

    // if (content.needRecord) {
    //
    //   await KarmaFieldsAlpha.History.save();
    //
    // }

    await KarmaFieldsAlpha.Store.State.set(content.toArray(), "delta", driver, ...path);

    // if (content.needRender) {
    //
    //   await this.request("render");
    //
    // }

  }

  // setValue(value, ...path) {
  //
  //   const driver = this.getDriver();
  //
  //   value = KarmaFieldsAlpha.Type.toArray(value);
  //
  //
  //
  //   // KarmaFieldsAlpha.Store.setValue(value, driver, ...path)
  //   this.request("updateState", value, "delta", ...path);
  //
  //   // this.render();
  //
  // }

  // getAlias(id, alias) {
  //
  //   console.error("deprecated");
  //
  //   return this.getAliasedValue(id, key);
  //
  // }
  //
  // getAliasedValue(id, alias) {
  //
  //   console.error("deprecated");
  //
  //   const driver = this.getDriver();
  //   const key = KarmaFieldsAlpha.Query.getAlias(driver, alias);
  //
  //   return this.getValue(id, key);
  //
  // }
  //
  // getName(id) {
  //
  //   console.error("deprecated");
  //
  //   const driver = this.getDriver();
  //   const key = KarmaFieldsAlpha.Query.getAlias(driver, "name");
  //
  //   const value = this.getValue(id, key);
  //
  //   if (!value || value === KarmaFieldsAlpha.loading) {
  //
  //     return KarmaFieldsAlpha.loading;
  //
  //   }
  //
  //   return value[0] || "";
  // }
  //
  // getParent(id) {
  //
  //   console.error("deprecated");
  //
  //   const driver = this.getDriver();
  //   const key = KarmaFieldsAlpha.Query.getAlias(driver, "parent");
  //
  //   const value = this.getValue(id, key);
  //
  //   if (!value || value === KarmaFieldsAlpha.loading) {
  //
  //     return KarmaFieldsAlpha.loading;
  //
  //   }
  //
  //   return value[0] || "0";
  //
  // }
  //
  // getPosition(id) {
  //
  //   console.error("deprecated");
  //
  //   const driver = this.getDriver();
  //   const key = KarmaFieldsAlpha.Query.getAlias(driver, "position");
  //
  //   const value = this.getValue(id, key);
  //
  //   if (!value || value === KarmaFieldsAlpha.loading) {
  //
  //     return KarmaFieldsAlpha.loading;
  //
  //   }
  //
  //   return parseInt(value[0] || 0);
  //
  // }
  //
  //
  //
  //
  // setAlias(value, id, alias) {
  //
  //   console.error("deprecated");
  //
  //   const driver = this.getDriver();
  //   const key = KarmaFieldsAlpha.Query.getAlias(driver, alias);
  //
  //   this.setValue(value, id, key);
  //
  // }
  //
  // initAlias(value, id, alias) {
  //
  //   console.error("deprecated");
  //
  //   const driver = this.getDriver();
  //   const key = KarmaFieldsAlpha.Query.getAlias(driver, alias);
  //
  //   KarmaFieldsAlpha.Query.initValue(driver, value, id, key)
  //
  //   // const current = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.Query.vars, driver, id, key);
  //   //
  //   // if (current === undefined) {
  //   //
  //   //   value = KarmaFieldsAlpha.Type.toArray(value);
  //   //
  //   //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.Query.vars, value, driver, id, key);
  //   //
  //   // }
  //
  // }

  initValue(value, id, key) {

    console.error("deprecated");

    const driver = this.getDriver();

    KarmaFieldsAlpha.Query.initValue(driver, value, id, key)

  }

  modified(...path) {
    console.error("deprecated");

    const state = this.getState("delta");

    if (state) {

      const delta = KarmaFieldsAlpha.DeepObject.get(state, "delta", ...path);

      if (delta !== undefined) {

        const value = KarmaFieldsAlpha.Query.getValue(...path);

        return KarmaFieldsAlpha.DeepObject.differ(value, delta);

      }

    }

    return false;
  }

  // modified(...path) {
  //
  //   return !KarmaFieldsAlpha.DeepObject.include(KarmaFieldsAlpha.Query.vars, KarmaFieldsAlpha.Store.get("delta", this.resource.driver, ...path), this.resource.driver, ...path);
  //
  // }

  getParams() {

    return KarmaFieldsAlpha.Store.Layer.getCurrent("params");

    // return {
    //   page: 1,
    //   ppp: 100,
    //   ...this.resource.params,
    //   ...params
    // };

  }

  getParam(key) {

    return KarmaFieldsAlpha.Store.Layer.getParam(key);

  }

  setParam(value, key) {

    // this.request("updateCurrentLayer", value, "params", key);
    // KarmaFieldsAlpha.Store.updateCurrentLayer(value, "params", key);
    KarmaFieldsAlpha.Store.Layer.setParam(value, key);

    this.request("render");



  }

  // getCountParams() {
  //   console.error("deprecated!");
  //   const params = this.getParams();
  //
  //   if (params) {
  //
  //     const {page, ppp, orderby, order, ...countParams} = params;
  //
  //     return countParams;
  //
  //   }
  //
  // }

  getCount() {

    const driver = this.getDriver();

    const params = this.getParams();

    if (params) {

      return KarmaFieldsAlpha.Query.getCount(driver, params);

    }

  }

  getPpp() {

    const ppp = this.getParam("ppp");

    return Number(ppp || 100);
  }

  // getColumns() {
  //   console.error("deprecated");
  //   return this.resource.children.map((column, index) => index.toString()) || [];
  // }

  getOrder() {

    return this.getParam("order");

  }

  getOrderby() {

    return this.getParam("orderby");

  }

  toggleOrder(key, order) {

    let orderby = this.getOrderby();

    if (orderby === key) {

      order = (this.getOrder() || order || "asc") === "asc" ? "desc" : "asc";
      this.setParam(order, "order");
      this.render();

    } else {

      // KarmaFieldsAlpha.Nav.change(order || "asc", undefined, "order");
      // KarmaFieldsAlpha.Nav.change(key, undefined, "orderby");

      this.setParam(order || "asc", "order");
      this.setParam(key, "orderby");
      this.render();

    }

  }


  getIds() {

    const params = this.getParams();
    const driver = this.getDriver();

    return KarmaFieldsAlpha.Query.getIds(driver, params);

    // const results = KarmaFieldsAlpha.Query.getIds(driver, params);
    //
    // const content = new KarmaFieldsAlpha.Content(results);
    //
    // if (results === undefined) {
    //
    //   content.loading = true;
    //
    // }
    //
    // return content;


  }


  getItems() {

    let items = KarmaFieldsAlpha.Store.Layer.get("items") || [];

    if (!items) {

      const ids = this.getIds();

      if (!ids.loading) {

        items = ids.toArray().map(id => ({id}));

        KarmaFieldsAlpha.Store.Layer.set(items, "items");

      }

    }

    return items;
  }


  exportIds(ids) { // used for export button

    const gridContent = new KarmaFieldsAlpha.Content.Grid();

    const columns = this.getExportColumns();

    for (let i = 0; i < ids.length; i++) {

      const id = ids[i];

      const rowField = this.createChild({
        type: "row",
        index: i,
        id: id,
        children: columns
      }, i);

      const collection = rowField.export();

      gridContent.add(collection);

    }
    //
    //
    // const mode = this.resource.export || this.resource.import;
    //
    // if (mode === "modal") {
    //
    //   if (this.resource.modal) {
    //
    //     for (let i = 0; i < ids.length; i++) {
    //
    //       const id = ids[i];
    //
    //       const rowField = this.createChild({
    //         type: "row",
    //         index: i,
    //         id: id,
    //         children: this.resource.modal.children || []
    //       }, i);
    //
    //       const collection = rowField.export();
    //
    //       gridContent.add(collection);
    //
    //     }
    //
    //   }
    //
    // } else if (mode && Array.isArray(mode)) {
    //
    //   for (let i = 0; i < ids.length; i++) {
    //
    //     const rowField = this.createChild({
    //       type: "row",
    //       id: ids[i],
    //       children: mode
    //     }, i);
    //
    //     const collection = rowField.export();
    //
    //     gridContent.add(collection);
    //
    //   }
    //
    // } else {
    //
    //   const columns = this.resource.children;
    //
    //   for (let i = 0; i < ids.length; i++) {
    //
    //     const rowField = this.createChild({
    //       type: "row",
    //       index: i,
    //       id: ids[i],
    //       children: columns
    //     }, i);
    //
    //     const collection = rowField.export();
    //
    //     gridContent.add(collection);
    //
    //   }
    //
    // }

    return gridContent;

  }

  // exportRows(index = 0, length = 999999) {
  //
  //   const items = this.getItems();
  //
  //   const ids = items.slice(index, index + length).map(item => item.id);
  //
  //   return this.exportData(ids);
  //
  // }

  getExportColumns() {

    const mode = this.resource.import || this.resource.export;

    let columns;

    if (mode === "modal" && this.resource.modal && this.resource.modal.children) {

      return this.resource.modal.children;

    } else if (mode && Array.isArray(mode)) {

      return mode;

    } else {

      return this.resource.children;

    }

  }


  export(index = 0, length = 999999) {


    return this.exportIds();


    // // const ids = this.getIds();
    // const items = this.getItems();
    // const grid = new KarmaFieldsAlpha.Grid();
    //
    // const mode = this.resource.export || this.resource.import;
    //
    // if (mode === "modal") {
    //
    //
    //   for (let i = 0; i < Math.min(items.length - index, length); i++) {
    //
    //     const item = items[i + index] || {loading: true};
    //
    //     const rowField = this.createChild({
    //       type: "row",
    //       index: i + index,
    //       id: item.id,
    //       loading: item.loading,
    //       // item: ...items[i + index], // ?
    //       children: this.resource.modal.children || []
    //     });
    //
    //     const rowItems = rowField.export();
    //
    //     // console.log(rowItems);
    //
    //     grid.addRow(rowItems);
    //
    //
    //   }
    //
    // } else if (mode && Array.isArray(mode)) {
    //
    //   for (let i = 0; i < Math.min(items.length - index, length); i++) {
    //
    //     const item = items[i + index];
    //
    //     if (item && item.id) {
    //
    //       // const rowItems = this.resource.export.map(key => {
    //       //
    //       //   this.getValue(item.id, key)
    //       // });
    //
    //       const values = [];
    //
    //       const rowField = this.createChild({
    //         type: "row",
    //         id: item.id
    //       });
    //
    //       for (let resource of mode) {
    //
    //         if (typeof resource === "string") {
    //
    //           resource = {key: resource};
    //
    //         }
    //
    //         const child = rowField.createChild({
    //           type: "input",
    //           ...resource
    //         });
    //
    //         child.export(values);
    //
    //       }
    //
    //       grid.addRow(values);
    //
    //     }
    //
    //   }
    //
    // } else {
    //
    //   // const columns = this.resource.children.slice(colIndex, colIndex + colLength);
    //   const columns = this.resource.children;
    //
    //   for (let i = 0; i < Math.min(items.length - index, length); i++) {
    //
    //     const item = items[i + index] || {loading: true};
    //
    //     const rowField = this.createChild({
    //       type: "row",
    //       index: i + index,
    //       id: item.id,
    //       loading: item.loading,
    //       // item: items[i + index],
    //       children: columns
    //     });
    //
    //     const rowItems = rowField.export();
    //
    //     grid.addRow(rowItems);
    //
    //   }
    //
    // }
    //
    // dataRow.push(grid.toString());
    //
    // return dataRow;

  }


  importIds(grid, ids) {

    // const string = dataRow.shift();
    //
    // const current = this.export(index, length);

    if (grid.value.length === ids.length) {

      // const grid = new KarmaFieldsAlpha.Grid(string);
      // // const ids = this.getIds();
      // const items = this.getItems();
      //
      // // if (items.length < length) {
      // if (grid.array.length < length) {
      //
      //   this.remove(index + grid.array.length, length - grid.array.length);
      //
      // } else if (grid.array.length > length) {
      //
      //   for (let i = 0; i < grid.array.length - length; i++) {
      //
      //     this.add(index + length + i);
      //
      //   }
      //
      // }

      const columns = this.getExportColumns();

      for (let i = 0; i < grid.value.length; i++) {

        const child = this.createChild({
          children: columns,
          type: "row",
          index: i,
          id: ids[i]
        }, i);

        const content = new KarmaFieldsAlpha.Content.Collection(grid.value[i]);

        child.import(content);


      }

    }

  }


  // import(dataRow, index = 0, length = 999999, colIndex = 0, colLength = 999999) {
  //
  //   const string = dataRow.shift();
  //
  //   const [current] = this.export([], index, length, colIndex, colLength);
  //
  //   if (string !== current) {
  //
  //     const grid = new KarmaFieldsAlpha.Grid(string);
  //     // const ids = this.getIds();
  //     const items = this.getItems();
  //
  //     // if (items.length < length) {
  //     if (grid.array.length < length) {
  //
  //       this.remove(index + grid.array.length, length - grid.array.length);
  //
  //     } else if (grid.array.length > length) {
  //
  //       for (let i = 0; i < grid.array.length - length; i++) {
  //
  //         this.add(index + length + i);
  //
  //       }
  //
  //     }
  //
  //     const mode = this.resource.import || this.resource.export;
  //
  //     if (mode === "modal") {
  //
  //       for (let i = 0; i < grid.array.length; i++) {
  //
  //         const item = items[i + index] || {loading: true};
  //
  //         const child = this.createChild({
  //           children: this.resource.modal.children || [],
  //           type: "row",
  //           index: i + index,
  //           id: item.id,
  //           loading: item.loading
  //           // item: items[i + index]
  //         });
  //
  //         const rowItems = grid.getRow(i);
  //
  //         child.import(rowItems);
  //
  //       }
  //
  //     } else if (mode && Array.isArray(mode)) {
  //
  //       for (let i = 0; i < grid.array.length; i++) {
  //
  //         const item = items[i + index];
  //         const rowItems = grid.getRow(i);
  //
  //         // mode.forEach(key => {
  //         //   this.setValue(rowItems.shift(), item.id, key);
  //         // });
  //         //
  //         // if (item) {
  //         //
  //         //   this.setValue();
  //         //
  //         // }
  //
  //         const rowField = this.createChild({
  //           type: "row",
  //           id: item.id
  //         });
  //
  //         for (let field of mode) {
  //
  //           if (typeof field === "string") {
  //
  //             field = {key: field};
  //
  //           }
  //
  //           const child = rowField.createChild({
  //             type: "input",
  //             ...field
  //           });
  //
  //           child.import(rowItems);
  //
  //         }
  //
  //       }
  //
  //     } else {
  //
  //
  //       // const columns = this.resource.children.slice(colIndex, colIndex + colLength);
  //       const columns = this.resource.children;
  //
  //
  //       for (let i = 0; i < grid.array.length; i++) {
  //
  //         const item = items[i + index] || {loading: true};
  //
  //         const child = this.createChild({
  //           children: columns,
  //           type: "row",
  //           index: i + index,
  //           id: item.id,
  //           loading: item.loading
  //           // item: items[i + index]
  //         });
  //
  //         const rowItems = grid.getRow(i);
  //
  //         child.import(rowItems);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  getModal() {

    const selection = this.getSelection();

    if (selection && selection.length > 0 && this.resource.modal) {

      return this.getChild("modal");

    }

  }

  getChild(index) {

    if (index === "modal") {

      return this.createChild({
        ...this.resource.modal,
        type: "modal",
        index: "modal",
      });

    } else {

      const items = this.getItems();

      if (items[index]) {

        return this.createChild({
          id: item[index].id,
          type: "row",
          children: this.resource.children,
          loading: item[index].loading,
          index: index
        });

      }

    }

  }

  // getSelectionChild(selection) {
  //
  //   if (selection) {
  //
  //     if (selection.modal && !selection.modal.final) {
  //
  //       return this.createChild({
  //         ...this.resource.modal,
  //         type: "modal",
  //         index: "modal",
  //       });
  //
  //     }
  //
  //
  //
  //     const items = this.getItems();
  //
  //     for (let i in items) {
  //
  //       if (selection[i]) {
  //
  //         return this.createChild({
  //           id: item[i].id,
  //           type: "row",
  //           children: this.resource.children,
  //           loading: item[i].loading,
  //           index: i
  //         });
  //
  //       }
  //
  //     }
  //
  //
  //
  //   }
  //
  // }

  // follow(selection, callback) {
  //
  //   if (selection.modal && !selection.modal.final) {
  //
  //     const modal = this.createChild({
  //       ...this.resource.modal,
  //       type: "modal",
  //       index: "modal",
  //       // ids: this.getSelectedIds(selection)
  //     });
  //
  //     return modal.follow(selection.modal, callback);
  //
  //   } else if (selection.final || selection.modal && selection.modal.final) {
  //
  //     return callback(this, selection);
  //
  //   // } else if (selection.modal) {
  //   //
  //   //   const modal = this.createChild({
  //   //     ...this.resource.modal,
  //   //     type: "modal",
  //   //     index: "modal",
  //   //     ids: this.getSelectedIds(selection)
  //   //   });
  //   //
  //   //   return modal.follow(selection.modal, callback);
  //
  //   } else { // -> paste into selected things inside a row (like files field)
  //
  //     // const ids = this.getIds();
  //     const items = this.getItems();
  //
  //     for (let i in items) {
  //
  //       if (selection[i]) {
  //
  //         const item = items[i];
  //
  //         const child = this.createChild({
  //           id: item.id,
  //           type: "row",
  //           children: this.resource.children,
  //           loading: item.loading,
  //           // item: items[i],
  //           index: i
  //         });
  //
  //         return child.follow(selection[i], callback);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  selectAll() {

    const items = this.getItems();

    if (items) {

      const selection = {
        index: 0,
        length: items.length
      };

      this.setSelection(selection);

    }

  }

  copy() {

    if (this.selection) {

      const index = this.selection.index || 0;
      const length = this.selection.length || 0;

      const values = this.export([], index, length, this.selection.colIndex, this.selection.colLength);

      return values[0];

    }

  }

  // copy(selection) {
  //
  //   if (selection && !selection.child) {
  //
  //     const index = selection.index || 0;
  //     const length = selection.length || 0;
  //
  //     const values = this.export([], index, length, selection.colIndex, selection.colLength);
  //
  //     return values[0];
  //
  //   } else {
  //
  //     return super.copy(selection);
  //
  //   }
  //
  // }

  async paste(value) {

    if (this.selection) {

      await this.save("paste", "Paste");

      const index = selection.index || 0;
      const length = selection.length || 0;

      this.import([value], index, length, selection.colIndex, selection.colLength);

      await this.request("render");

    }

  }


  // paste(value, selection) {
  //
  //   if (selection && !selection.child) {
  //
  //     const index = selection.index || 0;
  //     const length = selection.length || 0;
  //
  //     this.import([value], index, length, selection.colIndex, selection.colLength);
  //
  //   } else {
  //
  //     super.paste(value, selection);
  //
  //   }
  //
  // }

  async add(...path) {

    const index = this.selection && this.selection.index || 0;
    const length = this.selection && this.selection.length || 0;

    // const {page, ppp, orderby, order, ...defaultParams} = this.resource.params;
    //
    // params = {...defaultParams, ...params}; // default params are needed (e.g) for setting post-type

    const params = this.parse(this.resource.defaults).toObject();


    KarmaFieldsAlpha.History.save("insert", "Insert");

    KarmaFieldsAlpha.Query.add(this.resource.driver, params, index, ...path);

    this.setSelection({index: index + length, length: 1});

    await this.request("render");

  }

  // delete(selection) {
  //
  //   this.remove(selection.index || 0, selection.length || 0);
  //
  // }

  canDelete() {

    return this.selection && this.selection.length > 0 || false;

  }

  async delete() {

    if (this.selection && this.selection.length) {

      KarmaFieldsAlpha.History.save("delete", "Delete");

      const index = this.selection.index || 0;
      const length = this.selection.length || 0;

      this.remove(index, length);

      await this.request("render");

    }

    // if (selection && !selection.child) {
    //
    //   const index = selection.index || 0;
    //   const length = selection.length || 0;
    //
    //   this.remove(index, length);
    //
    // } else {
    //
    //   super.delete(selection);
    //
    // }

  }

  remove(index, length) {

    const items = this.getItems().slice(index, index + length);
    const ids = items.map(item => item.id).filter(id => id);

    if (ids) {

      KarmaFieldsAlpha.History.save("delete", "Delete");

      const driver = this.getDriver();

      KarmaFieldsAlpha.Query.removeIds(driver, ids);

      this.setSelection({index: 0, length: 0});

      this.request("render");

    }

  }


  duplicate(index, length = 1) {

    const items = this.export([], index, length);

    this.import(items, index + length, 0);

  }

  // getSelection() {
  //
  //   let selection = super.getSelection();
  //
  //   if (selection && selection.values) {
  //
  //     const items = this.getItems();
  //
  //     if (items && items !== KarmaFieldsAlpha.loading) {
  //
  //       const firstIndex = items.findIndex(item => item.id === selection.values[0]);
  //       const lastIndex = items.findIndex(item => item.id === selection.values[selection.values.length - 1]);
  //
  //       if (firstIndex !== undefined) {
  //
  //         selection = {
  //           index: firstIndex,
  //           length: lastIndex - firstIndex + 1
  //         };
  //
  //         // this.setSelection(selection); -> cause infinit loop
  //         super.setSelection(selection);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   return selection;
  //
  // }

  // setSelection(selection) {
  //
  //   // if (selection) {
  //   //
  //   //   if (selection.modal) {
  //   //
  //   //     selection = {...this.getSelection(), ...selection};
  //   //
  //   //   } else if (selection.length && this.resource.modal) {
  //   //
  //   //     selection.modal = {final: true};
  //   //
  //   //   }
  //   //
  //   // }
  //
  //
  //   if (selection) {
  //
  //     selection = {...this.getSelection(), ...selection};
  //
  //   }
  //
  //   super.setSelection(selection);
  // }

  hasModalOpen() {

    const selection = this.getSelection();

    return selection && selection.childId === "modal" || false;

  }

  hasSelection() {

    const selection = this.getSelection();

    return Boolean(selection && !selection.child && selection.length);

  }

  /**
   * set selection to modal (not deeper), when modal background is clicked
   *
   * is extended by hierarchy
   */
  clearModalSelection() {

    // const selection = this.getSelection();
    //
    // this.setSelection({index: selection.index || 0, length: selection.length || 0, final: true});

    // this.setSelection({childId: "modal", child: {}});

    // const selection = this.getSelection();

    if (this.selection) {

      const index = this.selection.index || 0;
      const length = this.selection.length || 0;

      this.setSelection({index: index, length: length});

    }

  }

  isRowSelected() {

    const selection = this.getSelection();

    if (selection && selection.length) {

      return true;

    }

    return false;
  }

  getSelectedIds() {

    return this.getSelectedItems().map(item => item.id); // -> compat

  }

  getSelectedItems() {

    const items = this.getItems();

    if (items, this.selection) {

      const index = this.selection.index || 0;
      const length = this.selection.length || 0;

      return items.slice(index, index + length);

    }


    // if (items) {
    //
    //   if (!selection) {
    //
    //     selection = this.getSelection();
    //
    //   }
    //
    //   if (selection) {
    //
    //     const index = selection.index || 0;
    //     const length = selection.length || 0;
    //
    //     return items.slice(index, index + length);
    //
    //   }
    //
    // }

    return [];
  }


  // async select(index, length) {
  //
  //   const selection = {index: index, length: length, final: true};
  //
  //   this.setSelection(selection);
  //
  //   this.save(`${this.parent.resource.index}-nav`);
  //
  //   await this.parent.render();
  //
  //   const [string] = this.export([], selection.index, selection.length);
  //
  //   KarmaFieldsAlpha.Clipboard.write(string);
  //
  // }

  // save(name) {
  //
  //   super.save(name && `${this.resource.uid}-${name}`);
  //
  // }




  async select(selection) {

    this.setSelection(selection);

    // this.save("nav");

    await this.request("deferFocus");

    await this.request("render");


    // -> todo: do this in copy event
    // const [string] = this.export([], selection.index, selection.length);
    //
    // KarmaFieldsAlpha.Clipboard.write(string);

    // KarmaFieldsAlpha.Clipboard.focus();

    // this.deferFocus();

  }






  // unselect() {
  //
  //   const currentSelection = this.getSelection();
  //
  //   if (currentSelection) {
  //
  //     this.parent.setSelection();
  //
  //   }
  //
  // }


  build() {

    return {
      class: "table grid",
      init: grid => {
        if (this.resource.style) {
          grid.element.style = this.resource.style;
        }
        if (this.resource.width) {
          grid.element.style.width = this.resource.width;
        }
      },
      update: async grid => {

        const items = this.getItems();

        grid.element.classList.toggle("loading", !items);

        if (items) {

          const page = this.request("getPage");
          const ppp = this.getPpp();
          const offset = (page - 1)*ppp;

          // let selection = this.getSelection();

          const selector = new KarmaFieldsAlpha.RowPicker(grid.element, this.selection);

          selector.header = 1;
          selector.width = this.resource.children.length;

          selector.onSelect = elements => {

            elements.map(element => element.classList.add("selected"));
            this.setSelection(selector.state.selection);

          }

          selector.onUnselect = elements => {

            elements.map(element => element.classList.remove("selected"));

          }

          selector.onSelectionComplete = () => {

            this.request("deferFocus");
            this.request("render");

          }

          if (items.length) {
            grid.element.classList.add("filled"); // -> draw table borders

            const columns = this.resource.children || [];

            grid.children = [];

            for (let i = 0; i < columns.length; i++) {

              const resource = columns[i];

              grid.children.push({
                class: "th table-header-cell",
                init: th => {
                  if (resource.style) {
                    th.element.style = resource.style;
                  }
                  th.element.tabIndex = -1;
                },
                update: th => {
                  th.children = [
                    {
                      class: "header-cell-content title",
                      init: a => {
                        a.element.textContent = resource.label;
                      }
                    },
                    {
                      class: "header-cell-content order",
                      child: {
                        tag: "span",
                        class: "dashicons",
                        update: span => {
                          const order = this.getOrder() || "asc";
                          const orderby = this.getOrderby();
                          const isAsc = orderby === (resource.orderby || resource.key) && order === "asc";
                          const isDesc = orderby === (resource.orderby || resource.key) && order === "desc";
                          span.element.classList.toggle("dashicons-arrow-up", isAsc);
                          span.element.classList.toggle("dashicons-arrow-down", isDesc);
                          span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
                        }
                      },
                      update: a => {
                        a.element.classList.toggle("hidden", !resource.sortable);
                        if (resource.sortable) {
                          a.element.onmousedown = event => {
                            event.stopPropagation(); // -> prevent header selection
                          }
                          a.element.onclick = async event => {
                            // debugger;
                            event.preventDefault();
                            this.toggleOrder(resource.orderby || resource.key, resource.order);
                            this.select();
                          };
                        }
                      }
                    }
                  ];
                }
              });
            }

            for (let i = 0; i < items.length; i++) {

              const row = this.createChild({
                id: items[i].id,
                loading: items[i].loading,
                type: "row",
                children: columns,
                index: offset + i,
                rowIndex: offset + i
              }, i);

              const isRowSelected = this.selection && KarmaFieldsAlpha.Segment.contain(this.selection, i);

              for (let j = 0; j < columns.length; j++) {

                const field = row.createChild({
                  ...columns[j],
                  index: j
                }, j);

                grid.children.push({
                  class: "td table-cell",
                  init: td => {
                    if (resource.style) {
                      td.element.style = columns[j].style;
                    }
                    // td.element.tabIndex = -1;
                  },
                  update: td => {
                    td.element.classList.toggle("selected", Boolean(isRowSelected));
                    td.element.classList.toggle("odd", i%2 === 0);
                    // if (selection && selection.reveal && rowIndex === selection.index) {
                    //   const container = this.getScrollContainer();
                    //   if (container) {
                    //     container.scrollTop = td.element.offsetTop - 0;
                    //     selection.reveal = false;
                    //   }
                    // }
                  },
                  child: field.build()
                });


              }

            }

            [

              ...items.reduce((children, item, rowIndex) => {

                const row = this.createChild({
                  id: item.id,
                  loading: item.loading,
                  type: "row",
                  children: this.resource.children || [],
                  index: offset + rowIndex,
                  rowIndex: offset + rowIndex
                }, rowIndex);

                const isRowSelected = this.selection && KarmaFieldsAlpha.Segment.contain(this.selection, rowIndex);

                return [
                  ...children,
                  ...this.resource.children.map((resource, colIndex) => {
                    const field = row.createChild({
                      ...resource,
                      index: colIndex
                    }, colIndex);
                    return {
                      class: "td table-cell",
                      init: td => {
                        if (resource.style) {
                          td.element.style = resource.style;
                        }
                        td.element.tabIndex = -1;
                      },
                      update: td => {
                        td.element.classList.toggle("selected", Boolean(isRowSelected));
                        td.element.classList.toggle("odd", rowIndex%2 === 0);
                        // if (selection && selection.reveal && rowIndex === selection.index) {
                        //   const container = this.getScrollContainer();
                        //   if (container) {
                        //     container.scrollTop = td.element.offsetTop - 0;
                        //     selection.reveal = false;
                        //   }
                        // }
                      },
                      child: field.build()
                    };
                  })
                ];
              }, [])
            ]




            // grid.children = [
            //   ...this.resource.children.map((resource, colIndex) => {
            //     return {
            //       class: "th table-header-cell",
            //       init: th => {
            //         if (resource.style) {
            //           th.element.style = resource.style;
            //         }
            //         th.element.tabIndex = -1;
            //       },
            //       update: th => {
            //         th.children = [
            //           {
            //             class: "header-cell-content title",
            //             init: a => {
            //               a.element.textContent = resource.label;
            //             }
            //           },
            //           {
            //             class: "header-cell-content order",
            //             child: {
            //               tag: "span",
            //               class: "dashicons",
            //               update: span => {
            //                 const order = this.getOrder() || "asc";
            //                 const orderby = this.getOrderby();
            //                 const isAsc = orderby === (resource.orderby || resource.key) && order === "asc";
            //                 const isDesc = orderby === (resource.orderby || resource.key) && order === "desc";
            //                 span.element.classList.toggle("dashicons-arrow-up", isAsc);
            //                 span.element.classList.toggle("dashicons-arrow-down", isDesc);
            //                 span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
            //               }
            //             },
            //             update: a => {
            //               a.element.classList.toggle("hidden", !resource.sortable);
            //               if (resource.sortable) {
            //                 a.element.onmousedown = event => {
            //                   event.stopPropagation(); // -> prevent header selection
            //                 }
            //                 a.element.onclick = async event => {
            //                   // debugger;
            //                   event.preventDefault();
            //                   this.toggleOrder(resource.orderby || resource.key, resource.order);
            //                   this.select();
            //                 };
            //               }
            //             }
            //           }
            //         ];
            //       }
            //     };
            //   }),
            //   ...items.reduce((children, item, rowIndex) => {
            //
            //     const row = this.createChild({
            //       id: item.id,
            //       loading: item.loading,
            //       type: "row",
            //       children: this.resource.children || [],
            //       index: offset + rowIndex,
            //       rowIndex: offset + rowIndex
            //     }, rowIndex);
            //
            //     const isRowSelected = this.selection && KarmaFieldsAlpha.Segment.contain(this.selection, rowIndex);
            //
            //     return [
            //       ...children,
            //       ...this.resource.children.map((resource, colIndex) => {
            //         const field = row.createChild({
            //           ...resource,
            //           index: colIndex
            //         }, colIndex);
            //         return {
            //           class: "td table-cell",
            //           init: td => {
            //             if (resource.style) {
            //               td.element.style = resource.style;
            //             }
            //             td.element.tabIndex = -1;
            //           },
            //           update: td => {
            //             td.element.classList.toggle("selected", Boolean(isRowSelected));
            //             td.element.classList.toggle("odd", rowIndex%2 === 0);
            //             // if (selection && selection.reveal && rowIndex === selection.index) {
            //             //   const container = this.getScrollContainer();
            //             //   if (container) {
            //             //     container.scrollTop = td.element.offsetTop - 0;
            //             //     selection.reveal = false;
            //             //   }
            //             // }
            //           },
            //           child: field.build()
            //         };
            //       })
            //     ];
            //   }, [])
            // ];

            grid.element.style.gridTemplateColumns = this.resource.children.map(resource => resource.width || "auto").join(" ");

          } else {
            grid.children = [];
            grid.element.classList.remove("filled");
          }

        }

      }

    };

  }



}



KarmaFieldsAlpha.field.grid.modal = class extends KarmaFieldsAlpha.field.container {

  getMixedContent(key) {

    const items = this.request("getSelectedItems");

    if (items.some(item => item.loading)) {

      return new KarmaFieldsAlpha.LoadingContent();

    }

    const contents = items.map(item => this.getContent(item.id, key))

    if (contents.some(content => content.loading)) {

      return new KarmaFieldsAlpha.LoadingContent();

    }

  }

  getMixedValues(key) {

    const items = this.request("getSelectedItems");

    const values = [];

    for (let item of items) {

      if (item.loading || !item.id) {

        continue; // being added

      }

      const array = this.parent.getValue(item.id, key);

      if (array) {

        values.push(array);

      }

      // -> Do not break if values is undefined to allow loading of futher items

    }

    if (values.length === items.length) {

      return values;

    }

  }

  getContent(key) {

    const items = this.request("getSelectedItems");

    if (items && !items.some(item => item.loading)) {

      if (items.length > 1) {

        const contents = items.map(item => this.getContent(item.id, key));
        const content = new KarmaFieldsAlpha.Content(contents);
        content.loading = contents.some(content => content.loading);
        content.mixed = contents.some((content, index, array) => index > 0 && !content.equals(array[0]));

        return content;

      } else if (items.length === 1) {

        return this.parent.getContent(items[0].id, key);

      }

    }

    return new KarmaFieldsAlpha.LoadingContent();

  }

  getValue(key) {

    const items = this.request("getSelectedItems");

    if (items && items !== KarmaFieldsAlpha.loading) {

      if (items.some(item => item.loading || item.id === KarmaFieldsAlpha.loading)) {

        return; // KarmaFieldsAlpha.loading;

      }

      if (items.length > 1) {

        const values = this.getMixedValues(key);

        if (values) {

          const mixed = values.some((value, index, array) => index > 0 && !KarmaFieldsAlpha.DeepObject.equal(value, array[0]));

          if (mixed) {

            return [KarmaFieldsAlpha.mixed]; // compat: should be KarmaFieldsAlpha.mixed (without brackets)

          } else {

            return values[0];

          }

        }

      } else if (items.length === 1) {

        return this.parent.getValue(items[0].id, key);

      }

    }

    // return undefined => not ready

  }

  setContent(value, key) {

    const items = this.request("getSelectedItems");

    if (items) {

      for (let item of items) {

        if (item.id) {

          this.parent.setContent(value, item.id, key);

        }

      }

    }

  }

  setValue(value, key) {

    const items = this.request("getSelectedItems");

    if (items) {

      for (let item of items) {

        if (item.id) {

          this.parent.setValue(value, item.id, key);

        } else {

          console.warn("item.id not set!", item, key, value);

        }

      }

    }

  }

  // multiple() {
  //
  //   // const ids = this.parent.getSelectedIds();
  //   const items = this.request("getSelectedItems");
  //
  //   return items && items.length > 1;
  // }

  getIds() {

    const items = this.request("getSelectedItems");

    // if (items.some(item => item.loading || !item.id || item.id === KarmaFieldsAlpha.loading)) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (items && !items.some(item => item.loading)) {

      return items.map(item => item.id).filter(id => id);

    }



  }

  getId() {

    const ids = this.getIds();

    if (ids) {

      return ids[0];

    }

  }

  setSelection(selection) {

    if (selection) {

      // selection = {
      //   ...this.parent.getSelection(),
      //   childId: this.resource.index,
      //   child: selection
      // };

      selection.id = this.id;

      selection = {
        ...this.parent.getSelection(),
        child: selection
      };

    }

    this.parent.setSelection(selection);

  }

}



KarmaFieldsAlpha.field.grid.row = class extends KarmaFieldsAlpha.field {




  getContent(key) {

    const id = this.getId();

    if (key === "id") {

      return new KarmaFieldsAlpha.Content(id);

    }

    return this.parent.getContent(id, key);

  }

  setContent(value, key) {

    const id = this.getId();

    this.parent.setContent(value, id, key);

  }


  // getValue(key) {
  //
  //   if (this.resource.id !== undefined && !this.resource.loading) {
  //
  //     if (key === "id") {
  //
  //       return [this.resource.id];
  //
  //     }
  //
  //     return this.parent.getValue(this.resource.id, key);
  //
  //   }
  //
  // }
  //
  // setValue(value, key) {
  //
  //   // if (this.resource.id !== null) { // -> id is null while being added. Should never happen.
  //
  //   if (this.resource.id !== undefined && !this.resource.loading) {
  //
  //     this.parent.setValue(value, this.getId, key);
  //
  //   }
  //
  // }

  // modified(key) {
  //
  //   // if (this.resource.id !== null) { // -> id is null while being added. Should never happen.
  //
  //   if (this.resource.id !== undefined && !this.resource.loading) {
  //
  //     return this.parent.modified(this.resource.id, key);
  //
  //   }
  //
  // }

  getIndex() {

    return this.resource.rowIndex || 0;

  }

  getId() {

    return this.resource.id;

  }

}


KarmaFieldsAlpha.field.grid.row.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      action: "delete",
      value: ["index"],
      title: "Delete",
      dashicon: "no-alt",
      width: "auto",
      ...resource
    })
  }
};
KarmaFieldsAlpha.field.grid.row.sortArrows = class extends KarmaFieldsAlpha.field.group {
  constructor(resource) {
    super({
      visible: [">", ["length", ["getValue"]], "1"],
      children: [
        {
          action: "sortUp",
          value: ["index"],
          type: "button",
          title: "Move Up",
          disabled: ["<", ["length", ["getValue"]], 1],
          dashicon: "arrow-up-alt2",
          class: "array-sort-up",
          width: "auto"
        },
        {
          action: "sortDown",
          value: ["index"],
          type: "button",
          title: "Move Down",
          disabled: [">=", ["+", ["get", "number", "index"], 1], ["length", ["getValue"]]],
          dashicon: "arrow-down-alt2",
          class: "array-sort-up",
          width: "auto"
        }
      ],
      ...resource
    })
  }
};



// array(
//   'type' => 'text',
//   'content' => array('request', 'getNotice')
// ),


// KarmaFieldsAlpha.field.grid.row.index = {
//   type: "text",
//   value: ["+", ["getIndex"], 1],
//   style: "width: 6em"
// };

KarmaFieldsAlpha.field.grid.row.rowIndex = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      value: ["+", ["getIndex"], 1],
      width: "5em",
      ...resource
    })
  }
};
