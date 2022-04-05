
KarmaFieldsAlpha.fields.table = class extends KarmaFieldsAlpha.fields.gateway {

  constructor(...params) {
    super(...params);


    // compat

    if (this.resource.columns) {
      this.resource.children = this.resource.columns.map(column => {
        return {
          ...column,
          ...column.field
        };
      });
    }




    this.extraOrders = {};

    this.optionsBuffer = new KarmaFieldsAlpha.Buffer("options", this.resource.driver);
    this.extraIdBuffer = new KarmaFieldsAlpha.Buffer("extraids", this.resource.driver);

    this.grid = this.createTablePart({
      // ...this.resource.grid,
      // driver: this.resource.driver,
      // columns: this.resource.columns,
      // orderby: this.resource.orderby,
      type: "grid",
      id: "form-"+this.resource.driver, // -> form buffer + history buffer
      key: "content"
    });

    // this.content = this.grid.createChild({
    //   id: "content"
    //   // key: "content"
    // });

    this.interface = this.createTablePart({
      type: "interface",
      id: "interface"
    });



    this.controls = this.createTablePart({
      id: "controls",
      // key: "controls",
      type: "controls",
      ...this.resource.controls
    });

    this.header = this.createTablePart({
      id: "header",
      // key: "header",
      type: "header",
      ...this.resource.header
    })

    // KarmaFieldsAlpha.build(this.interface.build(), document.body);

    // document.body.appendChild(this.ta);

    // this.taField.splash = async request => {
    //
    // // this.grid.listeners.push(async () => {
    //   // this.updateTA();
    //   const data = [];
    //
    //   // const ids = await this.getIds();
    //
    //   if (this.selection && this.selection.width*this.selection.height > 1) {
    //
    //     for (let j = 0; j < this.selection.height; j++) {
    //
    //       const dataRow = [];
    //       // const id = ids[this.selection.y+j];
    //       // const row = this.getChild(id);
    //
    //       // console.log(this.selection);
    //
    //       for (let i = 0; i < this.selection.width; i++) {
    //
    //         // const field = row.children.find(child => child.resource.index === table.grid.selection.x+i);
    //         const field = this.fieldsMap.get(this.selection.x + i, this.selection.y + j);
    //         const value = await field.exportValue();
    //
    //         dataRow.push(value);
    //
    //       }
    //
    //       data.push(dataRow);
    //
    //     }
    //
    //     this.ta.focus();
    //     this.ta.value = data.map(row => row.join("\t")).join("\n");
    //     this.ta.select();
    //
    //   } else {
    //
    //     this.ta.value = "";
    //
    //   }
    //
    // };
  // );

    // this.listeners = [];


    // this.elementsMap = new KarmaFieldsAlpha.Grid();
    // this.fieldsMap = new KarmaFieldsAlpha.Grid();
    //
    //
    // this.ta = document.createElement("textarea");
    // this.ta.className = "karma-grid-ta";
    // document.body.appendChild(this.ta);
    //
    // this.ta.onfocusout = event => {
    //   this.endSelection();
    // }
    //
    // this.ta.oninput = async event => {
    //
    //   let data = this.ta.value.split(/[\r\n]/).map(row => row.split("\t"));
    //
    //   await this.importData(data);
    //
    //   switch (event.inputType) {
    //
    //     case "insertFromPaste":
    //     case "deleteByCut":
    //     case "deleteContentBackward":
    //     case "deleteContentForward":
    //     case "deleteContent":
    //       this.ta.blur();
    //
    //   }
    //
    //   // this.grid.triggerListeners();
    //
    //   // await this.renderFooter();
    //
    // }

    // document.addEventListener("keydown", event => {
    //   console.log(event);
    // })


    this.options = this.createChild({
      type: "button",
      title: "Options",
      id: "options-"+this.resource.driver,
      action: "toggle-options",
      modal: {
        id: "form",
        key: "options",
        type: "form",
        children: [
          {
            type: "input",
            key: "ppp",
            label: "Items number",
            input: {type: "number", style: "max-width:5em;"}
          },
          {
            type: "checkboxes",
            key: "columns",
            label: "Display columns",
            options: this.resource.columns.map((column, index) => {
              return {
                key: index.toString(),
                name: column.title
              }
            })
          },
          {
            type: "group",
            display: "flex",
            children: [
              {
                type: "button",
                primary: true,
                style: "min-width:0",
                action: "submit",
                disabled: "!modified",
                title: "Save"
              },
              {
                type: "button",
                style: "min-width:0;",
                action: "close-options",
                title: "Close"
              }
            ]
          }

        ]
      }
    });

  }



  async getQueriedIds() {
    const results = await this.getRemoteTable();
    return results.map(row => row.id);
  }

  getParamString() {

    const params = new URLSearchParams(KarmaFieldsAlpha.Nav.params);

    if (!params.has("page")) {
      params.set("page", "1");
    }

    if (!params.has("ppp")) {
      params.set("ppp", this.getPpp());
    }

    if (!params.has("orderby")) {
      params.set("orderby", this.getOrderby());
    }

    if (!params.has("order")) {
      params.set("order", this.getOrder());
    }

    params.sort();

    return params.toString();
  }


  async queryTable() {

    const paramString = this.getParamString();
    // const paramString = await this.get("paramstring", 0);
    const driver = this.resource.driver;
    let results = await KarmaFieldsAlpha.Gateway.get("query/"+driver+"?"+paramString);

    results = results.items || results || []; // compat


    // for (let item of results.items || results || []) { // compat
    //
    //   const id = item.id.toString();
    //
    //   for (let key in item) {
    //
    //     const value = [item[key]];
    //
    //     this.buffer.set(value, id, key);
    //   }
    //
    //   this.buffer.set(["0"], item.id.toString(), "trash");
    // }

    // this.buffer.set(results);

    // [
    //   {
    //     id: "1"
    //     date: "2022-03-08",
    //     hour: "20:00"
    //   },
    //   {
    //     id: "2"
    //     date: "2022-03-07",
    //     hour: "20:00"
    //   },
    // ]
    //
    // ->
    //
    // {
    //   1: {
    //     date: ["2022-03-08"],
    //     hour: ["20:00"],
    //     trash: ["0"]
    //   },
    //   2: {
    //     date: ["2022-03-07"],
    //     hour: ["20:00"],
    //     trash: ["0"]
    //   }
    // }

    for (let i = 0; i < results.length; i++) {

      const id = results[i].id.toString();

      for (let key in results[i]) {
        this.buffer.set(results[i][key], id, key, 0);
      }

      this.buffer.set("0", id, "trash", 0);
    }




    return results;
  }

  async getRemoteTable() {
    if (!this.tablePromise) {
      this.tablePromise = this.queryTable();
    }
    return this.tablePromise;
  }




  async queryRelations() {

    const driver = this.resource.driver;
    const ids = await this.getQueriedIds();
    // const ids = await this.get("queriedids");
    const relations = await KarmaFieldsAlpha.Gateway.get("relations/"+driver+"?ids="+ids.join(","));

    // [
    //   {
    //     id: 1,
    //     cat_id: 34
    //   },
    //   {
    //     id: 2,
    //     cat_id: 34
    //   },
    //   {
    //     id: 2,
    //     cat_id: 35
    //   }
    // ]
    //
    // ->
    //
    // {
    //   1: {
    //     cat_id: [34],
    //     date: ["2022-03-08"],
    //     hour: ["20:00"],
    //     items: ["a", "b", "c"]
    //   },
    //   2: {
    //     cat_id: [34, 35],
    //     date: ["2022-03-07"],
    //     hour: ["20:00"],
    //     meta: [
    //       {
    //         x: [23],
    //         y: [12]
    //       }
    //     ]
    //   }
    // }
    //
    // ["1", "date", 0]
    // ["1", "items", 2]
    // ["2", "cat_id", 1]
    // ["2", "meta", 0, "x", 0]

    for (let i = 0; i < relations.length; i++) {
      const id = relations[i].id.toString();
      if (id) {
        for (let key of relations[i]) {
          if (key !== "id") {
            KarmaFieldsAlpha.DeepObject.sanitize(relations[i][key]); // -> compat

            let values = this.buffer.get(id, key) || [];

            // values.push(relations[i][key]);
            this.buffer.set(relations[i][key], id, key, values.length);

            // this.buffer.merge(relations[i][key], id.toString(), 0, key);
          }
        }
      }
    }

  }

  async getRemoteRelations() {
    if (!this.relationPromise) {
      this.relationPromise = this.queryRelations();
    }
    return this.relationPromise;
  }

  async getRemoteValue(...path) {
    await this.getRemoteTable();
    await this.getRemoteRelations();

    // let value = this.buffer.get(id, key);
    //
    // if (!value && key === "trash") {
    //   value = ["1"];
    // }

    return this.buffer.get(...path);
  }

  clearQuery() {
    this.tablePromise = null;
    this.relationPromise = null;
  }

  async getRemoteCount() {
    if (!this.countPromise) {
      // this.countPromise = this.getParamString().then(paramstring => {
      // this.countPromise = this.get("paramstring", 0).then(paramstring => {
      //   return KarmaFieldsAlpha.Gateway.get("count/"+this.resource.driver+"?"+paramstring);
      // });

      this.countPromise = KarmaFieldsAlpha.Gateway.get("count/"+this.resource.driver+"?"+this.getParamString());
    }
    return this.countPromise;
  }

  async getCount() {
    const count = await this.getRemoteCount();
    return Number(count || 0);
  }

  clearCount() {
    this.countPromise = null;
  }

  getDefaultOrderby() {
    if (!this.defaultOrderby) {
      this.defaultOrderby = this.resource.orderby;
      if (!this.defaultOrderby) {
        const column = this.resource.columns.find(column => (column.orderby || column.field && column.field.key));
        this.defaultOrderby = column && (column.orderby || column.field && column.field.key) || "default";
      }
    }
    return this.defaultOrderby;
  }

  getDefaultOrder() {
    if (!this.defaultOrder) {
      const column = this.resource.orderby && this.resource.columns.find(column => (column.orderby || column.field && column.field.key) === this.resource.orderby);
      this.defaultOrder = column && column.order || "asc";
    }
    return this.defaultOrder;
  }

  getOrder() {
    return this.getParam("order") || this.getDefaultOrder();
  }

  getOrderby() {
    return this.getParam("orderby") || this.getDefaultOrderby();
  }

  // getOptions() {
  //   return {
  //     ppp: this.getParam("ppp") || this.resource.ppp || 10,
  //     columns: this.resource.columns.map((column, index) => index.toString()) || []
  //   };
  // }

  // getPpp() {
  //   return this.optionsBuffer.get("ppp") || this.getOptions().ppp;
  // }
  //
  // getColumns() {
  //   return this.optionsBuffer.get("columns") || this.getOptions()["columns"];
  // }

  getPpp() {
    // return this.getParam("ppp") || this.optionsBuffer.get("ppp", 0) || this.resource.ppp || 10;
    return this.getParam("ppp") || this.resource.ppp || 10;
  }

  getColumns() {
    return this.optionsBuffer.get("columns") || this.resource.columns.map((column, index) => index.toString()) || [];
  }

  async dispatch(event) {


    switch (event.action) {

      case "get":
        const value = await this.getValue(...event.path);
        event.setValue(value);
        break;

      case "set":
        await this.setValue(event.getArray(), ...event.path);
        break;

      case "send":
        await this.sendValue(event.getValue(), ...event.path);
        break;

      case "edit-grid":
        // await this.grid.render();
        // console.log(event);
        // console.log(this.children);


        await this.controls.render();
        await this.interface.render();
        break;

      // case "listen":
      //   this.setListener(event.callback, ...event.path);
      //   // this.listeners.push(event.callback);
      //   break;

      case "modified": {
        if (event.path.length) {
          // -> filters
        } else {
          const modified = await this.grid.isModified();
          event.setValue(modified);
        }
        break;
      }

      case "importselection": { // -> an input field received a multiple row/column pasted data...
        // const point = this.interface.fieldsMap.find(event.field);

        await this.interface.importData(event.data, event.field);
        this.controls.render();
        break;
      }

      case "edit-selection":
        await this.controls.render();
        break;

      case "nextpage": {
        const page = this.getPage();
        const numpage = await this.getNumPage();
        this.setParam(Math.min(page+1, numpage), "page");
        this.clearQuery();
        // await this.triggerListeners();
        await this.render();
        break;
      }

      case "prevpage": {
        const page = this.getPage();
        this.setParam(Math.max(page-1, 0), "page");
        this.clearQuery();
        // await this.triggerListeners();
        await this.render();
        break;
      }

      case "firstpage": {
        this.setParam(1, "page");
        this.clearQuery();
        await this.render();
        // await this.triggerListeners();
        break;
      }

      case "lastpage": {
        const numpage = await this.getNumPage();
        this.setParam(numpage, "page");
        this.clearQuery();
        await this.render();
        // await this.triggerListeners();
        break;
      }

      case "reload": {
        this.clearQuery();
        this.clearCount();
        KarmaFieldsAlpha.Gateway.clearOptions();
        await this.render();
        // await this.triggerListeners();
        break;
      }

      case "toggle-options":
        this.options.open = !this.options.open;
        this.options.render();
        // await this.render();
        // await this.triggerListeners();
        break;

      case "close-options":
        this.options.open = false;
        // await this.render();
        // await this.triggerListeners();
        this.options.render();
        break;

      case "add":
        await this.add(1);
        // this.clearQuery();
        // this.clearCount();
        // await this.render(1);
        // await this.grid.triggerListeners();
        // await this.triggerListeners();

        await this.grid.render();
        break;

      case "delete": {
        const selectedIds = await this.getSelectedIds();
        await this.remove(selectedIds);
        // this.clearQuery();
        // this.clearCount();
        // await this.render(1);
        // await this.grid.triggerListeners();
        // await this.triggerListeners();
        await this.grid.render();
        break;
      }

      case "save":
        await this.grid.submit();
        this.extraIdBuffer.empty();
        // this.clearQuery();
        // this.clearCount();
        // KarmaFieldsAlpha.Gateway.clearOptions();
        // await this.render(1);
        // await this.grid.triggerListeners();
        await this.grid.render();
        break;

      case "undo": {
        this.grid.undo();
        let hash = this.grid.getHash();
        if (hash !== location.hash) {
          KarmaFieldsAlpha.Nav.setHash(hash);
          this.clearQuery();
          this.clearCount();
          await this.render();
        } else {
          await this.grid.render();
          await this.controls.render();
        }


        // await this.triggerListeners();
        break;
      }

      case "redo": {
        let hash = this.grid.getHash();
        if (hash !== location.hash) {
          this.grid.redo();
          KarmaFieldsAlpha.Nav.setHash(hash);
          this.clearQuery();
          this.clearCount();
          await this.render();
        } else {
          this.grid.redo();
          await this.grid.render();
          await this.controls.render();
        }

        // await this.triggerListeners();
        break;
      }
      // case "edit": // edit field in grid
      //   await this.renderFooter();
      //   break;

      // case "start-selection":
      // case "grow-selection":
      // case "end-selection":
      //   await this.renderFooter();
      //   break;

      case "close":
      // case "nav":
        this.clearQuery();
        this.clearCount();
        KarmaFieldsAlpha.Gateway.clearOptions();
        KarmaFieldsAlpha.Nav.empty();
        await super.dispatch(event);
        // await super.setState(null, ...path, state);
        break;

      // case "order":
      //   this.tablePromise = null;
      //   await this.getGrid().render();
      //   break;

      // modal:
      case "prev":
        await this.prev();
        await this.render();
        // await this.triggerListeners();
        break;

      case "next":
        await this.next();
        await this.render();
        // await this.triggerListeners();
        break;

      case "close-modal":
        this.removeParam("id");
        await this.render();
        // await this.triggerListeners();
        break;

      // case "export":
      //   const selectedIds = await this.getSelectedIds();
      //   location = arsenic_admin.rest_url+"arsenic/v1/export-spectacle-data?ids="+selectedIds.join(",");
      //   break;


    }

    return event;
  }


  async getValue(...path) {

    const key = path.shift();

    switch (key) {

      case "content":
        return this.getRemoteValue(...path);

      case "options":
        return this.getOptionsValue(...path);

      // case "controls":
      //   return this.getControlsValue(...path);
      //
      // case "header":
      //   return this.getHeaderValue(...path);

      case "selection":
        return (await this.getSelectedIds()).length > 0;

      case "undo":
        return this.grid.hasUndo();

      case "redo":
        return this.grid.hasRedo();

      case "count":
        return this.getCount();

      case "page":
        return this.getPage();

      case "lastpage":
        return this.getNumPage() === this.getPage();

      case "numpage":
        return this.getNumPage();






      default: // -> filters
        return this.getParam(key);

    }

  }

  async setValue(value, ...path) { // value is an array

    const key = path.shift();

    switch (key) {

      case "content": // -> autosave
        await this.send(value, ...path);

        // await this.grid.render();
        // await this.interface.render();
        break;

      case "order":
      case "orderby":
        this.setParam(value[0], key);
        this.clearQuery();
        // await this.triggerListeners();
        this.render();
        break;

      case "hash": // -> from undo/redo
        this.clearQuery();
        this.clearCount();
        // await super.dispatch(event);
        KarmaFieldsAlpha.Nav.setHash(value[0]);
        this.render();
        break;

      default: // -> filters
        this.setParam(value[0], key);
        this.clearCount();
        this.clearQuery();
        // await this.triggerListeners();
        this.render();
        break;

    }

  }

  async sendValue(value, ...path) {

    const key = path.shift();

    switch (key) {

      case "content": // -> save grid
        await this.send(value, ...path);
        break;

      case "options":

        this.options.open = false;
        if (value.ppp) {
          this.setParam(value.ppp[0], "ppp");
          this.clearCount();
          this.clearQuery();
          this.render();
        }
        if (value.columns) {
          this.optionsBuffer.set(value.columns, "columns");
          await this.render(1);
        }
        break;



      default: // -> filters + order
        console.log(value, path);
        break;

    }

  }

  // setListener(callback, ...path) {
  //
  //   switch (path.shift()) {
  //
  //     case "controls":
  //       this.grid.listeners.push(callback);
  //       break;
  //
  //     default:
  //       this.listeners.push(callback);
  //       break;
  //
  //
  //   }
  //
  // }


  async getOptionsValue(key) {

    switch (key) {
      case "ppp": return this.getPpp();
      case "columns": return this.getColumns();
    }

  }

  // async getControlsValue(key) {
  //
  //   switch (key) {
  //     case "selection": return (await this.getSelectedIds()).length > 0;
  //     case "undo": return this.grid.hasUndo();
  //     case "redo": return this.grid.hasRedo();
  //   }
  //
  // }
  //
  // async getHeaderValue(key) {
  //
  //   switch (key) {
  //     case "count":
  //       return this.getCount();
  //
  //     case "page":
  //       return this.getPage();
  //
  //     case "lastpage":
  //       return await this.getNumPage() === this.getPage();
  //
  //     case "numpage":
  //       return await this.getNumPage();
  //
  //     default:
  //       return this.getParam(key); // -> for title
  //   }
  //
  // }
  //


  // async dispatchContent(event) {
  //
  //   switch (event.action) {
  //
  //     case "get": {
  //       const value = await this.getRemoteValue(...event.path.slice(1));
  //       event.setValue(value);
  //       break;
  //     }
  //
  //     case "set": { // -> autosave
  //        await this.send(event.getArray(), ...event.path.slice(1));
  //        break;
  //     }
  //
  //     case "send": {
  //       await this.send(event.getValue(), ...event.path.slice(1));
  //       break;
  //     }
  //
  //     case "importselection": { // -> an input field received a multiple row/column pasted data...
  //       const point = this.fieldsMap.find(event.field);
  //       await this.importData(event.data, point);
  //       break;
  //     }
  //   }
  //
  //   return event;
  // }
  //
  // async dispatchOptions(event) {
  //
  //   switch (event.action) {
  //
  //     case "get": {
  //       // const value = this.getOptions(...event.path.slice(1));
  //       // event.setValue(value);
  //       if (event.path[1] === "ppp") {
  //         event.setValue(this.getPpp());
  //       } else if (event.path[1] === "columns") {
  //         event.setValue(this.getColumns());
  //       }
  //       break;
  //     }
  //
  //     case "send": {
  //       this.options.open = false;
  //       const value = event.getValue();
  //       if (value.ppp) {
  //         this.setParam(value.ppp[0], "ppp");
  //       }
  //       if (value.columns) {
  //         this.optionsBuffer.set(value.columns, "columns");
  //       }
  //       // this.optionsBuffer.merge(value);
  //       this.clearCount();
  //       this.clearQuery();
  //       await this.render(1);
  //       break;
  //     }
  //
  //   }
  //
  // }
  //
  // async dispatchControls(event) {
  //
  //   switch (event.action) {
  //
  //     case "get": {
  //       switch (event.path[1]) {
  //         case "selection": {
  //           const ids = await this.getSelectedIds();
  //           event.setValue(ids.length > 0);
  //           break;
  //         }
  //         case "undo": {
  //           event.setValue(this.grid.hasUndo());
  //           break;
  //         }
  //         case "redo": {
  //           event.setValue(this.grid.hasRedo());
  //           break;
  //         }
  //       }
  //
  //     }
  //
  //     case "listen":
  //       this.grid.listeners.push(event.callback);
  //       break;
  //
  //     case "modified":
  //       return this.grid.isModified();
  //
  //     case "add":
  //       await this.add(1);
  //       // this.clearQuery();
  //       // this.clearCount();
  //       // await this.render(1);
  //
  //       await this.grid.triggerListeners();
  //       await this.triggerListeners();
  //       break;
  //
  //     case "delete": {
  //       const selectedIds = await this.getSelectedIds();
  //       await this.remove(selectedIds);
  //       // this.clearQuery();
  //       // this.clearCount();
  //       // await this.render(1);
  //       await this.grid.triggerListeners();
  //       await this.triggerListeners();
  //       break;
  //     }
  //
  //     case "save":
  //       await this.getGrid().submit();
  //       this.extraIdBuffer.empty();
  //       // this.clearQuery();
  //       // this.clearCount();
  //       // KarmaFieldsAlpha.Gateway.clearOptions();
  //       // await this.render(1);
  //       await this.grid.triggerListeners();
  //       break;
  //
  //     case "undo":
  //       this.getGrid().undo();
  //       // await this.render();
  //       await this.triggerListeners();
  //       break;
  //
  //     case "redo":
  //       this.getGrid().redo();
  //       // await this.render();
  //       await this.triggerListeners();
  //       break;
  //
  //   }
  //
  // }
  //
  // async dispatchHeader(event) {
  //
  //   switch (event.action) {
  //
  //     case "get": {
  //
  //       switch (event.path[1]) {
  //         case "count": {
  //           const count = await this.getCount();
  //           event.setValue(count);
  //           break;
  //         }
  //         case "page": {
  //           event.setValue(this.getPage());
  //           break;
  //         }
  //         case "lastpage": {
  //           const numpage = await this.getNumPage();
  //           const page = this.getPage();
  //           event.setValue(numpage === page);
  //           break;
  //         }
  //         case "numpage": {
  //           const numpage = await this.getNumPage();
  //           event.setValue(numpage);
  //           break;
  //         }
  //
  //       }
  //
  //     }
  //
  //     case "listen":
  //       this.listeners.push(callback);
  //       break;
  //
  //     case "nextpage": {
  //       const page = this.getPage();
  //       const numpage = await this.getNumPage();
  //       this.setParam(Math.min(page+1, numpage), "page");
  //       this.clearQuery();
  //       await this.triggerListeners();
  //       // await this.render();
  //       break;
  //     }
  //
  //     case "prevpage": {
  //       const page = this.getPage();
  //       this.setParam(Math.max(page-1, 0), "page");
  //       this.clearQuery();
  //       await this.triggerListeners();
  //       // await this.render();
  //       break;
  //     }
  //
  //     case "firstpage": {
  //       this.setParam(1, "page");
  //       this.clearQuery();
  //       // await this.render();
  //       await this.triggerListeners();
  //       break;
  //     }
  //
  //     case "lastpage": {
  //       const numpage = await this.getNumPage();
  //       this.setParam(numpage, "page");
  //       this.clearQuery();
  //       // await this.render();
  //       await this.triggerListeners();
  //       break;
  //     }
  //
  //     case "toggle-options":
  //       this.options.open = !this.options.open;
  //       // await this.render();
  //       await this.triggerListeners();
  //       break;
  //
  //     case "close-options":
  //       this.options.open = false;
  //       // await this.render();
  //       await this.triggerListeners();
  //       break;
  //
  //     case "close":
  //     case "nav":
  //       this.clearQuery();
  //       this.clearCount();
  //       KarmaFieldsAlpha.Gateway.clearOptions();
  //       await super.dispatch(event);
  //       // await super.setState(null, ...path, state);
  //       break;
  //
  //   }
  //
  // }
  //
  // async dispatchFilter(event) {
  //
  //   switch (event.action) {
  //
  //     case "get": {
  //       event.setValue(this.getParam(key));
  //       break;
  //     }
  //
  //     case "set": { // -> filters + order
  //       this.setParam(event.getString(), key);
  //       this.clearCount();
  //       this.clearQuery();
  //       // console.log(value, key, await this.getIds());
  //       // await this.render();
  //       await this.triggerListeners();
  //       // await this.renderGrid();
  //       break;
  //     }
  //
  //     case "listen":{
  //       this.listeners.push(event.callback);
  //       break;
  //     }
  //
  //
  //
  //   }
  //
  // }
  //




  // async get(...path) {
  //
  //   const key = path.shift();
  //
  //   switch (key) {
  //
  //     case "content":
  //       return super.get(...path);
  //
  //     case "options":
  //       return KarmaFieldAlpha.DeepObject.get({
  //         ppp: [this.getParam("ppp") || this.resource.ppp || 10],
  //         columns: this.resource.columns.map((column, index) => index.toString()) || []
  //       }, ...path);
  //
  //     case "ppp":
  //     case "columns": {
  //       return this.optionsBuffer.get(key, ...path) ?? this.get("options", key, ...path);
  //       // let value = this.optionsBuffer.get(key, ...path);
  //       // if (value === undefined) {
  //       //   value = this.get("options", key, ...path);
  //       // }
  //       // return value;
  //     }
  //
  //       // return this.options.getModal().get(key, ...path);
  //
  //     case "orderby": {
  //       const orderby = this.getParam("orderby") || this.getDefaultOrderby();
  //       return KarmaFieldAlpha.DeepObject.get([orderby], ...path);
  //     }
  //       // return KarmaFieldAlpha.DeepObject.get([this.getOrderby()], ...path);
  //
  //     case "order": {
  //       const order = this.getParam("order") || this.getDefaultOrder();
  //       return KarmaFieldAlpha.DeepObject.get([order], ...path);
  //     }
  //       // return KarmaFieldAlpha.DeepObject.get([this.getOrder()], ...path);
  //
  //     case "page": {
  //       const page = this.hasParam("page") && Number(this.getParam("page")) || 1;
  //       return KarmaFieldAlpha.DeepObject.get([page], ...path);
  //     }
  //       // return KarmaFieldAlpha.DeepObject.get([this.getPage()], ...path);
  //
  //     case "count": {
  //       const count = await this.getRemoteCount();
  //       return KarmaFieldAlpha.DeepObject.get([Number(count || 0)], ...path);
  //     }
  //
  //       // return KarmaFieldAlpha.DeepObject.get([await this.getCount()], ...path);
  //
  //     case "numpage": {
  //       const count = await this.get("count", 0);
  //       const ppp = await this.get("ppp", 0);
  //       const numpage = Math.ceil(count/ppp);
  //       return KarmaFieldAlpha.DeepObject.get([numpage], ...path);
  //     }
  //       // return KarmaFieldAlpha.DeepObject.get([await this.getNumPage()], ...path);
  //
  //     case "paramstring": {
  //       const params = new URLSearchParams(KarmaFieldsAlpha.Nav.params);
  //
  //       if (!params.has("page")) {
  //         params.set("page", "1");
  //       }
  //
  //       if (!params.has("ppp")) {
  //         params.set("ppp", await this.get("ppp", 0));
  //       }
  //
  //       if (!params.has("orderby")) {
  //         // params.set("orderby", this.getOrderby());
  //         params.set("orderby", await this.get("orderby", 0));
  //       }
  //
  //       if (!params.has("order")) {
  //         // params.set("order", this.getOrder());
  //         params.set("order", await this.get("order", 0));
  //       }
  //
  //       params.sort();
  //
  //       // return params.toString();
  //       KarmaFieldAlpha.DeepObject.get([params.toString()], ...path);
  //     }
  //       // return KarmaFieldAlpha.DeepObject.get([await this.getParamString()], ...path);
  //
  //     case "queriedids": {
  //       const results = await this.getRemoteTable();
  //       const ids = results.map(row => row.id);
  //       return KarmaFieldAlpha.DeepObject.get(ids, ...path);
  //     }
  //       // return KarmaFieldAlpha.DeepObject.get(await this.getQueriedIds(), ...path);
  //
  //     case "ids":
  //       return KarmaFieldAlpha.DeepObject.get(await this.getIds(), ...path);
  //
  //     case "selectedids": {
  //       const grid = this.getGrid();
  //       if (this.hasParam("id")) {
  //         KarmaFieldAlpha.DeepObject.get([this.getParam("id")], ...path);
  //       } else if (grid.selection && grid.selection.width === grid.grid.width) {
  //         const ids = await this.getIds();
  //         const selectedIds = ids.slice(grid.selection.y, grid.selection.y + grid.selection.height);
  //         KarmaFieldAlpha.DeepObject.get(selectedIds, ...path);
  //       }
  //     }
  //
  //
  //     default: // -> filters
  //       return KarmaFieldAlpha.DeepObject.get([this.getParam(key)], ...path);
  //
  //   }
  //
  // }
  //
  // async getState() {
  //
  //   const state = path.pop();
  //
  //   switch (state) {
  //
  //     default:
  //       return this.get(...path, state);
  //
  //   }
  //
  // }



  // async trigger(action) {
  //
  //   switch (action) {
  //
  //     case "nextpage": {
  //       const page = this.getPage();
  //       const numpage = await this.getNumPage();
  //       this.setParam(Math.min(page+1, numpage), "page");
  //       this.clearQuery();
  //       await this.render();
  //       break;
  //     }
  //
  //     case "prevpage": {
  //       const page = this.getPage();
  //       this.setParam(Math.max(page-1, 0), "page");
  //       this.clearQuery();
  //       await this.render();
  //       break;
  //     }
  //
  //     case "firstpage": {
  //       this.setParam(1, "page");
  //       this.clearQuery();
  //       await this.render();
  //       break;
  //     }
  //
  //     case "lastpage": {
  //       const numpage = await this.getNumPage();
  //       this.setParam(numpage, "page");
  //       this.clearQuery();
  //       await this.render();
  //       break;
  //     }
  //
  //     case "reload": {
  //       this.clearQuery();
  //       this.clearCount();
  //       KarmaFieldsAlpha.Gateway.clearOptions();
  //       await this.render(1);
  //       break;
  //     }
  //
  //     case "toggle-options":
  //       this.options.open = !this.options.open;
  //       await this.render();
  //       break;
  //
  //     case "close-options":
  //       this.options.open = false;
  //       await this.render();
  //       break;
  //
  //     case "add":
  //       await this.add(1);
  //       this.clearQuery();
  //       this.clearCount();
  //       await this.render(1);
  //       break;
  //
  //     case "delete": {
  //       const selectedIds = await this.getSelectedIds();
  //       await this.delete(selectedIds);
  //       this.clearQuery();
  //       this.clearCount();
  //       await this.render(1);
  //       break;
  //     }
  //
  //     case "save":
  //       await this.getGrid().submit();
  //       this.clearQuery();
  //       this.clearCount();
  //       KarmaFieldsAlpha.Gateway.clearOptions();
  //       await this.render(1);
  //       break;
  //
  //     case "undo":
  //       this.getGrid().undo();
  //       await this.render();
  //       break;
  //
  //     case "redo":
  //       this.getGrid().redo();
  //       await this.render();
  //       break;
  //
  //     // case "edit": // edit field in grid
  //     //   await this.renderFooter();
  //     //   break;
  //
  //     // case "start-selection":
  //     // case "grow-selection":
  //     // case "end-selection":
  //     //   await this.renderFooter();
  //     //   break;
  //
  //     case "close":
  //     case "nav":
  //       this.clearQuery();
  //       this.clearCount();
  //       KarmaFieldsAlpha.Gateway.clearOptions();
  //       await super.dispatch(event);
  //       // await super.setState(null, ...path, state);
  //       break;
  //
  //     case "order":
  //       this.tablePromise = null;
  //       await this.getGrid().render();
  //       break;
  //
  //     // modal:
  //     case "prev":
  //       await this.prev();
  //       await this.render();
  //       break;
  //
  //     case "next":
  //       await this.next();
  //       await this.render();
  //       break;
  //
  //     case "close-modal":
  //       this.removeParam("id");
  //       await this.render();
  //       break;
  //
  //   }
  // }

  // async set(value, ...path) {
  //
  //   const key = path.shift();
  //
  //   value = KarmaFieldsAlpha.DeepObject.create(value, ...path);
  //
  //   switch (context) {
  //
  //     case "content":
  //       await this.super.set(value);
  //       break;
  //
  //     case "options":
  //       this.optionsBuffer.merge(value);
  //       this.clearCount();
  //       this.clearQuery();
  //       await this.render(1);
  //       break;
  //
  //     case "page":
  //       this.setParam(value[0], "page");
  //       this.clearQuery();
  //       await this.render();
  //       break;
  //
  //     // case "nextpage":
  //     //   this.setParam(Math.min(this.getPage()+1, await this.getNumPage()), "page");
  //     //   this.clearQuery();
  //     //   await this.render();
  //     //   break;
  //     //
  //     // case "prevpage":
  //     //   this.setParam(Math.max(this.getPage()-1, 0), "page");
  //     //   this.clearQuery();
  //     //   await this.render();
  //     //   break;
  //     //
  //     // case "firstpage":
  //     //   this.setParam(1, "page");
  //     //   this.clearQuery();
  //     //   await this.render();
  //     //   break;
  //     //
  //     // case "lastpage":
  //     //   this.setParam(await this.getNumPage(), "page");
  //     //   this.clearQuery();
  //     //   await this.render();
  //     //   break;
  //     //
  //     //
  //     // case "reload":
  //     //   this.clearQuery();
  //     //   this.clearCount();
  //     //   KarmaFieldsAlpha.Gateway.clearOptions();
  //     //   await this.render(1);
  //     //   break;
  //     //
  //     // case "edit-options":
  //     //   this.clearCount();
  //     //   this.clearQuery();
  //     //   await this.render(1);
  //     //   break;
  //
  //     // case "toggle-options":
  //     //   this.options.open = !this.options.open;
  //     //   await this.render();
  //     //   break;
  //     //
  //     // case "close-options":
  //     //   this.options.open = false;
  //     //   await this.render();
  //     //   break;
  //
  //     case "add":
  //       await this.add(value[0]);
  //       this.clearQuery();
  //       this.clearCount();
  //       await this.render(1);
  //       break;
  //
  //     case "delete":
  //       await this.delete(value);
  //       this.clearQuery();
  //       this.clearCount();
  //       await this.render(1);
  //       break;
  //
  //     // case "save":
  //     //   await this.grid.submit();
  //     //   this.clearQuery();
  //     //   this.clearCount();
  //     //   KarmaFieldsAlpha.Gateway.clearOptions();
  //     //   await this.render(1);
  //     //   break;
  //     //
  //     // case "undo":
  //     //   this.grid.undo();
  //     //   await this.render();
  //     //   break;
  //     //
  //     // case "redo":
  //     //   this.grid.redo();
  //     //   await this.render();
  //     //   break;
  //
  //     // case "gridvalue": // edit field in grid
  //     //   await this.renderFooter();
  //     //   break;
  //     //
  //     // case "start-selection":
  //     // case "grow-selection":
  //     // case "end-selection":
  //     //   await this.renderFooter();
  //     //   await super.set(value, ...path, context);
  //     //   break;
  //     //
  //     // case "close":
  //     // case "nav":
  //     //   this.clearQuery();
  //     //   this.clearCount();
  //     //   KarmaFieldsAlpha.Gateway.clearOptions();
  //     //   // await super.edit(value);
  //     //   await super.set(value, ...path, context);
  //     //   break;
  //
  //     // case "order":
  //     //   // this.clearQuery();
  //     //   this.tablePromise = null;
  //     //   await this.grid.render();
  //     //   break;
  //     //
  //     // case "value": // -> filters
  //     // case "pastedvalue": // -> filter search when pasted
  //     //   // const key = path.shift();
  //     //   // if (key === "grid") {
  //     //   //   await super.set(value, ...path, "value");
  //     //   // } else { // -> filters
  //     //   //   await this.setParam(value[0], key);
  //     //   // }
  //     //
  //     //   this.clearQuery();
  //     //   this.clearCount();
  //     //   this.setParam(value[0], path.join("/"));
  //     //   this.setParam(1, "page");
  //     //   await this.render();
  //     //   break;
  //
  //     // case "submit":
  //     //   await super.set(value, ...path, "submit"); // -> to gateway
  //     //   break;
  //     //
  //     // // modal:
  //     // case "prev":
  //     //   await this.prev();
  //     //   await this.render();
  //     //   break;
  //     //
  //     // case "next":
  //     //   await this.next();
  //     //   await this.render();
  //     //   break;
  //     //
  //     // case "close-modal":
  //     //   this.removeParam("id");
  //     //   await this.render();
  //     //   break;
  //
  //
  //     default: // -> filters + order
  //       this.setParam(value[0], key);
  //       break;
  //
  //
  //   }
  //
  // }

  // async setState(value, ...path) {
  //
  //   const state = path.pop();
  //
  //   switch (context) {
  //
  //     case "nextpage": {
  //       const page = await this.get("page", 0);
  //       const numpage = await this.get("numpage", 0);
  //       this.setParam(Math.min(page+1, numpage), "page");
  //       this.clearQuery();
  //       await this.render();
  //       break;
  //     }
  //
  //     case "prevpage": {
  //       const page = await this.get("page", 0);
  //       this.setParam(Math.max(page-1, 0), "page");
  //       this.clearQuery();
  //       await this.render();
  //       break;
  //     }
  //
  //     case "firstpage": {
  //       this.setParam(1, "page");
  //       this.clearQuery();
  //       await this.render();
  //       break;
  //     }
  //
  //     case "lastpage": {
  //       const numpage = await this.get("numpage", 0);
  //       this.setParam(numpage, "page");
  //       this.clearQuery();
  //       await this.render();
  //       break;
  //     }
  //
  //     case "reload": {
  //       this.clearQuery();
  //       this.clearCount();
  //       KarmaFieldsAlpha.Gateway.clearOptions();
  //       await this.render(1);
  //       break;
  //     }
  //
  //     case "toggle-options":
  //       this.options.open = !this.options.open;
  //       await this.render();
  //       break;
  //
  //     case "close-options":
  //       this.options.open = false;
  //       await this.render();
  //       break;
  //
  //     case "add":
  //       await this.add(1);
  //       this.clearQuery();
  //       this.clearCount();
  //       await this.render(1);
  //       break;
  //
  //     case "delete": {
  //       const selectedIds = await this.get("selectedIds");
  //       await this.delete(selectedIds);
  //       this.clearQuery();
  //       this.clearCount();
  //       await this.render(1);
  //       break;
  //     }
  //
  //     case "save":
  //       await this.getGrid().setState(null, "submit");
  //       this.clearQuery();
  //       this.clearCount();
  //       KarmaFieldsAlpha.Gateway.clearOptions();
  //       await this.render(1);
  //       break;
  //
  //     case "undo":
  //       this.getGrid().undo();
  //       await this.render();
  //       break;
  //
  //     case "redo":
  //       this.getGrid().redo();
  //       await this.render();
  //       break;
  //
  //     case "edit": // edit field in grid
  //       await this.renderFooter();
  //       break;
  //
  //     case "start-selection":
  //     case "grow-selection":
  //     case "end-selection":
  //       await this.renderFooter();
  //       break;
  //
  //     case "close":
  //     case "nav":
  //       this.clearQuery();
  //       this.clearCount();
  //       KarmaFieldsAlpha.Gateway.clearOptions();
  //       await super.setState(null, ...path, state);
  //       break;
  //
  //     case "order":
  //       this.tablePromise = null;
  //       await this.getGrid().render();
  //       break;
  //
  //     // case "value": // -> filters
  //     // case "pastedvalue": // -> filter search when pasted
  //     //   // const key = path.shift();
  //     //   // if (key === "grid") {
  //     //   //   await super.set(value, ...path, "value");
  //     //   // } else { // -> filters
  //     //   //   await this.setParam(value[0], key);
  //     //   // }
  //     //
  //     //   this.clearQuery();
  //     //   this.clearCount();
  //     //   this.setParam(value[0], path.join("/"));
  //     //   this.setParam(1, "page");
  //     //   await this.render();
  //     //   break;
  //
  //     // case "submit":
  //     //   await super.set(value, ...path, "submit"); // -> to gateway
  //     //   break;
  //
  //     // modal:
  //     case "prev":
  //       await this.prev();
  //       await this.render();
  //       break;
  //
  //     case "next":
  //       await this.next();
  //       await this.render();
  //       break;
  //
  //     case "close-modal":
  //       this.removeParam("id");
  //       await this.render();
  //       break;
  //
  //
  //     // default:
  //     //   this.setParam(value[0], context);
  //     //   break;
  //
  //
  //   }
  //
  // }


  async getNumPage() {
    const count = await this.getCount();
    const ppp = this.getPpp();
    return Math.max(1, Math.ceil(count/ppp));
  }

  getPage() {
    return this.hasParam("page") && Number(this.getParam("page")) || 1;
  }

  // prev modal
  async prev() {
    let ids = await this.getIds();
    let id = this.getParam("id");
    const page = await this.get("page", 0);
    const index = ids.indexOf(id);

    if (index === 0) {
      if (page > 1) {
        this.setParam(page - 1, "page");
        ids = await this.getIds();
        id = ids[ids.length - 1];
      } else {
        id = ids[0];
      }
    } else if (index > -1) {
      id = ids[index - 1];
    }
    this.setParam(id, "id");
  }

  async next() {
    let ids = await this.getIds();
    let id = this.getParam("id");
    const page = await this.get("page", 0);
    const numpage = await this.get("numpage");
    const index = ids.indexOf(id);

    if (index === ids.length-1) {
      if (page < numpage) {
        this.setParam(page + 1, "page");
        ids = await this.getIds();
        id = ids[0];
      } else {
        id = ids[ids.length - 1];
      }
    } else if (index > -1) {
      id = ids[index + 1];
    }
    this.setParam(id, "id");
  }

  // getDefaultPpp() {
  //   return this.resource.ppp || 10;
  // }
  //
  // getPpp() {
  //   // return Number(this.options.getParam("ppp") || this.getParam("ppp") || this.resource.ppp || 10);
  //   let value = this.options.getChild("form").buffer.get("ppp") || [];
  //   return value[0] || this.getDefaultPpp();
  // }




  build() {
    return {
      class: "karma-field-table",
      init: table => {
        this.render = table.render;
      },
      update: table => {
        table.element.classList.add("table-loading");
        const active = this.getParam("karma") === this.resource.id;
        table.element.style.display = active ? "flex" : "none";

        // console.log(active, this.resource);

        if (active) {
          table.children = [
            this.interface.build(),
            {
              class: "table-view",
              children: [
                this.buildModal(),
                {
                  class: "table-main",
                  children: [
                    {
                      class: "table-header karma-field-frame",
                      child: this.header.build()
                    },
                    {
                      class: "table-body karma-field-table-columns",
                      children: [
                        {
                          class: "karma-field-table-column grid-column",
                          children: [

                            {
                              class: "karma-field-table-section karma-field-frame final",
                              init: filters => {
                                filters.element.classList.toggle("hidden", !this.resource.filters);
                              },
                              // child: this.filters.build()
                              child: this.createChild({
                                type: "group",
                                ...this.resource.filters,
                                id: "filters",
                                value: "filters"
                              }).build()
                            },
                            // ...this.subsections.map(subsection => {
                            //   return {
                            //     class: "karma-field-table-section karma-field-frame final",
                            //     child: subsection.build()
                            //   };
                            // }),
                            ...(this.resource.subsections || []).map(resource => {
                              return {
                                class: "karma-field-table-section karma-field-frame final",
                                child: this.createChild(resource).build()
                              };
                            }),
                            // content.build()
                            {
                              class: "karma-field-table-grid-container karma-field-frame karma-field-group final",
                              init: body => {
                                // this.renderBody = body.render;

                                // this.listeners.push(body.render);
                              },
                              child: this.buildGrid()

                            }
                          ]
                        },
                        {
                          class: "karma-field-table-column options-column karma-field-frame final",
                          init: column => {
                            // this.listeners.push(column.render);
                            this.options.render = column.render;
                          },
                          update: column => {
                            column.element.classList.toggle("hidden", !this.options.open);
                            column.children = this.options.open ? [this.options.getModal().build()] : [];
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              class: "table-footer table-control",
              init: footer => {
                this.controls.render = footer.render;
              },
              update: footer => {
                footer.element.classList.toggle("hidden", this.resource.controls === false);
                if (this.resource.controls !== false) {
                  footer.child = this.controls.build();
                }
              }
            }
          ];
        } else {
          table.children = [];
        }
      },
      complete: table => {
        table.element.classList.remove("table-loading");
      }
      // children: [
      //   {
      //     class: "table-view",
      //     children: [
      //       // {
      //       //   class: "table-modal",
      //       //   init: single => {
      //       //
      //       //   },
      //       //   update: async single => {
      //       //
      //       //     single.children = [];
      //       //
      //       //     if (this.hasParam("id")) {
      //       //
      //       //       // let percentWidth = this.options.getParam("modalWidth") || "100";
      //       //
      //       //       // let percentWidth = this.getModalWidth && this.getModalWidth() || "100";
      //       //
      //       //       let percentWidth = this.options.buffer.get("modalWidth") || ["100"];
      //       //
      //       //       single.element.style.flexBasis = percentWidth[0]+"%";
      //       //
      //       //       const id = this.getParam("id");
      //       //       // const rowField = this.grid.getRow(id);
      //       //       // const rowField = this.grid.createChild({
      //       //       //   key: id,
      //       //       //   columns: this.resource.columns || []
      //       //       // });
      //       //       const row = this.grid.createChild({
      //       //         key: id,
      //       //         type: "field",
      //       //         columns: this.resource.columns || [],
      //       //         id: id
      //       //       });
      //       //
      //       //       const modalField = rowField && rowField.children.find(child => child.resource.type === "modal");
      //       //
      //       //       if (modalField) {
      //       //
      //       //         single.children = [
      //       //           {
      //       //             class: "karma-modal",
      //       //             children: [
      //       //               {
      //       //                 class: "karma-modal-header table-header",
      //       //                 children: [
      //       //                   modalField.build(),
      //       //                   {
      //       //                     class: "modal-navigation",
      //       //                     children: (this.resource.modal_header || [
      //       //                       "prev",
      //       //                       "next",
      //       //                       "closemodal"
      //       //                     ]).map(item => this.constructor.defaults[item])
      //       //
      //       //                   }
      //       //                 ]
      //       //               },
      //       //               {
      //       //                 class: "karma-modal-body karma-field-frame",
      //       //                 update: frame => {
      //       //                   frame.element.classList.toggle("final", modalField.resource.final || false);
      //       //                 },
      //       //                 child: modalField.content.build()
      //       //               }
      //       //             ]
      //       //           },
      //       //           {
      //       //             class: "modal-resize-handle",
      //       //             update: handle => {
      //       //               handle.element.onmousedown = event => {
      //       //                 const mouseMove = event => {
      //       //                   const modalBox = single.element.getBoundingClientRect();
      //       //                   const viewerBox = single.element.parentNode.getBoundingClientRect();
      //       //                   const ratioWidth = (event.clientX - viewerBox.left)/viewerBox.width;
      //       //                   percentWidth = Math.min(100, 100*ratioWidth);
      //       //                   single.element.style.flexBasis = percentWidth.toFixed(4)+"%";
      //       //                   // this.options.setParam(percentWidth, "modalWidth");
      //       //                   this.options.buffer.set([percentWidth], "modalWidth");
      //       //                 }
      //       //                 const mouseUp = event => {
      //       //                   window.removeEventListener("mousemove", mouseMove);
      //       //                   window.removeEventListener("mouseup", mouseUp);
      //       //                 }
      //       //                 window.addEventListener("mousemove", mouseMove);
      //       //                 window.addEventListener("mouseup", mouseUp);
      //       //               }
      //       //             }
      //       //           }
      //       //         ];
      //       //
      //       //       }
      //       //     }
      //       //   }
      //       // },
      //       this.buildModal(),
      //       {
      //         class: "table-main",
      //         children: [
      //           {
      //             class: "table-header karma-field-frame",
      //             child: this.createTablePart({
      //               id: "header",
      //               key: "header",
      //               type: "header",
      //               ...this.resource.header
      //             })
      //           //   update: header => {
      //           //
      //           //
      //           //     const headerField = new KarmaFieldsAlpha.fields.table.header({
      //           //       id: "header",
      //           //       key: "header",
      //           //       ...this.resource.header
      //           //     });
      //           //     this.addChild(headerField);
      //           //     header.child = headerField.build();
      //           //
      //           //   }
      //           },
      //           {
      //             class: "table-body karma-field-table-columns",
      //             children: [
      //               {
      //                 class: "karma-field-table-column grid-column",
      //                 children: [
      //
      //                   {
      //                     class: "karma-field-table-section karma-field-frame final",
      //                     init: filters => {
      //                       filters.element.classList.toggle("hidden", !this.resource.filters);
      //                     },
      //                     // child: this.filters.build()
      //                     child: this.createChild({
      //                       type: "group",
      //                       ...this.resource.filters,
      //                       id: "filters",
      //                       value: "filters"
      //                     }).build()
      //                   },
      //                   // ...this.subsections.map(subsection => {
      //                   //   return {
      //                   //     class: "karma-field-table-section karma-field-frame final",
      //                   //     child: subsection.build()
      //                   //   };
      //                   // }),
      //                   ...(this.resource.subsections || []).map(resource => {
      //                     return {
      //                       class: "karma-field-table-section karma-field-frame final",
      //                       child: this.createChild(resource).build()
      //                     };
      //                   }),
      //                   // content.build()
      //                   {
      //                     class: "karma-field-table-grid-container karma-field-frame karma-field-group final",
      //                     init: body => {
      //                       // this.renderBody = body.render;
      //
      //                       // this.listeners.push(body.render);
      //                     },
      //                     child: this.buildGrid()
      //                   }
      //                 ]
      //               },
      //               {
      //                 class: "karma-field-table-column options-column karma-field-frame final",
      //                 init: column => {
      //                   // this.listeners.push(column.render);
      //                   this.options.render = column.render;
      //                 },
      //                 update: column => {
      //                   column.element.classList.toggle("hidden", !this.options.open);
      //
      //
      //
      //                   // column.children = [];
      //                   // if (currentTable.options.open) {
      //                   //   column.children = [currentTable.options.build()];
      //                   // }
      //                   column.children = this.options.open ? [this.options.getModal().build()] : [];
      //                 }
      //               }
      //             ]
      //           }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     class: "table-footer table-control",
      //     init: footer => {
      //       this.controls.render = footer.render;
      //     },
      //     update: footer => {
      //       footer.element.classList.toggle("hidden", this.resource.controls === false);
      //
      //       if (this.resource.controls !== false) {
      //         // const controlsField = new KarmaFieldsAlpha.fields.table.controls({
      //         //   id: "controls",
      //         //   key: "controls",
      //         //   ...this.resource.controls
      //         // });
      //         // this.addChild(controlsField);
      //         // footer.child = controlsField.build();
      //
      //         // footer.child = this.createTablePart({
      //         //   id: "controls",
      //         //   key: "controls",
      //         //   type: "controls",
      //         //   ...this.resource.controls
      //         // });
      //
      //         footer.child = this.controls.build();
      //
      //         // footer.child = this.createChild({
      //         //   id: "footer",
      //         //   key: "controls",
      //         //   type: "group",
      //         //   display: "flex",
      //         //   children: [
      //         //     {
      //         //       type: "group",
      //         //       display: "flex",
      //         //       style: "flex-grow:1",
      //         //       children: (this.resource.footer_left_buttons || ["save", "add", "delete"]).map(button => {
      //         //         return this.constructor.defaults[button];
      //         //       })
      //         //     },
      //         //     {
      //         //       type: "group",
      //         //       display: "flex",
      //         //       container: {style: "justify-content:flex-end"},
      //         //       children: (this.resource.footer_right_buttons || ["undo", "redo"]).map(button => {
      //         //         return this.constructor.defaults[button];
      //         //       })
      //         //     }
      //         //   ]
      //         // }).build();
      //       }
      //     }
      //   }
      // ]
    };
  }


  //
  // getHeader() {
  //   return this.createChild(this.resource.header || this.constructor.defaults.header);
  // }
  //
  // getModalHeader() {
  //   return this.createChild(this.resource.modalheader || this.constructor.defaults.modalheader);
  // }
  //
  // getFooter() {
  //   return this.createChild(this.resource.footer || {
  //     id: "footer",
  //     type: "group",
  //     display: "flex",
  //     children: [
  //       {
  //         type: "group",
  //         display: "flex",
  //         style: "flex-grow:1",
  //         children: (this.resource.footer_left_buttons || [
  //           "save",
  //           "add",
  //           "delete"
  //         ]).map(resource => this.parseResource(resource))
  //       },
  //       {
  //         type: "group",
  //         display: "flex",
  //         container: {style: "justify-content:flex-end"},
  //         children: (this.resource.footer_right_buttons || [
  //           "undo",
  //           "redo"
  //         ]).map(resource => this.createChild(this.parseResource(resource)).build())
  //       }
  //     ]
  //   });
  // }
  //
  // getFooterLeft() {
  //
  // }


  async getIds() {
    const queriedIds = await this.getQueriedIds();

    // console.log("getIds", queriedIds);

    const extraIds = this.extraIdBuffer.get("ids") || [];

    const ids = [...extraIds, ...queriedIds].filter(id => {
      const trash = this.grid.buffer.get(id, "trash") || this.buffer.get(id, "trash");
      return !trash || trash[0] !== "1";
    });


    // this.extraIdBuffer.set([...ids, ...extraIds], "ids");

    // const queriedIds = await this.get("queriedids");

    // const ids = queriedIds.filter(id => {
    //   const value = this.grid.buffer.get(id, "trash");
    //   return !value || value[0] !== "1";
    // });
    //
    // Object.keys(this.grid.buffer.get() || {}).filter(id => {
    //   const value = this.grid.buffer.get(id, "trash");
    //   return value && value.toString() === "0" && !ids.includes(id);
    // }).reverse().forEach(id => {
    //   ids.splice(this.getExtraOrder(id), 0, id);
    // });

    return ids;
  }

  getExtraOrder(id) {
    return this.extraOrders && this.extraOrders[id] || 0;
  }

  setExtraOrder(id, order) {
    if (!this.extraOrders) {
      this.extraOrders = {};
    }
    this.extraOrders[id] = order;
  }

  // deprecated
  getRow(id) {

    // let row = this.getChild(id);
    //
    // if (!row) {
    //   row = new KarmaFieldsAlpha.fields.tableRow({
    //     key: id,
    //     columns: this.resource.columns
    //   });
    //   this.addChild(row);
    // }
    //
    // return row;

    return this.grid.createChild({
      key: id,
      columns: this.resource.columns || []
    });
  }

  // getDefaultOrderby() {
  //   if (!this.defaultOrderby) {
  //     this.defaultOrderby = this.resource.orderby;
  //     if (!this.defaultOrderby) {
  //       const column = this.resource.columns.find(column => (column.orderby || column.field && column.field.key));
  //       this.defaultOrderby = column && (column.orderby || column.field && column.field.key) || "default";
  //     }
  //   }
  //   return this.defaultOrderby;
  // }
  //
  // getDefaultOrder() {
  //   if (!this.defaultOrder) {
  //     const column = this.resource.orderby && this.resource.columns.find(column => (column.orderby || column.field && column.field.key) === this.resource.orderby);
  //     this.defaultOrder = column && column.order || "asc";
  //   }
  //   return this.defaultOrder;
  // }

  // reorder(column) {
  //   const orderby = this.getParam("orderby") || this.getDefaultOrderby();
  //   const order = this.getParam("order") || this.getDefaultOrder();
  //   const key = column.orderby || column.field.key;
  //
  //   if (key) {
  //     if (orderby === key) {
  //       this.setParam(order === "asc" ? "desc" : "asc", "order");
  //     } else {
  //       this.setParam(column.order || "asc", "order");
  //       this.setParam(key, "orderby");
  //     }
  //     if (super.hasParam("page") && super.getParam("page") !== "1") {
  //       this.setParam(1, "page");
  //     }
  //   }
  //
  // }


  async add(num) {
    // debugger;
    let rows = await KarmaFieldsAlpha.Gateway.post("add/"+this.resource.driver);


    // compat
    if (!Array.isArray(rows)) {
      rows = [rows];
    }
    rows = rows.map(row => {
      if (typeof row !== "object") {
        return {id: row.toString()};
      }
      if (!row.trash) {
        row.trash = "1";
      }
      return row;
    });




    // compat
    // ids = ids.map(id => id.id || id);
    //
    // ids = ids.map(id => id.toString());

    const resources = this.getSubResources(this.resource);

    for (let row of rows) {

      for (let key in row) {

        this.buffer.set(row[key], row.id, key, 0);

      }

      for (let resource of resources) {

        this.grid.writeHistory(null, row.id, resource.key);

      }

      this.grid.writeHistory("1", row.id, "trash", 0);
    }

    this.grid.save("add");

    for (let row of rows) {


      for (let resource of resources) {

        const defaultValue = await this.createField(resource).getDefault();

        this.grid.set(defaultValue, row.id, resource.key, 0);
        this.grid.writeHistory(defaultValue, row.id, resource.key, 0);

      }

      // await this.grid.setValue(null, ["0"], id, "trash");
      this.grid.set("0", row.id, "trash", 0);
      this.grid.writeHistory("0", row.id, "trash", 0);

    }

    const ids = rows.map(row => row.id);

    const extraIds = this.extraIdBuffer.get("ids") || [];
    this.extraIdBuffer.set([...ids, ...extraIds], "ids");

    return ids;
  }

  async remove() {
    let ids = await this.getSelectedIds();

    const resources = this.getSubResources(this.resource);

    for (let id of ids) {

      this.grid.writeHistory("0", id, "trash", 0);

      for (let resource of resources) {

        await this.grid.write(id, resource.key);

      }

    }

    this.grid.save("table-delete");

    for (let id of ids) {

      this.grid.set("1", id, "trash", 0);
      this.grid.writeHistory("1", id, "trash", 0);

      for (let resource of resources) {

        this.grid.remove(id, resource.key);
        this.grid.writeHistory(null, id, resource.key);

      }

    }

    const extraIds = this.extraIdBuffer.get("ids") || [];
    this.extraIdBuffer.set(extraIds.filter(id => ids.indexOf(id) === -1), "ids");

  }

  async duplicate() {
    let ids = await this.getSelectedIds();
    // let ids = await this.get("selectedids");
    const grid = this.getGrid();

    if (ids.length) {
      const cloneIds = await this.add(ids.length);

      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let cloneId = cloneIds[i];

        // for (let field of this.getRow(id).getDescendants()) {
        //
        //   const value = await field.fetchValue();
        //   this.grid.setValue(null, value, cloneId, ...field.getPath().slice(1));
        //
        // }

        for (let column of this.resource.column) {

          if (column.field.key) {

            const value = await grid.getValue(id, column.field.key);
            grid.setValue(value, cloneId, column.field.key);
            grid.writeHistory(value, cloneId, column.field.key);

          }

        }

        // const contentIds = await this.get("ids");
        // let index = contentIds.indexOf(ids[ids.length-1]);
        //
        // this.setExtraOrder(cloneId, index+1);

        this.extraIdBuffer.set([id, ...this.extraIdBuffer.get()]);

      }

    }
  }


  // // override setValue
  // setValue(deprec, value, ...path) {
  //
  //   if (value.constructor === KarmaFieldsAlpha.PastedString && this.parent) {
  //
  //     const data = value[0].split(/[\r\n]/).map(row => row.split("\t"));
  //
  //     const field = this.grid.getChild(...path);
  //     // const point = KarmaFieldsAlpha.Selection.fields.find(field);
  //     const point = {
  //       x: this.grid.colMap(field),
  //       y: this.grid.rowMap(field),
  //     };
  //
  //     this.grid.importSelection(data, point);
  //
  //   } else {
  //
  //     super.setValue(null, value, ...path);
  //
  //   }
  //
  // }


  async getSelectedIds() {
    if (this.hasParam("id")) {
      return [this.getParam("id")];
    } else if (this.selection && this.selection.width === this.elementsMap.width) {
      const ids = await this.getIds();
      return ids.slice(this.selection.y, this.selection.y + this.selection.height);
    }
    return [];
  }


  // async importSelection(data, selection) {
  //
  //
  //   const r = new KarmaFieldsAlpha.Rect();
  //
  //   const {x, y, width, height} = {...r, ...selection};
  //
  //   let ids = await this.getIds();
  //
  //   // for (let j = 0; j < Math.max(height, data.length); j++) {
  //   //   const rowField = this.getChild(ids[j+y]);
  //   //   if (rowField) {
  //   //     for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
  //   //       const cellField = rowField.children[i+x];
  //   //       if (cellField) {
  //   //         await cellField.write();
  //   //       }
  //   //     }
  //   //   }
  //   // }
  //   //
  //   // if (data.length > ids.length-y) {
  //   //   await this.add(data.length-(ids.length-y), false); // -> will backup
  //   //   ids = await this.getIds();
  //   // } else {
  //   //   KarmaFieldsAlpha.History.backup();
  //   //   KarmaFieldsAlpha.History.id = null;
  //   // }
  //
  //
  //
  //
  //   // if (KarmaFieldsAlpha.History.id !== selection) {
  //   //
  //   //   KarmaFieldsAlpha.History.id = selection;
  //
  //     for (let j = 0; j < Math.max(height, data.length); j++) {
  //       const rowField = this.grid.getChild(ids[j+y]);
  //       if (rowField) {
  //         for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
  //           const cellField = rowField.children[i+x];
  //           if (cellField) {
  //             await cellField.write();
  //           }
  //         }
  //       }
  //     }
  //
  //     this.nextup(selection);
  //
  //   //   KarmaFieldsAlpha.History.backup();
  //   //
  //   // }
  //
  //   for (let j = 0; j < Math.max(height, data.length); j++) {
  //     const rowField = this.grid.getChild(ids[j+y]);
  //     if (rowField) {
  //       for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
  //         const cellField = rowField.children[i+x];
  //         if (cellField) {
  //           const value = data[j%data.length][i%data[j%data.length].length];
  //
  //           // console.log(value, cellField.getPath(), i, x);
  //           await cellField.importValue(value);
  //           await cellField.render();
  //         }
  //       }
  //     }
  //
  //   }
  //
  // }

  getGrid() {
    return this.grid;
    // return this.createChild({
    //   ...this.resource.grid,
    //   driver: this.resource.driver,
    //   columns: this.resource.columns,
    //   type: "tableGrid",
    //   id: "grid",
    //   key: "content"
    // });
  }
  //
  // getOptions() {
  //   return this.options;
  //   // return this.createChild({
  //   //   type: "button",
  //   //   title: "Options",
  //   //   id: "options",
  //   //   action: "toggle-options",
  //   //   modal: {
  //   //     id: "form",
  //   //     key: "options",
  //   //     type: "form",
  //   //     children: [
  //   //       {
  //   //         type: "input",
  //   //         key: "ppp",
  //   //         label: "Items number",
  //   //         input: {type: "number", style: "max-width:5em;"}
  //   //       },
  //   //       {
  //   //         type: "checkboxes",
  //   //         key: "columns",
  //   //         label: "Display columns",
  //   //         options: this.resource.columns.map((column, index) => {
  //   //           return {
  //   //             key: index.toString(),
  //   //             name: column.title
  //   //           }
  //   //         })
  //   //       },
  //   //       {
  //   //         type: "group",
  //   //         display: "flex",
  //   //         children: [
  //   //           {
  //   //             type: "button",
  //   //             primary: true,
  //   //             style: "min-width:0",
  //   //             action: "edit-options",
  //   //             disabled: "!modified",
  //   //             title: "Save"
  //   //           },
  //   //           {
  //   //             type: "button",
  //   //             style: "min-width:0;",
  //   //             action: "close-options",
  //   //             title: "Close"
  //   //           }
  //   //         ]
  //   //       }
  //   //
  //   //     ]
  //   //   }
  //   // });
  // }
  //




  // async updateTA() {
  //
  //   const data = [];
  //
  //   // const ids = await this.getIds();
  //
  //   if (this.selection && this.selection.width*this.selection.height > 1) {
  //
  //     for (let j = 0; j < this.selection.height; j++) {
  //
  //       const dataRow = [];
  //       // const id = ids[this.selection.y+j];
  //       // const row = this.getChild(id);
  //
  //       for (let i = 0; i < this.selection.width; i++) {
  //
  //         // const field = row.children.find(child => child.resource.index === table.grid.selection.x+i);
  //         const field = this.fieldsMap.get(this.selection.x + i, this.selection.y + j);
  //         const value = await field.exportValue();
  //
  //         dataRow.push(value);
  //
  //       }
  //
  //       data.push(dataRow);
  //
  //     }
  //
  //     this.ta.focus();
  //     this.ta.value = data.map(row => row.join("\t")).join("\n");
  //     this.ta.select();
  //
  //   } else {
  //
  //     this.ta.value = "";
  //
  //   }
  //
  //
  //
  //   // this.renderFooter();
  //
  // }

  // async importData(data, point) {
  //
  //
  //   const {x, y, width, height} = {...new KarmaFieldsAlpha.Rect(), ...point, ...this.selection};
  //
  //   for (let j = 0; j < Math.max(height, data.length); j++) {
  //     for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
  //       const field = this.fieldsMap.get(x + i, y + j);
  //       if (field) {
  //         await field.backup();
  //       }
  //     }
  //   }
  //
  //   this.grid.save("import-data");
  //
  //   for (let j = 0; j < Math.max(height, data.length); j++) {
  //     for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
  //       const field = this.fieldsMap.get(x + i, y + j);
  //       if (field) {
  //         const value = data[j%data.length][i%data[j%data.length].length];
  //         await field.importValue(value);
  //         await field.render();
  //       }
  //     }
  //   }
  //
  // }
  //
  // registerTable(element) {
  //
  //   this.endSelection();
  //
  //   this.elementsMap = new KarmaFieldsAlpha.Grid();
  //   this.fieldsMap = new KarmaFieldsAlpha.Grid();
  //
  // }
  //
  // registerCell(element, col, row, field) {
  //
  //   this.elementsMap.set(element, col, row);
  //   this.fieldsMap.set(field, col, row);
  //
  //   element.onmousedown = event => {
  //     this.startSelection({x: col, y:row, width: 1, height: 1});
  //   }
  //
  //   element.onmousemove = event => {
  //     if (event.buttons === 1) {
  // 			this.growSelection({x: col, y:row, width: 1, height: 1});
  // 		}
	// 	}
  //
  // }
  //
	// registerIndex(element, row) {
  //
  //   element.onmousedown = event => {
  //     event.preventDefault();
	// 		this.toggleSelection({x: 0, y: row, width: this.elementsMap.width, height: 1});
	// 	}
  //
	// 	element.onmousemove = event => {
  //     if (event.buttons === 1) {
  // 			this.growSelection({x: 0, y: row, width: this.elementsMap.width, height: 1});
  //     }
	// 	}
  // }
  //
	// registerHeader(element, col) {
  //
  //   element.onmousedown = event => {
  //     event.preventDefault();
	// 		this.toggleSelection({x: col, y: 0, width: 1, height: this.elementsMap.height});
	// 	}
  //
	// 	element.onmousemove = event => {
  //     if (event.buttons === 1) {
  // 			this.growSelection({x: col, y: 0, width: 1, height: this.elementsMap.height});
  //     }
	// 	}
  // }
  //
	// registerHeaderIndex(element) {
  //
  //   element.onmousedown = event => {
  //     event.preventDefault();
	// 		this.toggleSelection({x:0, y:0, width:this.elementsMap.width, height:this.elementsMap.height});
	// 	}
  //
	// 	element.onmousemove = event => {
  //     if (event.buttons === 1) {
  // 			this.growSelection({x: 0, y :0, width: this.elementsMap.width, height: this.elementsMap.height});
  //     }
	// 	}
  // }
  //
	// growSelection(r) {
  //
  //   if (this.focusRect) {
  //     r = KarmaFieldsAlpha.Rect.union(this.focusRect, r);
  //   } else {
  //     this.focusRect = r;
  //   }
  //
  //   if (r.width*r.height > 1) {
  //
  //     if (this.selection) {
  //
  //       if (!KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
  //
  //         this.unpaint(this.selection);
  //         this.selection = r;
  //         this.paint(this.selection);
  //         // this.updateTA();
  //         this.grid.triggerListeners();
  //
  //
  //       }
  //
  //     } else {
  //
  //       this.selection = r;
  //       this.paint(this.selection);
  //       // this.updateTA();
  //       this.grid.triggerListeners();
  //
  //     }
  //
  //   } else if (this.selection) {
  //
  //     this.unpaint(this.selection);
  //     this.selection = null;
  //     // this.updateTA();
  //     this.grid.triggerListeners();
  //
  //   }
  //
	// }
  //
  // startSelection(r) {
  //   this.endSelection();
  //   this.focusRect = r;
  // }
  //
  // toggleSelection(r) {
  //   if (this.selection && KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
  //     this.endSelection();
  //   } else {
  //     this.startSelection(r);
  //     this.growSelection(r);
  //   }
  // }
  //
  // endSelection() {
	// 	if (this.selection) {
	// 		this.unpaint(this.selection);
  //     this.selection = null;
  // 		this.focusRect = null;
  //     // this.updateTA();
  //     // this.grid.triggerListeners();
  //     const content = this.grid.getChild("content");
  //     const event = content.createEvent({
  //       splash: true
  //     });
  //     content.dispatch(event);
	// 	}
	// }
  //
	// paint(rect) {
	// 	for (let i = rect.x; i < rect.x + rect.width; i++) {
	// 		for (let j = rect.y; j < rect.y + rect.height; j++) {
	// 			let element = this.elementsMap.get(i, j);
	// 			if (element) {
	// 				element.classList.add("selected");
	// 			}
	// 		}
	// 	}
	// }
  //
	// unpaint(rect) {
	// 	for (let i = rect.x; i < rect.x + rect.width; i++) {
	// 		for (let j = rect.y; j < rect.y + rect.height; j++) {
	// 			let element = this.elementsMap.get(i, j);
	// 			if (element) {
	// 				element.classList.remove("selected");
	// 			}
	// 		}
	// 	}
	// }

  buildGrid() {
    return {
      class: "table grid",
      init: async grid => {

        // this.grid.render = async clean => {
        //   await grid.render(clean);
        //   await this.interface.render();
        // };
        this.grid.render = grid.render;

        if (this.resource.style) {
          grid.element.style = this.resource.style;
        } else if (this.resource.grid && this.resource.grid.style) {
          grid.element.style = this.resource.grid.style;
        }
      },
      update: async grid => {

        const ids = await this.getIds();
        const page = this.getPage();
        const ppp = this.getPpp();
        const columns = this.getColumns();
        const order = this.getOrder();
        const orderby = this.getOrderby();


        // const content = this.grid.createChild({
        //   id: "content",
        //   key: "content"
        // });

        // this.grid.splash = async request => {
        //   await grid.render();
        //   await this.interface.render();
        // };


        // console.log(ids, page, ppp, columns, order, orderby);

        this.interface.registerTable(grid.element);

        if (ids.length) {
          grid.element.classList.add("filled"); // -> draw table borders
          grid.children = [
            {
              class: "th",
              child: {
                class: "table-index",
                init: node => {
                  node.element.textContent = "#";
                }
              },
              update: th => {
                this.interface.registerHeaderIndex(th.element);
              }
            },
            ...columns.map((colId, colIndex) => {
              const column = this.resource.columns[colId];
              return {
                class: "th table-header-cell",
                init: th => {
                  if (column.style) {
                    th.element.style = column.style;
                  }
                },
                update: th => {
                  th.children = [
                    {
                      tag: "a",
                      class: "header-cell-title",
                      init: a => {
                        a.element.textContent = column.title;
                      }
                    },
                  ];
                  if (column.sortable) {
                    th.children.push({
                      tag: "a",
                      class: "header-cell-order",
                      child: {
                        tag: "span",
                        class: "dashicons",
                        update: span => {
                          // const order = this.getParam("order");
                          // const orderby = this.getParam("orderby");
                          const isAsc = orderby.toString() === (column.orderby || column.field.key) && order.toString() === "asc";
                          const isDesc = orderby.toString() === (column.orderby || column.field.key) && order.toString() === "desc";
                          span.element.classList.toggle("dashicons-arrow-up", isAsc);
                          span.element.classList.toggle("dashicons-arrow-down", isDesc);
                          span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
                        }
                      },
                      update: a => {
                        a.element.onclick = async event => {
                          event.preventDefault();
                          a.element.parentNode.classList.add("loading");
                          // this.reorder(column);
                          const key = column.orderby || column.field.key;
                          if (key) {
                            if (orderby.toString() === key) {
                              this.setParam(order.toString() === "asc" ? "desc" : "asc", "order");
                            } else {
                              this.setParam(column.order || "asc", "order");
                              this.setParam(key, "orderby");
                            }
                            if (page !== 1) {
                              this.setParam(1, "page");
                            }
                          }
                          // await this.parent.edit("order");
                          this.tablePromise = null;
                          await this.renderGrid();
                          a.element.parentNode.classList.remove("loading");
                        };
                      }
                    });
                  }
                  this.interface.registerHeader(th.element, colIndex);
                }
              }
            }),
            ...ids.reduce((children, id, rowIndex) => {
              // const row = this.grid.createChild({
              const row = this.grid.createChild({
                key: id,
                type: "field",
                columns: this.resource.columns || [],
                id: id
              });
              return [
                ...children,
                {
                  class: "th",
                  child: {
                    class: "table-index",
                    update: node => {
                      node.element.textContent = (Number(page) - 1)* Number(ppp) + rowIndex + 1;
                    }
                  },
                  update: th => {
                    this.interface.registerIndex(th.element, rowIndex);
                  }
                },
                ...columns.map((colId, colIndex) => {
                  const column = this.resource.columns[colId];
                  const field = row.createChild({
                    ...column.field,
                    id: colId,
                    index: colIndex
                  });

                  return {
                    class: "td table-cell",
                    init: td => {
                      if (column.style) {
                        td.element.style = column.style;
                      }
                    },
                    update: td => {
                      this.interface.registerCell(td.element, colIndex, rowIndex, field);
                    },
                    child: field.build()
                  };
                })
              ];
            }, [])
          ];

          grid.element.style.gridTemplateColumns = [
            this.resource.index && this.resource.index.width || "50px",
            ...columns.map(index => this.resource.columns[index].width || "auto")
          ].join(" ");

        } else {
          grid.children = [];
          grid.element.classList.remove("filled");
        }
      }
    };
  }

  buildModal() {
    return {
      class: "table-modal",
      init: single => {

      },
      update: async single => {

        single.children = [];

        if (this.hasParam("id")) {

          // let percentWidth = this.options.getParam("modalWidth") || "100";

          // let percentWidth = this.getModalWidth && this.getModalWidth() || "100";

          let percentWidth = this.options.buffer.get("modalWidth") || ["100"];

          single.element.style.flexBasis = percentWidth[0]+"%";

          const id = this.getParam("id");
          // const rowField = this.grid.getRow(id);
          // const rowField = this.grid.createChild({
          //   key: id,
          //   columns: this.resource.columns || []
          // });
          const row = this.grid.createChild({
            key: id,
            type: "field",
            columns: this.resource.columns || [],
            id: id
          });

          const modalField = rowField && rowField.children.find(child => child.resource.type === "modal");

          if (modalField) {

            single.children = [
              {
                class: "karma-modal",
                children: [
                  {
                    class: "karma-modal-header table-header",
                    children: [
                      modalField.build(),
                      {
                        class: "modal-navigation",
                        children: (this.resource.modal_header || [
                          "prev",
                          "next",
                          "closemodal"
                        ]).map(item => this.constructor.defaults[item])

                      }
                    ]
                  },
                  {
                    class: "karma-modal-body karma-field-frame",
                    update: frame => {
                      frame.element.classList.toggle("final", modalField.resource.final || false);
                    },
                    child: modalField.content.build()
                  }
                ]
              },
              {
                class: "modal-resize-handle",
                update: handle => {
                  handle.element.onmousedown = event => {
                    const mouseMove = event => {
                      const modalBox = single.element.getBoundingClientRect();
                      const viewerBox = single.element.parentNode.getBoundingClientRect();
                      const ratioWidth = (event.clientX - viewerBox.left)/viewerBox.width;
                      percentWidth = Math.min(100, 100*ratioWidth);
                      single.element.style.flexBasis = percentWidth.toFixed(4)+"%";
                      // this.options.setParam(percentWidth, "modalWidth");
                      this.options.buffer.set([percentWidth], "modalWidth");
                    }
                    const mouseUp = event => {
                      window.removeEventListener("mousemove", mouseMove);
                      window.removeEventListener("mouseup", mouseUp);
                    }
                    window.addEventListener("mousemove", mouseMove);
                    window.addEventListener("mouseup", mouseUp);
                  }
                }
              }
            ];

          }
        }
      }
    };
  }


  createTablePart(resource) {
    const field = new KarmaFieldsAlpha.fields.table[resource.type](resource);
    this.addChild(field);
    return field;
  }

}

KarmaFieldsAlpha.fields.table.controls = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);

    // if (!this.resource.children) {
    //   this.resource.children = (this.resource.buttons || [["save", "add", "delete"], ["undo", "redo"]]).map(buttons => {
    //     return {
    //       type: "group",
    //       display: "flex",
    //       style: "flex-grow:0",
    //       children: buttons.map(button => {
    //         return KarmaFieldsAlpha.fields.table.defaults[button];
    //       })
    //     }
    //   });
    // }
  }

  // build() {
  //   return {
  //     class: "table-control karma-field-container display-flex",
  //     children: this.resource.children.map(resource => {
  //       return this.createChild(resource).build();
  //     })
  //   }
  // }

  build() {
    return this.createChild({
      type: "group",
      display: "flex",
      children: this.resource.children || [
        "save",
        "add",
        "delete",
        "separator",
        "undo",
        "redo"
      ]
    }).build();
  }

}

KarmaFieldsAlpha.fields.table.header = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);

    // this.resource = {
    //   type: "group"
    //   ...this.resource
    // };
    //
    // if (!this.resource.children) {
    //   this.resource.children = (this.resource.items || [
    //     "title",
    //     "count",
    //     "options",
    //     "firstpage",
    //     "prevpage",
    //     "currentpage",
    //     "nextpage",
    //     "lastpage",
    //     "close"
    //   ]).map(item => {
    //     return KarmaFieldsAlpha.fields.table.defaults[item];
    //   });
    // }
  }

  build() {
    return this.createChild({
      type: "group",
      display: "flex",
      // container: {style: "flex-wrap:nowrap"},
      // children: this.resource.children || (this.resource.items || [
      //   "title",
      //   "count",
      //   "options",
      //   "firstpage",
      //   "prevpage",
      //   "currentpage",
      //   "nextpage",
      //   "lastpage",
      //   "close"
      // ]).map(item => {
      //   return KarmaFieldsAlpha.fields.table.defaults[item];
      // })
      children: this.resource.children || [
        "title",
        "count",
        "options",
        "pagination",
        // "firstpage",
        // "prevpage",
        // "currentpage",
        // "nextpage",
        // "lastpage",
        "close"
      ]
      // ...this.resource
    }).build();
    // return {
    //   class: "karma-field-container display-flex",
    //   children: this.resource.children.map(resource => {
    //     return this.createChild(resource).build();
    //   })
    // }
  }

}


