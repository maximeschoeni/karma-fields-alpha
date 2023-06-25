
KarmaFieldsAlpha.field.grid = class extends KarmaFieldsAlpha.field {

  getValue(...path) {

    return KarmaFieldsAlpha.Query.getValue(this.resource.driver, ...path);

  }

  setValue(value, ...path) {

    value = KarmaFieldsAlpha.Type.toArray(value);

    KarmaFieldsAlpha.Store.setValue(value, this.resource.driver, ...path)

    this.render();

  }

  modified(...path) {

    return !KarmaFieldsAlpha.DeepObject.include(KarmaFieldsAlpha.Query.vars, KarmaFieldsAlpha.Store.get("delta", this.resource.driver, ...path), this.resource.driver, ...path);

  }

  getParams() {

    return {
      page: 1,
      ppp: 100,
      ...this.resource.params,
      ...KarmaFieldsAlpha.Store.get("params")
    };

  }

  getParam(key) {

    const params = this.getParams();

    if (params) {

      return params[key];

    }

  }

  getCountParams() {

    const params = this.getParams();

    if (params) {

      const {page, ppp, orderby, order, ...countParams} = params;

      return countParams;

    }

  }

  getCount() {

    const params = this.getCountParams();

    if (params) {

      return KarmaFieldsAlpha.Query.getCount(this.resource.driver, params);

    }

  }

  getPpp() {
    return Number(this.parent.request("ppp") || this.resource.params && this.resource.params.ppp || 100);
  }

  getColumns() {
    return this.resource.children.map((column, index) => index.toString()) || [];
  }

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

      if (params) {

        const results = KarmaFieldsAlpha.Query.getResults(this.resource.driver, params);

        if (results) {

          ids = results.map(item => item.id);

          // KarmaFieldsAlpha.Store.setIds(ids);

      		KarmaFieldsAlpha.Backup.update(ids, "ids");
          KarmaFieldsAlpha.Store.set(ids, "ids");


          // -> when an id is fetched...
          const data = this.getData();

          if (data.selectId) {

            const index = ids.indexOf(data.selectId);

            if (index > -1) {

              this.setSelection({
                index: index,
                length: 1,
                final: true
              });

            }

            delete data.selectId;

          }



          // const selection = this.getSelection();
          //
          // if (selection.id) {
          //
          //   const index = ids.indexOf(selection.id);
          //
          //   if (index > -1) {
          //
          //     selection.index = index;
          //     selection.length = 1;
          //     selection.final = true
          //
          //   }
          //
          //   delete selection.id;
          //
          // }

        }

      }

    }

    return ids; // -> undefined if not loaded

  }


  export(items = [], index = 0, length = 999999, colIndex = 0, colLength = 999999, alt = false) {

    const ids = this.getIds();
    const grid = new KarmaFieldsAlpha.Grid();

    if (this.resource.modal) {


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



  import(items, index = 0, length = 999999, colIndex = 0, colLength = 999999) {

    const string = items.shift();

    const [current] = this.export([], index, length, colIndex, colLength);

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
        type: "modal",
        index: "modal",
        ids: this.getSelectedIds(selection)
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


  async add(index = 0, params = {}) {

    // const {page, ppp, orderby, order, ...addParams} = {...this.resource.params, ...params};
    //
    // KarmaFieldsAlpha.Query.add(this.resource.driver, index, addParams);


    KarmaFieldsAlpha.Query.add(this.resource.driver, index, params);

    // const ids = KarmaFieldsAlpha.Store.getIds() || [];
    // const newIds = [...ids];
    //
    // newIds.splice(index, 0, null); // -> null means item is being added. Cannot use symbols in json
    //
    // KarmaFieldsAlpha.Store.setIds(newIds);


    this.setSelection({final: true, index: index, length: 1});

    await this.render();

    this.save("add"); // -> wait until default fields are all set to save

  }

  remove(index, length) {


    // const ids = KarmaFieldsAlpha.Store.getIds() || [];
    // const ids = this.getIds();
    // const clones = [...ids];
    // const removeIds = clones.splice(index, length);
    //
    //
    // for (let id of removeIds) {
    //
    //   // if (id && typeof id !== "symbol") {
    //
    //     KarmaFieldsAlpha.Store.setValue(["1"], this.resource.driver, id, "trash");
    //
    //   // }
    //
    // }
    //
    // KarmaFieldsAlpha.Store.setIds(clones);
    //
    // this.setSelection({final: true, index: index, length: 0});
    //
    // this.save("delete");
    // this.render();

    const ids = this.getIds().slice(index, index + length);

    this.removeIds(ids);


  }

  removeIds(ids) {

    const driver = this.getDriver();
    KarmaFieldsAlpha.Query.removeIds(driver, ids);

    // const currentIds = KarmaFieldsAlpha.Store.getIds();
    // const newIds = currentIds.filter(id => !ids.includes(id));
    // const driver = this.getDriver();
    //
    // for (let id of ids) {
    //
    //   KarmaFieldsAlpha.Store.setValue(["1"], this.resource.driver, id, "trash");
    //
    //   KarmaFieldsAlpha.Query.saveValue(["1"], driver, id, "trash");
    //
    // }
    //
    // KarmaFieldsAlpha.Store.setIds(newIds);

    this.setSelection({final: true, index: 0, length: 0});

    this.save("delete");
    this.render();

  }


  duplicate(index, length = 1) {

    const items = this.export([], index, length);

    this.import(items, index + length, 0);

  }

  // getSelection() {
  //
  //   const selection = super.getSelection();
  //
  //   if (selection.id) {
  //
  //     const ids = this.getIds();
  //
  //     if (ids) {
  //
  //       const index = ids.indexOf(selection.id);
  //
  //       if (index > -1) {
  //
  //         selection.index = index;
  //         selection.length = 1;
  //         selection.final = true
  //
  //       }
  //
  //       delete selection.id;
  //     }
  //
  //   }
  //
  //   return selection;
  // }

  setSelection(selection) {

    if (selection) {

      if (selection.modal) {

        selection = {...this.getSelection(), ...selection};

      } else if (selection.length && this.resource.modal) {

        selection.modal = {};

      }

    }

    super.setSelection(selection);
  }

  hasModalOpen() {

    const selection = this.getSelection();

    return selection && selection.modal;

  }

  hasSelection() {

    const selection = this.getSelection();

    return Boolean(selection && selection.length);

  }

  getSelectedIds(selection) {

    const ids = this.getIds();


    if (ids) {

      if (!selection) {

        selection = this.getSelection();

      }

      const index = selection.index || 0;
      const length = selection.length || 0;

      return ids.slice(index, index + length);

    }

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

    await this.parent.render();


    // -> todo: do this in copy event
    const [string] = this.export([], selection.index, selection.length);

    KarmaFieldsAlpha.Clipboard.write(string);

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
      init: async grid => {
        if (this.resource.style) {
          grid.element.style = this.resource.style;
        }
      },
      update: async grid => {

        const ids = this.getIds();
        const data = this.getData();

        grid.element.classList.toggle("loading", !ids);

        if (ids) {

          const page = this.parent.request("getPage");
          const ppp = this.getPpp();
          const offset = (page - 1)*ppp;

          let selection = this.getSelection();

          const selector = new KarmaFieldsAlpha.Selector(grid.element);
          selector.colCount = this.resource.children.length;
          selector.rowCount = ids.length;
          selector.colHeader = 1;

          if (selection && selection.final) {

            selector.selection = selection;
          }


          selector.onselect = newSelection => {

            // if (!newSelection.equals(selection)) {
            if (!KarmaFieldsAlpha.Selection.compare(newSelection, selection)) {

              // selection = newSelection;

              this.select(newSelection);

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

    };

  }



}



KarmaFieldsAlpha.field.grid.modal = class extends KarmaFieldsAlpha.field.container {

  // getValue(key) {
  //
  //
  //
  //   const ids = this.resource.ids || this.parent.getSelectedIds();
  //
  //   if (ids) {
  //
  //     let array;
  //
  //     for (let id of ids) {
  //
  //       if (id === null) {
  //
  //         continue; // being added
  //
  //       }
  //
  //       const values = this.parent.getValue(id, key);
  //
  //       if (values) {
  //
  //         array = [...(array || []), ...values];
  //
  //       }
  //
  //       // -> /!\ Do not break if values is undefined because it would differ loading of next items
  //
  //     }
  //
  //     return array;
  //
  //   }
  //
  // }

  getAllValues(ids, key) {

    const values = [];

    for (let id of ids) {

      if (id === null || id === undefined) {

        continue; // being added

      }

      const array = this.parent.getValue(id, key);

      if (array) {

        values.push(array);

      }

      // -> Do not break if values is undefined to allow loading of futher items

    }

    if (values.length === ids.length) {

      return values;

    }

  }

  getValue(key) {

    const ids = this.request("getSelectedIds");

    if (ids) {

      if (ids.length > 1) {

        const values = this.getAllValues(ids, key);

        if (values) {

          const mixed = values.some((value, index, array) => index > 0 && !KarmaFieldsAlpha.DeepObject.equal(value, array[0]));

          if (mixed) {

            return [KarmaFieldsAlpha.mixed];

          } else {

            return values[0];

          }

        }

      } else if (ids.length === 1) {

        return this.parent.getValue(ids[0], key);

      }

    }

    // return undefined => not ready

  }

  setValue(value, key) {

    const ids = this.parent.getSelectedIds();

    if (ids) {

      ids.forEach(id => void this.parent.setValue(value, id, key)); // -> multiple items / single value

      // if (ids.length === 1) {
      //
      //   this.parent.setValue(value, ids[0], key); // -> one item / multiple or single value
      //
      // } else if (!Array.isArray(value) || value.length === 1) {
      //
      //   ids.forEach(id => void this.parent.setValue(value[0], id, key)); // -> multiple items / single value
      //
      // } else if (Array.isArray(value) && value.length === ids.length) {
      //
      //   ids.forEach((id, index) => void this.parent.setValue(value[index], id, key)); // -> multiple items / multiple values
      //
      // } else {
      //
      //   console.error("values count does not match items count");
      //
      // }

    }

  }

  multiple() {

    const ids = this.parent.getSelectedIds();

    return ids && ids.length > 1;
  }

  // setSelection(selection) {
  //
  //   const parentSelection = this.parent.getSelection();
  //
  //   this.parent.setSelection(selection && parentSelection && {
  //     [this.resource.index]: selection,
  //     index: parentSelection.index,
  //     length: parentSelection.length,
  //     colIndex: parentSelection.colIndex,
  //     colLength: parentSelection.colLength,
  //     final: false
  //   });
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

  multiple() {

    return false;

  }

  // setSelection(selection) {
  //
  //   selection.index = this.resource.index;
  //   selection.length = 1;
  //
  //   super.setSelection(selection);
  //
  // }

  setSelection(selection) {

    this.parent.setSelection(selection && {
      [this.resource.index]: selection,
      index: this.resource.index,
      length: 1
    });

  }

  // setSelection(selection) {
  //
  //   const parentSelection = this.parent.getSelection();
  //
  //   this.parent.setSelection(selection && parentSelection && {
  //     [this.resource.index]: selection,
  //     index: parentSelection.index,
  //     length: parentSelection.length,
  //     colIndex: parentSelection.colIndex,
  //     colLength: parentSelection.colLength,
  //     final: false
  //   });
  //
  // }

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



KarmaFieldsAlpha.field.grid.row.index = {
  type: "text",
  value: ["+", ["request", "getIndex"], 1],
  style: "width: 40px"
};
