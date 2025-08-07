
// KarmaFieldsAlpha.exit = Symbol("exit");

KarmaFieldsAlpha.field.medias = class extends KarmaFieldsAlpha.field.grid {

  getDriver() {

    return this.resource.driver || "medias";

  }

  // getFileType(index) {
  //
  //   // return this.getSingleValue(id, "filetype");
  //
  //   return this.getContent(index, "filetype");
  //
  // }

  getContent(index, key) {

    if (index === "exit") {

      switch (key) {
        case "id":
          return this.queryUpperFolderId()

        case "filetype":
          return new KarmaFieldsAlpha.Content("exit");

        case "filename":
        case "name":
          return new KarmaFieldsAlpha.Content("..");

        default:
          return new KarmaFieldsAlpha.Content("");

      }

    } else {

      return super.getContent(index, key);

    }

    // if (!this.isRoot()) {
    //
    //
    //
    // } else {
    //
    //   return super.getContent(index, key);
    //
    // }




    // if (index === 0) {
    //
    //   const query = this.getItems();
    //
    //   if (query.loading){
    //
    //     return new KarmaFieldsAlpha.Content.Request();
    //
    //   } else {
    //
    //     const item = query.toSingle();
    //
    //     if (item && item.exit) {
    //
    //       switch (key) {
    //         case "filetype":
    //           return new KarmaFieldsAlpha.Content("folder");
    //
    //         case "filename":
    //         case "name":
    //           return new KarmaFieldsAlpha.Content("..");
    //
    //         default:
    //           return new KarmaFieldsAlpha.Content("");
    //
    //       }
    //
    //     }
    //
    //   }
    //
    // }

    // if (!id || id === "0") {
    //
    //   switch (key) {
    //     case "filetype":
    //       return new KarmaFieldsAlpha.Content("folder");
    //
    //     case "filename":
    //     case "name":
    //       return new KarmaFieldsAlpha.Content("..");
    //
    //     default:
    //       return new KarmaFieldsAlpha.Content("");
    //
    //   }
    //
    // }

    // return super.getContent(index, key);

  }

  setValue(content, index, value) {

    if (index !== "exit") {

      super.setContent(content, index, key);

    }

    // if (!this.isRoot()) {
    //
    //   if (index > 0) {
    //
    //     super.setContent(content, index - 1, key);
    //   }
    //
    // } else {
    //
    //   super.setContent(content, index, key);
    //
    // }

  }


  // queryItems() {
  //
  //   const collection = this.getCollection();
  //
  //   const itemQuery = collection.queryItems();
  //
  //   if (!itemQuery.loading) {
  //
  //     if (!this.isRoot()) {
  //
  //       itemQuery.value = [
  //         {
  //           index: "exit"
  //         },
  //         ...itemQuery.toArray().map((item, index) => {
  //           return {...item, index};
  //         })
  //       ];
  //
  //     } else {
  //
  //       itemQuery.value = itemQuery.toArray().map((item, index) => ({...item, index}));
  //
  //     }
  //
  //   }
  //
  //
  //   return itemQuery;
  //
  // }

  queryItems() {

    const query = super.queryItems();
    const parent = this.parent.getContent("parent").toString() || "0";

    if (!query.loading) {

      query.value = query.toArray().map(item => {

        const parent = this.getContent(item.index, "parent").toString() || "0";
        const filetype = this.getContent(item.index, "filetype").toString();
        let order;

        if (item.uploading) {

          order = 3;

        } else if (item.adding) {

          order = 1;

        } else if (filetype === "folder") {

          order = 2;

        } else if (filetype === "file") {

          order = 4;

        } else {

          order = 2;

        }

        return {...item, parent, filetype, order};
      });

      query.value = query.toArray().filter(item => item.parent === parent);

      query.value.sort((a, b) => a.order - b.order);

      if (!this.isRoot()) {

        const grandParent = this.queryUpperFolderId();

        query.value = [
          {
            index: "exit",
            id: grandParent.toString() || "0",
            order: 0
          },
          ...query.toArray()
        ];

      }

    }

    return query;

  }


  // slice(index, length) {
  //
  //   const collection = this.getCollection();
  //   let itemsQuery = collection.queryItems();
  //
  //   if (!itemsQuery.loading) {
  //
  //     if (!this.isRoot()) {
  //
  //       index = Math.max(0, index - 1);
  //
  //     }
  //
  //     const items = itemsQuery.toArray().slice(index, index + length);
  //
  //     itemsQuery = new KarmaFieldsAlpha.Content(items);
  //
  //   }
  //
  //   return itemsQuery;
  // }
  //
  // sliceSelection() {
  //
  //   const selection = this.getSelection();
  //   const index = selection && selection.index || 0;
  //   const length = selection && selection.length || 0;
  //
  //   return this.slice(index, length);
  //
  // }

  // getItems() {
  //
  //   const query = this.getQuery();
  //
  //   // let items = KarmaFieldsAlpha.Store.Layer.getItems();
  //
  //   const response = new KarmaFieldsAlpha.Content();
  //
  //   if (query.loading) {
  //
  //     response.loading = true;
  //
  //   } else {
  //
  //     response.value = query.toItems();
  //
  //     // const ids = this.getIds();
  //     //
  //     // if (ids.loading) {
  //     //
  //     //   response.loading = true;
  //     //
  //     // } else {
  //
  //     // for (let item of response.value) {
  //     //
  //     //   if (!item.loading && !item.uploading && item.id) {
  //     //
  //     //     const value = this.getContent(id, "filetype");
  //     //     item.type = value.toString();
  //     //     item.loading = value.loading;
  //     //
  //     //   }
  //     //
  //     //
  //     // }
  //
  //       // response.value = response.value.map(item => {
  //       //
  //       //   const type = this.getContent(id, "filetype");
  //       //
  //       //   return {
  //       //     loading: type.loading,
  //       //     id: id,
  //       //     type: type.toString()
  //       //   };
  //       //
  //       // });
  //
  //       const parent = this.getParent();
  //       const parentId = parent.toString() || "0";
  //
  //       if (parentId !== "0") {
  //
  //         const exit = this.getParent(parentId);
  //
  //         response.value = [
  //           {
  //             id: exit.toString() || "0",
  //             // type: "folder",
  //             exit: true,
  //             loading: exit.loading
  //           },
  //           ...response.value
  //         ];
  //
  //       }
  //
  //       // if (!response.value.some(item => item.loading)) {
  //       //
  //       //   KarmaFieldsAlpha.Store.Layer.setItems(response.value);
  //       //
  //       // }
  //
  //       // KarmaFieldsAlpha.Backup.update(items, "ids");
  //       // KarmaFieldsAlpha.Store.set(items, "ids");
  //
  //     // }
  //
  //   }
  //
  //   return response;
  // }

  selectAll() {

    const query = this.queryItems();

    if (!query.loading) {

      const index = query.toArray().findIndex(item => item.index !== "exit");

      if (index > -1) {

        this.setSelection({
          index: index,
          length: query.toArray().length - index
        });

        this.request("render");

      }

    }

  }

  // getFiles() {
  //
  //   const params = this.getParams();
  //   const driver = this.getDriver();
  //
  //   if (params.loading) {
  //
  //     return new KarmaFieldsAlpha.Content.Request();
  //
  //   }
  //
  //   return new KarmaFieldsAlpha.Content.Medias(driver, params);
  //
  // }
  //
  // getFolders() {
  //
  //   const params = this.getFolderParams();
  //   const driver = this.getFolderDriver();
  //
  //   if (params.loading) {
  //
  //     return new KarmaFieldsAlpha.Content.Request();
  //
  //   }
  //
  //   return new KarmaFieldsAlpha.Content.Folders(driver, params);
  //
  // }


  // getItems() {
  // getQuery() {
  //
  //   const params = this.getParams();
  //   const driver = this.getDriver();
  //
  //   if (params.loading) {
  //
  //     return new KarmaFieldsAlpha.Content.Request();
  //
  //   }
  //
  //   return new KarmaFieldsAlpha.Content.Medias(driver, params.toObject());
  //
  // }

  // setItems(items) {
  // setQuery(query) {
  //
  //   const items = query.toArray();
  //
  //   if (items[0] && items[0].exit) {
  //
  //     query.value = query.value.slice(1);
  //
  //   }
  //
  //   super.setQuery(query);
  // }



  // getSelectedItems() {
  //
  //   const items = this.getItems();
  //
  //
  //   if (items) {
  //
  //     const selection = this.getSelection();
  //
  //     if (selection) {
  //
  //       const index = selection.index || 0;
  //       const length = selection.length || 0;
  //
  //       return items.slice(index, index + length);
  //
  //     }
  //
  //   }
  //
  //   return [];
  // }





  // isValidMixedSelection(selection) {
  //
  //   const parent = this.getParent() || "0";
  //
  //   return parent === "0" || selection.index > 0 || selection.length > 1;
  //
  // }

  // purifySelection(selection) {
  // console.error("deprecated");
  //   const parent = this.getParent() || "0";
  //
  //   if (parent !== "0") {
  //
  //     selection = {...selection};
  //
  //     if (selection.index > 0) {
  //
  //       selection.index--;
  //
  //     } else {
  //
  //       selection.length--;
  //
  //     }
  //
  //   }
  //
  //   return selection;
  // }


  // add() {
  //
  //
  //
  //   // const content = this.getItems();
  //   //
  //   // if (!content.loading) {
  //   //
  //   //   const items = content.toArray();
  //   //   const firstFolderIndex = items.findIndex(item => this.isFolder(item));
  //   //   const maxIndex = Math.max(firstFolderIndex, 0);
  //   //   const firstIndex = items[0].exit ? 1 : 0;
  //
  //     // let index = this.getSelection("index") || 0;
  //     //
  //     // index = Math.min(Math.max(index, firstIndex), maxIndex);
  //     //
  //     // super.add();
  //     //
  //     // this.setSelection({
  //     //   index: index,
  //     //   length: 0
  //     // });
  //
  //     this.save("insert", "Insert");
  //
  //     let index = 1
  //
  //     this.addAt(index, 1);
  //
  //     this.setSelection({index, length: 1});
  //
  //     this.request("render");
  //
  //   // }
  //
  // }

  getDefaultIndex() {

    return 0;

    // if (this.isRoot()) {
    //
    //   return 0;
    //
    // } else {
    //
    //   return 1;
    //
    // }

  }




  // async add(params = {}) {
  //
  //   const parent = this.getParent() || "0";
  //
  //   // await super.add({
  //   //   filetype: ["folder"],
  //   //   mimetype: [""],
  //   //   parent: [parent],
  //   //   ...params
  //   // });
  //
  //
  //   const items = this.getItems();
  //
  //   const selection = this.getSelection() || {};
  //
  //   let index = (selection.index || 0) + (selection.length || 0);
  //
  //   if (items && index === 0 && items[0].exit) {
  //
  //     index++;
  //
  //   }
  //
  //   const {page, ppp, orderby, order, ...defaultParams} = this.resource.params; // default params are needed (e.g) for setting post-type
  //
  //   KarmaFieldsAlpha.Query.add(this.resource.driver, {
  //     ...defaultParams,
  //     filetype: ["folder"],
  //     mimetype: [""],
  //     parent: [parent],
  //     ...params
  //   }, index);
  //
  //   this.setSelection({index: index, length: 1});
  //
  //   await this.render();
  //
  //   this.save("add"); // -> wait until default fields are all set to save
  //
  // }

  //
  // export(dataRow = [], index = 0, length = 999999) {
  //
  //   if (this.resource.export || this.resource.import) {
  //
  //     return super.export(dataRow, index, length);
  //
  //   } else { // -> just export ids
  //
  //     const items = this.getItems().filter(item => !item.exit);
  //     const grid = new KarmaFieldsAlpha.Grid();
  //     const slice = items.slice(index, index + length).filter(item => item.id).map(item => item.id);
  //
  //     grid.addColumn(slice);
  //
  //     dataRow.push(grid.toString());
  //
  //     return dataRow;
  //
  //   }
  //
  //
  //
  // }
  //
  // import(dataRow, index = 0, length = 999999) {
  //
  //   const string = dataRow.shift();
  //   const driver = this.getDriver();
  //   // const currentIds = this.getIds();
  //   const currentItems = this.getItems().filter(item => !item.exit);
  //
  //   for (let i = 0; i < length; i++) {
  //
  //     KarmaFieldsAlpha.Store.setValue(["1"], driver, currentItems[i + index].id, "trash");
  //     KarmaFieldsAlpha.Query.saveValue(["1"], driver, currentItems[i + index].id, "trash");
  //
  //   }
  //
  //   // const newIds = [...currentIds];
  //   const newItems = [...currentItems];
  //   const grid = new KarmaFieldsAlpha.Grid(string);
  //   const ids = grid.getColumn(0);
  //   const parent = this.getParent() || "0";
  //   const parentAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "parent") || "parent";
  //
  //   for (let id of ids) {
  //
  //     KarmaFieldsAlpha.Store.setValue([parent], driver, id, parentAlias);
  //     KarmaFieldsAlpha.Store.setValue([], driver, id, "trash");
  //
  //     KarmaFieldsAlpha.Query.saveValue({
  //       [parentAlias]: [parent],
  //       trash: []
  //     }, driver, id);
  //
  //   }
  //
  //
  //   // newIds.splice(index, length, ...ids.map(id => ({id: id})));
  //   newItems.splice(index, length, ...ids.map(id => ({id: id})));
  //
  //   KarmaFieldsAlpha.Store.setIds(newItems);
  //
  //   KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.Query.queries, driver);
  //
  // }

  // createFolder() {
  //
  //   console.error("deprecated");
  //
  //   const parent = this.getParent() || "0";
  //   const driver = this.getDriver();
  //
  //   // KarmaFieldsAlpha.Query.add(driver, 1, {
  //   //   filetype: "folder",
  //   //   parent: parent
  //   // });
  //
  //   const selection = this.getSelection() || {};
  //
  //   index = selection.index || 0;
  //
  //   if (parent !== "0") {
  //
  //     index = Math.max(index, 1);
  //
  //   }
  //
  //   this.add(index, {
  //     filetype: ["folder"],
  //     mimetype: [""],
  //     parent: [parent]
  //   });
  //
  // }

  // openFolder(item) {
  //
  //   let id;
  //
  //   if (item.exit) {
  //
  //     const parent = KarmaFieldsAlpha.Store.Layer.getParam("parent") || "0";
  //
  //     const grandParent = this.getContent(parent, "parent");
  //
  //     if (grandParent.loading) {
  //
  //       KarmaFieldsAlpha.Store.Tasks.add({
  //         type: "upperfolder",
  //         resolve: () => this.openFolder(item)
  //       });
  //
  //     } else {
  //
  //       id = grandParent.toString() || "0";
  //
  //     }
  //
  //   } else {
  //
  //     id = item.id;
  //
  //   }
  //
  //   if (id) {
  //
  //     const content = new KarmaFieldsAlpha.Content(id);
  //
  //     this.save(`open-${id}`, "Enter Directory");
  //
  //     this.parent.setContent(content, "parent");
  //
  //   }
  //
  //   this.request("render");
  // }


  // openFolder(index) {
  //
  //   // const filetypeQuery = this.getContent(index, "filetype");
  //   const idQuery = this.getContent(index, "id"); // if index === 0 (exit) will return grandparent id
  //
  //   // if (!query.loading) {
  //   //
  //   //   const filetype = query.toString();
  //   //
  //   //   if (filetype === "exit" || filetype === "folder") {
  //   //
  //   //   //   query = this.queryUpperFolderId();
  //   //   //
  //   //   // } else if (filetype === "folder") {
  //   //
  //   //     query = this.getContent(index, "id");
  //   //
  //   //   }
  //   //
  //   // }
  //
  //   if (idQuery.loading) {
  //
  //     let task = KarmaFieldsAlpha.Task.find(task => task.type === "open-directory");
  //
  //     if (!task) {
  //
  //       task = {
  //         type: "open-directory",
  //         resolve: task => this.openFolder(task.index)
  //       };
  //
  //       KarmaFieldsAlpha.Task.add(task);
  //     }
  //
  //     task.index = index;
  //
  //   } else {
  //
  //     this.save(`open-${idQuery.toString()}`, "Open Directory");
  //
  //     this.parent.setContent(idQuery, "parent");
  //
  //   }
  //
  //   this.request("render");
  // }

  openFolder(index) {

    const idQuery = this.getContent(index, "id"); // if index === 0 (exit) will return grandparent id

    if (idQuery.loading) {

      this.procrastinate("openFolder", index);

    } else {

      this.save(`open-${idQuery.toString()}`, "Open Directory");

      const id = idQuery.toString() || "0";

      this.parent.setContent(new KarmaFieldsAlpha.Content(id), "parent");

    }

    this.request("render");
  }

  queryUpperFolderId() {

    let content = this.parent.getContent("parent");

    if (!content.loading) {

      const driver = this.getDriver();
      const model = new KarmaFieldsAlpha.Model(driver);

      content = model.queryValue(content.toString(), "parent");

    }

    return content;
  }

  upperFolder() {
console.error("deprecated");

    this.openFolder(0);


    // const parent = KarmaFieldsAlpha.Store.Layer.getParam("parent") || "0";
    //
    // const grandParent = this.getParent(parent);
    //
    // if (grandParent.loading) {
    //
    //   KarmaFieldsAlpha.Store.Tasks.add({
    //     type: "upperfolder",
    //     resolve: () => this.upperFolder()
    //   });
    //
    // } else {
    //
    //   this.openFolder(grandParent.toString() || "0");
    //
    // }

  }

  hasParent(id) {

    const parent = this.getParent(id);

    return !parent.loading && parent.toBoolean();
  }

  getParent(id) {

    if (id) {

      const driver = this.getDriver();

      return new KarmaFieldsAlpha.Content.Value(driver, id, key);

      //
      // return this.getSingleValue(id, "parent") || "0";



      // return this.getContent(id, "parent");

    } else {

      // return KarmaFieldsAlpha.Store.getParam("parent") || "0";

      const parent = KarmaFieldsAlpha.Store.Layer.getParam("parent");

      return new KarmaFieldsAlpha.Content(parent);

    }

  }

  isRoot() {

    // const parent = KarmaFieldsAlpha.Store.Layer.getParam("parent");
    const parent = this.parent.getContent("parent");

    return (parent.toString() === "0");
  }

  // move(items, target) {
  //
  //   const driver = this.getDriver();
  //
  //   const itemsQuery = this.getItems();
  //
  //   items = items.filter(item => !item.exit);
  //
  //   if (itemsQuery.loading || items.some(item => item.loading)) {
  //
  //     KarmaFieldsAlpha.Store.Tasks.add({
  //       type: "move",
  //       resolve: () => this.move(items, target)
  //     });
  //
  //   } else if (items.length > 0) {
  //
  //     const ids = items.map(item => item.id);
  //
  //     this.save(`move-${target.id}`, "Move");
  //
  //     // const newItems = itemsQuery.toArray().filter(item => !ids.includes(item.id));
  //     const newItems = new KarmaFieldsAlpha.Content();
  //     newItems.value = itemsQuery.toArray().filter(item => !ids.includes(item.id));
  //
  //     this.setItems(newItems);
  //
  //     // const allItems = KarmaFieldsAlpha.Store.Layer.getItems().filter(item => !ids.includes(item.id));
  //     //
  //     // KarmaFieldsAlpha.Store.Layer.setItems(allItems);
  //
  //     // for (let id of ids) {
  //     //
  //     //   KarmaFieldsAlpha.Store.Delta.set([target.id || "0"], driver, id, "parent");
  //     //
  //     // }
  //
  //     this.setSelection({index: 0, length: 0});
  //
  //
  //     KarmaFieldsAlpha.Store.Tasks.add({
  //       type: "move",
  //       resolve: async () => {
  //
  //         for (let id of ids) {
  //
  //           const key = KarmaFieldsAlpha.Query.getAlias(driver, "parent");
  //
  //           KarmaFieldsAlpha.Store.Delta.set([target.id || "0"], driver, id, key);
  //
  //           await KarmaFieldsAlpha.Remote.update({[key]: [target.id || "0"]}, driver, id);
  //
  //         }
  //
  //         // KarmaFieldsAlpha.Store.remove("queries", driver);
  //         // KarmaFieldsAlpha.Store.remove("counts", driver);
  //
  //       }
  //     });
  //
  //   }
  //
  //   this.request("render");
  //
  // }

  moveAt(index, length, target) {

    // const targetQuery = this.queryItem(target);

    this.save("move", "Move");

    const collection = this.getCollection();
    const targetIdQuery = this.getContentAt(target, "id"); // exit folder return grandparent id
    const itemsQuery = this.queryItems();

    if (itemsQuery.loading || targetIdQuery.loading) {

      this.procrastinate("move", index, length, target);

    } else {

      const items = itemsQuery.toArray().slice(index, index + length);

      for (let item of items) {

        this.setContent(targetIdQuery, item.index, "parent");

      }

      // const data = Object.fromEntries(itemsQuery.slice(index, length).map(item => [item.id, {parent: targetIdQuery.toString()}]));
      // const task = new KarmaFieldsAlpha.Task.SaveData(collection.driver, data);
      //
      // KarmaFieldsAlpha.Task.add(task);

    }

    this.request("render");

  }

  // upload(files) {
  //
  //   const content = this.getItems();
  //
  //   if (!content.loading) {
  //
  //     let items = content.toArray();
  //
  //     let fileIndex = items.findIndex(item => item.type === "file");
  //
  //     if (fileIndex === -1) {
  //
  //       fileIndex = items.length;
  //
  //     }
  //
  //     let index = this.getSelection("index") || 0;
  //
  //     index = Math.max(index, fileIndex);
  //
  //     const length = this.getSelection("length") || 1;
  //
  //     KarmaFieldsAlpha.History.save("upload", "Upload");
  //
  //     items = [...items];
  //
  //     for (let file of files) {
  //
  //       items.splice(index, 0, {
  //         // loading: true,
  //         uploading: true
  //       });
  //
  //       this.addTask(async () => {
  //
  //         const driver = this.getDriver();
  //         const params = this.getFilters();
  //
  //         let id;
  //
  //         if (KarmaFieldsAlpha.useWPMediaUploader) {
  //
  //           id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent is not going to be saved!
  //
  //         } else {
  //
  //           id = await KarmaFieldsAlpha.HTTP.stream(file, params);
  //
  //         }
  //
  //         id = id.toString();
  //
  //     		// if (params) {
  //         //
  //         //   const data = {};
  //         //
  //         //   for (let key in params) {
  //         //
  //     		// 		if (params[key]) {
  //         //
  //     		// 			const values = params[key].split(",");
  //         //
  //         //       key = KarmaFieldsAlpha.Query.getAlias(driver, key);
  //         //
  //         //       data[key] = values;
  //         //
  //     		// 		}
  //         //
  //         //   }
  //         //
  //         //   await KarmaFieldsAlpha.Remote.update(data, driver, id);
  //         //
  //         //   KarmaFieldsAlpha.Store.Delta.set(data, driver, id);
  //         //
  //     		// }
  //
  //         if (params) {
  //
  //           const entries = Object.entries(params).filter(([key, value]) => value).map(([key, value]) => [KarmaFieldsAlpha.Query.getAlias(driver, key), value.split(",")]);
  //
  //           if (entries.length) {
  //
  //             const data = Object.fromEntries(entries);
  //
  //             await KarmaFieldsAlpha.Remote.update(data, driver, id);
  //
  //             KarmaFieldsAlpha.Store.Delta.set(data, driver, id);
  //
  //           }
  //
  //         }
  //
  //
  //         const newItems = KarmaFieldsAlpha.Store.Layer.getItems();
  //         const newItem = newItems.find(item => item.uploading);
  //
  //         if (!newItem) {
  //
  //           console.error("Uploading not found");
  //
  //         }
  //
  //         newItem.uploading = false;
  //         // newItem.loading = false;
  //         newItem.id = id;
  //
  //         KarmaFieldsAlpha.Store.Layer.setItems([...newItems]);
  //
  //         KarmaFieldsAlpha.Store.set([], "vars", driver, id, "trash");
  //         KarmaFieldsAlpha.Store.Delta.set([], driver, id, "trash");
  //
  //         KarmaFieldsAlpha.Store.remove("queries", driver);
  //         KarmaFieldsAlpha.Store.remove("counts", driver);
  //
  //       }, "upload");
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.Layer.setItems(items);
  //
  //     this.setSelection({index: index, length: files.length});
  //
  //   }
  //
  //   this.request("render");
  //
  // }




  // upload(files) {
  //
  //   let items = this.isCurrentLayer() && KarmaFieldsAlpha.Store.Layer.getItems();
  //
  //   let index;
  //
  //   if (items) {
  //
  //     let fileIndex = items.findIndex(item => item.type === "file");
  //
  //     if (fileIndex === -1) {
  //
  //       fileIndex = items.length;
  //
  //     }
  //
  //     index = this.getSelection("index") || 0;
  //
  //     index = Math.max(index, fileIndex);
  //
  //     items = [...items];
  //
  //   }
  //
  //   KarmaFieldsAlpha.History.save("upload", "Upload");
  //
  //   for (let file of files) {
  //
  //     if (items) {
  //
  //       items.splice(index, 0, {
  //         // loading: true,
  //         uploading: true
  //       });
  //
  //     }
  //
  //     this.addTask(async () => {
  //
  //       const driver = this.getDriver();
  //       const params = this.getFilters();
  //
  //       let id;
  //
  //       if (KarmaFieldsAlpha.useWPMediaUploader) {
  //
  //         id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent is not going to be saved!
  //
  //       } else {
  //
  //         id = await KarmaFieldsAlpha.HTTP.stream(file, params);
  //
  //       }
  //
  //       id = id.toString();
  //
  //       if (params) {
  //
  //         const entries = Object.entries(params).filter(([key, value]) => value).map(([key, value]) => [KarmaFieldsAlpha.Query.getAlias(driver, key), value.split(",")]);
  //
  //         if (entries.length) {
  //
  //           const data = Object.fromEntries(entries);
  //
  //           await KarmaFieldsAlpha.Remote.update(data, driver, id);
  //
  //           KarmaFieldsAlpha.Store.Delta.set(data, driver, id);
  //
  //         }
  //
  //       }
  //
  //       if (items) {
  //
  //         const newItems = KarmaFieldsAlpha.Store.Layer.getItems();
  //         const newItem = newItems.find(item => item.uploading);
  //
  //         if (!newItem) {
  //
  //           console.error("Uploading not found");
  //
  //         }
  //
  //         newItem.uploading = false;
  //         newItem.id = id;
  //
  //         KarmaFieldsAlpha.Store.Layer.setItems([...newItems]);
  //
  //       }
  //
  //       KarmaFieldsAlpha.Store.set([], "vars", driver, id, "trash");
  //       KarmaFieldsAlpha.Store.Delta.set([], driver, id, "trash");
  //
  //       KarmaFieldsAlpha.Store.remove("queries", driver);
  //       KarmaFieldsAlpha.Store.remove("counts", driver);
  //
  //     }, "upload");
  //
  //   }
  //
  //   if (items) {
  //
  //     KarmaFieldsAlpha.Store.Layer.setItems(items);
  //
  //     this.setSelection({index: index, length: files.length});
  //
  //   }
  //
  //   this.request("render");
  //
  // }


  // upload(files) {
  //
  //   if (!this.isCurrentLayer()) {
  //
  //     console.error("cannot upload files from another layer");
  //
  //   }
  //
  //   const content = this.getItems();
  //
  //   if (content.loading) {
  //
  //     this.addTask(() => this.upload(files), "upload");
  //
  //   } else {
  //
  //     const newContent = new KarmaFieldsAlpha.Content();
  //
  //     newContent.value = [...content.toArray()];
  //
  //     let index;
  //
  //     let fileIndex = items.findIndex(item => !this.isFolder(item));
  //
  //     if (fileIndex === -1) {
  //
  //       fileIndex = items.length;
  //
  //     }
  //
  //     index = this.getSelection("index") || 0;
  //
  //     index = Math.max(index, fileIndex);
  //
  //
  //
  //
  //     KarmaFieldsAlpha.History.save("upload", "Upload");
  //
  //     for (let file of files) {
  //
  //       newContent.value.splice(index, 0, {
  //         uploading: true
  //       });
  //
  //       this.addTask(async () => {
  //
  //         const driver = this.getDriver();
  //         const params = this.getFilters();
  //
  //         let id;
  //
  //         if (KarmaFieldsAlpha.useWPMediaUploader) {
  //
  //           id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent is not going to be saved!
  //
  //         } else {
  //
  //           id = await KarmaFieldsAlpha.HTTP.stream(file, params);
  //
  //         }
  //
  //         id = id.toString();
  //         const name = file.name;
  //
  //         if (params) {
  //
  //           const entries = Object.entries(params).filter(([key, value]) => value).map(([key, value]) => [KarmaFieldsAlpha.Query.getAlias(driver, key), value.split(",")]);
  //
  //           if (entries.length) {
  //
  //             const data = Object.fromEntries(entries);
  //
  //             await KarmaFieldsAlpha.Remote.update(data, driver, id);
  //
  //             KarmaFieldsAlpha.Store.Delta.set(data, driver, id);
  //
  //           }
  //
  //         }
  //
  //         const items = this.getItems();
  //         const newItemIndex = items.toArray().findIndex(item => item.uploading);
  //
  //         if (newItemIndex === -1) {
  //
  //           console.error("Uploading not found");
  //
  //         }
  //
  //         newItems = new KarmaFieldsAlpha.Content();
  //         newItems.value = [...items.toArray()];
  //         newItems.value[newItemIndex] = {id, name};
  //
  //         this.setItems(newItems);
  //
  //         KarmaFieldsAlpha.Store.set([], "vars", driver, id, "trash");
  //         KarmaFieldsAlpha.Store.Delta.set([], driver, id, "trash");
  //
  //         // KarmaFieldsAlpha.Store.remove("items", driver);
  //         // KarmaFieldsAlpha.Store.remove("counts", driver);
  //
  //       }, "upload");
  //
  //     }
  //
  //     this.setItems(newContent);
  //
  //     this.setSelection({index: index, length: files.length});
  //
  //   }
  //
  //   this.request("render");
  //
  // }


  getUploadIndex() {

    // const collection = this.getCollection();
    // let query = collection.queryItems();
    let index = 0;

    // if (!query.loading) {

      // const items = query.toArray();

      let query = this.getContentAt(index, "filetype");

      while (!query.loading && !query.outOfBounds && query.toString() !== "folder" && query.toString() !== "exit") {

        index++;
        query = this.getContentAt(index, "filetype");

      }

    // }

    return index;

    // const content = this.getItems();
    //
    // let index = content.toArray().findIndex(item => !this.isFolder(item));
    //
    // if (index === -1) {
    //
    //   index = content.toArray().length;
    //
    // }
    //
    // return Math.max(index, this.getSelection("index") || 0);

  }

  upload(files) {

    // if (!this.isCurrentLayer()) {
    //
    //   console.error("cannot upload files from another layer");
    //
    // }

    const index = this.getUploadIndex();

    this.save("upload", "Upload");

    this.uploadAt(files, index);


    const uploadedIndex = this.queryItems().toArray().findLastIndex(item => item.uploading);

    if (uploadedIndex > -1) {

      this.setSelection({index: uploadedIndex, length: 1});

    }





    this.request("render");

  }

  uploadAt(files, index) { // index is relative to collection !

    const collection = this.getCollection();
    const defaults = this.parse(this.resource.defaults || {});
    const filters = this.getFilters();



    if (defaults.loading || filters.loading) {

      console.warn("procrastinating uploadAt");

      this.procrastinate("uploadAt", files, index);

    } else {

      const params = {...filters.toObject(), ...defaults.toObject()};

      // const collectionIndex = collectionIndexQuery.toNumber();
      // let itemQuery = this.queryItemAt(index);
      //
      // while (!itemQuery.loading && !itemQuery.outOfBounds && isNaN(itemQuery.toObject().index)) {
      //
      //   index++;
      //   itemQuery = this.queryItemAt(index);
      //
      // }

      collection.upload(files, params, index);

      let query = this.queryItems();

      let items = query.toArray().filter(item => item.index >= index && item.index < index + files.length);


      // items = query.toArray().slice(index, index + length);

      for (let item of items) {

        const field = this.createChild({
          type: "row",
          children: this.resource.children,
        }, item.index);

        field.create();

        if (this.resource.modal) {

          const field = this.createChild({
            type: "row",
            children: this.resource.modal.children,
          }, item.index);

          field.create();

        }

      }

    }

  }




  // delete() {
  //
  //   const itemsQuery = this.querySelectedItems();
  //
  //   if (!itemsQuery.loading && itemsQuery.toArray().length > 0) {
  //
  //     KarmaFieldsAlpha.History.save("delete", "Delete");
  //
  //     // const index = selection.index || 0;
  //     // const length = selection.length || 0;
  //
  //     for (let item of itemsQuery.toArray()) {
  //
  //       if (item.index !== "exit") {
  //
  //         this.remove(item.index, 1);
  //
  //       }
  //
  //     }
  //
  //     this.removeSelection();
  //
  //     this.request("render");
  //
  //   }
  //
  //
  // }

  remove(collectionIndex, length = 1) {

    if (collectionIndex !== "exit") {

      super.remove(collectionIndex, length);

    }

  }




  // addAt(files, index) {
  //
  //   const collection = this.getCollection();
  //   const query = collection.queryItems();
  //   const defaults = this.parse(this.resource.defaults || {});
  //   const filters = this.getFilters();
  //
  //   if (query.loading || defaults.loading || filters.loading) {
  //
  //     console.warn("adding items while collection not loaded");
  //
  //   } else {
  //
  //     const params = {...filters.toObject(), ...defaults.toObject()};
  //     const newItems = [];
  //
  //     // for (let i = 0; i < files.length; i++) {
  //     //
  //     //   // collection.add(params, index);
  //     //
  //     //   collection.upload(files[i], params, index + i);
  //     //
  //     // }
  //
  //     collection.upload(files, params, index);
  //
  //     for (let i = 0; i < length; i++) {
  //
  //       const field = this.createChild({
  //         type: "row",
  //         children: this.resource.children,
  //       }, index + i);
  //
  //       field.create();
  //
  //       if (this.resource.modal) {
  //
  //         const field = this.createChild({
  //           type: "row",
  //           children: this.resource.modal.children,
  //         }, index + i);
  //
  //         field.create();
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }


  // uploadAt(files, index) {
  //
  //   const query = this.getItems();
  //
  //   if (query.loading) {
  //
  //     return;
  //
  //   }
  //
  //   const tokens = [];
  //
  //   for (let i = 0; i < files.length; i++) {
  //
  //     const token = this.createToken();
  //
  //     tokens.push(token);
  //
  //   }
  //
  //   const items = [...query.toArray()];
  //
  //   items.splice(index, 0, ...tokens.map(token => ({token, upload: true})));
  //
  //   // KarmaFieldsAlpha.Store.Delta.set(items, "items", query.driver, query.paramstring);
  //
  //   this.setItems(new KarmaFieldsAlpha.Content(items));
  //
  //   // const params = {...filters.toObject(), ...defaults.toObject()};
  //
  //   for (let i = 0; i < files.length; i++) {
  //
  //     // this.add(tokens[i], params);
  //
  //     KarmaFieldsAlpha.Store.Tasks.add({
  //       resolve: async task => {
  //
  //         const defaults = this.parse(this.resource.defaults || {});
  //         const filters = this.getFilters();
  //
  //         if (filters.loading) {
  //
  //           KarmaFieldsAlpha.Store.Tasks.add(task);
  //
  //         } else {
  //
  //           const id = await this.createMedia(files[i], filters);
  //
  //           const query = this.getItems();
  //           const items = query.toArray();
  //
  //
  //
  //           // const index = items.findIndex(item => item.token === task.token);
  //           //
  //           // if (index > -1) {
  //           //
  //           //   const newItems = [...deltaItems];
  //           //   newItems[index] = {id, name: "[new Item]"};
  //           //
  //           //   this.setItems(newItems);
  //           //
  //           // }
  //
  //           // const newItems = items.map(item => item.token === task.token && {id, name: "[new Item]"} || item);
  //
  //           this.setItems(query.toArray().map(item => {
  //
  //             if (item.token === task.token) {
  //
  //                return {id, name: "[new Item]"};
  //
  //             }
  //
  //             return item;
  //           }));
  //
  //           if (task.delta) {
  //
  //             for (let key in task.delta) {
  //
  //               KarmaFieldsAlpha.Store.Delta.set(task.delta[key], "vars", this.driver, id, key);
  //
  //             }
  //
  //           }
  //
  //         }
  //
  //       },
  //       token: tokens[i],
  //       type: "addItem"
  //     });
  //
  //     const row = this.createChild({
  //       type: "row",
  //       children: this.resource.children
  //     }, index);
  //
  //     row.create();
  //
  //   }
  //
  //   // this.setSelection({index, length});
  //
  //   // this.request("render");
  // }


  // async createMedia(file, params) {
  //
  //   const driver = this.getDriver();
  //
  //   let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent is not going to be saved!
  //
  //   id = id.toString();
  //
  //   // const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items", this.driver, this.paramstring);
  //   //
  //   // const index = deltaItems.findIndex(item => item.uploading);
  //   //
  //   // if (index > -1) {
  //   //
  //   //   const newDeltaItems = [...deltaItems];
  //   //   newDeltaItems[index] = {id, name: file.name};
  //   //
  //   //   KarmaFieldsAlpha.Store.Delta.set(newDeltaItems, "items", this.driver, this.paramstring);
  //   //
  //   // }
  //
  //   if (params && Object.values(params).length) {
  //
  //     const data = {};
  //
  //     for (let key in params) {
  //
  //       const keyAlias = KarmaFieldsAlpha.Driver.getAlias(driver, key);
  //
  //       const value = params[key].split(",");
  //
  //       data[keyAlias] = value;
  //
  //       KarmaFieldsAlpha.Store.set(value, "vars", driver, id, key);
  //       // KarmaFieldsAlpha.Store.set(true, "verifiedVars", this.driver, id, key);
  //       KarmaFieldsAlpha.Store.remove("diff", "vars", driver, id, key);
  //       KarmaFieldsAlpha.Store.Delta.set(value, "vars", driver, id, key);
  //
  //     }
  //
  //     await KarmaFieldsAlpha.HTTP.post(`update/${driver}/${id}`, data);
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.set(["1"], "vars", driver, id, "trash");
  //   // KarmaFieldsAlpha.Store.set(true, "verifiedVars", this.driver, id, "trash");
  //   KarmaFieldsAlpha.Store.remove("diff", "vars", driver, id, "trash");
  //   KarmaFieldsAlpha.Store.Delta.set([], "vars", driver, id, "trash");
  //
  //   // KarmaFieldsAlpha.Store.remove("items", this.driver);
  //   // KarmaFieldsAlpha.Store.remove("counts", this.driver);
  //
  //   await KarmaFieldsAlpha.Database.Queries.remove(driver);
  //
  //
  // }




  //
  // upload(files, params) {
  //
  //   const parent = this.getParent() || "0";
  //   const driver = this.getDriver();
  //   const selection = this.getSelection();
  //   let index = 0;
  //
  //   if (selection) {
  //
  //     index = (selection.index || 0) + (selection.length || 0);
  //
  //   }
  //
  //   const items = this.getItems();
  //
  //   if (items[index] && items[index].exit) {
  //
  //     index++;
  //
  //   }
  //
  //   params = {...params, parent: parent};
  //
  //   if (this.resource.default) {
  //
  //     const defaultParams = this.parse(["parseParams", this.resource.default]);
  //
  //     params = {...params, ...defaultParams};
  //
  //   }
  //
  //   KarmaFieldsAlpha.Query.upload(driver, files, params, index);
  //
  //   this.setMixedSelection({final: true, index: index, length: 1});
  //
  //
  //   // KarmaFieldsAlpha.Query.upload(driver, files, {}, index); // -> wp rest media wont handle parent...
  //
  //   this.save("upload");
  //
  //   this.render();
  // }

  changeFile(file, id) {

    this.upload([file], {id: id});

  }

  regen() {

    const ids = this.getSelectedItems().filter(item => !item.exit).map(item => item.id).filter(id => id);
    const driver = this.getDriver();

    if (ids.length) {

      KarmaFieldsAlpha.Query.regen(driver, ids);

    }

    this.render();
  }

  async uploadFromUrl(url) {

    // url = "https://upload.wikimedia.org/wikipedia/commons/6/65/Schwalbenschwanz-Duell_Winterthur_Schweiz.jpg";
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.split('/').pop();

    // const file = new File([blob], filename, {type: "image/jpg"});
    const file = new File([blob], filename);
    // const [fileId] = await this.upload([file]);
    this.upload(file);

  }




  isFolderAt(index) {

    const query = this.getContentAt(index, "filetype");

    return (query.toString() === "folder" || query.toString() === "exit");

    //
    // if (item.exit) {
    //
    //   return true;
    //
    // } else if (item.id) {
    //
    //   const driver = this.getDriver();
    //
    //   const content = new KarmaFieldsAlpha.Content.Value(driver, item.id, "filetype");
    //
    //   // const content = this.getContent(item.id, "filetype");
    //
    //   return content.toString() === "folder";
    //
    // }
    //
    // return false;

  }

  build() {

    return {
      class: "media-table-container",
      init: node => {
        node.element.ondrop = event => {
          event.preventDefault();
          // debugger;
          const files = event.dataTransfer.files;
          if (files.length) {
            this.request("upload", files);
          }
          node.element.classList.remove("drop-active");
        }

        node.element.ondragover = event => {
          event.preventDefault();
          node.element.classList.add("drop-active");
        }
        node.element.ondragleave = event => {
          event.preventDefault();
          node.element.classList.remove("drop-active");
        }
      } ,
      child: {
        class: "media-table",
        tag: "ul",
        init: grid => {
          if (this.resource.style) {
            grid.element.style = this.resource.style;
          }




        },
        update: grid => {

          // const request = this.getItems();

          const query = this.queryItems();

          grid.element.classList.toggle("loading", Boolean(query.loading));

          if (!query.loading) {

            const items = query.toArray();

            const page = this.getPage();
            const ppp = this.getPpp();
            const offset = (page - 1)*ppp;
            // const [parent] = this.parent.getValue("parent") || [];
            const parent = KarmaFieldsAlpha.Store.Layer.getParam("parent") || "0";

            const selection = this.getSelection();

            const dropZones = items.map((item, index) => index).filter(index => this.isFolderAt(index));

            const selector = new KarmaFieldsAlpha.Handler.DragAndDrop(grid.element, selection, dropZones);

            // const selector = new KarmaFieldsAlpha.ListSorterInline(grid.element, selection);

            selector.onSelect = elements => {
              elements.map(element => element.classList.add("selected"));
              this.setSelection(selector.state.selection);
            }

            selector.onUnselect = elements => {
              elements.map(element => element.classList.remove("selected"));
            }

            selector.onSelectionComplete = () => {
              this.setFocus(true);
              this.request("render");
            }

            selector.onDragOver = element => {
              element.classList.add("drop-active");
            };

            selector.onDragOut = element => {
              element.classList.remove("drop-active");
            };

            selector.onDraggedOver = element => {
              element.classList.add("drop-active");
            };

            selector.onDraggedOut = element => {
              element.classList.remove("drop-active");
            };

            selector.ondrop = (index, selection) => {
              // const target = items[index].index;
              // const selectedItems = items.slice(selector.state.selection.index, selector.state.selection.index + selector.state.selection.length);
              this.moveAt(selector.state.selection.index, selector.state.selection.length, index);
            };

            selector.onCancelDrag = () => {
              this.request("render");
            }

            grid.element.classList.toggle("has-selection", Boolean(this.hasFocus()));

            grid.children = items.map((item, index) => {
              return {
                tag: "li",
                class: "frame",
                update: li => {

                  li.element.classList.remove("drop-active");
                  li.element.classList.toggle("selected", KarmaFieldsAlpha.Segment.contain(selection, index));
                  li.element.classList.toggle("media-dropzone", Boolean(item.exit || this.isFolderAt(index)));

                  li.element.ondblclick = event => {
                    const query = this.getContent(item.index, "filetype");
                    if (query.toString() === "folder" || query.toString() === "exit") {
                      this.openFolder(item.index);
                    }

                    // if (!item.loading && this.isFolder(item)) {
                    //   this.openFolder(item);
                    // }
                  }

                  // const media = new KarmaFieldsAlpha.field.text.media({
                  //   id: item.id,
                  //   driver: this.getDriver(),
                  //   display: "thumb",
                  //   caption: true,
                  //   exit: item.exit,
                  //   loading: item.loading
                  // });

                  const row = this.createChild({
                    type: "row",
                  }, item.index);

                  const media = row.createChild({
                    type: "media",
                    // id: item.id,
                    // driver: this.getDriver(),
                    display: "thumb",
                    exit: item.index === "exit",
                    loading: item.loading,
                    uploading: item.uploading
                  }, item.index);

                  li.child = media.build();

                }

              };
            });

          }

        }
      }
    };

  }

}


