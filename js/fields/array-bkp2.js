
KarmaFieldsAlpha.field.array = class extends KarmaFieldsAlpha.field {

  export() {

    const grid = this.getGrid();

    if (grid.loading) {

      return new KarmaFieldsAlpha.Content.Request();

    } else if (grid.value && grid.value.length) {

      return new KarmaFieldsAlpha.Content.Collection([grid.toString()]);

    } else {

      return new KarmaFieldsAlpha.Content.Collection();

    }

  }

  import(collection) {

    const string = collection.value.shift();

    const grid = new KarmaFieldsAlpha.Content.Grid(string);

    this.setGrid(grid);

  }

  // getGrid() { // return Content.Grid
  //
  //   const grid = new KarmaFieldsAlpha.Content.Grid();
  //
  //   let index = 0;
  //
  //   let rowField = this.getChild(index);
  //
  //   let rowCollection = rowField.export();
  //
  //   let c = 0;
  //
  //   while (!rowCollection.loading && rowCollection.value.length > 0) {
  //
  //     if (c > 1000) {
  //
  //       debugger;
  //
  //     }
  //
  //     c++;
  //
  //     // if (rowCollection.loading) {
  //     //
  //     //   grid.loading = true;
  //     //   break;
  //     //
  //     // }
  //     //
  //     // grid.value.push(row);
  //
  //     grid.add(rowCollection);
  //
  //     index++;
  //
  //     rowField = this.getChild(index);
  //
  //     rowCollection = rowField.export();
  //
  //   }
  //
  //   return grid;
  //
  // }

  getLength() {

    const keys = this.getKeys();

    const length = new KarmaFieldsAlpha.Content(0);

    for (let key of keys) {

      const value = this.parent.getContent(key);

      if (value.loading) {

        length.loading = true;

      } else {

        length = Math.max(length.value, value.toArray().length);

      }

    }

    return length;
  }

  getGrid() { // return Content.Grid

    const grid = new KarmaFieldsAlpha.Content.Grid();

    let index = 0;

    let rowField = this.getChild(index);

    let rowCollection = rowField.export();

    let c = 0;

    while (!rowCollection.loading && rowCollection.value.length > 0) {

      if (c > 1000) {

        debugger;

      }

      c++;

      // if (rowCollection.loading) {
      //
      //   grid.loading = true;
      //   break;
      //
      // }
      //
      // grid.value.push(row);

      grid.add(rowCollection);

      index++;

      rowField = this.getChild(index);

      rowCollection = rowField.export();

    }

    return grid;

  }

  setGrid(grid) {

    const array  = grid.toArray();

    const currentGrid = this.getGrid();

    if (currentGrid.loading) {

      KarmaFieldsAlpha.Store.Tasks.add({
        type: "setGrid",
        resolve: () => this.setGrid(grid)
      });

    } else {

      for (let i = 0; i < array.length; i++) {

        const rowField = this.createChild({
          type: "row",
          children: this.resource.children
        }, i);

        const rowCollection = new KarmaFieldsAlpha.Content.Collection(array[i]);

        rowField.import(rowCollection);

      }

      if (currentGrid.toArray().length > array.length) {

        this.removeRows(array.length, currentGrid.toArray().length - array.length);

      }

    }

  }

  getCell(index, key) {

    const cellContent = new KarmaFieldsAlpha.Content();
    const arrayKey = this.getKey();

    if (arrayKey) {

      const content = this.getContent(arrayKey);

      if (content.loading) {

        cellContent.loading = true;

      } else {

        const array = content.toArray();

        if (index < array.length) {

          cellContent.value = array[index] && array[index][key];

        } else {

          cellContent.notFound = true;

        }
        // const row = array[index];
        // const value = row && row[key];
        //
        // return new KarmaFieldsAlpha.Content(value, {notFound: value === undefined});

      }

    } else {

      const content = this.parent.getContent(key);

      if (content.loading) {

        cellContent.loading = true;

      } else {

        const array = content.toArray();

        if (index < array.length) {

          cellContent.value = array[index];

        } else {

          cellContent.notFound = true;

        }

      }




      // if (content.loading) {
      //
      //   return new KarmaFieldsAlpha.Content.Request();
      //
      // } else {
      //
      //   const array = content.toArray();
      //
      //   return new KarmaFieldsAlpha.Content(array[index], {notFound: array[index] === undefined});
      //
      // }

    }

    return cellContent;
  }

  setCell(cell, index, key) {

    const arrayKey = this.getKey();

    if (arrayKey) {

      let content = this.getContent(arrayKey);

      if (!content.loading) {

        // const clone = content.clone();
        const clone = new KarmaFieldsAlpha.Content([...content.value]);

        if (!clone.value[index]) {

          clone.value[index] = {};

        }

        clone.value[index][key] = cell.value; //cell.toSingle();

        this.setContent(clone, arrayKey);

      }

    } else {

      let content = this.getContent(key);

      if (!content.loading) {

        // const clone = content.clone();
        const clone = new KarmaFieldsAlpha.Content([...content.value]);

        clone.value[index] = cell.toSingle();

        this.setContent(clone, key);

      }

    }

  }

  removeCell(index, key) {

    const arrayKey = this.getKey();

    if (arrayKey) {

      let content = this.getContent(arrayKey);

      if (content.loading) {

        KarmaFieldsAlpha.Store.Tasks.add({
          type: "removeCell",
          resolve: () => this.removeCell(index, key)
        });

      } else {

        // const clone = content.clone();
        const clone = new KarmaFieldsAlpha.Content([...content.value]);

        // clone[index] = {...clone[index]};

        delete clone.value[index][key];

        this.setContent(clone, arrayKey);

      }

    } else {

      let content = this.getContent(key);

      if (!content.loading) {

        // const clone = content.clone();
        const clone = new KarmaFieldsAlpha.Content([...content.value]);

        clone.value.splice(index, 1);

        this.setContent(clone, key);

      }

    }

  }


  getChild(index) {

    const child = this.createChild({
      children: this.resource.children,
      type: "row"
    }, index);

    return child;

  }

  swap(index, target, length) {

    let grid = this.getGrid();

    if (!grid.loading) {

      grid.value.splice(target, 0, ...grid.value.splice(index, length));

      this.setGrid(grid);

    }

  }

  add() {

    let extra = KarmaFieldsAlpha.Store.get("fields", ...this.path, "extra") || 0;

    extra++;

    KarmaFieldsAlpha.Store.set(extra, "fields", ...this.path, "extra");

    KarmaFieldsAlpha.History.save("add", "Insert");

    this.request("render");

  }

  removeRows(index, length = 1) {

    const arrayKey = this.getKey();

    if (arrayKey) {

      let content = this.getContent(arrayKey);

      if (!content.loading) {

        const clone = content.clone();

        clone.value.splice(index, length);

        this.setContent(clone, arrayKey);

      }

    } else {

      for (let i = 0; i < length; i++) {

        const rowField = this.createChild({
          type: "row",
          children: this.resource.children
        }, i + index);

        rowField.destroy();

      }

    }

  }


  remove(index = 0, length = 1) {

    const grid = this.getGrid();

    if (length && !grid.loading) {

      KarmaFieldsAlpha.History.save("remove");

      this.removeRows(index, length);

      this.removeSelection();

      this.request("render");

    }

  }


  delete() {

    const selection = this.getSelection();

    if (selection && selection.length) {

      this.remove(selection.index || 0, selection.length || 0);

    }

  }

  paste(value) {

    const selection = this.getSelection();

    if (selection) {

      const pasteData = new KarmaFieldsAlpha.Content.Grid(value).toArray();

      const index = selection.index || 0;
      const length = selection.length || 0;

      const grid = this.getGrid();

      grid.value.splice(index, length, pasteData);

      this.setGrid(grid);

      this.setSelection({index, length: pasteData.length});

    }

    this.setFocus(true);

    this.request("render");

  }

  copy() {

    const selection = this.getSelection();

    if (selection) {

      const index = selection.index || 0;
      const length = selection.length || 0;

      const grid = this.getGrid();
      grid.value = grid.value.slice(index, index + length);

      return grid.toString();

    }

  }

  sortUp(index, length = 1) {

    if (index > 0) {

      KarmaFieldsAlpha.History.save("sort", "Sort");

      this.swap(index, length, index-1);

      this.setFocus(true);

      this.request("render");
    }

  }

  sortDown(index, length = 1) {

    if (index + length < this.getValue().length) {

      KarmaFieldsAlpha.History.save("sort", "Sort");

      this.swap(index, length, index+1);

      this.setFocus(true);

      this.request("render");
    }

  }


  build() {
    return {
      class: "array",
      update: array => {

        // this.renderSelf = array.render;

        const content = this.getGrid();

        const mixed = content.mixed;

        array.children = [
          {
            class: "array-body",
            update: table => {

              table.element.classList.toggle("hidden", Boolean(content.mixed));
              table.element.classList.toggle("loading", Boolean(content.loading));
              table.element.classList.toggle("active", Boolean(this.hasFocus()));

              if (!content.mixed) {

                let length = content.value.length;

                // debugger;

                let extra = KarmaFieldsAlpha.Store.get("fields", ...this.path, "extra");

                if (extra) {

                  length += extra

                  KarmaFieldsAlpha.Store.set(0, "fields", ...this.path, "extra");

                }

                table.element.classList.toggle("empty", length === 0);

                const hasHeader = this.resource.children.some(column => column.header || column.label); // header is deprecated

                let selection = this.getSelection();

                const sorter = new KarmaFieldsAlpha.ListSortGrid(table.element, selection, this.resource.children.length, hasHeader ? 1 : 0);

                sorter.onSelect = elements => {

                  elements.map(element => element.classList.add("selected"));

                  this.setSelection(sorter.state.selection);

                }

                sorter.onUnselect = elements => {

                  elements.map(element => element.classList.remove("selected"));

                }

                sorter.onSelectionComplete = () => {

                  // this.request("deferFocus");
                  this.setFocus(1);
                  this.request("render");

                }

                sorter.onSwap = (newState, lastState) => {

                  this.save("sort", "Sort");
                  this.swap(lastState.selection.index, newState.selection.index, newState.selection.length);
                  this.setSelection(newState.selection);

                };

                sorter.onSort = (index, target, length) => {

                  this.setFocus(1);
                  this.request("render");

                }

                table.children = [];

                if (length && hasHeader) {

                  // for (let column of this.resource.children) {
                  for (let i = 0; i < this.resource.children.length; i++) {

                    const column = this.resource.children[i];

                    table.children.push({
                      class: "th",
                      init: th => {
                        th.element.textContent = column.header || column.label || "";
                      // },
                      // update: th => {
                        th.element.classList.toggle("first-cell", i === 0);
                        th.element.classList.toggle("last-cell", i === this.resource.children.length - 1);
                      }
                    });

                  }

                }

                for (let i = 0; i < length; i++) {

                  const row = this.createChild({
                    children: this.resource.children,
                    index: i,
                    id: i.toString(),
                    type: "row"
                  }, i);

                  for (let j = 0; j < this.resource.children.length; j++) {

                    const field = row.createChild(this.resource.children[j], j);

                    table.children.push({
                      class: "td array-cell karma-field-frame",
                      init: td => {
                        if (field.resource.style) {
                          td.element.style = field.resource.style;
                        }
                        if (field.resource.classes) {
                          td.element.classList.add(...field.resource.classes);
                        }
                      },
                      update: td => {
                        const isSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, i) && this.hasFocus();
                        td.element.classList.toggle("selected", Boolean(isSelected));
                        td.element.classList.toggle("odd", i%2 === 0);
                        td.element.classList.toggle("first-cell", j === 0);
                        td.element.classList.toggle("last-cell", j === this.resource.children.length - 1);
                        td.child = field.build();
                      }
                    });

                  }

                }

                table.element.style.gridTemplateColumns = this.resource.children.map(resource => resource.width || "auto").join(" ");

              }

            }
          },
          {
            class: "array-footer",
            update: node => {
              node.element.classList.toggle("hidden", Boolean(mixed));
              if (!content.loading && !content.mixed) {
                node.children = [{
                  class: "array-footer-content simple-buttons",
                  update: footer => {
                    if (this.resource.footer !== false) {
                      footer.child = this.createChild({
                        type: "footer",
                        ...this.resource.footer,
                        index: "footer"
                      }, "footer").build();
                    }
                  }
                }];
              } else {
                node.children = [];
              }
            }
          },
          {
            class: "mixed",
            update: node => {
              node.element.classList.toggle("hidden", !mixed);
              if (content.mixed) {
                node.children = [
                  this.createChild({
                    type: "textarea",
                    // key: "mixed",
                    index: "mixed"
                  }, "mixed").build()
                ];
              } else {
                node.children = [];
              }
            }
          }
        ];
      }
    };
  }

}

