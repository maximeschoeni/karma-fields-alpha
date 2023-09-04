
KarmaFieldsAlpha.field.blockEditor = class extends KarmaFieldsAlpha.field {

  // getValue(index, ...path) {
  //
  //   if (index !== undefined) {
  //
  //     const array = super.getValue();
  //
  //     if (!array || array === KarmaFieldsAlpha.loading) {
  //
  //       return KarmaFieldsAlpha.loading;
  //
  //     }
  //
  //     const object = KarmaFieldsAlpha.DeepArray.get(array, index, ...path);
  //
  //     return KarmaFieldsAlpha.Type.toArray(object);
  //
  //   } else {
  //
  //     return super.getValue();
  //
  //   }
  //
  // }

  getBlockValue(...path) {

    const array = this.getValue();

    if (!array || array === KarmaFieldsAlpha.loading) {

      return KarmaFieldsAlpha.loading;

    }

    return KarmaFieldsAlpha.DeepArray.get(array, ...path);

  }

  // getLength(...path) {
  //
  //   const object = this.getBlockValue(...path);
  //
  //   return object && object.children && object.children.length || 0;
  //
  // }


  // setValue(value, index) {
  //
  //   const clone = KarmaFieldsAlpha.DeepArray.cloneObject(this.resource.value || {});
  //
  //   if (!clone.children) {
  //
  //     clone.children = [];
  //
  //   }
  //
  //   clone.children[index] = value;
  //
  //   this.parent.setValue(clone, this.resource.index);
  //
  // }


  setBlockValue(value, ...path) {

    const array = super.getValue();

    if (array && array !== KarmaFieldsAlpha.loading) {

      const clone = KarmaFieldsAlpha.DeepArray.clone(array);

      KarmaFieldsAlpha.DeepArray.set(clone, value, ...path);

      this.setValue(clone);

    }

  }

  // setValue(value, index, ...path) {
  //
  //   if (index !== undefined) {
  //
  //     const array = super.getValue();
  //
  //     if (array && array !== KarmaFieldsAlpha.loading) {
  //
  //       const clone = KarmaFieldsAlpha.DeepArray.clone(array);
  //
  //       KarmaFieldsAlpha.DeepArray.set(clone, value, index, ...path);
  //
  //     }
  //
  //   } else {
  //
  //     super.setValue(value);
  //
  //   }
  //
  // }




  // setValue(value, index) {
  //
  //   super.setValue(value);
  //
  // }



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

  getSelectionChild(selection) {

    const values = this.getValue()

    if (selection && selection[0] && values && values !== KarmaFieldsAlpha.loading) {

      return this.createChild({
        children: values,
        index: 0,
        type: "column"
      });

    }

  }

  // getColumns(rows) {
  //
  //   const keys = this.getKeys();
  //
  //   const columns = {};
  //
  //   for (let key of keys) {
  //
  //     columns[key] = [];
  //
  //   }
  //
  //   for (let i = 0; i < rows.length; i++) {
  //
  //     for (let key in rows[i]) {
  //
  //       if (columns[key]) {
  //
  //         columns[key][i] = rows[i][key];
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   return columns;
  // }
  //
  // // -> return array of objects;
  // getRows(columns) {
  //
  //   const rows = [];
  //
  //   for (let key in columns) {
  //
  //     const column = columns[key] || [];
  //
  //     for (let i = 0; i < column.length; i++) {
  //
  //       if (!rows[i]) {
  //
  //         rows[i] = {};
  //
  //       }
  //
  //       rows[i][key] = column[i];
  //     }
  //
  //   }
  //
  //   return rows;
  // }

  // getValue() {
  //
  //   let key = this.getKey();
  //
  //   if (key) {
  //
  //     return this.parent.getValue(key);
  //
  //   } else {
  //
  //     const row = this.createChild({
  //       type: "row",
  //       children: this.resource.children,
  //       index: "token"
  //     });
  //
  //     const keys = row.getKeys();
  //
  //     const columns = {};
  //
  //     for (key of keys) {
  //
  //       const value = this.parent.getValue(key);
  //
  //       if (value) {
  //
  //         if (value[0] === KarmaFieldsAlpha.mixed) {
  //
  //           return value;
  //
  //         }
  //
  //         columns[key] = value;
  //
  //       }
  //
  //     }
  //
  //     return this.getRows(columns);
  //
  //   }
  //
  // }
  //
  // setValue(value) {
  //
  //   let key = this.getKey();
  //
  //   if (key) {
  //
  //     this.parent.setValue(value, key);
  //
  //   } else {
  //
  //     const columns = this.getColumns(value);
  //
  //     for (key in columns) {
  //
  //       this.parent.setValue(columns[key], key);
  //
  //     }
  //
  //   }
  //
  // }



  // add() {
  //
  //   const array = this.getValue();
  //
  //   const row = this.createChild({
  //     children: this.resource.children,
  //     type: "row",
  //     index: array.length
  //   });
  //
  //   this.save("add");
  //
  //   row.initValue();
  //
  //   // this.setValue([...array, {}]);
  //
  //
  //
  // }

  remove(index, length, ...path) {

    let values = this.getValue();

    if (values && values !== KarmaFieldsAlpha.loading) {

      values = KarmaFieldsAlpha.DeepArray.clone(values);

      KarmaFieldsAlpha.DeepArray.splice(values, length || 0, [], ...path, index || 0);

      this.setValue(values);

      this.setSelection({index: 0, length: 0});

    }

  }

  // delete(selection) {
  //
  //
  //   debugger;
  //
  //
  //   super.delete(selection);
  //
  // }

  // paste(value, selection) {
  //
  //   this.import([value], selection.index || 0, selection.length || 0);
  //
  // }

  // copy(selection) {
  //
  //   debugger;
  //
  //   const [value] = this.export([], selection.index || 0, selection.length || 0);
  //
  //   return value;
  //
  // }

  // sortUp(index, length = 1) {
  //
  //   if (index > 0) {
  //
  //     this.swap(index, length, index-1);
  //
  //     this.setSelection({final: true, index: index-1, length: length});
  //     this.save("sort");
  //     this.render();
  //   }
  //
  // }
  //
  // sortDown(index, length = 1) {
  //
  //   if (index + length < this.getValue().length) {
  //
  //     this.swap(index, length, index+1);
  //
  //     this.setSelection({final: true, index: index-1, length: length});
  //     this.save("sort");
  //     this.render();
  //   }
  //
  // }

  swap(index, newIndex, length, path, newPath) {

    let values = this.getValue();

    if (values && values !== KarmaFieldsAlpha.loading) {

      const selection = {length: 1, index: 0};

      KarmaFieldsAlpha.DeepObject.set(selection, {final: true, index: newIndex, length: length}, ...newPath);

      this.setSelection(selection);

      values = KarmaFieldsAlpha.DeepArray.clone(values);

      const transferedItems = KarmaFieldsAlpha.DeepArray.splice(values, length, [], ...path, index);

      KarmaFieldsAlpha.DeepArray.splice(values, 0, transferedItems, ...newPath, newIndex);

      this.setValue(values);

    }

  }



  addBlock(resource) {

    // const values = this.getValue();
    //
    // if (values && values !== KarmaFieldsAlpha.loading) {
    //
    //   const value = parseInt(Math.random()*100);
    //
    //   this.setValue([...values, {type: "test", value: value}]);
    //
    //   this.render();
    //
    // }

    const values = this.getValue();

    if (values && values !== KarmaFieldsAlpha.loading) {

      this.createChild({
        type: "column",
        value: values[0],
        index: 0,
        path: []
      }).addValue(resource);

      this.render();

    }


    // const values = this.getValue();
    //
    // if (values && values !== KarmaFieldsAlpha.loading) {
    //
    //   const value = KarmaFieldsAlpha.DeepArray.cloneObject(values[0] || {});
    //
    //   if (!value.children) {
    //
    //     value.children = [];
    //
    //   }
    //
    //   value.children.push(resource);
    //
    //   this.setValue(value);
    //
    //
    //
    //
    // }

  }

  // addBranch() {
  //
  //   const values = this.getValue();
  //
  //   if (values && values !== KarmaFieldsAlpha.loading) {
  //
  //     this.setValue([...values, {type: "branch"}]);
  //
  //     this.render();
  //
  //   }
  //
  // }


  addText() {

    this.addBlock({
      type: "blockTinymce"
    });

  }

  addGroup() {

    this.addBlock({
      type: "columns",
      children: [
        {type: "column"},
        {type: "column"}
      ]
    });

  }

  addGalleryBlock() {

    this.addBlock({
      type: "blockGallery"
    });

    // const values = this.getValue();
    //
    // if (values && values !== KarmaFieldsAlpha.loading) {
    //
    //   this.createChild({
    //     type: "column",
    //     value: values[0],
    //     index: 0,
    //     path: []
    //   }).addValue({
    //     type: "block",
    //     children: [
    //       {
    //         type: "files",
    //         key: "gallery"
    //       }
    //     ]
    //   });
    //
    //   this.render();
    //
    // }

  }


  build() {
    return {
      class: "block-editor",
      update: node => {


        let values = this.getValue();


        // values = [
        //     {
        //         "children": [
        //             {
        //                 "type": "columns",
        //                 "children": [
        //                     {
        //                         "type": "column",
        //                         "children": [
        //                           {
        //                             "type": "block",
        //                             "children": [
        //                               {
        //                                 "type": "files",
        //                                 "key": "gallery"
        //                               }
        //                             ]
        //                           }
        //                         ]
        //                     },
        //                     {
        //                         "type": "column"
        //                     }
        //                 ]
        //             }
        //         ]
        //     }
        // ];


        // const value = this.getBlockValue(0);

        if (values && values !== KarmaFieldsAlpha.loading) {



          // const mixed = values[0] === KarmaFieldsAlpha.mixed;

          // const value = values[0] || {};

          // console.log(values[0]);

          node.children = [
            {
              tag: "ul",
              class: "block-columns block-root",
              child: this.createChild({
                type: "column",
                // children: value.children,
                value: values[0],
                depth: 0,
                index: 0,
                path: []
              }).build(),

              update: node => {



                // const column = this.createChild({
                //   type: "column",
                //   children: value.children,
                //   // value: value,
                //   depth: 0,
                //   index: 0,
                //   path: []
                // });

                node.childrenXXXXX = [
                  // column.build()

                // node.children = [
                //   {
                //     class: "editor-body",
                //     update: node => {
                //
                //       const path = this.resource.path || [];
                //       const sorter = new KarmaFieldsAlpha.HSorter(node.element);
                //       const selection = this.getSelection();
                //       sorter.colCount = 1;
                //       sorter.rowCount = values.length;
                //       sorter.selection = selection;
                //       sorter.path = [...path];
                //       sorter.maxDepth = 1000;
                //       sorter.onselect = newSelection => {
                //         // console.log(newSelection);
                //         this.setSelection(newSelection);
                //         KarmaFieldsAlpha.Clipboard.focus();
                //         this.save("nav");
                //         // this.render();
                //       }
                //
                //       sorter.onSwap = (index, newIndex, length, path, newPath) => {
                //         this.swap(index, newIndex, length, path, newPath);
                //       }
                //       sorter.onsort = () => {
                //         // this.swap([...path, selection.index], [...sorter.path, sorter.selection.index], sorter.selection.length);
                //         // KarmaFieldsAlpha.Clipboard.focus();
                //         // this.save("swap");
                //         // this.render();
                //       }
                //       sorter.onSelectionChange = newSelection => {
                //         this.setSelection(newSelection);
                //       }
                //       sorter.onPaintRow = elements => {
                //         elements.forEach(element => element.classList.add("selected"));
                //       }
                //       sorter.onUnpaintRow = elements => {
                //         elements.forEach(element => element.classList.remove("selected"));
                //       }
                //
                //       node.children = values.map((value, index) => {
                //         return {
                //           class: "block-frame",
                //           update: frame => {
                //
                //             frame.element.classList.toggle("selected", Boolean(selection && selection.length && selection.index === index));
                //             frame.child = this.createChild({
                //               type: value.type || "group",
                //               index: index,
                //               value: value
                //             }).build();
                //           }
                //         }
                //       });
                //     }
                //   },

                //     // update: node => {
                //     //   node.children = this.resource.library.map((index) => {
                //     //     const thumbnail = this.getChild(index);
                //     //     return thumbnail.build();
                //     //   });
                //     // }
                //   }
                //
                //   // {
                //   //   class: "array-body",
                //   //   update: table => {
                //   //
                //   //     // const values = this.getValue();
                //   //     table.element.classList.toggle("hidden", Boolean(mixed));
                //   //     table.element.classList.toggle("loading", !values);
                //   //
                //   //     if (values && !mixed) {
                //   //
                //   //       table.element.classList.toggle("empty", values.length === 0);
                //   //
                //   //       const hasHeader = this.resource.children.some(column => column.header || column.label); // header is deprecated
                //   //
                //   //       let selection = this.getSelection();
                //   //
                //   //       if (selection && !selection.final) {
                //   //
                //   //         selection = undefined; // -> selection target a deeper field
                //   //
                //   //       }
                //   //
                //   //       const sorter = new KarmaFieldsAlpha.Sorter(table.element);
                //   //       sorter.colCount = this.resource.children.length;
                //   //       sorter.rowCount = values.length;
                //   //       sorter.selection = selection;
                //   //
                //   //       if (hasHeader) {
                //   //
                //   //         sorter.colHeader = 1;
                //   //       }
                //   //
                //   //       sorter.onselect = newSelection => {
                //   //
                //   //         if (!KarmaFieldsAlpha.Selection.compare(newSelection, selection)) {
                //   //
                //   //           selection = newSelection;
                //   //
                //   //           KarmaFieldsAlpha.Clipboard.focus();
                //   //
                //   //           this.setSelection(newSelection);
                //   //
                //   //           this.render();
                //   //
                //   //         }
                //   //
                //   //       }
                //   //
                //   //       sorter.onSelectionChange = newSelection => {
                //   //         this.setSelection(newSelection);
                //   //       }
                //   //
                //   //       sorter.onPaintRow = elements => {
                //   //         elements.forEach(element => element.classList.add("selected"))
                //   //       }
                //   //
                //   //       sorter.onUnpaintRow = elements => {
                //   //         elements.forEach(element => element.classList.remove("selected"))
                //   //       }
                //   //
                //   //
                //   //       sorter.onsort = () => {
                //   //
                //   //         // if (!KarmaFieldsAlpha.Selection.compare(sorter.selection, selection)) {
                //   //
                //   //           this.swap(selection.index, selection.length, sorter.selection.index);
                //   //
                //   //           selection = sorter.selection;
                //   //
                //   //           KarmaFieldsAlpha.Clipboard.focus();
                //   //
                //   //           this.setSelection(sorter.selection);
                //   //
                //   //           this.save("order");
                //   //
                //   //         // }
                //   //
                //   //       }
                //   //
                //   //       // table.element.onfocusin = event => {
                //   //       //
                //   //       //   console.log("array onfocusin ");
                //   //       //   this.render(); // unselect last field when input gains focus inside array
                //   //       // }
                //   //
                //   //       table.children = [
                //   //         ...this.resource.children.filter(column => values.length && hasHeader).map(column => {
                //   //           return {
                //   //             class: "th",
                //   //             init: th => {
                //   //               th.element.textContent = column.header || column.label || "";
                //   //             }
                //   //           };
                //   //         }),
                //   //         ...values.reduce((array, item, index) => {
                //   //
                //   //           const row = this.createChild({
                //   //             ...this.resource,
                //   //             index: index.toString(),
                //   //             id: index.toString(),
                //   //             type: "row"
                //   //           });
                //   //
                //   //           return [
                //   //             ...array,
                //   //             ...this.resource.children.map((column, colIndex) => {
                //   //
                //   //               const field = row.createChild({
                //   //                 id: colIndex,
                //   //                 ...column,
                //   //                 index: colIndex.toString()
                //   //               });
                //   //
                //   //               return {
                //   //                 class: "td array-cell karma-field-frame",
                //   //                 init: td => {
                //   //                   if (field.resource.style) {
                //   //                     td.element.style = field.resource.style;
                //   //                   }
                //   //                   if (field.resource.class) {
                //   //                     td.element.classList.add(field.resource.class);
                //   //                   }
                //   //                 },
                //   //                 update: td => {
                //   //                   td.element.classList.toggle("selected", Boolean(selection && KarmaFieldsAlpha.Selection.containRow(selection, index)));
                //   //                   td.child = field.build();
                //   //                 }
                //   //               };
                //   //             })
                //   //           ];
                //   //         }, [])
                //   //
                //   //       ];
                //   //
                //   //       table.element.style.gridTemplateColumns = this.resource.children.map(resource => resource.width || "1fr").join(" ");
                //   //
                //   //     }
                //   //
                //   //   }
                //   // },
                  // {
                  //   class: "array-footer",
                  //   update: node => {
                  //     // node.element.classList.toggle("hidden", Boolean(mixed));
                  //     // if (values && !mixed) {
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
                  //     // } else {
                  //     //   node.children = [];
                  //     // }
                  //   }
                  // }

                ];
              }
            },
            // {
            //   class: "mixed",
            //   update: node => {
            //     node.element.classList.toggle("hidden", !mixed);
            //     if (mixed) {
            //       node.children = [
            //         this.createChild({
            //           type: "textarea",
            //           // key: "mixed",
            //           index: "mixed"
            //         }).build()
            //       ];
            //     } else {
            //       node.children = [];
            //     }
            //   }
            // }

            {
              class: "editor-footer",
              update: node => {
                node.children = [
                  this.createChild({
                    type: "button",
                    title: "add tinymce",
                    action: "addText"
                  }).build(),
                  // this.createChild({
                  //   type: "button",
                  //   title: "add Branch",
                  //   action: "addBranch"
                  // }).build(),
                  this.createChild({
                    type: "button",
                    title: "add Group",
                    action: "addGroup"
                  }).build(),
                  this.createChild({
                    type: "button",
                    title: "add Gallery",
                    action: "addGalleryBlock"
                  }).build()
                ];
              }
            }
          ];

        }


      }
    };
  }

}

