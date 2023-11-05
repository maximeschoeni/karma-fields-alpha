
KarmaFieldsAlpha.exit = Symbol("exit");

KarmaFieldsAlpha.field.medias = class extends KarmaFieldsAlpha.field.grid {

  getDriver() {

    return this.resource.driver || "medias";

  }

  getFileType(id) {

    return this.getSingleValue(id, "filetype");

    // const driver = this.getDriver();
    // const key = KarmaFieldsAlpha.Query.getAlias(driver, "filetype");
    //
    // const value = this.getValue(id, key);
    //
    // if (!value || value === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }
    //
    // return value[0] || "";

  }

  // getParams() {
  //
  //   const data = this.getData();
  //
  //   if (data.id) {
  //
  //     const [parent] = this.getValue(data.id, "parent") || [KarmaFieldsAlpha.loading];
  //
  //     if (parent !== KarmaFieldsAlpha.loading) {
  //
  //       KarmaFieldsAlpha.Store.setParam(parent || "", "parent");
  //
  //       data.selectId = data.id;
  //       delete data.id;
  //
  //       return super.getParams();
  //
  //     }
  //
  //   } else {
  //
  //     return super.getParams();
  //
  //   }
  //
  // }

  getMixedIds() {
console.error("deprecated")
    const ids = this.getIds();

    const parent = this.getParent() || "0";

    if (ids && parent !== "0") {

      // -> append exit folder:
      return [{exit:true, id: KarmaFieldsAlpha.exit}, ...ids];

    }

    return ids;
  }

  // getItemsDEPREC() {
  //
  //   let items = KarmaFieldsAlpha.Store.get("ids");
  //
  //   if (!items) {
  //
  //     const ids = this.getIds();
  //
  //     const parent = this.getParent() || "0";
  //
  //     if (ids && ids !== KarmaFieldsAlpha.loading) {
  //
  //       items = ids.map(id => {
  //
  //         const item = {
  //           id: id,
  //           type: "file",
  //           parent: this.getParent(id) || "0"
  //         };
  //
  //         while (item.parent !== "0" || parent === "0") {
  //
  //           if (item.parent === parent) {
  //
  //             return item;
  //
  //           } else if (item.parent === KarmaFieldsAlpha.loading) {
  //
  //             return {loading: true}; // or just return undefined?
  //
  //           }
  //
  //           item.type = "folder";
  //           item.id = item.parent;
  //           item.parent = this.getParent(item.parent) || "0";
  //
  //         }
  //
  //       }).filter(item => item);
  //
  //       items.sort((a, b) => {
  //         if (a.type < b.type) return 1;
  //         else if (a.type > b.type) return -1;
  //         else return 0;
  //       });
  //
  //       if (parent !== "0") {
  //
  //         // -> append exit folder:
  //         items = [{exit:true}, ...items];
  //
  //       }
  //
  //       if (items.some(item => item.loading)) {
  //
  //         return items;
  //
  //       }
  //
  //       KarmaFieldsAlpha.Backup.update(items, "ids");
  //       KarmaFieldsAlpha.Store.set(items, "ids");
  //
  //     }
  //
  //   }
  //
  //   return items;
  // }


  getItems() {

    let items = KarmaFieldsAlpha.Store.get("ids");

    if (!items) {

      const ids = this.getIds();

      const parent = this.getParent() || "0";

      if (ids && ids !== KarmaFieldsAlpha.loading) {

        items = ids.map(id => {

          return {
            id: id,
            type: this.getFileType(id)
          };

        });

        if (parent !== "0") {

          const exitId = this.getParent(parent);

          items = [
            {
              id: exitId || "0",
              type: "folder",
              exit: true,
              loading: exitId === KarmaFieldsAlpha.loading
            },
            ...items
          ];

          // if (exitId === KarmaFieldsAlpha.loading) {
          //
          //   items = [
          //     {
          //       type: "folder",
          //       loading: true
          //     },
          //     ...items
          //   ];
          //
          // } else {
          //
          //   items = [
          //     {
          //       id: exitId || "0",
          //       // exitId: exitId || "0",
          //       type: "folder",
          //       exit: true
          //     },
          //     ...items
          //   ];
          //
          // }


        }

        if (items.some(item => item.loading)) {

          return items;

        }

        KarmaFieldsAlpha.Backup.update(items, "ids");
        KarmaFieldsAlpha.Store.set(items, "ids");

      }

    }

    return items;
  }


  getMixedItems() {

    console.error("deprecated");

    // const ids = this.getIds();
    const items = this.getItems();

    // const parent = this.getParent() || "0";
    //
    // if (items && parent !== "0") {
    //
    //   // -> append exit folder:
    //   return [{exit:true, id: KarmaFieldsAlpha.exit}, ...items];
    //
    // }

    return items;
  }


  // getSelectedIds() {
  //
  //   return super.getSelectedIds()
  //
  // }

  getSelectedItems() {

    const items = this.getItems();


    if (items) {

      const selection = this.getSelection();

      if (selection) {

        const index = selection.index || 0;
        const length = selection.length || 0;

        return items.slice(index, index + length);

      }

    }

    return [];
  }

  getSelectionChild(selection) {

    if (selection.modal && !selection.modal.final) {

      return this.createChild({
        ...this.resource.modal,
        type: "modal",
        index: "modal",
      });

    }

  }

  getChild(index) {

    if (index === "modal") {

      return this.createChild({
        ...this.resource.modal,
        type: "modal",
        index: "modal",
      });

    }

  }


  getMixedSelection() {

    console.error("deprecated");

    // const pureSelection = this.getSelection();
    //
    // return this.mixSelection(pureSelection);


    return this.getSelection();

  }

  // mixSelection(selection) {
  //
  //   selection = {...selection};
  //
  //   const parent = this.getParent() || "0";
  //
  //   if (parent !== "0") {
  //
  //     selection.index = (selection.index || 0) + 1;
  //
  //   }
  //
  //   return selection;
  //
  // }

  setMixedSelection(selection) {


    // selection = this.purifySelection(selection);

    this.setSelection(selection);
  }

  isValidMixedSelection(selection) {

    const parent = this.getParent() || "0";

    return parent === "0" || selection.index > 0 || selection.length > 1;

  }

  purifySelection(selection) {
  console.error("deprecated");
    const parent = this.getParent() || "0";

    if (parent !== "0") {

      selection = {...selection};

      if (selection.index > 0) {

        selection.index--;

      } else {

        selection.length--;

      }

    }

    return selection;
  }




  async add(params = {}) {

    const parent = this.getParent() || "0";

    // await super.add({
    //   filetype: ["folder"],
    //   mimetype: [""],
    //   parent: [parent],
    //   ...params
    // });


    const items = this.getItems();

    const selection = this.getSelection() || {};

    let index = (selection.index || 0) + (selection.length || 0);

    if (items && index === 0 && items[0].exit) {

      index++;

    }

    const {page, ppp, orderby, order, ...defaultParams} = this.resource.params; // default params are needed (e.g) for setting post-type

    KarmaFieldsAlpha.Query.add(this.resource.driver, {
      ...defaultParams,
      filetype: ["folder"],
      mimetype: [""],
      parent: [parent],
      ...params
    }, index);

    this.setSelection({index: index, length: 1});

    await this.render();

    this.save("add"); // -> wait until default fields are all set to save

  }


  export(dataRow = [], index = 0, length = 999999) {

    if (this.resource.export || this.resource.import) {

      return super.export(dataRow, index, length);

    } else { // -> just export ids

      const items = this.getItems().filter(item => !item.exit);
      const grid = new KarmaFieldsAlpha.Grid();
      const slice = items.slice(index, index + length).filter(item => item.id).map(item => item.id);

      grid.addColumn(slice);

      dataRow.push(grid.toString());

      return dataRow;

    }



  }

  import(dataRow, index = 0, length = 999999) {

    const string = dataRow.shift();
    const driver = this.getDriver();
    // const currentIds = this.getIds();
    const currentItems = this.getItems().filter(item => !item.exit);

    for (let i = 0; i < length; i++) {

      KarmaFieldsAlpha.Store.setValue(["1"], driver, currentItems[i + index].id, "trash");
      KarmaFieldsAlpha.Query.saveValue(["1"], driver, currentItems[i + index].id, "trash");

    }

    // const newIds = [...currentIds];
    const newItems = [...currentItems];
    const grid = new KarmaFieldsAlpha.Grid(string);
    const ids = grid.getColumn(0);
    const parent = this.getParent() || "0";
    const parentAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "parent") || "parent";

    for (let id of ids) {

      KarmaFieldsAlpha.Store.setValue([parent], driver, id, parentAlias);
      KarmaFieldsAlpha.Store.setValue([], driver, id, "trash");

      KarmaFieldsAlpha.Query.saveValue({
        [parentAlias]: [parent],
        trash: []
      }, driver, id);

    }


    // newIds.splice(index, length, ...ids.map(id => ({id: id})));
    newItems.splice(index, length, ...ids.map(id => ({id: id})));

    KarmaFieldsAlpha.Store.setIds(newItems);

    KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.Query.queries, driver);

  }

  createFolder() {

    console.error("deprecated");

    const parent = this.getParent() || "0";
    const driver = this.getDriver();

    // KarmaFieldsAlpha.Query.add(driver, 1, {
    //   filetype: "folder",
    //   parent: parent
    // });

    const selection = this.getSelection() || {};

    index = selection.index || 0;

    if (parent !== "0") {

      index = Math.max(index, 1);

    }

    this.add(index, {
      filetype: ["folder"],
      mimetype: [""],
      parent: [parent]
    });

  }

  openFolder(id) {

    // if (id === KarmaFieldsAlpha.exit) {
    //
    //   this.upperFolder();
    //
    //   // id = this.getParent(this.getParent());
    //
    // }

    this.parent.setValue(id || "0", "parent");
    this.render();
    this.save("open");

  }

  upperFolder() {

    let id = this.getParent(this.getParent());

    // if (id === "0") {
    //
    //   id = ""; // -> remove parent=0 to allow all files on root
    //
    // }

    this.parent.setValue(id || "0", "parent");
    this.render();

    this.save("open");

    // const [parent] = this.parent.getValue("parent") || [];
    //
    // const [grandParent] = parent && KarmaFieldsAlpha.Query.getValue(this.getDriver(), parent, "parent") || ["0"];

    // const grandParent = this.getParent(this.getParent());
    //
    // if (grandParent) {
    //
    //   this.parent.setValue(grandParent, "parent");
    //
    // }



  }

  hasParent(id) {

    const parent = this.getParent(id);

    return Boolean(parent);
  }

  getParent(id) {

    if (id) {

      const driver = this.getDriver();

      return this.getSingleValue(id, "parent") || "0";

      // const values = KarmaFieldsAlpha.Query.getValue(driver, id, "parent");
      //
      // if (values) {
      //
      //   return values[0];
      //
      // }
      //
      // return KarmaFieldsAlpha.loading;

    } else {

      return KarmaFieldsAlpha.Store.getParam("parent") || "0";

      // const values = this.parent.getValue("parent");
      //
      // if (values) {
      //
      //   return values[0];
      //
      // }

      // const params = this.getParams();
      //
      // if (params) {
      //
      //   return params.parent;
      //
      // }

    }

  }

  move(items, target) {

    const driver = this.getDriver();
    // const parentAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "parent") || "parent";
    //
    // if (target === KarmaFieldsAlpha.exit) {
    //
    //   target = this.getParent(this.getParent());
    //
    // }


    items = items.filter(item => !item.exit);

    for (let item of items) {

      KarmaFieldsAlpha.Store.setValue([target.id || "0"], driver, item.id, "parent");

    }

    this.submit();

    KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.Query.queries, driver);


    const set = new Set(items);

    // const newIds = this.getIds().filter(item => !ids.includes(item.id));
    const newItems = this.getItems().filter(item => !set.has(item));

    KarmaFieldsAlpha.Store.setIds(newItems);

    this.setSelection({index: 0, length: 0});

    this.save("move");

    this.render();

  }

  upload(files, params) {

    const parent = this.getParent() || "0";
    const driver = this.getDriver();
    const selection = this.getSelection();
    let index = 0;

    if (selection) {

      index = (selection.index || 0) + (selection.length || 0);

    }

    const items = this.getItems();

    if (items[index] && items[index].exit) {

      index++;

    }



    // if (selection) {
    //
    //   index = (selection.index || 0) + (selection.length || 0);
    //
    // } else {
    //
    //   const items = this.getItems();
    //
    //   index = items.findIndex(item => !item.exit && item.type !== "folder");
    //
    //   if (index === -1) {
    //
    //     index = items.length;
    //   }
    //
    // }

    // const parentAlias = KarmaFieldsAlpha.Query.getAlias(driver, "parent");

    params = {...params, parent: parent};

    if (this.resource.default) {

      const defaultParams = this.parse(["parseParams", this.resource.default]);

      params = {...params, ...defaultParams};

    }

    KarmaFieldsAlpha.Query.upload(driver, files, params, index);

    this.setMixedSelection({final: true, index: index, length: 1});


    // KarmaFieldsAlpha.Query.upload(driver, files, {}, index); // -> wp rest media wont handle parent...

    this.save("upload");

    this.render();
  }

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




  getIcon(item) {
console.error("deprecated");
    if (item.exit) {

      return "exit";

    } else if (item.type === "folder") { // -> compat

      return "folder";

    } else if (item.loading || !item.id || !item || item.id === KarmaFieldsAlpha.loading) { // -> compat

      return "upload";

    } else {

      return KarmaFieldsAlpha.field.files.prototype.getIcon.call(this, item.id);

    }



    // if (id === null) {
    //
    //   return "upload";
    //
    // } else if (id === KarmaFieldsAlpha.field.medias.exit) {
    //
    //   return "exit";
    //
    //  } else {
    //
    //   let mimetype = this.getValue(id, "mimetype");
    //   let filetype = this.getValue(id, "filetype");
    //
    //   if (mimetype && filetype) {
    //
    //     mimetype = mimetype[0] || "";
    //     filetype = filetype[0] || "";
    //
    //     if (filetype === "folder") {
    //
    //       return "folder";
    //
    //     } else if (mimetype.startsWith("image")) {
    //
    //       return "image";
    //
    //     } else if (mimetype.startsWith("video")) {
    //
    //       return "video";
    //
    //     } else if (mimetype.startsWith("audio")) {
    //
    //       return "audio";
    //
    //     } else if (mimetype.startsWith("text")) {
    //
    //       return "text";
    //
    //     } else if (mimetype === "application/pdf") {
    //
    //       return "document";
    //
    //     } else if (mimetype === "application/zip") {
    //
    //       return "zip";
    //
    //     } else {
    //
    //       return "default";
    //
    //     }
    //
    //   } else {
    //
    //     return "notfound";
    //
    //   }
    //
    // }

  }

  getFile(item) {
console.error("deprecated");
    if (item.type === "file" && item.id && item.id !== KarmaFieldsAlpha.loading) {

      return KarmaFieldsAlpha.field.files.prototype.getFile.call(this, item.id);

    }

  }

  getCaption(item) {
console.error("deprecated");
    if (item.exit) {

      return "..";

    } else if (item.type === "folder" && item.id && item.id !== KarmaFieldsAlpha.loading) {

      return this.getAlias(item.id, "name");

    } else if (item.type === "file" && item.id) {

      return KarmaFieldsAlpha.field.files.prototype.getCaption.call(this, item.id);

    } else {

      return "...";

    }

  }

  isFolder(id) {

    return id === "0" || this.getSingleValue(id, "filetype") === "folder";

  }

  build() {

    // return {
    //   class: "karma-field-table-grid-container karma-field-frame karma-field-group final",
    //   init: body => {
    //
    //     // body.element.tabIndex = -1;
    //     body.element.ondrop = async event => {
    //       event.preventDefault();
    //       const files = event.dataTransfer.files;
    //       if (event.dataTransfer.files.length) {
    //         event.dataTransfer.files.map(file => KarmaFieldsAlpha.Query.upload(file));
    //         this.render();
    //       }
    //     }
    //     body.element.ondragover = event => {
    //       event.preventDefault();
    //     }
    //   },
    //   update: body => {
    //     body.children = [
          return {
            class: "media-table",
            tag: "ul",
            init: grid => {
              if (this.resource.style) {
                grid.element.style = this.resource.style;
              }
            },
            update: grid => {

              let items = this.getItems();

              grid.element.classList.toggle("loading", !items || items === KarmaFieldsAlpha.loading);

              if (items && items !== KarmaFieldsAlpha.loading) {

                const page = this.parent.request("getPage");
                const ppp = this.getPpp();
                const offset = (page - 1)*ppp;
                const [parent] = this.parent.getValue("parent") || [];

                let selection = this.getSelection();

                // if (selection && selection.values) {
                //
                //   const firstIndex = items.findIndex(item => item.id === selection.values[0]);
                //   const lastIndex = items.findIndex(item => item.id === selection.values[selection.values.length - 1]);
                //
                //   if (firstIndex !== undefined) {
                //
                //     selection = {
                //       index: firstIndex,
                //       length: lastIndex - firstIndex + 1
                //     };
                //
                //     this.setSelection(selection);
                //
                //   }
                //
                // }

                // const selector = new KarmaFieldsAlpha.Selector(grid.element);
                const selector = new KarmaFieldsAlpha.DragAndDrop(grid.element);
                selector.colCount = 1;


                // if (parent && parent !== "0") {
                //
                //   items.unshift(KarmaFieldsAlpha.exit);
                //
                // }

                selector.rowCount = items.length;
                // selector.dropZones = items.map((item, index) => index).filter(index => items[index].exit || items[index].type === "folder"); // FAIL -> newly created items have no type
                selector.dropZones = items.map((item, index) => index).filter(index => items[index].exit || this.isFolder(items[index].id)); // FAIL -> newly created items have no type


                if (selection && !selection.child) {
                  selector.selection = selection;
                  // const [string] = this.export([], selection.index, selection.length);
                  // KarmaFieldsAlpha.Clipboard.write(string);
                }

                selector.onselect = newSelection => {
                  // if (!KarmaFieldsAlpha.Selection.compare(newSelection, selection)) {

                  // newSelection = this.purifySelection(newSelection);
                  //
                  // if (newSelection.length > 0) {

                    // KarmaFieldsAlpha.Clipboard.focus();
                    this.deferFocus();
                    this.setSelection(newSelection);
                    // this.setSelection(newSelection);
                    this.render();

                  // }



                  // }
                }

                selector.onSelectionChange = newSelection => {

                  this.setSelection(newSelection);

                  this.render();

                }

                // selector.onSelectionChange = newSelection => {
                //   this.setSelection(newSelection);
                // }

                selector.onPaintRow = elements => {
                  elements.forEach(element => element.classList.add("selected"))
                };

                selector.onUnpaintRow = elements => {
                  elements.forEach(element => element.classList.remove("selected"))
                };

                // this.sliceSegment(this.selection).forEach(element => element.style.transform = `translate(${travelX}px, ${travelY}px)`);

                // selector.onDrag = (element, x, y, dropIndex) => {
                //   // element.classList.add("drop-active");
                //
                //   let scale = 1;
                //
                //   if (dropIndex > -1) {
                //
                //     scale = 0.5;
                //
                //   }
                //
                //   element.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`;
                // };

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

                  // const ids = this.getIds();
                  const target = items[index];
                  // const selectedIds = items.slice(selection.index, selection.index + selection.length).filter(item => item.id).map(item => item.id);

                  const selectedItems = items.slice(selection.index, selection.index + selection.length);

                  this.move(selectedItems, target);
                };

                selector.onCancelDrag = () => {

                  this.setSelection({});
                  this.render();

                }


                grid.element.classList.toggle("has-selection", Boolean(selection));

                // const [parent] = this.parent.getValue("parent") || [];
                //
                // if (parent && parent !== "0") {
                //
                //   ids = [KarmaFieldsAlpha.exit, ...ids];
                //
                //   selector.colHeader++;
                //
                // }

                grid.children = items.map((item, index) => {
                  return {
                    tag: "li",
                    class: "frame",
                    update: li => {

                      li.element.classList.remove("drop-active");

                      // const filetype = this.getValue(id, "filetype");

                      // const isSelected = selection && KarmaFieldsAlpha.Selection.containRow(selection, index);
                      //
                      // li.element.classList.toggle("selected", Boolean(isSelected));

                      // li.element.classList.remove("hidden"); // -> because it get hidden when dropped

                      // li.element.classList.toggle("selected", selector.includes(index) || Boolean(selection && selection.final && !selection.length && item.id === KarmaFieldsAlpha.exit));
                      // li.element.classList.toggle("selected", selector.includes(index));
                      li.element.classList.toggle("selected", KarmaFieldsAlpha.Segment.contain(selection, index));
                      // li.element.classList.toggle("media-dropzone", Boolean(item.exit || item.type === "folder"));
                      li.element.classList.toggle("media-dropzone", Boolean(item.exit || this.isFolder(item.id)));



                      li.element.ondblclick = event => {
                        // if (item.id && item.id !== KarmaFieldsAlpha.loading && item.type === "folder") {
                        if (item.id && item.id !== KarmaFieldsAlpha.loading && this.isFolder(item.id)) {
                          // this.request("setParam", id, "parent");
                          // this.parent.setValue(id, "parent");
                          this.openFolder(item.id);
                        }
                      }

                      // li.element.onclick = event => {
                      //   if (id === KarmaFieldsAlpha.exit) {
                      //     this.upperFolder();
                      //   }
                      // }


                      const media = new KarmaFieldsAlpha.field.text.media({
                        id: item.id,
                        driver: this.getDriver(),
                        display: "thumb",
                        caption: true,
                        exit: item.exit,
                        loading: item.loading
                      });

                      li.child = media.build();



                      // li.childXXX = {
                      //   class: "frame",
                      //   // init: frame => {
                      //   //   frame.element.tabIndex = -1;
                      //   // },
                      //   update: frame => {
                      //
                      //     frame.children = [
                      //       {
                      //         tag: "figure",
                      //         update: figure => {
                      //
                      //           const src = this.getFile(item);
                      //           const icon = !src && this.getIcon(item);
                      //
                      //           // console.log(index, id, src, icon);
                      //
                      //           figure.element.classList.toggle("dashicons", Boolean(icon));
                      //           figure.element.classList.toggle("dashicons-category", icon === "folder");
                      //           figure.element.classList.toggle("dashicons-format-image", icon === "image");
                      //           figure.element.classList.toggle("dashicons-media-video", icon === "video");
                      //           figure.element.classList.toggle("dashicons-media-audio", icon === "audio");
                      //           figure.element.classList.toggle("dashicons-media-text", icon === "text");
                      //           figure.element.classList.toggle("dashicons-media-document", icon === "document");
                      //           figure.element.classList.toggle("dashicons-media-archive", icon === "archive");
                      //           figure.element.classList.toggle("dashicons-media-default", icon === "default");
                      //           figure.element.classList.toggle("dashicons-open-folder", icon === "exit");
                      //           figure.element.classList.toggle("dashicons-upload", icon === "upload");
                      //           figure.element.classList.toggle("dashicons-warning", icon === "notfound");
                      //
                      //
                      //
                      //           if (src) {
                      //             figure.children = [{
                      //               tag: "img",
                      //               update: img => {
                      //                 if (!img.element.src.endsWith(src)) { // -> setting same src reloads image!
                      //                   img.element.src = KarmaFieldsAlpha.uploadURL+src;
                      //                 }
                      //               }
                      //             }];
                      //           } else {
                      //             figure.children = [];
                      //           }
                      //         }
                      //       },
                      //       {
                      //         class: "file-caption",
                      //         child: {
                      //           class: "filename",
                      //           update: filename => {
                      //             filename.element.innerHTML = this.getCaption(item);
                      //           }
                      //         }
                      //       }
                      //     ];
                      //   }
                      // }
                    }

                  };
                });

              }

            }
          };
    //     ];
    //   }
    // };

  }

}

