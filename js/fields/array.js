
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

  async import(collection) {

    const string = collection.value.shift();

    const grid = new KarmaFieldsAlpha.Content.Grid(string);

    await this.setGrid(grid);

  }

  getGrid() { // return Content.Grid

    const grid = new KarmaFieldsAlpha.Content.Grid();

    let index = 0;

    let rowField = this.getChild(index);

    let rowCollection = rowField.export();

    while (!rowCollection.loading && rowCollection.value.length > 0) {

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

  async setGrid(grid) {

    const array  = grid.toArray();

    const currentGrid = this.getGrid();

    if (currentGrid.loading) {

      KarmaFieldsAlpha.Store.Tasks.add({
        type: "setGrid",
        resolve: async () => this.setGrid(grid)
      });

    } else {

      for (let i = 0; i < array.length; i++) {

        const rowField = this.createChild({
          type: "row",
          children: this.resource.children
        }, i);

        const rowCollection = new KarmaFieldsAlpha.Content.Collection(array[i]);

        await rowField.import(rowCollection);

      }

      if (currentGrid.toArray().length > array.length) {

        await this.removeRows(array.length, currentGrid.toArray().length - array.length);

      }

    }







  }



  // async setGrid(grid) {
  //
  //   const array = grid.toArray();
  //
  //   const currentGrid = this.getGrid();
  //
  //   if (!currentGrid.loading) {
  //
  //     const currentArray = currentGrid.toArray();
  //
  //     for (let i = 0; i < currentArray.length; i++) {
  //
  //       if ()
  //
  //       const rowField = this.createChild({
  //         type: "row",
  //         children: this.resource.children
  //       }, i);
  //
  //       const rowCollection = new KarmaFieldsAlpha.Content.Collection(array[i]);
  //
  //       await rowField.import(rowCollection);
  //
  //     }
  //
  //   }
  //
  //
  //
  // }


  getCell(index, key) {

    const arrayKey = this.getKey();

    if (arrayKey) {

      const content = this.getContent(arrayKey);

      if (content.loading) {

        return new KarmaFieldsAlpha.Content.Request();

      } else {

        const array = content.toArray();
        const row = array[index];
        const value = row && row[key];

        return new KarmaFieldsAlpha.Content(value, {notFound: value === undefined});

      }

    } else {

      const content = this.getContent(key);

      if (content.loading) {

        return new KarmaFieldsAlpha.Content.Request();

      } else {

        const array = content.toArray();

        return new KarmaFieldsAlpha.Content(array[index], {notFound: array[index] === undefined});

      }

    }

  }

  async setCell(cell, index, key) {

    const arrayKey = this.getKey();

    if (arrayKey) {

      let content = this.getContent(arrayKey);

      if (!content.loading) {

        // const array = [...content.toArray()];
        //
        // if (!array[index]) {
        //
        //   array[index] = {};
        //
        // }
        //
        // array[index][key] = cell.value; //cell.toSingle();
        //
        // content = new KarmaFieldsAlpha.Content(array);
        //
        // await this.setContent(content, arrayKey);

        const clone = content.clone();

        if (!clone.value[index]) {

          clone.value[index] = {};

        }

        clone.value[index][key] = cell.value; //cell.toSingle();

        await this.setContent(clone, arrayKey);

      }

    } else {

      let content = this.getContent(key);

      if (!content.loading) {

        // const array = [...content.toArray()];
        //
        // array[index] = cell.toSingle();
        //
        // content = new KarmaFieldsAlpha.Content(array);
        //
        // await this.setContent(content, key);

        const clone = content.clone();

        clone.value[index] = cell.toSingle();

        await this.setContent(clone, key);

      }

    }

  }

  async removeCell(index, key) {

    const arrayKey = this.getKey();

    if (arrayKey) {

      let content = this.getContent(arrayKey);

      if (content.loading) {

        KarmaFieldsAlpha.Store.Tasks.add({
          type: "removeCell",
          resolve: async () => this.removeCell(index, key)
        });

      } else {

        const clone = content.clone();

        clone[index] = {...clone[index]};

        delete clone[index][key];

        await this.setContent(clone, arrayKey);

      }

    } else {

      let content = this.getContent(key);

      if (!content.loading) {

        const clone = content.clone();

        clone.value.splice(index, 1);

        await this.setContent(clone, key);

      }

    }

  }





  // getDefault() {
  //
  //   if (this.resource.default) {
  //
  //     return this.parse(this.resource.default);
  //
  //   }
  //
  // }

  getChild(index) {

    const child = this.createChild({
      children: this.resource.children,
      type: "row"
    }, index);

    return child;

  }

  async swap(index, target, length) {

    let grid = this.getGrid();

    if (!grid.loading) {

      grid.value.splice(target, 0, ...grid.value.splice(index, length));

      await this.setGrid(grid);

    }

  }

  async add() {

    let extra = KarmaFieldsAlpha.Store.get("fields", ...this.path, "extra") || 0;

    extra++;

    KarmaFieldsAlpha.Store.set(extra, "fields", ...this.path, "extra");

    await KarmaFieldsAlpha.History.save("add", "Insert");

    await this.request("render");

  }

  async removeRows(index, length = 1) {

    const arrayKey = this.getKey();

    if (arrayKey) {

      let content = this.getContent(arrayKey);

      if (!content.loading) {

        const clone = content.clone();

        clone.value.splice(index, length);

        await this.setContent(clone, arrayKey);

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


  async remove(index = 0, length = 1) {

    const grid = this.getGrid();

    if (length && !grid.loading) {

      await KarmaFieldsAlpha.History.save("remove");

      // grid.value.splice(index, length);
      //
      // await this.setGrid(grid);

      await this.removeRows(index, length);

      this.removeSelection();

      this.request("render");

    }

  }


  async delete() {

    const selection = this.getSelection();

    if (selection && selection.length) {

      // await KarmaFieldsAlpha.History.save("remove");

      await this.remove(selection.index || 0, selection.length || 0);

      // this.removeSelection();
      //
      // await this.request("render");

    }

  }

  async paste(value) {

    const selection = this.getSelection();

    if (selection) {

      const pasteData = new KarmaFieldsAlpha.Content.Grid(value).toArray();

      const index = selection.index || 0;
      const length = selection.length || 0;

      const grid = this.getGrid();

      grid.value.splice(index, length, pasteData);

      await this.setGrid(grid);

      this.setSelection({index, length: pasteData.length});

    }

    await this.setFocus(true);

    await this.request("render");

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

  async sortUp(index, length = 1) {

    if (index > 0) {

      await KarmaFieldsAlpha.History.save("sort", "Sort");

      await this.swap(index, length, index-1);

      await this.setFocus(true);

      this.setSelection({index: index-1, length: length});

      await this.request("render");
    }

  }

  async sortDown(index, length = 1) {

    if (index + length < this.getValue().length) {

      await KarmaFieldsAlpha.History.save("sort", "Sort");

      await this.swap(index, length, index+1);

      await this.setFocus(true);

      this.setSelection({index: index-1, length: length});

      await this.request("render");
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

                sorter.onSelectionComplete = async () => {

                  // this.request("deferFocus");
                  await this.setFocus(1);
                  await this.request("render");

                }

                sorter.onSwap = async (newState, lastState) => {

                  await this.save("sort", "Sort");
                  await this.swap(lastState.selection.index, newState.selection.index, newState.selection.length);
                  this.setSelection(newState.selection);

                };

                sorter.onSort = async (index, target, length) => {

                  // KarmaFieldsAlpha.History.save("order");
                  // await this.request("deferFocus");
                  await this.setFocus(1);
                  await this.request("render");

                }

                table.children = [];

                if (length && hasHeader) {

                  for (let column of this.resource.children) {

                    table.children.push({
                      class: "th",
                      init: th => {
                        th.element.textContent = column.header || column.label || "";
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

                    // const field = row.createChild({
                    //   // id: j,
                    //   ...this.resource.children[j],
                    //   width: "100%",
                    //   // index: j
                    // }, j);

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

  async setContent(content, key) {

    const index = this.getIndex();

    await this.request("setCell", content, index, key);

  }

  async removeContent(key) {

    const index = this.getIndex();

    await this.request("removeCell", index, key);


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



// KarmaFieldsAlpha.field.array.row.delete = {
//   type: "button",
//   action: "delete",
//   value: ["index"],
//   title: "Delete",
//   dashicon: "no-alt",
//   class: "array-delete",
//   width: "auto"
// };

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
