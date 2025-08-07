
KarmaFieldsAlpha.field.array = class extends KarmaFieldsAlpha.field {

  export() {

    const output = new KarmaFieldsAlpha.Content();

    if (this.resource.export !== false) {

      const grid = this.slice();

      if (grid.loading) {

        output.loading = true;

      } else if (grid.value && grid.value.length) {

        output.value = grid.toString();

        // return new KarmaFieldsAlpha.Content.Collection([grid.toString()]);

      } else {

        // return new KarmaFieldsAlpha.Content.Collection();

        output.value = "";

      }

    }


    return output;
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

        length.value = Math.max(length.value, value.toArray().length);

      }

    }

    return length;
  }


  slice(index = 0, length = Number.MAX_SAFE_INTEGER) { // return Content.Grid

    const grid = new KarmaFieldsAlpha.Content.Grid();

    const process = this.getLength();

    if (process.loading) {

      grid.loading = true;

    } else {

      length = Math.min(length, process.toNumber());

      for (let i = 0; i < length; i++) {

        const rowField = this.getChild(i + index);

        const collection = rowField.export();

        if (collection.loading) {

          grid.loading = true;

        } else {

          grid.value.push(collection.toArray());

        }

      }

    }

    return grid;
  }

  // getGrid() { // return Content.Grid
  //
  //   const grid = new KarmaFieldsAlpha.Content.Grid();
  //   const length = this.getLength();
  //
  //   if (length.complete) {
  //
  //     for (let i = 0; i < length.toNumber(); i++) {
  //
  //       const rowField = this.getChild(i);
  //
  //       const collection = rowField.export();
  //
  //       if (collection.complete) {
  //
  //         grid.value.push(collection);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   return grid;
  // }

  // setGrid(grid) {
  //
  //   const array  = grid.toArray();
  //
  //   const currentGrid = this.getGrid();
  //
  //   if (currentGrid.loading) {
  //
  //     KarmaFieldsAlpha.Store.Tasks.add({
  //       type: "setGrid",
  //       resolve: () => this.setGrid(grid)
  //     });
  //
  //   } else {
  //
  //     for (let i = 0; i < array.length; i++) {
  //
  //       const rowField = this.createChild({
  //         type: "row",
  //         children: this.resource.children
  //       }, i);
  //
  //       const rowCollection = new KarmaFieldsAlpha.Content.Collection(array[i]);
  //
  //       rowField.import(rowCollection);
  //
  //     }
  //
  //     if (currentGrid.toArray().length > array.length) {
  //
  //       this.removeRows(array.length, currentGrid.toArray().length - array.length);
  //
  //     }
  //
  //   }
  //
  // }

  // setGrid(grid, index = 0, length = 0) {
  //   this.import(grid, index, length);
  // }

  setGrid(grid, index = 0, length = Number.MAX_SAFE_INTEGER) {

    this.insert(grid, index, length);


    // const process = this.getLength();
    //
    // if (process.loading) {
    //
    //   // KarmaFieldsAlpha.Store.Tasks.add({
    //   //   type: "setGrid",
    //   //   resolve: () => this.setGrid(grid)
    //   // });
    //
    //   this.createTask("setGrid", grid, index, length);
    //
    // } else {
    //
    //   const array  = grid.toArray();
    //
    //   const rowField = this.getChild(index);
    //
    //   rowField.create();
    //
    //
    //   if (length < array.length) {
    //
    //     for (let i = 0; i < array.length; i++) {
    //
    //
    //     }
    //
    //   }
    //
    //   for (let i = 0; i < array.length; i++) {
    //
    //     const rowField = this.createChild({
    //       type: "row",
    //       children: this.resource.children
    //     }, i);
    //
    //     const rowCollection = new KarmaFieldsAlpha.Content.Collection(array[i]);
    //
    //     rowField.import(rowCollection);
    //
    //   }
    //
    //   if (length > array.length) {
    //
    //     this.removeRows(index + array.length, length - array.length);
    //
    //   }
    //
    //   // if (currentGrid.toArray().length > array.length) {
    //   //
    //   //   this.removeRows(array.length, currentGrid.toArray().length - array.length);
    //   //
    //   // }
    //
    // }

  }

  getCell(index, key) {

    const cellContent = new KarmaFieldsAlpha.Content();
    const arrayKey = this.getKey();

    if (arrayKey) {

      const content = this.parent.getContent(arrayKey);

      if (content.loading) {

        cellContent.loading = true;

      } else {

        const array = content.toArray();

        if (index < array.length) {

          cellContent.value = array[index] && array[index][key];

        } else {

          cellContent.notFound = true;

        }

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

    }

    return cellContent;
  }

  setCell(cell, index, key) {

    const arrayKey = this.getKey();

    if (arrayKey) {

      let content = this.getContent(arrayKey);

      if (!content.loading) {

        const clone = new KarmaFieldsAlpha.Content();

        clone.value = KarmaFieldsAlpha.DeepObject.clone(content.toArray());

        // clone.value[index] = {...clone.value[index]};

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

        // KarmaFieldsAlpha.Store.Tasks.add({
        //   type: "removeCell",
        //   resolve: () => this.removeCell(index, key)
        // });

        this.createTask("removeCell", index, key);

      } else {

        const clone = new KarmaFieldsAlpha.Content([...content.value]);

        delete clone.value[index][key];

        this.setContent(clone, arrayKey);

      }

    } else {

      let content = this.getContent(key);

      if (!content.loading) {

        const clone = new KarmaFieldsAlpha.Content([...content.value]);

        clone.value.splice(index, 1);

        this.setContent(clone, key);

      }

    }

  }

  removeRows(index, length = 1) {

    const keys = this.getKeys();

    const contents = keys.map(key => this.getContent(key));

    if (contents.some(content => content.loading)) {

      this.createTask("removeRows", index, length);

    } else {

      for (let j in contents) {

        const content = contents[j];
        const key = keys[j];

        const newContent = new KarmaFieldsAlpha.Content([...content.toArray()]);

        newContent.value.splice(index, length);

        this.parent.setContent(newContent, key);

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

  // swap(index, target, length) {
  //
  //   let grid = this.getGrid();
  //
  //   if (!grid.loading) {
  //
  //     grid.value.splice(target, 0, ...grid.value.splice(index, length));
  //
  //     this.setGrid(grid);
  //
  //   }
  //
  // }

  swap(index, target, length) {

    const keys = this.getKeys();

    const contents = keys.map(key => this.getContent(key));

    if (contents.some(content => content.loading)) {

      this.createTask("swap", index, target, length);

    } else {

      for (let j in contents) {

        const content = contents[j];
        const key = keys[j];

        const newContent = new KarmaFieldsAlpha.Content([...content.toArray()]);

        newContent.value.splice(target, 0, ...newContent.value.splice(index, length));

        this.parent.setContent(newContent, key);

      }

    }

  }



  add(length = 1) {

    // let extra = KarmaFieldsAlpha.Store.get("fields", ...this.path, "extra") || 0;
    //
    // extra++;
    //
    // KarmaFieldsAlpha.Store.set(extra, "fields", ...this.path, "extra");

    const process = this.getLength();

    if (process.loading) {

      this.createTask("add", length);

    } else {

      let index;

      if (this.resource.addAt !== undefined) {

        index = parseInt(this.resource.addAt);

      } else {

        index = process.toNumber();

      }

      this.save("add", "Insert");

      this.addAt(index, 1)

      this.setFocus(true);
      this.setSelection({index, length});

      this.request("render");

    }

  }

  addAfter() {

    const length = this.getLength();

    if (length.loading) {

      this.createTask("add");

    } else {

      const index = length.toNumber();

      this.save("add", "Insert");

      const rowField = this.getChild(index);

      rowField.create();

      this.setSelection({index, length: 1});

      this.request("render");

    }

  }

  addAt(index, length) {

    const keys = this.getKeys();
    const contents = keys.map(key => this.parent.getContent(key));

    if (contents.some(content => content.loading)) {

      this.createTask("addAt", index, length);

    } else {

      for (let j in contents) {

        const content = contents[j];
        const key = keys[j];

        const newContent = new KarmaFieldsAlpha.Content([...content.toArray()]);

        // for (let i = 0; i < length; i++) {
        //
        //   newContent.value.splice(index, length, null);
        //
        // }

        newContent.value.splice(index, 0, ...Array(length));

        this.parent.setContent(newContent, key);

      }

      for (let i = 0; i < length; i++) {

        const rowField = this.getChild(i + index);

        rowField.create();

      }

    }

  }

  insert(grid, index, length) {

    const keys = this.getKeys();

    const contents = keys.map(key => this.parent.getContent(key));

    if (contents.some(content => content.loading)) {

      this.createTask("insert", grid, index, length);

    } else {

      const array = grid.toArray();

      for (let j in contents) {

        const content = contents[j];
        const key = keys[j];

        if (length !== array.length) {

          const newContent = new KarmaFieldsAlpha.Content([...content.toArray()]);

          if (length < array.length) {

            for (let i = 0; i < array.length - length; i++) {

              newContent.value.splice(index, length, null);

              this.parent.setContent(newContent, key);

            }

          } else if (length > array.length) {

            newContent.value.splice(index + array.length, length - array.length);

          }

          this.parent.setContent(newContent, key);

        }

      }

      for (let i = 0; i < array.length; i++) {

        const rowField = this.createChild({
          type: "row",
          children: this.resource.children
        }, i + index);

        const rowCollection = new KarmaFieldsAlpha.Content.Collection(array[i]);

        rowField.import(rowCollection);

      }

    }

  }

  // removeRows(index, length = 1) {
  //
  //   const arrayKey = this.getKey();
  //
  //   if (arrayKey) {
  //
  //     let content = this.getContent(arrayKey);
  //
  //     if (!content.loading) {
  //
  //       const clone = content.clone();
  //
  //       clone.value.splice(index, length);
  //
  //       this.setContent(clone, arrayKey);
  //
  //     }
  //
  //   } else {
  //
  //     for (let i = 0; i < length; i++) {
  //
  //       const rowField = this.createChild({
  //         type: "row",
  //         children: this.resource.children
  //       }, i + index);
  //
  //       rowField.destroy();
  //
  //     }
  //
  //   }
  //
  // }


  remove(index = 0, length = 1) {

    this.save("remove", "Remove");

    this.removeRows(index, length);

    this.removeSelection();

    this.request("render");

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

      const grid = new KarmaFieldsAlpha.Content.Grid(value);
      // const pasteData = grid.toArray();

      const index = selection.index || 0;
      const length = selection.length || 0;

      // this.import(grid, index, length);

      this.save("paste", "Paste");

      this.insert(grid, index, length);

      // const grid = this.getGrid();
      //
      // grid.value.splice(index, length, pasteData);
      //
      // this.setGrid(grid);

      this.setSelection({index, length: grid.toArray().length});

    }

    this.setFocus(true);

    this.request("render");

  }

  copy() {

    const selection = this.getSelection();

    if (selection) {

      const index = selection.index || 0;
      const length = selection.length || 0;

      const grid = this.slice(index, length);
      // grid.value = grid.value.slice(index, index + length);

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

        array.element.onmousedown = event => {
          event.stopPropagation();
          // if (this.getSelection("length")) {
          //   this.setSelection({index: 0, length: 0});
          // }
          // if (!this.hasFocus()) {
          //   this.setFocus(true);
          //   this.request("render");
          // }

          if (this.getSelection("length") || !this.hasFocus()) {
            this.setSelection({index: 0, length: 0});
            this.setFocus(true);
            this.request("render");
          }
        }

        array.element.classList.toggle("active", Boolean(this.hasFocus()));

        // this.renderSelf = array.render;

        const length = this.getLength();

        const mixed = length.mixed;

        array.children = [
          {
            class: "array-body",
            update: table => {

              table.element.classList.toggle("hidden", Boolean(length.mixed));
              table.element.classList.toggle("loading", Boolean(length.loading));


              if (!length.mixed) {

                // let length = content.value.length;

                // debugger;

                // let extra = KarmaFieldsAlpha.Store.get("fields", ...this.path, "extra");
                //
                // if (extra) {
                //
                //   length += extra
                //
                //   KarmaFieldsAlpha.Store.set(0, "fields", ...this.path, "extra");
                //
                // }

                table.element.classList.toggle("empty", length.toNumber() === 0);

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

                if (length.toNumber() && hasHeader) {

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

                for (let i = 0; i < length.toNumber(); i++) {

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
              if (!length.loading && !length.mixed) {
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
              if (length.mixed) {
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
