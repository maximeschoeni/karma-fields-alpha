
KarmaFieldsAlpha.field.grid = class extends KarmaFieldsAlpha.field {

  // constructor(resource) {
  //   super(resource);
  //
  //   // this.idsBuffer = new KarmaFieldsAlpha.Buffer("state", this.resource.id || this.resource.driver, "ids");
  //
  //   // this.selectionBuffer = new KarmaFieldsAlpha.Buffer("state", this.resource.id || this.resource.driver, "selection");
  //   this.selectionBuffer = new KarmaFieldsAlpha.Buffer("state", "selection");
  //
  //
  //
  //   // this.clipboard = this.createChild("clipboard");
  //   // this.cellClipboard = this.createChild("clipboard");
  // }

  // -> compat
  // async queryIds() {
  //   return this.load();
  // }
  //
  // async load() {
  //   const ids = this.idsBuffer.get() || [];
  //   const params = this.getParams();
  //
  //   const promise = this.query(params);
  //
  //   this.cache.set(promise, "query", "current");
  //
  //   // const results = await this.query(params);
  //   const results = await promise;
  //
  //   const newIds = results.map(item => item.id);
  //
  //   this.idsBuffer.change(newIds, ids);
  //
  //   // this.expressionCache.remove();
  //
  //   // -> for table transfers
  //   // if (KarmaFieldsAlpha.Nav.has("selection")) {
  //   //   const selectedIds = KarmaFieldsAlpha.Nav.get("selection").split(",");
  //   //   const currentSelection = this.selectionBuffer.get();
  //   //   const newSelection = KarmaFieldsAlpha.Segment.fromArrays(newIds, selectedIds);
  //   //   if (newSelection && !KarmaFieldsAlpha.Segment.compare(newSelection, currentSelection)) {
  //   //     // this.interface.select(newSelection.index, newSelection.length);
  //   //     this.selectionBuffer.change(newSelection);
  //   //   }
  //   // }
  //
  //   return ids;
  // }

  // unload() {
  //   this.idsBuffer.change(null);
  // }

  // /**
  //  * extends form::getInitial()
  //  */
  // async getInitial(id, key) {

	// 	let value = this.initialBuffer.get(id, key);

  //   const idAlias = this.getAlias("id");

  //   if (value) {

  //     return value;

  //   } else {

  //     if (this.promise) {

  //       const results = await this.promise;

  //       if (results && results.some(item => item[idAlias] === id)) {

  //         value = this.initialBuffer.get(id, key);

  //         if (value) {

  //           return value;

  //         } else if (this.resource.joins) {

  //           const ids = results.map(item => item[idAlias]);

  //           for (let relation of this.resource.relations) {

  //             await this.queryRelations(relation, ids);

  //             value = this.initialBuffer.get(...path);

  //             if (value) {

  //               return value;

  //             }

  //           }

  //           return [];

  //         }

  //       } else { // -> query single

  //         return super.getInitial(id, key);

  //       }

  //     }

  //     return super.getInitial(id, key);

  //   }

  // }

  // /**
  //  * extends form::getInitial()
  //  */
  // async getInitial(id, key) {

	// 	let value = this.initialBuffer.get(id, key);

  //   const idAlias = this.getAlias("id");

  //   if (value) {

  //     return value;

  //   }

  //   const promise = this.cache.get("query", "current");

  //   if (promise) {

  //     const results = await promise;

  //     if (results.some(item => item[idAlias] === id)) {

  //       value = this.initialBuffer.get(id, key);

  //       if (value) {

  //         return value;

  //       }

  //       if (this.resource.relations) {

  //         const ids = results.map(item => item[idAlias]);

  //         for (let relation of this.resource.relations) {

  //           await this.queryRelations(relation, ids);

  //           value = this.initialBuffer.get(id, key);

  //           if (value) {

  //             return value;

  //           }

  //         }

  //       }

  //       return [];

  //     }

  //   }

  //   return super.getInitial(id, key);

  // }

  // async getInitial(id, key) {
  //
  //   let value = this.initialBuffer.get(id, key);
  //
  //   if (value) {
  //
  //     return value;
  //
  //   }
  //
  //   const ids = this.getIds();
  //
  //   if (ids.includes(id)) {
  //
  //     if (this.resource.relations) {
  //
  //       for (let relation of this.resource.relations) {
  //
  //         await this.queryRelations(relation, ids);
  //
  //         value = this.initialBuffer.get(id, key);
  //
  //         if (value) {
  //
  //           return value;
  //
  //         }
  //
  //       }
  //
  //     }
  //
  //     return [];
  //
  //   } else {
  //
  //     return super.getInitial(id, key);
  //
  //   }
  //
  // }


  getValue(...path) {

    // return KarmaFieldsAlpha.Terminal.getValue(this.resource.driver, ...path);

    return KarmaFieldsAlpha.Store.get("delta", this.resource.driver, ...path) || KarmaFieldsAlpha.Query.getValue(this.resource.driver, ...path);

  }

  setValue(value, ...path) {

    // KarmaFieldsAlpha.Terminal.setValue(value, this.resource.driver, ...path);



    value = KarmaFieldsAlpha.Type.toArray(value);

		let currentValue = this.getValue(...path);

		if (!KarmaFieldsAlpha.DeepObject.equal(value, currentValue)) {

      KarmaFieldsAlpha.History.backup(value, currentValue, "delta", this.resource.driver, ...path);

      KarmaFieldsAlpha.Store.set(value, "delta", this.resource.driver, ...path);

      this.save();

      this.render();

		}

  }

  modified(...path) {

    return !KarmaFieldsAlpha.DeepObject.include(KarmaFieldsAlpha.Query.vars, KarmaFieldsAlpha.Store.get("delta", this.resource.driver, ...path), this.resource.driver, ...path);

  }



  getParams() {

    // const {id, table, selection, language, ...params} = {
    //   page: 1,
    //   ppp: 10,
    //   ...this.resource.params,
    //   ...KarmaFieldsAlpha.Nav.get()
    // };
    //
    // const state =  || {};

    return {
      page: 1,
      ppp: 100,
      ...this.resource.params,
      ...KarmaFieldsAlpha.Query.params
    };

  }

  getParam(key) {
    return this.getParams()[key];
  }

  getCountParams() {

    const {page, ppp, orderby, order, ...params} = this.getParams();

    return params || {};

  }

  async getCount() {

    // const paramString = this.getCountParamString();
    const params = this.getCountParams();
    // const paramString = KarmaFieldsAlpha.Nav.toString(params);
    // const count = await this.server.store.count(paramString);
    // const count = await this.count(params);

    return KarmaFieldsAlpha.Query.getCount(this.resource.driver, params);
  }

  getPpp() {
    return Number(this.parent.request("ppp") || this.resource.params && this.resource.params.ppp || 100);
  }

  getColumns() {
    return this.resource.children.map((column, index) => index.toString()) || [];
  }

  // async getNumPage() {
  //   const count = await this.getCount();
  //   const ppp = this.getPpp();
  //   return Math.max(1, Math.ceil(count/ppp));
  // }
  //
  // getPage() {
  //   if (KarmaFieldsAlpha.Nav.has("page")) {
  //     return Number(KarmaFieldsAlpha.Nav.get("page"));
  //   }
  //   return 1;
  // }

  // async changePage(page) {
  //   const current = this.getPage();
  //
  //   if (page !== current) {
  //     KarmaFieldsAlpha.History.save();
  //     KarmaFieldsAlpha.Nav.change(page, current, "page");
  //     this.unselect();
  //     await this.load();
  //     await this.parent.request("render");
  //   }
  // }

  getOrder() {
    // return KarmaFieldsAlpha.Nav.get("order") || this.resource.params.order;

    const [order] = this.parent.getValue("order") || [];

    return order || this.resource.params && this.resource.params.order;
  }

  getOrderby() {

    const [orderby] = this.parent.getValue("orderby") || [];

    return orderby || this.resource.params && this.resource.params.orderby;
  }

  toggleOrder(key, order) {

    let orderby = this.getOrderby();

    if (orderby === key) {

      order = (this.getOrder() || order || "asc") === "asc" ? "desc" : "asc";
      // KarmaFieldsAlpha.Nav.change(order, undefined, "order");
      this.parent.setValue(order, "order");

    } else {

      // KarmaFieldsAlpha.Nav.change(order || "asc", undefined, "order");
      // KarmaFieldsAlpha.Nav.change(key, undefined, "orderby");

      this.parent.setValue(order || "asc", "order");
      this.parent.setValue(key, "orderby");

    }

  }


  getIds() {

    let ids = KarmaFieldsAlpha.Store.get("ids");

    if (!ids) {

      const params = this.getParams();
      const results = KarmaFieldsAlpha.Query.getResults(this.resource.driver, params);

      if (results) {

        ids = results.map(item => item.id);

        // KarmaFieldsAlpha.History.set(KarmaFieldsAlpha.Query.ids, "ids");
        KarmaFieldsAlpha.History.backup(ids, null, "ids");

        KarmaFieldsAlpha.Store.set("ids", ids);

      }

    }

    return ids; // -> undefined if not loaded

  }

  // isModalOpen() {
  //   return Boolean(this.resource.modal && this.resource.modal.keepAlive);
  // }

  // async exportSelection(keys = []) {
  //
  //   const selection = this.selectionBuffer.get();
  //
  //   if (selection) {
  //
  //     return this.export(keys, selection.index, selection.length);
  //
  //   }
  //
  //   return [];
  // }
  //
  // async importSelection(data) {
  //
  //   const selection = this.selectionBuffer.get();
  //
  //   if (selection) {
  //
  //     await this.import(data, selection.index, selection.length);
  //
  //   }
  //
  // }

  export(items = [], index = 0, length = 999999, colIndex = 0, colLength = 999999, alt = false) {

    const ids = this.getIds();
    const grid = new KarmaFieldsAlpha.Grid();

    if (this.resource.modal) {

      // const modal = this.createChild({
      //   ...this.resource.modal,
      //   // ids: ids,
      //   type: "modal",
      //   index: "modal"
      // });
      //
      // modal.export(items, index, length);




      for (let i = 0; i < Math.min(ids.length - index, length); i++) {

        const rowField = this.createChild({
          type: "row",
          index: i + index,
          id: ids[i + index],
          children: this.resource.modal.children || []
        });

        const rowItems = rowField.export();

        // console.log(rowItems);

        grid.addRow(rowItems);


      }


    } else {

      const grid = new KarmaFieldsAlpha.Grid();
      const columns = this.resource.children.slice(colIndex, colIndex + colLength);

      for (let i = 0; i < Math.min(ids.length - index, length); i++) {

        const rowField = this.createChild({
          type: "row",
          index: i + index,
          id: ids[i + index],
          children: columns
        });

        const rowItems = rowField.export();

        grid.addRow(rowItems);

      }

    }

    items.push(grid.toString());

    return items;

  }

  // async export(keys = [], index = 0, length = this.getIds().length) {
  //
  //   // const ids = this.getIds();
  //   //
  //   // segment ||= this.selectionBuffer.get() || {index: 0, length: ids.length};
  //
  //   const ids = this.getIds().slice(index, index + length);
  //
  //   const rows = [];
  //
  //   for (let id of ids) {
  //
  //     const rowField = this.createChild({
  //       children: this.resource.children,
  //       key: id,
  //       type: "row"
  //     });
  //
  //     let row = await rowField.export(keys);
  //
  //     if (this.resource.modal) {
  //
  //       const modal = this.createChild({
  //         ...this.resource.modal,
  //         key: id,
  //         type: "row"
  //       });
  //
  //       const modalObject = await modal.export(keys);
  //
  //       row = {...row, ...modalObject};
  //
  //     }
  //
  //
  //     rows.push(row);
  //   }
  //
  //   return rows;
  // }

  // async import(data, ids) { // expect json array
  //
  //   for (let i = 0; i < ids.length; i++) {
  //
  //     const id = ids[i];
  //     const object = data[i%data.length];
  //     // await this.interface.importRow(data[i]);
  //
  //     const rowField = this.createChild({
  //       children: this.resource.children,
  //       key: id,
  //       type: "row"
  //     }, id);
  //
  //     await rowField.import(object);
  //
  //     if (this.resource.modal) {
  //
  //       const modal = this.createChild({
  //         ...this.resource.modal.body,
  //         key: id,
  //         type: "row"
  //       });
  //
  //       await modal.import(object);
  //
  //     }
  //
  //   }
  //
  //
  //
  // }

  import(items, index = 0, length = 999999, colIndex = 0, colLength = 999999) {

    const string = items.shift();

    const [current] = field.export([], index, length, colIndex, colLength);

    if (string !== current) {

      const grid = new KarmaFieldsAlpha.Grid(string);
      const ids = this.getIds();

      if (items.length < length) {

        this.remove(index + items.length, length);

      } else if (items.length > length) {

        for (let i = 0; i < items.length - length; i++) {

          this.add(index + length + i);

        }

      }

      if (this.resource.modal) {



        // const modal = this.createChild({
        //   ...this.resource.modal,
        //   ids: this.getIds(),
        //   type: "modal"
        // });
        //
        // modal.import(items, index, length);

        for (let i = 0; i < grid.array.length; i++) {

          const child = this.createChild({
            children: this.resource.modal.children || [],
            type: "row",
            index: i + index,
            id: ids[i + index]
          });

          const rowItems = grid.getRow(i);

          child.import(rowItems);

        }

      } else {


        const columns = this.resource.children.slice(colIndex, colIndex + colLength);


        for (let i = 0; i < grid.array.length; i++) {

          const child = this.createChild({
            children: columns,
            type: "row",
            index: i + index,
            id: ids[i + index]
          });

          const rowItems = grid.getRow(i);

          child.import(rowItems);

        }

      }

    }

  }

  follow(selection, callback) {

    if (selection.final) {

      return callback(this, selection);

    } else if (selection.modal) {

      const modal = this.createChild({
        ...this.resource.modal,
        type: "modal"
      });

      return modal.follow(selection.modal, callback);

    } else { // -> paste into selected things inside a row (like files field)

      const ids = this.getIds();

      for (let i in ids) {

        if (selection[i]) {

          const child = this.createChild({
            id: i,
            type: "row",
            children: this.resource.children,
            index: i
          });

          return child.follow(selection[i], callback);

        }

      }

    }

  }


  paste(string, selection) {

    if (selection) {

      if (selection.modal) {

        const modal = this.createChild({
          type: "modal",
          ...this.resource.modal,
          index: "modal"
        });

        modal.paste(string, selection.modal);

      } else if (selection.final) {

        const [current] = this.export([], selection.index, selection.length);

        if (string !== current) {

          this.import([string], selection.index, selection.length);

        }

      } else { // -> paste into selected things inside a row (like files field)

        const ids = this.getIds();

        for (let i in ids) {

          if (selection[i]) {

            const child = this.createChild({
              id: i,
              type: "row",
              children: this.resource.children,
              index: i
            });

            child.paste(string, selection[i]);

            break;

          }

        }

      }

    }

  }

  // async import(data, index = this.getIds().length, length = 0) { // expect json array
  //
  //   // segment = segment || this.getSelection() || {index: this.getIds().length, length: 0};
  //
  //   if (data.length < length) {
  //
  //     await this.remove(index + data.length, length);
  //
  //   } else if (data.length > length) {
  //
  //     await this.addMultiple(data.length - length, {}, index + length);
  //
  //   }
  //
  //   if (data.length > 0) {
  //
  //     const ids = this.getIds().slice(index, index + data.length);
  //
  //     for (let i = 0; i < ids.length; i++) {
  //
  //       const id = ids[i];
  //       const object = data[i%data.length];
  //
  //       const rowField = this.createChild({
  //         children: this.resource.children,
  //         key: id,
  //         type: "row"
  //       });
  //
  //       await rowField.import(object);
  //
  //       if (this.resource.modal) {
  //
  //         const modal = this.createChild({
  //           ...this.resource.modal,
  //           key: id,
  //           type: "row"
  //         });
  //
  //         await modal.import(object);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  // async addMultiple(num, params, index) {
  //
  //   const ids = [];
  //
  //   for (let i = 0; i < num; i++) {
  //
  //     const id = await this.add(params, index+i);
  //
  //     ids.push(id);
  //
  //   }
  //
  //   return ids;
  // }

  async add(index = 0) {

    KarmaFieldsAlpha.Query.add(this.resource.driver, index);

    // let id = await KarmaFieldsAlpha.Gateway.post("add/"+this.resource.driver, params);
    //
    // id = KarmaFieldsAlpha.Type.toString(id);
    //
    // // KarmaFieldsAlpha.Terminal.setValue(["0"], this.resource.driver, id, "trash");
    //
    // this.setValue(["0"], id, "trash");
    //
    // // this.buffer.change(["0"], null, id, "trash");
    //
    // const rowField = this.createChild({
    //   children: this.resource.children,
    //   type: "row"
    // });
    //
    // const defaults = params;
    //
    // rowField.getDefault(defaults);
    //
    // if (this.resource.modal) {
    //
    //   const modal = this.createChild({
    //     ...this.resource.modal,
    //     type: "modal"
    //   });
    //
    //   modal.getDefault(defaults);
    //
    // }
    //
    // for (let key in params) {
    //
    //   const value = params[key];
    //
    //   if (value !== undefined && value !== null) {
    //
    //     this.setValue(value, id, key);
    //
    //   }
    //
    // }
    //
    // const ids = this.getIds();
    // const clones = [...this.ids];
    //
    // clones.splice(index, 0, id);
    //
    // KarmaFieldsAlpha.History.backup(clones, ids, "ids");
    //
    // // KarmaFieldsAlpha.Query.ids = clones;
    // KarmaFieldsAlpha.Store.set(clones, "ids");
    //
    // return id;
  }

  // async add(params = {}, index = 0) {
  //
  //   let createdId = await KarmaFieldsAlpha.Gateway.post("add/"+this.resource.driver, params);
  //
  //   const id = KarmaFieldsAlpha.Type.toString(createdId);
  //
  //   this.buffer.change(["0"], null, id, "trash");
  //
  //   const rowField = this.createChild({
  //     children: this.resource.children,
  //     type: "row"
  //   });
  //
  //   const defaults = await rowField.getDefault();
  //
  //   params = {...defaults, ...params};
  //
  //   if (this.resource.modal) {
  //
  //     const modal = this.createChild({
  //       ...this.resource.modal,
  //       key: id,
  //       type: "row"
  //     });
  //
  //     const modalDefaults = await modal.getDefault();
  //
  //     params = {...modalDefaults, ...params};
  //
  //   }
  //
  //   for (let key in params) {
  //
  //     this.buffer.change([params[key]], null, id, key);
  //
  //   }
  //
  //   const ids = [...this.getIds()];
  //
  //   ids.splice(index, 0, id);
  //
  //   this.idsBuffer.change(ids);
  //
  //   return id;
  // }


  remove(index, length) {



    const ids = this.getIds();
    const clones = [...ids];
    const removeIds = clones.splice(index, length);

    // const removeIds = ids.slice(index, index + length);

    for (let id of removeIds) {

      // this.trashBuffer.set({
      //   ...this.initialBuffer.get(id),
      //   trash: ["1"]
      // }, id);
      //
      // this.buffer.change(["1"], ["0"], id, "trash");

      this.setValue(["1"], id, "trash");

    }

    // const ids = this.getIds().filter(id => !removeIds.includes(id));

    KarmaFieldsAlpha.History.backup(clones, ids, "ids");

    // KarmaFieldsAlpha.Query.ids = clones;
    KarmaFieldsAlpha.Store.set(clones, "ids");

  }






  // async remove(index, length) {
  //
  //   const ids = this.idsBuffer.get() || [];
  //   const clones = ids.slice();
  //   const removeIds = clones.splice(index, length);
  //
  //   // const removeIds = ids.slice(index, index + length);
  //
  //   for (let id of removeIds) {
  //
  //     // this.server.trashBuffer.set({
  //     //   ...this.server.buffer.get(id),
  //     //   trash: ["1"]
  //     // }, id);
  //
  //     // await this.parent.request("trash", {data: {
  //     //   ...this.server.buffer.get(id),
  //     //   trash: ["1"]
  //     // }}, id);
  //
  //     this.trashBuffer.set({
  //       ...this.initialBuffer.get(id),
  //       trash: ["1"]
  //     }, id);
  //
  //     this.buffer.change(["1"], ["0"], id, "trash");
  //
  //   }
  //
  //   // const ids = this.getIds().filter(id => !removeIds.includes(id));
  //
  //   this.idsBuffer.change(clones);
  //
  // }


  // async read(ids) {
  //   const data = [];
  //
  //   for (let i = 0; i < ids.length; i++) {
  //
  //     const bufferData = await this.parent.request("get", {});
  //     const formBufferData = this.buffer.get(ids);
  //
  //     const clone = {};
  //
  //     KarmaFieldsAlpha.DeepObject.merge(clone, bufferData);
  //     KarmaFieldsAlpha.DeepObject.merge(clone, formBufferData);
  //
  //     data.push(clone);
  //
  //   }
  //
  //   return data;
  // }
  //
  // write(data, ids) {
  //
  //   const filterParams = this.getFilterParams();
  //
  //   for (let i = 0; i < ids.length; i++) {
  //
  //     const id = ids[i];
  //     const item = data[i%data.length];
  //
  //     for (let key in filterParams) {
  //       item[key] = [key[filterParams]];
  //     }
  //
  //     delete item.id;
  //     delete item.trash;
  //
  //     // this.grid.buffer.backup(item, id);
  //     // this.grid.buffer.set(item, id);
  //     this.interface.buffer.change(item, undefined, id);
  //
  //   }
  //
  // }

  async duplicate(index, length = 1) {

    const items = this.export([], index, length);

    this.import(items, index + length, 0);

  }

  hasSelection() {

    const selection = this.getSelection();

    return selection && selection instanceof KarmaFieldsAlpha.Selection;

  }

  // getSelection() {
  //
  //   let selection = super.getSelection();
  //
  //   // if (selection) {
  //   //
  //   //   Object.assign(selection, this.getData().selection);
  //   //
  //   //   // const data = this.getData();
  //   //   //
  //   //   // if (data.selectionIndex !== undefined && data.selectionLength !== undefined) {
  //   //   //
  //   //   //   selection = new KarmaFieldsAlpha.Selection(data.selectionIndex, data.selectionLength);
  //   //   //
  //   //   // }
  //   //
  //   // }
  //
  //   return Object.assign(selection || new KarmaFieldsAlpha.Selection(), this.getData().selection);
  // }

  // setSelection(selection) {
  //
  //   // this.parent.setSelection(selection && {[this.resource.index]: selection});
  //
  //
  //
  //   // if (selection) {
  //   //
  //   //   selection = Object.assign(new KarmaFieldsAlpha.Selection(), this.getData().selection, selection);
  //   //   selection.final = false;
  //   //
  //   // }
  //
  //
  //   super.setSelection(selection);
  //
  // }

  getSelectedIds() {

    //

    // console.log("grid getSelectedIds");
    // console.trace();

    // let selection = Object.assign(this.getSelection() || new KarmaFieldsAlpha.Selection(), this.getData().selection);

    const ids = this.getIds();

    let selection = this.getSelection(); // || this.getData().selection;

    // if (selection) {

      return ids.slice(selection.index, selection.index + selection.length);

    // } else {
    //
    //   selection = this.getData().selection;
    // }



  }

  // clearSelection(selection) {
  //
  //   if (selection && !selection.final && selection.modal) {
  //
  //     const modal = this.createChild({
  //       ...this.resource.modal,
  //       type: "modal",
  //       index: "modal"
  //     });
  //
  //     modal.clearSelection(selection.modal);
  //
  //   } else {
  //
  //     this.setSelection();
  //
  //   }
  //
  // }




  // getSelectedIds(selection) {
  //
  //   if (!selection) {
  //
  //     selection = this.selectionBuffer.get();
  //
  //   }
  //
  //   if (selection) {
  //
  //     const ids = this.idsBuffer.get() || [];
  //
  //     return ids.slice(selection.index, selection.index + selection.length);
  //
  //   }
  //
  //   return [];
  // }

  select(index, length) {

    // const currentSelection = this.getSelection();
    // const newSelection = new KarmaFieldsAlpha.Selection(index, length);
    // newSelection.final = true;
    //
    // if (!currentSelection || !newSelection.equals(currentSelection)) {
    //
    //   this.parent.setSelection(selection);
    //
    // }






    // const [string] = this.export([], index, length);
    //
    // KarmaFieldsAlpha.Clipboard.write(string);

    // const selection = new KarmaFieldsAlpha.Selection(index, length);
    const selection = {index: index, length: length, final: true};

    this.setSelection(selection);

    // const data = this.getData();
    //
    // data.selection = selection;

    // KarmaFieldsAlpha.Clipboard.getElement().onfocusout = event => {
    //
    //   const selection = this.getSelection();
    //   console.log("grid row focusout", event.relatedTarget);
    //   this.setSelection();
    //   this.render();
    // }


    this.parent.render();

  }

  unselect() {

    const currentSelection = this.getSelection();

    if (currentSelection) {

      this.parent.setSelection();

    }

  }

  // createSelection(ids) {
  //
  //   const first = this.getIds().indexOf(ids[0]);
  //
  //   // -> todo: handle unconsecutive ids
  //
  //   if (first > -1) {
  //
  //     return {index: first, length: ids.length};
  //
  //   }
  //
  // }

  // getSelection() {
  //   return this.selectionBuffer.get();
  // }

  // // override form.send()
  // async send(data) {
  //
  //   const selectedIds = this.getSelectedIds();
  //
  //   await super.send(data);
  //
  //   if (this.cache) {
  //
  //     this.cache.empty(); // buffer need to stay for history
  //
  //   }
  //
  //   await this.load();
  //
  //   if (selectedIds.length) {
  //
  //     const selection = this.createSelection(selectedIds);
  //
  //     this.selectionBuffer.change(selection);
  //
  //   }
  //
  // }

  // async request(subject, content, ...path) {
  //
  //   switch (subject) {
  //
  //     // case "edit":
  //     //   return this.parent.request("render-controls");
  //
  //     case "selectedIds": {
  //       // const selection = this.selectionBuffer.get();
  //       // if (selection) {
  //       //   return this.getIds().slice(selection.index, selection.index + selection.length);
  //       // }
  //       // return [];
  //
  //       return this.getSelectedIds();
  //     }
  //
  //     case "selection": {
  //       return this.getSelection();
  //     }
  //
  //     case "unselect": {
  //       if (this.selectionBuffer.get()) {
  //         KarmaFieldsAlpha.History.save();
  //         this.selectionBuffer.change(null);
  //         await this.parent.request("render");
  //       }
  //       break;
  //     }
  //
  //     case "export": {
  //       return this.export(content.keys, content.index, content.length);
  //     }
  //
  //     // case "submit": {
  //     //
  //     //   await this.submit();
  //     //
  //     //   await this.parent.request("render");
  //     //
  //     // }
  //
  //     // case "query": {
	// 		// 	return this.query(content);
	// 		// }
  //     //
	// 		// case "count": {
	// 		// 	return this.count(content);
	// 		// }
  //
  //
  //     // case "export-cells":
  //     //   return this.exportCells(content.rectangle);
  //     //
  //     // case "import-cells":
  //     //   await this.importCells(content.data, content.rectangle);
  //     //   break;
  //
  //     case "clearcachefiles": {
  //
  //       console.log("clearcachefiles");
  //
  //       this.cache.remove("relations", "attachments")
  //       break;
  //
  //     }
  //
  //     case "cachefiles": {
  //
  //       let promise = this.cache.get("relations", "attachments");
  //
  //       if (!promise) {
  //
  //         promise = new Promise(async resolve => {
  //
  //           const row = this.createChild({
  //             children: this.resource.children,
  //             type: "row"
  //           });
  //
  //           const modal = this.createChild({
  //             ...this.resource.modal,
  //             type: "row"
  //           });
  //
  //           const fields = [...row.getDescendants(), ...modal.getDescendants()];
  //           const galleries = fields.filter(field => field instanceof KarmaFieldsAlpha.field.gallery);
  //           const ids = this.getIds();
  //           const set = new Set();
  //
  //           for (let id of ids) {
  //
  //             for (let gallery of galleries) {
  //
  //               const mediaIds = await this.getInitial(id, gallery.resource.key) || [];
  //
  //               for (let mediaId of mediaIds) {
  //
  //                 if (mediaId && mediaId !== "0") {
  //
  //                   set.add(mediaId);
  //
  //                 }
  //
  //               }
  //
  //             }
  //
  //           }
  //
  //           const mediaTable = this.createChild({
  //             type: "form",
  //             driver: "posts"
  //           });
  //
  //           const mediaIds = [...set];
  //
  //           if (mediaIds.length) {
  //
  //             await mediaTable.query(`ids=${mediaIds.join(",")}`);
  //             await mediaTable.queryRelations("meta", mediaIds);
  //             await mediaTable.queryRelations("filemeta", mediaIds);
  //
  //           }
  //
  //           resolve();
  //
  //         });
  //
  //         this.cache.set(promise, "relations", "attachments");
  //
  //       }
  //
  //
  //       return promise;
  //     }
  //
  //
  //     default:
  //       return super.request(subject, content, ...path);
  //
  //   }
  //
  // }

  // isModalOpen() {
  //   return Boolean(this.resource.modal && (this.resource.modal.keepAlive || this.interface.selectionBuffer.get()));
  // }

  // async exportCells(rectangle) {
  //
  //   const data = [];
  //   const colIndexes = this.getColumns();
  //   const ids = this.getIds();
  //
  //   const selectedIds = ids.slice(rectangle.y, rectangle.y + rectangle.height);
  //   const selectedCols = colIndexes.slice(rectangle.x, rectangle.x + rectangle.width);
  //
  //   for (let id of selectedIds) {
  //
  //     const rowField = this.createChild({
  //       ...this.resource.children,
  //       key: id,
  //       type: "row"
  //     }, id);
  //
  //     const cols = [];
  //
  //     for (let index of selectedCols) {
  //
  //       const field = rowField.createChild(this.resource.children[index], index.toString());
  //       const value = await field.exportValue();
  //       cols.push(value || "");
  //
  //     }
  //
  //     data.push(cols);
  //
  //   }
  //
  //   return data;
  // }
  //
  // // -> cell selection
  // async importCells(data, rectangle) {
  //
  //   const colIndexes = this.getColumns();
  //   const ids = this.getIds();
  //
  //   const selectedIds = ids.slice(rectangle.y, rectangle.y + rectangle.height);
  //   const selectedCols = colIndexes.slice(rectangle.x, rectangle.x + rectangle.width);
  //
  //
  //
  //   for (let j = 0; j < selectedIds.length; j++) {
  //
  //     const id = selectedIds[j];
  //     const row = data[j%data.length] || [""];
  //
  //     const rowField = this.createChild({
  //       ...this.resource.children,
  //       key: id,
  //       type: "row"
  //     }, id);
  //
  //     for (let i = 0; i < selectedCols.length; i++) {
  //
  //       const index = selectedCols[i];
  //       const cell = row[i%row.length];
  //
  //       const field = rowField.createChild(this.resource.children[index], index.toString());
  //       await field.importValue(cell);
  //
  //     }
  //
  //   }
  //
  // }

  build() {

    return {
      class: "karma-field-table-grid-container karma-field-frame karma-field-group final scroll-container",
      init: body => {
        // body.element.tabIndex = -1;
      },
      update: body => {

        // body.element.onfocus = async event => {
        //   // const selection = this.selectionBuffer.get();
        //   if (this.hasSelection()) {
        //     // KarmaFieldsAlpha.History.save();
        //     // this.selectionBuffer.change(null);
        //     // await this.parent.request("render");
        //     this.parent.setSelection();
        //   }
        //   KarmaFieldsAlpha.Clipboard.write("");
        // }

        // body.element.focusout = async event => {
        //
        //
        //   // const selection = this.selectionBuffer.get();
        //   if (this.hasSelection()) {
        //     // KarmaFieldsAlpha.History.save();
        //     // this.selectionBuffer.change(null);
        //     // await this.parent.request("render");
        //
        //
        //
        //     this.parent.setSelection(null);
        //   }
        //   KarmaFieldsAlpha.Clipboard.write("");
        // }

        body.children = [
          // this.cellClipboard.build(),
          // this.clipboard.build(),
          {
            class: "table grid",
            init: async grid => {
              if (this.resource.style) {
                grid.element.style = this.resource.style;
              }
            },
            update: async grid => {

              // if (this.parent.resource.index === "posts") debugger;

              // console.log("grid update", KarmaFieldsAlpha.Query.table);

              const ids = this.getIds();

              // console.log(ids, this.parent.resource.index);

              const data = this.getData();

              grid.element.classList.toggle("loading", !ids);

              if (ids) {

                const page = this.parent.request("getPage");
                const ppp = this.getPpp();
                const offset = (page - 1)*ppp;
                // const columns = this.getColumns();



                let selection = this.getSelection();

                const selector = new KarmaFieldsAlpha.Selector(grid.element);
                selector.colCount = this.resource.children.length;
                selector.rowCount = ids.length;
                selector.colHeader = 1;



                if (selection && selection.final) {


                  selector.selection = selection;



                  const [string] = this.export([], selection.index, selection.length);

                  // const grid = new KarmaFieldsAlpha.Grid();
                  // grid.addColumn(...row);
                  //
              		// const string = grid.toString();
                  //
                  // // items.push(value);
                  // //
                  // // return items;
                  //
                  //
                  //


                  KarmaFieldsAlpha.Clipboard.write(string);

                }



                selector.onselect = newSelection => {

                  // if (!newSelection.equals(selection)) {
                  if (!KarmaFieldsAlpha.Selection.compare(newSelection, selection)) {

                    selection = newSelection;

                    // data.selection = selection;

                    this.select(selection.index, selection.length);

                    // const [string] = this.export([], selection.index, selection.length);
                    //
                    //
                    //
                    // KarmaFieldsAlpha.Clipboard.write(string);
                    //
                    // this.setSelection(selection);
                    //
                    // KarmaFieldsAlpha.Clipboard.getElement().onfocusout = event => {
                    //
                    //   const selection = this.getSelection();
                    //   console.log("grid row focusout", selection);
                    //   this.setSelection();
                    //   this.render();
                    // }
                    //
                    //
                    // this.parent.render();

                  }

                }

                selector.onSelectionChange = newSelection => {

                  this.setSelection(newSelection);

                }

                selector.onPaintRow = elements => {
                  elements.forEach(element => element.classList.add("selected"))
                }

                selector.onUnpaintRow = elements => {
                  elements.forEach(element => element.classList.remove("selected"))
                }

                selector.onPaintCell = elements => {
                  elements.forEach(element => element.classList.add("selected-cell"))
                }

                selector.onUnpaintCell = elements => {
                  elements.forEach(element => element.classList.remove("selected-cell"))
                }

                if (ids.length) {
                  grid.element.classList.add("filled"); // -> draw table borders
                  grid.children = [
                    ...this.resource.children.map((resource, colIndex) => {
                      // const child = this.resource.children[colId];
                      return {
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
                              tag: "a",
                              class: "header-cell-title",
                              init: a => {
                                a.element.textContent = resource.label;
                              }
                            },
                            {
                              tag: "a",
                              class: "header-cell-order",
                              child: {
                                tag: "span",
                                class: "dashicons",
                                update: async span => {
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
                                    event.preventDefault();
                                    this.toggleOrder(resource.orderby || resource.key, resource.order);
                                    this.unselect();
                                  };
                                }
                              }
                            }
                          ];
                        }
                      };
                    }),
                    ...ids.reduce((children, id, rowIndex) => {

                      const row = this.createChild({
                        id: id,
                        type: "row",
                        children: this.resource.children || [],
                        index: offset + rowIndex
                      });

                      // const isRowSelected = selection && selection instanceof KarmaFieldsAlpha.Selection && selection.containsRow(rowIndex);
                      const isRowSelected = selection && KarmaFieldsAlpha.Selection.containRow(selection, rowIndex);

                      return [
                        ...children,
                        ...this.resource.children.map((resource, colIndex) => {
                          const field = row.createChild({
                            ...resource,
                            index: colIndex
                          });
                          return {
                            class: "td table-cell",
                            init: td => {
                              if (resource.style) {
                                td.element.style = resource.style;
                              }
                              td.element.tabIndex = -1;
                            },
                            update: td => {
                              // const isCellSelected = selection && selection instanceof KarmaFieldsAlpha.Selection && selection.containsCell(rowIndex, colIndex);
                              const isCellSelected = selection && KarmaFieldsAlpha.Selection.containCell(selection, rowIndex, colIndex);

                              td.element.classList.toggle("selected", Boolean(isRowSelected));
                              td.element.classList.toggle("selected-cell", Boolean(isCellSelected));



                            },
                            child: field.build()
                          };
                        })
                      ];
                    }, [])
                  ];

                  grid.element.style.gridTemplateColumns = this.resource.children.map(resource => resource.width || "auto").join(" ");

                } else {
                  grid.children = [];
                  grid.element.classList.remove("filled");
                }

              }

            }
            // complete: async grid => {
            //   // if (document.activeElement === document.body) {
            //   //   // const jsonData = await this.parent.request("export");
            //   //   const jsonData = await this.exportSelection();
            //   //   const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(jsonData);
            //   //   const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
            //   //   this.clipboard.output(value);
            //   //   this.clipboard.focus();
            //   // }
            //
            //   // const selection = this.parent.getSelection();
            //   //
            //   // if (selection && selection instanceof KarmaFieldsAlpha.Selection) {
            //   //
            //   //
            //   // }
            // }
          }
        ];
      }
    }

  }

  // build() {
  //
  //   return {
  //     class: "karma-field-table-grid-container karma-field-frame karma-field-group final scroll-container",
  //     init: body => {
  //       body.element.tabIndex = -1;
  //     },
  //     update: body => {
  //       this.clipboard = this.createChild("clipboard");
  //       this.cellClipboard = this.createChild("clipboard");
  //       body.element.onfocus = async event => {
  //         const selection = this.selectionBuffer.get();
  //         if (selection) {
  //           KarmaFieldsAlpha.History.save();
  //           this.selectionBuffer.change(null);
  //           await this.parent.request("render");
  //         }
  //         this.clipboard.output("");
  //         this.clipboard.focus();
  //       }
  //       body.children = [
  //         this.cellClipboard.build(),
  //         this.clipboard.build(),
  //         {
  //           class: "table grid",
  //           init: async grid => {
  //             if (this.resource.style) {
  //               grid.element.style = this.resource.style;
  //             }
  //           },
  //           update: async grid => {
  //
  //             const ids = this.getIds();
  //             const page = this.getPage();
  //             const ppp = this.getPpp();
  //             const offset = (page - 1)*ppp;
  //             const columns = this.getColumns();
  //
  //             this.clipboard.onInput = async value => {
  //               const dataArray = KarmaFieldsAlpha.Clipboard.parse(value);
  //               const data = KarmaFieldsAlpha.Clipboard.toJson(dataArray);
  //
  //               // this.parent.request("import", {data: data});
  //
  //               const selection = this.selectionBuffer.get() || {};
  //
  //               if (selection.length || data.length) {
  //                 KarmaFieldsAlpha.History.save();
  //                 await this.import(data, selection.index, selection.length);
  //                 this.selectionBuffer.change(null);
  //                 await this.parent.request("render");
  //               }
  //
  //             }
  //
  //             this.cellClipboard.onInput = async value => {
  //               if (this.cellSelection) {
  //                 KarmaFieldsAlpha.History.save();
  //                 const dataArray = KarmaFieldsAlpha.Clipboard.parse(value);
  //                 // await this.parent.request("import-cells", {data: dataArray, rectangle: this.cellSelection});
  //                 await this.importCells(dataArray, this.cellSelection);
  //                 await this.parent.request("render");
  //               }
  //             }
  //
  //             this.cellClipboard.onBlur = event => {
  //               if (this.cellSelection) {
  //                 const selectionManager = new KarmaFieldsAlpha.CellManager(grid.element);
  //                 selectionManager.clearCells(this.cellSelection);
  //               }
  //             }
  //
  //             const selection = this.selectionBuffer.get();
  //
  //             grid.element.colCount = columns.length;
  //             grid.element.rowCount = ids.length;
  //             grid.element.colHeader = 1;
  //             grid.element.rowHeader = 0;
  //
  //
  //             if (ids.length) {
  //               grid.element.classList.add("filled"); // -> draw table borders
  //               grid.children = [
  //                 ...columns.map((colId, colIndex) => {
  //                   const child = this.resource.children[colId];
  //                   return {
  //                     class: "th table-header-cell",
  //                     init: th => {
  //                       if (child.style) {
  //                         th.element.style = child.style;
  //                       }
  //                       th.element.tabIndex = -1;
  //                     },
  //                     update: th => {
  //                       th.children = [
  //                         {
  //                           tag: "a",
  //                           class: "header-cell-title",
  //                           init: a => {
  //                             a.element.textContent = child.label;
  //                           }
  //                         },
  //                         {
  //                           tag: "a",
  //                           class: "header-cell-order",
  //                           child: {
  //                             tag: "span",
  //                             class: "dashicons",
  //                             update: async span => {
  //                               // const order = await this.parent.request("order");
  //                               // const order = KarmaFieldsAlpha.Nav.get("order") || this.resource.params.order;
  //                               const order = this.getOrder() || child.order || "asc";
  //                               // const orderby = await this.parent.request("orderby");
  //                               // const orderby = KarmaFieldsAlpha.Nav.get("orderby") || this.resource.params.orderby;
  //                               const orderby = this.getOrderby();
  //                               const isAsc = orderby === (child.orderby || child.key) && order === "asc";
  //                               const isDesc = orderby === (child.orderby || child.key) && order === "desc";
  //                               span.element.classList.toggle("dashicons-arrow-up", isAsc);
  //                               span.element.classList.toggle("dashicons-arrow-down", isDesc);
  //                               span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
  //                             }
  //                           },
  //                           update: a => {
  //                             a.element.classList.toggle("hidden", !child.sortable);
  //                             if (child.sortable) {
  //                               a.element.onmousedown = event => {
  //                                 event.stopPropagation(); // -> prevent header selection
  //                               }
  //                               a.element.onclick = async event => {
  //                                 event.preventDefault();
  //                                 a.element.parentNode.classList.add("loading");
  //                                 // await this.parent.request("toggle-order", {key: child.orderby || child.key, order: child.order});
  //
  //                                 KarmaFieldsAlpha.History.save();
  //
  //                                 this.toggleOrder(child.orderby || child.key, child.order);
  //                                 this.unselect();
  //
  //                                 await this.queryIds();
  //                                 await this.parent.request("render");
  //
  //                                 a.element.parentNode.classList.remove("loading");
  //                               };
  //                             }
  //                           }
  //                         }
  //                       ];
  //
  //                       th.element.colIndex = colIndex;
  //                       th.element.colHeader = true;
  //
  //                       th.element.onmousedown = async event => {
  //                         if (event.buttons === 1) {
  //                           const selectionManager = new KarmaFieldsAlpha.CellManager(grid.element);
  //                           selectionManager.cellSelection = this.cellSelection;
  //                           selectionManager.onSelectCells = async cellSelection => {
  //                             this.cellSelection = cellSelection;
  //                             // const dataArray = await this.parent.request("export-cells", {rectangle: selection});
  //                             const dataArray = await this.exportCells(cellSelection);
  //                             const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
  //                             this.cellClipboard.output(value);
  //                             this.cellClipboard.focus();
  //                           };
  //                           selectionManager.selectHeaders(event, colIndex);
  //                         }
  //                       }
  //
  //                     }
  //                   };
  //                 }),
  //                 ...ids.reduce((children, id, rowIndex) => {
  //
  //                   const row = this.createChild({
  //                     key: id,
  //                     type: "row",
  //                     children: this.resource.children || [],
  //                     index: offset + rowIndex + 1
  //                   });
  //
  //                   const isSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, rowIndex);
  //
  //                   row.index = offset + rowIndex + 1;
  //                   row.isSelected = isSelected;
  //                   row.rowIndex = rowIndex;
  //
  //                   return [
  //                     ...children,
  //                     ...columns.map((colId, colIndex) => {
  //                       const child = this.resource.children[colId];
  //                       const field = row.createChild(child);
  //                       return {
  //                         class: "td table-cell",
  //                         init: td => {
  //                           if (child.style) {
  //                             td.element.style = child.style;
  //                           }
  //                           td.element.tabIndex = -1;
  //                         },
  //                         update: td => {
  //                           td.element.classList.add("loading");
  //                           td.element.classList.toggle("selected", Boolean(isSelected));
  //                           td.element.classList.remove("selecting-cell");
  //
  //                           td.element.rowIndex = rowIndex;
  //                           td.element.colIndex = colIndex;
  //                           td.element.multiSelectable = true;
  //                           td.element.cellSelectable = field.resource.selectMode !== "row";
  //
  //                           td.element.onmousedown = async event => {
  //
  //                             if (event.buttons === 1) {
  //
  //                               // const cellManager = new KarmaFieldsAlpha.CellManager(grid.element, columns.length, ids.length, 0, 1);
  //                               // const selectionManager = new KarmaFieldsAlpha.SelectionManager(grid.element, columns.length, ids.length, 0, 1);
  //                               //
  //                               // cellManager.selection = this.cellSelection;
  //                               // selectionManager.selection = this.selectionBuffer.get();
  //                               //
  //                               // if (field.resource.selectMode !== "row") {
  //                               //
  //                               //   cellManager.onSelect = async selection => {
  //                               //
  //                               //     this.cellSelection = selection;
  //                               //
  //                               //     if (selection.width*selection.height > 1) {
  //                               //
  //                               //       // const dataArray = await this.parent.request("export-cells", {rectangle: selection});
  //                               //       const dataArray = await this.exportCells(selection);
  //                               //       const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
  //                               //       this.cellClipboard.output(value);
  //                               //       this.cellClipboard.focus();
  //                               //
  //                               //     } else {
  //                               //
  //                               //       cellManager.clear(selection);
  //                               //
  //                               //     }
  //                               //
  //                               //
  //                               //   };
  //                               //
  //                               //   cellManager.selectCells(event, colIndex, rowIndex);
  //                               //
  //                               // } else {
  //                               //
  //                               //   cellManager.clear();
  //                               //
  //                               //   selectionManager.onSelect = async (selection, hasChange) => {
  //                               //     if (hasChange) {
  //                               //       KarmaFieldsAlpha.History.save();
  //                               //       this.selectionBuffer.change(selection);
  //                               //     }
  //                               //
  //                               //     // const jsonData = await this.parent.request("export");
  //                               //     const jsonData = await this.export([], selection.index, selection.length);
  //                               //     const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(jsonData);
  //                               //     const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
  //                               //     this.clipboard.output(value);
  //                               //     this.clipboard.focus();
  //                               //     await this.parent.request("render");
  //                               //
  //                               //   };
  //                               //
  //                               //   selectionManager.select(event, colIndex, rowIndex);
  //                               //
  //                               // }
  //
  //                               const selectionManager = new KarmaFieldsAlpha.CellManager(grid.element);
  //
  //                               const currentSelection = selectionManager.selection = this.selectionBuffer.get();
  //
  //                               selectionManager.onSelectCells = async cellSelection => {
  //
  //                                 this.cellSelection = cellSelection;
  //
  //                                 const dataArray = await this.exportCells(cellSelection);
  //                                 const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
  //                                 this.cellClipboard.output(value);
  //                                 this.cellClipboard.focus();
  //
  //                               };
  //
  //                               selectionManager.onSelect = async (selection) => {
  //
  //                                 if (!KarmaFieldsAlpha.Segment.compare(currentSelection, selection)) {
  //                                   KarmaFieldsAlpha.History.save();
  //                                   this.selectionBuffer.change(selection, currentSelection);
  //                                 }
  //
  //                                 // const jsonData = await this.parent.request("export");
  //                                 const jsonData = await this.export([], selection.index, selection.length);
  //                                 const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(jsonData);
  //                                 const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
  //                                 this.clipboard.output(value);
  //                                 this.clipboard.focus();
  //                                 await this.parent.request("render");
  //
  //                               };
  //
  //                               selectionManager.select(event, colIndex, rowIndex, field.resource.selectMode !== "row");
  //
  //                             }
  //
  //                           }
  //
  //                         },
  //                         complete: td => {
  //                           td.element.classList.remove("loading");
  //                         },
  //                         child: field.build()
  //                       };
  //                     })
  //                   ];
  //                 }, [])
  //               ];
  //
  //               grid.element.style.gridTemplateColumns = columns.map(index => this.resource.children[index].width || "auto").join(" ");
  //
  //             } else {
  //               grid.children = [];
  //               grid.element.classList.remove("filled");
  //             }
  //           },
  //           complete: async grid => {
  //             if (document.activeElement === document.body) {
  //               // const jsonData = await this.parent.request("export");
  //               const jsonData = await this.exportSelection();
  //               const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(jsonData);
  //               const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
  //               this.clipboard.output(value);
  //               this.clipboard.focus();
  //             }
  //           }
  //         }
  //       ];
  //     }
  //   }
  //
  // }



  // static row = class extends KarmaFieldsAlpha.field {
  //
  //   async request(subject, content, ...path) {
  //
  //     switch (subject) {
  //
  //       case "index":
  //         return this.index;
  //
  //       default:
  //         return super.request(subject, content, this.getKey(), ...path);
  //     }
  //
  //   }
  //
  //   getKeys() {
  //
  //     let keys = new Set();
  //
  //     for (let resource of this.resource.children) {
  //
  //       keys = new Set([...keys, ...this.createChild(resource).getKeys()]);
  //
  //     }
  //
  //     return keys;
  //   }
  //
  //   async getDefault() {
  //
  //     let defaults = {};
  //
  //     for (let index in this.resource.children) {
  //
  //       const child = this.createChild(this.resource.children[index]);
  //
  //       defaults = {
  //         ...defaults,
  //         ...await child.getDefault()
  //       };
  //
  //     }
  //
  //     return defaults;
  //   }
  //
  //   async export(keys = []) {
  //
  //     let object = {};
  //
  //     for (let resource of this.resource.children) {
  //
  //       const child = this.createChild(resource);
  //
  //       object = {
  //         ...object,
  //         ...await child.export(keys)
  //       };
  //
  //     }
  //
  //     return object;
  //   }
  //
  //   async import(object) {
  //
  //     for (let resource of this.resource.children) {
  //
  //       const child = this.createChild(resource);
  //
  //       await child.import(object);
  //
  //     }
  //
  //   }
  //
  //
  //
  //   static handle = class extends KarmaFieldsAlpha.field.text {
  //
  //     constructor(resource) {
  //       super({
  //         selectMode: "row",
  //         ...resource
  //       });
  //     }
  //
  //     build() {
  //       return {
  //         tag: this.resource.tag,
  //         class: "text karma-field modal-btn",
  //         init: node => {
  //           // node.element.tabIndex = -1;
  //         },
  //         update: async node => {
  //           node.element.innerHTML = await this.getContent();
  //         }
  //       };
  //     }
  //
  //   }
  //
  //   static modalHandle = class extends this.handle {}; // -> compat
  //
  //   static tableIndex = class extends this.handle {
  //
  //     constructor(resource) {
  //       super({
  //         width: "40px",
  //         selectMode: "row",
  //         ...resource
  //       });
  //
  //     }
  //
  //     build() {
  //       return {
  //         class: "karma-field text",
  //         update: async container => {
  //           container.element.textContent = await this.parent.request("index");
  //         }
  //       };
  //     }
  //
  //   }
  //
  //
  // }


  // static modal = class extends KarmaFieldsAlpha.field.table.modal {
  //
  //   async request(subject, content, ...path) {
  //
  //     switch (subject) {
  //
  //       case "close": {
  //         return this.parent.request("unselect");
  //       }
  //
  //       case "state": {
  //
  //         const ids = await this.parent.request("selectedIds");
  //
  //         if (ids.length === 1) {
  //
  //           return this.parent.request("state", {}, ids[0], ...path);
  //
  //         } else if (ids.length > 1) {
  //
  //           const response = {
  //             values: [],
  //             multi: true
  //           };
  //
  //           for (id of ids) {
  //
  //             const state = await this.parent.request("state", {}, id, ...path);
  //
  //             response.values.push(state.value);
  //
  //             if (response.value === undefined || KarmaFieldsAlpha.DeepObject.equal(response.value, state.value)) {
  //
  //               response.value = state.value;
  //
  //             } else {
  //
  //               response.value = null;
  //
  //             }
  //
  //             response.alike = response.value !== null;
  //             response.modified = Boolean(response.modified || state.modified);
  //
  //           }
  //
  //           return response;
  //
  //         } else {
  //
  //           return {};
  //
  //         }
  //
  //       }
  //
  //       default: {
  //         const [id] = await this.parent.request("selectedIds");
  //
  //         if (id) {
  //
  //           path = [id, ...path];
  //
  //         }
  //
  //         return this.parent.request(subject, content, ...path);
  //       }
  //
  //     }
  //
  //   }
  //
  // }








}

