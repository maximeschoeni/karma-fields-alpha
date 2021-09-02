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

    }
    this.select.events.paste = function() {
      field.paste(this.selection).then(function() {
        field.render();
      })
    }

    field.select.events.select = function() {
      field.renderFooter();
    };


    // filters

    this.filters = new KarmaFieldsAlpha.fields.group(resource.filters || {}, this, this);

    // this.filters.edit = async (target, value) => {
    //
    //   // auto submit
    //   this.filters.submit();
    //
    //   // this.setParam("page", 1);
    //   // await this.render();
    // }

    this.filters.fetchValue = (keys) => {
      const path = keys.join("/");
      return KarmaFieldsAlpha.History.getParam(path);
    }
    this.filters.getValue = (keys) => {
      const path = keys.join("/");
      return KarmaFieldsAlpha.History.getParam(path);
    }
    this.filters.setValue = (value, keys) => {
      const path = keys.join("/");
      return KarmaFieldsAlpha.History.setParam(path, value);
    }
    this.filters.removeValue = (keys) => {
      const path = keys.join("/");
      return KarmaFieldsAlpha.History.removeParam(path);
    }
    this.filters.isModified = () => false;
    this.filters.getRelatedValue = () => {};
    this.filters.submit = this.filters.edit = () => {
      KarmaFieldsAlpha.History.setParam("page", 1);
      // await this.render();
      return this.editParam();
    }
    this.filters.backup = () => {
      KarmaFieldsAlpha.History.backup();
    }



    // content

    this.content = new KarmaFieldsAlpha.fields.form({
      driver: resource.driver
    }, this);

    // this.content.ids = new KarmaFieldsAlpha.fields.arrayField({
    //   key: "ids",
    // }, this.content, this.content);
    // KarmaFieldsAlpha.Gateway.types[this.resource.driver+"/ids"] = "json";
    // KarmaFieldsAlpha.Gateway.original[this.resource.driver+"/ids"] = "[]";

    // this.content.initHistory();


    // this.content.getRelatedValue = key => {
    //   return this.filters.getRelatedValue(key);
    // }

    // this.content.events.change = async function(targetField, value) {
    //   await field.editAll(targetField, value);
    //   // await field.renderModal();
    //   await field.renderFooter();
    // };

    this.content.edit = async () => {
      await field.editAll();
      // await field.renderModal();

      // await this.render();


      await field.renderFooter();
    };


    // this.setParams(resource.default);
    //
    // if (!this.getParam("page")) {
    //   this.setParam("page", "1", true);
    // }
    //
    // if (!this.getParam("ppp")) {
    //   this.setParam("ppp", "100", true);
    // }
    //
    // if (this.resource.orderby) {
    //   this.setParam("orderby", this.resource.orderby, true);
    // }
    //
    //
    // const column = this.resource.orderby && this.resource.columns.find(column => {
    //   return column.field && column.field.key === this.resource.orderby;
    // });
    //
    // if (column && column.field.order) {
    //   this.setParam("order", column.field.order, true);
    // }

    // const hash = this.encodeParams(nav);
    // history.replaceState(null, null, "#"+hash);
    //
    //
    // this.nav = KarmaFieldsAlpha.fields.form.getForm("nav");

    const regex = new RegExp("^"+this.resource.driver+"/(\\d+)/id$");
    this.extraIds = Object.keys(this.getDelta().getObject()).map(path => path.match(regex)).filter(match => match).map(match => match[1]);



    // const ids = this.getDelta().find(new RegExp(this.resource.driver+"/\\d+/id"));
    //
    // console.log(ids, new RegExp(this.resource.driver+"/\\d+/id"));

    // this.ids = new KarmaFieldsAlpha.fields.arrayField({
    //   key: "ids",
    // }, this, this);
    //
    // this.registerType("json", ["ids"]);


    // this.ids.getValue = keys => {
    //   const path = this.resource.driver+"/ids";
    //   const buffer = this.getDelta();
    //   let value = buffer.getValue(path);
    //   // value = KarmaFieldsAlpha.Gateway.parseValue(value, "json") || [];
    //
    //   // value = value && value.split(",") || [];
    //   value = value && JSON.parse(value) || [];
    //
    //   // console.log("getValue", path, value);
    //   // console.trace();
    //
    //   return value;
    // }
    //
    // this.ids.setValue = (value, keys) => {
    //   const path = this.resource.driver+"/ids";
    //   const buffer = this.getDelta();
    //
    //   // this.backup(["keys"]);
    //
    //   // console.log(value);
    //
    //   // value = KarmaFieldsAlpha.Gateway.sanitizeValue(value, "json");
    //
    //   // value = value && value.join(",") || "";
    //   value = value && JSON.stringify(value) || null;
    //
    //   // console.log(path, value);
    //   buffer.setValue(value, path);
    //
  	// 	KarmaFieldsAlpha.History.writeHistory(path, value);
    // }

    // this.ids.backup = () => {
    //   this.backup(["ids"]);
    // }


    //
    // KarmaFieldsAlpha.Gateway.types[this.resource.driver+"/ids"] = "json";
    // KarmaFieldsAlpha.Gateway.original[this.resource.driver+"/ids"] = "[]";


    this.options = new KarmaFieldsAlpha.fields.form({
      driver: "options",
      key: "options",
    }, this, this);

    this.options.delta = new KarmaFieldsAlpha.Delta("karma-options/");

    this.options.getValue = function(keys) {
      const path = this.getKeyPath(keys).join("/");
      let value = this.delta.getValue(path);
      value = KarmaFieldsAlpha.Type.parse(value, path);
      return value;
    }
    this.options.fetchValue = this.options.getValue();

    this.options.setValue = function(value, keys) {
      const path = this.getKeyPath(keys).join("/");
      value = KarmaFieldsAlpha.Type.sanitize(value, path);
      this.delta.setValue(value, path);
    }




  }


  editFull() {
    return this.render();
  }


  getPage() {
    return Number(KarmaFieldsAlpha.History.getParam("page")) || 1;
  }

  getPpp() {
    return Number(KarmaFieldsAlpha.History.getParam("ppp")) || this.getDefaultPpp();
  }

  getDefaultPpp() {
    return this.resource.default && this.resource.default.ppp || this.resource.ppp || 20;
  }

  getDefaultOrderby() {
    return this.resource.default && this.resource.default.orderby || this.resource.orderby;
  }

  getDefaultOrder(orderby) {
    const column = orderby && this.resource.columns.find(column => {
      return column.field && column.field.key === orderby;
    });
    if (column && column.field.order) {
      return column.field.order;
    }
  }







  // hasModifiedValue() {
	// 	return false;
	// }

	// getModifiedValue() {
	// }

  // async fetchValue(keys) {
  //   const path = keys.join("/");
	// 	let value = this.getParam(path);
	// 	return value;
  // }
  //
  // async fetchArray(keys) {
  //   return this.fetchValue(keys);
  // }
  //
  // setValue(value, keys) {
  //   const path = keys.join("/");
  //   this.setParam(path, value);
  // }


  // async update() {
  //   let paramString = this.getParamString();
  //   if (paramString !== this.paramString) {
  //     this.paramString = paramString;
  //     await this.query(paramString);
  //     this.modified = true;
  //   } else {
  //     this.modified = false;
  //   }
  // }

  async render() {
    //
  }
  async renderFooter() {
    //
  }
  async renderModal() {
    //
  }

  getRow(id) {
    return this.content.getChild(id) || this.content.createChild({
      type: "tableRow",
      key: id,
      columns: this.resource.columns
    });
    // row.create(this.resource.columns || []);
  }



  async query() {

    // const nav = this.decodeParams(this.paramString);
    // if (!nav.page) nav.page = 1;
    // if (!nav.ppp) nav.ppp = 100;
    // let paramString = this.encodeParams(nav);

    // const param = new URLSearchParams(this.paramString);





    // const results = await this.content.getRemoteTable(paramString, this.resource.driver);
    const results = await KarmaFieldsAlpha.Gateway.getTable(this.resource.driver, this.paramString);

    this.count = results.count;
    this.queriedIds = results.ids;

    this.queriedIds.forEach(id => {
      const row = this.getRow(id);
      row.trash.registerValue("0");

      // const row = this.content.getChild(id) || this.content.createChild({
      //   type: "tableRow",
      //   key: id
      // });
      // row.create(this.resource.columns || []);
    });

    return results;
  };

  async sync() {

    // this.queriedIds = this.getCurrentIds();

    // debugger;

    const results = await this.content.save();

    return results;
  };


  async add(num, noBackup) {
    // const results = await KarmaFieldsAlpha.Form.add(this.resource.driver, {num: num || 1})
    //
    // const ids = results.map(item => (item.id || item).toString());

    const ids = await KarmaFieldsAlpha.Gateway.add(this.resource.driver, {num: num || 1});

    const rows = ids.map(id => {
      let row = this.getRow(id);
      // let row = this.content.createChild({
      //   type: "tableRow",
      //   key: id
      // });
      // row.create(this.resource.columns);

      // this.content.setOriginalValue("1", id+"/trash");
      return row;
    });

    // if (!noBackup) {
    //   this.content.backup(["add"]);
    //   // this.backup(["add"]);
    // }

    // debugger;

    await Promise.all(rows.map(row => {
      row.fill(null);
      row.trash.setValue("1");
    }));

    // this.backup(["ids"]);

    // this.ids.add(ids);

    KarmaFieldsAlpha.History.backup();

    this.extraIds = this.extraIds.concat(ids);

    await Promise.all(rows.map(row => row.fill())); // -> also set trash to "0"


    // this.queriedIds = ids.concat(this.queriedIds);
    // await this.content.ids.add(ids);



    if (this.getModalColumn() && ids.length === 1) {
      KarmaFieldsAlpha.History.setParam("id", ids[0]);
    }

  }

  async remove() {
    let ids = [];
    if (KarmaFieldsAlpha.History.hasParam("id")) {
      ids = [KarmaFieldsAlpha.History.getParam("id")];

    } else if (this.select.selection && this.select.selection.width === this.select.grid.width) {
      ids = this.getCurrentIds().slice(this.select.selection.y, this.select.selection.y+this.select.selection.height);
    }
    if (ids.length) {
      const rows = ids.map(id => this.content.getChild(id));
      await Promise.all(rows.map(row => {
        row.write();
        row.trash.setValue("0");
      }));

      // rows[0].backup();

      KarmaFieldsAlpha.History.backup();

      KarmaFieldsAlpha.History.removeParam("id");
      await this.editParam();


      // this.content.backup(rows);
      // this.content.ids.remove(ids);

      // await Promise.all(rows.map(row => row.removeValue()));
      await Promise.all(rows.map(row => {
        row.removeValue();
        row.trash.setValue("1");
      }));
    }
  }

  // async function
  reorder(column) {
    const params = KarmaFieldsAlpha.History.getParamsObject();
    // const orderby = this.getParam("orderby");
    // const order = this.getParam("order");
    const orderby = params.get("orderby") || this.getDefaultOrderby();
    const order = params.get("order") || this.getDefaultOrder(orderby);

    if (orderby === column.field.key) {
      params.set("order", order === "asc" ? "desc" : "asc");
    } else {
      params.set("order", column.order || "asc");
      params.set("orderby", column.field.key);
    }
    params.set("page", 1);
    KarmaFieldsAlpha.History.setParamsObject(params);
    return this.editParam();
  }


  selectRow(rowId) {

    const ids = this.getCurrentIds();
    let index = ids.indexOf(rowId);
    if (index > -1) {
      this.select.setFocus({x:0, y:index});
    }

  }

  async copy(selection) {
    // const field = this;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      let ids = this.getCurrentIds();

      var rows = [];
      for (var j = 0; j < selection.height; j++) {
        var cols = [];
        const row = this.content.getChild(ids[j+selection.y]);
        for (var i = 0; i < selection.width; i++) {
          const cell = row.children[i+1+selection.x];
          const valuePromise = cell.exportValue(selection.width === 1);
          cols.push(valuePromise);
        }
        rows.push(cols);
      }



      if (rows.length) {
        const items = await Promise.all(rows.map(cols => {
          return Promise.all(cols).then(cols => {
            return cols.join("\t")
          });
        }));

        const text = items.join("\n");
        await navigator.clipboard.writeText(text);
      }

    }
  }

  async paste(selection) {

    const field = this;
    const x = selection.x;
    const y = selection.y;

    let ids = this.getCurrentIds();
    const text = await navigator.clipboard.readText();

    if (text) {
      let rows = text.split(/[\r\n]+/).map(function(row) {
        return row.split("\t");
      });

      field.content.backup(["paste"]);

      if (rows.length > ids.length-y) {
        await this.add(rows.length-(ids.length-y), false);
        ids = this.getCurrentIds();
      }

      const promises = [];
      for (let j = 0; j < rows.length; j++) {
        const rowField = field.content.getChild(ids[j+y]);
        for (let i = 0; i < rows[j].length; i++) {
          const cellField = rowField.children[i+1+x];
          const value = rows[j][i];
          const promise = cellField.importValue(value).then(() => {
            return cellField.render();
          });
          promises.push(promise);
        }
      }
      await Promise.all(promises);
      await field.content.bubble("change");
    }
  }

  async editAll() {
    // console.log(conductor, value);
    if (this.select && this.select.selection && this.select.focusRect && this.select.selection.height > 1) {

      let ids = this.getCurrentIds();
      let field = this.content.getChild(ids[this.select.focusRect.y]).children[this.select.focusRect.x+1];
      let value = await field.fetchValue();

      field.backup();

      const promises = [];

      for (var j = 0; j < this.select.selection.height; j++) {
        if (j+this.select.selection.y !== this.select.focusRect.y) {
          const rowField = this.content.getChild(ids[j+this.select.selection.y]);
          const cellField = rowField.children[this.select.focusRect.x+1];
          cellField.setValue(value);

          promises.push(cellField.render());
        }
      }

      await Promise.all(promises);

      // await this.render();
    }
  }

  getIds() {
    console.error("Deprecated getIds()");
    return this.queriedIds;
  }

  getCurrentIds() {

    // const ids = this.content.ids.getValue() || [];
    // const ids = this.ids.getValue() || [];
    const ids = this.extraIds;
    return ids.concat(this.queriedIds || []);
  }

  getCount() {
    // const ids = this.content.ids.getValue() || [];
    // const ids = this.ids.getValue() || [];
    // return this.count + ids.length;
    return this.count;
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

  // getModal(rowId) {
  //   let row = rowId && this.content.getChild(rowId);
  //   let modal = row && row.children.find(function(child) {
  //     return child instanceof KarmaFieldsAlpha.fields.modal;
  //   });
  //   if (modal) {
  //     return modal;
  //   }
  // }



  getModalColumn() {
    return this.resource.columns.find(column => column.field && column.field.type === "modal");
  }

  getModalField(id) {
    // const rowField = this.getRow(id);

    const rowField = this.content.getChild(id);
    return rowField && rowField.children.find(child => child.resource.type === "modal");
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
          // const orderBtn = new KarmaFieldsAlpha.fields.tableControls.order();
          // th.children.push(orderBtn.build(column, this));
          th.children.push(KarmaFieldsAlpha.fields.table.Controls.buildOrderLink(this, column));
        }
      }
    };
  }

  buildIndexCell(rowIndex) {
    return {
      class: "th table-row-index karma-field",
      update: th => {
        let page = this.getPage();
        let ppp = this.getPpp();
        th.element.textContent = (page - 1)*ppp + rowIndex + 1;
      }
    };
  }

  buildGrid(rows) {
    return {
      class: "table grid",
      update: async grid => {

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

        // const rows = this.getCurrentIds().map(id => this.getRow(id)).filter(row => row.trash.getValue() !== "1").forEach((rowField, rowIndex) => {
        rows.forEach((rowField, rowIndex) => {
          if (this.hasIndex()) {
            grid.children.push(this.buildIndexCell(rowIndex));
          }

          this.getColumns().forEach((column, colIndex) => {
            const cellField = rowField.children[colIndex+1];
            if (cellField) {
              grid.children.push(cellField.build());
            }
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

  buildPagination() {
    return {
      class: "table-pagination",
      update: container => {
        // console.log("update pagination", this.queriedIds);
        container.element.classList.toggle("loading", this.queriedIds === undefined);
        const count = this.getCount() || 0;
        const ppp = this.getPpp();
        container.element.classList.toggle("hidden", count <= ppp);
      },
      children: [
        // KarmaFieldsAlpha.fields.table.Pagination.buildPPPButton(this),
        // KarmaFieldsAlpha.fields.table.Pagination.buildItemsTotal(this),
        KarmaFieldsAlpha.fields.table.Pagination.buildFirstPageButton(this),
        KarmaFieldsAlpha.fields.table.Pagination.buildPrevPageButton(this),
        KarmaFieldsAlpha.fields.table.Pagination.buildCurrentPageElement(this),
        KarmaFieldsAlpha.fields.table.Pagination.buildNextPageButton(this),
        KarmaFieldsAlpha.fields.table.Pagination.buildLastPageButton(this)
      ]
    };
  }

  buildControls() {
    return {
      class: "table-control-group table-edit",
      children: [
        KarmaFieldsAlpha.fields.table.Controls.buildSaveButton(this),
        // KarmaFieldsAlpha.fields.table.Controls.buildUndoButton(this),
        // KarmaFieldsAlpha.fields.table.Controls.buildRedoButton(this),
        KarmaFieldsAlpha.fields.table.Controls.buildAddButton(this),
        KarmaFieldsAlpha.fields.table.Controls.buildDeleteButton(this)
      ]
    };
  }

  buildModalNav() {
    return {
      class: "footer-group modal-navigation",
      children: [
        KarmaFieldsAlpha.fields.table.Pagination.buildPrevModalButton(this),
        KarmaFieldsAlpha.fields.table.Pagination.buildNextModalButton(this)
      ]
    };
  }


  buildModal() {

		return {
			class: "karma-modal",
			children: [
				{
					class: "karma-modal-header table-header",
					children: [
						{
							tag: "h1",
							update: async h1 => {
                // const column = this.getModalColumn();
                // h1.element.textContent = column && column.field.title || "Edit";
                const id = KarmaFieldsAlpha.History.getParam("id");
                const field = id && this.getModalField(id);
                // if (field) {
                //   field.edit = () => {
                //     h1.render();
                //     this.content.edit();
                //   }
                // }
                h1.element.textContent = field && await field.text.fetchValue() || "Edit";

							}
						},
            {
              class: "modal-navigation",
              children: [
                KarmaFieldsAlpha.fields.table.Pagination.buildPrevModalButton(this),
                KarmaFieldsAlpha.fields.table.Pagination.buildNextModalButton(this),
                KarmaFieldsAlpha.fields.table.Pagination.buildCloseModalButton(this)
              ]
            }
            // {
            //   class: "header-item",
            //   child: KarmaFieldsAlpha.fields.table.Pagination.buildCloseModalButton(this)
            // }
					]
				},
				{
					class: "karma-modal-body karma-field-frame",
					update: frame => {
            const id = KarmaFieldsAlpha.History.getParam("id");
            const field = id && this.getModalField(id);
            // console.log("upload karma-modal-body", field);
            if (field) {
              frame.child = field.content.build();
              // frame.element.classList.add("loading");
              // console.log("start");
              // frame.complete = () => {
              //   console.log("end");
              //   frame.element.classList.remove("loading");
              // }
              // frame.element.classList.remove("loading");
              // console.log("upload karma-modal-body end");
            }
            // else {
            //   frame.element.classList.add("loading");
            //   console.log("upload karma-modal-body start");
            // }
					}
          // ,
          // complete: frame => {
          //   console.log("complete karma-modal-body");
          // }
				}
			]
		};

	}

  // buildFooterBar() {
  //   return {
  //     class: "footer-bar",
  //     children: [
  //
  //
  //       {
  //         class: "footer-group table-info",
  //         update: group => {
  //           let buttons = this.resource.controls || [
  //             {
  //               type: "save",
  //               name: "Save",
  //               primary: true
  //             },
  //             {
  //               type: "undo",
  //               name: "Undo"
  //             },
  //             {
  //               type: "redo",
  //               name: "Redo"
  //             },
  //             {
  //               type: "add",
  //               name: "Add"
  //             },
  //             {
  //               type: "delete",
  //               name: "Delete"
  //             }
  //           ];
  //           group.children = buttons.map(resource => {
  //             if (KarmaFieldsAlpha.fields.tableControls[resource.type]) {
  //               const button = new KarmaFieldsAlpha.fields.tableControls[resource.type](resource);
  //               return button.build(this);
  //             }
  //           });
  //         }
  //       },
  //       {
  //         class: "footer-group table-pagination",
  //         update: group => {
  //           const modal = this.getParam("id");
  //           if (modal) {
  //             group.children = [];
  //           } else {
  //             let buttons = [
  //               {
  //                 type: "ppp"
  //               },
  //               {
  //                 type: "firstPage",
  //                 name: "«"
  //               },
  //               {
  //                 type: "prevPage",
  //                 name: "‹"
  //               },
  //               {
  //                 type: "currentPage",
  //               },
  //               {
  //                 type: "nextPage",
  //                 name: "›"
  //               },
  //               {
  //                 type: "lastPage",
  //                 name: "»"
  //               }
  //             ];
  //             group.children = buttons.map(resource => {
  //               if (KarmaFieldsAlpha.fields.tableControls[resource.type]) {
  //                 const button = new KarmaFieldsAlpha.fields.tableControls[resource.type](resource);
  //                 return button.build(this);
  //               }
  //             });
  //           }
  //         }
  //       },
  //       {
  //         class: "footer-group modal-navigation",
  //         update: group => {
  //           const modal = this.getParam("id");
  //
  //           if (modal) {
  //             let buttons = [
  //               {
  //                 type: "prevModal",
  //                 name: "‹"
  //               },
  //               {
  //                 type: "nextModal",
  //                 name: "›"
  //               }
  //             ];
  //             group.children = buttons.map(resource => {
  //               if (KarmaFieldsAlpha.fields.tableControls[resource.type]) {
  //                 const button = new KarmaFieldsAlpha.fields.tableControls[resource.type](resource);
  //                 return button.build(this);
  //               }
  //             });
  //           } else {
  //             group.children = [];
  //           }
  //         }
  //       }
  //       // this.buildModalNav()
  //     ]
  //   };
  // }



  build() {

    return {
      class: "karma-field-table",
      children: [
        {
          class: "table-view",

          children: [
            {
              class: "table-modal",
              update: single => {
                let percentWidth = this.options.getValue(["modalWidth"]) || 100;
                single.element.style.flexBasis = percentWidth+"%";
                single.children = [
                  this.buildModal(),
                  {
                    class: "modal-resize-handle",
                    update: handle => {
                      handle.element.onmousedown = event => {
                        const mouseMove = event => {
                          const modalBox = single.element.getBoundingClientRect();
                          const viewerBox = single.element.parentNode.getBoundingClientRect();
                          const ratioWidth = (event.clientX - viewerBox.left)/viewerBox.width;
                          percentWidth = Math.min(100, 100*ratioWidth);
                          single.element.style.flexBasis = percentWidth+"%";
                          this.options.setValue(percentWidth, ["modalWidth"])
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
                ]
              },
              // child: this.buildModal()
            },
            {
              class: "table-main",
              update: main => {
                main.children = []
                main.children.push({
                  class: "table-header",
                  update: (header) => {
                    header.children = [
                      {
                        tag: "h1",
                        init: h1 => {
                          h1.element.textContent = this.resource.title || this.resource.key || this.resource.title || "Table";
                        }
                      },
                      KarmaFieldsAlpha.fields.table.Pagination.buildItemsTotal(this),
                      this.buildPagination(),
                      {
                        class: "header-item",
                        child: KarmaFieldsAlpha.fields.table.Pagination.buildCloseTableButton(this)
                      }

                    ];
                    // header.children = [];
                    // header.children.push({
                    //   tag: "h1",
                    //   init: h1 => {
                    //     h1.element.textContent = this.resource.title || this.resource.key || this.resource.title || "Table";
                    //   }
                    // });
                    // header.children.push(KarmaFieldsAlpha.fields.table.Pagination.buildItemsTotal(this));
                    //
                    // const count = this.getCount() || 0;
                    // const ppp = this.getPpp();
                    // console.log(count, ppp);
                    // // if (count > ppp) {
                    // //
                    // // }
                    // header.children.push(this.buildPagination());
                    //
                    // header.children.push({
                    //   class: "header-item",
                    //   child: KarmaFieldsAlpha.fields.table.Pagination.buildCloseTableButton(this)
                    // });
                  }
                });
                // if (this.resource.filters) {
                //
                // }
                main.children.push({
                  class: "table-filters",
                  update: filters => {
                    filters.element.classList.toggle("hidden", !this.resource.filters);
                  },
                  child: this.filters.build()
                });
                main.children.push({
                  class: "table-body",
                  init: body => {
                    this.content.render = body.render;
                  },
                  update: body => {
                    const rows = this.getCurrentIds().map(id => this.getRow(id)).filter(row => row.trash.getValue() !== "1");
                    body.children = rows.length && [this.buildGrid(rows)] || [];
                  },
                  complete: () => {
                    this.renderFooter();
                  }
                });

              }
            }
          ]
        },
        {
          class: "table-control",
          update: footer => {
            this.renderFooter = footer.render;
            // footer.child = this.buildFooterBar();

            footer.children = [
              this.buildControls()
            ]
          }
        }
      ],
      update: async container => {
        // await this.update();
        this.render = container.render;

        // const params = KarmaFieldsAlpha.History.getParamsObject();

        let paramString = KarmaFieldsAlpha.History.getParamString();
        const params = new URLSearchParams(paramString);

        if (!params.get("page")) {
          params.set("page", "1");
        }

        if (!params.get("ppp")) {
          params.set("ppp", this.getDefaultPpp() || "");
        }

        if (!params.get("orderby")) {
          const orderby = this.getDefaultOrderby();
          if (orderby) {
            params.set("orderby", orderby);
          }
        }

        if (!params.get("order")) {
          const order = this.getDefaultOrder(params.get("orderby"));
          if (order) {
            params.set("order", order);
          }
        }

        params.sort();

        if (params.toString() !== paramString) {

          KarmaFieldsAlpha.History.setParamString(params.toString());

        }

        params.delete("id");



        if (params.toString() !== this.paramString) {

          this.paramString = params.toString();

          // KarmaFieldsAlpha.History.setParamsObject(params);

          // await this.query(paramString);

          // container.element.classList.add("loading");

          if (!this.queriedIds) {

            container.element.classList.add("loading");

            this.query(this.paramString).then(() => {
              container.render();
              // container.element.classList.remove("loading");
            });

            container.complete = () => {
              container.element.classList.remove("loading");
              container.complete = null;
            };

          } else {
            await this.query(paramString);
          }









        }



      }
      // ,
      // complete: container => {
      //   container.element.classList.remove("loading");
      // }

    };
  }

}
