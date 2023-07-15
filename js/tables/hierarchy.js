
KarmaFieldsAlpha.field.hierarchy = class extends KarmaFieldsAlpha.field.grid {

  createTree() {

    const ids = this.getIds();

    if (ids) {

      const map = {};
      const root = new KarmaFieldsAlpha.Tree("0");
      // const alias = this.resource.alias || {};
      const parentAttribute = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, this.resource.driver, "alias", "parent") || "parent";

      for (let id of ids) {

        if (id) {

          const [parent] = this.getValue(id, parentAttribute) || [KarmaFieldsAlpha.loading];
          // const [order] = await table.getValue(id, alias.order || "order") || [];

          if (parent === KarmaFieldsAlpha.loading) {

            continue;

          }

          map[id] = new KarmaFieldsAlpha.Tree(id, parent);

        }

      }


      for (let id of ids) {

        // if (id) {

          let tree = id && map[id];

          if (!tree) {

            tree = new KarmaFieldsAlpha.Tree(null, "0");

          }

          // const tree = map[id];

          const parent = map[tree.parent];

          if (parent) {

            parent.children.push(tree);

          } else {

            root.children.push(tree);

          }

        // } else {
        //
        //   const loadingItem = new KarmaFieldsAlpha.Tree(null, "0");
        //   root.children.push(loadingItem);
        //
        // }



      }

      return root;

    }


  }


  swap(path, newPath, length) {




    const tree = this.createTree();

    if (tree) {

      const selection = {length: 1, index: 0};
      const selectionPath = [...newPath];

      KarmaFieldsAlpha.DeepObject.set(selection, {final: true, index: selectionPath.pop(), length: length}, 0, ...selectionPath);

      this.setSelection(selection);


      tree.swap(path, newPath, length);

      const items = tree.flatten();
      const parentParam = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, this.resource.driver, "alias", "parent") || "parent";
      const indexParam = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, this.resource.driver, "alias", "index") || "index";

      for (let i = 0; i < items.length; i++) {

        const item = items[i];

        const [parent] = this.getValue(item.id, parentParam) || [KarmaFieldsAlpha.loading];
        const [index] = this.getValue(item.id, indexParam) || [KarmaFieldsAlpha.loading];

        if (parent === KarmaFieldsAlpha.loading || index === KarmaFieldsAlpha.loading) {

          continue;

        }

        if ((parent || "0") !== item.parent) {

          this.setValue(item.parent, item.id, parentParam);

        }

        if (parseInt(index) !== i) {

          this.setValue(i.toString(), item.id, indexParam);

        }

      }

      const ids = items.map(item => item.id);


      // this.idsBuffer.set(ids);

      KarmaFieldsAlpha.Store.setIds(ids);



      // this.setSelection({final: true, index: 0, length: 0});




    }


  }

  getSelectedIds(selection) {

    if (!selection) {

      selection = this.getSelection();

    }
    //
    // if (selection && selection[0]) {
    //
    //   const tree = this.createTree();
    //
    //   return tree.slice(selection[0]).map(item => item.id)
    //
    // }
    //
    // return [];

    if (selection && selection[0]) {

      const branch = this.getChild(0);

      return branch.collectIds(selection[0]);

    }

    return [];

  }

  hasSelection() {

    const selection = this.getSelection() || {};

    const tree = this.createTree();

    if (tree && selection[0]) {

      return tree.hasSelection(selection[0]);

    }

    return false;

  }

  follow(selection, callback) {

    if (selection.final || selection.modal && selection.modal.final) {

      return callback(this, selection);

    } else if (selection.modal) {

      // const modal = this.createChild({
      //   ...this.resource.modal,
      //   type: "modal",
      //   index: "modal",
      //   ids: this.getSelectedIds(selection)
      // });
      //
      // return modal.follow(selection.modal, callback);

      return this.getChild("modal").follow(selection.modal, callback);

    } else if (selection[0]) { // -> follow branches

      // const tree = this.createTree();
      //
      // if (tree.hasSelection(selection)) {
      //
      //   return callback(this, selection);
      //
      // } else { // -> follow branches till row
      //
      //   const branch = this.createChild({
      //     type: "branch",
      //     children: tree.children,
      //     id: tree.id,
      //     columns: this.resource.children,
      //     depth: 0,
      //     index: 0,
      //     path: [],
      //   });
      //
      //   return branch.follow(selection[0], callback);
      //
      // }

      return this.getChild(0).follow(selection[0], callback);

    }

  }

  getChild(index) {

    if (index === 0) {

      const tree = this.createTree();

      return this.createChild({
        type: "branch",
        children: tree.children,
        id: tree.id,
        columns: this.resource.modal && this.resource.modal.children || this.resource.children,
        depth: 0,
        index: index,
        path: [],
      });

    } else if (index === "modal") {

      return this.createChild({
        ...this.resource.modal,
        type: "modal",
        index: "modal"
      });

    }

  }

  // copy(selection) {
  //
  //   const tree = this.createTree();
  //
  //   const index = tree.mapIndex(selection[0]);
  //
  //   if (selection[0]) {
  //
  //   }
  //
  // }

  paste(value, selection) {

    if (selection[0]) {

      // const tree = this.createTree();
      //
      // const branch = this.createChild({
      //   type: "branch",
      //   children: tree.children,
      //   id: tree.id,
      //   columns: this.resource.modal && this.resource.modal.children || this.resource.children,
      //   depth: 0,
      //   index: 0,
      //   path: [],
      // });

      const branch = this.getChild(0);

      return branch.paste(value, selection[0]);

    }

  }

  copy(selection) {

    if (selection[0]) {

      // const tree = this.createTree();
      //
      // const branch = this.createChild({
      //   type: "branch",
      //   children: tree.children,
      //   id: tree.id,
      //   columns: this.resource.modal && this.resource.modal.children || this.resource.children,
      //   depth: 0,
      //   index: 0,
      //   path: [],
      // });

      const branch = this.getChild(0);

      return branch.copy(selection[0]);

    }

  }

  delete(selection) {

    // const tree = this.createTree();
    //
    // if (selection[0]) {
    //
    //   const branch = this.createChild({
    //     type: "branch",
    //     children: tree.children,
    //     id: tree.id,
    //     columns: this.resource.modal && this.resource.modal.children || this.resource.children,
    //     depth: 0,
    //     index: 0,
    //     path: [],
    //   });
    //
    //   const ids = branch.collectIds(selection[0]);
    //
    //   if (ids && ids.length) {
    //
    //     this.removeIds(ids);
    //
    //   }
    //
    // }

    if (selection[0]) {

      const branch = this.getChild(0);

      const ids = branch.collectIds(selection[0]);

      if (ids && ids.length) {

        this.removeIds(ids);

      }

    }

  }


  // async select(selection) {
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


  build() {

    return {
      class: "arrangement",
      init: body => {
        // body.element.tabIndex = -1;
      },
      update: body => {

        const tree = this.createTree();

        if (tree) {

          const branch = this.createChild({
            type: "branch",
            children: tree.children,
            id: tree.id,
            columns: this.resource.children,
            depth: 0,
            index: 0,
            path: [],
            classes: ["table", "grid", "arrangement", "tree"],
            maxDepth: this.resource.maxDepth || 0
          });

          body.children = [
            // this.clipboard.build(),
            branch.build()
          ];

        }

      }

    }

  }

}