KarmaFieldsAlpha.field.grid.row = class extends KarmaFieldsAlpha.field {

  getValue(key) {

    if  (this.resource.id !== null) { // -> id is null while being added

      return this.parent.getValue(this.resource.id, key);

    }

  }

  setValue(value, key) {

    if (this.resource.id !== null) { // -> id is null while being added. Should never happen.

      this.parent.setValue(value, this.resource.id, key);

    }

  }

  modified(key) {

    if (this.resource.id !== null) { // -> id is null while being added. Should never happen.

      return this.parent.modified(this.resource.id, key);

    }

  }

  getIndex() {

    return this.resource.index;

  }

  // setSelection(selection) {
  //
  //   if (selection) {
  //
  //     const parentSelection = new KarmaFieldsAlpha.Selection(this.resource.index, 1);
  //
  //     parentSelection[this.resource.index] = selection;
  //
  //     this.parent.setSelection(parentSelection);
  //
  //   } else {
  //
  //     super.setSelection(selection);
  //
  //   }
  //
  //
  //
  //   // console.log("modal setSelection", selection, parentSelection);
  //
  //
  // }

  setSelection(selection) {

    const parentSelection = this.parent.getSelection();

    this.parent.setSelection(selection && parentSelection && {
      [this.resource.index]: selection,
      index: parentSelection.index,
      length: parentSelection.length,
      colIndex: parentSelection.colIndex,
      colLength: parentSelection.colLength,
      final: false
    });

  }

}