// KarmaFieldsAlpha.field.saucer.table.footer = class extends KarmaFieldsAlpha.field.group {
//
//   constructor(resource) {
//
//     super({
//       display: "flex",
//       children: [
//         // "reload",
//         // "save",
//         // "add",
//         // "delete",
//         // "separator",
//         // "insert",
//         // "undo",
//         // "redo"
//         "save",
//         "upload",
//         "createFolder",
//         "delete",
//         "separator",
//         "undo",
//         "redo",
//         "insert"
//       ],
//       ...resource
//     });
//
//   }
//
// }


KarmaFieldsAlpha.field.saucer.upload = class extends KarmaFieldsAlpha.field.button {

	build() {

		return {
			class: "karma-upload karma-field button",
			init: button => {
				button.element.id = "upload-button";
			},
      // update: button => {
      //   if (this.resource.loading) {
      //     const loading = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.loading));
      //     button.element.classList.toggle("loading", loading);
      //   }
			// },
			children: [
				{
					tag: "input",
					init: input => {
						input.element.type = "file",
						input.element.id = this.getUid();
						input.element.multiple = true;
						input.element.hidden = true;
					},
					update: input => {
						input.element.onchange = async event => {
							const files = input.element.files;
							if (files.length) {
                this.parent.request("body", "upload", files);
							}
						}
					}
				},
				{
					tag: "label",
          class: "label",
					init: input => {
						input.element.htmlFor = this.getUid();
						input.element.textContent = this.resource.title || "Add File";
					}
				}
			]

		};
	}

}

