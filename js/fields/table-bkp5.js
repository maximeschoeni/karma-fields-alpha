KarmaFieldsAlpha.fields.table = class extends KarmaFieldsAlpha.fields.form {

  constructor(resource, domain) {
    super(resource, domain);

    const field = this;

    window.karma_table = this; // -> debug


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
      field.paste(this.selection);
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


    this.pagination = new KarmaFieldsAlpha.fields.tablePagination(resource);
    this.pagination.events.change = function() {
      return field.query();
    }

    this.ordering = new KarmaFieldsAlpha.fields.tableOrdering(resource);
    this.ordering.events.change = function() {
      field.pagination.page.setValue(1);
      return field.query();
    }






    // filters

    this.filters = new KarmaFieldsAlpha.fields.group(resource.filters);

    this.filters.events.change = function(target) {
      field.pagination.page.setValue(1);
      this.clearOptions();
      return field.query().then(function() {
        field.filters.triggerEvent("render");
      });
    }

    this.filters.events.optionparams = function(origin) {
      let params = this.getValue();

      // don't send self value
      if (params[origin.resource.key]) {
        params[origin.resource.key] = undefined;
      }

      return params;
    }

    // this.events.optionparams = function(origin) {
    //   let params = this.filters.getValue();
    //
    //   // don't send self value
    //   // if (params[origin.resource.key]) {
    //   //   params[origin.resource.key] = undefined;
    //   // }
    //
    //   return params;
    // }

    // fetch(currentField) {
    //   let params = field.data.filters.getValue();
    //   params.key = currentField.resource.key;
    //
    //   // don't send self value
    //   if (params[currentField.resource.key]) {
    //     params[currentField.resource.key] = undefined;
    //   }
    //
    //   return this.fetch(field.resource.driver, "querykey", params).then(function(results) {
    //     return results;
    //   });
    // }



    // modal
    this.modal = new KarmaFieldsAlpha.fields.field({
      key: "modal",
    });

    this.events.openmodal = function(modalField) {
      field.modal.setValue(modalField.parent.resource.key);
      document.activeElement.blur();
      field.triggerEvent("render");
    }
    this.events.closemodal = function(modalField) {
      let rowId = field.modal.getValue();
      field.selectRow(rowId);
      field.modal.setValue("");
      field.triggerEvent("render");
    }




    // this.filters.events.change = function(currentField) {
    //   currentField.history.save();
    //   currentField.trigger("update");
    //
    //   return field.trigger("queryTable").then(function() {
    //     container.render(true);
    //   });
    // };

    // this.data.filters.parent = this;
    // this.data.filters.events.change = function() {};
    // this.data.filters.fetch = this.fetch.bind(this);
    //

    // this.data.orderby = new KarmaFieldsAlpha.fields.field({
    //   key: "orderby",
    //   value: resource.orderby
    // }, this.domain);
    // this.data.order = new KarmaFieldsAlpha.fields.field({
    //   key: "order",
    //   value: this.getDefaultOrder() || "asc"
    // }, this.domain);
    // this.data.page = new KarmaFieldsAlpha.fields.field({
    //   key: "page",
    //   value: 1,
    //   datatype: "number"
    // }, this.domain);
    // this.data.ppp = new KarmaFieldsAlpha.fields.field({
    //   key: "ppp",
    //   value: resource.ppp || 50,
    //   datatype: "number"
    // }, this.domain);
    // this.data.count = new KarmaFieldsAlpha.fields.field({
    //   key: "count",
    //   datatype: "number"
    // }, this.domain);


    // this.data.ids = new KarmaFieldsAlpha.fields.field({
    this.ids = new KarmaFieldsAlpha.fields.tableCol({
      key: "ids"
    }, this.domain);

    // this.data.header = new KarmaFieldsAlpha.fields.field();
    // this.data.header.addChildren([
    //   this.data.filters,
    //   this.data.orderby,
    //   this.data.order,
    //   this.data.page,
    //   this.data.ppp,
    //   this.data.count,
    //   this.data.ids
    // ]);

    this.domain.name = "T";

    this.events.history = function(targetField) {
      // console.log("updatehistory", targetField);
      field.domain.update(targetField.getId(), targetField.state);
    };


    // this.data.header = new KarmaFieldsAlpha.fields.container({
    //   children: [
    //     {
    //       key: "filters",
    //       type: "group",
    //       children: resource.filters
    //     },
    //     {
    //       key: "orderby",
    //       value: resource.orderby
    //     },
    //     {
    //       key: "order",
    //       value: this.getDefaultOrder() || "asc"
    //     },
    //     {
    //       key: "page",
    //       value: 1,
    //       datatype: "number"
    //     },
    //     {
    //       key: "ppp",
    //       value: resource.ppp || 50,
    //       datatype: "number"
    //     },
    //     {
    //       key: "count",
    //       datatype: "number"
    //     },
    //     {
    //       key: "ids",
    //       datatype: "array"
    //     }
    //   ]
    // });
    //
    // this.data.filters = this.data.header.getDescendant("filters");
    // this.data.orderby = this.data.header.getDescendant("orderby");
    // this.data.order = this.data.header.getDescendant("order");
    // this.data.page = this.data.header.getDescendant("page");
    // this.data.ppp = this.data.header.getDescendant("ppp");
    // this.data.count = this.data.header.getDescendant("count");
    // this.data.ids = this.data.header.getDescendant("ids");



    this.filters.events.fetch = function(currentField, params) {

      Object.assign(params, field.filters.getValue());

      // don't send value of target field
      if (params[currentField.resource.key]) {
        params[currentField.resource.key] = undefined;
      }

      return field.queryOptions(field.resource.driver, params);

		};

    // this.data.header.setKey = async function(key, value, context) {
    //   let child = this.getDescendant(key);
    //   let value = await child.getValue();
    //   child.setValue(value, context);
    // }
    // this.data.header.getValue = async function() {
    //   return {
    //     orderby: await this.getDescendant("orderby").getValue(),
    //
    //   }
    //
    //   return {
    //     orderby: this.parse(this.getDescendant("orderby").value)
    //   }
    //
    //
    //   {orderby} = await Promise.all(this.children.map(function(child) {
    //     return child.getValue;
    //   }));
    //   child.setValue(value, context);
    // }
    //


    //
    // this.data.header.datatype = "object";
    // this.data.header.setKey = async function(key, value, context) {
    //   let value = await this.getValue();
    //   value[key] = value;
    //   this.setValue(value, context);
    // }
    // this.data.header.setKey("orderby", resource.orderby);



    // this.data.header.events.set = function(field) {
    //   KarmaFieldsAlpha.History.save(field, resource.driver);
    // };


    // this.data.body = new Field();
    // this.data.body.events.change = this.change.bind(this);

    // this.events.change = function(field) {
    //   KarmaFieldsAlpha.History.update(field, resource.driver);
    //   // field.history.save();
    //   KarmaFieldsAlpha.History.save(field, resource.driver);
    //
    // };



    this.content = new KarmaFieldsAlpha.fields.tableCol({
      type: "form",
      key: "ids"
    }, this.domain);



  }

  query() {

    // let params = Object.assign({
    //   orderby: field.data.orderby.getValue(),
    //   order: field.data.order.getValue(),
    //   page: field.data.page.getValue(),
    //   ppp: field.data.ppp.getValue()
    // }, field.data.filters.getValue());

    const field = this;


    let params = {
      orderby: this.ordering.orderby.getValue(),
      order: this.ordering.order.getValue(),
      page: this.pagination.page.getValue(),
      ppp: this.pagination.ppp.getValue(),
      ...this.filters.getValue()
    };


    return KarmaFieldsAlpha.Form.query(field.resource.driver, params).then(function(results) {

      field.pagination.count.setValue(results.count, "set");
      field.ids.setValue(results.items.map(function(item) {
        if (typeof item.id !== "string") {
          console.error("item.id must be string");
        }
        return item.id;
      }), "set");

      results.items.forEach(function(item) {
        const row = field.content.getDirectChild(item.id) || field.content.createChild({
          type: "tableRow",
          key: item.id
        });
        row.create(field.resource.columns || []);
        row.setValue(item, "set");
      });
      return results;
    });
  };

  sync() {
    const value = this.content.getModifiedValue();
    const field = this;
    return KarmaFieldsAlpha.Form.update(this.resource.driver, value).then(function(results) {
      // field.updateOriginal();
      field.setValue(value, "set");

      // console.log(value, typeof value);
      //
      // if (value && typeof value === "object") {
  		// 	for (let key in value) {
  		// 		const child = field.getDescendant(key);
      //     console.log(key, typeof key , child, value[key]);
  		// 		if (child) {
  		// 			//child.setValue(value[key], context);
  		// 		}
  		// 	}
  		// }




    });
  };

  add() {
    const field = this;
    return KarmaFieldsAlpha.Form.add(this.resource.driver, this.filters.getValue()).then(function(results) {
      // const value = {};
      // value.id = id;
      // field.resource.columns.forEach(function(column) {
      //   if (column.field) {
      //     value[column.field.key] = column.field.default || column.field.value || ""; // if type was defined statically could use getFieldClass(column.field.type).getEmpty()
      //   }
      // });

      let id = (results.id || results).toString();

      let row = field.createChild({
        type: "tableRow",
        key: id
      });

      row.fill();

      // field.resource.columns.forEach(function(column) {
      //   if (column.field && column.field.key) {
      //     let child = row.getDescendant(column.field.key) || row.createChild(column.field);
      //     if (value[column.field.key] !== undefined) {
      //       child.setValue(value[column.field.key], "set");
      //     } else {
      //       child.setValue(child.getDefault(), "set");
      //     }
      //   }
      // });
      let trash = row.getDirectChild("trash");
      trash.setValue(1, "set");
      trash.triggerEvent("history", true);
      trash.setValue(0);
      trash.triggerEvent("change", true);


      field.ids.add(id, "set");

      // field.triggerEvent("change");

      // field.createChild({
      //   type: "tableRow",
      //   columns: field.resource.columns
      // }).setValue(field.resource.columns.reduce(function(value, item) {
      //   if (item.field) {
      //     value[item.field.key] = item.field.default || item.field.value || "";
      //   }
      //   return value;
      // }, {
      //   id: id
      // }), "change");



      // field.createRow(value);
      // // field.data.ids.setValue([value.id].concat(ids.getValue()), "set");
      // let ids = field.data.ids.getValue();
      // ids.push(id);
      // field.data.ids.setValue(ids), "set");
      return id;
    });
  };

  // this.element.disabled = !(field.select.selection && field.select.selection.width === field.select.grid.width);

  remove() {
    const field = this;

    if (field.select.selection && field.select.selection.width === field.select.grid.width) {
      let ids = field.ids.getValue().slice(field.select.selection.y, field.select.selection.y+field.select.selection.height);
      if (ids.length) {
        field.getDirectChild(ids[0]).trash.triggerEvent("history", true);
        ids.forEach(function(id) {
          field.ids.remove(id, "noop");
          field.getDirectChild(id).trash.setValue(1, "noop");
        });
        this.triggerEvent("change", true);
      }
    }
  }

  // remove() {
  //   const field = this;
  //   let rows = this.select && this.select.getSelectedRows().map(function(cell) {
  //     return cell.field.parent;
  //   });
  //
  //
  //   if (rows) {
  //     // this.data.ids.setValue(ids.getValue().filter(function(id) {
  //     //   return !rows.some(function(row) {
  //     //     row.resource.key == id;
  //     //   });
  //     // }), "set");
  //     // rows.forEach(function(row) {
  //     //   let trashField = row.getDescendant("trash") || row.createChild({
  //     //     key: "trash",
  //     //     datatype: "number"
  //     //   });
  //     //   trashField.setValue(1, "change");
  //     // });
  //
  //     rows[0].trash.triggerEvent("history", true);
  //
  //     rows.forEach(function(row) {
  //       // let trashField = row.getDescendant("trash") || row.createChild({
  //       //   key: "trash",
  //       //   datatype: "number"
  //       // });
  //       field.ids.remove(row.resource.key, "noop");
  //       row.trash.setValue(1, "noop");
  //
  //     });
  //
  //     this.triggerEvent("change", true);
  //
  //   }
  // }

  // createRow(value) { // empty prevent loading independant values
  //   const field = this;
  //
  //   let row = this.getDescendant(value.id) || this.createChild({
  //     type: "container",
  //     key: value.id
  //   });
  //   let trashField = row.getDescendant("trash") || row.createChild({
  //     key: "trash",
  //     datatype: "number"
  //   });
  //   trashField.setValue(0, "change");
  //   // row.setValue(value, "change");
  //
  //   this.resource.columns.forEach(function(column) {
  //     if (column.field) {
  //       let cell = row.getDescendant(column.field.key) || row.createChild(column.field);
  //       if (value[column.field.key] !== undefined) {
  //         cell.setValue(value[column.field.key], "set");
  //       } else if (empty) {
  //         cell.setValue(column.field.default || column.field.value || cell.getDefault(), "set");
  //       }
  //     }
  //   });
  //
  //   return row;
  // };

  // getDefaultOrder() {
  //   let defaultOrderby = this.resource.orderby;
  //   let column = defaultOrderby && this.resource.columns.find(function(column) {
  //     return column.field && column.field.key === defaultOrderby;
  //   });
  //   return column && column.field.key;
  // }

  // reorder(column) {
  //   if (this.data.orderby.getValue() === column.field.key) {
  //     this.data.order.setValue(this.data.order.getValue() === "asc" ? "desc" : "asc", "noop");
  //   } else {
  //     this.data.order.setValue(column.order || "asc", "noop");
  //     this.data.orderby.setValue(column.field.key, "noop");
  //   }
  //   this.data.page.setValue(1, "noop");
  //   return this.query();
  // }

  // fetch(currentField) {
  //   let params = field.data.filters.getValue();
  //   params.key = currentField.resource.key;
  //
  //   // don't send self value
  //   if (params[currentField.resource.key]) {
  //     params[currentField.resource.key] = undefined;
  //   }
  //
  //   return this.fetch(field.resource.driver, "querykey", params).then(function(results) {
  //     return results;
  //   });
  // }

  getModal(rowId) {
    let row = rowId && this.getDirectChild(rowId);
    let modal = row && row.children.find(function(child) {
      return child instanceof KarmaFieldsAlpha.fields.modal;
    });
    if (modal) {
      return modal;
    }
  }

  getCurrentModal() {
    let rowId = this.modal.getValue();
    return rowId && this.getModal(rowId);
  }



  selectRow(rowId) {
    let ids = this.ids.getValue();
    let index = ids.indexOf(rowId);
    if (index > -1) {
      this.select.setFocus({x:0, y:index});
    }
  }

  copy(selection) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      var rows = [];
      const ids = this.ids.getValue();
      for (var j = 0; j < selection.height; j++) {
        var cols = [];
        const row = field.getDirectChild(ids[j+selection.y]);
        for (var i = 0; i < selection.width; i++) {
          const cell = row.children[i+1+selection.x];
          const value = cell.exportValue();
          cols.push(value);
        }
        rows.push(cols.join("\t"));
      }
      if (rows.length) {
        var text = rows.join("\n");
        navigator.clipboard.writeText(text);
      }
    }
  }

  paste(selection) {
    const field = this;
    const x = selection.x;
    const y = selection.y;
    const ids = this.ids.getValue();
    navigator.clipboard.readText().then(function(text) {
      if (text) {
        var rows = text.split(/[\r\n]+/).map(function(row) {
          return row.split("\t");
        });
        // -> should create rows if rows.length + y > ids.length
        field.triggerEvent("history", true);
        for (var j = 0; j < rows.length; j++) {
          const rowField = field.getDirectChild(ids[j+y]);
          for (var i = 0; i < rows[j].length; i++) {
            const cellField = rowField.children[i+1+x];
            const value = rows[j][i];
            cellField.importValue(value);
            cellField.triggerEvent("modify");
            cellField.triggerEvent("set");
          }
        }
        field.triggerEvent("change", true);
      }
    });
  }

  // getPrevModal() {
  //   let rowId = this.modal.getValue();
  //   let ids = this.ids.getValue();
  //   let index = ids.indexOf(rowId);
  //   if (index > 0) {
  //     return this.getModal(ids[index-1]);
  //   }
  // }
  // getNextModal() {
  //   let rowId = this.modal.getValue();
  //   let ids = this.ids.getValue();
  //   let index = ids.indexOf(rowId);
  //   if (index > -1 && index < ids.length - 1) {
  //     return this.getModal(ids[index+1]);
  //   }
  // }





  build() {
    const field = this;

    return {
      class: "karma-field-table",
      init: function(container) {

        field.ordering.events.render = function() {
          container.render();
        };
        field.filters.events.render = function() {
          container.render();
        };
        field.pagination.events.render = function() {
          container.render();
        };

        // for modals
        field.events.render = function() {
          container.render();
        };




        // -> first load table
        container.element.classList.add("loading");
        field.query().then(function(results) {
          container.element.classList.remove("loading");
          container.render();
        });
      },
      update: function(container) {

        this.children = [
          {
            class: "table-header",
            children: [
              {
                tag: "h1",
                init: function() {
                  this.element.textContent = field.resource.title || "";
                }
              },
              field.filters.build()
            ]
          },

          {
            class: "modal-container",
            // init: function(modalContainer) {
            //   field.events.openmodal = function(modalField) {
            //     modalContainer.child = modalField.buildModal();
            //     // console.log(modalContainer.child);
            //     modalContainer.render();
            //     document.body.style.overflow = "hidden";
            //   };
            //   field.events.closemodal = function(modalField) {
            //     console.log("closemodal");
            //     modalContainer.child = {
            //       children: []
            //     };
            //     modalContainer.render();
            //     document.body.style.overflow = "visible";
            //   };
            // },

            update: function() {

              // this.child = {
              //   init: function() {
              //     this.element.textContent = "xxxx";
              //   }
              // }

              // console.log(field.currentModal || 'xxx');

              let modal = field.getCurrentModal();

              if (modal) {

                this.children = [
                  modal.buildModal()
                ];
                document.body.style.overflow = "hidden";
              } else {
                this.children = [];
                document.body.style.overflow = "visible";
              }
            }
          },

          // table body
          {
            class: "table-body",
            child: {
              class: "table grid",
              // clear: true,
              init: function(table) {

                field.select.register(this.element);

                // field.select.init();
                // let index = 0;


                field.events.init = function(targetField, element) {
                  let indexCol = field.resource.index || field.resource.index === undefined ? 1 : 0;
                  let count = table.element.children.length;
                  let col = (count-1)%(field.resource.columns.length+indexCol) - indexCol;
                  let row = Math.floor((count-1)/(field.resource.columns.length+indexCol)) - 1;
                  field.select.registerCell(element, col, row);

                }


              },
              update: function(table) {


                this.children = [];

                let widths = [];

                // field.resource.columns.map(function(column, colIndex) {
                //   return column.width || "1fr";
                // });
                //
                // if (field.resource.index || field.resource.index === undefined) {
                //   widths.unshift(field.resource.index && field.resource.index.width || "auto");
                // }

                // table header index cell
                if (field.resource.index || field.resource.index === undefined) {
                  this.children.push({
                    class: "th table-header-index karma-field",
                    init: function() {
                      this.element.textContent = field.resource.index && field.resource.index.title || "#";
                      field.select.registerHeaderIndex(this.element);
                    }
                  });
                  widths.push(field.resource.index && field.resource.index.width || "auto");
                }

                // table header cells
                field.resource.columns.forEach(function(column, colIndex) {
                  table.children.push({
                    class: "th karma-field",
                    init: function() {
                      field.select.registerHeader(this.element, colIndex);
                    },
                    update: function(th) {
                      this.children = [
                        {
                          tag: "a",
                          class: "header-cell-title",
                          init: function() {
                            this.element.textContent = column.title;
                          }
                        }
                      ];
                      if (column.sortable) {
                        this.children.push(field.ordering.build(column));
                      }
                    }
                  });
                  widths.push(column.width || "1fr");



                  // if (column.type === "index") {
                  //
                  //   // field.events.init = function(field, element) {
                  //   //   field.select.registerItem(element, colIndex, 0, "header-index");
                  //   // }
                  //
                  //   return {
                  //     class: "th table-header-index karma-field",
                  //     init: function() {
                  //       this.element.textContent = column.title || "#";
                  //       // this.element.addEventListener("mousedown", function(event) {
                  //       //   field.select.onIndexHeaderMouseDown();
                  //       // });
                  //       // this.element.addEventListener("mousemove", function(event) {
                  //       //   field.select.onIndexHeaderMouseMove();
                  //       // });
                  //       // this.element.addEventListener("mouseup", function(event) {
                  //       //   field.select.onIndexHeaderMouseUp();
                  //       //   event.stopPropagation();
                  //       // });
                  //       // field.triggerEvent("init", true, null, this.element, "header-index");
                  //       field.select.registerHeaderIndex(this.element);
                  //     },
                  //     update: function() {
                  //
                  //
                  //     }
                  //   }
                  // } else {
                  //   return {
                  //     class: "th karma-field",
                  //     init: function() {
                  //       // if (column.main) {
                  //       //   this.element.classList.add("main");
                  //       // }
                  //       // this.element.addEventListener("mousedown", function(event) {
                  //       //   field.select.onHeaderMouseDown(colIndex);
                  //       // });
                  //       // this.element.addEventListener("mousemove", function(event) {
                  //       //   field.select.onHeaderMouseMove(colIndex);
                  //       // });
                  //       // this.element.addEventListener("mouseup", function(event) {
                  //       //   field.select.onHeaderMouseUp(colIndex);
                  //       //   event.stopPropagation();
                  //       // });
                  //       // field.triggerEvent("init", true, null, this.element, "header");
                  //       field.select.registerHeader(this.element, colIndex - 1);
                  //     },
                  //     update: function(th) {
                  //       this.children = [
                  //         {
                  //           tag: "a",
                  //           class: "header-cell-title",
                  //           init: function() {
                  //             this.element.textContent = column.title;
                  //           }
                  //         }
                  //       ];
                  //       if (column.sortable) {
                  //         this.children.push(field.ordering.build(column));
                  //         // this.children.push({
                  //         //   tag: "a",
                  //         //   class: "header-cell-order",
                  //         //   child: {
            			// 				// 		class: "karma-field-spinner"
            			// 				// 	},
                  //         //   init: function(a) {
                  //         //     this.element.addEventListener("click", function() {
                  //         //       // console.log("clock");
                  //         //       // const t0 = performance.now();
                  //         //       // container.render(true);
                  //         //
                  //         //       a.element.classList.add("loading");
                  //         //       field.reorder(column).then(function() {
                  //         //         a.element.classList.remove("loading");
                  //         //         // field.trigger("render", true);
                  //         //         // const t1 = performance.now();
                  //         //         // console.log(t1-t0);
                  //         //         field.data.header.triggerEvent("change");
                  //         //
                  //         //       });
                  //         //     });
                  //         //   },
                  //         //   update: function() {
                  //         //     const orderby = field.data.orderby.getValue();
                  //         //     const order = field.data.order.getValue();
                  //         //     this.element.classList.toggle("asc", orderby === column.field.key && order === "asc");
                  //         //     this.element.classList.toggle("desc", orderby === column.field.key && order === "desc");
                  //         //   }
                  //         // });
                  //       }
                  //     }
                  //   };
                  // }
                });



                if (field.ids.getValue().length) {
                  field.ids.getValue().forEach(function(id, rowIndex) {

                    let rowField = field.getDirectChild(id);

                    if (field.resource.index || field.resource.index === undefined) {
                      table.children.push({
                        class: "th table-row-index karma-field",
                        init: function() {
                          field.select.registerIndex(this.element, rowIndex);
                        },
                        update: function() {
                          let page = field.pagination.page.getValue();
                          let ppp = field.pagination.ppp.getValue();
                          this.element.textContent = (page - 1)*ppp + rowIndex + 1;
                        }
                      });
                    }

                    field.resource.columns.forEach(function(column, colIndex) {
                      // if (column.type === "index") {
                      //   table.children.push({
                      //     class: "th table-row-index karma-field",
                      //     init: function() {
                      //       // this.element.addEventListener("mousedown", function(event) {
                      //       //   if (event.button === 0) {
                      //       //     field.select.onIndexCellMouseDown(rowIndex);
                      //       //   }
                      //       // });
                      //       // this.element.addEventListener("mousemove", function() {
                      //       //   field.select.onIndexCellMouseMove(rowIndex);
                      //       // });
                      //       // this.element.addEventListener("mouseup", function(event) {
                      //       //   field.select.onIndexCellMouseUp(rowIndex);
                      //       //   event.stopPropagation();
                      //       // });
                      //       // field.triggerEvent("init", true, null, this.element, "index");
                      //
                      //       field.select.registerIndex(this.element, rowIndex);
                      //
                      //     },
                      //     update: function() {
                      //       this.element.textContent = ((field.pagination.page.getValue()-1)*field.pagination.ppp.getValue())+rowIndex+1;
                      //     }
                      //   });
                      // } else {

                        let cellField = rowField.getDirectChild(column.field.key) || rowField.createChild(column.field);
                        table.children.push(
                          cellField.build()
                        );
                        // table.children.push({
                        //   class: "td",
                        //   init: function(cell) {
                        //     this.element.addEventListener("mousedown", function(event) {
                        //       if (event.button === 0) {
                        //         field.select.onCellMouseDown(colIndex, rowIndex);
                        //       }
                        //     });
                        //     this.element.addEventListener("mousemove", function() {
                        //       field.select.onCellMouseMove(colIndex, rowIndex);
                        //     });
                        //     this.element.addEventListener("mouseup", function(event) {
                        //       field.select.onCellMouseUp(colIndex, rowIndex);
                        //       event.stopPropagation();
                        //     });
                        //
                        //     field.triggerEvent("init", true, null, this.element);
                        //
                        //   },
                        //   update: function(cell) {
                        //     this.child = cellField.build();
                        //     field.select.addField(colIndex, rowIndex, this.element, cellField);
                        //   }
                        // });
                      // }
                    });
                  });
                }

                // const t1 = performance.now();
                // console.log("gridend", t1-t0);

                this.element.style.gridTemplateColumns = widths.join(" ");

              }
            }
          },

          // table footer
          {
            class: "table-footer",
            init: function(footer) {

              // field.events.renderFooter = function() {
              //   footer.render();
              // }

              field.events.change = function(targetField) {
                footer.render();
              };


              field.select.events.select = function() {
                footer.render();
              };

            },
            update: function(footer) {

              this.element.classList.toggle("modal-open", field.modal.getValue() || false);

              this.children = [
                {
                  class: "footer-bar",
                  children: [
                    {
                      class: "footer-group table-info",
                      children: [
                        // {
                        //   tag: "button",
                        //   class: "button footer-item",
                        //   init: function(item) {
                        //     this.element.title = "Reload";
                        //     this.element.textContent = "Reload";
                        //     this.element.addEventListener("click", function(event) {
                        //       item.element.classList.add("loading");
                        //
                        //       // empty cache
                        //       KarmaFieldsAlpha.Form.cache = {};
                        //
                        //       // -> still need to reboot fields options
                        //
                        //       field.query().then(function() {
                        //         item.element.classList.remove("loading");
                        //         container.render();
                        //       });
                        //     });
                        //   }
                        // },
                        {
                          tag: "button",
                          class: "karma-button footer-item primary",
                          init: function(button) {
                            this.element.title = "Save";
                            this.element.addEventListener("click", function(event) {
                              button.element.classList.add("loading");

                              field.sync().then(function() {
                                button.element.classList.remove("loading");
                                button.element.blur();
                                container.render();
                              });

                            });
                            // this.element.addEventListener("mouseup", function(event) {
                            //   event.stopPropagation();
                            // });
                          },
                          children: [
                            {
                              tag: "span",
                              class: "button-content",
                              init: function() {
                                this.element.textContent = "Save";
                              }
                            },
                            {
            									class: "karma-field-spinner"
            								}
                          ],
                          update: function() {
                            const modifiedValues = field.getModifiedValue();
                            this.element.disabled = !modifiedValues;
                          }
                        },
                        {
                          tag: "button",
                          class: "karma-button footer-item",
                          children: [
                            // new KarmaFieldsAlpha.fields.icon({
                            //   type: "icon",
                            //   value: "undo.svg"
                            // }).build()
                            {
                              init: function() {
                                this.element.textContent = "Undo";
                              }
                            }
                          ],

                          // child: KarmaFieldsAlpha.includes.icon({
                          //   file: KarmaFieldsAlpha.icons_url+"/undo.svg"
                          // }),
                          init: function(item) {
                            this.element.title = "Undo";
                            this.element.addEventListener("click", function(event) {
                              field.domain.undo();
                              container.render();
                            });
                            // this.element.addEventListener("mouseup", function(event) {
                            //   event.stopPropagation();
                            // });
                          },
                          update: function() {
                            // this.element.disabled = KarmaFieldsAlpha.History.getIndex(field) === 0;
                            this.element.disabled = field.domain.index === 0;
                          }
                        },
                        {
                          tag: "button",
                          class: "karma-button footer-item",

                          children: [
                            // child: new KarmaFieldsAlpha.fields.icon({
                            //   type: "icon",
                            //   value: "redo.svg"
                            // }).build(),
                            {
                              init: function() {
                                this.element.textContent = "Redo";
                              }
                            }
                          ],
                          // child: KarmaFieldsAlpha.includes.icon({
                          //   file: KarmaFieldsAlpha.icons_url+"/redo.svg"
                          // }),
                          init: function(button) {
                            this.element.title = "Redo";
                            this.element.addEventListener("click", function(event) {
                              field.domain.redo();
                              container.render();
                            });
                            // this.element.addEventListener("mouseup", function(event) {
                            //   event.stopPropagation();
                            // });
                          },
                          update: function(button) {
                            this.element.disabled = field.domain.index >= field.domain.max;
                          }
                        },
                        {
                          tag: "button",
                          class: "karma-button footer-item",
                          // child: KarmaFieldsAlpha.includes.icon({
                          //   file: KarmaFieldsAlpha.icons_url+"/plus-alt2.svg"
                          // }),
                          children: [
                            // new KarmaFieldsAlpha.fields.icon({
                            //   type: "icon",
                            //   value: "plus-alt2.svg"
                            // }).build(),
                            {
                              init: function() {
                                this.element.textContent = "Add";
                              }
                            },
                            {
                              class: "karma-field-spinner"
                            }
                          ],
                          init: function(button) {
                            this.element.title = "Add";
                            this.element.addEventListener("click", function(event) {
                              button.element.classList.add("loading");
                              field.add().then(function() {
                                button.element.classList.remove("loading");
                                container.render(true);
                              });
                            });
                            // this.element.addEventListener("mouseup", function(event) {
                            //   event.stopPropagation();
                            // });
                          },
                          update: function(element) {
                            this.element.disabled = field.resource.can_add === false || field.resource.can_add && !(new Function("element", "field", field.resource.can_add))(this.element, field);
                          }
                        },
                        {
                          tag: "button",
                          class: "karma-button footer-item",
                          // child: KarmaFieldsAlpha.includes.icon({
                          //   file: KarmaFieldsAlpha.icons_url+"/trash.svg"
                          // }),
                          children: [
                            // new KarmaFieldsAlpha.fields.icon({
                            //   type: "icon",
                            //   value: "trash.svg"
                            // }).build(),
                            {
                              init: function() {
                                this.element.textContent = "Delete";
                              }
                            }
                          ],

                          init: function(item) {
                            this.element.title = "Delete";
                            this.element.onmousedown = function(event) {
                              event.preventDefault(); // prevent current table cell losing focus
                              this.onmouseup = function(event) {
                                field.remove();
                                field.select.removeFocus();
                                container.render(true);
                              };
                            };
                          },
                          update: function(element) {
                            this.element.disabled = !(field.select.selection && field.select.selection.width === field.select.grid.width);
                          }
                        }
                      ]
                    },
                    field.pagination.build(),
                    {
                      class: "footer-group table-modal-nav",
                      clear: true,
                      update: function() {



                        this.children = [
                          {
                            tag: "button",
                            class: "karma-button footer-item",
                            init: function(button) {
                              this.element.innerText = "<";
                              // this.element.addEventListener("click", function() {
                              //   const rowId = field.modal.getValue();
                              //   const prev = field.ids.getPrev(rowId);
                              //   if (prev) {
                              //     field.modal.setValue(prev);
                              //     field.triggerEvent("render");
                              //   }
                              // });
                            },
                            update: function() {
                              this.element.onclick = function() {
                                const rowId = field.modal.getValue();
                                const next = field.ids.getPrev(rowId);
                                if (next) {
                                  field.modal.setValue(next);
                                  field.triggerEvent("render");
                                }
                              };
                              const currentRowId = field.modal.getValue();
                              this.element.disabled = field.ids.getPrev(currentRowId) ? false : true;
                            }
                          },
                          {
                            tag: "button",
                            class: "karma-button footer-item",
                            init: function(button) {
                              this.element.innerText = ">";

                            },
                            update: function() {
                              // const count = field.count.getValue();
                              // const page = field.page.getValue();
                              // const ppp = field.ppp.getValue();

                              // this.element.onmousedown = function() {
                              //   console.log("a");
                              // }

                              this.element.onclick = function() {
                                const rowId = field.modal.getValue();
                                const next = field.ids.getNext(rowId);

                                if (next) {
                                  field.modal.setValue(next);
                                  field.triggerEvent("render");
                                }
                              };
                              const currentRowId = field.modal.getValue();
                              this.element.disabled = field.ids.getNext(currentRowId) ? false : true;
                            }
                          }
                        ];


                      }
                    }
                    // field.pagination.build()
                    // {
                    //   class: "footer-group table-pagination",
                    //   update: function() {
                    //     this.children = [
                    //       {
                    //         tag: "p",
                    //         class: "footer-item",
                    //         update: function() {
                    //           let num = field.data.count.getValue();
                    //           this.element.textContent = num ? num + " items" : "";
                    //         }
                    //       },
                    //       {
                    //         tag: "button",
                    //         class: "button footer-item",
                    //         init: function(button) {
                    //           this.element.innerText = "«";
                    //           this.element.addEventListener("click", function() {
                    //             const page = field.data.page.getValue();
                    //             if (page > 0) {
                    //               field.data.page.setValue(1, "change");
                    //               button.element.classList.add("loading");
                    //             }
                    //             // field.trigger("queryTable").then(function() {
                    //             //   button.element.classList.remove("loading");
                    //             //   field.trigger("render");
                    //             // });
                    //           });
                    //         },
                    //         update: function() {
                    //           const count = field.data.count.getValue();
                    //           const page = field.data.page.getValue();
                    //           const ppp = field.data.ppp.getValue();
                    //           this.element.style.display = count > ppp ? "block" : "none";
                    //           this.element.disabled = (page == 1);
                    //         }
                    //       },
                    //       {
                    //         tag: "button",
                    //         class: "button footer-item",
                    //         init: function(button) {
                    //           this.element.innerText = "‹";
                    //           this.element.addEventListener("click", function() {
                    //             const page = field.data.page.getValue();
                    //             if (page > 0) {
                    //               field.data.page.setValue(page - 1, "change");
                    //               button.element.classList.add("loading");
                    //             }
                    //
                    //             // field.trigger("queryTable").then(function() {
                    //             //   button.element.classList.remove("loading");
                    //             //   field.trigger("render");
                    //             // });
                    //           });
                    //         },
                    //         update: function() {
                    //           // let num = field.data.count.getValue();
                    //           // let page = field.parent.get("header").get("page").value;
                    //           // let ppp = field.parent.get("header").get("ppp").value;
                    //           // let count = field.data.header.getDescendant("count");
                    //           // let page = field.data.header.getDescendant("page");
                    //           // let ppp = field.data.header.getDescendant("ppp");
                    //
                    //           const count = field.data.count.getValue();
                    //           const page = field.data.page.getValue();
                    //           const ppp = field.data.ppp.getValue();
                    //
                    //           this.element.style.display = count > ppp ? "block" : "none";
                    //           this.element.disabled = (page === 1);
                    //         }
                    //       },
                    //       {
                    //         class: "current-page footer-item",
                    //         update: function() {
                    //           // let num = field.data.count.getValue();
                    //           // let page = field.parent.get("header").get("page").value;
                    //           // let ppp = field.parent.get("header").get("ppp").value;
                    //
                    //           const count = field.data.count.getValue();
                    //           const page = field.data.page.getValue();
                    //           const ppp = field.data.ppp.getValue();
                    //
                    //           this.element.style.display = count > ppp ? "block" : "none";
                    //           this.element.textContent = count && page+" / "+Math.ceil(count/ppp) || "";
                    //         }
                    //       },
                    //       {
                    //         tag: "button",
                    //         class: "button footer-item",
                    //         init: function(button) {
                    //           this.element.innerText = "›";
                    //           this.element.addEventListener("click", function() {
                    //             const count = field.data.count.getValue();
                    //             const page = field.data.page.getValue();
                    //             const ppp = field.data.ppp.getValue();
                    //             const numPage = Math.ceil(count/ppp);
                    //             if (page < numPage) {
                    //               field.data.page.setValue(page+1, "change");
                    //               button.element.classList.add("loading");
                    //             }
                    //             // button.element.classList.add("loading");
                    //             // field.trigger("queryTable").then(function() {
                    //             //   button.element.classList.remove("loading");
                    //             //   field.trigger("render");
                    //             // });
                    //           });
                    //         },
                    //         update: function() {
                    //           // let num = field.data.count.getValue();
                    //           // let page = field.parent.get("header").get("page").value;
                    //           // let ppp = field.parent.get("header").get("ppp").value;
                    //           const count = field.data.count.getValue();
                    //           const page = field.data.page.getValue();
                    //           const ppp = field.data.ppp.getValue();
                    //
                    //           this.element.style.display = count > ppp ? "block" : "none";
                    //           this.element.disabled = page >= Math.ceil(count/ppp);
                    //         }
                    //       },
                    //       {
                    //         tag: "button",
                    //         class: "button footer-item",
                    //         init: function(button) {
                    //           this.element.innerText = "»";
                    //           this.element.addEventListener("click", function() {
                    //             // let num = field.data.count.getValue();
                    //             // let page = field.parent.get("header").get("page");
                    //             // let ppp = field.parent.get("header").get("ppp").value;
                    //
                    //             const count = field.data.count.getValue();
                    //             const page = field.data.page.getValue();
                    //             const ppp = field.data.ppp.getValue();
                    //             const numPage = Math.ceil(count/ppp);
                    //
                    //             if (page < numPage) {
                    //               field.data.page.setValue(numPage, "change");
                    //               button.element.classList.add("loading");
                    //             }
                    //
                    //             // field.trigger("queryTable").then(function() {
                    //             //   button.element.classList.remove("loading");
                    //             //   field.trigger("render");
                    //             // });
                    //           });
                    //         },
                    //         update: function(button) {
                    //           // let num = field.data.count.getValue();
                    //           // let page = field.parent.get("header").get("page").value;
                    //           // let ppp = field.parent.get("header").get("ppp").value;
                    //
                    //           const count = field.data.count.getValue();
                    //           const page = field.data.page.getValue();
                    //           const ppp = field.data.ppp.getValue();
                    //
                    //           this.element.style.display = count > ppp ? "block" : "none";
                    //           this.element.disabled = page >= Math.ceil(count/ppp);
                    //
                    //           // Promise.all([
                    //           //   field.data.count.getValue(),
                    //           //   field.data.page.getValue(),
                    //           //   field.data.ppp.getValue()
                    //           // ]).then(function([count, page, ppp]) {
                    //           //   button.element.style.display = count > ppp ? "block" : "none";
                    //           //   button.element.disabled = page >= Math.ceil(count/ppp);
                    //           // });
                    //           //
                    //           // field.data.header.getValue().then(function(header) {
                    //           //   button.element.style.display = header.count > header.ppp ? "block" : "none";
                    //           //   button.element.disabled = header.page >= Math.ceil(header.count/header.ppp);
                    //           // });
                    //
                    //
                    //
                    //         }
                    //       }
                    //     ];
                    //   }
                    // }
                  ]
                }
              ];
            }
          }
        ];
      }


    };
  }



}


