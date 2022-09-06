KarmaFieldsAlpha.fields.gallery = class extends KarmaFieldsAlpha.fields.field {

  constructor(resource) {
    super(resource);

    this.uploader = this.createUploader(resource);
    this.clipboard = new KarmaFieldsAlpha.Clipboard();

  }

  async openLibrary() {

    const ids = await this.getArray();
    let selectedIds = [];

    if (this.selection && this.selection.length) {

      selectedIds = ids.slice(this.selection.index, this.selection.index + this.selection.length);

    }

    if ((this.resource.uploader || this.resource.library)  === "wp") {

      this.uploader.open(selectedIds);

    } else {

      // const index = this.selection && this.selection.index;
      // const length = this.selection && this.selection.length;

      const {index: index, length: length} = this.selection || {index: this.resource.insertAt || 99999, length: 0};

      await this.parent.request({
        action: "fetch",
        params: {
          table: this.resource.table || "medias",
          selection: selectedIds.join(","),
          parent: this.resource.parent
        },
        callback: async inputIds => {

          await this.insert(inputIds, index, length);
          //
          // const insertIds = [...ids];
          //
          // if (length) {
          //
          //   insertIds.splice(index, length, ...inputIds);
          //
          //   // this.selection = null; //inputIds.length && {index: this.selection.index, length: inputIds.length} || null;
          //
          // } else if (inputIds.length) {
          //
          //   insertIds.push(...inputIds);
          //
          // }
          //
          // await this.parent.request("set", {data: insertIds}, this.getKey());

        }
      });

      // console.log("fetch response", request);
      //
      // const inputIds = KarmaFieldsAlpha.Type.toArray([...request.data]);
      //
      //
      //
      // const ids = await this.getArray();
      // const insertIds = [...ids];
      //
      // if (this.selection) {
      //
      //   insertIds.splice(this.selection.index, this.selection.length, ...inputIds);
      //
      //   this.selection = null; //inputIds.length && {index: this.selection.index, length: inputIds.length} || null;
      //
      // } else if (inputIds.length) {
      //
      //   insertIds.push(...inputIds);
      //
      // }
      //
      // // KarmaFieldsAlpha.History.save();
      //
      // await this.dispatch({
      //   action: "set",
      //   data: insertIds
      // });
      //
      // await this.dispatch({
      //   action: "render"
      // });



    }

  }

  async export(keys = []) {
    const object = {};
		const key = this.getKey();
    if (keys.length === 0 || keys.includes(key)) {
      const response = await this.parent.request("get", {}, key);
      const ids = KarmaFieldsAlpha.Type.toArray(response);
			object[key] = ids.join(",");
		}
    return object;
	}

	async import(object) {

    // -> todo: import from url

		const key = this.getKey();
    const string = KarmaFieldsAlpha.Type.toString(object[key]);
    const ids = string.split(",").map(item => item.trim());

    await this.parent.request("set", {data: ids}, key);
	}

  async getSelectedIds() {

    if (this.selection) {

      const key = this.getKey();
  		const response = await this.parent.request("get", {}, key);
      const ids = KarmaFieldsAlpha.Type.toArray(response);

      return ids.slice(this.selection.index, this.selection.length);

    }

    return [];
  }

  async input(inputIds) {

    // const ids = await this.getArray();
    // const insertIds = [...ids];

    const {index: index, length: length} = this.selection || {index: this.resource.insertAt || 99999, length: 0};


    // if (this.selection || inputIds.length) {
    //
    //   if (this.selection) {
    //
    //     insertIds.splice(this.selection.index, this.selection.length, ...inputIds);
    //
    //     this.selection = null; //inputIds.length && {index: this.selection.index, length: inputIds.length} || null;
    //
    //   } else if (inputIds.length) {
    //
    //     insertIds.push(...inputIds);
    //
    //   }

      KarmaFieldsAlpha.History.save();

      await this.insert(inputIds, index, length);

      // await this.dispatch({
      //   action: "set",
      //   data: insertIds
      // });
      //
      // await this.dispatch({
      //   action: "render"
      // });

      await this.parent.request("render");

    // }

  }

  async swap(index, length, target) {

    if (target !== index) {

      this.selection = null;

      const key = this.getKey();
      const response = await this.parent.request("get", {}, key);
      const ids = KarmaFieldsAlpha.Type.toArray(response);
      const newIds = [...ids];
      newIds.splice(target, 0, ...newIds.splice(index, length));

      KarmaFieldsAlpha.History.save();

      await this.parent.request("set", {data: newIds}, key);
      await this.parent.request("render");

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

  async request(subject, content, ...path) {

    switch(subject) {

      case "add":
        await this.openLibrary([]);
        break;

      case "edit": {
        const ids = await this.getSelectedIds();
        await this.openLibrary(ids);
        break;
      }

      case "delete": {
        if (this.selection) {
          KarmaFieldsAlpha.History.save();
          await this.insert([], this.selection.index, this.selection.length);
          await this.parent.request("render");
        }
        break;
      }

      case "selection": {
        if (this.selection && this.selection.length) {
          return this.selection;
        }
        break;
      }

      case "max": {
        return this.getMax();
      }

      case "edit-selection": {
        await this.renderControls();
        break;
      }

      default: {
        const key = this.getKey();
        return this.parent.request(subject, content, key, ...path);
      }

    }

    return event;
  }

  async getIds() {
    const key = this.getKey();
    const response = await this.parent.request("get", {}, key);
    return KarmaFieldsAlpha.Type.toArray(response);
  }

  async add(ids) {
    return this.insert(ids, 99999, 0);
  }

  async insert(ids, index, length) {

    const key = this.getKey();
    const response = await this.parent.request("get", {}, key);
    const values = KarmaFieldsAlpha.Type.toArray(response);
    const clones = [...values];

    clones.splice(index, length || 0, ...ids);

    const slice = clones.slice(0, this.getMax());

    await this.parent.request("set", {data: slice}, key);

  }

  createUploader(resource) {
    const uploader = {};
    uploader.addFrame = null;
    uploader.open = (imageIds) => {
      uploader.imageIds = imageIds || [];
      if (!uploader.addFrame) {
        uploader.addFrame = wp.media({
          title: "Select file",
          button: {
            text: "Use this file"
          },
          library: {
            type: resource.file && (resource.file.type || resource.file.types)
              || resource.mime_types
              || resource.mimeTypes
              || resource.mimetypes
              || resource.mimeType
              || resource.mimetype
              || resource.mime_type
              || "image" //'application/font-woff'
          },
          multiple: this.getMax() > 1 ? true : false
        });
        uploader.addFrame.on("select", async () => {
          const attachments = uploader.addFrame.state().get("selection").toJSON();
          const attachmentIds = attachments.map(attachment => attachment.id.toString());
          uploader.imageIds = attachmentIds; //.map(id => id.toString());
          // await this.setArray(attachmentIds);

          KarmaFieldsAlpha.History.save();

          if (this.editSelection) {


            await this.insert(attachmentIds, this.editSelection.index, this.editSelection.length);
            this.editSelection = null;
          } else {
            await this.add(attachmentIds);
          }
          // await this.render();
          await this.dispatch({action: "render"});
        });
        uploader.addFrame.on("open", () => {
          let selection = uploader.addFrame.state().get("selection");
          for (let id of uploader.imageIds) {
            selection.add(wp.media.attachment(id));
          }
        });
      }
      uploader.addFrame.open();
    }
    return uploader;
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
        this.render = container.render;
			},
      update: async container => {

        container.element.classList.toggle("single", this.isSingle());

        const array = await this.getIds();

        const ids = array.map(id => id.toString()).slice(0, this.getMax());

        const store = new KarmaFieldsAlpha.Store(this.resource.driver || "medias", this.resource.joins || ["files"]);

        if (ids.length) {
          await store.query("ids="+ids.join(","));
        }

        this.clipboard.onInput = async dataArray => {

          const inputIds = dataArray.map(row => row[0]);
          const {index: index, length: length} = this.selection || {index: this.resource.insertAt || 99999, length: 0};

          KarmaFieldsAlpha.History.save();

          await this.insert(inputIds, index, length);
          await this.parent.request("render");

        }

        container.children = [
          {
            class: "gallery",
            init: async gallery => {
              gallery.element.tabIndex = -1;
              gallery.element.onfocus = event => {
                this.clipboard.set("");
              }
              this.clipboard.ta.onfocus = event => {
                gallery.element.classList.add("focus");
              }
              this.clipboard.ta.onblur = event => {
                gallery.element.classList.remove("focus");
                if (this.selection) {
                  this.selection.kill();
                  this.render();
                }
              }
            },
            update: async gallery => {

              gallery.element.ondblclick = event => {
                this.openLibrary([]);
              }

              gallery.children = ids.map((id, rowIndex) => {
                return {
                  class: "frame",
                  update: async frame => {

                    frame.element.classList.remove("selected");

                    frame.element.onmousedown = async event => {

                      if (event.buttons === 1) {

                        if (this.selection && KarmaFieldsAlpha.Segment.contains(this.selection, rowIndex)) {

                          const sorter = new KarmaFieldsAlpha.Sorter(event, this.selection, rowIndex);

                          await sorter.sort();

                          if (sorter.selection.index !== sorter.index) {

                            await this.swap(sorter.index, this.selection.length, this.selection.index);

                            sorter.selection.kill();

                          }

                        } else {

                          this.selection = new KarmaFieldsAlpha.Selection(event, gallery.element, [...gallery.element.children], 1, ids.length, 0, rowIndex, this.selection);

                          await this.selection.select();

                          const selectedIds = ids.slice(this.selection.index, this.selection.index + this.selection.length);

                          this.clipboard.setData(selectedIds.map(id => [id]));

                          if (this.renderControls) {
                            await this.renderControls();
                          }

                        }

                      }

                    }

                    frame.element.classList.add("loading");

                    const thumb = await store.getValue(id, "thumb").then(value => KarmaFieldsAlpha.Type.toObject(value));
                    const type = await store.getValue(id, "type").then(value => KarmaFieldsAlpha.Type.toString(value));

                    frame.element.classList.remove("loading");

                    frame.children = [
                      {
                        tag: "figure",
                        update: figure => {

                          const [mediaType] = type.split("/");

                          figure.element.classList.toggle("dashicons", !thumb);
                          figure.element.classList.toggle("dashicons-media-video", !thumb && mediaType === "video");
                          figure.element.classList.toggle("dashicons-media-audio", !thumb && mediaType === "audio");
                          figure.element.classList.toggle("dashicons-media-text", !thumb && mediaType === "text");
                          figure.element.classList.toggle("dashicons-media-document", !thumb && type === "application/pdf");
                          figure.element.classList.toggle("dashicons-media-default", !thumb && mediaType !== "video" && mediaType !== "audio" && mediaType !== "text" && type !== "application/pdf");


                          if (thumb) {
                            figure.children = [{
                              tag: "img",
                              update: image => {
                                image.element.src = KarmaFieldsAlpha.uploadURL+"/"+thumb.filename;
                                image.element.width = thumb.width;
                                image.element.height = thumb.height;
                              }
                            }];
                            figure.element.classList.toggle("type-image", type.startsWith("image") || false);
                          } else {
                            figure.children = [];
                          }
                        }
                      }
                    ];
                  }
                };
              });
            }
          },
          {
            class: "controls",
            init: controls => {
              this.renderControls = controls.render;

              controls.element.onmousedown = event => {
                event.preventDefault(); // -> prevent losing focus on selected items
              }
            },
            update: controls => {
              if (this.resource.controls !== false) {
                controls.child = this.createChild(this.resource.controls || "controls").build();
              }
            }
          }
        ]
      }
		};

  }

  static controls = class extends KarmaFieldsAlpha.fields.group {

    constructor(resource, ...args) {

      super({
        ...{
          id: "controls",
          display: "flex",
          children: [
            "add",
            "remove",
            "edit"
          ]
        },
        ...resource
      }, ...args);

    }

    static test = {
      type: "button",
      title: "Test",
      action: "test"
    }

    static add = {
      type: "button",
      title: "Add",
      action: "add",
      hidden: [">=", ["count", ["get", "array"]], ["request", "max", "number"]]
    }

    static remove = {
      type: "button",
      title: "Remove",
      action: "delete",
      disabled: ["!", ["selection"]],
      hidden: ["empty", ["get", "array"]]
    }

    static edit = {
      type: "button",
      title: "Change",
      action: "edit",
      disabled: ["!", ["selection"]],
      hidden: ["empty", ["get", "array"]]
    }

  }


}
