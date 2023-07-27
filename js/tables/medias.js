
KarmaFieldsAlpha.exit = Symbol("exit");

KarmaFieldsAlpha.field.medias = class extends KarmaFieldsAlpha.field.grid {

  getDriver() {

    return this.resource.driver || "medias";

  }

  getFileType(id) {

    const driver = this.getDriver();
    const key = KarmaFieldsAlpha.Query.getAlias(driver, "filetype");

    const value = this.getValue(id, key);

    if (!value || value === KarmaFieldsAlpha.loading) {

      return KarmaFieldsAlpha.loading;

    }

    return value[0] || "";

  }

  getParams() {

    const data = this.getData();

    if (data.id) {

      const [parent] = this.getValue(data.id, "parent") || [KarmaFieldsAlpha.loading];

      if (parent !== KarmaFieldsAlpha.loading) {

        KarmaFieldsAlpha.Store.setParam(parent || "", "parent");

        data.selectId = data.id;
        delete data.id;

        return super.getParams();

      }

    } else {

      return super.getParams();

    }

  }

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

  getItemsDEPREC() {

    let items = KarmaFieldsAlpha.Store.get("ids");

    if (!items) {

      const ids = this.getIds();

      const parent = this.getParent() || "0";

      if (ids && ids !== KarmaFieldsAlpha.loading) {

        items = ids.map(id => {

          const item = {
            id: id,
            type: "file",
            parent: this.getParent(id) || "0"
          };

          while (item.parent !== "0" || parent === "0") {

            if (item.parent === parent) {

              return item;

            } else if (item.parent === KarmaFieldsAlpha.loading) {

              return {loading: true}; // or just return undefined?

            }

            item.type = "folder";
            item.id = item.parent;
            item.parent = this.getParent(item.parent) || "0";

          }

        }).filter(item => item);

        items.sort((a, b) => {
          if (a.type < b.type) return 1;
          else if (a.type > b.type) return -1;
          else return 0;
        });

        if (parent !== "0") {

          // -> append exit folder:
          items = [{exit:true}, ...items];

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

          if (exitId === KarmaFieldsAlpha.loading) {

            items = [
              {
                type: "folder",
                loading: true
              },
              ...items
            ];

          } else {

            items = [
              {
                id: exitId || "0",
                type: "folder",
                exit: true
              },
              ...items
            ];

          }


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

      const selection = this.getMixedSelection();

      if (selection) {

        const index = selection.index || 0;
        const length = selection.length || 0;

        return items.slice(index, index + length);

      }

    }

    return [];
  }

  getMixedSelection() {

    // const selection = {...this.getSelection()};
    //
    // const parent = this.getParent() || "0";
    //
    // if (parent !== "0") {
    //
    //   selection.index = (selection.index || 0) + 1;
    //
    // }
    //
    // return selection;

    const pureSelection = this.getSelection();

    return this.mixSelection(pureSelection);

  }

  mixSelection(selection) {

    selection = {...selection};

    const parent = this.getParent() || "0";

    if (parent !== "0") {

      selection.index = (selection.index || 0) + 1;

    }

    return selection;

  }

  setMixedSelection(selection) {

    // const parent = this.getParent() || "0";
    //
    // if (parent !== "0") {
    //
    //   selection = {...selection};
    //
    //   if (selection.index > 0) {
    //
    //     selection.index--;
    //
    //   } else {
    //
    //     selection.length--;
    //
    //   }
    //
    // }

    selection = this.purifySelection(selection);

    this.setSelection(selection);
  }

  isValidMixedSelection(selection) {

    const parent = this.getParent() || "0";

    return parent === "0" || selection.index > 0 || selection.length > 1;

  }

  purifySelection(selection) {

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

    await super.add({
      filetype: ["folder"],
      mimetype: [""],
      parent: [parent],
      ...params
    }, index);

    // KarmaFieldsAlpha.Query.add(this.resource.driver, index, {
    //   filetype: ["folder"],
    //   mimetype: [""],
    //   parent: [parent],
    //   ...params
    // });
    //
    // this.setSelection({final: true, index: index, length: 1});
    //
    // await this.render();
    //
    // this.save("add"); // -> wait until default fields are all set to save




    // await super.add(index, params);

  }

  // remove(index, length) {
  //
  //   // const ids = this.getIds();
  //   //
  //   // if (ids[index] === KarmaFieldsAlpha.exit) {
  //   //
  //   //   index++;
  //   //
  //   // }
  //
  //   const parent = this.getParent() || "0";
  //
  //   if (parent !== "0") {
  //
  //     if (index > 0) {
  //
  //       index++; // -> index is relative to store ids
  //       length--;
  //
  //     }
  //
  //   }
  //
  //   super.remove(index, length);
  //
  // }

  // removeIds(ids) {
  //
  //   ids = ids.filter(id => id !== KarmaFieldsAlpha.exit);
  //
  //   super.removeIds(ids);
  //
  // }

  export(dataRow = [], index = 0, length = 999999) {

    // const ids = this.getIds();
    const items = this.getItems();
    const grid = new KarmaFieldsAlpha.Grid();
    const slice = items.slice(index, index + length).filter(item => item.id).map(item => item.id);

    grid.addColumn(slice);

    dataRow.push(grid.toString());

    return dataRow;

  }

  import(dataRow, index = 0, length = 999999) {

    const string = dataRow.shift();
    const driver = this.getDriver();
    // const currentIds = this.getIds();
    const currentItems = this.getItems();

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

    return Boolean(parent || parent === 0);
  }

  getParent(id) {

    if (id) {

      const driver = this.getDriver();
      const parentAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "parent") || "parent";
      const values = KarmaFieldsAlpha.Query.getValue(driver, id, parentAlias);

      if (values) {

        return values[0];

      }

      return KarmaFieldsAlpha.loading;

    } else {

      const values = this.parent.getValue("parent");

      if (values) {

        return values[0];

      }

      // const params = this.getParams();
      //
      // if (params) {
      //
      //   return params.parent;
      //
      // }

    }

  }

  move(ids, target) {

    const driver = this.getDriver();
    const parentAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "parent") || "parent";

    if (target === KarmaFieldsAlpha.exit) {

      // const [parent] = this.parent.getValue("parent") || [];
      // const [grandParent] = parent && KarmaFieldsAlpha.Query.getValue(this.getDriver(), parent, "parent") || [];
      //
      // target = grandParent || "0";

      target = this.getParent(this.getParent());

    }

    for (let id of ids) {

      KarmaFieldsAlpha.Store.setValue([target || "0"], driver, id, parentAlias);
      // KarmaFieldsAlpha.Query.saveValue([target || "0"], driver, id, parentAlias);


      // KarmaFieldsAlpha.Store.changeValue([target || "0"], driver, id, parentAlias);
      // KarmaFieldsAlpha.Store.changeValue(["0"], driver, id, "trash");
      //
      // KarmaFieldsAlpha.Query.saveValue({
      //   [parentAlias]: [target || "0"],
      //   trash: ["0"]
      // }, driver, id);

    }

    KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.Query.queries, driver);

    const newIds = this.getIds().filter(item => !ids.includes(item.id));

    KarmaFieldsAlpha.Store.setIds(newIds);

    this.setSelection({final: true, index: 0, length: 0});

    this.save("move");
    this.render();

  }

  upload(files) {

    const parent = this.getParent() || "0";
    const driver = this.getDriver();
    const selection = this.getSelection();
    let index = 0;


    if (selection) {

      index = (selection.index || 0) + (selection.length || 0);

    } else {

      const items = this.getItems();

      index = items.findIndex(item => !item.exit && item.type !== "folder");

      if (index === -1) {

        index = items.length;
      }

    }





    //
    // grid.upload(files, selection.index || 0, length);


    // if (parent !== "0") {
    //
    //   index = Math.max(index, 1); // -> never insert before exit folder
    //
    // }



    const parentAlias = KarmaFieldsAlpha.Query.getAlias(driver, "parent");

    let params = {
      [parentAlias]: parent
    };

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

  changeFile(files) {

    const selection = this.getSelection();

    // const parent = this.getParent() || "0";

    // if (selection && (parent !== "0" || selection.index > 0)) { // -> not if the selected folder is exit folder
    //
    //   this.upload(files, selection.index, selection.length);
    //
    // }

    if (selection.length) {

      this.upload(files, selection.index || 0, selection.length);

    }

  }

  regen() {
    // const selection = this.getSelection();
    //
    // if (selection) {
    //
    //
    //
    //   this.parent.request("upload", files, selection.index, selection.length);
    //
    // }

    const ids = this.getSelectedItems().filter(item => !item.exit).map(item => item.id);
    const driver = this.getDriver();

    if (ids.length) {

      KarmaFieldsAlpha.Query.regen(driver, ids.map(item => item.id));

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

    if (item.type === "file" && item.id && item.id !== KarmaFieldsAlpha.loading) {

      return KarmaFieldsAlpha.field.files.prototype.getFile.call(this, item.id);

    }



    // let mimetype = this.getValue(id, "mimetype");
    // let filename = this.getValue(id, "filename");
    // let dir = this.getValue(id, "dir");
    //
    // if (filename && mimetype && dir) {
    //
    //   filename = filename[0] || "";
    //   mimetype = mimetype[0] || "";
    //   dir = dir[0] || "";
    //
    //   if (mimetype === "image/jpeg" || mimetype === "image/png") {
    //
    //     let sizes = this.getValue(id, "sizes");
    //
    //     if (sizes) {
    //
    //       const thumb = sizes.find(size => size.name === "thumbnail");
    //
    //       if (thumb) {
    //
    //         return KarmaFieldsAlpha.uploadURL+dir+"/"+thumb.filename;
    //
    //       }
    //
    //     }
    //
    //   }  else if (mimetype.startsWith("image")) {
    //
    //     return KarmaFieldsAlpha.uploadURL+dir+"/"+filename;
    //
    //   }
    //
    // }

  }

  getCaption(item) {

    if (item.exit) {

      return "..";

    } else if (item.type === "folder" && item.id && item.id !== KarmaFieldsAlpha.loading) {

      return this.getAlias(item.id, "name");

    } else if (item.type === "file" && item.id) {

      return KarmaFieldsAlpha.field.files.prototype.getCaption.call(this, item.id);

    } else {

      return "...";

    }



    // let file = this.getValue(id, "basename");
    // let filetype = this.getValue(id, "filetype");
    //
    // if (filetype) {
    //
    //   if (filetype[0] === "folder") {
    //
    //     let title = this.getValue(id, "post_title");
    //
    //     if (title) {
    //
    //       return title[0] || "";
    //
    //     } else {
    //
    //       return "loading...";
    //
    //     }
    //
    //   } else {
    //
    //     let mimetype = this.getValue(id, "mimetype");
    //
    //     if (mimetype) {
    //
    //       mimetype = mimetype[0] || "";
    //
    //       if (mimetype !== KarmaFieldsAlpha.loading) {
    //
    //         if (file) {
    //
    //           file = file[0] || "";
    //
    //           if (file) {
    //
    //             return file.slice(file.lastIndexOf("/") + 1);
    //
    //           } else {
    //
    //             return "file not found";
    //
    //           }
    //
    //         } else {
    //
    //           return "loading file...";
    //
    //         }
    //
    //       } else {
    //
    //         return "attachment not found";
    //
    //       }
    //
    //     } else {
    //
    //       return "loading attachment...";
    //
    //     }
    //
    //   }
    //
    // } else {
    //
    //   return "loading...";
    //
    // }


  }

  isFolder(id) {

    // if (item.exit) {
    //
    //   return true;
    //
    // } else if (item.id) {

      const [filetype] = this.getValue(id, "filetype") || [];

      return filetype === "folder";

    // }
    //
    // return false;
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




              // let ids = this.getMixedIds();
              let items = this.getMixedItems();

              grid.element.classList.toggle("loading", !items || items === KarmaFieldsAlpha.loading);

              if (items && items !== KarmaFieldsAlpha.loading) {

                const page = this.parent.request("getPage");
                const ppp = this.getPpp();
                const offset = (page - 1)*ppp;
                const [parent] = this.parent.getValue("parent") || [];

                let selection = this.getMixedSelection();






                // const selector = new KarmaFieldsAlpha.Selector(grid.element);
                const selector = new KarmaFieldsAlpha.DragAndDrop(grid.element);
                selector.colCount = 1;


                // if (parent && parent !== "0") {
                //
                //   items.unshift(KarmaFieldsAlpha.exit);
                //
                // }

                selector.rowCount = items.length;
                selector.dropZones = items.map((item, index) => index).filter(index => items[index].exit || items[index].type === "folder");

                if (selection && selection.final) {
                  selector.selection = selection;
                  // const [string] = this.export([], selection.index, selection.length);
                  // KarmaFieldsAlpha.Clipboard.write(string);
                }

                selector.onselect = newSelection => {
                  // if (!KarmaFieldsAlpha.Selection.compare(newSelection, selection)) {

                  // newSelection = this.purifySelection(newSelection);
                  //
                  // if (newSelection.length > 0) {

                    KarmaFieldsAlpha.Clipboard.focus();
                    this.setMixedSelection(newSelection);
                    // this.setSelection(newSelection);
                    this.render();

                  // }



                  // }
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

                selector.onDragOver = element => {
                  element.classList.add("drop-active");
                };

                selector.onDragOut = element => {
                  element.classList.remove("drop-active");
                };

                selector.ondrop = (index, selection) => {
                  // const ids = this.getIds();
                  const targetId = items[index].id;
                  const selectedIds = items.slice(selection.index, selection.index + selection.length).filter(item => item.id).map(item => item.id);

                  this.move(selectedIds, targetId);
                };


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

                    update: li => {

                      // const filetype = this.getValue(id, "filetype");

                      // const isSelected = selection && KarmaFieldsAlpha.Selection.containRow(selection, index);
                      //
                      // li.element.classList.toggle("selected", Boolean(isSelected));

                      // li.element.classList.remove("hidden"); // -> because it get hidden when dropped

                      li.element.classList.toggle("selected", selector.includes(index) || Boolean(selection.final && !selection.length && item.id === KarmaFieldsAlpha.exit));
                      li.element.classList.toggle("media-dropzone", Boolean(item.exit || item.type === "folder"));
                      // li.element.classList.toggle("exit-folder", id === KarmaFieldsAlpha.exit);

                      li.element.ondblclick = event => {
                        if (item.id && item.id !== KarmaFieldsAlpha.loading && (item.type === "folder" || item.exit)) {
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

                      li.child = {
                        class: "frame",
                        // init: frame => {
                        //   frame.element.tabIndex = -1;
                        // },
                        update: frame => {

                          frame.children = [
                            {
                              tag: "figure",
                              update: figure => {

                                const src = this.getFile(item);
                                const icon = !src && this.getIcon(item);

                                // console.log(index, id, src, icon);

                                figure.element.classList.toggle("dashicons", Boolean(icon));
                                figure.element.classList.toggle("dashicons-category", icon === "folder");
                                figure.element.classList.toggle("dashicons-format-image", icon === "image");
                                figure.element.classList.toggle("dashicons-media-video", icon === "video");
                                figure.element.classList.toggle("dashicons-media-audio", icon === "audio");
                                figure.element.classList.toggle("dashicons-media-text", icon === "text");
                                figure.element.classList.toggle("dashicons-media-document", icon === "document");
                                figure.element.classList.toggle("dashicons-media-archive", icon === "archive");
                                figure.element.classList.toggle("dashicons-media-default", icon === "default");
                                figure.element.classList.toggle("dashicons-open-folder", icon === "exit");
                                figure.element.classList.toggle("dashicons-upload", icon === "upload");
                                figure.element.classList.toggle("dashicons-warning", icon === "notfound");



                                if (src) {
                                  figure.children = [{
                                    tag: "img",
                                    update: img => {
                                      if (!img.element.src.endsWith(src)) { // -> setting same src reloads image!
                                        img.element.src = KarmaFieldsAlpha.uploadURL+src;
                                      }
                                    }
                                  }];
                                } else {
                                  figure.children = [];
                                }
                              }
                            },
                            {
                              class: "file-caption",
                              child: {
                                class: "filename",
                                update: filename => {
                                  filename.element.innerHTML = this.getCaption(item);
                                }
                              }
                            }
                          ];
                        }
                      }
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

        // const ids = this.request("getSelectedIds");

        // const ids = this.request("getSelectedItems").filter(item => !item.loading && item.id).map(item => item.id);


        // console.log(ids);


        // if (!ids.includes(KarmaFieldsAlpha.exit)) {


        // }
        //
        // const isMultiple = this.request("multiple");
        // const filetypes = this.getValue("filetype");
        //
        // if (filetypes) {

          // const isMultiple = this.request("multiple");
          const id = this.getId();

          const driver = this.getDriver();

          if (id === KarmaFieldsAlpha.loading) {

            container.children = [
              new KarmaFieldsAlpha.field.text.media({
                id: KarmaFieldsAlpha.loading,
                driver: driver
              }).build()
              // this.createChild({
              //   type: "group",
              //   children: []
              // })
            ];

          } else if (id === KarmaFieldsAlpha.mixed) {

            container.children = [
              new KarmaFieldsAlpha.field.text.media({
                id: KarmaFieldsAlpha.mixed,
                driver: driver
              }).build()
            ];

          } else {

            container.children = [
              new KarmaFieldsAlpha.field.text.media({
                id: id,
                driver: driver
              }).build(),
              this.createChild({
                type: "group",
                children: [
                  {
                    type: "text",
                    links: {content: ["getValue", "filename"], href: "#"}
                  },
                  {
                    type: "text",
                    content: ["replace", "% KB", "%", ["math", "floor", ["/", ["getValue", "size"], 1000]]]
                  },
                  {
                    type: "text",
                    content: ["replace", "% x % pixels", "%", ["getValue", "width"], ["getValue", "height"]]
                  },
                  {
                    type: "text",
                    content: ["date", ["upload-date"], {year: "numeric", month: "long", day: "2-digit"}]
                  }
                ]
              }).build()
            ];






          // container.children = [
          //   new KarmaFieldsAlpha.field.text.media({
          //     id: id,
          //     driver: driver
          //   }).build(),

            // {
            //   class: "karma-field-frame",
            //   children: [
            //     {
            //       // -> multiple attachments/folders
            //       update: frame => {
            //         frame.element.classList.toggle("hidden", id !== KarmaFieldsAlpha.mixed);
            //         if (id === KarmaFieldsAlpha.mixed) {
            //           frame.child = {
            //             tag: "span",
            //             class: "dashicons dashicons-format-gallery",
            //             init: span => {
            //               span.element.style = "font-size:10em;text-align:left;height:auto;width:auto;";
            //             }
            //           };
            //         }
            //       }
            //     },
            //     {
            //       // -> 1 attachment
            //       update: frame => {
            //         const filetype = KarmaFieldsAlpha.Query.getFileType();
            //         frame.element.classList.toggle("hidden", isMultiple || filetype !== "file");
            //         if (!isMultiple && filetype === "file") {
            //           const [mimetype] = this.getValue("mimetype") || [];
            //           if (mimetype) {
            //             frame.children = [
            //               {
            //                 tag: "figure",
            //                 class: "image",
            //                 update: figure => {
            //                   figure.element.classList.toggle("hidden", !mimetype.startsWith("image"));
            //                   if (mimetype.startsWith("image")) {
            //                     figure.child = {
            //                       tag: "img",
            //                       init: img => {
            //                         img.element.sizes = "40em";
            //                       },
            //                       update: img => {
            //                         const filenames = this.getValue("filename");
            //                         const dirs = this.getValue("dir");
            //                         const sizes = this.getValue("sizes");
            //                         if (filenames && sizes && dirs) {
            //                           if (!img.element.src.endsWith(filenames[0])) {
            //                             const dir = KarmaFieldsAlpha.uploadURL+dirs[0];
            //                             img.element.src = KarmaFieldsAlpha.uploadURL+"/"+filenames[0];
            //                             img.element.srcset = sizes.filter(size => size.width).map(size => `${dir}/${encodeURI(size.filename)} ${size.width}w`);
            //                           }
            //                         }
            //                       }
            //                     }
            //                   } else {
            //                     figure.children = [];
            //                   }
            //                 }
            //               },
            //               {
            //                 tag: "figure",
            //                 class: "video",
            //                 update: figure => {
            //                   figure.element.classList.toggle("hidden", !mimetype.startsWith("video"));
            //                   if (mimetype.startsWith("video")) {
            //                     figure.child = {
            //                       tag: "video",
            //                       update: async video => {
            //                         video.element.setAttribute("controls", "1");
            //                         video.child = {
            //                           tag: "source",
            //                           update: source => {
            //                             const filenames = this.getValue("filename");
            //                             if (filenames && mimetype && !source.element.src.endsWith(filenames[0])) {
            //                               video.element.pause();
            //                               source.element.src = KarmaFieldsAlpha.uploadURL+"/"+filenames[0];
            //                               source.element.type = mimetype;
            //                               video.element.load();
            //                             }
            //                           }
            //                         };
            //                       }
            //                     }
            //                   } else {
            //                     figure.children = [];
            //                   }
            //                 }
            //               },
            //               {
            //                 tag: "figure",
            //                 class: "audio",
            //                 update: figure => {
            //                   figure.element.classList.toggle("hidden", !mimetype.startsWith("audio"));
            //                   if (mimetype.startsWith("audio")) {
            //                     figure.child = {
            //                       tag: "audio",
            //                       update: audio => {
            //                         audio.element.setAttribute("controls", "1");
            //                         audio.child = {
            //                           tag: "source",
            //                           update: source => {
            //                             const filenames = this.getValue("filename");
            //                             if (filenames && mimetype && !source.element.src.endsWith(filenames[0])) {
            //                               audio.element.pause();
            //                               source.element.src = KarmaFieldsAlpha.uploadURL+"/"+filenames[0];
            //                               source.element.type = mimetype;
            //                               audio.element.load();
            //                             }
            //                           }
            //                         };
            //                       }
            //                     }
            //                   } else {
            //                     figure.children = [];
            //                   }
            //                 }
            //               }
            //             ];
            //           }
            //         }
            //       }
            //     },
            //     {
            //       // -> 1 folder
            //       class: "media-detail",
            //       update: frame => {
            //         frame.element.classList.toggle("hidden", isMultiple || filetype !== "folder");
            //         if (!isMultiple && filetype === "folder") {
            //           frame.child = {
            //             tag: "span",
            //             class: "dashicons dashicons-category",
            //             init: span => {
            //               // span.element.style = "font-size:8em;height:auto;width:auto;"
            //             }
            //           }
            //         }
            //       }
            //     }
            //   ]
            // },




            // this.createChild({
            //   type: "group",
            //   children: [
            //     {
            //       type: "text",
            //       // content: ["getValue", "filename"],
            //       // label: "Filename",
            //       links: {content: ["getValue", "filename"], href: "#"}
            //     },
            //     {
            //       type: "text",
            //       // label: "Size",
            //       content: ["replace", "% KB", "%", ["math", "floor", ["/", ["getValue", "size"], 1000]]]
            //     },
            //     {
            //       type: "text",
            //       // label: "Dimensions",
            //       content: ["replace", "% x % pixels", "%", ["getValue", "width"], ["getValue", "height"]]
            //     },
            //     {
            //       type: "text",
            //       // label: "Date",
            //       content: ["date", ["getValue", "date"], {year: "numeric", month: "long", day: "2-digit"}]
            //     }
            //   ]
            // }).build()




            // {
            //   class: "karma-field-frame",
            //   children: [
            //     {
            //       // -> multiple attachments/folders
            //       update: frame => {
            //         frame.element.classList.toggle("hidden", !isMultiple);
            //         if (isMultiple) {
            //           frame.children = [
            //             {
            //               tag: "label",
            //               update: span => {
            //                 span.element.innerHTML = `${this.request("getSelectedIds").length} items selected`;
            //               }
            //             }
            //           ];
            //         }
            //       }
            //     },
            //     {
            //       // -> 1 attachment
            //       class: "karma-field karma-field-container display-table",
            //       update: frame => {
            //         frame.element.classList.toggle("hidden", isMultiple || filetype !== "file");
            //         if (!isMultiple && filetype === "file") {
            //           frame.children = [
            //             {
            //               class: "filename",
            //               children: [
            //                 {
            //                   tag: "label",
            //                   init: label => {
            //                     label.element.innerHTML = "Filename";
            //                   }
            //                 },
            //                 {
            //                   class: "value",
            //                   child: {
            //                     tag: "a",
            //                     update: a => {
            //                       const names = this.getValue("name");
            //                       const filenames = this.getValue("filename");
            //                       if (names && filenames) {
            //                         a.element.innerHTML = names[0];
            //                         a.element.href = KarmaFieldsAlpha.uploadURL+"/"+filenames[0];
            //                       }
            //                     }
            //                   }
            //                 }
            //               ]
            //             },
            //             {
            //               children: [
            //                 {
            //                   tag: "label",
            //                   init: label => {
            //                     label.element.innerHTML = "Size";
            //                   }
            //                 },
            //                 {
            //                   update: async node => {
            //                     const sizes = this.getValue("size");
            //                     if (sizes) {
            //                       node.element.innerHTML = `${(sizes[0]/1000).toFixed()} KB`;
            //                     }
            //                   }
            //                 }
            //               ]
            //             },
            //             {
            //               children: [
            //                 {
            //                   tag: "label",
            //                   init: label => {
            //                     label.element.innerHTML = "Dimensions";
            //                   }
            //                 },
            //                 {
            //                   update: async node => {
            //                     const widths = this.getValue("width");
            //                     const heights = this.getValue("height");
            //                     if (widths && heights) {
            //                       node.element.innerHTML = `${widths[0]} x ${heights[0]} pixels`;
            //                     }
            //                   }
            //                 }
            //               ]
            //             },
            //             {
            //               children: [
            //                 {
            //                   tag: "label",
            //                   init: label => {
            //                     label.element.innerHTML = "Uploaded on";
            //                   }
            //                 },
            //                 {
            //                   update: async node => {
            //                     const dates = this.getValue("date");
            //                     if (dates) {
            //                       const date = new Date(dates[0] || null);
            //                       node.element.innerHTML = new Intl.DateTimeFormat(KarmaFieldsAlpha.locale, {
            //                         year: "numeric",
            //                         month: "long",
            //                         day: "2-digit"
            //                       }).format(date);
            //                     }
            //                   }
            //                 }
            //               ]
            //             }
            //           ]
            //         }
            //       }
            //     },
            //     {
            //       // -> 1 folder
            //       class: "one-folder",
            //       update: async frame => {
            //         frame.element.classList.toggle("hidden", isMultiple || filetype !== "folder");
            //         if (!isMultiple && filetype === "folder") {
            //           const [id] = this.request("getSelectedIds") || [];
            //           frame.children = [
            //             this.createChild({
            //               type: "group",
            //               display: "flex",
            //               children: [
            //                 {
            //                   type: "input",
            //                   label: "Name",
            //                   key: "name",
            //                   style: "flex-grow:1"
            //                 },
            //                 {
            //                   type: "button",
            //                   title: "Open",
            //                   action: "openFolder",
            //                   values: [id]
            //                 }
            //               ]
            //             }).build()
            //           ];
            //         } else {
            //           frame.children = [];
            //         }
            //       }
            //     }
            //   ]
            // }
          // ];
        // } else {
        //   container.children = [];
        }
      }
    };
  }
}

KarmaFieldsAlpha.field.medias.modal = class extends KarmaFieldsAlpha.field.grid.modal {

  build() {
    return {
			class: "karma-field karma-field-container",
      update: container => {
        const ids = this.request("getSelectedIds");
        if (!ids.includes(KarmaFieldsAlpha.exit)) {
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