KarmaFieldsAlpha.fields.tableRow = class extends KarmaFieldsAlpha.fields.container {

  constructor(resource, domain) {
    super(resource, domain);

    // if (this.parent.resource.column) {
    //   this.parent.resource.columns.forEach(function(column) {
    //     if (column.field) {
    //       row.createChild(column.field);
    //     }
    //   });
    // }

    this.trash = this.createChild({
      key: "trash",
      type: "field"
      // datatype: "number"
      // value: 0
    });
    this.trash.datatype = "number";


  }

  create(columns) {
    const field = this;
    columns.forEach(function(column) {
      if (column.field) {
        field.createChild(column.field);
      }
    });
  }


  // getModifiedValue() {
  //
  //   let value = super.getModifiedValue();
  //   // console.log(value, this);
  //   return value;
  // }

  // setValue(value, context) {
  //   const field = this;
  //
  //   console.log(value, this);
  //
  //   // this.parent.resource.columns.forEach(function(column) {
  //   //   if (column.field && column.field.key) {
  //   //     // const tk0 = performance.now();
  //   //     let child = field.getDescendant(column.field.key) || field.createChild(column.field);
  //   //     child.setValue(value[column.field.key], context);
  //   //     // const tk1 = performance.now();
  //   //     // console.log(column.field.key, tk1-tk0);
  //   //   }
  //   // });
  //
  //
  //
  //
  //
  // }

  fill() {
    const field = this;
    this.parent.resource.columns.forEach(function(column) {
      if (column.field && column.field.key) {
        let child = field.getDirectChild(column.field.key) || field.createChild(column.field);
        child.setValue(child.getDefault(), "set");
      }
    });
  }

  // getColumn(key) {
  //   return this.parent.resource.columns.find(function(column) {
  //     return column.field && column.field.key === key;
  //   }) || {};
  // }

  // getDescendant(key) {
  //   return super.getDescendant(key) || this.createChild(this.parent.resource.columns.find(function(column) {
  //     return column.field.key === key;
  //   }).field);
  // }

}