// KarmaFieldsAlpha.fields.table.modal = class extends KarmaFieldsAlpha.fields.field {
//
//   build() {
//     return {
//       class: "table-modal",
//       init: single => {
//
//       },
//       update: async single => {
//
//         single.children = [];
//
//         if (this.hasParam("id")) {
//
//           // let percentWidth = this.options.getParam("modalWidth") || "100";
//
//           let request = this.createEvent({
//             action: "get",
//             type: "string",
//             path: ["modalWidth"]
//           });
//           await this.dispatch(request);
//
//           single.element.style.flexBasis = request.getValue()+"%";
//
//           const id = this.getParam("id");
//           // const rowField = this.grid.getRow(id);
//           const rowField = this.grid.createChild({
//             key: id,
//             columns: this.resource.columns || []
//           })
//           const modalField = rowField && rowField.children.find(child => child.resource.type === "modal");
//
//           if (modalField) {
//
//             single.children = [
//               {
//                 class: "karma-modal",
//                 children: [
//                   {
//                     class: "karma-modal-header table-header",
//                     children: [
//                       modalField.build(),
//                       {
//                         class: "modal-navigation",
//                         children: (this.resource.modal_header || [
//                           "prev",
//                           "next",
//                           "closemodal"
//                         ]).map(item => this.constructor.defaults[item])
//
//                       }
//                     ]
//                   },
//                   {
//                     class: "karma-modal-body karma-field-frame",
//                     init: frame => {
//                       this.setEventListener(request => {
//                         frame.child = request.target.buildModal();
//                         frame.render();
//                       });
//                     }
//                     // ,
//                     // update: frame => {
//                     //   frame.element.classList.toggle("final", modalField.resource.final || false);
//                     // },
//                     // child: modalField.content.build()
//                   }
//                 ]
//               },
//               {
//                 class: "modal-resize-handle",
//                 update: handle => {
//                   handle.element.onmousedown = event => {
//                     const mouseMove = event => {
//                       const modalBox = single.element.getBoundingClientRect();
//                       const viewerBox = single.element.parentNode.getBoundingClientRect();
//                       const ratioWidth = (event.clientX - viewerBox.left)/viewerBox.width;
//                       percentWidth = Math.min(100, 100*ratioWidth);
//                       single.element.style.flexBasis = percentWidth.toFixed(4)+"%";
//                       this.options.setParam(percentWidth, "modalWidth");
//                     }
//                     const mouseUp = event => {
//                       window.removeEventListener("mousemove", mouseMove);
//                       window.removeEventListener("mouseup", mouseUp);
//                     }
//                     window.addEventListener("mousemove", mouseMove);
//                     window.addEventListener("mouseup", mouseUp);
//                   }
//                 }
//               }
//             ];
//
//           }
//         }
//       }
//     };
//   }
// }