KarmaFieldsAlpha.field.array.footer = class extends KarmaFieldsAlpha.field.group {

  constructor(resource) {

    super({
      display: "flex",
      children: [
        "add"
      ],
      ...resource
    });

  }

}

// KarmaFieldsAlpha.field.array.footer.add = {
//   type: "button",
//   id: "add",
//   action: "add",
//   // dashicon: "insert",
//   text: "Add row"
// };

KarmaFieldsAlpha.field.array.footer.add = class extends KarmaFieldsAlpha.field.button {

  constructor(resource) {

    super({
      id: "add",
      action: "add",
      text: "Add row",
      ...resource
    })

  }
};


KarmaFieldsAlpha.field.array.row = class extends KarmaFieldsAlpha.field {

  getContent(key) {

    const index = this.getIndex();

    return this.request("getCell", index, key);

  }

  setContent(content, key) {

    const index = this.getIndex();

    this.request("setCell", content, index, key);

  }

  removeContent(key) {

    const index = this.getIndex();

    this.request("removeCell", index, key);


  }

  getIndex() {

    // return this.resource.index;

    return this.id;

  }

  deleteRow() { // -> button action

    const index = this.getIndex();

    this.request("remove", index, 1);

  }

}



KarmaFieldsAlpha.field.array.row.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      action: "deleteRow",
      // value: ["index"],
      title: "Delete",
      dashicon: "remove",
      classes: ["array-delete", "simple-buttons"],
      width: "auto",
      ...resource
    });
  }
};

KarmaFieldsAlpha.field.array.row.sortArrows = class extends KarmaFieldsAlpha.field.group {
  constructor(resource) {
    super({
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
          disabled: [">=", ["+", ["getIndex"], 1], ["length", ["getValue"]]],
          dashicon: "arrow-down-alt2",
          class: "array-sort-up",
          width: "auto"
        }
      ]
    });
  }
};

KarmaFieldsAlpha.field.array.index = class extends KarmaFieldsAlpha.field.text {

  constructor(resource) {

    super({
      type: "text",
      value: ["+", ["request", "getIndex"], 1],
      width: "auto",
      ...resource
    });

  }

}