KarmaFieldsAlpha.field.medias.description = class extends KarmaFieldsAlpha.field {

  build() {
    return {
      class: "karma-field karma-field-container media-description display-flex",
      update: container => {

        // const items = this.request("querySelectedItems");
        // const item = items.toSingle();
        // const loading = items.loading || item && item.loading;
        // const mixed = items.toArray().length > 1;
        // const exit = item && item.exit;
        // const id = item && item.id;
        // const uploading = item && item.uploading;
        // const token = item && item.token; //


        const query = this.request("querySelectedItems");

        // const item = items.toSingle();
        const loading = query.loading;
        const mixed = query.toArray().length > 1;
        // const exit = item && item.exit;
        // const id = item && item.id;
        const uploading = query.toObject().uploading;
        const adding = query.toObject().adding;

        // const token = item && item.token; //

        container.children = [

          this.createChild({
            type: "media",
            width: "100%",
            height: "15em",
            loading: loading,
            uploading: uploading,
            // token: token, // not implemented
            mixed: mixed,
            // exit: exit,
            // id: id,
            caption: false,
            display: "medium" // = default
          }, "media").build(),

          this.createChild("imageDescription").build()
        ];

      }
    };
  }
}

KarmaFieldsAlpha.field.medias.description.imageDescription = class extends KarmaFieldsAlpha.field.group {

  constructor(resource) {

    super({
      children: [
        // "fileType",
        // "mimeType",
        "fileDescription",
        "sizeDescription",
        "resolutionDescription",
        "dateDescription",
        "multipleDescription"
        // "folderName"
      ],
      ...resource
    });

  }

}

