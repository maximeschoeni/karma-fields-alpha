
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



    // const index = (selection.index || 0) + (selection.length || 0);

    const index = selection.index || 0;
    const length = selection.length || 0;


    KarmaFieldsAlpha.Query.add(this.resource.driver, params, 0, index, ...path);



    this.setSelection({index: index + length, length: 1, path: path});

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

      // const selection = {index: 0, index: 0};
      //
      // KarmaFieldsAlpha.DeepObject.set(selection, {index: newIndex, length: length}, ...newPath);
      //
      // this.setSelection(selection);

      items = KarmaFieldsAlpha.DeepArray.clone(items);

      const transferedItems = KarmaFieldsAlpha.DeepArray.splice(items, length, [], ...path, index);

      KarmaFieldsAlpha.DeepArray.splice(items, 0, transferedItems, ...newPath, newIndex);

      KarmaFieldsAlpha.Store.setIds(items);

      KarmaFieldsAlpha.DeepArray.forEachObject(items[0], (item, index, parent) => {

        const currentPosition = this.getSingleValue(item.id, "position");
        const currentParent = this.getSingleValue(item.id, "parent");

        if (parseInt(currentPosition) !== index) {

          this.setValue(index, item.id, "position");

        }

        if (currentParent !== parent) {

          this.setValue(parent, item.id, "parent");

        }

      });


      // const originCompartment = KarmaFieldsAlpha.DeepArray.get(items, ...path);
      // const destCompartment = KarmaFieldsAlpha.DeepArray.get(items, ...newPath);
      //
      // if (originCompartment) {
      //
      //   originCompartment.children.map((item, index) => {
      //
      //     const currentIndex = this.getSingleValue(item.id, "position");
      //
      //     if (parseInt(currentIndex) !== index) {
      //
      //       this.setValue(index, item.id, "position");
      //
      //     }
      //
      //   });
      //
      // }
      //
      // if (destCompartment && destCompartment !== originCompartment) {
      //
      //   destCompartment.children.map((item, index) => {
      //
      //     const currentIndex = this.getSingleValue(item.id, "position");
      //
      //     if (parseInt(currentIndex) !== index) {
      //
      //       this.setValue(index, item.id, "position");
      //
      //     }
      //
      //     this.setValue(destCompartment.id, item.id, "parent");
      //
      //   });
      //
      // }

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

  // completeSwap() {
  //
  //   let items = this.getItems();
  //   // const driver = this.getDriver();
  //   // const indexAlias = KarmaFieldsAlpha.Query.getAlias(driver, "index");
  //   // const parentAlias = KarmaFieldsAlpha.Query.getAlias(driver, "parent");
  //
  //   KarmaFieldsAlpha.DeepArray.forEachObject(items[0], (item, index, parent) => {
  //
  //     // const parentId = parent && parent.id || "0";
  //
  //     const currentIndex = this.getSingleValue(item.id, "position");
  //     const currentParentId = this.getSingleValue(item.id, "parent");
  //
  //     if (currentIndex === KarmaFieldsAlpha.loading || currentParentId === KarmaFieldsAlpha.loading) {
  //
  //       console.error("item not loaded!");
  //
  //     }
  //
  //     if (index !== currentIndex) {
  //
  //       this.setValue(index, item.id, "position");
  //       // this.render();
  //       // this.save("swap");
  //
  //     }
  //
  //     if (parent.id !== currentParentId) {
  //
  //       this.setValue(parent.id, item.id, "parent");
  //       // this.render();
  //       // this.save("swap");
  //
  //     }
  //
  //   });
  //
  //
  //
  // }



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

    const child = this.getSelectedChild(selection);

    if (child) {

      return child.getSelectedItems(selection.child);

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

    // if (selection && selection[0]) {
    //
    //   const branch = this.getChild(0);
    //
    //   return branch.hasSelection(selection[0]);
    //
    // }

    if (selection && selection.child) {

      const branch = this.getChild(selection.childId);

      return branch.hasSelection(selection.child);

    }

    return false;

  }

  isRowSelected(selection = this.getSelection()) {

    if (selection) {

      const child = this.getSelectedChild(selection);

      if (child) {

        return child.isRowSelected();
      }

    }

    return false;
  }

  // follow(selection, callback) {
  //
  //   if (selection.final || selection.modal && selection.modal.final) {
  //
  //     return callback(this, selection);
  //
  //   } else if (selection.modal) {
  //
  //     // const modal = this.createChild({
  //     //   ...this.resource.modal,
  //     //   type: "modal",
  //     //   index: "modal",
  //     //   ids: this.getSelectedIds(selection)
  //     // });
  //     //
  //     // return modal.follow(selection.modal, callback);
  //
  //     return this.getChild("modal").follow(selection.modal, callback);
  //
  //   } else if (selection[0]) { // -> follow branches
  //
  //     // const tree = this.createTree();
  //     //
  //     // if (tree.hasSelection(selection)) {
  //     //
  //     //   return callback(this, selection);
  //     //
  //     // } else { // -> follow branches till row
  //     //
  //     //   const branch = this.createChild({
  //     //     type: "branch",
  //     //     children: tree.children,
  //     //     id: tree.id,
  //     //     columns: this.resource.children,
  //     //     depth: 0,
  //     //     index: 0,
  //     //     path: [],
  //     //   });
  //     //
  //     //   return branch.follow(selection[0], callback);
  //     //
  //     // }
  //
  //     return this.getChild(0).follow(selection[0], callback);
  //
  //   }
  //
  // }

  getModal(selection = this.getSelection()) {

    const child = this.getSelectedChild(selection);

    if (child) {

      if (!child.getModal) {

        console.warn("child is not a branch", child, selection);

      } else {

        return child.getModal(selection.child);

      }

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
        modal: this.resource.modal,
        hierarchical: this.resource.hierarchical,
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

      if (selection.modal) {

        return this.createChild({
          ...this.resource.modal,
          type: "modal",
          index: "modal",
        });

      } else if (selection[0]) {

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

    // if (selection[0]) {
    //
    //   // const tree = this.createTree();
    //   //
    //   // const branch = this.createChild({
    //   //   type: "branch",
    //   //   children: tree.children,
    //   //   id: tree.id,
    //   //   columns: this.resource.modal && this.resource.modal.children || this.resource.children,
    //   //   depth: 0,
    //   //   index: 0,
    //   //   path: [],
    //   // });
    //
    //   const branch = this.getChild(0);
    //
    //   return branch.paste(value, selection[0]);
    //
    // }


    // -> same as field !

    if (selection.child) {

      const branch = this.getChild(selection.childId);

      return branch.paste(value, selection.child);

    }

  }

  copy(selection) {

    // if (selection[0]) {
    //
    //   // const tree = this.createTree();
    //   //
    //   // const branch = this.createChild({
    //   //   type: "branch",
    //   //   children: tree.children,
    //   //   id: tree.id,
    //   //   columns: this.resource.modal && this.resource.modal.children || this.resource.children,
    //   //   depth: 0,
    //   //   index: 0,
    //   //   path: [],
    //   // });
    //
    //   const branch = this.getChild(0);
    //
    //   return branch.copy(selection[0]);
    //
    // }

    // -> same as field !

    if (selection.child) {

      const branch = this.getChild(selection.childId);

      return branch.copy(selection.child);

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

    this.setSelection({index: 0, length: 0});
    this.save("delete");
    this.render();

  }



  clearModalSelection(selection = this.getSelection()) {

    // const selection = this.getSelection();
    //
    // this.setSelection({0: selection[0]}); // = remove modal property

    // this.setSelection({child: {}, childId: "modal"});

    const child = this.getSelectedChild(selection);

    if (child && child.clearModalSelection) {

      child.clearModalSelection(selection);

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
            classes: ["table", "grid", "arrangement", "tree", "root"],
            hierarchical: this.resource.hierarchical
            // maxDepth: this.resource.maxDepth || 0
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

    // if (selection && selection[selection.index]) {
    //
    //   const branch = this.getChild(selection.index);
    //
    //   return branch.copy(selection[selection.index]);
    //
    // } else if (selection) {
    //
    //   const grid = new KarmaFieldsAlpha.Grid();
    //   const index = selection.index || 0;
    //   const length = selection.length || 0;
    //
    //   for (let i = 0; i < length; i++) {
    //
    //     const child = this.getChild(i + index);
    //
    //     const row = child.getChild("row");
    //
    //     const rowItems = row.export();
    //
    //     grid.addRow(rowItems);
    //
    //   }
    //
    //   return grid.toString();
    //
    // }

    if (selection && !selection.child) {

      const grid = new KarmaFieldsAlpha.Grid();
      const index = selection.index || 0;
      const length = selection.length || 0;

      for (let i = 0; i < length; i++) {

        const child = this.getChild(i + index);

        const row = child.getChild("row");

        const rowItems = row.export();

        grid.addRow(rowItems);

      }

      return grid.toString();

    } else {

      return super.copy(selection);

    }

  }

  async paste(value, selection) {

    // if (selection && selection[selection.index]) {
    //
    //   const branch = this.getChild(selection.index);
    //
    //   return branch.paste(value, selection[i]);
    //
    // } else if (selection) {
    //
    //   const grid = new KarmaFieldsAlpha.Grid(value);
    //   const index = selection.index || 0;
    //   const length = selection.length || 0;
    //
    //   if (grid.array.length < length) {
    //
    //     this.remove(index + grid.array.length, length - grid.array.length);
    //
    //   } else if (grid.array.length > length) {
    //
    //     for (let i = 0; i < grid.array.length - length; i++) {
    //
    //       await this.add(index + length);
    //
    //     }
    //
    //   }
    //
    //   for (let i = 0; i < grid.array.length; i++) {
    //
    //     const rowItems = grid.array[i];
    //
    //     const branch = this.getChild(i + index);
    //     const row = branch.getChild("row");
    //
    //     row.import(rowItems);
    //
    //   }
    //
    // }

    if (selection && !selection.child) {

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

        const branch = this.getChild(i + index);
        const row = branch.getChild("row");

        row.import(rowItems);

      }

    } else {

      super.paste(value, selection);

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


  // !!  modal needs selected items from above, saucer need selected items from below (transfers)
  getSelectedItems(selection = this.getSelection()) {

    // if (selection.final) {
    //
    //   const index = selection.index || 0;
    //   const length = selection.length || 0;
    //
    //   return this.resource.items.slice(index, index + length);
    //
    // } else {
    //
    //   for (let i = 0; i < this.resource.items.length; i++) {
    //
    //     if (selection[i]) {
    //
    //       const child = this.getChild(i);
    //
    //       return child.getSelectedItems(selection[i]);
    //
    //     }
    //
    //   }
    //
    // }

    // if (selection) {
    //
    //   if (selection[selection.index]) {
    //
    //     const child = this.getChild(selection.index);
    //
    //     return child.getSelectedItems(selection[selection.index]);
    //
    //   } else {
    //
    //     const index = selection.index || 0;
    //     const length = selection.length || 0;
    //
    //     return this.resource.items.slice(index, index + length);
    //
    //   }
    //
    // }

    if (selection) {

      const index = selection.index || 0;
      const length = selection.length || 0;

      return this.resource.items.slice(index, index + length);

    }

    return [];


    // else {
    //
    //   for (let i = 0; i < this.resource.items.length; i++) {
    //
    //     if (selection[i]) {
    //
    //       const child = this.getChild(i);
    //
    //       return child.getSelectedItems(selection[i]);
    //
    //     }
    //
    //   }
    //
    // }

  }

  // setSelection(selection) {
  //
  //   if (selection) {
  //
  //     selection = {
  //       ...this.getSelection(), // keep index/length
  //       ...selection
  //     };
  //
  //   }
  //
  //   super.setSelection(selection);
  // }

  hasSelection(selection) {

    if (selection && selection.child) {

      const child = this.getChild(selection.childId);

      return child.hasSelection(selection.child);

    } else if (selection) {

      return selection.length > 0;

    }

    return false;

  }

  getMaxDepth() {

    return this.resource.maxDepth || 0;

  }

  getModal(selection = this.getSelection()) {

    if (selection && selection.length) {

      return this.getChild("modal");

    } else if (selection && selection.child) {

      const child = this.getSelectedChild(selection);

      if (child && child instanceof KarmaFieldsAlpha.field.hierarchy.branch) {

        return child.getModal(selection.child);

      }

    }

    // const child = this.getSelectedChild(selection);
    //
    // if (child) {
    //
    //   if (child instanceof KarmaFieldsAlpha.field.grid.modal) {
    //
    //     return child;
    //
    //   } else if (child instanceof KarmaFieldsAlpha.field.hierarchy.branch) {
    //
    //     return child.getModal(selection.child);
    //
    //   }
    //
    // }

  }

  clearModalSelection(selection = this.getSelection()) {

    const child = this.getSelectedChild(selection);

    if (child && child instanceof KarmaFieldsAlpha.field.hierarchy.branch) {

      this.clearModalSelection(selection.child);

    } else if (selection && selection.childId === "modal") {

      const index = selection.index || 0;
      const length = selection.length || 0;

      this.setSelection({index: index, length: length});

    }

  }

  isRowSelected(selection = this.getSelection()) {

    const child = this.getSelectedChild(selection);

    if (child && child instanceof KarmaFieldsAlpha.field.hierarchy.branch) {

      return child.isRowSelected(selection.child);

    } else {

      return selection && selection.length ? true : false;

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

    } else if (index === "modal") {

      return this.createChild({
        type: "modal",
        ...this.resource.modal,
        // items: this.resource.items,
        index: "modal"
      });

    } else {

      const item = this.resource.items[index] || {};

      return this.createChild({
        type: "branch",
        items: item.children || [],
        // children: tree.children || [],
        id: item.id,
        columns: this.resource.columns,
        modal: this.resource.modal,
        depth: this.resource.depth++,
        index: index,
        path: [...this.resource.path, this.resource.index],
        maxDepth: this.getMaxDepth() - 1
      });

    }

  }


  // follow(selection, callback) {
  //
  //   if (selection.final) {
  //
  //     return callback(this, selection)
  //
  //   } else if (selection.row) {
  //
  //     const row = this.getChild("row");
  //
  //     return row.follow(selection.row, callback);
  //
  //   } else {
  //
  //     for (let i = 0; i < this.resource.items.length; i++) {
  //
  //       const item = this.resource.items[i];
  //
  //       if (selection[i]) {
  //
  //         // const branch = this.createChild({
  //         //   type: "branch",
  //         //   items: item.children,
  //         //   // children: item.children,
  //         //   id: item.id,
  //         //   columns: this.resource.columns,
  //         //   depth: this.resource.depth++,
  //         //   index: i,
  //         //   path: [...this.resource.path, this.resource.index],
  //         // });
  //
  //         const branch = this.getChild(i);
  //
  //         return branch.follow(selection[i], callback);
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  // getSelectionChild(selection) {
  //
  //   if (selection.row) {
  //
  //     return this.createChild({
  //       id: this.resource.id,
  //       type: "row",
  //       children: this.resource.columns || [],
  //       index: "row"
  //     });
  //
  //   } else {
  //
  //     for (let index in this.resource.items) {
  //
  //       if (selection[index]) {
  //
  //         const item = this.resource.items[index];
  //
  //         return this.createChild({
  //           type: "branch",
  //           items: item.children || [],
  //           // children: tree.children || [],
  //           id: item.id,
  //           columns: this.resource.columns,
  //           depth: this.resource.depth++,
  //           index: index,
  //           path: [...this.resource.path, this.resource.index],
  //           maxDepth: this.getMaxDepth() - 1
  //         });
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }



  // setSelection(selection) {
  //
  //   // console.log("setSelection", selection, this.resource);
  //
  //   this.parent.setSelection(selection && {
  //     [this.resource.index]: selection,
  //     index: this.resource.index,
  //     length: 0
  //   });
  //
  // }



  setAbsoluteSelection(selection, ...path) { // -> needed to set a selection with a different path from a reference node

    // const path = selection.path || [];
    //
    // delete selection.path;
    //
    // while (path.length) {
    //
    //   const index = path.pop();
    //
    //   selection = {index: index, length: 0, [index]: selection};
    //
    // }


    // if (selection.path) {
    //
    //   const newSelection = {index: selection.path[0], length: 0};
    //
    //   KarmaFieldsAlpha.DeepObject.set(newSelection, {index: selection.index, length: selection.length}, ...selection.path);
    //
    //   this.setAbsoluteSelection(newSelection);
    //
    // } else {
    //
    //   this.parent.setAbsoluteSelection(selection);
    //
    // }

    this.parent.setAbsoluteSelection(selection, ...path);

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

    // const child = this.getSelectionChild(selection);
    //
    // if (child) {
    //
    //   child.delete(selection[child.resource.index]);
    //
    // } else if (selection) {
    //
    //   this.remove(selection.index || 0, selection.length || 0)
    //
    // }

    if (selection && !selection.child) {

      const index = selection.index || 0;
      const length = selection.length || 0;

      this.remove(index, length);

    } else {

      super.delete(selection);

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

        let selection = this.getSelection();

        // const sorter = new KarmaFieldsAlpha.HSorter(ul.element);
        //
        //
        // sorter.colCount = 1;
        // sorter.rowCount = items.length;
        // sorter.currentSelection = selection;
        // sorter.selection = selection;
        // sorter.path = [...path, this.resource.index];
        //
        // sorter.maxDepth = this.getMaxDepth();

        // if (selection) {
        //
        //   selection = {index: selection.index, length: selection.length}; // -> get ride of subselection
        //
        // }




        let sorter = new KarmaFieldsAlpha.ListSortHierarchy(ul.element, selection, this.resource.hierarchical, ...path, this.resource.index);





        // if (this.resource.hierarchical) {
        //
        //   sorter = new KarmaFieldsAlpha.ListSortHierarchy(ul.element, selection, ...path, this.resource.index);
        //
        // } else {
        //
        //   sorter = new KarmaFieldsAlpha.ListSorter(ul.element, selection);
        //
        // }

        // sorter.selection = {selection};
        // sorter.path = [...path, this.resource.index];


        // sorter.onselect = newSelection => {
        //
        //   this.setSelection(newSelection);
        //   this.deferFocus();
        //   this.save("nav");
        //   this.render();
        //
        //
        // }

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

          // const that = sorter;
          // debugger;

          this.swap(lastState.selection.index, newState.selection.index, newState.selection.length, lastState.path, newState.path);



        };

        sorter.onSort = (newState, lastState) => {

          this.deferFocus();
          this.save("order");
          this.render();

        }





        // sorter.onsort = (index, newIndex, length, path, newPath) => {
        //
        //   this.parent.request("completeSwap");
        //   this.deferFocus();
        //   this.save("swap");
        //   this.render();
        //
        // }
        //
        // sorter.onSwap = (index, newIndex, length, path, newPath) => {
        //
        //   this.swap(index, newIndex, length, path, newPath);
        //
        // }
        //
        //
        // sorter.onSelectionChange = newSelection => {
        //
        //   this.setSelection(newSelection);
        //
        // }
        //
        // sorter.onPaintRow = elements => {
        //   elements.forEach(element => element.classList.add("selected"))
        // }
        //
        // sorter.onUnpaintRow = elements => {
        //
        //   elements.forEach(element => element.classList.remove("selected"))
        // }



        ul.children = items.map((child, index) => {
          // const path = this.resource.path || [];
          const branch = this.createChild({
            type: "branch",
            items: child.children,
            id: child.id,
            // ...child, // -> children + id + parent + i
            columns: this.resource.columns,
            depth: (this.resource.depth || 0) + 1,
            // maxDepth: this.getMaxDepth() - 1,
            index: index,
            path: [...this.resource.path, this.resource.index],
            hierarchical: this.resource.hierarchical
          });

          // const branch = this.getChild(index);

          // return branch.build();

          return {
            tag: "li",
            class: "arrangement-item",
            update: li => {
              // const isSelected = KarmaFieldsAlpha.Selection.check(...path, index);
              // console.log(selection, li.element);
              const isSelected = selection && !selection[selection.index] && KarmaFieldsAlpha.Segment.contain(selection, index);

              li.element.classList.toggle("selected", Boolean(isSelected));
              li.element.classList.toggle("empty", !child.children || child.children.length === 0);
              li.element.classList.toggle("odd", index%2 === 0);
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