KarmaFieldsAlpha.fields.tableCol = class TableCol extends KarmaFieldsAlpha.fields.field {

  constructor(resource, domain) {
    super(resource, domain);
    this.datatype = "array";
  }

  add(item, context) {
    let values = this.getValue();
    values.push(item);
    this.setValue(values, context);
  }

  remove(item, context) {
    let values = this.getValue();
    values = values.filter(function(value) {
      return item !== value;
    });
    this.setValue(values, context);
  }

  getPrev(rowId) {
    let ids = this.getValue();
    let index = ids.indexOf(rowId);
    if (index > 0) {
      return ids[index-1];
    }
  }

  getNext(rowId) {
    let ids = this.getValue();
    let index = ids.indexOf(rowId);
    if (index > -1 && index < ids.length - 1) {
      return ids[index+1];
    }
  }

}

KarmaFieldsAlpha.fields.tableCol.datatype = "array";



KarmaFieldsAlpha.fields.tablePagination = class TablePagination extends KarmaFieldsAlpha.fields.field {

  constructor(resource, domain) {
    super(resource, domain);

    this.page = new KarmaFieldsAlpha.fields.field({
      key: "page"
    }, this.domain, this);
    this.page.datatype = "number";
    this.page.setValue(1);

    this.ppp = new KarmaFieldsAlpha.fields.field({
      key: "ppp"
    }, this.domain, this);
    this.ppp.datatype = "number";
    this.ppp.setValue(resource.ppp || 50);

    this.count = new KarmaFieldsAlpha.fields.field({
      key: "count"
    }, this.domain, this);
    this.count.datatype = "number";

    this.addChildren(this.page, this.ppp, this.count);




  }

  build() {
    const field = this;

    return {
      class: "footer-group table-pagination",
      update: function() {

        this.children = [
          {
            class: "footer-item",
            update: function() {
              let num = field.count.getValue();
              this.element.textContent = num ? num + " items" : "";
            }
          },
          {
            tag: "button",
            class: "karma-button footer-item",
            init: function(button) {
              this.element.innerText = "«";
              this.element.addEventListener("click", function() {
                const page = field.page.getValue();
                if (page > 0) {
                  field.page.setValue(1);
                  button.element.classList.add("loading");
                  field.triggerEvent("change", true).then(function() {
                    button.element.classList.remove("loading");
                    field.triggerEvent("render");
                  });
                }
              });
            },
            update: function() {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();

              this.element.style.display = count > ppp ? "block" : "none";
              this.element.disabled = (page == 1);
            }
          },
          {
            tag: "button",
            class: "karma-button footer-item",
            init: function(button) {
              this.element.innerText = "‹";
              this.element.addEventListener("click", function() {
                const page = field.page.getValue();
                if (page > 0) {
                  field.page.setValue(page - 1);
                  button.element.classList.add("loading");
                  field.triggerEvent("change", true).then(function() {
                    button.element.classList.remove("loading");
                    field.triggerEvent("render");
                  });
                }
              });
            },
            update: function() {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();

              this.element.style.display = count > ppp ? "block" : "none";
              this.element.disabled = (page === 1);
            }
          },
          {
            class: "current-page footer-item",
            update: function() {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();

              this.element.style.display = count > ppp ? "block" : "none";
              this.element.textContent = count && page+" / "+Math.ceil(count/ppp) || "";
            }
          },
          {
            tag: "button",
            class: "karma-button footer-item",
            init: function(button) {
              this.element.innerText = "›";
              this.element.addEventListener("click", function() {
                const count = field.count.getValue();
                const page = field.page.getValue();
                const ppp = field.ppp.getValue();
                const numPage = Math.ceil(count/ppp);

                if (page < numPage) {
                  field.page.setValue(page+1);
                  button.element.classList.add("loading");
                  field.triggerEvent("change", true).then(function() {
                    button.element.classList.remove("loading");
                    field.triggerEvent("render");
                  });
                }
              });
            },
            update: function() {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();
              const numPage = Math.ceil(count/ppp);

              this.element.style.display = count > ppp ? "block" : "none";
              this.element.disabled = page >= numPage;
            }
          },
          {
            tag: "button",
            class: "karma-button footer-item",
            init: function(button) {
              this.element.innerText = "»";
              this.element.addEventListener("click", function() {
                const count = field.count.getValue();
                const page = field.page.getValue();
                const ppp = field.ppp.getValue();
                const numPage = Math.ceil(count/ppp);

                if (page < numPage) {
                  field.page.setValue(numPage);
                  button.element.classList.add("loading");
                  field.triggerEvent("change", true).then(function() {
                    button.element.classList.remove("loading");
                    field.triggerEvent("render");
                  });
                }
              });
            },
            update: function(button) {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();
              const numPage = Math.ceil(count/ppp);

              this.element.style.display = count > ppp ? "block" : "none";
              this.element.disabled = page >= numPage;
            }
          }
        ];
      }
    };
  }
}