KarmaFieldsAlpha.field.blockEditor.block = class extends KarmaFieldsAlpha.field {

  // getValue(key) {
  //
  //   const object = this.parent.getBlockValue(this.resource.index) || {};
  //
  //   return KarmaFieldsAlpha.Type.toArray(object[key]);
  //
  // }
  //
  //
  // setValue(value, key) {
  //
  //   const object = this.parent.getBlockValue(this.resource.index) || {};
  //
  //   const clone = KarmaFieldsAlpha.DeepArray.cloneObject(object);
  //
  //   clone[key] = value;
  //
  //   this.parent.setValue(clone, this.resource.index);
  //
  // }

  import(items) {

    const string = items.shift();

    const grid = new KarmaFieldsAlpha.Grid(string);
    const values = grid.getColumn(0);

    // const ids = [...KarmaFieldsAlpha.Type.toArray(this.getValue())];
    //
    // ids.splice(index, length, ...newIds);
    //
    // this.setValue(ids);


    this.setBlockValue(clone);

  }

  getBlockValue(...path) {

    return this.parent.getBlockValue(this.resource.index, ...path);

  }

  getValue(key) {

    const object = this.getBlockValue() || {};

    if (key !== undefined) {

      return KarmaFieldsAlpha.Type.toArray(object[key]);

    }

    return object.children;

  }

  setValue(value, key) {

    const object = this.getBlockValue() || {};

    const clone = KarmaFieldsAlpha.DeepArray.cloneObject(object);

    clone[key] = value;

    this.setBlockValue(clone);

  }

  setBlockValue(value, ...path) {

    this.parent.setBlockValue(value, this.resource.index, ...path);

  }

  isSelected(index) {

    const selection = this.parent.getSelection() || {};

    return KarmaFieldsAlpha.Segment.contain(selection, this.resource.index);

    // return selection && selection.length && !this.getSelectionChild(selection) && KarmaFieldsAlpha.Segment.contain(selection, index);

  }

  setSelection(selection) {

    this.parent.setSelection(selection && {
      [this.resource.index]: selection,
      index: this.resource.index,
      length: 0
    });

  }

  getSelectionChild(selection = this.getSelection()) {

    if (selection) {




      // for (let i = 0; i < children.length; i++) {
      //
      //   if (selection[i]) {
      //
      //     return this.createChild({
      //       value: children[i],
      //       index: i,
      //       type: children[i].type
      //     });
      //
      //   }
      //
      // }

      const index = selection.index || 0;

      if (!selection.length && selection[index] && this.resource.children[index]) {

        const resource = this.resource.children[index];

        return this.createChild({
          ...resource,
          index: index
        });

      }

    }

  }

  paste(string, selection = this.getSelection()) { // -> same as base method

    const child = this.getSelectionChild(selection);

    if (child) {

      return child.paste(string, selection[child.resource.index]);

    } else if (selection.length) {

      this.import([string]);

    }

  }



  buildContent() {

    return this.resource.children.map((resource, index) => {
      return this.createChild({
        ...resource,
        index: index
      }).build()
    });

  }


  build() {

    return {
      class: "block",
      init: node => {
        if (this.resource.class) {
          node.element.classList.add(this.resource.class);
        }
      },
      update: node => {
        const isSelected = this.isSelected(this.resource.index);
        node.element.classList.toggle("selected", Boolean(isSelected));
      },
      children: [
        {
          class: "block-header",
          children: [
            {
              class: "block-title",
              update: node => {
                node.element.innerHTML = this.resource.title || "Block";
              }
            },
            {
              class: "block-icon dashicons dashicons-block-default"
            }
          ]
        },
        {
          class: "block-body",
          children: this.buildContent()
        }
      ]
    };

  }

}

