
KarmaFieldsAlpha.field.array = class extends KarmaFieldsAlpha.field {

  // constructor(resource) {
  //   super(resource);
  //
  //   // compat
  //   if (this.resource.add_button_name) {
  //     this.resource.footer = {
  //       children: [
  //         {
  //           type: "add",
  //           title: this.resource.add_button_name
  //         }
  //       ]
  //     }
  //   }
  //
	// }

  export(collection = new KarmaFieldsAlpha.Content.Collection(), index = 0, length = 999999, colIndex = 0, colLength = 999999) {

    const content = this.getContent();

    if (!content.loading) {

      if (content.mixed) {

        return collection;

      }

      const grid = new KarmaFieldsAlpha.Content.Grid();

      const columns = this.resource.children.slice(colIndex, colIndex + colLength);

      for (let i = 0; i < Math.min(values.length - index, length); i++) {

        const rowField = this.createChild({
          type: "row",
          index: i + index,
          children: columns
        }, i + index);

        const rowCollection = new KarmaFieldsAlpha.Content.Collection();

        rowField.export(rowCollection);

        grid.add(rowCollection);

        // const rowItems = rowField.export();
        //
        // grid.addRow(rowItems);

      }

      collection.add(grid);

      // items.push(grid.toString());

    }

    return collection;

  }

  import(collection, index = 0, length = 999999, colIndex = 0, colLength = 999999) {

    const content = collection.pick();

    if (content) {

      const grid = new KarmaFieldsAlpha.Grid(content.toString());

      const columns = this.resource.children.slice(colIndex, colIndex + colLength);

      const originContent = this.getContent();
      const values = [...originContent.toArray()];
      values.splice(index, length, ...grid.toArray.map(() => this.getDefault()));

      const newContent = new KarmaFieldsAlpha.Content(values);

      this.setContent(newContent);

      for (let i = 0; i < grid.value.length; i++) {

        const child = this.createChild({
          children: columns,
          type: "row",
          index: i + index
        }, i + index);

        const rowItems = new KarmaFieldsAlpha.Content.Collection(grid.value[i]);

        child.import(rowItems);

      }

    }

  }


  getDefault() {

    if (this.resource.default) {

      return this.parse(this.resource.default);

    }

  }

  // follow(selection, callback) {
  //
  //   if (selection.final) {
  //
  //     return callback(this, selection);
  //
  //   } else if (selection.mixed) {
  //
  //     // const child = this.createChild({
  //     //   index: "mixed",
  //     //   type: "textarea"
  //     // });
  //
  //     return callback(this, selection);
  //
  //   } else {
  //
  //     const values = this.getValue();
  //
  //     for (let i in values) {
  //
  //       const child = this.createChild({
  //         id: i,
  //         index: i,
  //         type: "row",
  //         children: this.resource.children
  //       });
  //
  //       if (selection[child.resource.index]) {
  //
  //         return child.follow(selection[child.resource.index], callback);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  getChild(index) {

    const child = this.createChild({
      children: this.resource.children,
      type: "row",
      index: index
    }, index);

    return child;

  }

  // getSelectionChild(selection) {
  //
  //   const values = this.getValue();
  //
  //   for (let i in values) {
  //
  //     if (selection[i]) {
  //
  //       return this.createChild({
  //         id: i,
  //         index: i,
  //         type: "row",
  //         children: this.resource.children
  //       });
  //
  //     }
  //
  //   }
  //
  // }

  getColumns(rows) {

    const keys = this.getKeys();

    const columns = {};

    for (let key of keys) {

      columns[key] = [];

    }

    for (let i = 0; i < rows.length; i++) {

      for (let key in rows[i]) {

        if (columns[key] !== undefined) {

          columns[key][i] = rows[i][key];

        }

      }

    }

    return columns;
  }

  // -> return array of objects;
  getRows(columns) {

    const rows = [];

    for (let key in columns) {

      const column = columns[key] || [];

      for (let i = 0; i < column.length; i++) {

        if (!rows[i]) {

          rows[i] = {};

        }

        rows[i][key] = column[i];
      }

    }

    return rows;
  }

  getContent() {

    let key = this.getKey();

    if (key) {

      return this.parent.getContent(key);

    } else {

      const row = this.createChild({
        type: "row",
        children: this.resource.children,
        index: "token"
      }, "token");

      const keys = row.getKeys();

      const columns = {};

      for (key of keys) {

        const content = this.parent.getContent(key);

        if (content) {

          if (content.mixed) {

            return value;

          }

          columns[key] = content.toArray();

        }

      }

      const rows = this.getRows(columns);

      return new KarmaFieldsAlpha.Content(rows);

    }

  }

  getValue() {

    let key = this.getKey();

    if (key) {

      return this.parent.getValue(key);

    } else {

      const row = this.createChild({
        type: "row",
        children: this.resource.children,
        index: "token"
      });

      const keys = row.getKeys();

      const columns = {};

      for (key of keys) {

        const value = this.parent.getValue(key);

        if (value) {

          if (value[0] === KarmaFieldsAlpha.mixed) {

            return value;

          }

          columns[key] = value;

        }

      }

      return this.getRows(columns);

    }

  }

  setContent(content) {

    let key = this.getKey();

    if (key) {

      this.parent.setContent(content, key);

    } else {

      const columns = this.getColumns(content.toArray());

      for (key in columns) {

        const content = new KarmaFieldsAlpha.Content(columns[key]);

        this.parent.setContent(content, key);

      }

    }

  }


  setValue(value) {

    let key = this.getKey();

    if (key) {

      this.parent.setValue(value, key);

    } else {

      const columns = this.getColumns(value);

      for (key in columns) {

        this.parent.setValue(columns[key], key);

      }

    }

  }

  async swap(index, target, length) {

    let content = this.getContent();

    // const values = KarmaFieldsAlpha.DeepObject.clone(content.toArray());

    const values = [...content.toArray()];

    values.splice(target, 0, ...values.splice(index, length));

		await this.setContent(new KarmaFieldsAlpha.Content(values));

  }

  async backup() {

    // await KarmaFieldsAlpha.History.update();

    let key = this.getKey();

    if (key) {

      this.parent.setContent(content, key);


    } else {

      const columns = this.getColumns(content.toArray());

      for (key in columns) {

        // const content = new KarmaFieldsAlpha.Content(columns[key]);

        this.parent.backup(key);

      }

    }


  }

  async add() {

    let token = KarmaFieldsAlpha.Store.get("fields", ...this.path, "token") || 0;

    token++;

    KarmaFieldsAlpha.Store.set(token, "fields", ...this.path, "token");

    await KarmaFieldsAlpha.History.save("add", "Insert");

    await this.request("render");





    // const content = this.getContent();
    //
    // const newContent = new KarmaFieldsAlpha.Content([...content.value, {}]);
    //
    // await KarmaFieldsAlpha.History.save("add", "Insert");
    //
    // await this.setContent(newContent);
    //
    // KarmaFieldsAlpha.Query.init(); // -> add empty
    //
    // await this.request("render");



  }

  remove(index = 0, length = 1) {

    const content = this.getContent();

    const values = [...content.toArray()];

    if (length) {

      values.splice(index, length);

      KarmaFieldsAlpha.History.save("remove");

      const newContent = new KarmaFieldsAlpha.Content(values);

      this.setContent(newContent);

      this.render();

    }

  }




  delete() {

    if (this.selection) {

      this.remove(this.selection.index || 0, this.selection.length || 0);

      this.setSelection();

      this.request("render");

    }

    // if (selection) {
    //
    //   if (selection.child) {
    //
    //     const child = this.getChild(selection.childId);
    //
    //     child.delete(selection.child);
    //
    //   } else {
    //
    //     this.remove(selection.index || 0, selection.length || 0);
    //
    //     this.setSelection();
    //
    //   }
    //
    // }

  }

  paste(value) {

    if (this.selection) {

      const collection = new KarmaFieldsAlpha.Content.Collection([value]);

      this.import(collection, this.selection.index || 0, this.selection.length || 0);

    }

    this.request("render");


    // if (selection) {
    //
    //   if (selection.child) {
    //
    //     const child = this.getChild(selection.childId);
    //
    //     child.paste(value, selection.child);
    //
    //   } else {
    //
    //     this.import([value], selection.index || 0, selection.length || 0);
    //
    //   }
    //
    // }
    //
    // this.render();

  }

  copy(selection) {

    if (this.selection) {

      const collection = new KarmaFieldsAlpha.Content.Collection();

      this.export(collection, selection.index || 0, selection.length || 0);

      return collection.toString();

    }

    // if (selection) {
    //
    //   if (selection.child) {
    //
    //     const child = this.getChild(selection.childId);
    //
    //     return child.paste(value, selection.child);
    //
    //   } else {
    //
    //     const [value] = this.export([], selection.index || 0, selection.length || 0);
    //
    //     return value;
    //
    //   }
    //
    // }

  }

  async sortUp(index, length = 1) {

    if (index > 0) {

      await KarmaFieldsAlpha.History.save("sort", "Sort");

      await this.swap(index, length, index-1);

      this.setSelection({index: index-1, length: length});

      await this.request("render");
    }

  }

  async sortDown(index, length = 1) {

    if (index + length < this.getValue().length) {

      await KarmaFieldsAlpha.History.save("sort", "Sort");

      await this.swap(index, length, index+1);

      this.setSelection({index: index-1, length: length});

      await this.request("render");
    }

  }


  build() {
    return {
      class: "array",
      update: array => {

        this.renderSelf = array.render;

        const content = this.getContent();

        const mixed = content.mixed;

        array.children = [
          {
            class: "array-body",
            update: table => {

              table.element.classList.toggle("hidden", Boolean(content.mixed));
              table.element.classList.toggle("loading", Boolean(content.loading));

              if (!content.mixed) {

                let array = content.toArray();

                // debugger;

                let token = KarmaFieldsAlpha.Store.get("fields", ...this.path, "token");

                while (token) {

                  array = [...array, {}];

                  token--;

                  KarmaFieldsAlpha.Store.set(token, "fields", ...this.path, "token");

                }

                table.element.classList.toggle("empty", array.length === 0);

                const hasHeader = this.resource.children.some(column => column.header || column.label); // header is deprecated

                // let selection = this.getSelection();

                const sorter = new KarmaFieldsAlpha.ListSortGrid(table.element, this.selection, this.resource.children.length, hasHeader ? 1 : 0);

                sorter.onSelect = elements => {

                  elements.map(element => element.classList.add("selected"));

                  this.setSelection(sorter.state.selection);

                }

                sorter.onUnselect = elements => {

                  elements.map(element => element.classList.remove("selected"));

                }

                sorter.onSelectionComplete = () => {

                  this.request("deferFocus");
                  this.request("render");

                }

                sorter.onSwap = async (newState, lastState) => {

                  await this.request("save", "sort", "Sort");
                  await this.swap(lastState.selection.index, newState.selection.index, newState.selection.length);
                  this.setSelection(newState.selection);

                };

                sorter.onSort = async (index, target, length) => {

                  // KarmaFieldsAlpha.History.save("order");
                  await this.request("deferFocus");
                  await this.request("render");

                }



                table.children = [
                  ...this.resource.children.filter(column => array.length && hasHeader).map(column => {
                    return {
                      class: "th",
                      init: th => {
                        th.element.textContent = column.header || column.label || "";
                      }
                    };
                  }),
                  ...array.reduce((array, item, index) => {

                    const row = this.createChild({
                      ...this.resource,
                      index: index.toString(),
                      id: index.toString(),
                      type: "row"
                    }, index);

                    return [
                      ...array,
                      ...this.resource.children.map((column, colIndex) => {

                        const field = row.createChild({
                          id: colIndex,
                          ...column,
                          width: "100%",
                          index: colIndex.toString()
                        }, colIndex);

                        return {
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
                            td.element.classList.toggle("selected", Boolean(this.selection && !this.selection.child && KarmaFieldsAlpha.Segment.contain(this.selection, index)));
                            td.element.classList.toggle("odd", index%2 === 0);
                            td.child = field.build();
                          }
                        };
                      })
                    ];
                  }, [])

                ];

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
              if (mixed) {
                node.children = [
                  this.createChild({
                    type: "textarea",
                    // key: "mixed",
                    index: "mixed"
                  }, "mixed").build()
                ];

                // node.children = [{
                //   tag: "textarea",
                //   update: input => {
                //     input.element.classList.toggle("mixed", values[0] === KarmaFieldsAlpha.mixed);
          			// 		input.element.classList.toggle("selected", Boolean((this.getSelection() || {}).final));
                //     input.element.value = "[multiple values]";
                //     input.element.readOnly = true;
          			// 		input.element.onfocus = event => {
          			// 			this.setSelection({final: true});
                //       KarmaFieldsAlpha.Clipboard.focus();
          			// 			this.render();
          			// 		}
          			// 		input.element.onmousedown = event => {
          			// 			event.stopPropagation();
          			// 		}
                //   }
                // }]





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

    const content = this.parent.getContent();

    if (!content.loading) {

      const array = content.toArray();
      const index = this.getIndex();
      const object = array[index] || {};

      const row = new KarmaFieldsAlpha.Content(object[key]);

      if (object[key] === undefined) {

        row.notFound = true;

      }

      return row;

      // if (object) {
      //
      //   return KarmaFieldsAlpha.Type.toArray(object[key]);
      //
      // }
      //
      // return [];

    }

  }

  setContent(newContent, key) {

    const content = this.parent.getContent();
    const array = [...content.toArray()];
    const index = this.getIndex();

    array[index] = {...array[index], [key]: newContent.toSingle()};

    const tableContent = new KarmaFieldsAlpha.Content(array);

    this.parent.setContent(tableContent);

    // const clone = array.slice();
    //
    //
    // clone[this.resource.index] = {...clone[this.resource.index], [key]: value};
    //
    // this.parent.setValue(clone);

  }


  // getValue(key) {
  //
  //   const values = this.parent.getValue(key);
  //
  //   if (values) {
  //
  //     const object = values[this.resource.index];
  //
  //     if (object) {
  //
  //       return KarmaFieldsAlpha.Type.toArray(object[key]);
  //
  //     }
  //
  //     return [];
  //
  //   }
  //
  // }
  //
  // setValue(value, key) {
  //
  //   const array = this.parent.getValue(key);
  //
  //   if (array) {
  //
  //     const clone = array.slice();
  //
  //     clone[this.resource.index] = {...clone[this.resource.index], [key]: value};
  //
  //     this.parent.setValue(clone);
  //
  //   }
  //
  // }

  getIndex() {

    return this.resource.index;

  }

  initValue() {

    return KarmaFieldsAlpha.field.container.prototype.initValue.call(this);

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

// KarmaFieldsAlpha.field.array.row.sortArrows = {
//   type: "group",
//   visible: [">", ["length", ["getValue"]], "1"],
//   children: [
//     {
//       action: "sortUp",
//       value: ["index"],
//       type: "button",
//       title: "Move Up",
//       disabled: ["<", ["length", ["getValue"]], 1],
//       dashicon: "arrow-up-alt2",
//       class: "array-sort-up",
//       width: "auto"
//     },
//     {
//       action: "sortDown",
//       value: ["index"],
//       type: "button",
//       title: "Move Down",
//       disabled: [">=", ["+", ["get", "number", "index"], 1], ["length", ["getValue"]]],
//       dashicon: "arrow-down-alt2",
//       class: "array-sort-up",
//       width: "auto"
//     }
//   ]
// };


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

// KarmaFieldsAlpha.field.array.arrayIndex = class extends KarmaFieldsAlpha.field.text {
//
//   constructor(resource) {
//
//     super({
//       type: "text",
//       value: ["+", ["request", "getIndex"], 1],
//       width: "auto",
//       ...resource
//     });
//
//   }
//
// }
