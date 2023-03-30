
KarmaFieldsAlpha.field.layout.arrangement = class extends KarmaFieldsAlpha.field.layout.collection {

  // async swap(index, length, target) {

  //   const ids = this.getIds();
  //   const clones = [...ids];
  //   const slice = clones.splice(index, length);
  //   clones.splice(target, 0, ...slice);

  //   for (let i in clones) {
  //     await this.setValue(i, clones[i], this.resource.orderby || "menu_order");
  //   }

  //   this.idsBuffer.set(clones);

  // }

  // async createTree(ids) {

  //   const map = {};

  //   // for (let id of ids) {
  //   for (let i = 0; i < ids.length; i++) {

  //     const id = ids[i];
  //     const alias = this.resource.alias || {};
  //     const [parent] = await this.getValue(id, alias.parent || "parent") || [];
  //     const [order] = await this.getValue(id, alias.order || "order") || [];

  //     map[id] = {
  //       children: [],
  //       parent: parent,
  //       id: id,
  //       order: order,
  //       i: i
  //     };

  //   }

  //   for (let id in map) {

  //     const item = map[id];
  //     const parent = item.parent || "0";

  //     if (!map[parent]) {

  //       map[parent] = {
  //         children: [],
  //         id: parent
  //       };

  //     }

  //     map[parent].children.push(item);

  //   }

  //   return map["0"];

  // }

  async createTree() {

    const ids = this.getIds();
    const map = {};
    const root = new KarmaFieldsAlpha.Tree("0");
    const alias = this.resource.alias || {};

    for (let id of ids) {

        const [parent] = await this.getValue(id, alias.parent || "parent") || [];
        // const [order] = await table.getValue(id, alias.order || "order") || [];
       
        map[id] = new KarmaFieldsAlpha.Tree(id, parent); //, parseInt(order));

    }

    for (let id of ids) {

      const tree = map[id];
      const parent = map[tree.parent];

      if (parent) {

        parent.children.push(tree);

      } else {

        root.children.push(tree);

      }

    }

    return root;

}

  // getBranch(tree, ...path) {

  //   if (path.length) {

  //     const index = path.shift();

  //     return this.getBranch(tree.children[index]);

  //   }

  //   return tree;
  // }

  async swap(path, newPath, length) {

    const tree = await this.createTree();

    tree.swap(path, newPath, length);

    const items = tree.flatten();
    const parentParam = this.getAlias("parent");
    const orderParam = this.getAlias("order");

    for (let i = 0; i < items.length; i++) {

      const item = items[i];

      const [parent] = await this.getValue(item.id, parentParam) || [];
      const [order] = await this.getValue(item.id, orderParam) || [];

      if ((parent || "0") !== item.parent) {

        // console.log(parent, item.parent);

        await this.setValue(item.parent, item.id, parentParam);

      }

      if (parseInt(order) !== i) {

        // console.log(order, i);

        await this.setValue(i.toString(), item.id, orderParam);

      }

    }

    const ids = items.map(item => item.id);


    this.idsBuffer.set(ids);

    // const ids = this.getIds();
    // const tree = await this.createTree(ids);
    // const originIndex = path.pop();
    // const originBranch = this.getBranch(tree, ...path);
    // const transferIds = originBranch.children.map(item => item.id).slice(originIndex, length);
    // const originIds = [...originBranch.children.map(item => item.id).slice(0, originIndex), ...originBranch.children.map(item => item.id).slice(originIndex+length)];
    // const destIndex = newPath.pop();
    // const destBranch = this.getBranch(tree, ...newPath);
    // const destIds = [...destBranch.children.map(item => item.id).slice(0, destIndex), ...transferIds, ...destBranch.children.map(item => item.id).slice(destIndex+length)];

    // for (let i in originIds) {

    //   await this.setValue(i, originIds, this.resource.orderby || "menu_order");

    // }

    // for (let i in destIds) {

    //   await this.setValue(i, destIds, this.resource.orderby || "menu_order");

    // }



    // const ids = this.getIds();
    // const clones = [...ids];
    // const slice = clones.splice(index, length);
    // clones.splice(target, 0, ...slice);

    // for (let i in clones) {
    //   await this.setValue(i, clones[i], this.resource.orderby || "menu_order");
    // }

    // this.idsBuffer.set(clones);

  }

  async getSelectedIds(selection) {

    if (!selection) {

      selection = KarmaFieldsAlpha.Selection.get();

    }

    if (selection) {

      const tree = await this.createTree();

      return tree.slice(selection).map(item => item.id)

      // const ids = this.getIds();

      // const tree = await this.createTree(ids);

      // const pickIds = (tree, selection) => {
      //   if (selection.length) {
      //     return tree.children.slice(selection.index, selection.index + selection.length).map(node => node.id);
      //   } else {
      //     let ids = [];
      //     for (let index in selection) {
      //       ids = [...ids, ...pickIds(tree.children[index], selection[index])];
      //     }
      //     return ids;
      //   }
      // };

      // return pickIds(tree, selection);

    }

    return [];
  }

  async exportSelection() {

    const selection = this.selectionBuffer.get();

    if (selection) {

      return this.export(selection.index, selection.length);

    }

    return {};
  }

  async export(index = 0, length = -1, format = null) {

    const ids = this.getIds();

    if (length === -1) {
      
      length = ids.length - index;

    }

    const slice = ids.slice(index, index + length);

    const rows = [];

    for (let id of slice) {

      const rowField = this.createChild({
        children: this.resource.children,
        key: id,
        type: "row"
      });

      let rowData = await rowField.export();

      if (this.resource.modal) {

        const modal = this.createChild({
          ...this.resource.modal,
          key: id,
          type: "row"
        });

        const modalData = await modal.export();

        rowData = {...rowData, ...modalData};

      }


      rows.push(rowData);
    }

    switch (format || this.resource.export_format || this.resource.import_format) {

      case "csv":
        const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(rows);
        return KarmaFieldsAlpha.Clipboard.unparse(dataArray);

      case "json":
      default:
        return JSON.stringify(rows);
     
    }

  }

  // buildNode(node, index, depth) {

  //   return {
  //     tag: "li",
  //     class: "arrangement-item",
  //     update: li => {
  //       li.element.classList.toggle("empty", node.children.length === 0);
  //     },
  //     children: [
  //       {
  //         tag: "ul",
  //         class: "arrangement-item-header",
  //         update: header => {
  //           const row = this.createChild({
  //             key: node.id,
  //             type: "row",
  //             children: this.resource.children || [],
  //             index: index,
  //             depth: depth
  //           });
  //           header.children = row.resource.children.map(child => {
  //             return {
  //               tag: "li",
  //               child: row.createChild(child).build()
  //             }
  //           });
  //         }
  //       },
  //       {
  //         tag: "ul",
  //         class: "arrangement-item-body",
  //         children: node.children.map((child, index) => {
  //           return this.buildNode(child, index, depth + 1);
  //         })
  //       }
  //     ]
  //   };

  // }

  build() {

    return {
      class: "karma-field-table-grid-container karma-field-frame karma-field-group arrangement scroll-container",
      init: body => {
        body.element.tabIndex = -1;
      },
      update: async body => {
        this.clipboard = this.createChild("clipboard");
        body.element.onfocus = async event => {
          const selection = this.selectionBuffer.get();
          if (selection) {
            KarmaFieldsAlpha.History.save();
            this.selectionBuffer.change(null);
            await this.parent.request("render");
          }
          this.clipboard.output("");
          this.clipboard.focus();

        }

        const ids = this.getIds();

        const tree = await this.createTree(ids);

        const branch = this.createChild({
          type: "branch",
          children: tree.children,
          id: tree.id,
          columns: this.resource.children,
          depth: 0,
          index: 0,
          path: [],
          classes: ["table", "grid", "arrangement", "tree"]
        });

        body.children = [
          this.clipboard.build(),
          branch.build()
          // {
          //   tag: "ul",
          //   class: "table grid arrangement tree dropzone",
          //   init: async grid => {
          //     if (this.resource.style) {
          //       grid.element.style = this.resource.style;
          //     }
          //   },



          //   update: async grid => {

          //     const ids = this.getIds();
          //     // const page = this.getPage();
          //     // const ppp = this.getPpp();
          //     // const offset = (page - 1)*ppp;
          //     // const columns = this.getColumns();

          //     const tree = await this.createTree(ids);

          //     this.clipboard.onInput = async value => {
          //       const dataArray = KarmaFieldsAlpha.Clipboard.parse(value);
          //       const data = KarmaFieldsAlpha.Clipboard.toJson(dataArray);
          //       const selection = this.selectionBuffer.get() || {};

          //       if (selection.length || data.length) {
          //         KarmaFieldsAlpha.History.save();
          //         await this.import(data, selection.index, selection.length);
          //         this.selectionBuffer.change(null);
          //         await this.parent.request("render");
          //       }

          //     }

          //     const selection = this.selectionBuffer.get();

          //     // grid.element.colCount = 1;
          //     // grid.element.rowCount = ids.length;
          //     // grid.element.colHeader = 0;
          //     // grid.element.rowHeader = 0;


          //     KarmaFieldsAlpha.Sorter.sorters = [];


          //     this.selector = new KarmaFieldsAlpha.Sorter(grid.element);
          //     this.selector.colCount = 1;
          //     this.selector.rowCount = tree.children.length;
          //     this.selector.colHeader = 0;
          //     this.selector.rowHeader = 0;

          //     this.selector.selection = selection;

          //     KarmaFieldsAlpha.Sorter.sorters.push(this.selector);

          //     this.selector.onselect = async newSelection => {

          //       KarmaFieldsAlpha.Selection.change(newSelection);

          //       // selection.set(newSelection);
          //       // selection.save();


          //       // if (!KarmaFieldsAlpha.Selection.compare(selection, newSelection)) {
          //       //   KarmaFieldsAlpha.History.save();
          //       //   this.selectionBuffer.change(newSelection, selection);
          //       // }

          //       const value = await this.exportSelection();
          //       this.clipboard.output(value);
          //       this.clipboard.focus();

          //       await this.parent.request("render");

          //     }

          //     tree.children.sort((a, b) => (a.order || 0) - (b.order || 0));

          //     grid.children = tree.children.map((child, index) => {

          //       const branch = this.createChild({
          //         type: "branch",
          //         ...child,
          //         columns: this.resource.children,
          //         depth: 1,
          //         index: index,
          //         path: [index]
          //       });

          //       return branch.build();
          //     });

          //   },
          //   complete: async grid => {
          //     if (document.activeElement === document.body) {
          //       // const jsonData = await this.parent.request("export");
          //       const value = await this.exportSelection();
          //       // const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(jsonData);
          //       // const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
          //       this.clipboard.output(value);
          //       this.clipboard.focus();
          //     }
          //   }
          // }
        ];
      },
      complete: async grid => {
        if (document.activeElement === document.body) {
          // const jsonData = await this.parent.request("export");
          const value = await this.exportSelection();
          // const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(jsonData);
          // const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
          this.clipboard.output(value);
          this.clipboard.focus();
        }
      }
    }

  }

}