KarmaFieldsAlpha.fields.table.interface = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);



    this.elementsMap = new KarmaFieldsAlpha.Grid();
    this.fieldsMap = new KarmaFieldsAlpha.Grid();


    // document.body.appendChild(this.ta);

  }

  async importData(data, field) {

    const point = field && this.fieldsMap.find(field) || {};

    const {x, y, width, height} = {...new KarmaFieldsAlpha.Rect(), ...point, ...this.selection};

    for (let j = 0; j < Math.max(height, data.length); j++) {
      for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
        const field = this.fieldsMap.get(x + i, y + j);
        if (field) {
          await field.backup();
        }
      }
    }

    this.parent.grid.save("import-data");

    for (let j = 0; j < Math.max(height, data.length); j++) {
      for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {

        const field = this.fieldsMap.get(x + i, y + j);

        if (field) {
          const value = data[j%data.length][i%data[j%data.length].length];

          await field.importValue(value);
          await field.render();
        }
      }
    }

  }

  async editSelection() {

    const request = this.createEvent({
      action: "edit-selection"
    });

    await this.dispatch(request);
    await this.render();
  }

  registerTable(element) {

    this.endSelection();

    this.elementsMap = new KarmaFieldsAlpha.Grid();
    this.fieldsMap = new KarmaFieldsAlpha.Grid();

  }

  registerCell(element, col, row, field) {

    this.elementsMap.set(element, col, row);
    this.fieldsMap.set(field, col, row);

    element.onmousedown = event => {
      this.startSelection({x: col, y:row, width: 1, height: 1});
    }

    element.onmousemove = event => {
      if (event.buttons === 1) {
        this.growSelection({x: col, y:row, width: 1, height: 1});
      }
    }

  }

  registerIndex(element, row) {

    element.onmousedown = event => {
      event.preventDefault();
      this.toggleSelection({x: 0, y: row, width: this.elementsMap.width, height: 1});
    }

    element.onmousemove = event => {
      if (event.buttons === 1) {
        this.growSelection({x: 0, y: row, width: this.elementsMap.width, height: 1});
      }
    }
  }

  registerHeader(element, col) {

    element.onmousedown = event => {
      event.preventDefault();
      this.toggleSelection({x: col, y: 0, width: 1, height: this.elementsMap.height});
    }

    element.onmousemove = event => {
      if (event.buttons === 1) {
        this.growSelection({x: col, y: 0, width: 1, height: this.elementsMap.height});
      }
    }
  }

  registerHeaderIndex(element) {

    element.onmousedown = event => {
      event.preventDefault();
      this.toggleSelection({x:0, y:0, width:this.elementsMap.width, height:this.elementsMap.height});
    }

    element.onmousemove = event => {
      if (event.buttons === 1) {
        this.growSelection({x: 0, y :0, width: this.elementsMap.width, height: this.elementsMap.height});
      }
    }
  }

  growSelection(r) {

    if (this.focusRect) {
      r = KarmaFieldsAlpha.Rect.union(this.focusRect, r);
    } else {
      this.focusRect = r;
    }

    if (r.width*r.height > 1) {

      if (this.selection) {

        if (!KarmaFieldsAlpha.Rect.equals(this.selection, r)) {

          this.unpaint(this.selection);
          this.selection = r;
          this.paint(this.selection);
          // this.updateTA();
          // this.grid.triggerListeners();
          this.editSelection();


        }

      } else {

        this.selection = r;
        this.paint(this.selection);
        // this.updateTA();
        // this.grid.triggerListeners();
        this.editSelection();

      }

    } else if (this.selection) {

      this.unpaint(this.selection);
      this.selection = null;
      // this.updateTA();
      // this.grid.triggerListeners();
      this.editSelection();

    }

  }

  startSelection(r) {
    this.endSelection();
    this.focusRect = r;
  }

  toggleSelection(r) {
    if (this.selection && KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
      this.endSelection();
    } else {
      this.startSelection(r);
      this.growSelection(r);
    }
  }

  endSelection() {
    if (this.selection) {
      this.unpaint(this.selection);
      this.selection = null;
      this.focusRect = null;
      // this.updateTA();
      // this.grid.triggerListeners();
      // const content = this.grid.getChild("content");
      // const event = content.createEvent({
      //   splash: true
      // });
      // content.dispatch(event);
      this.editSelection();
    }
  }

  paint(rect) {
    for (let i = rect.x; i < rect.x + rect.width; i++) {
      for (let j = rect.y; j < rect.y + rect.height; j++) {
        let element = this.elementsMap.get(i, j);
        if (element) {
          element.classList.add("selected");
        }
      }
    }
  }

  unpaint(rect) {
    for (let i = rect.x; i < rect.x + rect.width; i++) {
      for (let j = rect.y; j < rect.y + rect.height; j++) {
        let element = this.elementsMap.get(i, j);
        if (element) {
          element.classList.remove("selected");
        }
      }
    }
  }


  build() {
    return {
      tag: "textarea",
      class: "karma-grid-ta2",
      init: ta => {
        this.render = ta.render;

        ta.element.style = "left:-100%;position:absolute;";

        // this.render = clean => {
        //   console.log("render");
        //   ta.render(clean);
        // };

        ta.element.onfocusout = event => {
          this.endSelection();
        }

        ta.element.oninput = async event => {

          let data = ta.element.value.split(/[\r\n]/).map(row => row.split("\t"));

          await this.importData(data);

          switch (event.inputType) {

            case "insertFromPaste":
            case "deleteByCut":
            case "deleteContentBackward":
            case "deleteContentForward":
            case "deleteContent":
              ta.element.blur();
              break;

          }

        }
      },
      update: async ta => {
        const data = [];

        if (this.selection && this.selection.width*this.selection.height > 1) {

          for (let j = 0; j < this.selection.height; j++) {

            const dataRow = [];

            for (let i = 0; i < this.selection.width; i++) {

              const field = this.fieldsMap.get(this.selection.x + i, this.selection.y + j);
              const value = await field.exportValue();

              dataRow.push(value);

            }

            data.push(dataRow);

          }

          ta.element.focus();
          ta.element.value = data.map(row => row.join("\t")).join("\n");
          ta.element.select();

        } else {

          ta.element.value = "";

        }
      }
    }
  }

}


