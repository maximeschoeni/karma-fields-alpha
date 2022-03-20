
KarmaFieldsAlpha.fields.tableGrid = class extends KarmaFieldsAlpha.fields.formHistory {

  constructor(...params) {
    super(...params);

    // this.extraOrders = {};


    this.buffer = new KarmaFieldsAlpha.LocalStorage(this.resource.driver);

    this.history.path = [this.resource.driver, "history"];

    this.grid = new KarmaFieldsAlpha.Grid();
    this.colMap = new Map();
    this.rowMap = new Map();

    // this.gateway = this.createChild({
    //   driver: this.resource.driver,
    //   type: "tableGateway"
    // });

  }

  update() {
		// noop (override group update)
	}

  // async save(delta) {
  //
  //   await super.save(delta);
  //
  // }

  async fetchValue(deprec, ...path) {

    return super.fetchValue(null, "content", ...path);

  }

  async get(...path) {

    path.pop();

    return super.get(...path, "gridvalue");

  }

  // async write(...path) {
  //
  //   return super.write("content", ...path);
  //
  // }


  async edit(value) {

    if (value === "rendergrid") {
			await this.render();
		}

    await this.parent.edit("grid");

  };

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
  //
  // reorder(column) {
  //   const orderby = this.getParam("orderby");
  //   const order = this.getParam("order");
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

  // getParam(key) {
  //
  //   switch(key) {
  //
  //     case "orderby":
  //       return super.getParam(key) || this.getDefaultOrderby();
  //
  //     case "order":
  //       return super.getParam(key) || this.getDefaultOrder();
  //
  //     default:
  //       return super.getParam(key);
  //
  //   }
  //
  // }



  //
  // async getIds() {
  //   const queriedIds = await this.gateway.getQueriedIds();
  //
  //   const ids = queriedIds.filter(id => {
  //     const value = this.buffer.get(id, "trash"); // || this.buffer.get(id, "trash");
  //     return !value || value.toString() !== "1";
  //     // this.getDeltaValue(id, "trash") !== "1"
  //   });
  //
  //   Object.keys(this.buffer.get() || {}).filter(id => {
  //     const value = this.buffer.get(id, "trash");
  //     return value && value.toString() === "0" && !ids.includes(id);
  //   }).reverse().forEach(id => {
  //     ids.splice(this.getOrder(id), 0, id);
  //   });
  //
  //   return ids;
  // }
  //
  // getOrder(id) {
  //   return this.extraOrders && this.extraOrders[id] || 0;
  // }
  //
  // setOrder(id, order) {
  //   if (!this.extraOrders) {
  //     this.extraOrders = {};
  //   }
  //   this.extraOrders[id] = order;
  // }
  //
  // // getRow(id) {
  // //   return this.getChild(id) || this.createChild({
  // //     type: "tableRow",
  // //     key: id,
  // //     columns: this.table.resource.columns
  // //   });
  // //   // row.create(this.resource.columns || []);
  // // }
  //
  // getRow(id) {
  //
  //   // let row = this.getChild(id);
  //   //
  //   // if (!row) {
  //   //   row = new KarmaFieldsAlpha.fields.tableRow({
  //   //     key: id,
  //   //     columns: this.resource.columns
  //   //   });
  //   //   this.addChild(row);
  //   // }
  //   //
  //   // return row;
  //
  //   return this.createChild({
  //     key: id,
  //     columns: this.resource.columns || []
  //   });
  // }
  //
  // // async getRowByIndex(index) {
  // //   const ids = await this.getIds();
  // //   return this.getChild(ids[index]);
  // // }
  //
  //
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
  //
  // reorder(column) {
  //   const orderby = this.getParam("orderby");
  //   const order = this.getParam("order");
  //   const key = column.orderby || column.field.key;
  //
  //   if (key) {
  //     if (orderby === key) {
  //       this.setParam(order === "asc" ? "desc" : "asc", "order");
  //     } else {
  //       this.setParam(column.order || "asc", "order");
  //       this.setParam(key, "orderby");
  //     }
  //     if (super.getParam("page") !== 1) {
  //       this.setParam("page", 1);
  //     }
  //   }
  //
  // }
  //
  // getParam(key) {
  //
  //   switch(key) {
  //     case "orderby":
  //       return super.getParam(key) || this.getDefaultOrderby();
  //
  //     case "order":
  //       return super.getParam(key) || this.getDefaultOrder();
  //
  //     default:
  //       return super.getParam(key);
  //
  //   }
  //
  // }
  //
  //
  //
  //
  //
  //
  // async add(num) {
  //
  //   let ids = await KarmaFieldsAlpha.Gateway.post("add/"+this.resource.driver, params);
  //
  //   // compat
  //   if (!Array.isArray(ids)) {
  //     ids = [ids];
  //   }
  //
  //   // compat
  //   ids = ids.map(id => id.id || id);
  //
  //   // let ids = Array.isArray(results) ? results.map(item => (item.id || item)) : [results.id || results];
  //
  //   ids = ids.map(id => id.toString());
  //
  //   // const ids = await KarmaFieldsAlpha.Gateway.add(this.resource.driver, {num: num || 1});
  //
  //   // const ids = await this.parent.add(num || 1);
  //
  //   // const rows = [];
  //
  //   // for (let i = 0; i < num; i++) {
  //
  //   //   rows.push(this.createRow());
  //   //
  //   // }
  //   //
  //   // this.parent.add(rows);
  //   //
  //   //
  //   // for (let row of rows) {
  //
  //   for (let id in ids) {
  //
  //     for (let field of this.getRow(id).getDescendants()) {
  //
  //       field.createValue([]);
  //
  //       // this.parent.buffer.set([], ...field.getPath())
  //       //
  //       // // this.buffer.set([], ...path);
  //       // this.writeHistory([], ...path);
  //
  //     }
  //
  //
  //     // this.writeHistory(["1"], id, "trash");
  //     // this.gateway.buffer.set(["1"], id, "trash");
  //
  //     this.createValue(["1"], id, "trash");
  //
  //   }
  //
  //   this.nextup(null);
  //
  //   // KarmaFieldsAlpha.History.backup();
  //   // KarmaFieldsAlpha.History.id = null;
  //
  //   for (let id of ids) {
  //
  //     // await this.write(id);
  //
  //     for (let field of this.getRow(id).getDescendants()) {
  //
  //       const value = await field.getDefault();
  //       await field.setValue(null, value);
  //
  //     }
  //
  //     await this.setValue(null, ["0"], id, "trash");
  //
  //   }
  //
  //   return ids;
  // }
  //
  // async remove() {
  //   let ids = await this.getSelectedIds();
  //
  //
  //   for (let id of ids) {
  //
  //     this.writeHistory(["0"], id, "trash");
  //
  //     for (let field of this.getRow(id).getDescendants()) {
  //
  //       await field.write();
  //
  //     }
  //
  //   }
  //
  //   this.nextup(null);
  //   // KarmaFieldsAlpha.History.backup();
  //   // KarmaFieldsAlpha.History.id = null;
  //
  //   for (let id of ids) {
  //
  //     await this.setValue(null, ["1"], id, "trash");
  //
  //     for (let field of this.getRow(id).getDescendants()) {
  //
  //       // this.writeHistory(null, ...field.getPath());
  //       await field.removeValue();
  //
  //     }
  //
  //   }
  //
  // }
  //
  // async duplicate() {
  //   let ids = await this.getSelectedIds();
  //
  //   if (ids.length) {
  //     const cloneIds = await this.add(ids.length);
  //
  //     for (let i = 0; i < ids.length; i++) {
  //       let id = ids[i];
  //       let cloneId = cloneIds[i];
  //
  //       for (let field of this.getRow(id).getDescendants()) {
  //
  //         const value = await field.fetchValue();
  //         this.setValue(null, value, cloneId, ...field.getPath().slice(1));
  //
  //       }
  //
  //       const contentIds = await this.getIds();
  //
  //       let index = contentIds.indexOf(ids[ids.length-1]);
  //       this.setOrder(cloneId, index+1);
  //
  //     }
  //
  //   }
  // }
  //
  //
  // // override setValue
  // setValue(deprec, value, ...path) {
  //
  //   if (value.constructor === KarmaFieldsAlpha.PastedString && this.parent) {
  //
  //     const data = value[0].split(/[\r\n]/).map(row => row.split("\t"));
  //
  //     const field = this.getChild(...path);
  //     // const point = KarmaFieldsAlpha.Selection.fields.find(field);
  //     const point = {
  //       x: this.colMap(field),
  //       y: this.rowMap(field),
  //     };
  //
  //     this.importSelection(data, point);
  //
  //   } else {
  //
  //     super.setValue(null, value, ...path);
  //
  //   }
  //
  // }
  //
  //
  // async getSelectedIds() {
  //   if (this.hasParam("id")) {
  //     return [this.getParam("id")];
  //   } else if (this.selection && this.selection.width === this.grid.width) {
  //     const ids = await this.getIds();
  //     return ids.slice(this.selection.y, this.selection.y + this.selection.height);
  //   }
  //   return [];
  // }
  //
  //
  // async importSelection(data, selection) {
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
  //       const rowField = this.getChild(ids[j+y]);
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
  //     const rowField = this.getChild(ids[j+y]);
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




  // override setValue
  setValue(deprec, value, ...path) {

    if (value.constructor === KarmaFieldsAlpha.PastedString && this.parent) {

      const data = value[0].split(/[\r\n]/).map(row => row.split("\t"));

      const field = this.getChild(...path);
      // const point = KarmaFieldsAlpha.Selection.fields.find(field);
      const point = {
        x: this.grid.colMap(field),
        y: this.grid.rowMap(field),
      };

      this.importSelection(data, point);

    } else {

      super.setValue(null, value, "content", ...path);

    }

  }


  // async getSelectedIds() {
  //   if (this.hasParam("id")) {
  //     return [this.getParam("id")];
  //   } else if (this.grid.selection && this.grid.selection.width === this.grid.grid.width) {
  //     const ids = await this.getIds();
  //     return ids.slice(this.grid.selection.y, this.grid.selection.y + this.grid.selection.height);
  //   }
  //   return [];
  // }


  async importSelection(data, selection) {

    const r = new KarmaFieldsAlpha.Rect();

    const {x, y, width, height} = {...r, ...selection};

    // let ids = await this.getIds();
    let ids = await super.fetchValue(null, "ids");

    // for (let j = 0; j < Math.max(height, data.length); j++) {
    //   const rowField = this.getChild(ids[j+y]);
    //   if (rowField) {
    //     for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
    //       const cellField = rowField.children[i+x];
    //       if (cellField) {
    //         await cellField.write();
    //       }
    //     }
    //   }
    // }
    //
    // if (data.length > ids.length-y) {
    //   await this.add(data.length-(ids.length-y), false); // -> will backup
    //   ids = await this.getIds();
    // } else {
    //   KarmaFieldsAlpha.History.backup();
    //   KarmaFieldsAlpha.History.id = null;
    // }




    // if (KarmaFieldsAlpha.History.id !== selection) {
    //
    //   KarmaFieldsAlpha.History.id = selection;

      for (let j = 0; j < Math.max(height, data.length); j++) {
        const rowField = this.getChild(ids[j+y]);
        if (rowField) {
          for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
            const cellField = rowField.children[i+x];
            if (cellField) {
              await cellField.write();
            }
          }
        }
      }

      this.nextup(selection);

    //   KarmaFieldsAlpha.History.backup();
    //
    // }

    for (let j = 0; j < Math.max(height, data.length); j++) {
      const rowField = this.getChild(ids[j+y]);
      if (rowField) {
        for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
          const cellField = rowField.children[i+x];
          if (cellField) {
            const value = data[j%data.length][i%data[j%data.length].length];

            // console.log(value, cellField.getPath(), i, x);
            await cellField.importValue(value);
            await cellField.render();
          }
        }
      }

    }

  }





  registerTable(element) {

    this.endSelection();

    this.grid = new KarmaFieldsAlpha.Grid();
    this.fields = new KarmaFieldsAlpha.Grid();

    this.colMap = new Map();
    this.rowMap = new Map();

    // element.onmouseup = event => {
    //   if (this.selection) {
    //     if (this.selection.width === 1 && this.selection.height === 1) {
    //       this.endSelection();
    //     }
    //     super.edit("grid");
    //   }
    // }

  }


  registerCell(element, col, row, field) {

    this.grid.set(col, row, element);
    this.colMap.set(field, col);
    this.rowMap.set(field, row);

    element.onmousedown = event => {
      this.endSelection();
    }

    element.onmousemove = event => {
      if (event.buttons === 1) {
  			this.growSelection({x: col, y:row, width: 1, height: 1});
  		}
		}

  }

	registerIndex(element, row) {

    // element.onmousedown = event => {
    //   event.preventDefault();
		// 	this.toggleSelection({x: 0, y: row, width: this.grid.width, height: 1});
    //   // this.table.renderFooter();
		// }

		element.onmousemove = event => {
      if (event.buttons === 1) {
  			this.growSelection({x: 0, y: row, width: this.grid.width, height: 1});
      }
		}
  }

	registerHeader(element, col) {

    // element.onmousedown = event => {
    //   event.preventDefault();
		// 	this.toggleSelection({x: col, y: 0, width: 1, height: this.grid.height});
    //   // this.table.renderFooter();
		// }

		element.onmousemove = event => {
      if (event.buttons === 1) {
  			this.growSelection({x: col, y: 0, width: 1, height: this.grid.height});
      }
		}
  }

	registerHeaderIndex(element) {

    // element.onmousedown = event => {
    //   event.preventDefault();
		// 	this.toggleSelection({x:0, y:0, width:this.grid.width, height:this.grid.height});
    //   // this.table.renderFooter();
		// }

		element.onmousemove = event => {
      if (event.buttons === 1) {
  			this.growSelection({x: 0, y :0, width: this.grid.width, height: this.grid.height});
      }
		}
  }


	growSelection(r) {

    // if (this.selection) {
		// 	this.unpaint(this.selection);
		// }



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
          super.edit("grow-selection");

        }

      } else {

        this.selection = r;
        this.paint(this.selection);
        super.edit("grow-selection");

      }

    } else if (this.selection) {

      this.unpaint(this.selection);
      this.selection = null;
      super.edit("grow-selection");

    }

    // if (this.selection) {
    //
    //   if (!KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
    //
    //     this.unpaint(this.selection);
    //
    //     if (r.width*r.height > 1) {
    //
    //       this.selection = r;
    //       this.paint(this.selection);
    //
    //
    //     } else {
    //
    //       this.selection = null;
    //
    //     }
    //
    //     super.edit("grow-selection");
    //
    //   }
    //
    // } else {
    //
    //   if (r.width*r.height > 1) {
    //
    //     this.selection = r;
    //     this.paint(this.selection);
    //
    //     super.edit("grow-selection");
    //
    //   }
    //
    //
    //
    // }

    // if (!this.selection) {
    //
    //   this.selection = r;
    //   // this.paint(this.selection);
    //   super.edit("start-selection");
    //
    // } else if (!KarmaFieldsAlpha.Rect.equals(this.selection, r) && r.width*r.height > 1) {
    //
    //
    //   this.selection = r;
    //   this.paint(this.selection);
    //   super.edit("grow-selection");
    //
    // }

	}

  endSelection() {

		if (this.selection) {
			this.unpaint(this.selection);
      this.selection = null;
  		this.focusRect = null;

      super.edit("end-selection");
		}

	}

	// toggleSelection(r) {
  //
	// 	if (this.selection && KarmaFieldsAlpha.Rect.equals(r, this.selection)) {
  //     this.endSelection();
	// 	} else {
  //     this.endSelection();
	// 		this.growSelection(r);
	// 	}
  //
	// }




	paint(rect) {
		for (let i = rect.x; i < rect.x + rect.width; i++) {
			for (let j = rect.y; j < rect.y + rect.height; j++) {
				let element = this.grid.get(i, j);
				if (element) {
					element.classList.add("selected");
				}
			}
		}
	}

	unpaint(rect) {
		for (let i = rect.x; i < rect.x + rect.width; i++) {
			for (let j = rect.y; j < rect.y + rect.height; j++) {
				let element = this.grid.get(i, j);
				if (element) {
					element.classList.remove("selected");
				}
			}
		}
	}


  getIndexWidth() {
    return this.resource.index && this.resource.index.width || "50px";
  }

  build() {
    return {
      class: "table grid",
      init: async grid => {
        this.render = grid.render;
        if (this.resource.style) {
          grid.element.style = this.resource.style;
        }
      },
      update: async grid => {



        const ids = await this.parent.fetchValue(null, "ids");
        const page = await this.parent.fetchValue(null, "page");
        const ppp = await this.parent.fetchValue(null, "ppp");
        const columns = await this.parent.fetchValue(null, "columns");
        const order = await this.parent.fetchValue(null, "order");
        const orderby = await this.parent.fetchValue(null, "orderby");





        this.registerTable(grid.element);
        // this.manager.endSelection();
        // this.manager.grid = new KarmaFieldsAlpha.Grid();
        // this.manager.fields = new KarmaFieldsAlpha.Grid();
        //
        // grid.element.onmouseup = event => {
        //   if (this.manager.selection) {
        //     if (this.manager.selection.width === 1 && this.manager.selection.height === 1) {
        //       this.manager.endSelection();
        //     }
        //     this.renderFooter();
        //   }
        // }


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
                this.registerHeaderIndex(th.element);
                // th.element.onmousedown = event => {
                //   event.preventDefault();
                // 	this.manager.toggleSelection({x: 0, y: 0, width: this.manager.grid.width, height: this.manager.grid.height});
                //   this.renderFooter();
                // }
                // th.element.onmousemove = event => {
                //   if (event.buttons === 1) {
                // 		this.manager.growSelection({x: 0, y :0, width: this.manager.grid.width, height: this.manager.grid.height});
                //   }
                // }
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
                          await this.parent.edit("order");
                          a.element.parentNode.classList.remove("loading");
                        };
                      }
                    });
                  }
                  this.registerHeader(th.element, colIndex);
                  // th.element.onmousedown = event => {
                  //   event.preventDefault();
                  // 	this.manager.toggleSelection({x: colIndex, y: 0, width: 1, height: this.manager.grid.height});
                  //   this.renderFooter();
                  // }
                  // th.element.onmousemove = event => {
                  //   if (event.buttons === 1) {
                  // 		this.manager.growSelection({x: colIndex, y: 0, width: 1, height: this.manager.grid.height});
                  //   }
                  // }
                }
              }
            }),
            ...ids.reduce((children, id, rowIndex) => {
              // const row = this.getRow(id);
              const row = this.createChild({
                key: id,
                columns: this.resource.columns || []
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
                    this.registerIndex(th.element, rowIndex);
                    // th.element.onmousedown = event => {
                    //   event.preventDefault();
                    // 	this.manager.toggleSelection({x: 0, y: rowIndex, width: this.manager.grid.width, height: 1});
                    //   this.renderFooter();
                    // }
                    // th.element.onmousemove = event => {
                    //   if (event.buttons === 1) {
                    // 		this.manager.growSelection({x: 0, y: rowIndex, width: this.manager.grid.width, height: 1});
                    //   }
                    // }
                  }
                },
                ...columns.map((colId, colIndex) => {
                  // const field = currentTable.grid.getRow(id).children[colIndex];
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
                      this.registerCell(td.element, colIndex, rowIndex, field);
                      // this.manager.grid.set(colIndex, rowIndex, td.element);
                      // this.manager.fields.set(colIndex, rowIndex, field);
                      // td.element.onmousedown = event => {
                      //   if (this.manager.selection) {
                      //     this.manager.endSelection();
                      //   }
                      // }
                      // td.element.onmousemove = event => {
                      //   if (event.buttons === 1) {
                      // 		this.manager.growSelection({x: colIndex, y:rowIndex, width: 1, height: 1});
                      // 	}
                      // }
                    },
                    child: field.build()
                  };
                })
              ];
            }, [])
          ];

          grid.element.style.gridTemplateColumns = [this.getIndexWidth(), ...columns.map(index => this.resource.columns[index].width || "auto")].join(" ");

        } else {
          grid.children = [];
          grid.element.classList.remove("filled");
        }
      }
    };
  }



}
