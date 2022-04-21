
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
        // console.log("edit-selection");
        // debugger;
        await this.controls.render();
        // this.updateGridClasses();
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
        this.clearQuery();
        this.clearCount();
        // KarmaFieldsAlpha.Gateway.clearOptions();
        // await this.render(1);
        // await this.grid.triggerListeners();
        await this.grid.render();
        break;

      case "undo": {
        this.grid.undo();
        let hash = this.grid.getHash();
        if (hash && hash !== location.hash) {
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
        return this.interface.hasRowSelected();
        // return (await this.getSelectedIds()).length > 0;

      case "undo":
        return this.grid.hasUndo();

      case "redo":
        return this.grid.hasRedo();

      case "count":
        return this.getCount();

      case "page":
        return this.getPage();

      case "lastpage":
        return await this.getNumPage() === this.getPage();

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
        this.render();
        break;

      case "hash": // -> from undo/redo
        this.clearQuery();
        this.clearCount();
        KarmaFieldsAlpha.Nav.setHash(value[0]);
        this.render();
        break;

      default: // -> filters
        this.setParam(value[0], key);
        this.clearCount();
        this.clearQuery();
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

  async getOptionsValue(key) {

    switch (key) {
      case "ppp": return this.getPpp();
      case "columns": return this.getColumns();
    }

  }

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

        this.clearQuery();
        this.clearCount();
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


  async getSelectedIds() {
    if (this.hasParam("id")) {
      return [this.getParam("id")];
      // } else if (this.interface.selection && this.interface.selection.width === this.interface.elementsMap.width) {
      //   const ids = await this.getIds();
      //   return ids.slice(this.interface.selection.y, this.interface.selection.y + this.interface.selection.height);
    } else if (this.interface.hasRowSelected()) {
      const ids = await this.getIds();
      return ids.slice(this.interface.selection.y, this.interface.selection.y + this.interface.selection.height);
    }
    return [];
  }


  // updateGridClasses() {
  //   // noop
  // }

  buildGrid() {
    return {
      class: "table grid",
      init: async grid => {

        this.grid.render = grid.render;

        // this.updateGridClasses = () => {
        //   grid.element.classList.toggle("has-selections", this.interface.selection && this.interface.selection.width*this.interface.selection.height > 1 || false);
        //
        //   grid.element.classList.toggle("selecting", Boolean(this.interface.focusRect));
        // }

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
                    // child: field.build()
                    children: [
                      field.build(),
                      // {
                      //   tag: "span",
                      //   class: "dashicons dashicons-cloud"
                      // }
                    ]
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



KarmaFieldsAlpha.fields.table.interface = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);



    this.elementsMap = new KarmaFieldsAlpha.Grid();
    this.fieldsMap = new KarmaFieldsAlpha.Grid();
    this.indexMap = {};


    // document.body.appendChild(this.ta);

  }

  async importData(data, field) {

    console.log("import data");

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



  registerTable(element) {

    this.endSelection();

    this.elementsMap = new KarmaFieldsAlpha.Grid();
    this.fieldsMap = new KarmaFieldsAlpha.Grid();
    this.indexMap = {};

  }

  registerCell(element, col, row, field) {

    this.elementsMap.set(element, col, row);
    this.fieldsMap.set(field, col, row);

    const onMouseUp = event => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseEnter);
      this.selecting = false;
      this.editSelection();
    }

    const onMouseEnter = event => {
      const elementUnderPoint = document.elementFromPoint(event.clientX, event.clientY);
      const target = elementUnderPoint && elementUnderPoint.closest(".td");
      const point = target && this.elementsMap.find(target);
      if (point) {
        this.growSelection({...point, width: 1, height: 1});
      }
      // console.log(point);
    }

    element.onmousedown = event => {
      this.selecting = true;
      if (event.shiftKey) {
        event.preventDefault(); // -> prevent focus lose on TA
        this.growSelection({x: col, y:row, width: 1, height: 1});
      } else {
        this.startSelection({x: col, y:row, width: 1, height: 1});
      }
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseEnter);
    }

    // element.onmousemove = event => {
    //
    //   if (this.selecting && event.buttons === 1) {
    //
    //     console.log(col, row);
    //     this.growSelection({x: col, y:row, width: 1, height: 1});
    //   }
    // }

  }

  registerIndex(element, row) {

    this.indexMap[row] = element;

    const onMouseUp = event => {
      document.removeEventListener("mouseup", onMouseUp);
      this.selecting = false;
      this.editSelection();
    }

    element.onmousedown = event => {
      this.selecting = true;
      if (event.shiftKey) {
        event.preventDefault(); // -> prevent focus lose on TA
        this.growSelection({x: 0, y: row, width: this.elementsMap.width, height: 1});
      } else {
        this.startSelection({x: 0, y: row, width: this.elementsMap.width, height: 1});
      }
      document.addEventListener("mouseup", onMouseUp);
    }

    element.onmouseover = event => {
      if (this.selecting && event.buttons === 1) {
        this.growSelection({x: 0, y: row, width: this.elementsMap.width, height: 1});
      }
    }

  }

  registerHeader(element, col) {

    const onMouseUp = event => {
      document.removeEventListener("mouseup", onMouseUp);
      this.selecting = false;
      this.editSelection();
    }

    element.onmousedown = event => {
      this.selecting = true;
      if (event.shiftKey) {
        event.preventDefault(); // -> prevent focus lose on TA
        this.growSelection({x: col, y: 0, width: 1, height: this.elementsMap.height});
      } else {
        this.startSelection({x: col, y: 0, width: 1, height: this.elementsMap.height});
      }
      document.addEventListener("mouseup", onMouseUp);
    }

    element.onmouseover = event => {
      if (this.selecting && event.buttons === 1) {
        this.growSelection({x: col, y: 0, width: 1, height: this.elementsMap.height});
      }
    }

  }

  registerHeaderIndex(element) {

    const onMouseUp = event => {
      document.removeEventListener("mouseup", onMouseUp);
      this.selecting = false;
      this.editSelection();
    }

    element.onmousedown = event => {
      this.selecting = true;
      this.startSelection({x: 0, y: 0, width:this.elementsMap.width, height:this.elementsMap.height});
      document.addEventListener("mouseup", onMouseUp);
    }

    element.onmouseover = event => {
      if (this.selecting && event.buttons === 1) {
        this.growSelection({x: 0, y: 0, width:this.elementsMap.width, height:this.elementsMap.height});
      }
    }

    // element.onmousedown = event => {
    //   event.preventDefault();
    //   this.toggleSelection({x:0, y:0, width:this.elementsMap.width, height:this.elementsMap.height});
    // }
    //
    // element.onmousemove = event => {
    //   if (event.buttons === 1) {
    //     this.growSelection({x: 0, y :0, width: this.elementsMap.width, height: this.elementsMap.height});
    //   }
    // }
  }

  growSelection(r) {
    if (this.focusRect) {
      r = KarmaFieldsAlpha.Rect.union(this.focusRect, r);
    } else {
      this.focusRect = r;
    }

    if (this.selection) {
      this.unpaint(this.selection);
    }

    this.hasSelection = true;

    this.selection = r;
    this.paint(this.selection);
  }

  startSelection(r) {
    if (this.selection) {
      this.unpaint(this.selection);
    }
    this.focusRect = r;
    this.selection = r;
    this.paint(r);
    this.hasSelection = true;
  }

  toggleSelection(r) {
    if (this.selection && KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
      this.endSelection();
    } else {
      this.startSelection(r);
    }
  }

  endSelection() {
    if (this.selection) {
      this.unpaint(this.selection);
      this.selection = null;
      this.hasSelection = false;
    }
  }

  hasRowSelected() {
    return this.hasSelection && this.selection && this.selection.x === 0 && this.selection.width === this.elementsMap.width || false;
  }
  hasCellsSelected() {
    return this.hasSelection && this.selection && (this.selection.width*this.selection.height > 1) || false;
  }

  async editSelection() {
    console.log("edit selection");
    const request = this.createEvent({
      action: "edit-selection"
    });

    await this.dispatch(request);
    await this.render();
  }

  paint(rect) {
    for (let j = rect.y; j < rect.y + rect.height; j++) {
      if (rect.x === 0 && rect.width === this.elementsMap.width) {
        if (this.indexMap[j]) {
          this.indexMap[j].classList.add("selected");
        }
      }
      for (let i = rect.x; i < rect.x + rect.width; i++) {
        let element = this.elementsMap.get(i, j);
        if (element) {
          element.classList.add("selected");
        }
      }
    }

  }

  unpaint(rect) {
    for (let j = rect.y; j < rect.y + rect.height; j++) {
      if (rect.x === 0 && rect.width === this.elementsMap.width) {
        if (this.indexMap[j]) {
          this.indexMap[j].classList.remove("selected");
        }
      }
      for (let i = rect.x; i < rect.x + rect.width; i++) {
        let element = this.elementsMap.get(i, j);
        if (element) {
          element.classList.remove("selected");
        }
      }
    }
  }

  throttle(callback, delay = 200) {
		if (this.throttleTimer) {
			clearTimeout(this.throttleTimer);
		}
		this.throttleTimer = setTimeout(callback, delay);
	}


  build() {
    return {
      tag: "textarea",
      class: "karma-grid-ta2",
      init: ta => {
        this.render = ta.render;

        // ta.element.style = "left:-100%;position:absolute;";
        ta.element.style = "max-height:40px";

        // this.render = clean => {
        //   console.log("render");
        //   ta.render(clean);
        // };

        ta.element.onfocusout = async event => {
          const selection = this.selection;
          this.endSelection();
          await this.editSelection();

          if (selection && (this.selecting || event.shiftKey)) {
            this.startSelection(selection);
          }
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
        // if (this.hasSelection && this.selection && this.selection.width*this.selection.height > 1) {
        // if (this.selection) {

        console.log("update ta");

        if (this.hasCellsSelected()) {

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



          // this.throttle(() => {
          //   console.log("xx");
          //   ta.element.focus();
          //   ta.element.value = data.map(row => row.join("\t")).join("\n");
          //   ta.element.select();
          // }, 2000);


        } else {

          // ta.element.value = "";
          // ta.element.blur();


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