KarmaFieldsAlpha.fields.table.grid = class extends KarmaFieldsAlpha.fields.formHistory {

  async dispatch(event, parent) {

    switch (event.action) {

      case "set":
        if (event.target.resource.type === "input" && event.pasted) {

          const data = event.getValue().split(/[\r\n]/).map(row => row.split("\t"));

          if (data.length > 1 || data[0].length > 1) {

            await this.dispatch(this.createEvent({
              action: "importselection",
              data: data,
              field: event.target
            }));

            break;

          }

        }

        await super.dispatch(event);


        // -> render controls + interface
        await super.dispatch(this.createEvent({
          action: "edit-grid",
          request: event
        }));

        break;

      default:
        await super.dispatch(event);
        break;

    }

    return event;
  }

}


// header.child = this.createChild(this.resource.header || {
//   id: "header",
//   type: "group",
//   display: "flex",
//   container: {style: "flex-wrap:nowrap"},
//   children: [
//     ...(this.resource.header_elements || ["title", "count"]).map(item => this.constructor.defaults[item]),
//     this.resource.pagination || {
//       type: "group",
//       display: "flex",
//       style: "flex: 0 0 auto; min-width:0",
//       children: (this.resource.header_pagination || [
//         "options",
//         "firstpage",
//         "prevpage",
//         "currentpage",
//         "nextpage",
//         "lastpage",
//         "close"
//       ]).map(item => this.constructor.defaults[item])
//     }
//
//   ]
// }).build();