KarmaFieldsAlpha.field.medias.description.fileType = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      content: ["getValue", "filetype"],
      ...resource
    });
  }
}


KarmaFieldsAlpha.field.medias.description.mimeType = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      content: ["getValue", "mimetype"],
      ...resource
    });
  }
}

KarmaFieldsAlpha.field.medias.description.dateDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      content: ["date", ["getValue", "upload-date"], {year: "numeric", month: "long", day: "2-digit"}],
      hidden: ["||", ["isMixed", ["getValue", "upload-date"]], ["!", ["getValue", "upload-date"]], ["=", ["getValue", "filetype"], "folder"]],
      ...resource
    });
  }
}

KarmaFieldsAlpha.field.medias.description.sizeDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      // content: ["replace", "% KB", "%", ["math", "floor", ["/", ["getValue", "size"], 1000]]],
      content: ["?", [">", ["getValue", "size"], 1000], ["replace", "% KB", "%", ["math", "floor", ["/", ["getValue", "size"], 1000]]], ["replace", "% B", "%", ["getValue", "size"]]],
      hidden: ["||", ["isMixed", ["getValue", "size"]], ["!", ["getValue", "size"]], ["=", ["getValue", "filetype"], "folder"]],
      ...resource
    });
  }
}

KarmaFieldsAlpha.field.medias.description.resolutionDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      content: ["replace", "% x % pixels", "%", ["getValue", "width"], ["getValue", "height"]],
      visible: ["&&", ["like", ["getValue", "mimetype"], "^image/.*$"], ["!", ["isMixed", ["getValue", "width"]]], ["!", ["isMixed", ["getValue", "height"]]]],
      ...resource
    });
  }
}

