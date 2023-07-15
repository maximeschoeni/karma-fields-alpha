
KarmaFieldsAlpha.field.blockEditor = class extends KarmaFieldsAlpha.field {


  export(items = [], index = 0, length = 999999, colIndex = 0, colLength = 999999) {

    const values = this.getValue();

    if (values) {

      if (values[0] === KarmaFieldsAlpha.mixed) {

        return items;

      }

      const grid = new KarmaFieldsAlpha.Grid();
      const columns = this.resource.children.slice(colIndex, colIndex + colLength);

      for (let i = 0; i < Math.min(values.length - index, length); i++) {

        const rowField = this.createChild({
          type: "row",
          index: i + index,
          children: columns
        });

        const rowItems = rowField.export();

        grid.addRow(rowItems);

      }

      items.push(grid.toString());

    }

    return items;

  }

  import(items, index = 0, length = 999999, colIndex = 0, colLength = 999999) {

    const string = items.shift();

    if (string) {

      const grid = new KarmaFieldsAlpha.Grid(string);

      const columns = this.resource.children.slice(colIndex, colIndex + colLength);

      const values = [...this.getValue()];

      values.splice(index, length, ...grid.array.map(() => this.getDefault()));

      this.setValue(values);

      for (let i = 0; i < grid.array.length; i++) {

        const child = this.createChild({
          children: columns,
          type: "row",
          index: i + index
        });

        const rowItems = grid.getRow(i);

        child.import(rowItems);

      }

    }

  }


  getDefault() {

    if (this.resource.default) {

      return this.parse(this.resource.default);

    }

  }

  follow(selection, callback) {

    if (selection.final) {

      return callback(this, selection);

    } else if (selection.mixed) {

      // const child = this.createChild({
      //   index: "mixed",
      //   type: "textarea"
      // });

      return callback(this, selection);

    } else {

      const values = this.getValue();

      for (let i in values) {

        const child = this.createChild({
          id: i,
          index: i,
          type: "row",
          children: this.resource.children
        });

        if (selection[child.resource.index]) {

          return child.follow(selection[child.resource.index], callback);

        }

      }

    }

  }

  getColumns(rows) {

    const keys = this.getKeys();

    const columns = {};

    for (let key of keys) {

      columns[key] = [];

    }

    for (let i = 0; i < rows.length; i++) {

      for (let key in rows[i]) {

        if (columns[key]) {

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

  swap(index, length, target) {
    let values = this.getValue();
    values = KarmaFieldsAlpha.DeepObject.clone(values || []);
    values.splice(target, 0, ...values.splice(index, length));
		this.setValue(values);
  }

  add() {

    const array = this.getValue();

    const row = this.createChild({
      children: this.resource.children,
      type: "row",
      index: array.length
    });

    this.save("add");

    row.initValue();

    // this.setValue([...array, {}]);



  }

  remove(index = 0, length = 1) {

    const values = [...this.getValue()];

    if (length) {

      values.splice(index, length);

      this.setValue(values);

      this.save("remove");

    }

  }

  delete(selection) {
    // compat
    this.remove(selection.index || 0, selection.length || 0);

  }

  paste(value, selection) {

    this.import([value], selection.index || 0, selection.length || 0);

  }

  copy(selection) {

    const [value] = this.export([], selection.index || 0, selection.length || 0);

    return value;

  }

  sortUp(index, length = 1) {

    if (index > 0) {

      this.swap(index, length, index-1);

      this.setSelection({final: true, index: index-1, length: length});
      this.save("sort");
      this.render();
    }

  }

  sortDown(index, length = 1) {

    if (index + length < this.getValue().length) {

      this.swap(index, length, index+1);

      this.setSelection({final: true, index: index-1, length: length});
      this.save("sort");
      this.render();
    }

  }


  build() {
    return {
      class: "block-editor-container",
      update: node => {

        const values = this.getValue() || [KarmaFieldsAlpha.loading];

        if (values[0] !== KarmaFieldsAlpha.loading) {

          const mixed = values[0] === KarmaFieldsAlpha.mixed;

          node.children = [
            {
              class: "block-editor",
              update: node => {
                node.children = [
                  {
                    class: "editor-body",
                    update: node => {

                      const path = this.resource.path || [];
                      const sorter = new KarmaFieldsAlpha.HSorter(node.element);
                      const selection = this.getSelection();
                      sorter.colCount = 1;
                      sorter.rowCount = values.length;
                      sorter.selection = selection;
                      sorter.path = [...path];
                      sorter.maxDepth = 1;
                      sorter.onselect = newSelection => {
                        this.setSelection(newSelection);
                        KarmaFieldsAlpha.Clipboard.focus();
                        this.save("nav");
                        this.render();
                      }
                      sorter.onsort = () => {
                        this.swap([...path, selection.index], [...sorter.path, sorter.selection.index], sorter.selection.length);
                        KarmaFieldsAlpha.Clipboard.focus();
                        this.save("swap");
                        this.render();
                      }
                      sorter.onSelectionChange = newSelection => {
                        this.setSelection(newSelection);
                      }
                      sorter.onPaintRow = elements => {
                        elements.forEach(element => element.classList.add("selected"));
                      }
                      sorter.onUnpaintRow = elements => {
                        elements.forEach(element => element.classList.remove("selected"));
                      }

                      node.children = values.map((value, index) => {
                        return this.createChild({
                          type: value.type || "group",
                          index: index,
                          value: value
                        }).build();
                      });
                    }
                  },
                  {
                    class: "editor-footer",
                    update: node => {
                      node.children = [
                        this.createChild({
                          type: "library",
                          ...this.resource.library,
                          index: "library"
                        }).build()
                      ];
                    }
                    // update: node => {
                    //   node.children = this.resource.library.map((index) => {
                    //     const thumbnail = this.getChild(index);
                    //     return thumbnail.build();
                    //   });
                    // }
                  }

                  // {
                  //   class: "array-body",
                  //   update: table => {
                  //
                  //     // const values = this.getValue();
                  //     table.element.classList.toggle("hidden", Boolean(mixed));
                  //     table.element.classList.toggle("loading", !values);
                  //
                  //     if (values && !mixed) {
                  //
                  //       table.element.classList.toggle("empty", values.length === 0);
                  //
                  //       const hasHeader = this.resource.children.some(column => column.header || column.label); // header is deprecated
                  //
                  //       let selection = this.getSelection();
                  //
                  //       if (selection && !selection.final) {
                  //
                  //         selection = undefined; // -> selection target a deeper field
                  //
                  //       }
                  //
                  //       const sorter = new KarmaFieldsAlpha.Sorter(table.element);
                  //       sorter.colCount = this.resource.children.length;
                  //       sorter.rowCount = values.length;
                  //       sorter.selection = selection;
                  //
                  //       if (hasHeader) {
                  //
                  //         sorter.colHeader = 1;
                  //       }
                  //
                  //       sorter.onselect = newSelection => {
                  //
                  //         if (!KarmaFieldsAlpha.Selection.compare(newSelection, selection)) {
                  //
                  //           selection = newSelection;
                  //
                  //           KarmaFieldsAlpha.Clipboard.focus();
                  //
                  //           this.setSelection(newSelection);
                  //
                  //           this.render();
                  //
                  //         }
                  //
                  //       }
                  //
                  //       sorter.onSelectionChange = newSelection => {
                  //         this.setSelection(newSelection);
                  //       }
                  //
                  //       sorter.onPaintRow = elements => {
                  //         elements.forEach(element => element.classList.add("selected"))
                  //       }
                  //
                  //       sorter.onUnpaintRow = elements => {
                  //         elements.forEach(element => element.classList.remove("selected"))
                  //       }
                  //
                  //
                  //       sorter.onsort = () => {
                  //
                  //         // if (!KarmaFieldsAlpha.Selection.compare(sorter.selection, selection)) {
                  //
                  //           this.swap(selection.index, selection.length, sorter.selection.index);
                  //
                  //           selection = sorter.selection;
                  //
                  //           KarmaFieldsAlpha.Clipboard.focus();
                  //
                  //           this.setSelection(sorter.selection);
                  //
                  //           this.save("order");
                  //
                  //         // }
                  //
                  //       }
                  //
                  //       // table.element.onfocusin = event => {
                  //       //
                  //       //   console.log("array onfocusin ");
                  //       //   this.render(); // unselect last field when input gains focus inside array
                  //       // }
                  //
                  //       table.children = [
                  //         ...this.resource.children.filter(column => values.length && hasHeader).map(column => {
                  //           return {
                  //             class: "th",
                  //             init: th => {
                  //               th.element.textContent = column.header || column.label || "";
                  //             }
                  //           };
                  //         }),
                  //         ...values.reduce((array, item, index) => {
                  //
                  //           const row = this.createChild({
                  //             ...this.resource,
                  //             index: index.toString(),
                  //             id: index.toString(),
                  //             type: "row"
                  //           });
                  //
                  //           return [
                  //             ...array,
                  //             ...this.resource.children.map((column, colIndex) => {
                  //
                  //               const field = row.createChild({
                  //                 id: colIndex,
                  //                 ...column,
                  //                 index: colIndex.toString()
                  //               });
                  //
                  //               return {
                  //                 class: "td array-cell karma-field-frame",
                  //                 init: td => {
                  //                   if (field.resource.style) {
                  //                     td.element.style = field.resource.style;
                  //                   }
                  //                   if (field.resource.class) {
                  //                     td.element.classList.add(field.resource.class);
                  //                   }
                  //                 },
                  //                 update: td => {
                  //                   td.element.classList.toggle("selected", Boolean(selection && KarmaFieldsAlpha.Selection.containRow(selection, index)));
                  //                   td.child = field.build();
                  //                 }
                  //               };
                  //             })
                  //           ];
                  //         }, [])
                  //
                  //       ];
                  //
                  //       table.element.style.gridTemplateColumns = this.resource.children.map(resource => resource.width || "1fr").join(" ");
                  //
                  //     }
                  //
                  //   }
                  // },
                  // {
                  //   class: "array-footer",
                  //   update: node => {
                  //     node.element.classList.toggle("hidden", Boolean(mixed));
                  //     if (values && !mixed) {
                  //       node.children = [{
                  //         class: "array-footer-content",
                  //         update: footer => {
                  //           if (this.resource.footer !== false) {
                  //             footer.child = this.createChild({
                  //               type: "footer",
                  //               ...this.resource.footer,
                  //               index: "footer"
                  //             }).build();
                  //           }
                  //         }
                  //       }];
                  //     } else {
                  //       node.children = [];
                  //     }
                  //   }
                  // },

                ];
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
                    }).build()
                  ];
                } else {
                  node.children = [];
                }
              }
            }
          ];

        }


      }
    };
  }

}