// KarmaFieldsAlpha.fields.table.defaults = {
//   title: {
//     type: "text",
//     tag: "h1",
//     style: "flex-grow:1",
//     class: "ellipsis",
//     value: "Table"
//   },
//   count: {
//     type: "text",
//     style: "justify-content:center",
//     value: "{{count}} elements",
//     dynamic: true
//   },
//   options: {
//     type: "button",
//     title: "Options",
//     action: "toggle-options"
//   },
//   firstpage: {
//     type: "button",
//     action: "firstpage",
//     title: "First Page",
//     text: "«",
//     disabled: "page=1",
//     hidden: "numpage=1"
//   },
//   prevpage: {
//     type: "button",
//     action: "prevpage",
//     title: "Previous Page",
//     text: "‹",
//     disabled: "page=1",
//     hidden: "numpage=1"
//   },
//   currentpage: {
//     type: "text",
//     style: "justify-content:center",
//     value: "{{page}} / {{numpage}}",
//     hidden: "singlepage",
//     dynamic: true
//   },
//   nextpage: {
//     type: "button",
//     action: "nextpage",
//     title: "Next Page",
//     text: "›",
//     disabled: "lastpage",
//     hidden: "numpage=1"
//   },
//   lastpage: {
//     type: "button",
//     action: "lastpage",
//     title: "Last Page",
//     text: "»",
//     disabled: "lastpage",
//     hidden: "numpage=1"
//   },
//   close: {
//     type: "button",
//     text: "×",
//     title: "Close Table",
//     action: "close"
//   },
//   prev: {
//     type: "button",
//     action: "prev",
//     title: "Previous Item",
//     text: "‹"
//   },
//   next: {
//     type: "button",
//     action: "next",
//     title: "Next Item",
//     text: "›"
//   },
//   closemodal: {
//     type: "button",
//     title: "Close Modal",
//     action: "closemodal"
//   },
//   save: {
//     type: "button",
//     action: "save",
//     title: "Save",
//     disabled: "!modified"
//   },
//   add: {
//     type: "button",
//     action: "add",
//     title: "Add"
//   },
//   delete: {
//     type: "button",
//     action: "delete",
//     title: "Delete",
//     disabled: "!selection"
//   },
//   undo: {
//     type: "button",
//     value: "undo",
//     dashicon: "undo",
//     disabled: "!undo"
//   },
//   redo: {
//     type: "button",
//     value: "redo",
//     dashicon: "redo",
//     disabled: "!redo"
//   }
// }
