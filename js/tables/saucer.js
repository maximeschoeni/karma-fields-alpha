
KarmaFieldsAlpha.field.saucer = class extends KarmaFieldsAlpha.field {

  // static pile = [];

  constructor(resources) {
    super(resources);

    this.pile = [];

    // KarmaFieldsAlpha.tables = this; // -> debug
    //
    // this.buffer = new KarmaFieldsAlpha.Buffer();
    //
    // this.dataBuffer = new KarmaFieldsAlpha.Buffer("data");
    // this.initialBuffer = new KarmaFieldsAlpha.Buffer("gateway");
    // this.trashBuffer = new KarmaFieldsAlpha.Buffer("trash");

  }

  // getResource(tableId) {
  //
  //   if (!tableId) {
  //
  //     tableId = KarmaFieldsAlpha.Nav.get("table");
  //
  //   }
  //
  //   const resource = this.resource.tables.find(resource => resource.id === tableId);
  //
  //   if (resource) {
  //
  //     // compat
  //
  //     if (resource.columns) {
  //       resource.children = resource.columns.map(column => {
  //         return {
  //           ...column,
  //           ...column.field
  //         };
  //       });
  //     }
  //
  //     if (resource.children) {
  //
  //       resource.body = {
  //         type: "table",
  //         children: resource.children,
  //         id: resource.driver,
  //         params: resource.params,
  //         joins: resource.joins,
  //         ...resource.body
  //       }
  //
  //       if (typeof resource.driver === "string") {
  //
  //         const [request, ...joins] = resource.driver.split("+");
  //         const [driver, paramString] = request.split("?");
  //
  //         resource.body.driver = driver;
  //         resource.body.params = KarmaFieldsAlpha.Params.parse(paramString);
  //         resource.body.joins = joins
  //
  //       } else if (resource.driver && typeof resource.driver === "object") {
  //
  //         resource.body.driver = resource.driver.name;
  //         resource.body.params = resource.params || resource.driver.params;
  //         resource.body.joins = resource.joins || resource.driver.joins || [];
  //
  //       }
  //
  //       if (resource.style) {
  //         resource.body.style = resource.style;
  //       }
  //
  //     }
  //
  //   }
  //
  //   return resource;
  // }

  getTable(tableId) {

    if (!tableId) {

      tableId = this.getParam("table");

      // tableId = KarmaFieldsAlpha.Query.table;

    }

    const resource = this.resource[tableId];

    if (resource) {

      return this.createChild(resource.body);

    }

  }

  // async save() {
  //
  //   const data = this.dataBuffer.get();
  //   KarmaFieldsAlpha.saving = true;
  //
  //   this.initialBuffer.merge(data); // -> needed for autosave
  //
  //
  //
  //
  //
  //   for (let driver in data) {
  //
  //     for (let id in data[driver]) {
  //
  //       await this.render();
  //
  //       await KarmaFieldsAlpha.Gateway.post(`update/${driver}/${id}`, data[driver][id]);
  //
  //     }
  //
  //   }
  //
  //   KarmaFieldsAlpha.saving = false;
  //
  //   this.dataBuffer.remove();
  //
  //   await this.render();
  //
  // }


  getData() {

    if (!KarmaFieldsAlpha.field.data) {

      KarmaFieldsAlpha.field.data = {};

    }

    if (!KarmaFieldsAlpha.field.data[this.resource.index]) {

      KarmaFieldsAlpha.field.data[this.resource.index] = {};

    }

    return KarmaFieldsAlpha.field.data[this.resource.index];

    // return KarmaFieldsAlpha.field.getData();

  }

  getParam(key) {

    // const state = KarmaFieldsAlpha.History.getState();
    //
    // if (state.nav && state.nav[key] !== undefined) {
    //
    //   return [state.nav[key]];
    //
    // }
    //
    // return [];

    if (key === "table") {

      return KarmaFieldsAlpha.Query.table;

    }

    if (KarmaFieldsAlpha.Query.params) {

      return KarmaFieldsAlpha.Query.params[key];

    }

  }

  getValue(key) {

    const param = this.getParam(key);

    return KarmaFieldsAlpha.Type.toArray(param);

  }

  setParam(value, key) {

    const currentValue = this.getParam(key);




    // const state = KarmaFieldsAlpha.History.getState();
    // const currentNav = state.nav;

    // state.nav = {page: 1, ppp: 100, ...state.nav, [key]: value};

		if (value !== currentValue) {

      if (key === "table") {

        KarmaFieldsAlpha.History.backup(value, currentValue, "table");
        KarmaFieldsAlpha.Query.table = value;

      } else {

        KarmaFieldsAlpha.History.backup(value, currentValue, "nav", key);
        KarmaFieldsAlpha.Query.params[key] = value;

      }




      if (KarmaFieldsAlpha.Query.params.page && KarmaFieldsAlpha.Query.params.page !== 1) {

        KarmaFieldsAlpha.History.backup(1, KarmaFieldsAlpha.Query.params.page, "nav", "page");
        KarmaFieldsAlpha.Query.params.page = 1;

      }

      // state.ids = this.getTable().getIds();

      if (KarmaFieldsAlpha.Query.ids) {

        // state.ids = KarmaFieldsAlpha.Query.ids;

        // KarmaFieldsAlpha.History.set(KarmaFieldsAlpha.Query.ids, "ids");
        KarmaFieldsAlpha.History.backup(null, KarmaFieldsAlpha.Query.ids, "ids");

        delete KarmaFieldsAlpha.Query.ids;

      }


      // KarmaFieldsAlpha.History.setState(state);

		}

    this.save();
    this.render();

  }

  setValue(value, key) {

    value = KarmaFieldsAlpha.Type.toString(value);

    this.setParam(value);

    // const state = KarmaFieldsAlpha.History.getState();
    // const currentNav = state.nav;
    //
    // state.nav = {page: 1, ppp: 100, ...state.nav, [key]: value};
    //
		// if (KarmaFieldsAlpha.DeepObject.differ(state.nav, currentNav)) {
    //
    //   KarmaFieldsAlpha.History.backup(state.nav, currentNav, "nav");
    //
    //   // state.ids = this.getTable().getIds();
    //
    //   if (KarmaFieldsAlpha.Query.ids) {
    //
    //     state.ids = KarmaFieldsAlpha.Query.ids;
    //     delete KarmaFieldsAlpha.Query.ids;
    //
    //   }
    //
    //
    //   KarmaFieldsAlpha.History.setState(state);
    //
		// }
    //
    // this.save();
    // this.render();

  }

  modified(...path) {

    // return KarmaFieldsAlpha.Terminal.modified(...path);

    return false;

  }


  save() {

    this.debounce("saving", () => KarmaFieldsAlpha.History.save(), 1000);

  }

  hasUndo() {
    return KarmaFieldsAlpha.History.hasUndo();
  }

  hasRedo() {
    return KarmaFieldsAlpha.History.hasRedo();
  }

  getSelection() {

    return KarmaFieldsAlpha.Selection.get(this.resource.index);

  }

  setSelection(value) {


    KarmaFieldsAlpha.Selection.set(value, this.resource.index);

    // this.render();

  }

  clearSelection() {

    const selection = this.getSelection();

    if (selection) {

      for (let tableId in this.resource.tables) {

        if (selection[tableId]) {

          const table = this.createChild({
            type: "table",
            ...this.resource.tables[tableId],
            index: tableId
          });

          table.clearSelection(selection[tableId]);

        }

      }

    } else {

      this.setSelection();

    }

  }

  send() {

    KarmaFieldsAlpha.Delta.send();

    this.render();
  }

  hasChange() {

    return KarmaFieldsAlpha.DeepObject.isIncluded(KarmaFieldsAlpha.Delta.object, KarmaFieldsAlpha.Query.vars);

  }

  close() {

    // const state = KarmaFieldsAlpha.History.getState();
    // const currentNav = state.nav;
    //
    // state.nav = {};
    //
    // KarmaFieldsAlpha.History.backup(state.nav, currentNav, "nav");
    // KarmaFieldsAlpha.History.setState(state);


    KarmaFieldsAlpha.History.backup(null, KarmaFieldsAlpha.Query.table, "table");
    KarmaFieldsAlpha.Query.table = null;


    this.save();
    this.render();

  }

  getPage() {
    return this.getParam("page") || 1;
  }

  count() {
    const table = this.getTable();

    if (table) {

      const driver = table.resource.driver;
      const params = table.getCountParams();

      return KarmaFieldsAlpha.Query.getCount(driver, params);

    }

    return 0;
  }

  ppp() {

    const table = this.getTable();

    if (table) {

      const params = table.getParams();

      return params.ppp || 100;

    }

    return 1;
  }

  getNumPage() {

    const count = this.count();

    if (count !== undefined) {

      const ppp = this.ppp();

      return Math.max(1, Math.ceil(count/ppp));

    }

  }

  isFirstPage() {
    return this.getPage() === 1;
  }

  isLastPage() {
    return this.getPage() === this.getNumPage();
  }

  firstPage() {

    const page = this.getPage();

    if (page > 1) {

      this.setParam(1, "page");

    }

  }

  prevPage() {

    const page = this.getPage();

    if (page > 1) {

      this.setParam(page-1, "page");

    }

  }

  nextPage() {

    const page = this.getPage();
    const numPage = this.getNumPage();

    if (page < numPage) {

      this.setParam(page+1, "page");

    }

  }

  lastPage() {

    const page = this.getPage();
    const numPage = this.getNumPage();

    if (page < numPage) {

      this.setParam(numPage, "page");

    }

  }



  add() {

    const table = this.getTable();

    if (table && table.add) {

      table.add();

      this.save();
      this.render();

    }

  }

  delete() {

    const table = this.getTable();

    if (table && table.remove) {

      table.delete();

      this.save();
      this.render();

    }

  }



  render() {

    // this.debounce("rendering", () => void popup.render(), 500);


  }




  // async request(subject, content = {}, ...path) {
  //
  //   switch (subject) {
  //
  //     // single
  //
  //     // case "state": {
  //     //   const [key] = path;
  //     //   return {value: KarmaFieldsAlpha.Nav.get(key) || ""};
  //     // }
  //
  //     case "get": {
  //       const [key] = path;
  //       return KarmaFieldsAlpha.Type.toArray(KarmaFieldsAlpha.Nav.get(key) || "");
  //     }
  //
  //     case "set": {
  //       const [key] = path;
  //
  //       const value = KarmaFieldsAlpha.Type.toString(content) || "";
  //       const current = KarmaFieldsAlpha.Nav.get(key) || "";
  //
  //       if (value !== current) {
  //
  //         KarmaFieldsAlpha.Nav.change(value, current, key);
  //
  //         const page = KarmaFieldsAlpha.Nav.get("page") || "1";
  //
  //         if (page !== "1") {
  //
  //           KarmaFieldsAlpha.Nav.change(1, page, "page");
  //
  //         }
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "modified": {
  //
  //       const delta = this.dataBuffer.get();
  //
  //   		if (delta) {
  //
  // 			  // return KarmaFieldsAlpha.DeepObject.differ(delta, {
  //         //   ...await this.trashBuffer.get(),
  //         //   ...await this.initialBuffer.get()
  //         // });
  //
  //         return KarmaFieldsAlpha.DeepObject.differ(delta, KarmaFieldsAlpha.Query.vars);
  //
  //
  //   		}
  //
  //   		return false;
  //
  //
  //       // const table = this.getTable();
  //       //
  //       // if (table && table.isModified) {
  //       //
  //       //   return table.isModified();
  //       //
  //       // }
  //       //
  //       // return false;
  //     }
  //
  //     case "query-ids": // -> compat
  //     case "load": {
  //       const table = this.getTable();
  //
  //       // if (table && table.load) {
  //
  //       //   await table.load();
  //
  //       // }
  //
  //       break;
  //     }
  //
  //     // -> like get_post()
  //     // -> for media breadcrumb (ancestors)
  //     // DEPRECATED
  //     case "queryid": {
  //
  //       const table = this.getTable();
  //
  //
  //       if (table && table.query) {
  //
  //         // const [result] = await table.query({
  //         //   ids: [content.id]
  //         // });
  //
  //         // return result;
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "edit": {
  //
  //       const table = this.getTable();
  //
  //       if (table) {
  //
  //         if (table.unselect) {
  //
  //           table.unselect(); // when filter change
  //
  //         }
  //
  //         // table.cache.empty(); // buffer need to stay for history
  //
  //         // await table.load();
  //
  //
  //         KarmaFieldsAlpha.Query.reset();
  //
  //         this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "has-undo": {
  //       return KarmaFieldsAlpha.History.hasUndo();
  //     }
  //
  //     case "has-redo": {
  //       return KarmaFieldsAlpha.History.hasRedo();
  //     }
  //
  //     case "reload": {
  //
  //       const table = this.getTable();
  //
  //       if (table) {
  //
  //         // table.initialBuffer.empty();
  //         // table.cache.empty();
  //
  //         // await table.load();
  //
  //         KarmaFieldsAlpha.Query.empty();
  //
  //         this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "export": {
  //
  //       const table = this.getTable();
  //
  //       if (table) {
  //
  //         return table.export(content.keys, content.index, content.length);
  //
  //       }
  //
  //       break;
  //
  //     }
  //
  //     case "import": {
  //
  //       const table = this.getTable();
  //
  //       if (table) {
  //
  //         const data = content.data || [];
  //         const index = content.index || 9999999;
  //         const length = content.length || 0;
  //
  //         if (data.length || content.length > 0) {
  //
  //           KarmaFieldsAlpha.History.save();
  //
  //           table.import(data, index, length);
  //
  //           this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "save": {
  //
  //       // const data = this.dataBuffer.get();
  //
  //   		// this.initialBuffer.merge(data); // -> needed for autosave
  //
  //       // for (let driver in data) {
  //
  //     	// 	for (let id in data[driver]) {
  //
  //     	// 		await KarmaFieldsAlpha.Gateway.post(`update/${driver}/${id}`, data[driver][id]);
  //
  //     	// 	}
  //
  //       // }
  //
  //   		// this.dataBuffer.remove();
  //
  //       this.save();
  //
  //       // this.render();
  //
  //
  //
  //       // const table = this.getTable();
  //       //
  //       // if (table && table.send) {
  //       //
  //       //   await table.send();
  //       //   await this.render();
  //       //
  //       // }
  //
  //       break;
  //     }
  //
  //     case "undo": {
  //       KarmaFieldsAlpha.History.undo();
  //       return this.render();
  //     }
  //
  //     case "redo": {
  //       KarmaFieldsAlpha.History.redo();
  //       return this.render();
  //     }
  //
  //     case "close": {
  //
  //       const table = this.getTable();
  //
  //       if (table) {
  //
  //         // if (table.cache) {
  //
  //         //   table.cache.empty(); // buffer need to stay for history
  //
  //         // }
  //
  //         KarmaFieldsAlpha.History.save();
  //
  //         if (table.unselect) {
  //
  //           table.unselect();
  //
  //         }
  //
  //         // await table.unload();
  //
  //         KarmaFieldsAlpha.Nav.remove();
  //         KarmaFieldsAlpha.History.buffer.remove("history"); // ?
  //
  //         KarmaFieldsAlpha.Query.empty();
  //
  //         this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "prev": {
  //       // let selection = this.interface.selectionBuffer.get();
  //       // if (selection && selection.index > 0) {
  //       //   KarmaFieldsAlpha.History.save();
  //       //   this.interface.select(selection.index - 1, 1);
  //       //   await this.render();
  //       // }
  //       break;
  //     }
  //
  //     case "next": {
  //       // let selection = this.interface.selectionBuffer.get();
  //       // const ids = this.interface.getIds();
  //       // if (selection && selection.index < ids.length - 1) {
  //       //   KarmaFieldsAlpha.History.save();
  //       //   this.interface.select(selection.index + 1, 1);
  //       //   await this.render();
  //       // }
  //       break;
  //     }
  //
  //
  //
  //
  //
  //     // collections
  //
  //     case "selection": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getSelection) {
  //
  //         return table.getSelection();
  //
  //       }
  //
  //       return;
  //     }
  //
  //     case "count": {
  //
  //       const table = this.getTable();
  //
  //       // if (table && table.getCount) {
  //
  //       //   return table.getCount();
  //
  //       // }
  //
  //       if (table && table.getCountParams) {
  //
  //         return KarmaFieldsAlpha.Query.getCount(table.resource.driver, table.getCountParams()) || 0;
  //
  //       }
  //
  //
  //       return 1;
  //     }
  //
  //     case "page": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getPage) {
  //
  //         return table.getPage();
  //
  //       }
  //
  //       return 1;
  //     }
  //
  //
  //
  //     case "ppp": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getPpp) {
  //
  //         return table.getPpp();
  //
  //       }
  //
  //       return 1;
  //     }
  //
  //     case "isLastpage": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getPage && table.getNumPage) {
  //
  //         return table.getPage() === table.getNumPage();
  //
  //       }
  //
  //       return true;
  //     }
  //
  //     case "numpage": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getNumPage) {
  //
  //         return table.getNumPage();
  //
  //       }
  //
  //       return 1;
  //     }
  //
  //     case "nextpage": {
  //
  //       const table = this.getTable();
  //
  //       // if (table && table.getPage && table.getNumPage) {
  //       if (table && table.getPage && table.changePage) {
  //
  //         const page = table.getPage();
  //
  //         table.changePage(page+1);
  //
  //         // const numpage = await table.getNumPage();
  //         //
  //         // if (page < numpage) {
  //         //
  //         //   KarmaFieldsAlpha.History.save();
  //         //   KarmaFieldsAlpha.Nav.change(page+1, page, "page");
  //         //
  //         //   table.unselect();
  //         //
  //         //   await table.loads();
  //         //   await this.render();
  //         //
  //         // }
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "prevpage": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getPage) {
  //
  //         const page = table.getPage();
  //
  //         if (page > 1) {
  //
  //           KarmaFieldsAlpha.History.save();
  //           KarmaFieldsAlpha.Nav.change(page-1, page, "page");
  //
  //           table.selectionBuffer.remove();
  //
  //           // await table.load();
  //           KarmaFieldsAlpha.Query.reset();
  //           this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "firstpage": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getPage) {
  //
  //         const page = table.getPage();
  //
  //         if (page > 1) {
  //
  //           KarmaFieldsAlpha.History.save();
  //           KarmaFieldsAlpha.Nav.change(1, page, "page");
  //
  //           table.selectionBuffer.remove();
  //
  //           // await table.load();
  //           KarmaFieldsAlpha.Query.reset();
  //           this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "lastpage": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getPage && table.getNumPage) {
  //
  //         const page = table.getPage();
  //         const numpage = table.getNumPage();
  //
  //         if (page > 1) {
  //
  //           KarmaFieldsAlpha.History.save();
  //           KarmaFieldsAlpha.Nav.change(numpage, page, "page");
  //
  //           table.selectionBuffer.remove();
  //
  //           // await table.load();
  //           KarmaFieldsAlpha.Query.reset();
  //           this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //
  //     }
  //
  //     case "add": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.add) {
  //
  //         KarmaFieldsAlpha.History.save();
  //
  //         const index = content.index || table.resource.add_index || 0;
  //
  //         const id = await table.add(content.params, index);
  //
  //         table.selectionBuffer.change({index: index, length: 1});
  //
  //         await this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "delete": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.remove && table.selectionBuffer) {
  //
  //         const selection = table.selectionBuffer.get();
  //
  //         if (selection) {
  //
  //           KarmaFieldsAlpha.History.save();
  //
  //           table.selectionBuffer.remove();
  //
  //           await table.remove(selection.index, selection.length);
  //           await this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "duplicate": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.remove && table.selectionBuffer) {
  //
  //         const selection = table.selectionBuffer.get();
  //
  //         if (selection) {
  //
  //           KarmaFieldsAlpha.History.save();
  //
  //           table.selectionBuffer.remove();
  //
  //           await table.duplicate(selection.index, selection.length);
  //           await this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //     }
  //
  //
  //     case "clear-selection":
  //     case "close-modal": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.selectionBuffer) {
  //
  //         KarmaFieldsAlpha.History.save();
  //
  //         table.selectionBuffer.remove();
  //
  //         await this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "order": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getOrder) {
  //
  //         return table.getOrder();
  //
  //       }
  //
  //       break;
  //     }
  //
  //
  //     case "orderby": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getOrderby) {
  //
  //         return table.getOrderby();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "toggle-order": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.toggleOrder && table.selectionBuffer) {
  //
  //         KarmaFieldsAlpha.History.save();
  //
  //         table.toggleOrder(content.key, content.order);
  //         table.selectionBuffer.remove();
  //
  //         await table.load();
  //         await this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //
  //     case "fetch": {
  //       // -> table transfers
  //
  //       const tableId = KarmaFieldsAlpha.Nav.get("table");
  //
  //       const params = KarmaFieldsAlpha.Nav.get();
  //
  //       KarmaFieldsAlpha.History.save();
  //
  //       // for (let key in {...params, ...content.params}) {
  //       //   KarmaFieldsAlpha.Nav.change(content.params[key] || "", undefined, key);
  //       // }
  //
  //       KarmaFieldsAlpha.Nav.change(content.params);
  //
  //       const transfer = this.buffer.get("state", "transfer");
  //
  //       const newTransfer = {
  //         params: params,
  //         path: path,
  //         tableId: tableId,
  //         transfer: transfer,
  //         selection: this.buffer.get("state", "selection"),
  //         ids: this.buffer.get("state", "ids")
  //         // callback: content.callback,
  //         // selectedIds: content.ids,
  //         // fieldSelection: content.selection
  //       };
  //
  //       Object.freeze(newTransfer);
  //
  //       // this.buffer.change(null, undefined, "state", "ids");
  //
  //       this.buffer.change(newTransfer, transfer, "state", "transfer");
  //
  //       const table = this.getTable();
  //
  //       await table.load();
  //
  //       const selection = table.createSelection(content.ids);
  //
  //       table.selectionBuffer.change(selection);
  //
  //       // this.pile.push({
  //       //   params: params,
  //       //   callback: content.callback
  //       // });
  //
  //       this.buffer.set(content.callback, "transfer-callback", tableId);
  //
  //
  //       await this.render();
  //
  //       break;
  //     }
  //
  //
  //     case "insert": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getIds && table.selectionBuffer) {
  //
  //         const selection = table.selectionBuffer.get();
  //         const transfer = this.buffer.get("state", "transfer");
  //
  //         if (selection && transfer) {
  //
  //           const ids = table.getIds();
  //           const inputIds = ids.slice(selection.index, selection.index + selection.length);
  //
  //           KarmaFieldsAlpha.Nav.change(transfer.params);
  //
  //           const originTable = this.getTable(transfer.params.table);
  //
  //           // await originTable.load();
  //
  //           this.buffer.change(transfer.ids, ids, "state", "ids");
  //
  //           this.buffer.change(transfer.selection, selection, "state", "selection");
  //
  //           //
  //           // await transfer.callback(inputIds);
  //
  //           const callback = this.buffer.get("transfer-callback", transfer.params.table);
  //
  //           if (callback) {
  //
  //             await callback.call(originTable, inputIds);
  //
  //             this.buffer.remove("transfer-callback", transfer.params.table);
  //
  //           }
  //
  //           this.buffer.change(transfer.transfer, transfer, "state", "transfer");
  //
  //           await this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //
  //     }
  //
  //     case "pile": {
  //       return this.buffer.get("state", "transfer");
  //     }
  //
  //
  //     // medias
  //
  //     case "create-folder": {
  //       const table = this.getTable();
  //
  //       if (table && table.createFolder) {
  //
  //         KarmaFieldsAlpha.History.save();
  //
  //         const index = content.index || table.resource.add_index || 0;
  //
  //         const id = await table.createFolder(index);
  //
  //         table.selectionBuffer.change({index: index, length: 1});
  //
  //         await this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "change-file": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.changeFile && table.getSelectedIds) {
  //
  //         const selectedIds = table.getSelectedIds();
  //
  //         if (selectedIds.length === 1) {
  //
  //           await table.changeFile(content.files[0], selectedIds[0], content.params);
  //           await this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "upload": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.upload) {
  //
  //         KarmaFieldsAlpha.History.save();
  //
  //         // if (table.unselect) {
  //         //
  //         //   table.unselect();
  //         //
  //         // }
  //
  //         // await table.upload(content.files, content.params);
  //
  //         await table.upload(content.files, table.resource.add_index || 0);
  //
  //         // const index = content.index || table.resource.add_index || 0;
  //         //
  //         // table.selectionBuffer.change({index: index, length: 1});
  //
  //         await this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     // uploading from gallery field: upload one to one
  //     // case "upload-file": {
  //     //
  //     //   const table = this.getTable();
  //     //
  //     //   const id = await table.uploadFile(content);
  //     //
  //     //   const ids = table.idsBuffer.get();
  //     //
  //     //   this.idsBuffer.change([id, ...ids], ids);
  //     //
  //     //   break;
  //     // }
  //
  //     case "regen": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.regen && table.getSelectedIds) {
  //
  //         const selectedIds = table.getSelectedIds();
  //
  //         for (let id of selectedIds) {
  //
  //           await table.regen(id);
  //
  //         }
  //
  //         await this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //
  //
  //     // layout
  //
  //     // case "close":
  //     //   KarmaFieldsAlpha.Nav.remove();
  //     //   KarmaFieldsAlpha.History.buffer.remove("history"); // ?
  //     //   await this.render();
  //     //   break;
  //
  //
  //
  //     case "table": {
  //       // const resource = this.resource.tables.find(resource => resource.id === content.id);
  //       // if (resource) {
  //       //   return this.createChild(resource);
  //       // }
  //       // break;
  //       return this.getTable(content.id);
  //     }
  //
  //     case "render-controls":
  //       await this.controls.render();
  //       break;
  //
  //     // case "undo":
  //     // case "redo":
  //     case "render": {
  //       await this.render();
  //       break;
  //     }
  //
  //     default: {
  //       return this.parent && this.parent.request(subject, content, ...path);
  //     }
  //
  //   }
  //
  // }
  //
  // async queryTable() { // deprecated. use getCurrent
  //
  //   // -> not on undo/redo !
  //
  //   // const tableId = KarmaFieldsAlpha.Nav.get("table");
  //   // const resource = this.resource.tables.find(resource => resource.id === tableId);
  //   //
  //   // if (resource) {
  //   //   const table = this.createChild(resource);
  //   //   await table.interface.queryIds();
  //   // }
  //
  //   const table = this.getTable();
  //
  //   table.load();
  //
  //   // await this.render();
  // }

  build() {
    return {
      class: "popup",
      init: container => {

        document.addEventListener("keydown", event => {
          if (event.key === "s" && event.metaKey) {

            event.preventDefault();
            this.send();

          } else if (event.key === "z" && event.metaKey && !event.shiftKey) {

            event.preventDefault();
            KarmaFieldsAlpha.History.undo();
            window.dispatchEvent(new CustomEvent("karmaFieldsAlpha-render")); // -> fields embeded into classic pages
            this.render();

          } else if (event.key === "z" && event.metaKey && event.shiftKey) {

            event.preventDefault();
            KarmaFieldsAlpha.History.redo();
            window.dispatchEvent(new CustomEvent("karmaFieldsAlpha-render"));
            this.render();

          }
        });


        window.addEventListener("popstate", async event => {

          KarmaFieldsAlpha.History.update();
          window.dispatchEvent(new CustomEvent("karmaFieldsAlpha-render"));

          container.render();

        });

        // window.addEventListener("mousedown", event => {
        //   console.log("saucer mousedown");
        // });

        // const clipboard = KarmaFieldsAlpha.Clipboard.getElement();
        //
        // clipboard.onblur = event => {
        //   console.log("clipboard blur");
        //
        //   // this.setSelection(null);
        //
        //   this.clearSelection();
        // }

      },
      update: popup => {
        const currentTableId = this.getParam("table");
        popup.element.classList.toggle("hidden", !currentTableId && !this.resource.navigation);

        if (currentTableId) {
          popup.child = {
            class: "popup-content",
            children: [
              {
                class: "navigation karma-field-frame",
                update: navigation => {
                  navigation.element.classList.toggle("hidden", !this.resource.navigation);
                  if (this.resource.navigation) {
                    navigation.child = this.createChild({
                      ...this.resource.navigation,
                      type: "navigation",
                      index: "navigation"
                    }).build();
                  }
                }
              },
              {
                class: "tables",
                update: container => {
                  // const currentTableId = this.getParam("table");

                  document.body.classList.toggle("karma-table-open", !currentTableId);

                  // const tableId = KarmaFieldsAlpha.Nav.get("table");


                  container.children = Object.keys(this.resource.tables).map((tableId, index) => {
                    return {
                      class: "table-container",
                      update: async container => {
                        container.element.classList.toggle("hidden", tableId !== currentTableId);

                        if (tableId === currentTableId) {

                          container.child = this.createChild({
                            type: "table",
                            ...this.resource.tables[tableId],
                            // index: index
                            index: tableId
                          }).build();

                        }
                      }
                    };
                  });
                }
              }
            ]
          };
        }
      },
      complete: async popup => {

        const process = await KarmaFieldsAlpha.Terminal.process();

        if (process) {

          this.debounce("rendering", () => void popup.render(), 10);

            this.render = () => {};

        } else {

          // console.log("process complete");

          // this.render = () => {
          //
          //   // this.render = () => {};
          //
          //   this.debounce("rendering", () => void popup.render(), 50);
          //
          // };

          this.render = () => {

            this.render = () => {};

            this.debounce("rendering", () => void popup.render(), 10);

          };

        }

      }
    };
  }

}


KarmaFieldsAlpha.field.saucer.table = class extends KarmaFieldsAlpha.field {

  clearSelection(selection) {

    if (selection && selection.body) {

      const grid = this.createChild({
        type: "grid",
        ...this.resource.body,
        index: "body"
      });

      grid.clearSelection(selection.body);

    }

  }


  build() {
    return {
      class: "karma-field-table",
      update: async div => {

        let index = 0;

        // div.element.classList.add("table-loading");

        div.children = [
          {
            class: "karma-header table-main-header",
            child: this.createChild({
              type: "header",
              ...this.resource.header,
              index: index++
            }).build()
          },
          {
            class: "table-body",
            update: container => {
              // container.element.classList.toggle("single-open", Boolean(modalOpen));
            },
            children: [
              {
                class: "karma-field-table-section karma-field-frame final",
                update: filters => {
                  filters.element.classList.toggle("hidden", !this.resource.filters);

                  if (this.resource.filters) {
                    filters.child = this.createChild({
                      type: "group",
                      ...this.resource.filters,
                      index: index++
                    }).build();
                  }
                }
              },
              ...(this.resource.subsections || []).map(subsection => {
                return {
                  class: "karma-field-table-section karma-field-frame final",
                  init: section => {
                    if (subsection.style) {
                      section.element.style = subsection.style;
                    }
                  },
                  child: this.createChild({...subsection, index: index++}).build()
                };
              }),
              {
                class: "table-body-columns",
                update: div => {
                  const grid = this.createChild({
                    type: "grid",
                    ...this.resource.body,
                    // index: index++
                    index: "body"
                  });
                  div.children = [
                    {
                      class: "table-body-column table-content",
                      child: grid.build()
                    },
                    {
                      class: "table-body-column table-modal",
                      update: container => {
                        // const selection = grid.getSelection();
                        // const hasSelection = Boolean(selection && selection instanceof KarmaFieldsAlpha.Selection);

                        // container.element.onmousedown = event => {
                        //   console.log("modal mousedown");
                        //   event.stopPropagation();
                        // }


                        container.element.style.width = this.resource.modal && this.resource.modal.width || grid.resource.modal && grid.hasSelection() && (grid.resource.modal.width || "30em") || "0";

                        container.child = {
                          class: "karma-modal", // -> handle overflow:auto
                          children: [
                            {
                              class: "table-modal-content",
                              update: div => {
                                div.element.classList.toggle("hidden", !this.resource.modal);
                                if (this.resource.modal) {
                                  div.child = this.createChild({
                                    type: "group",
                                    ...this.resource.modal,
                                    // index: index++
                                    // index: 999999
                                    index: "modal"
                                  }).build()
                                }
                              }
                            },
                            {
                              class: "grid-modal-content",
                              update: div => {
                                const hasSelection = grid.hasSelection();
                                div.element.classList.toggle("hidden", !hasSelection);
                                if (hasSelection) {
                                  div.child = grid.createChild({
                                    type: "modal",
                                    ...grid.resource.modal,
                                    selection: grid.getSelection(),
                                    index: "modal"
                                  }).build()
                                }
                              }
                            }
                          ]
                        };
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            class: "table-footer table-control",
            update: footer => {
              footer.element.classList.toggle("hidden", this.resource.controls === false);
              if (this.resource.controls !== false) {
                footer.child = this.createChild({
                  type: "controls",
                  ...this.resource.controls,
                  index: index++
                }).build();
              }
            }
          }
        ];
      }
    };

  }
}


KarmaFieldsAlpha.field.saucer.controls = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    super({
      display: "flex",
      children: [
        "reload",
        "save",
        "add",
        "delete",
        "separator",
        "undo",
        "redo"
      ],
      ...resource
    });

  }

}

KarmaFieldsAlpha.field.saucer.save = {
  id: "save",
  type: "button",
  action: "send",
  title: "Save",
  disabled: ["!", ["hasChange"]],
  primary: true
}

KarmaFieldsAlpha.field.saucer.add = {
  id: "add",
  type: "button",
  action: "add",
  title: "Add"
}

KarmaFieldsAlpha.field.saucer.delete = {
  id: "delete",
  type: "button",
  action: "delete",
  title: "Delete",
  // disabled: "!selection"
  disabled: ["!", ["request", "getSelection"]]
}

KarmaFieldsAlpha.field.saucer.undo = {
  id: "undo",
  type: "button",
  action: "undo",
  dashicon: "undo",
  disabled: ["!", ["request", "hasUndo"]]
}

KarmaFieldsAlpha.field.saucer.redo = {
  id: "redo",
  type: "button",
  action: "redo",
  dashicon: "redo",
  disabled: ["!", ["request", "hasRedo"]]
}

KarmaFieldsAlpha.field.saucer.reload = {
  id: "reload",
  type: "button",
  action: "reload",
  title: "Reload"
}

KarmaFieldsAlpha.field.saucer.insert = {
  id: "insert",
  type: "button",
  action: "insert",
  primary: true,
  title: "Insert",
  disabled: ["!", ["request", "getSelection"]],
  hidden: ["empty", ["request", "pile"]]
}

KarmaFieldsAlpha.field.saucer.createFolder = {
  type: "button",
  action: "createFolder",
  title: "Create Folder"
}



KarmaFieldsAlpha.field.saucer.header = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    super({
      display: "flex",
      children: [
        {
          type: "title",
          value: resource.title || "Table"
        },
        "count",
        "pagination",
        "close"
      ],
      ...resource
    });

  }

}

KarmaFieldsAlpha.field.saucer.header.title = class extends KarmaFieldsAlpha.field.text {

  constructor(resource) {

    super({
      tag: "h1",
      style: "flex-grow:1",
      class: "ellipsis",
      value: "Table",
      ...resource
    });

  }

}

KarmaFieldsAlpha.field.saucer.count = {
  type: "text",
  style: "justify-content:center;white-space: nowrap;",
  value: ["replace", "# elements", "#", ["request", "count"]]
}

KarmaFieldsAlpha.field.saucer.options = {
  type: "button",
  title: "Options",
  action: "toggleOptions"
}

KarmaFieldsAlpha.field.saucer.close = {
  type: "button",
  text: "×",
  title: "Close Table",
  action: "close"
}

KarmaFieldsAlpha.field.saucer.pagination = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    super({
      type: "group",
      display: "flex",
      style: "flex: 0 1 auto;min-width:0",
      hidden: ["==", ["request", "getNumPage"], 1],
      children: [
        "firstpage",
        "prevpage",
        "currentpage",
        "nextpage",
        "lastpage"
      ],
      ...resource
    });
  }

}

KarmaFieldsAlpha.field.saucer.pagination.firstpage = {
  type: "button",
  action: "firstPage",
  title: "First Page",
  text: "«",
  disabled: ["==", ["request", "getPage"], 1]
}

KarmaFieldsAlpha.field.saucer.pagination.prevpage = {
  type: "button",
  action: "prevPage",
  title: "Previous Page",
  text: "‹",
  disabled: ["==", ["request", "getPage"], 1]
}

KarmaFieldsAlpha.field.saucer.pagination.currentpage = {
  type: "text",
  style: "min-width: 4em;text-align: right;",
  value: ["replace", "# / #", "#", ["request", "getPage"], ["request", "getNumPage"]]
}

KarmaFieldsAlpha.field.saucer.pagination.nextpage = {
  type: "button",
  action: "nextPage",
  title: "Next Page",
  text: "›",
  disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]]
}

KarmaFieldsAlpha.field.saucer.pagination.lastpage = {
  type: "button",
  action: "lastPage",
  title: "Last Page",
  text: "»",
  // disabled: ["request", "lastpage", "boolean"]
  disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]]
}