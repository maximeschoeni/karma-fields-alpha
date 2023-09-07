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

  fetch(table) {

    if (this.resource.uploader === "wp" || this.resource.library === "wp") {

      this.openMediaLibrary();

    } else {

      // this.parent.request("fetch", this.resource.table || "medias");
      super.fetch(table || this.resource.table ||  "medias");

    }

  }

  openMediaLibrary() {

    const rootSelection = KarmaFieldsAlpha.Store.getSelection();

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

      KarmaFieldsAlpha.Store.setSelection(rootSelection); // -> restore modal

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

  // getIcon(id) {
  //
  //   if (id === null) {
  //
  //     return "upload";
  //
  //   } else if (id === KarmaFieldsAlpha.exit) {
  //
  //     return "exit";
  //
  //   } else if (id === KarmaFieldsAlpha.mixed) {
  //
  //     return "mixed";
  //
  //   } else {
  //
  //     const driver = this.getDriver();
  //     let [mimetype] = KarmaFieldsAlpha.Query.getValue(driver, id, "mimetype") || [KarmaFieldsAlpha.loading];
  //     let [filetype] = KarmaFieldsAlpha.Query.getValue(driver, id, "filetype") || [KarmaFieldsAlpha.loading];
  //
  //     // console.log(id, mimetype, filetype);
  //
  //     if (mimetype !== undefined && filetype !== undefined) {
  //
  //       if (mimetype === KarmaFieldsAlpha.loading || filetype === KarmaFieldsAlpha.loading) {
  //
  //         return "upload";
  //
  //       } else if (filetype === "folder") {
  //
  //         return "folder";
  //
  //       } else if (mimetype.startsWith("image")) {
  //
  //         return "image";
  //
  //       } else if (mimetype.startsWith("video")) {
  //
  //         return "video";
  //
  //       } else if (mimetype.startsWith("audio")) {
  //
  //         return "audio";
  //
  //       } else if (mimetype.startsWith("text")) {
  //
  //         return "text";
  //
  //       } else if (mimetype === "application/pdf") {
  //
  //         return "document";
  //
  //       } else if (mimetype === "application/zip") {
  //
  //         return "zip";
  //
  //       } else {
  //
  //         return "default";
  //
  //       }
  //
  //     } else {
  //
  //       return "notfound";
  //
  //     }
  //
  //   }
  //
  // }
  //
  // getFile(id) {
  //
  //   if (id && typeof id !== "symbol") {
  //
  //     const driver = this.getDriver();
  //
  //     let [mimetype] = KarmaFieldsAlpha.Query.getValue(driver, id, "mimetype") || [];
  //     let [filename] = KarmaFieldsAlpha.Query.getValue(driver, id, "filename") || [];
  //     let [dir] = KarmaFieldsAlpha.Query.getValue(driver, id, "dir") || [];
  //
  //
  //     if (filename !== undefined && mimetype !== undefined && dir !== undefined) {
  //
  //       // filename = filename[0] || "";
  //       // mimetype = mimetype[0] || "";
  //       // dir = dir[0] || "";
  //
  //
  //
  //
  //       if (mimetype === "image/jpeg" || mimetype === "image/png") {
  //
  //         let sizes = KarmaFieldsAlpha.Query.getValue(driver, id, "sizes");
  //
  //         if (sizes) {
  //
  //           const thumb = sizes.find(size => size.name === "thumbnail");
  //
  //           if (thumb) {
  //
  //             return dir+"/"+thumb.filename;
  //
  //           }
  //
  //         }
  //
  //       }  else if (mimetype.startsWith("image")) {
  //
  //         return dir+"/"+filename;
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }
  //
  // getCaption(id) {
  //
  //   if (id === KarmaFieldsAlpha.exit) {
  //
  //     return "../";
  //
  //   } else if (id === KarmaFieldsAlpha.mixed) {
  //
  //     return "[mixed value]";
  //
  //   }
  //
  //   if (!id) {
  //
  //     return "loading...";
  //
  //   }
  //
  //   const driver = this.getDriver();
  //   let file = KarmaFieldsAlpha.Query.getValue(driver, id, "filename");
  //   let filetype = KarmaFieldsAlpha.Query.getValue(driver, id, "filetype");
  //
  //   if (filetype) {
  //
  //     if (filetype[0] === "folder") {
  //
  //       let title = KarmaFieldsAlpha.Query.getValue(driver, id, "name");
  //
  //       if (title) {
  //
  //         return title[0] || "";
  //
  //       } else {
  //
  //         return "loading...";
  //
  //       }
  //
  //     } else {
  //
  //       let mimetype = KarmaFieldsAlpha.Query.getValue(driver, id, "mimetype");
  //
  //       if (mimetype) {
  //
  //         mimetype = mimetype[0] || "";
  //
  //         if (mimetype !== KarmaFieldsAlpha.loading) {
  //
  //           if (file) {
  //
  //             file = file[0] || "";
  //
  //             if (file) {
  //
  //               return file.slice(file.lastIndexOf("/") + 1);
  //
  //             } else {
  //
  //               return "file not found";
  //
  //             }
  //
  //           } else {
  //
  //             return "loading file...";
  //
  //           }
  //
  //         } else {
  //
  //           return "attachment not found";
  //
  //         }
  //
  //       } else {
  //
  //         return "loading attachment...";
  //
  //       }
  //
  //     }
  //
  //   } else {
  //
  //     return "loading...";
  //
  //   }
  //
  // }


  build() {
    return {
			class: "karma-gallery karma-field",
			init: container => {
        // this.render = container.render;

			},
      update: container => {

        container.element.classList.toggle("single", this.isSingle());

        const key = this.getKey();

        const ids = this.getIds();



        const data = this.getData();

        container.element.classList.toggle("loading", !ids);


        container.element.ondragover = event => {
          event.preventDefault(); // needed for ondrop to work!
        }

        container.element.ondrop = async event => {
          event.preventDefault();

          data.uploads = event.dataTransfer.files.length;

          await this.render();

          for (let file of event.dataTransfer.files) {

            const response = await this.uploadFile(file);

            if (response.success) {

              const id = response.data.id.toString()
              this.append([id]);

            }

            data.uploads--;

            await this.render();

          }

          this.parent.request("save");

        }

        if (ids) {



          container.children = [
            {
              class: "gallery",
              // init: gallery => {
              //   // gallery.element.tabIndex = -1;
              // },
              update: gallery => {



                gallery.element.classList.toggle("empty", ids.length === 0);
                gallery.element.classList.toggle("dashicons", ids.length === 0);
                gallery.element.classList.toggle("dashicons-format-image", ids.length === 0);

                let selection = this.getSelection();

                gallery.element.classList.toggle("has-selection", Boolean(selection));


                gallery.element.ondblclick = event => {
                  // this.openLibrary([]);
                  // this.openMediaLibrary();
                  this.open();
                }



                const sorter = new KarmaFieldsAlpha.Sorter(gallery.element);
                sorter.colCount = 1;
                sorter.rowCount = ids.length;
                sorter.selection = selection;

                sorter.onselect = newSelection => {

                  // if (!KarmaFieldsAlpha.Selection.compare(newSelection, selection)) {
                  //
                  //   const [string] = this.export([], newSelection.index, newSelection.length);
                  //
                  //   KarmaFieldsAlpha.Clipboard.write(string);
                  //
                  //   this.setSelection(newSelection);
                  //
                  //   this.render();
                  //
                  // }

                  KarmaFieldsAlpha.Clipboard.focus();
                  this.setSelection(newSelection);
                  this.render();

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

                sorter.onSwap = (index, target, length) => {
                  // console.log(index, target, length);

                  this.swap(index, target, length);
                  this.setSelection({final: true, index: target, length: length});

                };

                sorter.onsort = (index, target, length) => {

                  // if (!KarmaFieldsAlpha.Selection.compare(sorter.selection, selection)) {
// debugger;
                    // this.swap(index, length, target);

                    // this.setSelection({final: true, index: target, length: length});

                    this.save("order");

                  // }

                }

                sorter.onbackground = () => {

                  this.setSelection({index: ids.length, length: 0, final: true});
                  KarmaFieldsAlpha.Clipboard.write("");

                  this.render();

                }

                gallery.children = ids.map((id, rowIndex) => {

                  return {
                    class: "frame",
                    update: frame => {
                      frame.element.classList.toggle("selected", Boolean(selection && KarmaFieldsAlpha.Segment.contain(selection, rowIndex)));
                    },
                    child: new KarmaFieldsAlpha.field.text.media({
                      driver: this.getDriver(),
                      id: id,
                      uploading: !id,
                      display: "thumb",
                      caption: true
                    }).build()
                  };


                  // return {
                  //   class: "frame",
                  //   // init: async frame => {
                  //   //   frame.element.tabIndex = -1;
                  //   // },
                  //   update: async frame => {
                  //
                  //     frame.element.classList.toggle("selected", KarmaFieldsAlpha.Segment.contain(selection, rowIndex));
                  //
                  //     // let [mimetype] = KarmaFieldsAlpha.Query.getValue(this.driver, id, "mimetype") || [KarmaFieldsAlpha.loading];
                  //     //
                  //     // let icon;
                  //     //
                  //     // frame.element.classList.toggle("loading", mimetype === KarmaFieldsAlpha.loading);
                  //     //
                  //     // if (!mimetype) {
                  //     //
                  //     //   icon = "notfound";
                  //     //
                  //     // } else if (mimetype === KarmaFieldsAlpha.loading) {
                  //     //
                  //     //   icon = "loading";
                  //     //
                  //     // } else if (mimetype.startsWith("image")) {
                  //     //
                  //     //   icon = "image";
                  //     //
                  //     // } else if (mimetype.startsWith("video")) {
                  //     //
                  //     //   icon = "video";
                  //     //
                  //     // } else if (mimetype.startsWith("audio")) {
                  //     //
                  //     //   icon = "audio";
                  //     //
                  //     // } else if (mimetype.startsWith("text")) {
                  //     //
                  //     //   icon = "text";
                  //     //
                  //     // } else if (mimetype === "application/pdf") {
                  //     //
                  //     //   icon = "document";
                  //     //
                  //     // } else if (mimetype === "application/zip") {
                  //     //
                  //     //   icon = "zip";
                  //     //
                  //     // } else {
                  //     //
                  //     //   icon = "default";
                  //     //
                  //     // }
                  //     //
                  //     // let [file] = KarmaFieldsAlpha.Query.getValue(this.driver, id, "_wp_attached_file") || [KarmaFieldsAlpha.loading];
                  //
                  //     frame.children = [
                  //       {
                  //         tag: "figure",
                  //         update: async figure => {
                  //
                  //           // if (icon === "image") {
                  //           //
                  //           //   const sizes = (mimetype === "image/jpeg" || mimetype === "image/png") && KarmaFieldsAlpha.Query.getValue(this.driver, id, "sizes");
                  //           //
                  //           //   if (sizes) {
                  //           //
                  //           //     const thumb = sizes.find(size => size.name === 'thumbnail');
                  //           //
                  //           //     if (thumb) {
                  //           //
                  //           //       figure.children = [{
                  //           //         tag: "img",
                  //           //         update: image => {
                  //           //           image.element.src = KarmaFieldsAlpha.uploadURL+"/"+thumb.file;
                  //           //           image.element.width = thumb.width;
                  //           //           image.element.height = thumb.height;
                  //           //         }
                  //           //       }];
                  //           //
                  //           //     } else {
                  //           //
                  //           //       icon = "notfound";
                  //           //
                  //           //     }
                  //           //
                  //           //   } else if (file) {
                  //           //
                  //           //     if (file !== KarmaFieldsAlpha.loading) {
                  //           //
                  //           //       figure.children = [{
                  //           //         tag: "img",
                  //           //         update: image => {
                  //           //           image.element.src = KarmaFieldsAlpha.uploadURL+"/"+file;
                  //           //         }
                  //           //       }];
                  //           //
                  //           //     }
                  //           //
                  //           //   } else {
                  //           //
                  //           //     icon = "notfound";
                  //           //
                  //           //   }
                  //           //
                  //           // } else {
                  //           //
                  //           //   figure.children = [];
                  //           //
                  //           // }
                  //
                  //           const filename = this.getFile(id);
                  //           const icon = !filename && this.getIcon(id);
                  //
                  //           figure.element.classList.toggle("dashicons", icon !== "thumb");
                  //           figure.element.classList.toggle("dashicons-upload", icon === "upload");
                  //           figure.element.classList.toggle("dashicons-media-video", icon === "video");
                  //           figure.element.classList.toggle("dashicons-media-audio", icon === "audio");
                  //           figure.element.classList.toggle("dashicons-media-text", icon === "text");
                  //           figure.element.classList.toggle("dashicons-media-document", icon === "document");
                  //           figure.element.classList.toggle("dashicons-media-default", icon === "default");
                  //           figure.element.classList.toggle("dashicons-format-image", icon === "image");
                  //           figure.element.classList.toggle("dashicons-media-archive", icon === "zip");
                  //           figure.element.classList.toggle("dashicons-hourglass", icon === "loading");
                  //           figure.element.classList.toggle("dashicons-warning", icon === "notfound");
                  //           figure.element.classList.toggle("dashicons-images-alt", icon === "mixed");
                  //
                  //
                  //           if (filename) {
                  //             figure.children = [{
                  //               tag: "img",
                  //               update: image => {
                  //                 if (!image.element.src.endsWith(filename)) {
                  //                   image.element.src = KarmaFieldsAlpha.uploadURL+filename;
                  //                 }
                  //               }
                  //             }];
                  //           } else {
                  //             figure.children = [];
                  //           }
                  //
                  //         }
                  //       },
                  //       {
                  //         class: "filename",
                  //         update: caption => {
                  //           caption.element.innerHTML = this.getCaption(id);
                  //           // if (mimetype) {
                  //           //   if (mimetype !== KarmaFieldsAlpha.loading) {
                  //           //     if (file) {
                  //           //       if (file !== KarmaFieldsAlpha.loading) {
                  //           //         const filename = file.slice(file.lastIndexOf("/") + 1);
                  //           //         caption.element.innerHTML = filename;
                  //           //       } else {
                  //           //         caption.element.innerHTML = "loading file...";
                  //           //       }
                  //           //     } else {
                  //           //       caption.element.innerHTML = "file not found";
                  //           //     }
                  //           //   } else {
                  //           //     caption.element.innerHTML = "loading attachment...";
                  //           //   }
                  //           // } else {
                  //           //   caption.element.innerHTML = "attachment not found";
                  //           // }
                  //         }
                  //       }
                  //     ];
                  //   }
                  // };
                });

                // if (data.uploads) {
                //
                //   for (let i = 0; i < data.uploads; i++) {
                //
                //     gallery.children.push({
                //       class: "frame",
                //       children: [
                //         {
                //           tag: "figure",
                //           children: [],
                //           update: async figure => {
                //             figure.element.classList.toggle("dashicons", true);
                //             figure.element.classList.toggle("dashicons-upload", true);
                //             figure.element.classList.toggle("dashicons-media-video", false);
                //             figure.element.classList.toggle("dashicons-media-audio", false);
                //             figure.element.classList.toggle("dashicons-media-text", false);
                //             figure.element.classList.toggle("dashicons-media-document", false);
                //             figure.element.classList.toggle("dashicons-media-default", false);
                //             figure.element.classList.toggle("dashicons-format-image", false);
                //             figure.element.classList.toggle("dashicons-media-archive", false);
                //             figure.element.classList.toggle("dashicons-hourglass", false);
                //             figure.element.classList.toggle("dashicons-warning", false);
                //           }
                //         },
                //         {
                //           class: "filename",
                //           update: async caption => {
                //             caption.element.innerHTML = "uploading file...";
                //           }
                //         }
                //       ]
                //     });
                //
                //   }
                //
                // }

              }
            },
            {
              class: "controls",
              update: controls => {
                controls.element.classList.toggle("hidden", this.resource.controls === false);
              },
              child: {
                class: "footer-content",
                // init: controls => {
                //   controls.element.onmousedown = event => {
                //     event.preventDefault(); // -> prevent losing focus on selected items
                //   }
                // },
                update: controls => {
                  // this.onRenderControls = controls.render;
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

}

KarmaFieldsAlpha.field.files.controls = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    super({
      display: "flex",
      children: [
        "add"
        // "edit",
        // "remove"
      ],
      ...resource
    });

  }

}

KarmaFieldsAlpha.field.files.controls.test = {
  type: "button",
  title: "Test",
  action: "test"
};

KarmaFieldsAlpha.field.files.controls.add = {
  type: "button",
  title: "Add",
  text: "+",
  action: "open",
  hidden: [">=", ["count", ["getValue"]], ["request", "getMax"]]
};

KarmaFieldsAlpha.field.files.controls.remove = {
  type: "button",
  title: "Remove",
  text: "–",
  // dashicon: "remove",
  action: "delete",
  disabled: ["!", ["request", "hasSelection"]],
  hidden: ["=", ["count", ["getValue"]], 0]
};

KarmaFieldsAlpha.field.files.controls.edit = {
  type: "button",
  title: "Edit",
  dashicon: "screenoptions",
  action: "open",
  disabled: ["!", ["request", "hasSelection"]],
  hidden: ["=", ["count", ["getValue"]], 0]
}


KarmaFieldsAlpha.field.file = class extends KarmaFieldsAlpha.field.files {
  constructor(resource) {
    super({...resource, max: 1});
  }
}
