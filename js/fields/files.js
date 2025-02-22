

KarmaFieldsAlpha.field.files = class extends KarmaFieldsAlpha.field.tags {

  // getChild(index) {
  //
  //   if (index === "body") {
  //
  //     return this.createChild({
  //       type: "gallery",
  //       sortable: true,
  //       ...this.resource.body
  //     }, "body");
  //
  //   } else if (index === "footer" && this.resource.footer !== false) {
  //
  //     return this.createChild({
  //       type: "footer",
  //       ...this.resource.footer
  //     }, "footer");
  //
  //   }
  //
  // }

  // constructor(...args) {
  //
  //   super(...args);
  //
  //   if (this.getMax() === 1) {
  //
  //     this.resource.width = this.resource.width || "auto";
  //
  //   }
  //
  //
  //
  // }

  // newChild(id) {
  //
  //   if (id === "footer") {
  //
  //     return new KarmaFieldsAlpha.field.files.footer(this.resource.footer, "footer", this);
  //
  //   } else if (id === "body") {
  //
  //     return new KarmaFieldsAlpha.field.gallery({
  //       sortable: true
  //     }, "body", this);
  //
  //   }
  //
  // }

  async import(collection, index = 0, length = Infinity) {

    let idsQuery = this.getIds();

    while (idsQuery.loading) {

      await this.render();
      idsQuery = this.getIds();

    }

    const string = collection.value.shift();


    let addedItems = [];


    if (string.startsWith("http")) {

      // const tokens = KarmaFieldsAlpha.server.createTokens(1);



        // this.upload(file);

        // const mediasTable = this.getChild("popup");
        //
        // const driver = mediasTable.getDriver();
        // let params = mediasTable.queryParams();
        //
        // while (params.loading) {
        //
        //   await this.render();
        //   params = mediasTable.queryParams();
        //
        // }
        //
        // const paramstring = params.string;

        const driver = this.getDriver();
        let params = this.queryParams();

        while (params.loading) {

          await this.render();
          params = this.getParams();

        }

        const defaults = Object.fromEntries(Object.entries(params.toObject()).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(driver, key), value]));

        const token = Symbol("token");

        for (let key in defaults) {

          KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, [defaults[key]], "vars", driver, token, key);

        }

        KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.server.store, "ids", driver);

        let ids = [...idsQuery.toArray()];
        ids.splice(index, 0, token);

        const key = this.getKey();
        const content = this.parent.getContent("id");
        const contentDriver = this.parent.getDriver();

        KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, ids, "vars", contentDriver, content.toString(), key);

        await this.render();

        const response = await fetch(string);
        const blob = await response.blob();
        const filename = string.split('/').pop();

        // const file = new File([blob], filename, {type: "image/jpg"});
        const file = new File([blob], filename);

        let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params need to be saved later

        id = id.toString();

        const delta = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.server.store, "vars", driver, token);

        if (delta) {

          KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, delta, "vars", driver, id);
          KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.server.store, "vars", driver, token);

          for (let key in delta) {

            await KarmaFieldsAlpha.Database.States.set(delta[key], "external", driver, id, key);
            await KarmaFieldsAlpha.History.write(delta[key], [], "external", driver, id, key);

          }

        }

        await KarmaFieldsAlpha.Database.Vars.set(["0"], driver, id, "trash");
        await KarmaFieldsAlpha.Database.States.set(["0"], "external", driver, id, "trash");
        await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", driver, id, "trash");



        await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, {[id]: defaults});

        await KarmaFieldsAlpha.Database.States.remove("queries", driver);
        await KarmaFieldsAlpha.Database.Queries.remove({driver});


        ids = ids.map(currentId => currentId === token ? id : currentId);

        // -> remove symbol from store or it will trigger an error when updating history!
        KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, idsQuery.toArray(), "vars", contentDriver, content.toString(), key);

        await this.setIds(ids);


        // or manually change it
        // await KarmaFieldsAlpha.Database.States.set(ids, "external", contentDriver, content.toString(), key));
        // await KarmaFieldsAlpha.History.write(ids, idsQuery.toArray(), "external", contentDriver, content.toString(), key)); // update history

        // await this.render();


    } else {

      addedItems = string && string.split(",") || [];

      const newIds = [...idsQuery.toArray()];
      newIds.splice(index, length, ...addedIds);

      await this.setIds(newIds);

    }

	}



  getBody() {

    return new KarmaFieldsAlpha.field.gallery({
      sortable: true
    }, "body", this);

  }

  getFooter() {

    return new KarmaFieldsAlpha.field.files.footer(this.resource.footer, "footer", this);

	}

  // getChild(index, ...path) {
  //
  //   if (index === "popup") {
  //
  //
  //   }
  //
  //   let child = this.newChild(index);
  //
  //   if (child && path.length) {
  //
  //     return child.getChild(...path);
  //
  //   }
  //
  //   return child;
  //
  // }

  getPopup() {

    // let resource = KarmaFieldsAlpha.tables[this.resource.table || "medias"];
    //
    // if (resource) {
    //
    //   const constructor = this.getConstructor(resource.type || "table"); // may be medias!
    //
    //   return new constructor(resource, "popup", this);
    //
    // }

    // return new KarmaFieldsAlpha.field.medias(this.resource.popup, "popup", this);


    return this.createChild({
      type: "medias",
      params: {
        parent: 0
      },
      ...this.resource.popup
    }, "popup");

  }

  getDriver() {

    return this.resource.driver || "medias";

  }

  getTable() {

    return this.resource.table || "medias";

  }

  async edit(ids) {

    if (this.resource.uploader === "wp" || this.resource.library === "wp") {

      this.openMediaLibrary(ids);

    } else {

      await super.edit(ids);

    }

  }

  openMediaLibrary() {

    // const rootSelection = KarmaFieldsAlpha.Store.State.getSelection();

    // const selection = await this.getSelection();

    const frame = wp.media({
      title: "Select file",
      button: {
        text: "Use this file"
      },
      library: {
        // post__in: this.getSelectedIds(),
        posts_per_page: this.resource.posts_per_page || 100,
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

      await KarmaFieldsAlpha.rendering;

      // KarmaFieldsAlpha.task = this.insert(attachmentIds);
      await this.insert(attachmentIds);
      await this.setFocus(true);
      await this.render();

    });
    frame.on("open", () => {
      let mediaSelection = frame.state().get("selection");
      const ids = this.getSelectedIds();

      for (let id of ids) {
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


  hasFileSelected() {

    return this.hasSelection();

  }

  // *buildHeader() {
  //
  //
  //
  // }
  //
  // *buildFooter() {
  //
  //   const footer = this.getChild("footer");
  //
  //   if (footer) {
  //
  //     yield footer.build();
  //
  //   }
  //
  // }

  // buildPart(part) {
  //
  //   return KarmaFieldsAlpha.field.table.prototype.buildPart.call(this, part);
  //
  // }

  // *buildPart(part) {
  //
  //   if (part === "header" && this.resource.header) {
  //
  //     yield this.getChild("header").build();
  //
  //   } else if (part === "footer" && this.resource.footer !== false) {
  //
  //     yield this.getChild("footer").build();
  //
  //   } else if (part === "body") {
  //
  //     yield this.getChild("body").build();
  //
  //   }
  //
  //
  //
  // }

  // *buildParts() {
  //
  //   yield {
  //     class: "table-body",
  //     child: this.getChild("body").build()
  //   };
  //
  //   if (this.resource.footer !== false) {
  //
  //     yield {
  //       class: "table-footer table-control",
  //       child: this.getChild("footer").build(),
  //       // update: footer => {
  //       //   const isLoading = this.request("hasTask");
  //       //   footer.element.classList.toggle("loading", Boolean(isLoading));
  //       // }
  //     };
  //
  //   }
  //
  // }
  //
  // build() {
  //
  //   return KarmaFieldsAlpha.field.table.prototype.build.call(this);
  //
  //   // return {
  //   //   class: "table-field",
  //   //   children: [
  //   //     {
  //   //       class: "mixed-content",
  //   //       init: node => {
  //   //         node.element.innerHTML = "[mixed content]";
  //   //       },
  //   //       update: node => {
  //   //         node.element.classList.toggle("hidden", !this.getContent().mixed);
  //   //       }
  //   //     },
  //   //     {
  //   //       class: "karma-field-table",
  //   //       update: node => {
  //   //         node.element.classList.toggle("hidden", Boolean(this.getLength().mixed));
  //   //       },
  //   //       children: [
  //   //         {
  //   //           class: "karma-header table-header table-main-header simple-buttons",
  //   //           children: [...this.buildHeader()], // compat
  //   //           update: header => {
  //   //             header.element.classList.toggle("hidden", !this.resource.header);
  //   //           }
  //   //         },
  //   //         this.getChild("body").build(),
  //   //         {
  //   //           class: "table-footer table-control",
  //   //           children: [...this.buildFooter()], // compat
  //   //           update: footer => {
  //   //             const isLoading = this.request("hasTask");
  //   //             footer.element.classList.toggle("loading", Boolean(isLoading));
  //   //             footer.element.classList.toggle("hidden", !footer.element.hasChildNodes());
  //   //           }
  //   //         }
  //   //       ]
  //   //     }
  //   //   ]
  //   // };
  //
  // }

  // deleteFile() {
  //
  //   return this.delete();
  //
  // }

  // build() {
  //   return {
	// 		class: "karma-gallery karma-field",
  //     update: container => {
  //
  //       container.element.classList.toggle("single", this.isSingle());
  //
  //       const content = this.getContent();
  //
  //       container.element.classList.toggle("loading", Boolean(content.loading));
  //
  //       container.element.ondragover = event => {
  //         event.preventDefault(); // needed for ondrop to work!
  //       }
  //
  //       if (!content.loaded) {
  //
  //         container.children = [
  //           {
  //             class: "gallery",
  //
  //             update: gallery => {
  //
  //               gallery.element.ondrop = event => {
  //                 event.preventDefault();
  //                 const files = event.dataTransfer.files;
  //                 if (files.length) {
  //                   this.setFocus(true);
  //                   this.save("open", "Open medias");
  //                   this.request("open", "medias", {parent: "0"});
  //                   this.addTask(() => this.request("dispatch", "upload", files), "upload");
  //                   this.request("render");
  //                 }
  //                 gallery.element.classList.remove("has-selection");
  //               }
  //               gallery.element.ondragover = event => {
  //                 event.preventDefault();
  //                 gallery.element.classList.add("has-selection");
  //               }
  //               gallery.element.ondragleave = event => {
  //                 event.preventDefault();
  //                 gallery.element.classList.remove("has-selection");
  //               }
  //
  //               // const ids = content.toArray().filter(id => parseInt(id));
  //               const ids = content.toArray();
  //
  //               let selection = this.getSelection();
  //
  //               gallery.element.classList.toggle("empty", ids.length === 0);
  //
  //               gallery.element.classList.toggle("has-selection", Boolean(this.hasFocus()));
  //
  //               gallery.element.ondblclick = event => {
  //
  //                 this.edit();
  //
  //               }
  //
  //
  //
  //               const sorter = new KarmaFieldsAlpha.ListSorterInline(gallery.element, selection);
  //
  //               sorter.onSelect = elements => {
  //
  //                 elements.map(element => element.classList.add("selected"));
  //                 this.setSelection(sorter.state.selection);
  //
  //               }
  //
  //               sorter.onUnselect = elements => {
  //
  //                 elements.map(element => element.classList.remove("selected"));
  //
  //               }
  //
  //               sorter.onSelectionComplete = () => {
  //
  //                 // this.request("deferFocus");
  //                 this.setFocus(true);
  //                 this.request("render");
  //
  //               }
  //
  //               sorter.onSwap = (newState, lastState) => {
  //
  //                 this.swap(lastState.selection.index, newState.selection.index, newState.selection.length);
  //                 this.setSelection(newState.selection);
  //
  //               };
  //
  //               sorter.onSort = (newSelection, lastSelection) => {
  //
  //                 // KarmaFieldsAlpha.History.save("order", "Reorder");
  //                 // this.request("deferFocus");
  //                 this.setFocus(true);
  //                 this.request("render");
  //
  //               }
  //
  //               if (content.mixed) {
  //
  //                 gallery.children = [
  //                   {
  //                     class: "frame",
  //                     update: frame => {
  //                       const isSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, 0);
  //                       frame.element.classList.toggle("selected", Boolean(isSelected));
  //                     },
  //                     child: this.createChild({
  //                       type: "media",
  //                       driver: this.getDriver(),
  //                       mixed: true,
  //                       display: "thumb"
  //                     }, "mixed").build()
  //                   }
  //                 ];
  //
  //               } else {
  //
  //                 const hasFocus = this.hasFocus();
  //
  //                 gallery.children = ids.map((id, rowIndex) => {
  //
  //                   return {
  //                     class: "frame",
  //                     update: frame => {
  //
  //                       const isSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, rowIndex) && hasFocus;
  //
  //                       frame.element.classList.toggle("selected", Boolean(isSelected));
  //                     },
  //                     // child: new KarmaFieldsAlpha.field.text.media({
  //                     //   driver: this.getDriver(),
  //                     //   id: id,
  //                     //   uploading: !id,
  //                     //   display: "thumb",
  //                     //   caption: true
  //                     // }).build()
  //                     child: this.createChild({
  //                       type: "media",
  //                       driver: this.getDriver(),
  //                       id: id,
  //                       // uploading: !id,
  //                       display: "thumb"
  //                       // caption: true
  //                     }, rowIndex).build()
  //                   };
  //                 });
  //
  //               }
  //
  //
  //             }
  //           },
  //           {
  //             class: "controls simple-buttons",
  //             update: controls => {
  //               controls.element.classList.toggle("hidden", this.resource.controls === false);
  //             },
  //             child: {
  //               class: "footer-content",
  //               update: controls => {
  //                 controls.child = this.createChild(this.resource.controls || "controls").build();
  //               }
  //             }
  //           }
  //         ]
  //
  //       }
  //
  //     }
	// 	};
  //
  // }

}

KarmaFieldsAlpha.field.files.footer = class extends KarmaFieldsAlpha.field.group {

  constructor(resource, id, parent) {

    super({
      display: "flex",
      children: [
        "add",
        "edit",
        "remove"
        // {
        //   type: "text",
        //   content: ["debug", ["request", "hasSelection"]]
        // }
      ],
      ...resource
    }, id, parent);

  }

}

// KarmaFieldsAlpha.field.files.footer.test = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource, id, parent) {
//     super({
//       title: "Test",
//       action: "test",
//       ...resource
//     }, id, parent);
//   }
// }
KarmaFieldsAlpha.field.files.footer.add = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      title: "Add",
      text: "Add File",
      action: "open",
      // hidden: ["||", [">=", ["count", ["getContent"]], ["request", "getMax"]], ["isMixed"]],
      hidden: ["||", [">=", ["request", "getLength"], ["request", "getMax"]], ["isMixed", ["getValue"]]],
      ...resource
    }, id, parent);
  }
}
KarmaFieldsAlpha.field.files.footer.remove = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      title: "Remove",
      text: "Remove",
      action: "delete",
      disabled: ["!", ["request", "hasSelection"]],
      // hidden: ["=", ["count", ["getValue"]], 0],
      hidden: ["=", ["request", "getLength"], 0],
      ...resource
    }, id, parent);
  }
}
KarmaFieldsAlpha.field.files.footer.edit = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      text: "Change",
      action: "edit",
      disabled: ["!", ["request", "hasSelection"]],
      // hidden: ["||", ["=", ["count", ["getValue"]], 0], ["isMixed"]],
      hidden: ["||", ["=", ["request", "getLength"], 0], ["isMixed", ["getValue"]]],
      ...resource
    }, id, parent);
  }
}
//
// KarmaFieldsAlpha.field.files.controls.add = {
//   type: "button",
//   title: "Add",
//   text: "Add File",
//   // dashicon: "insert",
//   action: "open",
//   hidden: [">=", ["count", ["getValue"]], ["request", "getMax"]]
// };
//
// KarmaFieldsAlpha.field.files.controls.remove = {
//   type: "button",
//   title: "Remove",
//   text: "Remove",
//   // dashicon: "remove",
//   action: "deleteFile",
//   disabled: ["!", ["request", "hasFileSelected"]],
//   hidden: ["=", ["count", ["getValue"]], 0]
// };
//
// KarmaFieldsAlpha.field.files.controls.edit = {
//   type: "button",
//   text: "Change",
//   // dashicon: "screenoptions",
//   action: "open",
//   disabled: ["!", ["request", "hasFileSelected"]],
//   hidden: ["=", ["count", ["getValue"]], 0]
// }
//

KarmaFieldsAlpha.field.file = class extends KarmaFieldsAlpha.field.files {
  constructor(resource, id, parent) {
    super({
      max: 1,
      width: "auto",
      ...resource
    }, id, parent);
  }
}
