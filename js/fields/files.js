KarmaFieldsAlpha.field.files = class extends KarmaFieldsAlpha.field {

  constructor(resource) {
    super(resource);

    // this.uploader = this.createUploader(resource);
    // this.clipboard = new KarmaFieldsAlpha.Clipboard();
    // this.clipboard = this.createChild("clipboard");


    // compat
    // if (resource.uploader === "wp") {
    //   resource.driver = "medias";
    //   resource.joins = ["files"];
    // }

    this.driver = this.resource.driver || "medias";
    // this.relations = this.resource.relations || ["meta", "filemeta"];

  }

  async fetchMedias() {

		if (this.resource.driver) {


			const form = new KarmaFieldsAlpha.field.Form({
				driver: this.resource.driver,
				joins: this.resource.joins
			});

	    const results = await form.query(this.resource.params || {});

			for (let item of results) {
				options.push({
					id: item.id,
					name: item[this.resource.nameField || "name"] || await form.getInitial(item.id, this.resource.nameField || "name")
				});
			}

		} else if (this.resource.table) {

			const table = await this.parent.request("table", {id: this.resource.table});

			const results = await table.query({...table.resource.params, ...this.resource.params});

			for (let item of results) {
				options.push({
					id: item.id,
					name: item[this.resource.nameField || "name"] || await table.getInitial(item.id, this.resource.nameField || "name")
				});
			}

		}

		return options;

	}

  // async getSelectedIds() {
  //
  //   const ids = await this.getArray();
  //
  //   if (this.selection && this.selection.length) {
  //
  //     return ids.slice(this.selection.index, this.selection.index + this.selection.length);
  //
  //   }
  //
  //   return [];
  // }

  async openLibrary() {

    // const ids = await this.getArray();
    let selectedIds = this.getSelectedIds();

    // if (this.selection && this.selection.length) {
    //
    //   selectedIds = ids.slice(this.selection.index, this.selection.index + this.selection.length);
    //
    // }

    if ((this.resource.uploader || this.resource.library)  === "wp") {

      // this.uploader.open(selectedIds, {...this.selection});
      this.openMediaLibrary();

    } else {

      const {index, length} = this.selection || {index: 9999999, length: 0};

      const table = await this.request("table", {id: this.resource.table || "medias"});

      // const {index: index, length: length} = this.selection || {index: this.resource.insertAt || 99999, length: 0};

      let parentId = 0;

      if (this.resource.folder) {

        const results = await table.query("name="+this.resource.folder);

        if (results.length) {

          parentId = results[0].id;

        }

      } else if (this.resource.folderId) {

        parentId = this.resource.folderId;

      }

      const key = this.getKey();
      // const path = await this.request("path");

      await this.parent.request("fetch", {
        // params: {
        //   table: this.resource.table || "medias",
        //   selection: selectedIds.join(","),
        //   parent: parentId
        // },
        // path: await this.request("path")
        // table: this.resource.table || "medias",
        // // selection: selectedIds.join(","),
        // parent: parentId
        // callback: async inputIds => {
        //   await this.insert(inputIds, index, length);
        // }
        params: {
          table: this.resource.table || "medias",
          parent: parentId
        },
        ids: selectedIds,
        callback: async inputIds => {
          await this.insert(inputIds, index, length);
        }
      }, key);

      // const path = await this.parent.request("path");
      // const nav = KarmaFieldsAlpha.Nav.get() || {};
      // const currentIds = table.idsBuffer.get() || [];

      // const mask = {};
      //
      // for (let key in nav) {
      //   mask[key] = null;
      // }

      // const params = table.getParams();
      //
      // const results = await table.query({
      //   ...params,
      //   parent: parentId
      // });
      //
      // const newIds = results.map(item => item.id);
      //
      // this.idsBuffer.change(newIds, ids);

      // const transfert = {
      //   nav: KarmaFieldsAlpha.Nav.get(),
      //   path: await this.parent.request("path")
      // };
      //
      // Object.freeze(transfert);
      //
      // // const currentSelection = table.selectionBuffer.get();
      //
      // await table.load();
      //
      // const selection = table.createSelection(selectedIds);
      //
      // if (selection) {
      //
      //   table.selectionBuffer.change(selection);
      //
      // }
      //
      //
      //
      // const buffer = new KarmaFieldsAlpha.Buffer("state", "transfer");
      //
      // buffer.change(transfer);



    }

  }

  // async exportValue() {
  //   // -> export as string
	// 	const key = this.getKey();
  //   const response = await this.parent.request("get", {}, key);
  //   const ids = KarmaFieldsAlpha.Type.toArray(response);
  //   // return ids.join(",");

  //   const jsonData = ids.map(id => {
  //     return {
  //       id: id,
  //       filetype: "file"
  //     };
  //   });

  //   return KarmaFieldsAlpha.Clipboard.unparse(jsonData);
	// }

	// async importValue(value) {
  //   // -> import as string
	// 	const key = this.getKey();
  //   // const ids = value.split(",").map(item => item.trim());
  //   const ids = [];
  //   const arrayData = KarmaFieldsAlpha.Clipboard.parse(jsonData);
  //   const jsonData = KarmaFieldsAlpha.Clipboard.toJson(arrayData);


  //   for (let row of jsonData) {
  //     if (row.filetype === "file" && row.id !== undefined) {
  //       ids.push(row.id);
  //     }
  //   }

  //   await this.parent.request("set", {data: ids}, key);

  //   // or

  //   // await this.importJson(jsonData);
	// }

  // async importJson(data) {
  //   const ids = [];
  //   for (let row of data) {
  //     if (row.filetype === "file" && row.id !== undefined) {
  //       ids.push(row.id);
  //     } else if (row.filetype === "folder") {
  //       // const store = new KarmaFieldsAlpha.Store(this.resource.driver || "medias", this.resource.joins || ["files"]);
  //       // const results =  await store.query("parent="+row.id);
  //       // await this.importJson(results.map(result => {
  //       //   return {
  //       //     id: result.id,
  //       //     filetype: await store.getValue(result.id, "filetype");
  //       //   }
  //       // }));
  //     }
  //   }
  //   await this.parent.request("set", {data: ids}, key);
  // }

  // export(object = {}) {

	// 	const key = this.getKey();

  //   const ids = this.getIds();

  //   object[key] = ids;

  //   object[`${key}URL`] = ids.map(id => {

  //     const [file] = KarmaFieldsAlpha.Query.getValue(this.driver, id, "_wp_attached_file") || [];

  //     if (file) {

  //       return KarmaFieldsAlpha.uploadURL+"/"+file;
  //     }

  //     return "";
  //   });

  //   return object;
	// }

  export(items = [], index = 0, length = 999999) {

    const ids = this.getValue() || [];

    const grid = new KarmaFieldsAlpha.Grid();
    grid.addColumn(ids.slice(index, index + length));

    items.push(grid.toString());

    return items;

	}


  import(items, index = 0, length = 999999) {

    const string = items.shift();

    const grid = new KarmaFieldsAlpha.Grid(string);
    const newIds = grid.getColumn(0);

    const ids = [...KarmaFieldsAlpha.Type.toArray(this.getValue())];

    ids.splice(index, length, ...newIds);

    this.setValue(ids);

    // this.setValue(value);

    // const key = this.getKey();

    // if (object[key] !== undefined) {

    //   let ids = object[key];

    //   this.setIds(ids);

    // }

	}

	// import(object = {}) {

  //   const key = this.getKey();

  //   if (object[key] !== undefined) {

  //     let ids = object[key];

  //     this.setIds(ids);

  //   }

	// }

  getSelectedIds() {

    const selection = this.getSelection();

    if (selection) {

  		const ids = this.getValue();

      if (ids) {

        return ids.slice(selection.index, selection.index + selection.length);

      }

    }

    return [];
  }

  // encodeIds(ids) {
  //   // const array = ids.map(id => {
  //   //   const object = {};
  //
  //   //   let files = KarmaFieldsAlpha.Query.getValue(this.driver, id, "_wp_attached_file");
  //
  //   //   if (files) {
  //
  //   //     object.url = files[0] || "";
  //
  //   //   }
  //
  //   //   object.id = id;
  //
  //   //   return object;
  //   // });
  //
  //   // const data = KarmaFieldsAlpha.Clipboard.toDataArray(array);
  //
  //   // return KarmaFieldsAlpha.Clipboard.unparse(data);
  //
  //
  //   const grid = new KarmaFieldsAlpha.Grid();
  //
  //   grid.addColumn(ids);
  //
  //   return grid.toString();
  //
  // }

  // decodeIds(string) {
  //
  //   // const data = KarmaFieldsAlpha.Clipboard.parse(string);
  //   // const json = KarmaFieldsAlpha.Clipboard.toJson(data);
  //
  //   // return json.map(object => object.id);
  //
  //   const grid = new KarmaFieldsAlpha.Grid(string);
  //
  //   return grid.getColumn(0);
  //
  // }

  paste(value, selection) {

    if (selection) {

      const ids = this.getIds();

      if (ids) {

        const [current] = this.export([], selection.index, selection.length);

        if (value !== current) {

          this.import([value], selection.index, selection.length);

          // KarmaFieldsAlpha.History.save();

          this.parent.request("save");

        }

      }

    }

  }

  // getSelection() {

  //   const key = this.getKey();

  //   return this.parent.getSelection(key);

  // }

  // setSelection(ids) {

  //   const key = this.getKey();

  //   this.parent.setSelection(ids, key);

  // }

  // async input(inputIds) {

  //   // const ids = await this.getArray();
  //   // const insertIds = [...ids];

  //   const {index: index, length: length} = this.selection || {index: this.resource.insertAt || 99999, length: 0};


  //   // if (this.selection || inputIds.length) {
  //   //
  //   //   if (this.selection) {
  //   //
  //   //     insertIds.splice(this.selection.index, this.selection.length, ...inputIds);
  //   //
  //   //     this.selection = null; //inputIds.length && {index: this.selection.index, length: inputIds.length} || null;
  //   //
  //   //   } else if (inputIds.length) {
  //   //
  //   //     insertIds.push(...inputIds);
  //   //
  //   //   }

  //     KarmaFieldsAlpha.History.save();

  //     await this.insert(inputIds, index, length);

  //     // await this.dispatch({
  //     //   action: "set",
  //     //   data: insertIds
  //     // });
  //     //
  //     // await this.dispatch({
  //     //   action: "render"
  //     // });

  //     await this.parent.request("render");

  //   // }

  // }

  async swap(index, length, target) {

    if (target !== index) {

      // const key = this.getKey();
      const ids = this.getValue();

      if (ids) {

        const clone = [...ids];
        clone.splice(target, 0, ...clone.splice(index, length));

        this.setValue(clone);

      }

    }

  }



  // async dispatch(event) {
  //
  //   switch(event.action) {
  //
  //     case "add":
  //       // this.uploader.open([]);
  //       await this.openLibrary([]);
  //       break;
  //
  //     case "edit": {
  //       // const ids = await this.slice(event.selection.index, event.selection.length);
  //       // this.editSelection = event.selection;
  //
  //       const ids = await this.getSelectedIds();
  //
  //       await this.openLibrary(ids);
  //
  //       break;
  //     }
  //
  //     case "delete": {
  //         // const ids = await this.dragAndDrop.items.map(item => item.id);
  //         // ids.splice(this.dragAndDrop.selection.index, this.dragAndDrop.selection.length);
  //         //
  //         // this.dragAndDrop.clearSelection();
  //
  //       if (this.selection) {
  //
  //         const ids = await this.getArray();
  //         const deleteIds = [...ids];
  //
  //         deleteIds.splice(this.selection.index, this.selection.length);
  //
  //         this.selection = null;
  //
  //         KarmaFieldsAlpha.History.save();
  //
  //         await this.dispatch({
  //           action: "set",
  //           data: deleteIds
  //         });
  //         await this.dispatch({
  //           action: "render"
  //         });
  //
  //       }
  //
  //
  //       break;
  //     }
  //
  //     // case "insert": {
  //     //
  //     //   const ids = await this.getArray();
  //     //   const insertIds = [...event.data];
  //     //
  //     //   insertIds.splice(event.index, event.length, ...ids);
  //     //
  //     //   KarmaFieldsAlpha.History.save();
  //     //
  //     //   await this.dispatch({
  //     //     action: "set",
  //     //     data: insertIds
  //     //   });
  //     //
  //     //   await this.dispatch({
  //     //     action: "render"
  //     //   });
  //     //
  //     //   break;
  //     // }
  //     //
  //     // case "push": {
  //     //
  //     //   const ids = await this.getArray();
  //     //   const newIds = [...ids, ...event.data];
  //     //
  //     //   KarmaFieldsAlpha.History.save();
  //     //
  //     //   await this.dispatch({
  //     //     action: "set",
  //     //     data: newIds
  //     //   });
  //     //
  //     //   await this.dispatch({
  //     //     action: "render"
  //     //   });
  //     //
  //     //   break;
  //     // }
  //     //
  //     // case "swap": {
  //     //
  //     //   const ids = event.data;
  //     //   const index = event.index;
  //     //   const target = this.selection.index;
  //     //   const length = this.selection.length;
  //     //   const newIds = [...ids];
  //     //
  //     //   newIds.splice(target, 0, ...newIds.splice(index, length));
  //     //
  //     //   KarmaFieldsAlpha.History.save();
  //     //
  //     //   await super.dispatch({
  //     //     action: "set",
  //     //     data: newIds
  //     //   });
  //     //   await super.dispatch({
  //     //     action: "render"
  //     //   });
  //     //
  //     //   // const ids = await this.getArray();
  //     //   // const newIds = [...ids];
  //     //   //
  //     //   // const items = newIds.splice(event.index, event.length);
  //     //   // newIds.splice(event.target, 0, ...items);
  //     //   //
  //     //   // KarmaFieldsAlpha.History.save();
  //     //   //
  //     //   // await super.dispatch({
  //     //   //   action: "set",
  //     //   //   data: newIds
  //     //   // });
  //     //   // await super.dispatch({
  //     //   //   action: "render"
  //     //   // });
  //     //
  //     //   break;
  //     // }
  //
  //     case "selection": {
  //
  //       // event.data = this.selectedIds;
  //       // event.data = this.dragAndDrop.getSelectedItems().map(item => item.id);
  //       if (this.selection && this.selection.length) {
  //         event.data = this.selection;
  //       } else {
  //         event.data = null;
  //       }
  //
  //       break;
  //     }
  //
  //     case "max": {
  //       event.data = this.getMax();
  //       break;
  //     }
  //
  //     case "edit-selection": {
  //       await this.renderControls();
  //       break;
  //     }
  //
  //     // case "get": {
  //     //   const value = await this.getValue(...event.path);
  //     //   event.setValue(value);
  //     //   break;
  //     // }
  //
  //     default:
  //       await super.dispatch(event);
  //       break;
  //
  //   }
  //
  //   return event;
  // }

  // request(subject, content, ...path) {
  //   console.log(subject);

  //   switch(subject) {

  //     case "add":
  //       this.openLibrary([]);
  //       break;

  //     case "edit": {
  //       const ids = this.getSelectedIds();
  //       this.openLibrary(ids);
  //       break;
  //     }

  //     case "delete": {
  //       if (this.selection) {
  //         KarmaFieldsAlpha.History.save();
  //         this.insert([], this.selection.index, this.selection.length);
  //         this.parent.request("render");
  //       }
  //       break;
  //     }

  //     case "selection": {
  //       if (this.selection && this.selection.length) {
  //         return this.selection;
  //       }
  //       break;
  //     }

  //     case "max": {
  //       return this.getMax();
  //     }

  //     case "edit-selection": {
  //       if (this.onRenderControls) {
  //         this.onRenderControls();
  //       }
  //       break;
  //     }

  //     default: {
  //       const key = this.getKey();
  //       return this.parent.request(subject, content, key, ...path);
  //     }

  //   }

  // }

  // expect(action, object) {

  //   switch (action) {

  //     case "export": {

  //       // return this.export();
  //     }

  //     case "import": {

  //       // await this.import(object);

  //       // break;
  //     }

  //     case "gather": {

  //       // if (object.type === "medias") {

  //       //   const ids = await this.getIds();

  //       //   for (let id of ids) {

  //       //     if (id) {

  //       //       object.set.add(id.toString());

  //       //     }

  //       //   }

  //       //   // return new Set(ids.map(id => id.toString()));

  //       // }

  //     }

  //   }

  // }

  getValue() {
    const key = this.getKey();
    return this.parent.getValue(key);
  }

  setValue(ids) {
    const key = this.getKey();
    this.parent.setValue(ids, key);
  }

  getIds() {
    const key = this.getKey();
    return this.parent.getValue(key);
  }

  setIds(ids) {
    const key = this.getKey();
    this.parent.setValue(ids, key);
  }

  open() {
    this.openLibrary();
  }

  append(ids) {
    const values = this.getIds();

    ids = [...values, ...ids];
    this.setIds(ids);
  }

  insert(ids, index, length) {

    // const key = this.getKey();
    const values = this.getIds();
    const clones = [...values];

    clones.splice(index, length || 0, ...ids);

    const slice = clones.slice(0, this.getMax());

    this.setIds(slice);

  }

  delete() {

    const selection = this.getSelection();

    if (selection) {

      this.insert([], selection.index, selection.length);

      this.parent.request("save");

      this.parent.request("render");

    }

  }

  // createUploader(resource) {
  //   const uploader = {};
  //   uploader.addFrame = null;
  //   uploader.open = (imageIds, selection) => {
  //     uploader.imageIds = imageIds || [];
  //     if (!uploader.addFrame) {
  //       uploader.addFrame = wp.media({
  //         title: "Select file",
  //         button: {
  //           text: "Use this file"
  //         },
  //         library: {
  //           type: resource.file && (resource.file.type || resource.file.types)
  //             || resource.mime_types
  //             || resource.mimeTypes
  //             || resource.mimetypes
  //             || resource.mimeType
  //             || resource.mimetype
  //             || resource.mime_type
  //             || "image" //'application/font-woff'
  //         },
  //         multiple: this.getMax() > 1 ? true : false
  //       });
  //       uploader.addFrame.on("select", async () => {
  //         const attachments = uploader.addFrame.state().get("selection").toJSON();
  //         const attachmentIds = attachments.map(attachment => attachment.id.toString());
  //         uploader.imageIds = attachmentIds; //.map(id => id.toString());

  //         KarmaFieldsAlpha.History.save();

  //         if (selection) {
  //           this.insert(attachmentIds, selection.index, selection.length);
  //         } else {
  //           this.append(attachmentIds);
  //         }

  //         this.parent.request("render");
  //       });
  //       uploader.addFrame.on("open", () => {
  //         let selection = uploader.addFrame.state().get("selection");
  //         for (let id of uploader.imageIds) {
  //           selection.add(wp.media.attachment(id));
  //         }
  //       });
  //     }
  //     uploader.addFrame.open();
  //   }
  //   return uploader;
  // }

  openMediaLibrary() {

    const ids = this.getIds();
    const selection = this.getSelection();
    // const selectedIds = selection && ids.slice(selection.index, selection.index + selection.length);

    const frame = wp.media({
      title: "Select file",
      button: {
        text: "Use this file"
      },
      library: {
        post__in: this.getSelectedIds(),
        type: this.resource.file && (this.resource.file.type || this.resource.file.types)
          || this.resource.mime_types
          || this.resource.mimeTypes
          || this.resource.mimetypes
          || this.resource.mimeType
          || this.resource.mimetype
          || this.resource.mime_type
          || "image" //'application/font-woff'
      },
      multiple: this.getMax() > 1 ? true : false
    });
    frame.on("select", async () => {
      const attachments = frame.state().get("selection").toJSON();
      const attachmentIds = attachments.map(attachment => attachment.id.toString());

      if (selection) {
        this.insert(attachmentIds, selection.index, selection.length);
      } else {
        this.append(attachmentIds);
      }

      // const endIndex = (selection && selection.index + selection.length || 0);
      // this.setSelection(new KarmaFieldsAlpha.Selection(endIndex, endIndex + attachmentIds.length)); // -> select added items, also keep modal open


      this.setSelection(new KarmaFieldsAlpha.Selection()); // -> keep modal open

      // KarmaFieldsAlpha.History.save();

      // this.parent.request("save");

      // this.parent.request("render");
    });
    frame.on("open", () => {
      let mediaSelection = frame.state().get("selection");
      for (let id of this.getSelectedIds()) {
        mediaSelection.add(wp.media.attachment(id));
      }
    });

    frame.open();
  }

  async uploadFile(file) {

    if (this.resource.uploader === "wp") {

      const fileName = file.name.normalize();

      const formData = new FormData();
      formData.append("async-upload", file);
      formData.append("name", fileName);
      formData.append("action", wp.Uploader.defaults.multipart_params.action);
      formData.append("_wpnonce", wp.Uploader.defaults.multipart_params._wpnonce);

      return fetch(KarmaFieldsAlpha.adminURL+"async-upload.php", {
        method: "post",
        body: formData,
        mode: "cors"
      }).then(response => response.json());

    }

  }

  getMax() {
    return this.resource.max || this.resource.single && 1 || 999999;
  }

  isSingle() {
    return this.getMax() === 1;
  }

  build() {
    return {
			class: "karma-gallery karma-field",
			init: container => {
        // this.render = container.render;



			},
      update: container => {

        container.element.classList.toggle("single", this.isSingle());

        const key = this.getKey();
        // const state = await this.parent.request("state", {}, key) || {};
        // const ids = KarmaFieldsAlpha.Type.toArray(state.value).filter(id => id).map(id => id.toString()).slice(0, this.getMax());

        const ids = this.getIds();



        const data = this.getData();

        container.element.classList.toggle("loading", !ids);


        container.element.ondragover = event => {
          event.preventDefault(); // needed for ondrop to work!
        }

        container.element.ondrop = async event => {
          event.preventDefault();



          data.uploads = event.dataTransfer.files.length;
          // this.setData(data);

          await this.render();

          for (let file of event.dataTransfer.files) {

            const response = await this.uploadFile(file);

            if (response.success) {

              const id = response.data.id.toString()
              this.append([id]);

            }

            data.uploads--;
            // this.setData(data);
            await this.render();

          }

          // KarmaFieldsAlpha.History.save();

          this.parent.request("save");

          // KarmaFieldsAlpha.Query.uploadFile(event.dataTransfer.files[0]).then(response => {

          //   this.append([response.data.id.toString()])
          // });

          // KarmaFieldsAlpha.Query.uploadFile(event.dataTransfer.files[0]);
          // this.parent.request("render");

          // const files = event.dataTransfer.files;
          // if (event.dataTransfer.files.length && (this.resource.uploader || this.resource.library) !== "wp") {

          //   let table = this.createChild({
          //     type: "form",
          //     driver: "posts"
          //   });

          //   KarmaFieldsAlpha.History.save();
          //   let newIds = ids.slice();
          //   for (let file of event.dataTransfer.files) {
          //     const index = newIds.length;
          //     newIds[index] = "0";
          //     this.parent.request("set", newIds, key);
          //     await container.render();
          //     const id = await table.uploadFile(file);
          //     newIds[index] = id;
          //     console.log(this.resource.folder);
          //     if (this.resource.folder) {
          //       const results = await table.query("name="+this.resource.folder);
          //       console.log(results);
          //       if (results.length) {
          //         await table.setValue(results[0].id, id, "parent");
          //       }
          //     }
          //   }
          //   this.setIds(newIds);
          //   this.parent.request("render");
          // }
        }



        // const filteredIds = ids.filter(id => id !== "0");


        if (ids) {



          container.children = [
            // this.clipboard.build(),
            {
              class: "gallery",
              init: gallery => {
                // gallery.element.tabIndex = -1;
              },
              update: gallery => {

                let selection = this.getSelection();

                gallery.element.classList.toggle("has-selection", Boolean(selection));

                // gallery.element.onfocus = event => {
                //
                //   this.setSelection(selection);
                // }

                // gallery.element.onfocus = event => {

                //   selection = new KarmaFieldsAlpha.Selection();

                //   console.log(selection);


                //   this.setSelection(selection);
                //   KarmaFieldsAlpha.Clipboard.write("");
                //   this.request("render");

                //   // console.log("focus");

                //   // if (selection) {

                //   //   const sortManager = new KarmaFieldsAlpha.SortManager(gallery.element);
                //   //   sortManager.clear(selection);

                //   //   selection = null;
                //   //   this.setSelection(null);

                //   // }

                //   // this.clipboard.output("");
                //   // this.clipboard.focus();
                // }


                // this.clipboard.onBlur = event => {

                //   if (selection) {

                //     const sortManager = new KarmaFieldsAlpha.SortManager(gallery.element);
                //     sortManager.clear(selection);

                //     selection = null;
                //     this.setSelection(selection);

                //   }

                //   if (this.onRenderControls) {
                //     this.onRenderControls();
                //   }
                // }

                // this.clipboard.onInput = async value => {



                //   const array = [];
                //   const arrayData = KarmaFieldsAlpha.Clipboard.parse(value);
                //   const jsonData = KarmaFieldsAlpha.Clipboard.toJson(arrayData);

                //   for (let row of jsonData) {
                //     if (row.filetype === "file" && row.id !== undefined) {
                //       array.push(row.id);
                //     }
                //   }

                //   if (selection || array.length) {

                //     selection = selection || {index: 999999, length: 0};

                //     KarmaFieldsAlpha.History.save();
                //     this.insert(array, selection.index, selection.length);

                //     selection = null;

                //     this.setSelection(selection);

                //     this.parent.request("render");

                //   }

                // }

                gallery.element.ondblclick = event => {
                  // this.openLibrary([]);
                  this.openMediaLibrary();
                }


                const sorter = new KarmaFieldsAlpha.Sorter(gallery.element);
                sorter.colCount = 1;
                sorter.rowCount = ids.length;
                sorter.selection = selection;

                sorter.onselect = newSelection => {

                  if (!KarmaFieldsAlpha.Segment.equals(newSelection, selection)) {

                    selection = newSelection;

                    // KarmaFieldsAlpha.History.save();



                    // const selectedIds = ids.slice(selection.index, selection.index + selection.length);
                    // const string = this.encodeIds(selectedIds);

                    const [string] = this.export([], newSelection.index, newSelection.length);

                    KarmaFieldsAlpha.Clipboard.write(string);

                    // this.request("render");

                    this.setSelection(newSelection);

                  }

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

                sorter.onsort = () => {

                  if (!KarmaFieldsAlpha.Segment.equals(sorter.selection, selection)) {


                    this.swap(selection.index, selection.length, sorter.selection.index);

                    this.setSelection(sorter.selection);

                    // const selectedIds = ids.slice(selection.index, selection.index + selection.length);
                    // const string = this.encodeIds(selectedIds);

                    // KarmaFieldsAlpha.Clipboard.write(string);

                    selection = sorter.selection;

                    // KarmaFieldsAlpha.History.save();

                    // this.parent.request("save");
                    //
                    // this.render();

                  }

                }

                sorter.onbackground = () => {

                  selection = new KarmaFieldsAlpha.Selection(ids.length, 0);
                  this.setSelection(selection);
                  KarmaFieldsAlpha.Clipboard.write("");
                  this.setSelection(selection);

                }



                gallery.children = ids.map((id, rowIndex) => {
                  return {
                    class: "frame",
                    // init: async frame => {
                    //   frame.element.tabIndex = -1;
                    // },
                    update: async frame => {

                      frame.element.classList.toggle("selected", KarmaFieldsAlpha.Segment.contain(selection, rowIndex));








                      // frame.element.rowIndex = rowIndex;
                      // frame.element.multiSelectable = true;

                      // frame.element.onmousedown = async event => {

                      //   if (event.buttons === 1) {

                      //     const sortManager = new KarmaFieldsAlpha.SortManager(gallery.element);

                      //     sortManager.selection = this.getSelection();

                      //     sortManager.onSelect = async segment => {

                      //       this.setSelection(segment);

                      //       const selectedIds = ids.slice(segment.index, segment.index + segment.length);
                      //       const string = this.encodeIds(selectedIds);

                      //       KarmaFieldsAlpha.Clipboard.write(string);

                      //       this.request("render");

                      //     }

                      //     sortManager.onSort = async (index, length, target) => {

                      //       await this.swap(index, length, target);

                      //       sortManager.clear();

                      //       await this.parent.request("render");

                      //     }

                      //     await sortManager.select(event, 0, rowIndex);

                      //   }

                      // }

                      // let mimetypes = await this.parent.request("get-value", {
                      //   driver: this.resource.driver || "posts",
                      //   relations: this.resource.relations || ["meta", "filemeta"],
                      //   id: id,
                      //   key: "post_mime_type"
                      // });

                      let [mimetype] = KarmaFieldsAlpha.Query.getValue(this.driver, id, "mimetype") || [KarmaFieldsAlpha.loading];

                      let icon;


                      frame.element.classList.toggle("loading", mimetype === KarmaFieldsAlpha.loading);

                      // if (mimetypes) {

                        // if (mimetype === "image/jpeg" || mimetype === "image/png") {

                        //   icon = "image";

                        //   const sizes = await this.parent.request("get-value", {
                        //     driver: this.resource.driver || "posts",
                        //     id: id,
                        //     key: "sizes"
                        //   });

                        //   if (sizes) {

                        //     thumb = sizes.find(size => size.name === 'thumbnail');

                        //   }

                        // } else

                        // const mimetype = mimetypes[0];

                        if (!mimetype) {

                          icon = "notfound";

                        } else if (mimetype === KarmaFieldsAlpha.loading) {

                          icon = "loading";

                        } else if (mimetype.startsWith("image")) {

                          icon = "image";

                        } else if (mimetype.startsWith("video")) {

                          icon = "video";

                        } else if (mimetype.startsWith("audio")) {

                          icon = "audio";

                        } else if (mimetype.startsWith("text")) {

                          icon = "text";

                        } else if (mimetype === "application/pdf") {

                          icon = "document";

                        } else if (mimetype === "application/zip") {

                          icon = "zip";

                        } else {

                          icon = "default";

                        }

                      // } else {

                      //   icon = "loading";

                      // }

                      // let files = await this.parent.request("get-value", {
                      //   driver: this.resource.driver || "posts",
                      //   id: id,
                      //   key: "_wp_attached_file"
                      // });

                      let [file] = KarmaFieldsAlpha.Query.getValue(this.driver, id, "_wp_attached_file") || [KarmaFieldsAlpha.loading];



                      frame.children = [
                        {
                          tag: "figure",
                          update: async figure => {



                            if (icon === "image") {

                              // const sizes = (mimetype === "image/jpeg" || mimetype === "image/png") && await this.parent.request("get-value", {
                              //   driver: this.resource.driver || "posts",
                              //   id: id,
                              //   key: "sizes"
                              // });

                              const sizes = (mimetype === "image/jpeg" || mimetype === "image/png") && KarmaFieldsAlpha.Query.getValue(this.driver, id, "sizes");

                              if (sizes) {

                                const thumb = sizes.find(size => size.name === 'thumbnail');

                                if (thumb) {

                                  figure.children = [{
                                    tag: "img",
                                    update: image => {
                                      image.element.src = KarmaFieldsAlpha.uploadURL+"/"+thumb.file;
                                      image.element.width = thumb.width;
                                      image.element.height = thumb.height;
                                    }
                                  }];

                                } else {

                                  icon = "notfound";

                                }

                              } else if (file) {

                                if (file !== KarmaFieldsAlpha.loading) {

                                  figure.children = [{
                                    tag: "img",
                                    update: image => {
                                      image.element.src = KarmaFieldsAlpha.uploadURL+"/"+file;
                                    }
                                  }];

                                }

                              } else {

                                icon = "notfound";

                              }

                            } else {

                              figure.children = [];

                            }

                            figure.element.classList.toggle("dashicons", icon !== "thumb");
                            figure.element.classList.toggle("dashicons-upload", icon === "upload");
                            figure.element.classList.toggle("dashicons-media-video", icon === "video");
                            figure.element.classList.toggle("dashicons-media-audio", icon === "audio");
                            figure.element.classList.toggle("dashicons-media-text", icon === "text");
                            figure.element.classList.toggle("dashicons-media-document", icon === "document");
                            figure.element.classList.toggle("dashicons-media-default", icon === "default");
                            figure.element.classList.toggle("dashicons-format-image", icon === "image");
                            figure.element.classList.toggle("dashicons-media-archive", icon === "zip");
                            figure.element.classList.toggle("dashicons-hourglass", icon === "loading");
                            figure.element.classList.toggle("dashicons-warning", icon === "notfound");

                            // if (icon === "image" && thumb) {
                            //   figure.children = [{
                            //     tag: "img",
                            //     update: image => {
                            //       image.element.src = KarmaFieldsAlpha.uploadURL+"/"+thumb.file;
                            //       image.element.width = thumb.width;
                            //       image.element.height = thumb.height;
                            //     }
                            //   }];
                            // } else if (icon === "image") {
                            //   figure.children = [{
                            //     tag: "img",
                            //     update: async image => {
                            //       const [file] = await table.getInitial(id, "_wp_attached_file");
                            //       image.element.src = KarmaFieldsAlpha.uploadURL+"/"+file;
                            //     }
                            //   }];
                            // } else {
                            //   figure.children = [];
                            // }
                          }
                        },
                        {
                          class: "filename",
                          update: async caption => {
                            if (mimetype) {
                              if (mimetype !== KarmaFieldsAlpha.loading) {
                                if (file) {
                                  if (file !== KarmaFieldsAlpha.loading) {
                                    const filename = file.slice(file.lastIndexOf("/") + 1);
                                    caption.element.innerHTML = filename;
                                  } else {
                                    caption.element.innerHTML = "loading file...";
                                  }
                                } else {
                                  caption.element.innerHTML = "file not found";
                                }
                              } else {
                                caption.element.innerHTML = "loading attachment...";
                              }
                            } else {
                              caption.element.innerHTML = "attachment not found";
                            }
                          }
                        }
                      ];
                    }
                  };
                });

                if (data.uploads) {

                  for (let i = 0; i < data.uploads; i++) {

                    gallery.children.push({
                      class: "frame",
                      children: [
                        {
                          tag: "figure",
                          children: [],
                          update: async figure => {
                            figure.element.classList.toggle("dashicons", true);
                            figure.element.classList.toggle("dashicons-upload", true);
                            figure.element.classList.toggle("dashicons-media-video", false);
                            figure.element.classList.toggle("dashicons-media-audio", false);
                            figure.element.classList.toggle("dashicons-media-text", false);
                            figure.element.classList.toggle("dashicons-media-document", false);
                            figure.element.classList.toggle("dashicons-media-default", false);
                            figure.element.classList.toggle("dashicons-format-image", false);
                            figure.element.classList.toggle("dashicons-media-archive", false);
                            figure.element.classList.toggle("dashicons-hourglass", false);
                            figure.element.classList.toggle("dashicons-warning", false);
                          }
                        },
                        {
                          class: "filename",
                          update: async caption => {
                            caption.element.innerHTML = "uploading file...";
                          }
                        }
                      ]
                    });

                  }

                }

              }
            },
            {
              class: "controls",
              child: {
                class: "footer-content",
                init: controls => {
                  controls.element.onmousedown = event => {
                    event.preventDefault(); // -> prevent losing focus on selected items
                  }
                },
                update: controls => {
                  this.onRenderControls = controls.render;
                  if (this.resource.controls !== false) {
                    controls.child = this.createChild(this.resource.controls || "controls").build();
                  }
                }
              }
            }
          ]

        }





      }
		};

  }

  static controls = class extends KarmaFieldsAlpha.field.group {

    constructor(resource) {

      super({
        display: "flex",
        children: [
          "add",
          "edit",
          "remove"
        ],
        ...resource
      });

    }

    static test = {
      type: "button",
      title: "Test",
      action: "test"
    }

    static add = {
      type: "button",
      title: "Add",
      text: "+",
      action: "open",
      hidden: [">=", ["count", ["getValue"]], ["request", "getMax"]]
    }

    static remove = {
      type: "button",
      title: "Remove",
      text: "×",
      action: "delete",
      disabled: ["!", ["getSelection"]],
      hidden: ["=", ["count", ["getValue"]], 0]
    }

    static edit = {
      type: "button",
      title: "Edit",
      // dashicon: "update",
      action: "open",
      disabled: ["!", ["request", "getSelection"]],
      hidden: ["=", ["count", ["getValue"]], 0]
    }

  }


}

KarmaFieldsAlpha.field.file = class extends KarmaFieldsAlpha.field.files {
  constructor(resource) {
    super({...resource, max: 1});
  }
}
