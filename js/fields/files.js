KarmaFieldsAlpha.field.files = class extends KarmaFieldsAlpha.field.tags {

  // constructor(resource) {
  //   super(resource);
  //
  //   this.driver = this.resource.driver || "medias";
  //
  // }

//   setValue(value, ...path) {
// // debugger;
//     super.setValue(value, ...path);
//
//   }

  getDriver() {

    return this.resource.driver || "medias";

  }

  getTable() {

    return this.resource.table || "medias";

  }

  // fetch(table) {
  //
  //   if (this.resource.uploader === "wp" || this.resource.library === "wp") {
  //
  //     this.openMediaLibrary();
  //
  //   } else {
  //
  //     super.fetch();
  //
  //   }
  //
  // }

  edit() {

    if (this.resource.uploader === "wp" || this.resource.library === "wp") {

      this.openMediaLibrary();

    } else {

      super.edit();

    }

  }

  openMediaLibrary() {

    // const rootSelection = KarmaFieldsAlpha.Store.State.getSelection();

    const selection = this.getSelection();

    const frame = wp.media({
      title: "Select file",
      button: {
        text: "Use this file"
      },
      library: {
        // post__in: this.getSelectedIds(),
        posts_per_page: 500,
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
    frame.on("select", () => {

      const attachments = frame.state().get("selection").toJSON();
      const attachmentIds = attachments.map(attachment => attachment.id.toString());

      this.insert(attachmentIds);
      this.setFocus(true);
      this.request("render");

    });
    frame.on("open", () => {
      let mediaSelection = frame.state().get("selection");
      const ids = this.getSelectedIds();
      if (!ids.loading) {
        for (let id of ids.toArray()) {
          mediaSelection.add(wp.media.attachment(id));
        }
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

  deleteFile() {

    return this.delete();

  }

  build() {
    return {
			class: "karma-gallery karma-field",
      update: container => {

        container.element.classList.toggle("single", this.isSingle());

        const content = this.getContent();

        container.element.classList.toggle("loading", Boolean(content.loading));

        container.element.ondragover = event => {
          event.preventDefault(); // needed for ondrop to work!
        }

        if (!content.loaded) {

          container.children = [
            {
              class: "gallery",

              update: gallery => {

                gallery.element.ondrop = event => {
                  event.preventDefault();
                  const files = event.dataTransfer.files;
                  if (files.length) {
                    this.setFocus(true);
                    this.save("open", "Open medias");
                    this.request("open", "medias", {parent: "0"});
                    this.addTask(() => this.request("dispatch", "upload", files), "upload");
                    this.request("render");
                  }
                  gallery.element.classList.remove("has-selection");
                }
                gallery.element.ondragover = event => {
                  event.preventDefault();
                  gallery.element.classList.add("has-selection");
                }
                gallery.element.ondragleave = event => {
                  event.preventDefault();
                  gallery.element.classList.remove("has-selection");
                }

                const ids = content.toArray();

                let selection = this.getSelection();

                gallery.element.classList.toggle("empty", ids.length === 0);

                gallery.element.classList.toggle("has-selection", Boolean(this.hasFocus()));

                gallery.element.ondblclick = event => {

                  this.edit();

                }



                const sorter = new KarmaFieldsAlpha.ListSorterInline(gallery.element, selection);

                sorter.onSelect = elements => {

                  elements.map(element => element.classList.add("selected"));
                  this.setSelection(sorter.state.selection);

                }

                sorter.onUnselect = elements => {

                  elements.map(element => element.classList.remove("selected"));

                }

                sorter.onSelectionComplete = () => {

                  // this.request("deferFocus");
                  this.setFocus(true);
                  this.request("render");

                }

                sorter.onSwap = (newState, lastState) => {

                  this.swap(lastState.selection.index, newState.selection.index, newState.selection.length);
                  this.setSelection(newState.selection);

                };

                sorter.onSort = (newSelection, lastSelection) => {

                  // KarmaFieldsAlpha.History.save("order", "Reorder");
                  // this.request("deferFocus");
                  this.setFocus(true);
                  this.request("render");

                }

                if (content.mixed) {

                  gallery.children = [
                    {
                      class: "frame",
                      update: frame => {
                        const isSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, 0);
                        frame.element.classList.toggle("selected", Boolean(isSelected));
                      },
                      child: this.createChild({
                        type: "media",
                        driver: this.getDriver(),
                        mixed: true,
                        display: "thumb"
                      }, "mixed").build()
                    }
                  ];

                } else {

                  gallery.children = ids.map((id, rowIndex) => {

                    return {
                      class: "frame",
                      update: frame => {

                        const isSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, rowIndex);

                        frame.element.classList.toggle("selected", Boolean(isSelected));
                      },
                      // child: new KarmaFieldsAlpha.field.text.media({
                      //   driver: this.getDriver(),
                      //   id: id,
                      //   uploading: !id,
                      //   display: "thumb",
                      //   caption: true
                      // }).build()
                      child: this.createChild({
                        type: "media",
                        driver: this.getDriver(),
                        id: id,
                        // uploading: !id,
                        display: "thumb"
                        // caption: true
                      }, rowIndex).build()
                    };
                  });

                }


              }
            },
            {
              class: "controls simple-buttons",
              update: controls => {
                controls.element.classList.toggle("hidden", this.resource.controls === false);
              },
              child: {
                class: "footer-content",
                update: controls => {
                  controls.child = this.createChild(this.resource.controls || "controls").build();
                }
              }
            }
          ]

        }

      }
		};

  }

}

KarmaFieldsAlpha.field.files.controls = class extends KarmaFieldsAlpha.field.group {

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

}

KarmaFieldsAlpha.field.files.controls.test = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      title: "Test",
      action: "test",
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.files.controls.add = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      title: "Add",
      text: "Add File",
      action: "add",
      hidden: ["||", [">=", ["count", ["getContent"]], ["request", "getMax"]], ["isMixed"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.files.controls.remove = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      title: "Remove",
      text: "Remove",
      action: "deleteFile",
      disabled: ["!", ["request", "getSelectedIds"]],
      hidden: ["=", ["count", ["getValue"]], 0],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.files.controls.edit = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      text: "Change",
      action: "edit",
      disabled: ["!", ["request", "getSelectedIds"]],
      hidden: ["||", ["=", ["count", ["getValue"]], 0], ["isMixed"]],
      ...resource
    });
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
  constructor(resource) {
    super({...resource, max: 1});
  }
}