KarmaFieldsAlpha.field.layout.branch = class extends KarmaFieldsAlpha.field {

  // constructor(resource) {

  //   super(resource);

  //   this.selectionBuffer = new KarmaFieldsAlpha.Buffer("state", "selection");

  // }

  // build() {

  //   return {
  //     tag: "li",
  //     class: "arrangement-item",
  //     update: li => {
  //       const path = this.resource.path || [];
  //       const isSelected = KarmaFieldsAlpha.Selection.check(...path);

  //       li.element.classList.toggle("selected", Boolean(isSelected));
  //       li.element.classList.toggle("empty", !this.resource.children || this.resource.children.length === 0);
  //     },
  //     children: [
  //       {
  //         tag: "ul",
  //         class: "arrangement-item-header",
  //         update: header => {
  //           const row = this.createChild({
  //             key: this.resource.id,
  //             type: "row",
  //             children: this.resource.columns || [],
  //             index: this.resource.index || 0,
  //             depth: this.resource.depth || 0
  //           });
  //           header.children = row.resource.children.map(child => {
  //             return {
  //               tag: "li",
  //               child: row.createChild(child).build()
  //             }
  //           });
  //         }
  //       },
  //       {
  //         tag: "ul",
  //         class: "arrangement-item-body dropzone",
  //         update: ul => {
  //           const path = this.resource.path || [];
  //           const sorter = new KarmaFieldsAlpha.Sorter(ul.element);
  //           const selection = KarmaFieldsAlpha.Selection.get(...path);
  //           sorter.colCount = 1;
  //           sorter.rowCount = this.resource.children.length;
  //           sorter.currentSelection = this.resource.selection;
  //           sorter.selection = selection;
  //           sorter.path = [...path];

  //           KarmaFieldsAlpha.Sorter.sorters.push(sorter);


  //           sorter.onselect = async newSelection => {

  //             KarmaFieldsAlpha.Selection.change(newSelection, ...sorter.path);

  //             const value = await this.parent.exportSelection();
  //             this.parent.clipboard.output(value);
  //             this.parent.clipboard.focus();

  //             await this.parent.request("render");

  //           }


  //           sorter.onsort = async () => {

  //             // console.log(path, sorter.path, selection, sorter.selection);

  //             await this.parent.swap([...path, selection.index], [...sorter.path, sorter.selection.index], sorter.selection.length);
  //             await this.parent.request("render");

  //           }

  //           this.resource.children.sort((a, b) => (a.order || 0) - (b.order || 0));

            
  //         },
  //         // complete: ul => {
  //         //   this.sorter.children = [...ul.element.children];
  //         // },
  //         children: this.resource.children.map((child, index) => {
  //           const path = this.resource.path || [];
  //           const branch = this.parent.createChild({
  //             type: "branch",
  //             ...child, // -> children + id + parent + i
  //             columns: this.resource.columns,
  //             depth: (this.resource.depth || 0) + 1,
  //             index: index,
  //             path: [...path, index]
  //           });
  //           return branch.build();
  //           // return this.buildNode(child, index, depth + 1);
  //         })
  //       }
  //     ]
  //   };

  // }




  build() {

    return {
      tag: "ul",
      class: "arrangement-item-body dropzone",
      init: ul => {
        if (this.resource.classes) {
          ul.element.classList.add(...this.resource.classes);
        }
      },
      update: ul => {
        ul.element.style.height = "auto";
        const path = this.resource.path || [];
        const sorter = new KarmaFieldsAlpha.HSorter(ul.element);
        const selection = KarmaFieldsAlpha.Selection.get(...path);
        sorter.colCount = 1;
        sorter.rowCount = this.resource.children.length;
        sorter.currentSelection = this.resource.selection;
        sorter.selection = selection;
        sorter.path = [...path];

        // KarmaFieldsAlpha.Sorter.sorters.push(sorter);


        sorter.onselect = async newSelection => {

          if (!KarmaFieldsAlpha.Selection.compare(newSelection, ...sorter.path)) {

            KarmaFieldsAlpha.History.save();
            KarmaFieldsAlpha.Selection.change(newSelection, ...sorter.path);

            const value = await this.parent.exportSelection();
            this.parent.clipboard.output(value);
            this.parent.clipboard.focus();
            
          }

          

          await this.parent.request("render");

        }


        sorter.onsort = async () => {

          // console.log(path, sorter.path, selection, sorter.selection);

          if (!KarmaFieldsAlpha.Selection.compare(sorter.selection, ...sorter.path)) {

            KarmaFieldsAlpha.History.save();
            await this.parent.swap([...path, selection.index], [...sorter.path, sorter.selection.index], sorter.selection.length);
            KarmaFieldsAlpha.Selection.change(sorter.selection, ...sorter.path);

            const value = await this.parent.exportSelection();
            this.parent.clipboard.output(value);
            this.parent.clipboard.focus();
          }
          
          await this.parent.request("render");

        }

        this.resource.children.sort((a, b) => (a.order || 0) - (b.order || 0));

        
      },
      // complete: ul => {
      //   this.sorter.children = [...ul.element.children];
      // },
      children: this.resource.children.map((child, index) => {
        const path = this.resource.path || [];
        const branch = this.parent.createChild({
          type: "branch",
          ...child, // -> children + id + parent + i
          columns: this.resource.columns,
          depth: (this.resource.depth || 0) + 1,
          index: index,
          path: [...path, index]
        });
        // return branch.build();

        return {
          tag: "li",
          class: "arrangement-item",
          update: li => {
            const isSelected = KarmaFieldsAlpha.Selection.check(...path, index);
    
            li.element.classList.toggle("selected", Boolean(isSelected));
            li.element.classList.toggle("empty", !child.children || child.children.length === 0);
          },
          children: [
            {
              tag: "ul",
              class: "arrangement-item-header",
              update: header => {
                const row = branch.createChild({
                  key: child.id,
                  type: "row",
                  children: this.parent.columns || [],
                  index: index || 0,
                  // depth: this.resource.depth || 0
                });
                header.children = this.parent.resource.children.map(child => {
                  return {
                    tag: "li",
                    init: li => {
                      if (child.style) {
                        li.element.style = child.style;
                      }
                    },
                    child: row.createChild(child).build()
                  }
                });
              }
            },
            branch.build()
          ]
        };
      })
    };

  }

}