KarmaFieldsAlpha.field.blockEditor.blockGallery = class extends KarmaFieldsAlpha.field.blockEditor.block {

  constructor(resource) {

    super({
      ...resource,
      title: "Gallery",
      class: "files-block",
      children: [
        {
          type: "files",
          key: "files",
          uploader: "wp",
          controls: false
        }
      ]
    });
  }

}

KarmaFieldsAlpha.field.blockEditor.blockTinymce = class extends KarmaFieldsAlpha.field.blockEditor.block {

  constructor(resource) {

    super({
      ...resource,
      title: "Rich Text",
      class: "tinymce-block",
      children: [
        {
          type: "tinymce",
          key: "content"
        }
      ]
    });
  }

}


KarmaFieldsAlpha.field.blockEditor.columns = class extends KarmaFieldsAlpha.field.blockEditor.block {

  constructor(resource) {

    super({
      title: "Group",
      class: "block-group",
      ...resource
    });

  }

  addValue(value) {

    const children = this.getValue("children");

    this.setValue([...children, value], "children");

  }




  swap(index, newIndex, length, path, newPath) {

    this.parent.swap(index, newIndex, length, path, newPath);

  }

  remove(index, length, ...path) {

    this.parent.remove(index, length, this.resource.index, ...path);

  }

  delete(selection = this.getSelection()) {

    const child = this.getSelectionChild(selection);

    if (child) {

      child.delete(selection[child.resource.index]);

    } else if (selection) {

      this.remove(selection.index || 0, selection.length || 0);

    }

  }

  getSelectionChild(selection = this.getSelection()) {

    if (selection) {

      const index = selection.index || 0;

      if (!selection.length && selection[index]) {

        const value = this.getBlockValue() || {};
        const children = value.children || [];

        return this.createChild({
          value: children[index],
          index: selection.index,
          type: children[index].type
        });

      }

    }

  }



  buildContent() {

    return [{
      tag: "ul",
      class: "block-columns",
      // init: ul => {
      //   if (this.resource.classes) {
      //     ul.element.classList.add(...this.resource.classes);
      //   }
      // },
      update: ul => {
        // ul.element.classList.toggle("selected", Boolean(this.resource.selected));

        const value = this.getBlockValue() || {};
        const children = value.children || [];

        if (children && children !== KarmaFieldsAlpha.loading) {

          ul.children = children.map((child, index) => {

            const column = this.createChild({
              type: "column",
              // children: child.children,
              value: child,
              index: index,
              path: [...this.resource.path, this.resource.index],
            });

            return column.build();

          });

        }

      }
    }];
  }

  // build() {
  //
  //   return {
  //     class: "block block-group",
  //     children: [
  //       {
  //         class: "block-header",
  //         children: [
  //           {
  //             class: "block-title",
  //             update: node => {
  //               node.element.innerHTML = "Group";
  //             }
  //           },
  //           {
  //             class: "block-icon dashicons dashicons-block-default"
  //           }
  //         ]
  //       },
  //       {
  //         class: "block-body",
  //         child: {
  //           tag: "ul",
  //           class: "block-columns fork",
  //           init: ul => {
  //             if (this.resource.classes) {
  //               ul.element.classList.add(...this.resource.classes);
  //             }
  //           },
  //           update: ul => {
  //             ul.element.classList.toggle("selected", Boolean(this.resource.selected));
  //
  //             const value = this.getBlockValue() || {};
  //             const children = value.children || [];
  //
  //             if (children && children !== KarmaFieldsAlpha.loading) {
  //
  //               ul.children = children.map((child, index) => {
  //
  //                 const column = this.createChild({
  //                   type: "column",
  //                   // children: child.children,
  //                   value: child,
  //                   index: index,
  //                   path: [...this.resource.path, this.resource.index],
  //                 });
  //
  //                 return column.build();
  //
  //               });
  //
  //             }
  //
  //           }
  //         }
  //       }
  //     ]
  //   };
  //
  // }

}