KarmaFieldsAlpha.field.medias.description.fileDescription = class extends KarmaFieldsAlpha.field.links {
  constructor(resource) {
    super({
      content: ["getValue", "filename"],
      href: ["replace", `${KarmaFieldsAlpha.uploadURL}#/#`, "#", ["getValue", "dir"], ["getValue", "filename"]],
      target: "_blank",
      hidden: ["||", ["=", ["getIds"], "0"], ["isMixed", ["getValue", "filename"]], ["!", ["getValue", "filename"]]],
      ...resource
    });
  }
}

KarmaFieldsAlpha.field.medias.description.multipleDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      content: "[Mixed files]",
      visible: ["isMixed", ["getValue", "filename"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.medias.description.folderName = class extends KarmaFieldsAlpha.field.input {
  constructor(resource) {
    super({
      type: "input",
      label: "Folder name",
      key: "name",
      visible: ["&&", ["!", ["getValue", "mimetype"]], ["!", ["isMixed", ["getValue", "mimetype"]]]],
      ...resource
    });
  }
}



// KarmaFieldsAlpha.field.medias.modal = class extends KarmaFieldsAlpha.field.grid.modal {
//
//   build() {
//     return {
// 			class: "karma-field karma-field-container",
//       update: container => {
//         const items = this.request("getSelectedItems");
//
//         if (!items.some(item => item.exit)) {
//           container.children = [
//             super.build()
//           ];
//         } else {
//           container.children = [];
//         }
//       }
//     };
//   }
//
// }


// KarmaFieldsAlpha.field.saucer.createFolder = {
//   type: "button",
//   action: "createFolder",
//   title: "Create Folder"
// }

KarmaFieldsAlpha.field.saucer.createFolder = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      request: ["body", "add"],
      text: "Create Folder",
      // values: [{filetype: "folder", mimetype: ""}],
      title: "Create Folder",
      ...resource
    })
  }
}