KarmaFieldsAlpha.fields.tableOrdering = class TableOrdering extends KarmaFieldsAlpha.fields.field {

  constructor(resource, domain) {
    super(resource, domain);

    this.orderby = new KarmaFieldsAlpha.fields.field({
      key: "orderby",
      value: resource.orderby
    }, this.domain);
    this.order = new KarmaFieldsAlpha.fields.field({
      key: "order",
      value: this.getDefaultOrder() || "asc"
    }, this.domain);

    this.addChildren(this.orderby, this.order);

  }

  getDefaultOrder() {
    let defaultOrderby = this.resource.orderby;
    let column = defaultOrderby && this.resource.columns.find(function(column) {
      return column.field && column.field.key === defaultOrderby;
    });
    return column && column.field.key;
  }

  reorder(column) {
    const field = this;
    if (this.orderby.getValue() === column.field.key) {
      this.order.setValue(this.order.getValue() === "asc" ? "desc" : "asc");
    } else {
      this.order.setValue(column.order || "asc");
      this.orderby.setValue(column.field.key);
    }
    return this.triggerEvent("change", true).then(function() {
      field.triggerEvent("render");
    });
  }

  build(column) {
    const field = this;

    return {
      tag: "a",
      class: "header-cell-order",
      child: {
        class: "karma-field-spinner"
      },
      init: function(a) {
        this.element.onclick = function() {
          a.element.classList.add("loading");
          field.reorder(column).then(function() {
            a.element.classList.remove("loading");
            field.triggerEvent("change", true);
          });
        };
      },
      update: function() {
        const orderby = field.orderby.getValue();
        const order = field.order.getValue();
        this.element.classList.toggle("asc", orderby === column.field.key && order === "asc");
        this.element.classList.toggle("desc", orderby === column.field.key && order === "desc");
      }
    };
  }
}