KarmaFieldsAlpha.field.medias.notFound = Symbol("not found");
KarmaFieldsAlpha.field.medias.loading = Symbol("loading");




KarmaFieldsAlpha.field.saucer.upload = class extends KarmaFieldsAlpha.field.button {
  //
	// constructor(resource) {
	// 	super({
	// 		action: "upload",
	// 		...resource
	// 	});
	// }

	build() {

		return {
			class: "karma-upload karma-field",
			init: button => {
				button.element.id = "upload-button";
			},
      update: button => {
        if (this.resource.loading) {
          const loading = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.loading));
          button.element.classList.toggle("loading", loading);
        }
			},
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
                this.parent.request(this.resource.action || "upload", files);
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

  // getFileType() {
  //
  //   const driver = this.getDriver();
  //   const key = KarmaFieldsAlpha.Query.getAlias(driver, "filetype");
  //
  //   const values = this.getValue(id, key);
  //
  //   if (!values || values === KarmaFieldsAlpha.loading) {
  //
  //     return KarmaFieldsAlpha.loading;
  //
  //   }
  //                                               // -> compat
  //   if (values === KarmaFieldsAlpha.mixed || values[0] === KarmaFieldsAlpha.mixed) {
  //
  //     return KarmaFieldsAlpha.mixed;
  //
  //   }
  //
  //   return value[0] || "";
  //
  // }
  //
  // getMimeType() {
  //
  //   const driver = this.getDriver();
  //   const key = KarmaFieldsAlpha.Query.getAlias(driver, "mimetype");
  //
  //   const values = this.getValue(id, key);
  //
  //   if (!values || values === KarmaFieldsAlpha.loading) {
  //
  //     return KarmaFieldsAlpha.loading;
  //
  //   }
  //                                               // -> compat
  //   if (values === KarmaFieldsAlpha.mixed || values[0] === KarmaFieldsAlpha.mixed) {
  //
  //     return KarmaFieldsAlpha.mixed;
  //
  //   }
  //
  //   return value[0] || "";
  //
  // }


  build() {
    return {
      class: "karma-field karma-field-container media-description display-flex",
      update: container => {

        // const isMultiple = this.request("multiple");

        const items = this.request("getSelectedItems");

        let id;

        if (items.length > 1) {

          id = KarmaFieldsAlpha.mixed;

        } else if (items[0] && items[0].loading) {

          id = KarmaFieldsAlpha.loading;

        } else if (items[0] && items[0].exit) {

          id = KarmaFieldsAlpha.exit;

        } else if (items[0]) {

          id = items[0].id;

        }

        // const id = this.getId();

        container.children = [
          // new KarmaFieldsAlpha.field.text.media({
          //   mixed: true,
          //   driver: driver
          // }).build()

          // this.createChild({
          //   type: "text",
          //   width: "100%",
          //   mixed: items.length > 1,
          //   exit: items[0].exit,
          //   loading: items[0].loading,
          //   medias: [{display: "description"}]
          // }).build(),

          this.createChild({
            type: "media",
            width: "100%",
            height: "15em",
            id: id,
            display: "medium" // = default
          }).build(),




          this.createChild("imageDescription").build()
        ];


        // const driver = this.getDriver();
        //
        // if (items.length > 1) {
        //
        //   container.children = [
        //     // new KarmaFieldsAlpha.field.text.media({
        //     //   mixed: true,
        //     //   driver: driver
        //     // }).build()
        //
        //     this.createChild({
        //       type: "text",
        //       width: "100%",
        //       medias: [{display: "description"}]
        //     }).build()
        //   ];
        //
        // } else if (items[0].loading || items[0].exit) {
        //
        //   container.children = [
        //     new KarmaFieldsAlpha.field.text.media({
        //       mixed: true,
        //       exit: items[0].exit,
        //       loading: items[0].loading,
        //       driver: driver
        //     }).build()
        //     // this.createChild({
        //     //   type: "group",
        //     //   children: []
        //     // })
        //   ];
        //
        // } else {
        //
        //   container.children = [
        //
        //     this.createChild({
        //       type: "text",
        //       width: "100%",
        //       medias: [{display: "description"}]
        //     }).build(),
        //
        //     this.createChild("imageDescription").build(),
        //
        //   ];
        //
        // }
      }
    };
  }
}


