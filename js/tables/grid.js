
KarmaFieldsAlpha.field.grid = class extends KarmaFieldsAlpha.field {

  getDriver() {

    if (!this.resource.driver) {

      console.error("Driver not set");

    }

    return this.resource.driver;

  }

  getValue(...path) {

    const driver = this.getDriver();

    return KarmaFieldsAlpha.Query.getValue(driver, ...path);

  }

  setValue(value, ...path) {

    const driver = this.getDriver();

    value = KarmaFieldsAlpha.Type.toArray(value);

    KarmaFieldsAlpha.Store.setValue(value, driver, ...path)

    this.render();

  }

  getAlias(id, alias) {

    console.error("deprecated");

    return this.getAliasedValue(id, key);

  }

  getAliasedValue(id, alias) {

    console.error("deprecated");

    const driver = this.getDriver();
    const key = KarmaFieldsAlpha.Query.getAlias(driver, alias);

    return this.getValue(id, key);

  }

  getName(id) {

    console.error("deprecated");

    const driver = this.getDriver();
    const key = KarmaFieldsAlpha.Query.getAlias(driver, "name");

    const value = this.getValue(id, key);

    if (!value || value === KarmaFieldsAlpha.loading) {

      return KarmaFieldsAlpha.loading;

    }

    return value[0] || "";
  }

  getParent(id) {

    console.error("deprecated");

    const driver = this.getDriver();
    const key = KarmaFieldsAlpha.Query.getAlias(driver, "parent");

    const value = this.getValue(id, key);

    if (!value || value === KarmaFieldsAlpha.loading) {

      return KarmaFieldsAlpha.loading;

    }

    return value[0] || "0";

  }

  getPosition(id) {

    console.error("deprecated");

    const driver = this.getDriver();
    const key = KarmaFieldsAlpha.Query.getAlias(driver, "position");

    const value = this.getValue(id, key);

    if (!value || value === KarmaFieldsAlpha.loading) {

      return KarmaFieldsAlpha.loading;

    }

    return parseInt(value[0] || 0);

  }




  setAlias(value, id, alias) {

    console.error("deprecated");

    const driver = this.getDriver();
    const key = KarmaFieldsAlpha.Query.getAlias(driver, alias);

    this.setValue(value, id, key);

  }

  initAlias(value, id, alias) {

    console.error("deprecated");

    const driver = this.getDriver();
    const key = KarmaFieldsAlpha.Query.getAlias(driver, alias);

    KarmaFieldsAlpha.Query.initValue(driver, value, id, key)

    // const current = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.Query.vars, driver, id, key);
    //
    // if (current === undefined) {
    //
    //   value = KarmaFieldsAlpha.Type.toArray(value);
    //
    //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.Query.vars, value, driver, id, key);
    //
    // }

  }

  initValue(value, id, key) {

    const driver = this.getDriver();

    KarmaFieldsAlpha.Query.initValue(driver, value, id, key)

  }

  modified(...path) {

    return !KarmaFieldsAlpha.DeepObject.include(KarmaFieldsAlpha.Query.vars, KarmaFieldsAlpha.Store.get("delta", this.resource.driver, ...path), this.resource.driver, ...path);

  }

  getParams() {

    // const params = {
    //   page: 1,
    //   ppp: 100,
    //   ...this.resource.params,
    //   ...KarmaFieldsAlpha.Store.get("params")
    // };



    let params = KarmaFieldsAlpha.Store.get("params");

    if (params === undefined) {

      params = {
        page: 1,
        ppp: 100,
        ...this.resource.params
      };

    }


    return params;

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
      this.render();

    } else {

      // KarmaFieldsAlpha.Nav.change(order || "asc", undefined, "order");
      // KarmaFieldsAlpha.Nav.change(key, undefined, "orderby");

      this.parent.setValue(order || "asc", "order");
      this.parent.setValue(key, "orderby");
      this.render();

    }

  }


  getIds() {

    const params = this.getParams();
    const driver = this.getDriver();
    const idAlias = KarmaFieldsAlpha.Query.getAlias(driver, "id");
    const results = KarmaFieldsAlpha.Query.getResults(driver, params);

    if (results) {

      return results.map(result => result[idAlias]);

    }

    return KarmaFieldsAlpha.loading;


    // console.error("deprecated");
    //
    // let ids = KarmaFieldsAlpha.Store.get("ids");
    //
    // if (!ids) {
    //
    //   const params = this.getParams();
    //
    //   if (params) {
    //
    //     const results = KarmaFieldsAlpha.Query.getResults(this.resource.driver, params);
    //
    //     if (results) {
    //
    //       ids = results.map(item => item.id);
    //
    //       // KarmaFieldsAlpha.Store.setIds(ids);
    //
    //   		KarmaFieldsAlpha.Backup.update(ids, "ids");
    //       KarmaFieldsAlpha.Store.set(ids, "ids");
    //
    //
    //       // // -> when an id is fetched...
    //       // const data = this.getData();
    //       //
    //       // if (data.selectId) {
    //       //
    //       //   const index = ids.indexOf(data.selectId);
    //       //
    //       //   if (index > -1) {
    //       //
    //       //     this.setSelection({
    //       //       index: index,
    //       //       length: 1,
    //       //       final: true
    //       //     });
    //       //
    //       //   }
    //       //
    //       //   delete data.selectId;
    //       //
    //       // }
    //
    //     }
    //
    //   }
    //
    // }
    //
    // return ids; // -> undefined if not loaded

  }


  getItems() {

    let items = KarmaFieldsAlpha.Store.get("ids");

    if (!items) {

      const ids = this.getIds();

      if (ids && ids !== KarmaFieldsAlpha.loading) {

        items = ids.map(id => ({id: id}));

        KarmaFieldsAlpha.Backup.update(items, "ids");
        KarmaFieldsAlpha.Store.set(items, "ids");

      }

    }

    return items;
  }


  export(dataRow = [], index = 0, length = 999999, colIndex = 0, colLength = 999999, alt = false) {

    // const ids = this.getIds();
    const items = this.getItems();
    const grid = new KarmaFieldsAlpha.Grid();

    if (this.resource.modal) {


      for (let i = 0; i < Math.min(items.length - index, length); i++) {

        const item = items[i + index] || {loading: true};

        const rowField = this.createChild({
          type: "row",
          index: i + index,
          id: item.id,
          loading: item.loading,
          // item: ...items[i + index], // ?
          children: this.resource.modal.children || []
        });

        const rowItems = rowField.export();

        // console.log(rowItems);

        grid.addRow(rowItems);


      }


    } else {

      // const columns = this.resource.children.slice(colIndex, colIndex + colLength);
      const columns = this.resource.children;

      for (let i = 0; i < Math.min(items.length - index, length); i++) {

        const item = items[i + index] || {loading: true};

        const rowField = this.createChild({
          type: "row",
          index: i + index,
          id: item.id,
          loading: item.loading,
          // item: items[i + index],
          children: columns
        });

        const rowItems = rowField.export();

        grid.addRow(rowItems);

      }

    }

    dataRow.push(grid.toString());

    return dataRow;

  }



  import(dataRow, index = 0, length = 999999, colIndex = 0, colLength = 999999) {

    const string = dataRow.shift();

    const [current] = this.export([], index, length, colIndex, colLength);

    if (string !== current) {

      const grid = new KarmaFieldsAlpha.Grid(string);
      // const ids = this.getIds();
      const items = this.getItems();

      // if (items.length < length) {
      if (grid.array.length < length) {

        this.remove(index + grid.array.length, length - grid.array.length);

      } else if (grid.array.length > length) {

        for (let i = 0; i < grid.array.length - length; i++) {

          this.add(index + length + i);

        }

      }

      if (this.resource.modal) {

        for (let i = 0; i < grid.array.length; i++) {

          const item = items[i + index] || {loading: true};

          const child = this.createChild({
            children: this.resource.modal.children || [],
            type: "row",
            index: i + index,
            id: item.id,
            loading: item.loading
            // item: items[i + index]
          });

          const rowItems = grid.getRow(i);

          child.import(rowItems);

        }

      } else {


        // const columns = this.resource.children.slice(colIndex, colIndex + colLength);
        const columns = this.resource.children;


        for (let i = 0; i < grid.array.length; i++) {

          const item = items[i + index] || {loading: true};

          const child = this.createChild({
            children: columns,
            type: "row",
            index: i + index,
            id: item.id,
            loading: item.loading
            // item: items[i + index]
          });

          const rowItems = grid.getRow(i);

          child.import(rowItems);

        }

      }

    }

  }

  getSelectionChild(selection) {

    if (selection) {

      if (selection.modal && !selection.modal.final) {

        return this.createChild({
          ...this.resource.modal,
          type: "modal",
          index: "modal",
        });

      }



      const items = this.getItems();

      for (let i in items) {

        if (selection[i]) {

          return this.createChild({
            id: item[i].id,
            type: "row",
            children: this.resource.children,
            loading: item[i].loading,
            index: i
          });

        }

      }



    }

  }

  follow(selection, callback) {

    if (selection.modal && !selection.modal.final) {

      const modal = this.createChild({
        ...this.resource.modal,
        type: "modal",
        index: "modal",
        // ids: this.getSelectedIds(selection)
      });

      return modal.follow(selection.modal, callback);

    } else if (selection.final || selection.modal && selection.modal.final) {

      return callback(this, selection);

    // } else if (selection.modal) {
    //
    //   const modal = this.createChild({
    //     ...this.resource.modal,
    //     type: "modal",
    //     index: "modal",
    //     ids: this.getSelectedIds(selection)
    //   });
    //
    //   return modal.follow(selection.modal, callback);

    } else { // -> paste into selected things inside a row (like files field)

      // const ids = this.getIds();
      const items = this.getItems();

      for (let i in items) {

        if (selection[i]) {

          const item = items[i];

          const child = this.createChild({
            id: item.id,
            type: "row",
            children: this.resource.children,
            loading: item.loading,
            // item: items[i],
            index: i
          });

          return child.follow(selection[i], callback);

        }

      }

    }

  }

  selectAll() {

    // const ids = this.getIds();
    const items = this.getItems();

    const selection = {
      ...this.getSelection(),
      index: 0,
      length: items.length
    };

    this.setSelection(selection);

  }

  copy(selection) {

    const child = this.getSelectionChild(selection);

    if (child) {

      return child.copy(selection[child.resource.index]);

    } else if (selection) {

      const [value] = this.export([], selection.index, selection.length, selection.colIndex, selection.colLength);

      return value;

    }

  }


  paste(value, selection) {

    // this.import([value], selection.index, selection.length, selection.colIndex, selection.colLength);

    const child = this.getSelectionChild(selection);

    if (child) {

      return child.paste(value, selection[child.resource.index]);

    } else if (selection) {

      this.import([value], selection.index, selection.length, selection.colIndex, selection.colLength);

    }

  }

  async add(params = {}, ...path) {


    const selection = this.getSelection() || {};

    const index = (selection.index || 0) + (selection.length || 0);

    const {page, ppp, orderby, order, ...defaultParams} = this.resource.params;

    params = {...defaultParams, ...params}; // default params are needed (e.g) for setting post-type


    //
    // KarmaFieldsAlpha.Query.add(this.resource.driver, index, addParams);

// debugger;
    KarmaFieldsAlpha.Query.add(this.resource.driver, params, index, ...path);

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

  // delete(selection) {
  //
  //   this.remove(selection.index || 0, selection.length || 0);
  //
  // }

  delete(selection = this.getSelection()) {

    const child = this.getSelectionChild(selection);

    if (child) {

      child.delete(selection[child.resource.index]);

    } else if (selection) {

      this.remove(selection.index || 0, selection.length || 0);

    }


  }

  remove(index, length) {



    // const ids = this.getIds().slice(index, index + length);
    const items = this.getItems().slice(index, index + length);

  //   this.removeIds(ids);
  //
  //
  // }
  //
  // removeIds(ids) {

    const ids = items.filter(item => item.id).map(item => item.id);

    if (ids) {

      for (let id of ids) {

        this.setValue("1", id, "trash");

      }

      const driver = this.getDriver();
      KarmaFieldsAlpha.Query.removeIds(driver, ids);

      this.setSelection({final: true, index: 0, length: 0});

      this.save("delete");
      this.render();

    }

  }


  duplicate(index, length = 1) {

    const items = this.export([], index, length);

    this.import(items, index + length, 0);

  }

  getSelection() {

    let selection = super.getSelection();

    if (selection && selection.values) {

      const items = this.getItems();

      if (items && items !== KarmaFieldsAlpha.loading) {

        const firstIndex = items.findIndex(item => item.id === selection.values[0]);
        const lastIndex = items.findIndex(item => item.id === selection.values[selection.values.length - 1]);

        if (firstIndex !== undefined) {

          selection = {
            index: firstIndex,
            length: lastIndex - firstIndex + 1
          };

          this.setSelection(selection);

        }

      }

    }

    return selection;

  }

  setSelection(selection) {

    if (selection) {

      if (selection.modal) {

        selection = {...this.getSelection(), ...selection};

      } else if (selection.length && this.resource.modal) {

        selection.modal = {final: true};

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

  /**
   * set selection to modal (not deeper), when modal background is clicked
   *
   * is extended by hierarchy
   */
  clearModalSelection() {

    const selection = this.getSelection();

    this.setSelection({index: selection.index || 0, length: selection.length || 0, final: true});

  }

  getSelectedIds(selection) {

    // const ids = this.getIds();
    //
    //
    // if (ids) {
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
    //     return ids.slice(index, index + length);
    //
    //   }
    //
    // }
    //
    // return [];

    return this.getSelectedItems().map(item => item.id); // -> compat
  }

  getSelectedItems(selection) {

    const items = this.getItems();


    if (items) {

      if (!selection) {

        selection = this.getSelection();

      }

      if (selection) {

        const index = selection.index || 0;
        const length = selection.length || 0;

        return items.slice(index, index + length);

      }

    }

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

    await this.parent.render();


    // -> todo: do this in copy event
    // const [string] = this.export([], selection.index, selection.length);
    //
    // KarmaFieldsAlpha.Clipboard.write(string);

    // KarmaFieldsAlpha.Clipboard.focus();

    this.deferFocus();

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

        // const ids = this.getIds();

        const items = this.getItems();
        const data = this.getData();

        grid.element.classList.toggle("loading", !items || items === KarmaFieldsAlpha.loading);



        if (items && items !== KarmaFieldsAlpha.loading) {

          const page = this.parent.request("getPage");
          const ppp = this.getPpp();
          const offset = (page - 1)*ppp;

          let selection = this.getSelection();

          const selector = new KarmaFieldsAlpha.Selector(grid.element);
          selector.colCount = this.resource.children.length;
          selector.rowCount = items.length;
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

          if (items.length) {
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
              ...items.reduce((children, item, rowIndex) => {

                const row = this.createChild({
                  id: item.id,
                  loading: item.loading,
                  type: "row",
                  children: this.resource.children || [],
                  index: offset + rowIndex,
                  rowIndex: offset + rowIndex
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


                        if (selection && selection.reveal && rowIndex === selection.index) {
                          const container = this.getScrollContainer();
                          if (container) {
                            container.scrollTop = td.element.offsetTop - 0;
                            selection.reveal = false;
                          }
                        }



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

  // export(items, ...args) {
  //
  //   return this.parent.export(items, ...args);
  //
  // }
  //
  // import(items, ...args) {
  //
  //   this.parent.import(items, ...args);
  //
  // }

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

      // items.forEach(item => void this.parent.setValue(value, items.id, key)); // -> multiple items / single value

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

    // const ids = this.parent.getSelectedIds();
    const items = this.request("getSelectedItems");

    return items && items.length > 1;
  }

  getIds() {

    const items = this.request("getSelectedItems");

    if (items.some(item => item.loading || !item.id || item.id === KarmaFieldsAlpha.loading)) {

      return KarmaFieldsAlpha.loading;

    }

    return items.filter(item => !item.loading && item.id).map(item => item.id);

  }

  getId() {

    const ids = this.getIds();

    if (ids === KarmaFieldsAlpha.loading) {

      return KarmaFieldsAlpha.loading;

    } else if (ids.length > 1) {

      return KarmaFieldsAlpha.mixed;

    } else {

      return ids[0];

    }

  }



  // getName() {
  //
  //   const ids = this.getIds();
  //
  //   if (ids === KarmaFieldsAlpha.mixed) {
  //
  //     return KarmaFieldsAlpha.mixed;
  //
  //   }
  //
  //   if (ids === KarmaFieldsAlpha.loading) {
  //
  //     return KarmaFieldsAlpha.loading;
  //
  //   }
  //
  //   const names = ids.map(id => this.parent.getName(id));
  //
  //   if (names.some(name => name === KarmaFieldsAlpha.loading)) {
  //
  //     return KarmaFieldsAlpha.loading;
  //
  //   }
  //
  //   if (names.some((name, index, array) => index > 0 && name !== array[0])) {
  //
  //     return KarmaFieldsAlpha.mixed;
  //
  //   }
  //
  //   return names[0];
  //
  // }
  //
  // getParent() {
  //
  //   const ids = this.getIds();
  //
  //   const values = ids.map(id => this.parent.getParent(id));
  //
  //   if (values.some(value => value === KarmaFieldsAlpha.loading)) {
  //
  //     return KarmaFieldsAlpha.loading;
  //
  //   }
  //
  //   if (values.some((value, index, array) => index > 0 && value !== array[0])) {
  //
  //     return KarmaFieldsAlpha.mixed;
  //
  //   }
  //
  //   return values[0];
  //
  // }
  //
  // getPosition() {
  //
  //   const ids = this.getIds();
  //
  //   const values = ids.map(id => this.parent.getPosition(id));
  //
  //   if (values.some(value => value === KarmaFieldsAlpha.loading)) {
  //
  //     return KarmaFieldsAlpha.loading;
  //
  //   }
  //
  //   if (values.some((value, index, array) => index > 0 && value !== array[0])) {
  //
  //     return KarmaFieldsAlpha.mixed;
  //
  //   }
  //
  //   return values[0];
  //
  // }

}



KarmaFieldsAlpha.field.grid.row = class extends KarmaFieldsAlpha.field {




  getValue(key) {

    if (this.resource.id !== undefined && !this.resource.loading) {

      if (key === "id") {

        return [this.resource.id];

      }

      return this.parent.getValue(this.resource.id, key);

    }

    // if  (this.resource.id !== null) { // -> id is null while being added
    //
    //   return this.parent.getValue(this.resource.id, key);
    //
    // }

  }

  setValue(value, key) {

    // if (this.resource.id !== null) { // -> id is null while being added. Should never happen.

    if (this.resource.id !== undefined && !this.resource.loading) {

      this.parent.setValue(value, this.resource.id, key);

    }

  }

  modified(key) {

    // if (this.resource.id !== null) { // -> id is null while being added. Should never happen.

    if (this.resource.id !== undefined && !this.resource.loading) {

      return this.parent.modified(this.resource.id, key);

    }

  }

  getIndex() {

    return this.resource.rowIndex || 0;

  }

  getId() {

    return this.resource.id;

  }

  // getName(...path) {
  //
  //   if (this.resource.id !== undefined && !this.resource.loading && this.resource.id !== KarmaFieldsAlpha.loading) {
  //
  //     return this.parent.getName(this.resource.id, ...path);
  //
  //   }
  //
  // }
  //
  // getParent(...path) {
  //
  //   if (this.resource.id !== undefined && !this.resource.loading && this.resource.id !== KarmaFieldsAlpha.loading) {
  //
  //     return this.parent.getParent(this.resource.id, ...path);
  //
  //   }
  //
  // }
  //
  // getPosition(...path) {
  //
  //   if (this.resource.id !== undefined && !this.resource.loading && this.resource.id !== KarmaFieldsAlpha.loading) {
  //
  //     return this.parent.getPosition(this.resource.id, ...path);
  //
  //   }
  //
  // }

  multiple() {
    // deprecated
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


// KarmaFieldsAlpha.field.grid.row.index = {
//   type: "text",
//   content: ["getIndex"],
//   width: "5em"
// };



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
