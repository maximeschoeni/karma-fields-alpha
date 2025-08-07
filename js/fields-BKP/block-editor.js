
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

  constructor(resource) {

    super({
      library: [
        {
          type: "blockTinymce",
          label: "Tinymce"
        },
        {
          label: "Columns",
          type: "columns",
          children: [
            {type: "column"}
          ]
        },
        {
          label: "Gallery",
          type: "blockGallery"
        }
      ],
      ...resource
    });

  }


  getBlockValue(...path) {

    const array = this.getValue();

    if (!array || array === KarmaFieldsAlpha.loading) {

      return KarmaFieldsAlpha.loading;

    }

    return KarmaFieldsAlpha.DeepArray.get(array, ...path);

  }

  getValue() {

    const values = super.getValue();

    // console.log("getValue", values);

    if (values && values !== KarmaFieldsAlpha.loading) {

      if (Array.isArray(values[0])) {

        // values[0] = {children: this.parseBlocks(values[0])};
        const wpBlocks = this.parseBlocks(values[0]);

        // values[0] = {children: wpBlocks};

        console.log("get", [{children: wpBlocks}]);

        return [{children: wpBlocks}];
      }

    }

    return values;

  }

  setValue(value) {

    // value = value[0].children.map(value => this.formatBlock(value));
    //
    // value = [value];
    //
    // console.log("set", value);

    super.setValue(value);

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

    const array = this.getValue();

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



  // export(items = [], index = 0, length = 999999, colIndex = 0, colLength = 999999) {
  //
  //   const values = this.getValue();
  //
  //   if (values) {
  //
  //     if (values[0] === KarmaFieldsAlpha.mixed) {
  //
  //       return items;
  //
  //     }
  //
  //     const grid = new KarmaFieldsAlpha.Grid();
  //     const columns = this.resource.children.slice(colIndex, colIndex + colLength);
  //
  //     for (let i = 0; i < Math.min(values.length - index, length); i++) {
  //
  //       const rowField = this.createChild({
  //         type: "row",
  //         index: i + index,
  //         children: columns
  //       });
  //
  //       const rowItems = rowField.export();
  //
  //       grid.addRow(rowItems);
  //
  //     }
  //
  //     items.push(grid.toString());
  //
  //   }
  //
  //   return items;
  //
  // }
  //
  // import(items, index = 0, length = 999999, colIndex = 0, colLength = 999999) {
  //
  //   const string = items.shift();
  //
  //   if (string) {
  //
  //     const grid = new KarmaFieldsAlpha.Grid(string);
  //
  //     const columns = this.resource.children.slice(colIndex, colIndex + colLength);
  //
  //     const values = [...this.getValue()];
  //
  //     values.splice(index, length, ...grid.array.map(() => this.getDefault()));
  //
  //     this.setValue(values);
  //
  //     for (let i = 0; i < grid.array.length; i++) {
  //
  //       const child = this.createChild({
  //         children: columns,
  //         type: "row",
  //         index: i + index
  //       });
  //
  //       const rowItems = grid.getRow(i);
  //
  //       child.import(rowItems);
  //
  //     }
  //
  //   }
  //
  // }


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

  getChild(index) {

    const values = this.getValue();

    const selection = this.getSelection();

    if (index === 0 && values && values !== KarmaFieldsAlpha.loading) {

      // return this.createChild({
      //   children: values,
      //   index: 0,
      //   type: "column"
      // });


      return this.createChild({
        type: "column",
        // value: values[0],
        ...values[0],
        depth: 0,
        index: 0,
        path: [],
        selection: selection && selection.child
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

      this.render();

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

      // const selection = {length: 1, index: 0};
      //
      // KarmaFieldsAlpha.DeepObject.set(selection, {final: true, index: newIndex, length: length}, ...newPath);
      //
      // this.setSelection(selection);

      values = KarmaFieldsAlpha.DeepArray.clone(values);

      const transferedItems = KarmaFieldsAlpha.DeepArray.splice(values, length, [], ...path, index);


      if (newPath[newPath.length-1] < 0) { // need new column on the left

        const parentPath = newPath.slice(0, -1);
        const parent = KarmaFieldsAlpha.DeepArray.get(values, ...parentPath);

        KarmaFieldsAlpha.DeepArray.set(values, {...parent, children: [{...parent.children[0], children: []}, ...parent.children]}, ...parentPath);

        newPath[newPath.length-1] = 0;

      }

      KarmaFieldsAlpha.DeepArray.splice(values, 0, transferedItems, ...newPath, newIndex);

        // debugger;

      // -> clean empty columns
      const parentPath = newPath.slice(0, -1);
      const parent = KarmaFieldsAlpha.DeepArray.get(values, ...parentPath);

      if (parent && parent.children && parent.children.length > 1) {

        parent.children = parent.children.filter(item => item.children.length > 0);

      }








      this.setValue(values);

      this.render();

    }

  }

  setAbsoluteSelection(selection, ...path) {

    // while (path.length) {
    //
    //   const index = path.pop();
    //
    //   selection = {
    //     index: index,
    //     length: 0,
    //     [index]: selection
    //   };
    //
    // }
    //
    // this.setSelection(selection);

    while (path.length) {

      const index = path.pop();

      selection = {
        childId: index,
        child: selection
      };

    }

    this.setSelection(selection);

  }



  async addBlock(resource) {

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

      await this.render();

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


  async addText() {

    await this.addBlock({
      type: "blockTinymce"
    });

  }

  async addGroup() {

    await this.addBlock({
      type: "columns",
      children: [
        {type: "column"},
        {type: "column"}
      ]
    });

  }

  async addGalleryBlock() {

    await this.addBlock({
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

  formatBlock(block) {

    const wpBlock = {};

    switch (block.type) {
      case "blockTinymce":
        wpBlock.blockName = "core/classic";
        wpBlock.attrs = {};
        wpBlock.innerBlocks = [];
        wpBlock.innerHTML = block.content || "";
        wpBlock.innerContent = [wpBlock.innerHTML];
        break;

      case "blockGallery":
        wpBlock.blockName = "core/image";
        wpBlock.attrs = {
          id: block.files[0],
          width: 448,
          height: 297,
          sizeSlug: "large",
          linkDestination: "custom",
          className: "is-style-default"
        };
        wpBlock.innerBlocks = [];
        wpBlock.innerHTML = "<figure><img></figure>";
        wpBlock.innerContent = "<figure><img></figure>";
        break;

      case "columns":
        wpBlock.blockName = "core/columns";
        wpBlock.attrs = {};
        wpBlock.innerBlocks = (block.children || []).map(child => this.formatBlock(child));
        // wpBlock.innerHTML = "";
        // wpBlock.innerContent = "";
        break;


      case "column":
        wpBlock.blockName = "core/column";
        wpBlock.attrs = {};
        wpBlock.innerBlocks = (block.children || []).map(child => this.formatBlock(child));
        // wpBlock.innerHTML = "";
        // wpBlock.innerContent = "";
      break;

    }

    return wpBlock;

  }




  // toBlock(wpBlock) {
  //
  //   const block = {};
  //
  //   if (wpBlock.blockName === "core/classic") {
  //
  //     block.type = "blockTinymce";
  //     block.content = wpBlock.innerHTML || "";
  //
  //   } else if (wpBlock.blockName === "core/image") {
  //
  //     block.type = "blockGallery";
  //
  //     if (wpBlock.attrs && wpBlock.attrs.id) {
  //
  //       block.files = [wpBlock.attrs.id];
  //
  //     }
  //
  //   } else if (wpBlock.blockName === "core/columns") {
  //
  //     block.type = "columns";
  //     block.children = (wpBlock.innerBlocks || []).map(wpBlockChild => this.toBlock(wpBlockChild));
  //
  //   } else if (wpBlock.blockName === "core/column") {
  //
  //     block.type = "column";
  //     block.children = (wpBlock.innerBlocks || []).map(wpBlockChild => this.toBlock(wpBlockChild));
  //
  //   }
  //
  //   return block;
  //
  // }

  parseBlock(wpBlock) {

    const block = {};

    switch (wpBlock.blockName) {

      case "core/paragraph":
      case "core/quote":
      case "core/classic":
        block.type = "blockTinymce";
        block.content = wpBlock.innerHTML || "";
        break;

      case "core/image":
        block.type = "blockGallery";
        block.files = wpBlock.attrs && wpBlock.attrs.id && [wpBlock.attrs.id] || [];
        break;

      case "core/columns":
        block.type = "columns";
        block.children = this.parseBlocks(wpBlock.innerBlocks || []); // .map(wpBlockChild => this.parseBlock(wpBlockChild));
        break;

      case "core/column":
        block.type = "column";
        block.children = this.parseBlocks(wpBlock.innerBlocks || []); //.map(wpBlockChild => this.parseBlock(wpBlockChild));
        break;

      // default:
      //   block.type = "blockTinymce";
      //   // block.content = "????";
      //   break;

    }

    return block;

  }

  parseBlocks(wpBlocks) {

    return wpBlocks.map(wpBlockChild => this.parseBlock(wpBlockChild)).filter(wpBlockChild => wpBlockChild.type);

    // const array = [];
    //
    // for (let block of wpBlocks) {
    //
    //   if (block.type) {
    //
    //     array.push
    //
    //   }
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

          // console.log("getValue", values);

          // if (Array.isArray(values[0])) {
          //
          //   // values[0] = {children: this.parseBlocks(values[0])};
          //   const wpBlocks = this.parseBlocks(values[0]);
          //
          //   values[0] = {children: wpBlocks};
          // }





          // const mixed = values[0] === KarmaFieldsAlpha.mixed;

          // const value = values[0] || {};

          // console.log(values[0]);

          node.children = [
            {
              tag: "ul",
              class: "block-columns block-root",
              child: this.createChild({
                type: "column",
                // value: values[0],
                ...values[0],
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

                const sorter = new KarmaFieldsAlpha.ListSortBlockLibrary(node.element);

                sorter.onDragBegin = index => {

                  // this.addGalleryBlock();

                  // this.addBlock({
                  //   type: "blockGallery"
                  // });

                  this.addBlock(this.resource.library[index]);

                  const values = this.getValue();

                  if (typeof values !== "symbol" && values[0] && values[0].children) {

                    const selection = {index: values[0].children.length - 1, length: 1};

                    this.setSelection({child: selection, childId: 0});

                    sorter.state = {
                      selection: selection,
                      path: [0]
                    };

                    sorter.container = node.element.previousElementSibling.querySelector(".block-column");

                    const placeholder = document.createElement("div");
                    placeholder.className = "block";

                    sorter.container.appendChild(placeholder);

                    sorter.children = null;

                    sorter.originY = sorter.container.clientHeight - node.element.offsetTop + 35;

                    sorter.originPosition = sorter.getPosition([placeholder]);
                    sorter.lastPosition = sorter.originPosition;

                  }




                };

                sorter.onSelect = elements => {

                  elements.map(element => element.classList.add("selected"));

                  this.setAbsoluteSelection(sorter.state.selection, ...sorter.state.path);

                }

                sorter.onUnselect = elements => {

                  elements.map(element => element.classList.remove("selected"));

                }

                sorter.onSwap = (newState, lastState) => {

                  this.swap(lastState.selection.index, newState.selection.index, newState.selection.length, lastState.path, newState.path);

                };

                sorter.onSort = (newState, lastState) => {

                  this.deferFocus();
                  this.save("order");
                  this.render();

                }

                // node.children = [
                //   {
                //     class: "library-tile",
                //     update: tile => {
                //       tile.element.innerHTML = "add tinymce";
                //     }
                //   },
                //   {
                //     class: "library-tile",
                //     update: tile => {
                //       tile.element.innerHTML = "add Group";
                //     }
                //   },
                //   {
                //     class: "library-tile",
                //     update: tile => {
                //       tile.element.innerHTML = "add Gallery";
                //     }
                //   }
                //
                // ];

                node.children = this.resource.library.map(resource => {
                  return {
                    class: "library-tile",
                    children: [
                      {
                        class: "block-icon dashicons dashicons-block-default"
                      },
                      {
                        class: "title",
                        update: tile => {
                          tile.element.innerHTML = resource.label;
                        }
                      }
                    ]
                  };
                });


                // node.children = [
                //   this.createChild({
                //     type: "button",
                //     title: "add tinymce",
                //     action: "addText"
                //   }).build(),
                //   this.createChild({
                //     type: "button",
                //     title: "add Group",
                //     action: "addGroup"
                //   }).build(),
                //   this.createChild({
                //     type: "button",
                //     title: "add Gallery",
                //     action: "addGalleryBlock"
                //   }).build()
                // ];
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

    // const selection = this.parent.getSelection() || {};
    //
    // return selection && !selection[selection.index] && KarmaFieldsAlpha.Segment.contain(selection, index);


    const selection = this.parent.getSelection();

    if (selection && !selection.child) {

      return KarmaFieldsAlpha.Segment.contain(selection, index);

    }

    return false;

  }

  // setSelection(selection) {
  //
  //   // this.parent.setSelection(selection && {
  //   //   [this.resource.index]: selection,
  //   //   index: this.resource.index,
  //   //   length: 0
  //   // });
  //
  //
  //
  // }

  getSelectionChild(selection = this.getSelection()) {
console.error("deprecated");
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

  getChild(index) {

    if (this.resource.children && this.resource.children[index]) {

      return this.createChild({
        ...this.resource.children[index],
        index: index
      });

    }

    // const child = this.resource.children && this.resource.children[index];
    //
    // if (child) {
    //
    //   // const resource = value.children && value.children[index];
    //   //
    //   // if (resource) {
    //
    //     return this.createChild({
    //       // ...resource,
    //       // value: value.children[index],
    //       ...child,
    //       index: index,
    //       path: [...this.resource.path, index],
    //       selection: this.resource.selection && this.resource.selection[index]
    //     });
    //
    //   // }
    //
    // }


  }

  paste(string, selection = this.getSelection()) { // -> same as base method

    // if (selection) {
    //
    //   if (selection[selection.index]) {
    //
    //     const child = this.getChild(selection.index);
    //
    //     if (child) {
    //
    //       return child.paste(string, selection[selection.index]);
    //
    //     }
    //
    //   } else if (selection.length) {
    //
    //     this.import([string]);
    //
    //   }
    //
    // }

    // if (selection && !selection[selection.index]) {
    //
    //   this.import([string]);
    //
    // } else {
    //
    //   super.paste(string, selection);
    // }

    if (selection) {

      if (!selection.child) {

        this.import([string]);

      } else {

        super.paste(string, selection);

      }

    }

  }

  setAbsoluteSelection(selection, ...path) {

    this.parent.setAbsoluteSelection(selection, ...path);

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

    this.render();

  }




  swap(index, newIndex, length, path, newPath) {

    this.parent.swap(index, newIndex, length, path, newPath);

  }

  remove(index, length, ...path) {

    this.parent.remove(index, length, this.resource.index, ...path);

  }

  delete(selection = this.getSelection()) {

    // if (selection && !selection[selection.index]) {
    //
    //   this.remove(selection.index || 0, selection.length || 0);
    //
    // } else {
    //
    //   super.delete(selection);
    //
    // }

    if (selection) {

      if (!selection.child) {

        this.remove(selection.index || 0, selection.length || 0);

      } else {

        super.delete(selection);

      }

    }

  }

  getChild(index) {

    const resource = this.resource.value && this.resource.value.children && this.resource.value.children[index];

    if (resource) {

      return this.createChild({
        ...resource, // type + children
        type: "column",
        depth: (this.resource.depth || 0) + 1,
        index: index,
        path: [...this.resource.path, this.resource.index],
        value: resource.value,

        selection: this.resource.selection && this.resource.child

      });

    }



  }

  getSelectionChild(selection = this.getSelection()) {
    console.error("deprecated");
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

      update: ul => {


        // if (this.resource.children) {
        if (this.resource.value && this.resource.value.children) {

          ul.children = this.resource.value.children.map((child, index) => {

            // const column = this.createChild({
            //   type: "column",
            //   value: child,
            //   // ...child,
            //   index: index,
            //   path: [...this.resource.path, this.resource.index],
            //   selection: this.resource.selection && this.resource.selection[index]
            // });

            const column = this.getChild(index);

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

  getChild(index) {

    const resource = this.resource.children && this.resource.children[index];

    if (resource) {

      return this.createChild({
        // type: "block",
        ...resource, // type + children
        depth: (this.resource.depth || 0) + 1,
        index: index,
        path: [...this.resource.path, this.resource.index],
        value: resource,



        selection: this.resource.selection && this.resource.selection.child
        // children: child.children,
        // values: child.children,
        // selected: this.isSelected(index, selection)
      });

    }

  }

  copy(selection = this.getSelection()) {

    // if (selection && !selection[selection.index]) {
    //
    //   const [value] = this.export([], selection.index || 0, selection.length || 0);
    //
    //   return value;
    //
    // } else {
    //
    //   return super.copy(selection);
    //
    // }

    if (selection && !selection.child) {

      const [value] = this.export([], selection.index || 0, selection.length || 0);

      return value;

    } else {

      return super.copy(selection);

    }

  }

  paste(string, selection = this.getSelection()) { // -> same as base method

    // if (selection && !selection[selection.index]) {
    //
    //   this.import([string], selection.index || 0, selection.length);
    //
    // } else {
    //
    //   return super.paste(string, selection);
    //
    // }



    if (selection && !selection.child) {

      this.import([string], selection.index || 0, selection.length);

    } else {

      return super.paste(string, selection);

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

        // const value = this.getBlockValue() || {};
        // const value = this.resource.value || {};
        // const children = value.children || [];
        //
        //
        // // console.log(children, value, this.resource.value);
        //
        // if (!children || children === KarmaFieldsAlpha.loading) {
        //
        //   return;
        //
        // }

        li.element.style.height = "auto";
        const path = this.resource.path || [];

        let selection = this.getSelection();

        // const sorter = new KarmaFieldsAlpha.BlockSorter(li.element);


        // sorter.colCount = 1;
        // sorter.rowCount = children.length;
        // sorter.currentSelection = selection;
        // sorter.selection = selection;
        // sorter.path = [...path, this.resource.index];
        // sorter.maxDepth = 10000;
        //
        // sorter.onselect = newSelection => {
        //   this.setSelection(newSelection);
        //   // KarmaFieldsAlpha.Clipboard.focus();
        //   this.deferFocus();
        //   this.save("nav");
        //   this.render();
        // }
        //
        // sorter.onsort = (index, newIndex, length, path, newPath) => {
        //   this.parent.request("completeSwap");
        //   // KarmaFieldsAlpha.Clipboard.focus();
        //   this.deferFocus();
        //   this.save("swap");
        //   this.render();
        // }
        //
        // sorter.onSwap = (index, newIndex, length, path, newPath) => {
        //   this.swap(index, newIndex, length, path, newPath); // -> will render.
        // }
        //
        // sorter.onSelectionChange = newSelection => {
        //   this.setSelection(newSelection);
        // }
        //
        // sorter.onPaintRow = elements => {
        //   elements.forEach(element => element.classList.add("selected"))
        // }
        //
        // sorter.onUnpaintRow = elements => {
        //   elements.forEach(element => element.classList.remove("selected"))
        // }


        const sorter = new KarmaFieldsAlpha.ListSortBlock(li.element, selection, ...path, this.resource.index);

        sorter.onSelect = elements => {

          elements.map(element => element.classList.add("selected"));

          this.setAbsoluteSelection(sorter.state.selection, ...sorter.state.path);

        }

        sorter.onUnselect = elements => {

          elements.map(element => element.classList.remove("selected"));

        }

        sorter.onSelectionComplete = () => {

          this.deferFocus();
          this.render();

        }

        sorter.onSwap = (newState, lastState) => {

          this.swap(lastState.selection.index, newState.selection.index, newState.selection.length, lastState.path, newState.path);

        };

        sorter.onSort = (newState, lastState) => {

          this.deferFocus();
          this.save("order");
          this.render();

        }



        const children = this.resource.children || [];

        li.children = children.map((child, index) => {
          // const column = this.createChild({
          //   type: child.type,
          //   depth: (this.resource.depth || 0) + 1,
          //   index: index,
          //   path: [...this.resource.path, this.resource.index],
          //   value: child,
          //
          //   // ...child, // -> type + children
          //
          //
          //   selection: this.resource.selection && this.resource.selection[index]
          // });

          const column = this.getChild(index);

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