// KarmaFieldsAlpha.field.medias.description.imageDescription = class extends KarmaFieldsAlpha.field.group {
//
//   constructor(resource) {
//
//     super({
//       children: [
//         {
//           type: "text",
//           links: {content: ["getValue", "filename"], href: "#"}
//         },
//         {
//           type: "text",
//           content: ["replace", "% KB", "%", ["math", "floor", ["/", ["getValue", "size"], 1000]]]
//         },
//         {
//           type: "text",
//           content: ["replace", "% x % pixels", "%", ["getValue", "width"], ["getValue", "height"]]
//         },
//         {
//           type: "text",
//           content: ["date", ["getValue", "upload-date"], {year: "numeric", month: "long", day: "2-digit"}]
//         }
//       ],
//       ...resource
//     });
//
//   }
//
// }

KarmaFieldsAlpha.field.medias.description.imageDescription = class extends KarmaFieldsAlpha.field.group {

  constructor(resource) {

    super({
      children: [
        "fileDescription",
        "sizeDescription",
        "resolutionDescription",
        "dateDescription",
        "multipleDescription",
        "folderName"
      ],
      ...resource
    });

  }

}

KarmaFieldsAlpha.field.medias.description.dateDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      content: ["date", ["getValue", "upload-date"], {year: "numeric", month: "long", day: "2-digit"}],
      hidden: ["||", ["isMixed", ["getValue", "upload-date"]], ["!", ["getValue", "upload-date"]]],
      ...resource
    });
  }
}