KarmaFieldsAlpha.field.blockEditor.library = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    super({
      children: [
        "textarea"
      ],
      ...resource
    });

  }

  getChild(index) {

    return this.createChild({
      type: index,
      index: index
    });

  }


  build() {

    return {
      class: "karma-field-container editor-block-library",
      update: node => {



        // node.element.innerHTML = this.resource.text;

        // const path = this.resource.path || [];
        // const sorter = new KarmaFieldsAlpha.BlockDropper(node.element);
        // const selection = this.getSelection();
        // sorter.colCount = 1;
        // // sorter.rowCount = this.resource.children.length;
        // sorter.selection = selection;
        // sorter.path = [...path];
        // sorter.maxDepth = 1;
        // sorter.ondrop = newSelection => {
        //   this.parent.insert({
        //     type: this.resource.type
        //   }, newSelection);
        //   this.save("drop");
        //   this.render();
        // }


        console.log(this.resource);

        node.children = this.resource.children.map(resource => {


          const thumbnail = this.getChild(resource);

          console.log(thumbnail);


          return thumbnail.build();
        });
      }
    };

  }

}

KarmaFieldsAlpha.field.blockEditor.library.thumbnail = class extends KarmaFieldsAlpha.field.container {

  build() {
    return {
      class: "frame",
      update: node => {

        node.element.innerHTML = this.resource.text;
        //
        // const path = this.resource.path || [];
        // const sorter = new KarmaFieldsAlpha.BlockDropper(ul.element);
        // const selection = this.getSelection();
        // sorter.colCount = 1;
        // // sorter.rowCount = this.resource.children.length;
        // sorter.selection = selection;
        // sorter.path = [...path];
        // sorter.maxDepth = 1;
        // sorter.ondrop = newSelection => {
        //   this.parent.insert({
        //     type: this.resource.type
        //   }, newSelection);
        //   this.save("drop");
        //   this.render();
        // }

      }
    }
  }
}


