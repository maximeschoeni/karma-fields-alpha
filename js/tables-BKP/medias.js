

KarmaFieldsAlpha.field.medias = class extends KarmaFieldsAlpha.field.table {

  getDriver() {

    return this.resource.driver || "medias";

  }

  async edit() {

  }

  async add(length = 1, index = undefined, params = {}, data = undefined) {

    params = {...params, filetype: "folder"};

    await super.add(1, index, params, data);

  }

  async upload(files, index) {

    const driver = this.getDriver();
    // let params = this.queryParams();
    //
    // while (params.loading) {
    //
    //   await this.render();
    //   params = this.queryParams();
    //
    // }
    //
    // const paramstring = params.string;

    const params = this.getParams() || {};
    const paramstring = this.getParamstring() || "";

    const body = this.getChild("body");

    let defaults = body.exportDefaults();

    while (defaults.loading) {

      await this.render();
      defaults = body.exportDefaults();

    }

    if (index === undefined) {

      if (body) {

        index = body.getNewFileIndex();

      } else {

        index = 0;

      }

    }

    if (body) {

      await body.select(index, files.length);

    }

    await this.save("insert", "Insert");

    const {page, ppp, order, orderby, ...filters} = params;

    const gen = KarmaFieldsAlpha.server.upload(driver, paramstring, index, files, {...filters, ...defaults.toObject()});

    for await (let token of gen) {

      await this.render();

    }

  }

  async move(index, length, destId) {

    const driver = this.getDriver();
    // let params = this.queryParams();
    //
    // while (params.loading) {
    //
    //   await this.render();
    //   params = this.queryParams();
    //
    // }

    const params = this.getParams() || {};
    const paramstring = this.getParamstring() || "";

    // remove ids
    const originalIds = this.getIds().toArray();

    // const destId = originalIds[destIndex];
    const movedIds = originalIds.slice(index, index+length);
    const newIds = originalIds.filter(id => !movedIds.includes(id));

    KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.server.store, "ids", driver);

    KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, newIds, "ids", driver, paramstring);


    await this.render();

    // clear cache
    await KarmaFieldsAlpha.Database.Queries.remove(driver);
    await KarmaFieldsAlpha.Database.States.remove("queries", driver);


    await KarmaFieldsAlpha.Database.States.set(newIds, "queries", driver, paramstring, "ids");
    await KarmaFieldsAlpha.History.write(newIds, originalIds, "queries", driver, paramstring, "ids");

    const parentKey = KarmaFieldsAlpha.Driver.getAlias(driver, "parent");

    // update vars

    for (let id of movedIds) {

      // await this.setWild(destId, id, "parent"); // just for update history

      const originId = params.parent || "";

      await KarmaFieldsAlpha.Database.Vars.set([destId], driver, id, parentKey);
      await KarmaFieldsAlpha.Database.States.set([destId], "external", driver, id, parentKey);
      await KarmaFieldsAlpha.History.write([destId], [originId], "external", driver, id, parentKey);

    }

    // save changes



    const obj = Object.fromEntries(movedIds.map(id => [id, {[parentKey]: [destId]}]));
    await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, obj);



  }

  // getModal() {
  //
  //   return this.createChild({
  //     type: "modal",
  //     body: {
  //       type: "single",
  //       children: ["description"]
  //     },
  //     ...this.resource.modal
  //   }, "*");
  //
  // }


  getBody() {

    return this.createChild({
      type: "gallery",
			// children: this.resource.children, // compat
      draganddrop: true,

      modal: {
        body: {
          type: "single",
          children: [
            "description",
            // {
            //   type: "text",
            //   content: ["queryValue", "posttypes", ["getValue", "post_type"], "name"]
            // },
            // {
            //   type: "text",
            //   content: ["replace", "% > %", "%", ["queryValue", "posttypes", ["getValue", "post_type"], "name"], ["getValue", "post_title"]],
            //   visible: ["=", "autofolder", ["getValue", "filetype"]]
            // },
            {
              type: "input",
              key: "post_title",
              label: "Name",
              visible: ["=", "folder", ["getValue", "filetype"]]
            },
            {
              type: "textarea",
              key: "post_excerpt",
              label: "Caption",
              height: '3rem',
              visible: ["=", "file", ["getValue", "filetype"]]
            }
          ]
        }
      },
			...this.resource.body
		}, "body");

	}

  getHeader() {

    return this.createChild({
      type: "header",
      title: "Medias",
      children: [
        "title",
        "close"
      ],
      ...this.resource.header
    }, "header");

	}

  getFooter() {

    return this.createChild({
      type: "footer",
      children: [
        "save",
        "upload",
        "add",
        "delete",
        "separator",
        "insert"
      ],
      ...this.resource.footer
    }, "header");

	}

}


