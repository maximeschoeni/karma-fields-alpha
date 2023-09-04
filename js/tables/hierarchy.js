
KarmaFieldsAlpha.field.hierarchy = class extends KarmaFieldsAlpha.field.grid {

  // createTree() {
  //
  //   const ids = this.getIds();
  //
  //   if (ids) {
  //
  //     const map = {};
  //     const root = new KarmaFieldsAlpha.Tree("0");
  //     // const alias = this.resource.alias || {};
  //     const parentAttribute = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, this.resource.driver, "alias", "parent") || "parent";
  //
  //     for (let id of ids) {
  //
  //       if (id) {
  //
  //         const [parent] = this.getValue(id, parentAttribute) || [KarmaFieldsAlpha.loading];
  //         // const [order] = await table.getValue(id, alias.order || "order") || [];
  //
  //         if (parent === KarmaFieldsAlpha.loading) {
  //
  //           continue;
  //
  //         }
  //
  //         map[id] = new KarmaFieldsAlpha.Tree(id, parent);
  //
  //       }
  //
  //     }
  //
  //
  //     for (let id of ids) {
  //
  //       // if (id) {
  //
  //         let tree = id && map[id];
  //
  //         if (!tree) {
  //
  //           tree = new KarmaFieldsAlpha.Tree(null, "0");
  //
  //         }
  //
  //         // const tree = map[id];
  //
  //         const parent = map[tree.parent];
  //
  //         if (parent) {
  //
  //           parent.children.push(tree);
  //
  //         } else {
  //
  //           root.children.push(tree);
  //
  //         }
  //
  //       // } else {
  //       //
  //       //   const loadingItem = new KarmaFieldsAlpha.Tree(null, "0");
  //       //   root.children.push(loadingItem);
  //       //
  //       // }
  //
  //
  //
  //     }
  //
  //     return root;
  //
  //   }
  //
  //
  // }


  // swap(path, newPath, length) {
  //
  //
  //
  //
  //   const tree = this.createTree();
  //
  //   if (tree) {
  //
  //     const selection = {length: 1, index: 0};
  //     const selectionPath = [...newPath];
  //
  //     KarmaFieldsAlpha.DeepObject.set(selection, {final: true, index: selectionPath.pop(), length: length}, 0, ...selectionPath);
  //
  //     this.setSelection(selection);
  //
  //
  //     tree.swap(path, newPath, length);
  //
  //     const items = tree.flatten();
  //     const parentParam = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, this.resource.driver, "alias", "parent") || "parent";
  //     const indexParam = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, this.resource.driver, "alias", "index") || "index";
  //
  //     for (let i = 0; i < items.length; i++) {
  //
  //       const item = items[i];
  //
  //       const [parent] = this.getValue(item.id, parentParam) || [KarmaFieldsAlpha.loading];
  //       const [index] = this.getValue(item.id, indexParam) || [KarmaFieldsAlpha.loading];
  //
  //       if (parent === KarmaFieldsAlpha.loading || index === KarmaFieldsAlpha.loading) {
  //
  //         continue;
  //
  //       }
  //
  //       if ((parent || "0") !== item.parent) {
  //
  //         this.setValue(item.parent, item.id, parentParam);
  //
  //       }
  //
  //       if (parseInt(index) !== i) {
  //
  //         this.setValue(i.toString(), item.id, indexParam);
  //
  //       }
  //
  //     }
  //
  //     const ids = items.map(item => item.id);
  //
  //
  //     // this.idsBuffer.set(ids);
  //
  //     KarmaFieldsAlpha.Store.setIds(ids);
  //
  //
  //
  //     // this.setSelection({final: true, index: 0, length: 0});
  //
  //
  //
  //
  //   }
  //
  //
  // }

  // getAlias(id, alias) {
  //
  //   const driver = this.getDriver();
  //   const key = KarmaFieldsAlpha.Query.getAlias(driver, alias);
  //
  //   return this.getValue(id, key);
  //
  // }
  //
  // setAlias(value, id, alias) {
  //
  //   const driver = this.getDriver();
  //   const key = KarmaFieldsAlpha.Query.getAlias(driver, alias);
  //
  //   this.setValue(value, id, key);
  //
  // }
  //
  // initAlias(value, id, alias) {
  //
  //   const driver = this.getDriver();
  //   const key = KarmaFieldsAlpha.Query.getAlias(driver, alias);
  //
  //   KarmaFieldsAlpha.Query.initValue(driver, value, id, key)
  //
  //   // const current = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.Query.vars, driver, id, key);
  //   //
  //   // if (current === undefined) {
  //   //
  //   //   value = KarmaFieldsAlpha.Type.toArray(value);
  //   //
  //   //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.Query.vars, value, driver, id, key);
  //   //
  //   // }
  //
  // }

  // todo: standardize this function with Media's
  getParent(id) {

    return this.getSingleValue(id, "parent");

  }

  getIndex(id) {
    console.error("deprecated");
    const values = this.getAlias(id, "index");

    if (!values) {

      return KarmaFieldsAlpha.loading;

    }

    return parseInt(values[0] || 0);

  }

  setParent(value, id) {
console.error("deprecated");
    this.setAlias(value, id, "parent");

  }

  setIndex(value, id) {
console.error("deprecated");
    this.setAlias(value, id, "index");

  }

  initParent(value, id) {
console.error("deprecated");
    this.initAlias(value, id, "parent");

  }

  initIndex(value, id) {
console.error("deprecated");
    this.initAlias(value, id, "index");

  }



  async add(params = {}, ...path) {

    const selection = this.getSelection() || {};

    // if (selection && selection[0]) {
    //
    //   const branch = this.getChild(0);
    //
    //   branch.add(params, );
    //
    //
    //
    // }



    const index = (selection.index || 0) + (selection.length || 0);


    KarmaFieldsAlpha.Query.add(this.resource.driver, params, 0, index, ...path);



    this.setSelection({final: true, index: index, length: 1, reveal: true});

    await this.render();

    this.save("add"); // -> wait until default fields are all set to save

  }



  // getItems() {
  //
  //   let items = KarmaFieldsAlpha.Store.get("ids");
  //
  //   if (!items) {
  //
  //     const ids = this.getIds();
  //
  //     if (ids && ids !== KarmaFieldsAlpha.loading) {
  //
  //       items = ids.map(id => {
  //         return {
  //           id: id,
  //           parent: this.getParent(id) || "0"
  //         };
  //       });
  //
  //       if (items.every(item => item.parent !== KarmaFieldsAlpha.loading)) {
  //
  //         const root = KarmaFieldsAlpha.DeepArray.create(items, "0");
  //
  //         items = [root];
  //
  //
  //         // const driver = this.getDriver();
  //         // const indexAlias = KarmaFieldsAlpha.Query.getAlias(driver, "index");
  //         // const parentAlias = KarmaFieldsAlpha.Query.getAlias(driver, "parent");
  //
  //         KarmaFieldsAlpha.DeepArray.forEach(root.children, (item, index) => {
  //
  //           this.initIndex(index, item.id);
  //           this.initParent(item.parent, item.id);
  //
  //           // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.Query.vars, driver, item.id, indexAlias)) {
  //           //
  //           //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.Query.vars, index, driver, item.id, indexAlias);
  //           //
  //           // }
  //           //
  //           // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.Query.vars, driver, item.id, parentAlias)) {
  //           //
  //           //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.Query.vars, item.parent, driver, item.id, parentAlias);
  //           //
  //           // }
  //
  //           delete item.parent;
  //
  //         });
  //
  //         KarmaFieldsAlpha.Backup.update(items, "ids");
  //         KarmaFieldsAlpha.Store.set(items, "ids");
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   return items;
  //
  // }


  getItems() {


    let items = KarmaFieldsAlpha.Store.get("ids");

    if (!items) {

      const ids = this.getIds();

      if (ids && ids !== KarmaFieldsAlpha.loading) {

        items = ids.map(id => {
          return {
            id: id,
            parent: this.getParent(id) || "0"
          };
        });

        if (items.every(item => item.parent !== KarmaFieldsAlpha.loading)) {

          const root = KarmaFieldsAlpha.DeepArray.create(items, "0");

          items = [root];

          // const driver = this.getDriver();
          // const indexAlias = KarmaFieldsAlpha.Query.getAlias(driver, "index");
          // const parentAlias = KarmaFieldsAlpha.Query.getAlias(driver, "parent");

          KarmaFieldsAlpha.DeepArray.forEachObject(root, (item, index, parent) => {

            this.initValue(index, item.id, "position");
            this.initValue(parent.id, item.id, "parent");

            // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.Query.vars, driver, item.id, indexAlias)) {
            //
            //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.Query.vars, index, driver, item.id, indexAlias);
            //
            // }
            //
            // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.Query.vars, driver, item.id, parentAlias)) {
            //
            //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.Query.vars, item.parent, driver, item.id, parentAlias);
            //
            // }

            delete item.parent;

          });

          KarmaFieldsAlpha.Backup.update(items, "ids");
          KarmaFieldsAlpha.Store.set(items, "ids");

        }

      }

    }

    return items;

  }



  // swap(path, newPath, length) {
  //
  //   const items = this.getItems();
  //
  //   if (items && items !== KarmaFieldsAlpha.loading) {
  //
  //     const selection = {length: 1, index: 0};
  //
  //     KarmaFieldsAlpha.DeepObject.set(selection, {final: true, index: newPath[newPath.length-1], length: length}, 0, ...newPath.slice(0, -1));
  //
  //     this.setSelection(selection);
  //
  //     const newItems = items.clone();
  //
  //     const transferedItems = KarmaFieldsAlpha.DeepArray.splice(items, length, [], ...path);
  //
  //     KarmaFieldsAlpha.DeepArray.splice(items, 0, transferedItems, ...newPath);
  //
  //
  //     const originParentDirectory = KarmaFieldsAlpha.DeepArray.get(items, ...path.slice(0, -1));
  //     const destParentDirectory = KarmaFieldsAlpha.DeepArray.get(items, ...newPath.slice(0, -1));
  //
  //     // -> update destination folder items order
  //
  //     for (let i = 0; i < destParentDirectory.length; i++) {
  //
  //       this.setIndex(i.toString(), destParentDirectory[i].id);
  //
  //     }
  //
  //     if (originParentDirectory !== destParentDirectory) {
  //
  //       // -> change parenting
  //
  //       // -> update origin folder items order
  //
  //       for (let i = 0; i < originParentDirectory.length; i++) {
  //
  //         this.setIndex(i.toString(), originParentDirectory[i].id);
  //
  //       }
  //
  //       // -> update destination folder items parent
  //
  //       let parentId = KarmaFieldsAlpha.DeepArray.getObject(items, ...newPath.slice(0, -1)) || "0";
  //
  //       for (let i = 0; i < transferedItems.length; i++) {
  //
  //         this.setParent(parentId, transferedItems[i].id);
  //
  //       }
  //
  //
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.setIds(items);
  //
  //   }
  //
  // }

  // completeSwap() {
  //
  //   let items = this.getItems();
  //   // const driver = this.getDriver();
  //   // const indexAlias = KarmaFieldsAlpha.Query.getAlias(driver, "index");
  //   // const parentAlias = KarmaFieldsAlpha.Query.getAlias(driver, "parent");
  //
  //   KarmaFieldsAlpha.DeepArray.forEachObject(items[0], (item, index, parent) => {
  //
  //     const parentId = parent && parent.id || "0";
  //
  //     const currentIndex = this.getIndex(item.id);
  //     const currentParentId = this.getParent(item.id);
  //
  //     if (index !== currentIndex) {
  //
  //       this.setIndex(index, item.id);
  //
  //     }
  //
  //     if (parentId !== currentParentId) {
  //
  //       this.setParent(parentId, item.id);
  //
  //     }
  //
  //   });
  //
  //
  //
  // }

  completeSwap() {

    let items = this.getItems();
    // const driver = this.getDriver();
    // const indexAlias = KarmaFieldsAlpha.Query.getAlias(driver, "index");
    // const parentAlias = KarmaFieldsAlpha.Query.getAlias(driver, "parent");

    KarmaFieldsAlpha.DeepArray.forEachObject(items[0], (item, index, parent) => {

      // const parentId = parent && parent.id || "0";

      const currentIndex = this.getSingleValue(item.id, "position");
      const currentParentId = this.getSingleValue(item.id, "parent");

      if (currentIndex === KarmaFieldsAlpha.loading || currentParentId === KarmaFieldsAlpha.loading) {

        console.error("item not loaded!");

      }

      if (index !== currentIndex) {

        this.setValue(index, item.id, "position");

      }

      if (parent.id !== currentParentId) {

        this.setValue(parent.id, item.id, "parent");

      }

    });



  }

  // // swap(originPath, originIndex, destPath, destIndex, length) {
  // swap(index, newIndex, length, path, newPath) {
  //
  //
  //   let items = this.getItems();
  //
  //   if (items && items !== KarmaFieldsAlpha.loading) {
  //
  //     const selection = {length: 1, index: 0};
  //
  //     KarmaFieldsAlpha.DeepObject.set(selection, {final: true, index: newIndex, length: length}, ...newPath);
  //
  //     this.setSelection(selection);
  //
  //     items = KarmaFieldsAlpha.DeepArray.clone(items);
  //
  //     const transferedItems = KarmaFieldsAlpha.DeepArray.splice(items, length, [], ...path, index);
  //
  //     KarmaFieldsAlpha.DeepArray.splice(items, 0, transferedItems, ...newPath, newIndex);
  //
  //     // const destDirectory = KarmaFieldsAlpha.DeepArray.get(items, ...destPath);
  //     //
  //     // let parent = KarmaFieldsAlpha.DeepArray.getObject(items, ...destPath) || {id: "0"};
  //     //
  //     // for (let i = 0; i < transferedItems.length; i++) {
  //     //
  //     //   transferedItems[i].parent
  //     //
  //     // }
  //
  //
  //
  //     // const originDirectory = KarmaFieldsAlpha.DeepArray.get(items, ...originPath);
  //     // const destDirectory = KarmaFieldsAlpha.DeepArray.get(items, ...destPath);
  //     //
  //     // // -> update destination folder items order
  //     //
  //     // for (let i = 0; i < destDirectory.length; i++) {
  //     //
  //     //   this.setIndex(i.toString(), destDirectory[i].id);
  //     //
  //     // }
  //     //
  //     // if (destDirectory !== originDirectory) {
  //     //
  //     //   // -> change parenting
  //     //
  //     //   // -> update origin folder items order
  //     //
  //     //   console.log(originDirectory);
  //     //
  //     //   for (let i = 0; i < originDirectory.length; i++) {
  //     //
  //     //     this.setIndex(i.toString(), originDirectory[i].id);
  //     //
  //     //   }
  //     //
  //     //   // -> update transfered items parent
  //     //
  //     //   let parent = KarmaFieldsAlpha.DeepArray.getObject(items, ...destPath) || {id: "0"};
  //     //
  //     //   for (let i = 0; i < transferedItems.length; i++) {
  //     //
  //     //     this.setParent(parent.id, transferedItems[i].id);
  //     //
  //     //   }
  //     //
  //     // }
  //
  //     KarmaFieldsAlpha.Store.setIds(items);
  //
  //   }
  //
  // }


  swap(index, newIndex, length, path, newPath) {

    let items = this.getItems();

    if (items) {

      const selection = {length: 1, index: 0};

      KarmaFieldsAlpha.DeepObject.set(selection, {final: true, index: newIndex, length: length}, ...newPath);

      this.setSelection(selection);

      items = KarmaFieldsAlpha.DeepArray.clone(items);

      const transferedItems = KarmaFieldsAlpha.DeepArray.splice(items, length, [], ...path, index);

      KarmaFieldsAlpha.DeepArray.splice(items, 0, transferedItems, ...newPath, newIndex);

      KarmaFieldsAlpha.Store.setIds(items);

    }

  }

  // getSelectedIds(selection) {
  //
  //   if (!selection) {
  //
  //     selection = this.getSelection();
  //
  //   }
  //   //
  //   // if (selection && selection[0]) {
  //   //
  //   //   const tree = this.createTree();
  //   //
  //   //   return tree.slice(selection[0]).map(item => item.id)
  //   //
  //   // }
  //   //
  //   // return [];
  //
  //   if (selection && selection[0]) {
  //
  //     const branch = this.getChild(0);
  //
  //     return branch.collectIds(selection[0]);
  //
  //   }
  //
  //   return [];
  //
  // }

  getSelectedItems(selection = this.getSelection()) {

      if (selection && selection[0]) {

        const branch = this.getChild(0);

        return branch.getSelectedItems(selection[0]);

      }

      return [];

  }

  hasSelection() {

    const selection = this.getSelection() || {};

    // const tree = this.createTree();
    //
    // if (tree && selection[0]) {
    //
    //   return tree.hasSelection(selection[0]);
    //
    // }

    if (selection && selection[0]) {

      const branch = this.getChild(0);

      return branch.hasSelection(selection[0]);

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

      // const tree = this.createTree();

      const items = this.getItems() || [{children: []}];

      // const root = this.getRoot();



      return this.createChild({
        type: "branch",
        items: items[index].children,
        id: "0",
        columns: this.resource.modal && this.resource.modal.children || this.resource.children,
        depth: 0,
        index: index,
        path: [],
        classes: ["table", "grid", "arrangement", "tree"],
        maxDepth: this.resource.maxDepth || 0
      });

      // const branch = this.createChild({
      //   type: "branch",
      //   items: items["0"],
      //   id: "0",
      //   columns: this.resource.children,
      //   depth: 0,
      //   index: 0,
      //   path: [],
      //
      // });

    } else if (index === "modal") {

      return this.createChild({
        ...this.resource.modal,
        type: "modal",
        index: "modal"
      });

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

      if (selection[0]) {

        const items = this.getItems();

        return this.createChild({
          type: "branch",
          items: items[0].children,
          id: "0",
          columns: this.resource.modal && this.resource.modal.children || this.resource.children,
          depth: 0,
          index: 0,
          path: [],
          classes: ["table", "grid", "arrangement", "tree"],
          maxDepth: this.resource.maxDepth || 0
        });

      }

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

  // delete(selection) {
  //
  //   if (selection[0]) {
  //
  //     const branch = this.getChild(0);
  //
  //     const items = branch.getSelectedItems(selection[0]);
  //
  //     if (items && items.length) {
  //
  //       this.removeIds(items.map(item => item.id));
  //
  //     }
  //
  //   }
  //
  // }


  remove(index, length, ...path) {

    let items = this.getItems();

    for (let item of items) {

      this.setValue("1", item.id, "trash");

    }

    items = KarmaFieldsAlpha.DeepArray.clone(items);

    const splicedItems = KarmaFieldsAlpha.DeepArray.splice(items, length, [], ...path, index);

    const driver = this.getDriver();
    KarmaFieldsAlpha.Query.removeIds(driver, splicedItems.map(item => item.id));

    KarmaFieldsAlpha.Store.setIds(items);

    this.setSelection({final: true, index: 0, length: 0});
    this.save("delete");
    this.render();

  }



  clearModalSelection() {

    const selection = this.getSelection();

    this.setSelection({0: selection[0]}); // = remove modal property

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

        // const tree = this.createTree();

        const items = this.getItems();
        //
        // // const root = this.getRoot();
        //
        // // console.log(items);
        //
        //
        // if (items) {

          // const branch = this.getChild(0);

        if (items) {

          const branch = this.createChild({
            type: "branch",
            items: items[0].children,
            // children: root.children,
            id: "0",
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

      for (let i = 0; i < this.resource.items.length; i++) {

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

      for (let i = 0; i < this.resource.items.length; i++) {

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

  // collectIds(selection) {
  //
  //   if (selection.final) {
  //
  //     const index = selection.index || 0;
  //     const length = selection.length || 0;
  //
  //     return this.resource.children.slice(index, index + length).map(tree => tree.id);
  //
  //   } else {
  //
  //     for (let i = 0; i < this.resource.children.length; i++) {
  //
  //       if (selection[i]) {
  //
  //         const child = this.getChild(i);
  //
  //         return child.collectIds(selection[i]);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }



  getSelectedItems(selection) {

    if (selection.final) {

      const index = selection.index || 0;
      const length = selection.length || 0;

      return this.resource.items.slice(index, index + length);

    } else {

      for (let i = 0; i < this.resource.items.length; i++) {

        if (selection[i]) {

          const child = this.getChild(i);

          return child.getSelectedItems(selection[i]);

        }

      }

    }

  }

  hasSelection(selection) {

    if (selection.final) {

      return selection.length > 0;

    } else {

      for (let i = 0; i < this.resource.items.length; i++) {

        if (selection[i]) {

          const child = this.getChild(i);

          return child.hasSelection(selection[i]);

        }

      }

    }

  }

  getMaxDepth() {

    return this.resource.maxDepth || 0;

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

      const item = this.resource.items[index] || {};

      return this.createChild({
        type: "branch",
        items: item.children || [],
        // children: tree.children || [],
        id: item.id,
        columns: this.resource.columns,
        depth: this.resource.depth++,
        index: index,
        path: [...this.resource.path, this.resource.index],
        maxDepth: this.getMaxDepth() - 1
      });

    }

  }


  follow(selection, callback) {

    if (selection.final) {

      return callback(this, selection)

    } else if (selection.row) {

      const row = this.getChild("row");

      return row.follow(selection.row, callback);

    } else {

      for (let i = 0; i < this.resource.items.length; i++) {

        const item = this.resource.items[i];

        if (selection[i]) {

          // const branch = this.createChild({
          //   type: "branch",
          //   items: item.children,
          //   // children: item.children,
          //   id: item.id,
          //   columns: this.resource.columns,
          //   depth: this.resource.depth++,
          //   index: i,
          //   path: [...this.resource.path, this.resource.index],
          // });

          const branch = this.getChild(i);

          return branch.follow(selection[i], callback);
        }

      }

    }

  }

  getSelectionChild(selection) {

    if (selection.row) {

      return this.createChild({
        id: this.resource.id,
        type: "row",
        children: this.resource.columns || [],
        index: "row"
      });

    } else {

      for (let index in this.resource.items) {

        if (selection[index]) {

          const item = this.resource.items[index];

          return this.createChild({
            type: "branch",
            items: item.children || [],
            // children: tree.children || [],
            id: item.id,
            columns: this.resource.columns,
            depth: this.resource.depth++,
            index: index,
            path: [...this.resource.path, this.resource.index],
            maxDepth: this.getMaxDepth() - 1
          });

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

  // swap(originPath, originIndex, destPath, destIndex, length) {
  swap(index, newIndex, length, path, newPath) {

    // this.parent.swap(originPath, originIndex, destPath, destIndex, length);
    this.parent.swap(index, newIndex, length, path, newPath);

  }

  delete(selection = this.getSelection()) {

    const child = this.getSelectionChild(selection);

    if (child) {

      child.delete(selection[child.resource.index]);

    } else if (selection) {

      this.remove(selection.index || 0, selection.length || 0)

    }

  }

  remove(index, length, ...path) {

    this.parent.remove(index, length, this.resource.index, ...path);

  }

  // getPath() {
  //
  //   const selection = this.getSelection();
  //
  //   if (selection) {
  //
  //     return [...this.parent.getPath(), this.resource.index]
  //
  //   }
  //
  //
  // }
  //
  // getSelectionPath() {
  //
  //   const selection = this.getSelection();
  //
  //   if (selection) {
  //
  //     return [...this.parent.getPath(), this.resource.index]
  //
  //   }
  //
  //
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


        const items = this.resource.items || [];
        ul.element.style.height = "auto";
        const path = this.resource.path || [];
        const sorter = new KarmaFieldsAlpha.HSorter(ul.element);
        // const sorter = new KarmaFieldsAlpha.Sorter(ul.element);
        let selection = this.getSelection();

        sorter.colCount = 1;
        sorter.rowCount = items.length;
        sorter.currentSelection = selection;
        sorter.selection = selection;
        // sorter.path = this.resource.path || [];
        sorter.path = [...path, this.resource.index];

        sorter.maxDepth = this.getMaxDepth();

        // sorter.field = this; // just for debug
        // sorter.fieldElement = ul.element; // just for debug
        // sorter.fieldIndex = this.resource.index; // just for debug



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


        sorter.onsort = (index, newIndex, length, path, newPath) => {

          this.parent.request("completeSwap");

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

        sorter.onSwap = (index, newIndex, length, path, newPath) => {

          // this.setSelection({
          //   index: newSelection.index,
          //   length: newSelection.length,
          //   final: true
          // });
          //
          //
          // selection = this.getSelection();


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

        // const indexParam = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, this.resource.driver, "alias", "index") || "index";


        // this.resource.children.sort((a, b) => (a[indexParam] || 0) - (b[indexParam] || 0));

        ul.children = items.map((child, index) => {
          // const path = this.resource.path || [];
          const branch = this.createChild({
            type: "branch",
            items: child.children,
            id: child.id,
            // ...child, // -> children + id + parent + i
            columns: this.resource.columns,
            depth: (this.resource.depth || 0) + 1,
            maxDepth: this.getMaxDepth() - 1,
            index: index,
            path: [...this.resource.path, this.resource.index]
          });

          // const branch = this.getChild(index);

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


                  // if (child.id) {
                    const row = branch.createChild({
                      id: child.id,
                      type: "row",
                      children: this.resource.columns || [],
                      index: "row",
                      rowIndex: branch.resource.index
                      // depth: this.resource.depth || 0
                    });
                    header.children = this.resource.columns.map((child, childIndex) => {
                      return {
                        tag: "li",
                        init: li => {
                          if (child.style) {
                            li.element.style = child.style;
                          }
                        },
                        child: row.createChild({
                          ...child,
                          index: childIndex
                        }).build()
                      }
                    });
                  // }


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