KarmaFieldsAlpha.field.medias.description.sizeDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      content: ["replace", "% KB", "%", ["math", "floor", ["/", ["getValue", "size"], 1000]]],
      hidden: ["||", ["isMixed", ["getValue", "size"]], ["!", ["getValue", "size"]]],
      ...resource
    });
  }
}

KarmaFieldsAlpha.field.medias.description.resolutionDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      content: ["replace", "% x % pixels", "%", ["getValue", "width"], ["getValue", "height"]],
      visible: ["like", ["getValue", "mimetype"], "^image/.*$"],
      ...resource
    });
  }
}

KarmaFieldsAlpha.field.medias.description.fileDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      links: {content: ["getValue", "filename"], href: "#"},
      hidden: ["||", ["isMixed", ["getValue", "filename"]], ["!", ["getValue", "filename"]]],
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



KarmaFieldsAlpha.field.medias.modal = class extends KarmaFieldsAlpha.field.grid.modal {

  build() {
    return {
			class: "karma-field karma-field-container",
      update: container => {
        const items = this.request("getSelectedItems");

        if (!items.some(item => item.exit)) {
          container.children = [
            super.build()
          ];
        } else {
          container.children = [];
        }
      }
    };
  }

}


// KarmaFieldsAlpha.field.saucer.createFolder = {
//   type: "button",
//   action: "createFolder",
//   title: "Create Folder"
// }