KarmaFieldsAlpha.field.hierarchy.branch = class extends KarmaFieldsAlpha.field {

  // getValue(...path) {
  //   return super.getValue(...path);
  // }

  copy(selection) {

    if (selection.final) {

      const grid = new KarmaFieldsAlpha.Grid();
      const index = selection.index || 0;
      const length = selection.length || 0;

      // for (let i = 0; i < length; i++) {
      //
      //   const child = this.resource.children[i + index];
      //
      //   if (child) {
      //
      //     const row = this.createChild({
      //       id: child.id,
      //       type: "row",
      //       children: this.resource.columns || [],
      //       index: index + i
      //     });
      //
      //     const rowItems = row.export();
      //
      //     grid.addRow(rowItems);
      //
      //   }
      //
      // }

      for (let i = 0; i < length; i++) {

        const child = this.getChild(i + index);

        const row = child.getChild("row");

        const rowItems = row.export();

        grid.addRow(rowItems);

      }

      return grid.toString();

    } else {

      for (let i = 0; i < this.resource.children.length; i++) {

        // const child = this.resource.children[i];

        if (selection[i]) {

          // const branch = this.createChild({
          //   type: "branch",
          //   children: child.children,
          //   id: child.id,
          //   columns: this.resource.columns,
          //   depth: this.resource.depth++,
          //   index: i,
          //   path: [...this.resource.path, i],
          // });

          const branch = this.getChild(i);

          return branch.copy(selection[i]);
        }

      }

    }

  }

  async paste(value, selection) {

    if (selection.final) {

      const grid = new KarmaFieldsAlpha.Grid(value);
      const index = selection.index || 0;
      const length = selection.length || 0;

      if (grid.array.length < length) {

        this.remove(index + grid.array.length, length - grid.array.length);

      } else if (grid.array.length > length) {

        for (let i = 0; i < grid.array.length - length; i++) {

          await this.add(index + length);

        }

      }

      for (let i = 0; i < grid.array.length; i++) {

        const rowItems = grid.array[i];

        // const child = this.resource.children[i + index];
        //
        // if (child) {
        //
        //   // const row = this.createChild({
        //   //   id: child.id,
        //   //   type: "row",
        //   //   children: this.resource.columns || [],
        //   //   index: index + i
        //   // });
        //   // const branch = this.getChild(i + index);
        //   // const row = this.getChild("row");
        //   //
        //   // row.import(rowItems);
        //
        // }

        const branch = this.getChild(i + index);
        const row = branch.getChild("row");

        row.import(rowItems);

      }

    } else {

      for (let i = 0; i < this.resource.children.length; i++) {

        // const child = this.resource.children[i];

        if (selection[i]) {

          // const branch = this.createChild({
          //   type: "branch",
          //   children: child.children,
          //   id: child.id,
          //   columns: this.resource.columns,
          //   depth: this.resource.depth++,
          //   index: i,
          //   path: [...this.resource.path, i],
          // });

          const branch = this.getChild(i);

          return branch.paste(value, selection[i]);
        }

      }

    }

  }

  collectIds(selection) {

    if (selection.final) {

      const index = selection.index || 0;
      const length = selection.length || 0;

      return this.resource.children.slice(index, index + length).map(tree => tree.id);

    } else {

      for (let i = 0; i < this.resource.children.length; i++) {

        if (selection[i]) {

          const child = this.getChild(i);

          return child.collectIds(selection[i]);

        }

      }

    }

  }

  hasSelection(selection) {

    if (selection.final) {

      return selection.length > 0;

    } else {

      for (let i = 0; i < this.resource.children.length; i++) {

        if (selection[i]) {

          const child = this.getChild(i);

          return child.hasSelection(selection[i]);

        }

      }

    }

  }

  getChild(index) {

    if (index === "row") {

      return this.createChild({
        id: this.resource.id,
        type: "row",
        children: this.resource.columns || [],
        index: index
      });

    } else {

      const tree = this.resource.children[index];

      return this.createChild({
        type: "branch",
        children: tree.children || [],
        id: tree.id,
        columns: this.resource.columns,
        depth: this.resource.depth++,
        index: index,
        path: [...this.resource.path, index],
        maxDepth: (this.resource.maxDepth || 0) - 1
      });

    }

  }


  follow(callback, selection) {

    if (selection.final) {

      return callback(this, selection)

    } else {

      for (let i = 0; i < this.resource.children.length; i++) {

        const child = this.resource.children[i];

        if (selection[i]) {

          const branch = this.createChild({
            type: "branch",
            children: child.children,
            id: child.id,
            columns: this.resource.columns,
            depth: this.resource.depth++,
            index: i,
            path: [...this.resource.path, i],
          });

          return branch.copy(selection[i]);
        }

      }

    }

  }



  setSelection(selection) {

    this.parent.setSelection(selection && {
      [this.resource.index]: selection,
      index: this.resource.index,
      length: 1
    });

  }

  select(selection) {
console.error("deprecated");
    this.parent.select({[this.resource.index]: selection});

  }

  swap(path, newPath, length) {

    this.parent.swap(path, newPath, length);

  }

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
        // const sorter = new KarmaFieldsAlpha.Sorter(ul.element);
        let selection = this.getSelection();
        sorter.colCount = 1;
        sorter.rowCount = this.resource.children.length;
        sorter.currentSelection = selection;
        sorter.selection = selection;
        sorter.path = [...path];
        sorter.maxDepth = this.resource.maxDepth || 0;
        sorter.onselect = newSelection => {

          // this.select(newSelection);

          this.setSelection(newSelection);
          KarmaFieldsAlpha.Clipboard.focus();
          this.save("nav");
          this.render();

          // if (!KarmaFieldsAlpha.Selection.compare(newSelection, ...sorter.path)) {
          //
          //   KarmaFieldsAlpha.History.save();
          //   KarmaFieldsAlpha.Selection.change(newSelection, ...sorter.path);
          //
          //   const value = await this.parent.exportSelection();
          //   this.parent.clipboard.output(value);
          //   this.parent.clipboard.focus();
          //
          // }
          //
          //
          //
          // await this.parent.request("render");

        }


        sorter.onsort = () => {

          // this.swap([...path, selection.index], [...sorter.path, sorter.selection.index], sorter.selection.length);
          KarmaFieldsAlpha.Clipboard.focus();
          this.save("swap");
          this.render();


          //
          // console.log(sorter.selection);
          //
          // this.select(sorter.selection);



          // if (!KarmaFieldsAlpha.Selection.compare(sorter.selection, ...sorter.path)) {
          //
          //   KarmaFieldsAlpha.History.save();
          //   await this.parent.swap([...path, selection.index], [...sorter.path, sorter.selection.index], sorter.selection.length);
          //   KarmaFieldsAlpha.Selection.change(sorter.selection, ...sorter.path);
          //
          //   const value = await this.parent.exportSelection();
          //   this.parent.clipboard.output(value);
          //   this.parent.clipboard.focus();
          // }
          //
          // await this.parent.request("render");

        }

        sorter.onSwap = newSelection => {

          // this.setSelection({
          //   index: newSelection.index,
          //   length: newSelection.length,
          //   final: true
          // });

          selection = this.getSelection();

          this.swap([...path, selection.index], [...sorter.path, newSelection.index], newSelection.length);



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

        const indexParam = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, this.resource.driver, "alias", "index") || "index";


        this.resource.children.sort((a, b) => (a[indexParam] || 0) - (b[indexParam] || 0));

        ul.children = this.resource.children.map((child, index) => {
          const path = this.resource.path || [];
          const branch = this.createChild({
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
              // const isSelected = KarmaFieldsAlpha.Selection.check(...path, index);
              // console.log(selection, li.element);
              const isSelected = selection && selection.final && selection.length && KarmaFieldsAlpha.Selection.containRow(selection, index);

              li.element.classList.toggle("selected", Boolean(isSelected));
              li.element.classList.toggle("empty", !child.children || child.children.length === 0);
            },
            children: [
              {
                tag: "ul",
                class: "arrangement-item-header",
                update: header => {
                  header.element.classList.toggle("loading", !child.id);

                  if (child.id) {
                    const row = branch.createChild({
                      id: child.id,
                      type: "row",
                      children: this.resource.columns || [],
                      index: "row"
                      // depth: this.resource.depth || 0
                    });
                    header.children = this.resource.columns.map(child => {
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


                }
              },
              branch.build()
            ]
          };
        });


      }
      // complete: ul => {
      //   this.sorter.children = [...ul.element.children];
      // },
      // children:
    };

  }

}