KarmaFieldsAlpha.field.blockEditor.library.textarea = class extends KarmaFieldsAlpha.field.blockEditor.library.thumbnail {
  constructor(resource) {
    super({
      text: "Textarea",
      ...resource
    });
  }
}



KarmaFieldsAlpha.field.blockEditor.block = class extends KarmaFieldsAlpha.field {


}

KarmaFieldsAlpha.field.blockEditor.textarea = class extends KarmaFieldsAlpha.field.blockEditor.block {
  build() {
    return {
      class: "block textarea"
    };
  }
}


//
// KarmaFieldsAlpha.field.array.footer = class extends KarmaFieldsAlpha.field.container {
//
//   constructor(resource) {
//
//     super({
//       display: "flex",
//       children: [
//         "add"
//       ],
//       ...resource
//     });
//
//   }
//
// }
//
// KarmaFieldsAlpha.field.array.footer.add = {
//   type: "button",
//   id: "add",
//   action: "add",
//   // dashicon: "insert",
//   title: "+"
// };
//
//
// KarmaFieldsAlpha.field.array.row = class extends KarmaFieldsAlpha.field {
//
//   getValue(key) {
//
//     const values = this.parent.getValue(key);
//
//     if (values) {
//
//       const object = values[this.resource.index];
//
//       if (object) {
//
//         return KarmaFieldsAlpha.Type.toArray(object[key]);
//
//       }
//
//       return [];
//
//     }
//
//   }
//
//   setValue(value, key) {
//
//     const array = this.parent.getValue(key);
//
//     if (array) {
//
//       const clone = array.slice();
//
//       clone[this.resource.index] = {...clone[this.resource.index], [key]: value};
//
//       this.parent.setValue(clone);
//
//     }
//
//   }
//
//   getIndex() {
//
//     return this.resource.index;
//
//   }
//
//   initValue() {
//
//     return KarmaFieldsAlpha.field.container.prototype.initValue.call(this);
//
//   }
//
// }
//
//
//
// // KarmaFieldsAlpha.field.array.row.delete = {
// //   type: "button",
// //   action: "delete",
// //   value: ["index"],
// //   title: "Delete",
// //   dashicon: "no-alt",
// //   class: "array-delete",
// //   width: "auto"
// // };
//
// KarmaFieldsAlpha.field.array.row.delete = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource) {
//     super({
//       action: "delete",
//       value: ["index"],
//       title: "Delete",
//       dashicon: "no-alt",
//       class: "array-delete",
//       width: "auto",
//       ...resource
//     });
//   }
// };
//
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
//
// KarmaFieldsAlpha.field.array.row.index = {
//   type: "text",
//   value: ["+", ["request", "getIndex"], 1],
//   style: "width: 40px"
// };