KarmaFieldsAlpha.field.gallery = class extends KarmaFieldsAlpha.field.grid {

  // getModal() {
  //
  //   return this.createChild({
  //     type: "modal",
  //     body: {
  //       type: "single",
  //       children: ["description"]
  //     },
  //     ...this.resource.modal
  //   }, "*");
  //
  // }


  getExportableColumns() {

    return [
      {
        // type: "input", // -> type = "group"
        key: "id"
      }
    ];

  }


  getContentAt(index, key) {

    if (index === "exit") {

      switch (key) {
        case "id":
          const id = this.getContent("parent");
          return this.getParent(id.toString());

        case "filetype":
          return new KarmaFieldsAlpha.Content("folder");

        case "filename":
        case "name":
          return new KarmaFieldsAlpha.Content("..");

        default:
          return new KarmaFieldsAlpha.Content("");

      }

    } else if (index === "*" || index === "modal") {

      let selection = this.getSelection() || {};

      const socketsQuery = this.getSockets();

      if (socketsQuery.slice(selection.index || 0, (selection.index || 0)+(selection.length || 0)).some(socket => socket.id === "exit")) {

        const content = new KarmaFieldsAlpha.Content();

        if (length > 1) {

          content.mixed = true;

        } else if (key === "filetype") {

          content.value = "exit";

        }

        return content;

      } else {

        return super.getContentAt(index, key);

      }

    } else {

      return super.getContentAt(index, key);

    }

  }

  setValueAt(content, index, key) {

    if (index !== "exit") {

      return super.setValueAt(content, index, key);

    }

  }

  setContentAt(content, index, key) {

    if (index !== "exit") {

      return super.setContentAt(content, index, key);

    }

  }


  async select(index = 0, length = 0) { // to be overrided (ie. Medias grid)

    for (let socket of this.genSockets()) {

      if (socket.id === index) {

        await this.setSelection({index: socket.index, length});
        break;

      }

    }

  }

  querySelection() {

    const selection = this.getSelection();

    if (selection) {

      const index = selection.index || 0;
      const length = selection.length || 0;

      const socketsQuery = this.getSockets();

      const sockets = socketsQuery.slice(index, index+length).filter(socket => socket.id !== "exit");

      if (sockets.length) {

        return {index: sockets[0].id, length: sockets.length};

      }

    }

    return {index: 0, length: 0};

  }



  getSockets() {

    return [...this.genSockets()];

  }

  *genSockets() {


    const length = this.parent.getLength();
    const parentQuery = this.getContent("parent");

    if (parentQuery.loading) {

      return;

    }

    const parent = parentQuery.toString() || "0";
    let index = 0;

    if (parent.toString() !== "0") {

      yield {
        index: index++,
        id: "exit",
        filetype: "folder"
      };

    }

    for (let i = 0; i < length; i++) {

      // const itemParent = this.getContentAt(i, "parent").toString() || "0";
      const filetype = this.getContentAt(i, "filetype");
      // const id = this.getContentAt(i, "id").toString();

      // if (itemParent === parent) {

        yield {
          id: i,
          index: index++,
          filetype: filetype.toString()
        };

      // }

    }

  }




  // queryItems() {
  //
  //
  //   const query = super.queryItems();
  //   const parent = this.parent.getContent("parent").toString() || "0";
  //
  //   if (!query.loading) {
  //
  //     query.value = query.toArray().map(item => {
  //
  //       const parent = this.getContent(item.index, "parent").toString() || "0";
  //       const filetype = this.getContent(item.index, "filetype").toString();
  //       let order;
  //
  //       if (item.uploading) {
  //
  //         order = 3;
  //
  //       } else if (item.adding) {
  //
  //         order = 1;
  //
  //       } else if (filetype === "folder") {
  //
  //         order = 2;
  //
  //       } else if (filetype === "file") {
  //
  //         order = 4;
  //
  //       } else {
  //
  //         order = 2;
  //
  //       }
  //
  //       return {...item, parent, filetype, order};
  //     });
  //
  //     query.value = query.toArray().filter(item => item.parent === parent);
  //
  //     query.value.sort((a, b) => a.order - b.order);
  //
  //     if (!this.isRoot()) {
  //
  //       const grandParent = this.queryUpperFolderId();
  //
  //       query.value = [
  //         {
  //           index: "exit",
  //           id: grandParent.toString() || "0",
  //           order: 0
  //         },
  //         ...query.toArray()
  //       ];
  //
  //     }
  //
  //   }
  //
  //   return query;
  //
  // }

  getLength() {

    return this.getSockets().length;

  }

  getNewItemIndex() {

    for (let socket of this.genSockets()) {

      if (socket.filetype === "file") {

        return socket.id;

      }

    }

    return this.getLength() - 1;

  }

  getNewFileIndex() {

    return this.parent.getLength();

  }

  async openFolder(socket) {

    if (socket.filetype === "folder" || socket.filetype === "autofolder") {

      if (socket.id === "exit") {

        await this.save(`open`, "Upper Directory");

        const parent = this.getContent("parent");

        let id = this.getParent(parent.toString());

        while (id.loading) {

          await this.render();
          id = this.getParent(parent.toString());

        }

        await this.setValue(id.toString() || "0", "parent");

        await this.removeSelection();


      } else {

        await this.save(`open`, "Open Directory");

        const id = this.getContentAt(socket.id, "id");

        await this.setValue(id.toString() || "0", "parent");

        await this.removeSelection();

      }

    }

  }

  getParent(id) {

    if (id && id !== "0") {

      const driver = this.getDriver();

      return this.getWild(driver, id, "parent");

    } else {

      return new KarmaFieldsAlpha.Content("0");

    }

  }


  async move(sockets, targetSocket) {

    if (targetSocket.filetype === "folder" || targetSocket.filetype === "autofolder") {

      await this.removeSelection();

      if (targetSocket.id === "exit") {

        await this.save("move", "Move upper");

        const id = this.getContent("parent");

        let parent = this.getParent(id.toString());

        while (parent.loading) {

          await this.render();
          parent = this.getParent(id.toString());

        }

        await this.parent.move(sockets[0].id, sockets.length, parent.toString());

      } else {

        await this.save("move", "Move to Folder");

        const id = this.getContentAt(targetSocket.id, "id");

        // destId = id;

        await this.parent.move(sockets[0].id, sockets.length, id.toString());

      }

    }


  }


  // *upload(files, index) {
  //
  //   if (!this.parent.shuttle) {
  //
  //     return;
  //
  //   }
  //
  //   let defaults = this.parent.getDefaultParams();
  //
  //   while (defaults.loading) {
  //
  //     yield;
  //     defaults = this.parent.getDefaultParams();
  //   }
  //
  //   let filters = this.parent.getFilters();
  //
  //   while (filters.loading) { // should never happens since this.params is loaded now !
  //
  //     yield;
  //     filters = this.parent.getFilters();
  //   }
  //
  //   const params = {...filters.toObject(), ...defaults.toObject()};
  //
  //   if (index === undefined) {
  //
  //     index = this.getNewItemIndex();
  //
  //   }
  //
  //   this.save("insert", "Insert");
  //
  //   // set.add(params, index, length);
  //   const tokens = this.parent.shuttle.add(params, index, length);
  //
  //   yield* body.create(index, length);
  //
  //   this.select(index, length);
  //
  //   // const work = this.shuttle.loadTokens(tokens, params);
  //   //
  //   // KarmaFieldsAlpha.Jobs.add(work);
  //
  // }



  // getUploadIndex() {
  //
  //   return this.parent.getLength().toNumber();
  //
  // }
  //
  // upload(files) {
  //
  //   const index = this.getUploadIndex();
  //
  //   this.save("upload", "Upload");
  //
  //   this.uploadAt(files, index);
  //
  //
  //   const uploadedIndex = this.queryItems().toArray().findLastIndex(item => item.uploading);
  //
  //   if (uploadedIndex > -1) {
  //
  //     this.setSelection({index: uploadedIndex, length: 1});
  //
  //   }
  //
  //
  //   this.request("render");
  //
  // }
  //
  // uploadAt(files, index) { // index is relative to collection !
  //
  //   const collection = this.getCollection();
  //   const defaults = this.parse(this.resource.defaults || {});
  //   const filters = this.getFilters();
  //
  //
  //
  //   if (defaults.loading || filters.loading) {
  //
  //     console.warn("procrastinating uploadAt");
  //
  //     this.procrastinate("uploadAt", files, index);
  //
  //   } else {
  //
  //     const params = {...filters.toObject(), ...defaults.toObject()};
  //
  //     collection.upload(files, params, index);
  //
  //     let query = this.queryItems();
  //
  //     let items = query.toArray().filter(item => item.index >= index && item.index < index + files.length);
  //
  //     for (let item of items) {
  //
  //       const field = this.createChild({
  //         type: "row",
  //         children: this.resource.children,
  //       }, item.index);
  //
  //       field.create();
  //
  //       if (this.resource.modal) {
  //
  //         const field = this.createChild({
  //           type: "row",
  //           children: this.resource.modal.children,
  //         }, item.index);
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



  // remove(collectionIndex, length = 1) {
  //
  //   if (collectionIndex !== "exit") {
  //
  //     super.remove(collectionIndex, length);
  //
  //   }
  //
  // }


  // changeFile(file, id) {
  //
  //   this.upload([file], {id: id});
  //
  // }
  //
  // regen() {
  //
  //   const ids = this.getSelectedItems().filter(item => !item.exit).map(item => item.id).filter(id => id);
  //   const driver = this.getDriver();
  //
  //   if (ids.length) {
  //
  //     KarmaFieldsAlpha.Query.regen(driver, ids);
  //
  //   }
  //
  //   this.render();
  // }
  //
  // async uploadFromUrl(url) {
  //
  //   // url = "https://upload.wikimedia.org/wikipedia/commons/6/65/Schwalbenschwanz-Duell_Winterthur_Schweiz.jpg";
  //   const response = await fetch(url);
  //   const blob = await response.blob();
  //   const filename = url.split('/').pop();
  //
  //   // const file = new File([blob], filename, {type: "image/jpg"});
  //   const file = new File([blob], filename);
  //   // const [fileId] = await this.upload([file]);
  //   this.upload(file);
  //
  // }




  // isFolderAt(index) {
  //
  //   const query = this.getContentAt(index, "filetype");
  //
  //   return (query.toString() === "folder" || query.toString() === "exit");
  //
  // }

  *buildThumbnails() {

    const selection = this.getSelection();
    const hasFocus = this.hasFocus();
    const sockets = this.genSockets();





    //
    // for (let socket of this.genSockets()) {


    for (let socket of sockets) {

      yield {
        tag: "li",
        class: "frame",
        update: li => {

          li.element.classList.remove("drop-active");
          li.element.classList.toggle("selected", Boolean(hasFocus && KarmaFieldsAlpha.Segment.contain(selection, socket.index)));
          li.element.classList.toggle("media-dropzone", (socket.filetype === "folder" || socket.filetype === "autofolder"));
          li.element.classList.toggle("droppable", socket.id !== "exit" && socket.filetype !== "autofolder");

          li.element.ondblclick = async event => {
            if (socket.filetype === "folder" || socket.filetype === "autofolder") {
              await this.openFolder(socket);
              await this.render();
            } else { // -> edit image in files field
              this.setSelection({index: socket.index, length: 1});
              await this.request("edit");
              await this.render();
            }
          }

          const row = this.createChild({
            type: "row",
          }, socket.id);

          const media = row.createChild({
            type: "media",
            display: "thumb",
            exit: socket.id === "exit"
            // loading: item.loading,
            // uploading: item.uploading
          }, "media");

          li.child = media.build();

        }

      };

    }

  }

  buildBody() {

    return {
      class: "media-table-container",
      init: node => {
        node.element.ondrop = async event => {
          event.preventDefault();
          // debugger;
          const files = event.dataTransfer.files;
          if (files.length) {
            await this.request("upload", files);
            await this.render();
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
        if (this.parent.id === "popup") {
          node.element.classList.add("scroll-container");
        }
      },
      update: node => {
        // node.element.classList.toggle("has-selection", Boolean(this.hasFocus()));
      },
      child: {
        class: "media-table",
        tag: "ul",
        init: grid => {
          if (this.resource.style) {
            grid.element.style = this.resource.style;
          }
        },
        update: grid => {

          const sockets = this.getSockets();
          const hasFocus = this.hasFocus();
          const selection = hasFocus && this.getSelection();

          if (this.resource.draganddrop) {

            const dropZones = sockets.filter(socket => (socket.filetype === "folder" || socket.filetype === "autofolder")).map(socket => socket.index);
            const selector = new KarmaFieldsAlpha.Handler.DragAndDrop(grid.element, selection, dropZones);

            selector.onSelect = elements => {
              elements.map(element => element.classList.add("selected"));
              this.setSelection(selector.state.selection);
            }

            selector.onUnselect = elements => {
              elements.map(element => element.classList.remove("selected"));
            }

            selector.onSelectionComplete = async () => {
              await this.setFocus(true);
              await this.request("render");

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

            selector.ondrop = async (index, selection) => {
              const slice = sockets.slice(selector.state.selection.index, selector.state.selection.index + selector.state.selection.length);
              const target = sockets[index];
              console.log(slice);
              if (slice.every(socket => socket.id !== "exit" && socket.filetype !== "autofolder")) {

                await this.move(slice, target);
              }
              await this.setFocus(true);
              await this.render();
            };

            selector.onCancelDrag = async () => {
              await this.setFocus(true);
              await this.request("render");
            }

          } else if (this.resource.sortable) {

            const sorter = new KarmaFieldsAlpha.ListSorterInline(grid.element, selection);

            sorter.onSelect = elements => {

              elements.map(element => element.classList.add("selected"));
              this.setSelection(sorter.state.selection);
            }

            sorter.onUnselect = elements => {

              elements.map(element => element.classList.remove("selected"));

            }

            sorter.onSelectionComplete = async () => {

              await this.setFocus(true);
              await this.request("render");

            }

            sorter.onSwap = async (newState, lastState) => {

              await this.parent.swap(lastState.selection.index, newState.selection.index, newState.selection.length);
              await this.setSelection(newState.selection);

            };

            sorter.onSort = async (newSelection, lastSelection) => {

              if (KarmaFieldsAlpha.DeepObject.differ(newSelection, lastSelection)) {

                await this.setFocus(true);
                await this.request("render");

              }


            }

          }




          // grid.element.classList.toggle("has-selection", Boolean(this.hasFocus()));

            // grid.children = items.map((item, index) => {
            //   return {
            //     tag: "li",
            //     class: "frame",
            //     update: li => {
            //
            //       li.element.classList.remove("drop-active");
            //       li.element.classList.toggle("selected", KarmaFieldsAlpha.Segment.contain(selection, index));
            //       li.element.classList.toggle("media-dropzone", Boolean(item.exit || this.isFolderAt(index)));
            //
            //       li.element.ondblclick = event => {
            //         const query = this.getContent(item.index, "filetype");
            //         if (query.toString() === "folder" || query.toString() === "exit") {
            //           this.openFolder(item.index);
            //         }
            //       }
            //
            //       const row = this.createChild({
            //         type: "row",
            //       }, item.index);
            //
            //       const media = row.createChild({
            //         type: "media",
            //         // id: item.id,
            //         // driver: this.getDriver(),
            //         display: "thumb",
            //         exit: item.index === "exit",
            //         loading: item.loading,
            //         uploading: item.uploading
            //       }, item.index);
            //
            //       li.child = media.build();
            //
            //     }
            //
            //   };
            // });

          // }

          // const selection = this.getSelection();
          // const hasFocus = this.hasFocus();
          //
          // for (let socket of this.genSockets()) {

          // grid.children = [...this.buildThumbnails()];

        },
        children: [...this.buildThumbnails()]
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
                // this.parent.request("body", "upload", files);

                await this.parent.request("upload", files);
                await this.render();
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

KarmaFieldsAlpha.field.gallery.description = class extends KarmaFieldsAlpha.field {

  build() {
    return {
      class: "karma-field karma-field-container media-description",
      update: container => {

        // const query = this.request("querySelectedItems");
        //
        // // const item = items.toSingle();
        // const loading = query.loading;
        // const mixed = query.toArray().length > 1;
        // // const exit = item && item.exit;
        // // const id = item && item.id;
        // const uploading = query.toObject().uploading;
        // const adding = query.toObject().adding;

        // const token = item && item.token; //

        container.children = [

          this.createChild({
            type: "media",
            width: "100%",
            height: "15em",
            // loading: loading,
            // uploading: uploading,
            // token: token, // not implemented
            // mixed: mixed,
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

KarmaFieldsAlpha.field.gallery.description.imageDescription = class extends KarmaFieldsAlpha.field.group {

  constructor(resource, id, parent) {

    super({
      children: [
        "fileDescription",
        "sizeDescription",
        "resolutionDescription",
        "dateDescription",
        "multipleDescription"
      ],
      ...resource
    }, id, parent);

  }

}

KarmaFieldsAlpha.field.gallery.description.fileType = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["getValue", "filetype"],
      ...resource
    }, id, parent);
  }
}


KarmaFieldsAlpha.field.gallery.description.mimeType = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["getValue", "mimetype"],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.dateDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["date", ["getValue", "upload-date"], {year: "numeric", month: "long", day: "2-digit"}],
      hidden: ["||", ["isMixed", ["getValue", "upload-date"]], ["!", ["getValue", "upload-date"]], ["=", ["getValue", "filetype"], "folder"]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.sizeDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["?", [">", ["getValue", "size"], 1000], ["replace", "% KB", "%", ["math", "floor", ["/", ["getValue", "size"], 1000]]], ["replace", "% B", "%", ["getValue", "size"]]],
      hidden: ["||", ["isMixed", ["getValue", "size"]], ["!", ["getValue", "size"]], ["=", ["getValue", "filetype"], "folder"]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.resolutionDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["replace", "% x % pixels", "%", ["getValue", "width"], ["getValue", "height"]],
      visible: ["&&", ["like", ["getValue", "mimetype"], "^image/.*$"], ["!", ["isMixed", ["getValue", "width"]]], ["!", ["isMixed", ["getValue", "height"]]]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.fileDescription = class extends KarmaFieldsAlpha.field.link {
  constructor(resource, id, parent) {
    super({
      style: "word-break: break-word",
      content: ["getValue", "filename"],
      href: ["replace", `${KarmaFieldsAlpha.uploadURL}#/#`, "#", ["getValue", "dir"], ["getValue", "filename"]],
      target: "_blank",
      // hidden: ["||", ["=", ["getIds"], "0"], ["isMixed", ["getValue", "filename"]], ["!", ["getValue", "filename"]]],
      hidden: ["||", ["isMixed", ["getValue", "filename"]], ["!", ["getValue", "filename"]]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.multipleDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: "[Mixed files]",
      visible: ["isMixed", ["getValue", "filename"]],
      ...resource
    }, id, parent);
  }
}
KarmaFieldsAlpha.field.gallery.description.folderName = class extends KarmaFieldsAlpha.field.input {
  constructor(resource, id, parent) {
    super({
      type: "input",
      label: "Folder name",
      key: "name",
      visible: ["&&", ["!", ["getValue", "mimetype"]], ["!", ["isMixed", ["getValue", "mimetype"]]]],
      ...resource
    }, id, parent);
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

KarmaFieldsAlpha.field.medias.add = class extends KarmaFieldsAlpha.field.table.add {
  constructor(resource, id, parent) {
    super({
      text: "Create Folder",
      title: "Create Folder",
      ...resource
    }, id, parent)
  }
}


// KarmaFieldsAlpha.field.medias.header = class extends KarmaFieldsAlpha.field.container.header {
//
//   constructor(resource, id, parent) {
//
//     super({
//       display: "flex",
//       children: [
//         "title",
//         "close"
//       ],
//       ...resource
//     }, id, parent);
//
//   }
//
// }

KarmaFieldsAlpha.field.medias.title = class extends KarmaFieldsAlpha.field.container.title {

  // constructor(resource, id, parent) {
  //
  //   super({
  //     tag: "h1",
  //     style: "flex-grow:1",
  //     class: "ellipsis",
  //     content: "Title",
  //     ...resource
  //   }, id, parent);
  //
  // }


  // getContent() {
  //
	// 	return this.queryLabel();
  //
  //   let parent = this.getParam("parent");
  //
  //   console.log(parent);
  //
  //
  //   return 'XX';
  //
  //
  // }

    getAncestors(id) {

      const ancestors = new KarmaFieldsAlpha.Content([]);

      const driver = this.getDriver();

      while (id && id !== "0") {

        const name = this.getWild(driver, id, "name");

        if (name.laoding) {

          ancestors.loading = true;
          break;

        } else {

          ancestors.value.unshift({
            id: id,
            name: name.toString()
          });

        }

        const parent = this.getWild(driver, id, "parent");

        if (parent.loading) {

          ancestors.loading = true;
          break;

        } else {

          id = parent.toString();

        }

      }

      ancestors.value.unshift({
        id: "0",
        name: 'Medias'
      });

      return ancestors;
    }

  build() {

    return {
      tag: "h1",
      class: "text",
      child: {
        tag: "ul",
        class: "breadcrumb ellipsis",
        init: node => {
          node.element
        },
        update: node => {

          let id = this.getParam("parent");

          const ancestors = this.getAncestors(id);

          if (!ancestors.loading) {
            node.children = ancestors.toArray().map(ancestor => {
              return {
                tag: "li",
                child: {
                  tag: "a",
                  update: node => {
                    node.element.innerHTML = ancestor.name;
                    node.element.classList.toggle("active", id !== ancestor.id);
                    node.element.onclick = async event => {
                      event.preventDefault();
                      await this.save("open", "Upper Directory");
                      await this.setParam(ancestor.id, "parent");
                      await this.removeSelection();
                      await this.render();
                    }
                  }
                }
              }
            });
          }






          // node.element.innerHTML = "X";
        }
      }
    }

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