// KarmaFieldsAlpha.field.saucer.breadcrumb = class extends KarmaFieldsAlpha.field {
//
//   getAncestors() {
//
//     let parent = KarmaFieldsAlpha.Store.getParam("parent");
//
//     const ancestors = [];
//
//     const driver = this.resource.driver;
//
//     if (!driver) {
//       console.error("no driver");
//     }
//
//     const parentAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "parent") || "parent";
//     const nameAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "name") || "name";
//
//     while (parent && parent != "0" && parent !== KarmaFieldsAlpha.loading) {
//
//       const [name] = KarmaFieldsAlpha.Store.getValue(this.resource.driver, parent, nameAlias) || [KarmaFieldsAlpha.loading];
//
//       if (name === KarmaFieldsAlpha.loading) {
//
//         break;
//
//       }
//
//       ancestors.unshift({
//         id: parent,
//         name: name || ""
//       });
//
//       [parent] = KarmaFieldsAlpha.Store.getValue(this.resource.driver, parent, parentAlias) || [KarmaFieldsAlpha.loading];
//
//     }
//
//     return ancestors;
//   }
//
//   build() {
//     return {
//       class: "karma-breadcrumb",
//       tag: "ul",
//       update: ul => {
//
//         const ancestors = this.getAncestors() || [KarmaFieldsAlpha.loading];
//
//         ul.children = [{
//           id: "0",
//           name: "Uploads",
//           active: ancestors.length === 0
//         }, ...ancestors].map((item, index, array) => {
//           return {
//             tag: "li",
//             child: {
//               tag: "a",
//               update: a => {
//                 if (item === KarmaFieldsAlpha.loading) {
//                   a.element.innerHTML = "...";
//                 } else {
//                   a.element.classList.toggle("active", index === array.length - 1);
//                   a.element.innerHTML = item.name || "no name";
//                   a.element.onclick = event => {
//                     if (index !== array.length - 1) {
//                       this.parent.setValue(item.id, "parent");
//                       this.render();
//                     }
//                   }
//                 }
//               }
//             }
//           };
//         });
//       }
//     }
//   }
//
// }