KarmaFieldsAlpha.field.blockEditor.column = class extends KarmaFieldsAlpha.field.blockEditor.columns {

  // getLength() {
  //
  //   if (this.resource.value && this.resource.value.children) {
  //
  //     return this.resource.value.children.length;
  //
  //   }
  //
  //   return 0;
  // }

  // getLength() {
  //
  //   return this.parent.getLength(this.resource.index);
  //
  //   return this.getValue("children").length;
  // }

  // getValue(...path) {
  //
  //   return this.parent.getValue(this.resource.index, ...path);
  // }



  // setValue(value, index) {
  //
  //   const clone = KarmaFieldsAlpha.DeepArray.cloneObject(this.resource.value || {});
  //
  //   if (!clone.children) {
  //
  //     clone.children = [];
  //
  //   }
  //
  //   clone.children[index] = value;
  //
  //   this.parent.setValue(clone, this.resource.index);
  //
  // }

  // setValue(value, ...path) {
  //
  //   this.parent.setValue(value, this.resource.index, ...path);
  //
  // }

  copy(selection = this.getSelection()) {

    if (selection && selection.length) {

      const [value] = this.export([], selection.index || 0, selection.length || 0);

      return value;

    } else {

      return super.copy(selection);

    }

  }

  paste(string, selection = this.getSelection()) { // -> same as base method

    const child = this.getSelectionChild(selection);

    if (child) {

      return child.paste(string, selection[child.resource.index]);

    } else if (selection.length) {

      // const value = this.getBlockValue() || {};
      // const children = value.children || [];

      this.import([string], selection.index || 0, selection.length);

      // const grid = new KarmaFieldsAlpha.Grid(string);
      // const values = grid.getColumn(0);
      //
      // // -> todo: add or remove items
      //
      // for (let i = 0; i < selection.length; i++) {
      //
      //   const index = (selection.index || 0) + i;
      //
      //   if (children[index] && values.length < i) {
      //
      //     this.createChild({
      //       value: children[index],
      //       index: index,
      //       type: children[index].type
      //     }).import(items);
      //
      //   }
      //
      // }

    }

  }

  export(items = [], index = 0, length = 999999) {

    const value = this.getBlockValue() || {};
    let values = value.children || [];

    values = values.slice(index, index + length);
    values = values.map(value => JSON.stringify(value));

    const grid = new KarmaFieldsAlpha.Grid();
    grid.addColumn(values);

    items.push(grid.toString());

    return items;

	}

  import(items, index = 0, length = 999999) {

    const string = items.shift();

    const grid = new KarmaFieldsAlpha.Grid(string);
    let values = grid.getColumn(0);

    values = values.map(value => JSON.parse(value));

    if (values.some(value => typeof value !== "object")) {

      // -> ?

    } else {

      // const newValues = [...this.getValue()];

      let value = this.getBlockValue() || {};

      value = KarmaFieldsAlpha.DeepObject.clone(value);

      value.chilren = (value.children || []).splice(index, length, ...values);

      this.setBlockValue(value);

    }

	}



  build() {

    return {
      tag: "li",
      class: "block-branch dropzone block-column",
      init: li => {
        if (this.resource.classes) {
          li.element.classList.add(...this.resource.classes);
        }
      },
      update: li => {
        // const value = this.resource.value || {};
        // const children = value.children || [];


        // const children = this.getValue();

        const value = this.getBlockValue() || {};
        const children = value.children || [];


        // console.log(children, value, this.resource.value);

        if (!children || children === KarmaFieldsAlpha.loading) {

          return;

        }

        li.element.style.height = "auto";
        const path = this.resource.path || [];
        const sorter = new KarmaFieldsAlpha.BlockSorter(li.element);
        let selection = this.getSelection();

        sorter.colCount = 1;
        sorter.rowCount = children.length;
        sorter.currentSelection = selection;
        sorter.selection = selection;
        sorter.path = [...path, this.resource.index];
        sorter.maxDepth = 10000;

        sorter.onselect = newSelection => {
          this.setSelection(newSelection);
          KarmaFieldsAlpha.Clipboard.focus();
          this.save("nav");
          this.render();
        }

        sorter.onsort = (index, newIndex, length, path, newPath) => {
          this.parent.request("completeSwap");
          KarmaFieldsAlpha.Clipboard.focus();
          this.save("swap");
          this.render();
        }

        sorter.onSwap = (index, newIndex, length, path, newPath) => {
          this.swap(index, newIndex, length, path, newPath);
        }

        sorter.onSelectionChange = newSelection => {
          this.setSelection(newSelection);
        }

        sorter.onPaintRow = elements => {
          elements.forEach(element => element.classList.add("selected"))
        }

        sorter.onUnpaintRow = elements => {
          elements.forEach(element => element.classList.remove("selected"))
        }


        li.children = children.map((child, index) => {
          const column = this.createChild({
            type: child.type,
            depth: (this.resource.depth || 0) + 1,
            index: index,
            path: [...this.resource.path, this.resource.index],
            value: child,
            // children: child.children,
            // values: child.children,
            selected: this.isSelected(index, selection)
          });

          return column.build();

          // return {
          //   tag: "li",
          //   class: "block-frame",
          //   update: li => {
          //
          //     const isSelected = this.isSelected(selection, index);
          //
          //
          //     li.element.classList.toggle("selected", Boolean(isSelected));
          //   },
          //   child: branch.build()
          // };
        });
      }
    };
  }

}

KarmaFieldsAlpha.field.blockEditor.branch = class extends KarmaFieldsAlpha.field.blockEditor.column {}; // compat

KarmaFieldsAlpha.field.blockEditor.test = class extends KarmaFieldsAlpha.field {

  build() {
    return {
      class: "test-block block",
      update: node => {
        node.element.classList.toggle("selected", Boolean(this.resource.selected));

        node.element.innerHTML = this.resource.value || "0";
      }
    };
  }

}