KarmaFieldsAlpha.field.grid.row.index = {
  type: "text",
  value: ["index"],
  width: "5em"
};

KarmaFieldsAlpha.field.grid.row.delete = {
  type: "button",
  action: "delete",
  value: ["index"],
  title: "Delete",
  dashicon: "no-alt",
  width: "auto"
};

KarmaFieldsAlpha.field.grid.row.sortArrows = {
  type: "group",
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
  ]
};




// KarmaFieldsAlpha.field.grid.modal = class extends KarmaFieldsAlpha.field.container {
//
//   // constructor(resource) {
//   //
//   //   super(resource);
//   //
//   //   const data = this.getData();
//   //
//   //   data.index = resource.selection.index;
//   //   data.length = resource.selection.length;
//   //
//   // }
//
//   getValue(key) {
//
//     let array;
//
//     const ids = this.parent.getSelectedIds();
//
//     for (let id of ids) {
//
//       const values = this.parent.getValue(id, key);
//
//       if (!array) {
//
//         array = values;
//
//       } else if (KarmaFieldsAlpha.DeepObject.differ(array, values)) {
//
//         array = [];
//         break;
//
//       }
//
//     }
//
//     return array;
//
//   }
//
//   setValue(value, key) {
//
//     const ids = this.parent.getSelectedIds();
//
//     if (ids) {
//
//       if (ids.length === 1) {
//
//         this.parent.setValue(value, ids[0], key); // -> one item / multiple or single value
//
//       } else if (!Array.isArray(value) || value.length === 1) {
//
//         ids.forEach(id => void this.parent.setValue(value[0], id, key)); // -> multiple items / single value
//
//       } else if (Array.isArray(value) && value.length === ids.length) {
//
//         ids.forEach((id, index) => void this.parent.setValue(value[index], id, key)); // -> multiple items / multiple values
//
//       } else {
//
//         console.error("values count does not match items count");
//
//       }
//
//     }
//
//   }
//
//   setSelection(selection) {
//
//     // console.log("modal", selection);
//
//     if (selection) {
//
//       const parentSelection = new KarmaFieldsAlpha.Selection();
//       const parentData = this.parent.getData().selection;
//       parentSelection.index = parentData.index || 0;
//       parentSelection.length = parentData.length || 0;
//       parentSelection[this.resource.index] = selection;
//
//       this.parent.setSelection(parentSelection);
//
//     } else {
//
//       super.setSelection(selection);
//
//     }
//
//
//
//     // console.log("modal setSelection", selection, parentSelection);
//
//
//   }
//
//   build() {
//
//     return {
//       class: "modal-field",
//       init: modal => {
//         modal.element.tabIndex = -1;
//       },
//       update: modal => {
//         // modal.element.onfocusin = event => {
//         //
//         //   const parentSelection = new KarmaFieldsAlpha.Selection();
//         //   const parentData = this.parent.getData().selection;
//         //   parentSelection.index = parentData.index || 0;
//         //   parentSelection.length = parentData.length || 0;
//         //   // parentSelection[this.resource.index] = selection;
//         //
//         //   const [string] = this.parent.export([], parentSelection.index, parentSelection.length);
//         //
//         //   KarmaFieldsAlpha.Clipboard.write(string);
//         //
//         //   this.parent.setSelection(parentSelection);
//         //
//         //
//         // }
//
//         modal.element.onfocusin = event => {
//
//           // const parentSelection = this.parent.getSelection();
//
//           // console.log(parentSelection);
//
//           // KarmaFieldsAlpha.Clipboard.getElement().onfocusout = event => {
//           //   // event.preventDefault();
//           //   // event.stopPropagation();
//           //
//           //   const selection = new KarmaFieldsAlpha.Selection();
//           //   this.setSelection(selection);
//           //
//           // }
//
//           // console.log("modal focusin", document.activeElement);
//
//           // const selection = this.getSelection();
//
//           // console.log(document.activeElement, document.activeElement === modal.element);
//
//           if (document.activeElement === modal.element) {
//
//             const parentSelection = new KarmaFieldsAlpha.Selection();
//             const parentData = this.parent.getData().selection;
//             parentSelection.index = parentData.index || 0;
//             parentSelection.length = parentData.length || 0;
//             // parentSelection[this.resource.index] = selection;
//
//             const [string] = this.parent.export([], parentSelection.index, parentSelection.length);
//
//             KarmaFieldsAlpha.Clipboard.write(string);
//
//             this.parent.setSelection(parentSelection);
//
//             KarmaFieldsAlpha.Clipboard.getElement().onfocusout = event => {
//
//               console.log("clipboard onfocusout", document.activeElement);
//
//               const selection = this.getSelection();
//               this.setSelection(selection);
//               this.render();
//             }
//
//           }
//
//
//
//
//         }
//
//         // modal.element.onfocusout = event => {
//         //
//         //   // console.log("module onfocusout", document.activeElement, modal.element);
//         //
//         //   this.setSelection();
//         //   this.parent.render();
//         // }
//
//         // modal.element.onfocusin = event => {
//         //
//         //   console.log("focusin");
//         //   const selection = new KarmaFieldsAlpha.Selection();
//         //   this.setSelection(selection);
//         // }
//         // modal.element.onfocusout = event => {
//         //   this.setSelection();
//         // }
//       },
//       child: super.build()
//     }
//
//
//   }
//
// }


// KarmaFieldsAlpha.field.grid.index = class extends KarmaFieldsAlpha.field.text {
//
//   constructor(resource) {
//     super({
//       width: "40px",
//       ...resource
//     });
//
//   }
//
//   build() {
//     return {
//       class: "karma-field text",
//       update: async container => {
//         container.element.textContent = this.parent.request("getIndex");
//       }
//     };
//   }
//
// }

KarmaFieldsAlpha.field.grid.row.index = {
  type: "text",
  value: ["+", ["request", "getIndex"], 1],
  style: "width: 40px"
};
