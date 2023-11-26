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

    return this.resource.driver || "medias";

  }

  fetch(table) {

    if (this.resource.uploader === "wp" || this.resource.library === "wp") {

      this.openMediaLibrary();

    } else {

      super.fetch();

    }

  }

  openMediaLibrary() {

    const rootSelection = KarmaFieldsAlpha.Store.State.getSelection();

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

      KarmaFieldsAlpha.Store.State.setSelection(rootSelection); // -> restore modal

      if (selection) {

        this.insert(attachmentIds, selection.index, selection.length);

      } else {

        this.append(attachmentIds);

      }

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

        // container.element.ondrop = async event => {
        //   event.preventDefault();
        //
        //   data.uploads = event.dataTransfer.files.length;
        //
        //   await this.render();
        //
        //   for (let file of event.dataTransfer.files) {
        //
        //     const response = await this.uploadFile(file);
        //
        //     if (response.success) {
        //
        //       const id = response.data.id.toString()
        //       this.append([id]);
        //
        //     }
        //
        //     data.uploads--;
        //
        //     await this.render();
        //
        //   }
        //
        //   this.parent.request("save");
        //
        // }

        if (!content.loaded) {

          container.children = [
            {
              class: "gallery",
              update: gallery => {

                const ids = content.toArray();

                gallery.element.classList.toggle("empty", ids.length === 0);

                gallery.element.classList.toggle("has-selection", Boolean(this.selection));

                gallery.element.ondblclick = event => {

                  this.open();

                }

                const sorter = new KarmaFieldsAlpha.ListSorterInline(gallery.element, this.selection);

                sorter.onSelect = elements => {

                  elements.map(element => element.classList.add("selected"));
                  this.setSelection(sorter.state.selection);

                }

                sorter.onUnselect = elements => {

                  elements.map(element => element.classList.remove("selected"));

                }

                sorter.onSelectionComplete = () => {

                  this.request("deferFocus");
                  this.request("render");

                }

                sorter.onSwap = (newState, lastState) => {

                  this.swap(lastState.selection.index, newState.selection.index, newState.selection.length);
                  this.setSelection(newState.selection);

                };

                sorter.onSort = (newSelection, lastSelection) => {

                  KarmaFieldsAlpha.History.save("order", "Reorder");
                  this.request("deferFocus");
                  this.request("render");

                }

                gallery.children = ids.map((id, rowIndex) => {

                  return {
                    class: "frame",
                    update: frame => {

                      const isSelected = this.selection && KarmaFieldsAlpha.Segment.contain(this.selection, rowIndex);

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
                      driver: this.getDriver(),
                      id: id,
                      uploading: !id,
                      display: "thumb",
                      caption: true
                    }, rowIndex).build()
                  };
                });
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

KarmaFieldsAlpha.field.files.controls = class extends KarmaFieldsAlpha.field.container {

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
      action: "open",
      hidden: [">=", ["count", ["getValue"]], ["request", "getMax"]],
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
      disabled: ["!", ["request", "hasFileSelected"]],
      hidden: ["=", ["count", ["getValue"]], 0],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.files.controls.edit = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      text: "Change",
      action: "open",
      disabled: ["!", ["request", "hasFileSelected"]],
      hidden: ["=", ["count", ["getValue"]], 0],
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
