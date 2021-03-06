
KarmaFieldsAlpha.fields.table = class extends KarmaFieldsAlpha.fields.gateway {

  constructor(...params) {
    super(...params);

    if (!this.resource.driver) {
      console.error("Driver not defined");
    }


    // compat

    if (this.resource.columns) {
      this.resource.children = this.resource.columns.map(column => {
        return {
          ...column,
          ...column.field
        };
      });
    }



    if (typeof this.resource.driver === "string") {

      const [request, ...joins] = this.resource.driver.split("+");
      const [driver, paramString] = request.split("?");

      this.driver = driver;
      this.params = this.resource.params || KarmaFieldsAlpha.Nav.toObject(paramString);
      this.joins = this.resource.joins || joins || [];

      // console.log(this.driver, this.params, this.joins);

    } else {

      this.driver = this.resource.driver.name;
      this.params = this.resource.params || this.resource.driver.params;
      this.joins = this.resource.joins || this.resource.driver.joins || [];

    }


    this.history = new KarmaFieldsAlpha.Buffer("history");
    this.store = new KarmaFieldsAlpha.Store(this.driver, this.joins);


    this.optionsBuffer = new KarmaFieldsAlpha.Buffer("options", this.driver);
    this.extraIdBuffer = new KarmaFieldsAlpha.Buffer("extraids", this.driver);
    this.idsBuffer = new KarmaFieldsAlpha.Buffer("ids", this.driver);

    this.grid = this.createChild({
      type: "form",
      bufferPath: ["data", this.driver],
      driver: this.driver, // -> for history
      key: "content",
    })

    // this.grid = this.createField({
    //   // ...this.resource.grid,
    //   // driver: this.resource.driver,
    //   // columns: this.resource.columns,
    //   // orderby: this.resource.orderby,
    //   // type: "grid",
    //   // id: "grid", //"form-"+this.resource.driver, // -> form buffer + history buffer
    //   // bufferPath: ["data", this.driver],
    //   // driver: this.driver, // -> for history
    //   // // historyBufferPath: [this.resource.driver, "history"],
    //   // key: "content",
    //
    //   // modal: this.resource.children.find(child => child.type === "modal"),
    // });



    this.interface = this.createField({
      type: this.resource.interface || "interface",
      id: "interface",
      children: this.resource.children,
      style: this.resource.style // -> to be improved...
    });

    this.grid.addChild(this.interface);


    const modal = this.resource.children.find(child => child.type === "modal");

    if (modal) {

      this.modal = this.createField({
        type: "modal",
        header: modal.header,
        body: modal.body
      });

      this.interface.addChild(this.modal);

    }



    this.controls = this.createChild({
      id: "controls",
      type: "controls",
      ...this.resource.controls
    });

    this.header = this.createTablePart({
      id: "header",
      type: "header",
      ...this.resource.header
    });

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
            options: this.resource.children.map((child, index) => {
              return {
                key: index.toString(),
                name: child.label
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
    const paramString = this.getParamString();
    const results = await this.store.query(paramString);
    return results.map(row => row.id);
  }

  getParamString() {



      const params = {
        // ...KarmaFieldsAlpha.Nav.toObject(this.params),
        ...this.params,
        ...KarmaFieldsAlpha.Nav.getObject()
      };

      if (params.page === undefined) {
        params.page = "1";
      }

      if (params.ppp === undefined) {
        params.ppp = this.getPpp();
      }

      if (params.orderby === undefined) {
        params.orderby = this.getOrderby();
      }

      if (params.order === undefined) {
        params.order = this.getOrder();
      }

      delete params.id;
      delete params.karma;

      return KarmaFieldsAlpha.Nav.toString(params);
  }

  getCountParamString() {

    const params = {
      // ...KarmaFieldsAlpha.Nav.toObject(this.params),
      ...this.params,
      ...KarmaFieldsAlpha.Nav.getObject()
    };

    delete params.page;
    delete params.ppp;
    delete params.orderby;
    delete params.order;
    delete params.id;
    delete params.karma;

    return KarmaFieldsAlpha.Nav.toString(params);

  }


  async getCount() {

    const paramString = this.getCountParamString();
    const count = await this.store.count(paramString);

    return Number(count || 0);
  }

  getDefaultOrderby() {
    if (!this.resource.orderby) {
      const child = this.resource.children.find(child => child.orderby || child.key);
      return child && (child.orderby || child.key) || "default";
    }
    return this.resource.orderby;
  }

  getDefaultOrder() {
    const orderby = this.getOrderby();
    const child = this.resource.children.find(child => child.key === orderby);
    return child && child.order || "asc";
  }

  getOrder() {
    return this.getParam("order") || this.getDefaultOrder();
  }

  getOrderby() {
    return this.getParam("orderby") || this.getDefaultOrderby();
  }

  getPpp() {
    // return this.getParam("ppp") || this.optionsBuffer.get("ppp", 0) || this.resource.ppp || 10;
    return this.getParam("ppp") || this.resource.ppp || 10;
  }

  getColumns() {
    return this.optionsBuffer.get("columns") || this.resource.children.map((column, index) => index.toString()) || [];
  }

  getParam(key) {
    return KarmaFieldsAlpha.Nav.get(key);
  }

  hasParam(key) {
    return KarmaFieldsAlpha.Nav.has(key);
  }

  setParam(value, key) {

    KarmaFieldsAlpha.Nav.set(value, key);
  }


  async dispatch(event, parent, origin) {


    switch (event.action) {

      case "get": {

        const key = event.path.shift();

        switch (key) {

          case "content":
            event.data = await this.store.getValue(...event.path);
            break;

          case "options":

            switch (event.path.shift()) {
              case "ppp":
                event.data = [this.getPpp()];
                break;

              case "columns":
                event.data = this.getColumns();
                break;
            }

            break;

          case "selection":
            event.data = [this.interface.hasRowSelected()];
            break;

          case "undo":
            // event.data = [this.hasUndo()];
            event.data = [KarmaFieldsAlpha.History.hasUndo()];
            break;

          case "redo":
            // event.data = [this.hasRedo()];
            event.data = [KarmaFieldsAlpha.History.hasRedo()];
            break;

          case "count":
            event.data = [await this.getCount()];
            break;

          case "page":
            event.data = [this.getPage()];
            break;

          case "lastpage":
            event.data = [await this.getNumPage() === this.getPage()];
            break;

          case "numpage":
            event.data = [await this.getNumPage()];
            break;



          default: // -> filters
            event.data = [this.getParam(key)];

            break;

        }

        break;
      }

      case "set": {
        // await this.setValue(event.getArray(), ...event.path);


        const key = event.path.shift();

        switch (key) {

          case "content": // -> autosave
            await this.send(event.data, ...event.path); // -> data is an array
            break;

          default: { // -> filters

            const value = KarmaFieldsAlpha.Type.toString(event.data);
            const current = KarmaFieldsAlpha.Nav.get(key);

            if (KarmaFieldsAlpha.DeepObject.differ(value, current)) {

              KarmaFieldsAlpha.Nav.change(event.backup, value, current, key);
              KarmaFieldsAlpha.Nav.change("pack", 1, KarmaFieldsAlpha.Nav.get("page"), "page");

              this.idsBuffer.empty();

            }

            break;
          }

        }

        break;
      }

      case "send": {

        console.error("Deprecated event send. Must be intercepted in form");

        const key = event.path.shift();

        switch (key) {

          case "content": // -> save grid

            await this.send(event.data, ...(event.absolutePath || event.path)); // -> data is an object
            break;

          case "options": {
            this.options.open = false;
            const value = KarmaFieldsAlpha.Type.toObject(event.data);

            if (value.ppp) {

              // -> no history save
              if (KarmaFieldsAlpha.Nav.get("page") !== "1") {
                KarmaFieldsAlpha.Nav.set("1", "page");
              }
              KarmaFieldsAlpha.Nav.set(value, "ppp");

              if (event.edit) {

                // this.clearCount();
                // this.clearQuery();
                this.render();
              }
            }
            if (value.columns) {
              this.options.buffer.set(event.data.columns, "columns");
              await this.render(true);
            }
            break;
          }

          default: // -> filters + order
            this.setParams(event.data);
            // this.clearCount();
            // this.clearQuery();
            this.render();
            break;

        }

        // await this.sendValue(event.getValue(), ...event.path);
        break;
      }

      case "column": {
        event.data = [];

        const paramString = this.getParamString();
        const results = await this.store.query(paramString);
        const ids = results.map(result => result.id);
        const key = event.path[0];

        for (let id of ids) {
          const value = await this.store.getValue(id, key);
          event.data.push(value);
        }

        break;
      }

      case "row": {

        const [context, id] = event.path;
        const data = this.store.buffer.get(id) || {};
        const editedData = this.grid.buffer.get(id) || {};
        KarmaFieldsAlpha.DeepObject.merge(data, editedData);
        event.data = data;
        break;
      }

      case "ids": {

        event.data = await this.getIds();
        break;
      }

      case "driver": {
        event.data = this.getParamString();
        break;

      }

      case "edit": {

        const key = event.path.shift();

        switch (key) {

          case "content":
            if (event.data === "clearcache") { // (NOT USED) -> when data change affect availibity of item in table (autosave)
              this.store.empty();
              const ids = this.idsBuffer.get("ids");
              KarmaFieldsAlpha.History.backup(ids, ids, false, "ids", this.driver, "ids");
              this.idsBuffer.empty();
              await this.render();
            } else {
              // await this.splash(this.grid, event);
              await this.render();
            }
            break;

          default: // filters
            await this.render();



        }
      }




        await this.controls.render();
        break;

      case "modified": {
        event.data = await this.grid.isModified();
        break;
      }

      case "importselection": { // -> an input field received a multiple row/column pasted data...
        // const point = this.interface.fieldsMap.find(event.field);

        await this.interface.importData(event.data, event.field);
        this.controls.render();
        break;
      }

      case "edit-selection":
        // console.log("edit-selection");
        // debugger;
        // await this.controls.render();
        await this.render();
        // this.updateGridClasses();
        break;

      case "nextpage": {
        const page = this.getPage();
        const numpage = await this.getNumPage();
        const nextpage = Math.min(page+1, numpage);

        KarmaFieldsAlpha.Nav.change("tie", nextpage, page, "page");
        this.idsBuffer.remove();

        await this.render();
        break;
      }

      case "prevpage": {
        const page = this.getPage();
        const prevpage = Math.max(page-1, 0);

        KarmaFieldsAlpha.Nav.change("tie", prevpage, page, "page");
        this.idsBuffer.remove();

        await this.render();
        break;
      }

      case "firstpage": {
        const page = this.getPage();
        if (page > 1) {
          KarmaFieldsAlpha.Nav.change("tie", "1", page, "page");
          this.idsBuffer.remove();
          await this.render();
        }
        break;
      }

      case "lastpage": {
        const page = this.getPage();
        const numpage = await this.getNumPage();
        if (page < numpage) {

          KarmaFieldsAlpha.Nav.change("tie", numpage, page, "page");
          this.idsBuffer.remove();

          await this.render();
        }
        break;
      }

      case "reload": {
        this.store.empty();
        this.buffer.empty();
        this.idsBuffer.remove();
        await this.render();
        break;
      }

      case "toggle-options":
        this.options.open = !this.options.open;
        this.options.render();
        break;

      case "close-options":
        this.options.open = false;
        // await this.render();
        // await this.triggerListeners();
        this.options.render();
        break;

      case "add":
        await this.add(1, event.data || {});
        await this.render();
        break;

      case "delete": {
        const selectedIds = await this.getSelectedIds();
        await this.remove(selectedIds);
        this.interface.selectionBuffer.remove("ids");
        await this.render();
        break;
      }

      case "upload": {
        await this.upload(event.data);
        // await this.render();
        break;
      }

      case "save":
        // await this.grid.submit();


        await this.send(this.grid.buffer.get()); // -> data is an object
        this.grid.buffer.remove();

        this.store.empty(); // -> value change affects queried items
        this.idsBuffer.empty(); // -> value change affects queried items

        await this.render();
        break;

      case "undo": {
        KarmaFieldsAlpha.History.undo();
        await super.dispatch(event);
        break;
      }

      case "redo": {
        KarmaFieldsAlpha.History.redo();
        await super.dispatch(event);
        break;
      }

      case "close":
        this.buffer.empty();
        this.store.empty();
        this.idsBuffer.empty();

        await super.dispatch(event);
        // await super.setState(null, ...path, state);
        break;

      // modal:
      case "prev": {
        let ids = await this.getIds();
        const id = KarmaFieldsAlpha.Nav.get("id");
        const index = ids.indexOf(id);

        if (index > 0) {
          KarmaFieldsAlpha.Nav.change("tie", ids[index-1], id, "id");
        } else {
          const page = this.getPage();
          if (page > 1) {
            KarmaFieldsAlpha.Nav.change("tie", page-1, page, "page");
            this.idsBuffer.empty();
            ids = await this.getIds();
            KarmaFieldsAlpha.Nav.change("pack", ids[ids.length - 1], id, "id");
          }
        }
        await this.render();
        break;
      }

      case "next": {
        let ids = await this.getIds();
        const id = KarmaFieldsAlpha.Nav.get("id");
        const index = ids.indexOf(id);

        if (index < ids.length-1) {
          KarmaFieldsAlpha.Nav.change("tie", ids[index+1], id, "id");
        } else {
          const numpage = await this.getNumPage();
          const page = this.getPage();
          if (page < numpage) {
            KarmaFieldsAlpha.Nav.change("tie", page+1, page, "page");
            this.idsBuffer.empty();
            ids = await this.getIds();
            KarmaFieldsAlpha.Nav.change("pack", ids[0], id, "id");
          }
        }
        await this.render();
        break;
      }

      case "close-modal":
        this.removeParam("id");
        await this.render();
        // await this.triggerListeners();
        break;

      case "open-modal": {
        const [content, id, ...path] = event.path;
        KarmaFieldsAlpha.Nav.change("pack", id, null, "id");
        await this.render();
        break;
      }


      case "order": {

        KarmaFieldsAlpha.History.save();

        let order = KarmaFieldsAlpha.Nav.get("order");
        let orderby = KarmaFieldsAlpha.Nav.get("orderby");
        const key = event.path[0];

        if (orderby === key) {

          KarmaFieldsAlpha.Nav.change("pack", order === "asc" ? "desc" : "asc", order, "order");

        } else {

          KarmaFieldsAlpha.Nav.change("pack", event.order || "asc", order, "order");
          KarmaFieldsAlpha.Nav.change("pack", key, orderby, "orderby");

        }

        this.idsBuffer.empty();
        await this.render();
        break;
      }

      // case "open-folder": {
      //   const key = event.path[0];
      //   const value = KarmaFieldsAlpha.Type.toString(event.data);
      //   const current = KarmaFieldsAlpha.Nav.get(key);
      //
      //   if (KarmaFieldsAlpha.DeepObject.differ(value, current)) {
      //
      //     KarmaFieldsAlpha.Nav.change("pack", value, current, key);
      //     KarmaFieldsAlpha.Nav.change("pack", 1, KarmaFieldsAlpha.Nav.get("page"), "page");
      //
      //     this.idsBuffer.empty();
      //     await this.render();
      //
      //   }
      //
      //   break;
      // }

      case "params": {
        event.data = KarmaFieldsAlpha.Nav.getObject();
        break;
      }






      // -> to gateway
      default:
        event.path.shift();
        await super.dispatch(event);
        break;

    }

    return event;
  }

  async getNumPage() {
    const count = await this.getCount();
    const ppp = this.getPpp();
    return Math.max(1, Math.ceil(count/ppp));
  }

  getPage() {
    if (KarmaFieldsAlpha.Nav.has("page")) {
      return Number(KarmaFieldsAlpha.Nav.get("page"));
    }
    return 1;
  }

  writeHistory(value, currentValue, ...path) {
    KarmaFieldsAlpha.History.backup(value, currentValue, false, "data", this.driver, ...path);
	}


  async getIds() {

    let ids = this.idsBuffer.get("ids");

    if (!ids) {

      ids = await this.getQueriedIds() || [];

      this.idsBuffer.set(ids, "ids");

      KarmaFieldsAlpha.History.push(ids, "ids", this.driver, "ids");

    }

    return ids;
  }

  async add(num = 1, params = {}) {



    const navParams = KarmaFieldsAlpha.Nav.getObject();

    let rows = await KarmaFieldsAlpha.Gateway.post("add/"+this.driver, {...navParams, ...params}, {num: num});

    debugger;

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

    const resources = KarmaFieldsAlpha.Resource.getSubResources(this.resource);

    // this.stage();
    KarmaFieldsAlpha.History.save();

    for (let row of rows) {

      for (let resource of resources) {

        const field = this.createField(resource);

        let defaultValue = await field.getDefault();

        defaultValue = KarmaFieldsAlpha.Type.toArray(defaultValue);


        this.grid.buffer.set(defaultValue, row.id, resource.key);
        this.writeHistory(defaultValue, null, row.id, resource.key);

      }

      this.buffer.set(["1"], row.id, "trash"); // -> when add and delete a row without saving
      this.grid.buffer.set(["0"], row.id, "trash");
      this.writeHistory(["0"], ["1"], row.id, "trash");

    }

    const ids = await this.getIds();
    const newIds = [...rows.map(row => row.id), ...ids];

    this.idsBuffer.set(newIds, "ids");

    KarmaFieldsAlpha.History.backup(newIds, ids, false, "ids", this.driver, "ids");

    return rows.map(row => row.id);
  }

  async remove() {
    let ids = await this.getSelectedIds();

    const resources = KarmaFieldsAlpha.Resource.getSubResources(this.resource);

    KarmaFieldsAlpha.History.save();

    for (let id of ids) {

      for (let resource of resources) {

        const currentValue = this.grid.buffer.get(id, resource.key) || await this.store.getValue(id, resource.key);

        this.grid.buffer.remove(id, resource.key);
        await this.writeHistory(null, currentValue, id, resource.key);

      }

      this.grid.buffer.set(["1"], id, "trash");
      this.writeHistory(["1"], ["0"], id, "trash");

    }

    const currentIds = await this.getIds();
    const newIds = currentIds.filter(id => !ids.includes(id));
    this.idsBuffer.set(newIds, "ids");
    KarmaFieldsAlpha.History.backup(newIds, currentIds, false, "ids", this.driver, "ids");

  }

  async duplicate() {
    let ids = await this.getSelectedIds();

    if (ids.length) {
      const cloneIds = await this.add(ids.length);

      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let cloneId = cloneIds[i];

        const resources = KarmaFieldsAlpha.Resource.getSubResources(this.resource);

        for (let resource of resources) {

          const value = this.grid.buffer.get(id, resource.key); // || await this.getValue("content", id, resource.key);

          if (value) {
            this.grid.buffer.set(value, cloneId, resource.key);
            this.writeHistory(value, null, cloneId, resource.key);
          }

        }

      }

    }
  }

  async upload(files) {

    KarmaFieldsAlpha.History.save();

    const ids = await this.getIds();

    for (let file of files) {

      const id = await KarmaFieldsAlpha.Gateway.upload(file, "files"); // -> move in posts ?

      await this.store.query("post_type=attachment&post_status=inherit&id="+id);

      // for (let key in item) {
      //
      //   const value = KarmaFieldsAlpha.Type.toArray(item[key]);
      //
      //   this.buffer.set(value, item.id, key);
      //
      // }

      // for (let resource of resources) {
      //
      //   const field = this.createField(resource);
      //
      //   let defaultValue = await field.getDefault();
      //
      //   defaultValue = KarmaFieldsAlpha.Type.toArray(defaultValue);
      //
      //
      //   this.grid.buffer.set(defaultValue, row.id, resource.key);
      //   this.writeHistory(defaultValue, null, row.id, resource.key);
      //
      // }

      this.buffer.set(["0"], id, "trash");
      this.grid.buffer.set(["0"], id, "trash");
      this.writeHistory(["0"], ["1"], id, "trash");


      const ids = this.idsBuffer.get("ids");
      const newIds = [id, ...ids];

      KarmaFieldsAlpha.History.backup(newIds, ids, false, "ids", this.driver, "ids");

      this.idsBuffer.set(newIds, "ids");



      await this.render();

    }

  }


  async getSelectedIds() {
    // if (this.hasParam("id")) {
    //   return [this.getParam("id")];
    //   // } else if (this.interface.selection && this.interface.selection.width === this.interface.elementsMap.width) {
    //   //   const ids = await this.getIds();
    //   //   return ids.slice(this.interface.selection.y, this.interface.selection.y + this.interface.selection.height);
    // } else if (this.interface.hasRowSelected()) {
    //   const ids = await this.getIds();
    //   return ids.slice(this.interface.selection.y, this.interface.selection.y + this.interface.selection.height);
    // }
    // return [];

    return this.interface.selectionBuffer.get("ids") || [];
  }

  createTablePart(resource) {
    return this.createChild(resource);
  }



  build() {
    return {
      class: "karma-field-table",
      init: table => {
        this.render = table.render;

        // this.clearQuery();
        // this.clearCount();
      },
      update: async table => {

        table.element.classList.add("table-loading");
        const active = this.getParam("karma") === this.resource.id;
        table.element.style.display = active ? "flex" : "none";

        // const singleOpen = Boolean(this.modal) && KarmaFieldsAlpha.Nav.has("id");

        const singleOpen = Boolean(this.modal) && this.interface.hasRowSelected();

        if (active) {

          const ids = await this.getIds(); // -> fetch query for modal + grid
          const page = this.getPage();
          const ppp = this.getPpp();
          const columns = this.getColumns();

          table.children = [
            // this.interface.buildTA(), // -> where to put this ?
            {
              class: "table-view",
              update: container => {
                container.element.classList.toggle("single-open", singleOpen);
              },
              children: [
                // this.buildModal(),
                {
                  class: "table-modal",
                  update: container => {

                    if (singleOpen) {
                      container.children = [this.modal.build()];
                    } else {
                      container.children = [];
                    }
                  }
                },
                {
                  class: "table-main",
                  update: main => {
                    main.element.tabIndex = -1;
                    main.element.onfocus = event => {
                      this.interface.unfocus();
                    }
                  },
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
                                init: section => {
                                  if (resource.style) {
                                    section.element.style = resource.style;
                                  }
                                },
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
                              child: this.interface.build(ids, page, ppp, columns)

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
                // this.controls.render = footer.render;
                // if (this.interface.controlFocusOut) {
                //   footer.element.onfocusout = event => {
                //     this.interface.controlFocusOut();
                //   }
                // }

                if (this.interface.clearSelection) {
                  // footer.element.onfocusout = event => {
                  //   this.interface.clearSelection();
                  // }
                  footer.element.onmouseup = event => {
                    // this.interface.clearSelection();
                  }
                }
              },
              update: footer => {
                footer.element.classList.toggle("hidden", this.resource.controls === false);
                if (this.resource.controls !== false) {
                  footer.child = this.controls.build();
                  // footer.child = this.createChild("controls").build();




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
    };
  }



  static modal = class extends KarmaFieldsAlpha.fields.field {

    build() {

      return {
        class: "karma-modal",
        update: modal => {
          const selectedIds = this.parent.selectionBuffer.get("ids") || [];

          modal.children = [
            {
              class: "karma-modal-header",
              update: header => {
                const field = selectedIds.length === 1 ? this.createChild({
                  type: "header",
                  ...this.resource.header
                }) : this.createChild({
                  type: "header",
                  children: [
                    {
                      type: "text",
                      tag: "h1",
                      style: "flex-grow:1",
                      class: "ellipsis",
                      value: "Multiple items"
                    },
                    "close"
                  ]
                });

                header.child = field.build();
              }
            },
            {
              class: "karma-modal-body",
              update: body => {
                // body.children = [
                //   {
                //     class: "dashicons dashicons-images-alt",
                //     update: dashicon => {
                //       dashicon.element.style.display = selectedIds.length === 1 ? "none" : "block";
                //       dashicon.element.style.fontSize = "15em";
                //     }
                //   },
                //
                // ];
                // if (selectedIds.length === 1) {
                //   body.child = this.createChild(this.resource.body || "group").build();
                // } else {
                //   body.children = [];
                // }

                body.child = this.createChild(this.resource.body || "group").build();
              }


              // update: body => {
              //   body.child = this.createChild(this.resource.modal.body || this.resource.modal.content || "group").build();
              // }
            }
          ];
        }
      };
    }

    // async dispatch(event) {
    //
    //   switch (event.action) {
    //
    //     default: {
    //       // const id = KarmaFieldsAlpha.Nav.get("id");
    //       const id = this.parent.selectionBuffer.get("ids")[0];
    //       event.path = [id, ...event.path];
    //
    //       await super.dispatch(event);
    //
    //       break;
    //     }
    //
    //   }
    //
    //   return event;
    // }

    async dispatch(event, parent) {

      switch (event.action) {

        case "close": {
          this.parent.selectionBuffer.remove("ids");
          event.action = "edit-selection";
          await super.dispatch(event);
          break;
        }

        case "selection": {
          event.data = this.parent.selectionBuffer.get("ids") || [];
          break;
        }

        case "get": {
          const ids = this.parent.selectionBuffer.get("ids") || [];
          if (ids.length === 1) {
            event.path = [ids[0], ...event.path];
            await super.dispatch(event);
          } else {
            // event.data = ["??? No Change ???"];
            // event.placeholder = "??? No Change ???";
            let value;
            let index = 0;

            while (index < ids.length) {
              const request = await super.dispatch({
                ...event,
                path: [ids[index], ...event.path]
              });

              if (value === undefined) {
                value = request.data;
              } else if (KarmaFieldsAlpha.DeepObject.differ(request.data, value)) {
                value = [""];
                break;
              }
              index++;
            }
            event.data = value;

            event.manifold = true;
          }
          break;
        }

        case "set": {
          const ids = this.parent.selectionBuffer.get("ids") || [];

          KarmaFieldsAlpha.History.save();

          for (let id of ids) {
            await super.dispatch({
              ...event,
              backup: "pack",
              path: [id, ...event.path]
            });
          }
          break;
        }

        case "modified": {
          const ids = this.parent.selectionBuffer.get("ids") || [];
          event.data = false;
          for (let id of ids) {
            const request = await super.dispatch({
              action: "modified",
              type: "boolean",
              path: [id, ...event.path]
            });
            if (event.data) {
              event.data = true;
              break;
            }
          }
          break;
        }

        default: {
          await super.dispatch(event);
          break;
        }
      }



      return event;
    }

    static header = class extends KarmaFieldsAlpha.fields.group {

      constructor(resource) {

        const defaultResource = {
          id: "header",
          display: "flex",
          children: [
            "title",
            "prev",
            "next",
            "close"
          ]
        };

        super({...defaultResource, ...resource});
      }

      static title = class extends KarmaFieldsAlpha.fields.text {

        constructor(resource, ...args) {
          const defaultResource = {
            id: "title",
            tag: "h1",
            style: "flex-grow:1",
            class: "ellipsis",
            value: "Single"
          };

          super({...defaultResource, ...resource});
        }

      }

      // static title = {
      //   id: "title",
      //   type: "text",
      //   tag: "h1",
      //   style: "flex-grow:1",
      //   class: "ellipsis",
      //   value: ["dispatch", "title"]
      // }

      static prev = {
        id: "prev",
    		type: "button",
        action: "prev",
        title: "Previous Item",
        text: "???"
      }

    	static next = {
        id: "next",
    		type: "button",
        action: "next",
        title: "Next Item",
        text: "???"
      }

    	static close = {
        id: "close",
    		type: "button",
        title: "Close Modal",
        text: "??",
        action: "close"
      }

    }

  }

  static controls = class extends KarmaFieldsAlpha.fields.group {

    constructor(resource, ...args) {

      const defaultResource = {
        id: "controls",
        display: "flex",
        children: [
          "reload",
          "save",
          "add",
          "delete",
          "separator",
          "undo",
          "redo"
        ]
      };

      super({
        ...defaultResource,
        ...resource
      }, ...args);

    }

    static upload = class extends KarmaFieldsAlpha.fields.button {

      build() {

        return {
    			class: "karma-upload karma-field",
          init: button => {
            button.element.id = "upload-button";
          },
          children: [
            {
              tag: "input",
              init: input => {
                input.element.type = "file",
                input.element.id = this.getId();
                input.element.multiple = true;
                input.element.hidden = true;
              },
              update: input => {
                input.element.onchange = async event => {
                  const files = input.element.files;
                  if (files.length) {
                    input.element.classList.add("editing");
                    requestIdleCallback(() => {
        							this.dispatch({
                        action: "upload",
                        data: files
                      }).then(() => {
        								input.element.classList.remove("editing");
        								input.element.blur();
        							});
        						});
                    // await this.dispatch({
                    //   action: "upload",
                    //   data: files
                    // });
                    // input.element.classList.remove("loading");
                  }
                }
              }
            },
            {
              tag: "label",
              init: input => {
                input.element.htmlFor = this.getId();
                input.element.textContent = this.resource.title || "Add File";
              }
            }
          ]

          // child: {
    			// 	tag: "span",
    			// 	update: async span => {
    			// 		if (this.resource.dashicon) {
    			// 			span.element.className = "dashicons dashicons-"+this.resource.dashicon;
    			// 			span.element.textContent = this.resource.text || "";
    			// 		} else {
    			// 			span.element.className = "text";
    			// 			span.element.textContent = await this.parse(this.resource.text || this.resource.title || "");
    			// 		}
          //
    			// 	}
    			// },
    			// init: async button => {
          //
          //
    			// },
    			// update: async button => {
          //
    			// 	if (this.resource.primary) {
    			// 		button.element.classList.add("primary");
    			// 	}
    			// 	button.element.title = this.resource.title || "";
          //
    			// 	if (this.resource.active || this.resource.disabled || this.resource.hidden) {
    			// 		// this.setEventListener(event => button.render());
    			// 		this.update = () => button.render();
    			// 	}
    			// 	if (this.resource.hidden) {
    			// 		button.element.parentNode.classList.add("hidden");
    			// 	}
          //
    			// 	button.element.onclick = async event => {
    			// 		event.preventDefault(); // -> prevent submitting form in post-edit
          //
          //
    			// 		if (!button.element.classList.contains("editing")) {
    			// 			button.element.classList.add("editing");
          //
    			// 			requestIdleCallback(() => {
    			// 				this.dispatch({
    			// 					action: this.resource.action || this.resource.state || this.resource.value || "submit" // compat
    			// 				}).then(() => {
    			// 					button.element.classList.remove("editing");
    			// 					button.element.blur();
    			// 				});
    			// 			});
          //
    			// 		}
          //
    			// 	}
          //
          //
    			// 	if (this.resource.disabled) {
    			// 		button.element.disabled = Boolean(await this.parse(this.resource.disabled));
    			// 	}
    			// 	if (this.resource.active) {
    			// 		button.element.classList.toggle("active", Boolean(await this.check(this.resource.active)));
    			// 	}
    			// 	if (this.resource.hidden) {
    			// 		button.element.parentNode.classList.toggle("hidden", Boolean(await this.check(this.resource.hidden)));
    			// 	}
          //
    			// }
    		};
      }

    }

    static save = {
      id: "save",
  		type: "button",
      action: "save",
      title: "Save",
      // disabled: "!modified",
      disabled: ["!", ["modified"]],
      primary: true
    }

  	static add = {
      id: "add",
  		type: "button",
      action: "add",
      title: "Add"
    }

  	static delete = {
      id: "delete",
  		type: "button",
      action: "delete",
      title: "Delete",
      // disabled: "!selection"
      disabled: ["!", ["get", "selection"]]
    }

  	static undo = {
      id: "undo",
  		type: "button",
      value: "undo",
      dashicon: "undo",
      // disabled: "!undo"
      disabled: ["!", ["get", "undo"]]
    }

  	static redo = {
      id: "redo",
  		type: "button",
      value: "redo",
      dashicon: "redo",
      // disabled: "!redo"
      disabled: ["!", ["get", "redo"]]
    }

    static separator = {
      id: "separator",
  		type: "separator"
    }

    static reload = {
      id: "reload",
  		type: "button",
      action: "reload",
      title: "Reload"
      // disabled: "!modified",
      // disabled: ["!", ["modified"]],
      // primary: true
    }

  }

  static header = class extends KarmaFieldsAlpha.fields.group {

    constructor(resource, ...args) {

      const defaultResource = {
        id: "header",
        display: "flex",
        children: [
          "title",
          "count",
          "options",
          "pagination",
          "close"
        ]
      };

      super({
        ...defaultResource,
        ...resource
      }, ...args);

    }

    static title = class extends KarmaFieldsAlpha.fields.text {

      constructor(resource, ...args) {

        const defaultResource = {
          id: "title",
          tag: "h1",
          style: "flex-grow:1",
          class: "ellipsis",
          value: "Table"
        };

        super({...defaultResource, ...resource}, ...args);

      }

    }

    // static title = {
    //   id: "title",
    //   type: "text",
    //   tag: "h1",
    //   style: "flex-grow:1",
    //   class: "ellipsis",
    //   value: "Table"
    // }

    static count = {
      id: "count",
      type: "text",
      style: "justify-content:center",
      value: ["replace", "# elements", "#", ["get", "count"]],
      dynamic: true
    }

    static options = {
      id: "options",
      type: "button",
      title: "Options",
      action: "toggle-options"
    }

    static close = {
      id: "close",
      type: "button",
      text: "??",
      title: "Close Table",
      action: "close"
    }

    static pagination = class extends KarmaFieldsAlpha.fields.group {

      constructor(resource) {

        const defaultResource = {
          id: "pagination",
          type: "group",
          display: "flex",
          style: "flex: 0 1 auto;min-width:0",
          // hidden: "numpage=1",
          hidden: ["==", ["get", "numpage"], 1],
          children: [
            "firstpage",
            "prevpage",
            "currentpage",
            "nextpage",
            "lastpage"
          ]
        }

        super({
          ...defaultResource,
          ...resource
        });
      }

      static firstpage = {
        id: "firstpage",
    		type: "button",
        action: "firstpage",
        title: "First Page",
        text: "??",
        // disabled: "page=1",
        disabled: ["==", ["get", "page"], 1],
        // hidden: "numpage=1"
      }

      static prevpage = {
        id: "prevpage",
    		type: "button",
        action: "prevpage",
        title: "Previous Page",
        text: "???",
        // disabled: "page=1",
        disabled: ["==", ["get", "page"], 1],
        // hidden: "numpage=1"
      }

      static currentpage = {
        id: "currentpage",
    		type: "text",
        style: "min-width: 4em;text-align: right;",
        // value: "{{page}} / {{numpage}}",
        value: ["replace", "# / #", "#", ["get", "page"], ["get", "numpage"]],
        // hidden: "numpage=1",
        // dynamic: true
      }

    	static nextpage = {
        id: "nextpage",
    		type: "button",
        action: "nextpage",
        title: "Next Page",
        text: "???",
        // disabled: "lastpage",
        disabled: ["get", "lastpage"],
        // hidden: "numpage=1"
        // value: [
        //   "resolveAll",
        //   ["backup"],
        //   ["set", ["min", ["+", ["get", "page"], 1], ["get", "lastpage"]], "page"],
        //   ["edit"]
        // ]
      }

    	static lastpage = {
        id: "lastpage",
    		type: "button",
        action: "lastpage",
        title: "Last Page",
        text: "??",
        // disabled: "lastpage",
        disabled: ["get", "lastpage"],
        // hidden: "numpage=1"
      }

    }

  }




}