KarmaFieldsAlpha.field.saucer.createFolder = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      action: "add",
      // values: [{filetype: "folder", mimetype: ""}],
      title: "Create Folder",
      ...resource
    })
  }
}


KarmaFieldsAlpha.field.saucer.breadcrumb = class extends KarmaFieldsAlpha.field {

  getAncestors() {

    let parent = KarmaFieldsAlpha.Store.getParam("parent");

    const ancestors = [];

    const driver = this.resource.driver;

    if (!driver) {
      console.error("no driver");
    }

    const parentAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "parent") || "parent";
    const nameAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "name") || "name";

    while (parent && parent != "0" && parent !== KarmaFieldsAlpha.loading) {

      const [name] = KarmaFieldsAlpha.Store.getValue(this.resource.driver, parent, nameAlias) || [KarmaFieldsAlpha.loading];

      if (name === KarmaFieldsAlpha.loading) {

        break;

      }

      ancestors.unshift({
        id: parent,
        name: name || ""
      });

      [parent] = KarmaFieldsAlpha.Store.getValue(this.resource.driver, parent, parentAlias) || [KarmaFieldsAlpha.loading];

    }

    return ancestors;
  }

  build() {
    return {
      class: "karma-breadcrumb",
      tag: "ul",
      update: ul => {

        const ancestors = this.getAncestors() || [KarmaFieldsAlpha.loading];

        ul.children = [{
          id: "0",
          name: "Uploads",
          active: ancestors.length === 0
        }, ...ancestors].map((item, index, array) => {
          return {
            tag: "li",
            child: {
              tag: "a",
              update: a => {
                if (item === KarmaFieldsAlpha.loading) {
                  a.element.innerHTML = "...";
                } else {
                  a.element.classList.toggle("active", index === array.length - 1);
                  a.element.innerHTML = item.name || "no name";
                  a.element.onclick = event => {
                    if (index !== array.length - 1) {
                      this.parent.setValue(item.id, "parent");
                      this.render();
                    }
                  }
                }
              }
            }
          };
        });
      }
    }
  }

}
