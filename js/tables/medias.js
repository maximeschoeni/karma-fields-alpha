

KarmaFieldsAlpha.field.medias = class extends KarmaFieldsAlpha.field.grid {

  async createFolder(index) {

    const parent = this.parent.request("getParam", "parent") || "0";

    KarmaFieldsAlpha.Query.add(this.resource.driver, 1, {
      filetype: "folder",
      parent: parent
    });

  }

  async openFolder(id) {

    this.request("setParam", id, "parent");

  }

  async upperFolder() {



    // const id = KarmaFieldsAlpha.Nav.get("parent");
    //
    // if (id && id !== "0") {
    //
    //   const parent = await this.getValue(id, "parent").then(response => KarmaFieldsAlpha.Type.toString(response));
    //
    //   KarmaFieldsAlpha.History.save();
    //
    //   this.unselect();
    //
    //   KarmaFieldsAlpha.Nav.change(parent, id, "parent");
    //
    //   const page = KarmaFieldsAlpha.Nav.get("page") || "1";
    //
    //   if (page !== "1") {
    //     KarmaFieldsAlpha.Nav.change(1, page, "page");
    //   }
    //
    //   await this.queryIds();
    //   await this.parent.request("render");
    //
    // }

  }

  upload(files, index = 0, length = 0) {

    const parent = this.parent.request("getParam", "parent") || "0";

    KarmaFieldsAlpha.Query.upload(this.resource.driver, files, {
      parent: parent
    }, index, length);

    this.render();
  }

  changeFile(files) {

    const selection = this.getSelection();

    // const {index: index = 0, length: length = 0} = this.getSelection() || {};

    if (selection) {

      this.upload(files, selection.index, selection.length);

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

    const ids = this.getSelectedIds();

    if (ids.length) {

      KarmaFieldsAlpha.Query.regen(this.resource.driver, ids);

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




  getIcon(id) {

    if (id === null) {

      return "upload";

    } else if (id === KarmaFieldsAlpha.field.medias.exit) {

      return "exit";

     } else {

      let mimetype = this.getValue(id, "mimetype");
      let filetype = this.getValue(id, "filetype");

      if (mimetype && filetype) {

        mimetype = mimetype[0] || "";
        filetype = filetype[0] || "";

        if (filetype === "folder") {

          return "folder";

        } else if (mimetype.startsWith("image")) {

          return "image";

        } else if (mimetype.startsWith("video")) {

          return "video";

        } else if (mimetype.startsWith("audio")) {

          return "audio";

        } else if (mimetype.startsWith("text")) {

          return "text";

        } else if (mimetype === "application/pdf") {

          return "document";

        } else if (mimetype === "application/zip") {

          return "zip";

        } else {

          return "default";

        }

      } else {

        return "notfound";

      }

    }

  }

  getFile(id) {

    let mimetype = this.getValue(id, "mimetype");
    let filename = this.getValue(id, "filename");
    let dir = this.getValue(id, "dir");

    if (filename && mimetype && dir) {

      filename = filename[0] || "";
      mimetype = mimetype[0] || "";
      dir = dir[0] || "";

      if (mimetype === "image/jpeg" || mimetype === "image/png") {

        let sizes = this.getValue(id, "sizes");

        if (sizes) {

          const thumb = sizes.find(size => size.name === "thumbnail");

          if (thumb) {

            return KarmaFieldsAlpha.uploadURL+dir+"/"+thumb.filename;

          }

        }

      }  else if (mimetype.startsWith("image")) {

        return KarmaFieldsAlpha.uploadURL+dir+"/"+filename;

      }

    }

  }

  getCaption(id) {

    let file = this.getValue(id, "basename");
    let filetype = this.getValue(id, "filetype");

    if (filetype) {

      if (filetype[0] === "folder") {

        let title = this.getValue(id, "post_title");

        if (title) {

          return title[0] || "";

        } else {

          return "loading...";

        }

      } else {

        let mimetype = this.getValue(id, "mimetype");

        if (mimetype) {

          mimetype = mimetype[0] || "";

          if (mimetype !== KarmaFieldsAlpha.loading) {

            if (file) {

              file = file[0] || "";

              if (file) {

                return file.slice(file.lastIndexOf("/") + 1);

              } else {

                return "file not found";

              }

            } else {

              return "loading file...";

            }

          } else {

            return "attachment not found";

          }

        } else {

          return "loading attachment...";

        }

      }

    } else {

      return "loading...";

    }


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
            update: async grid => {

              const ids = this.getIds();

              grid.element.classList.toggle("loading", !ids);

              if (ids) {

                const page = this.parent.request("getPage");
                const ppp = this.getPpp();
                const offset = (page - 1)*ppp;

                let selection = this.getSelection();

                const selector = new KarmaFieldsAlpha.Selector(grid.element);
                selector.colCount = 1;
                selector.rowCount = ids.length;

                if (selection && selection.final) {
                  selector.selection = selection;
                  const [string] = this.export([], selection.index, selection.length);
                  KarmaFieldsAlpha.Clipboard.write(string);
                }

                selector.onselect = newSelection => {
                  if (!KarmaFieldsAlpha.Selection.compare(newSelection, selection)) {
                    selection = newSelection;
                    this.select(selection.index, selection.length);
                  }
                }

                selector.onSelectionChange = newSelection => {
                  this.setSelection(newSelection);
                }

                selector.onPaintRow = elements => {
                  elements.forEach(element => element.classList.add("selected"))
                }

                selector.onUnpaintRow = elements => {
                  elements.forEach(element => element.classList.remove("selected"))
                }

                grid.element.classList.toggle("has-selection", Boolean(selection));

                grid.children = ids.map((id, index) => {

                  return {
                    tag: "li",

                    update: async li => {

                      const filetype = this.getValue(id, "filetype");
                      const isSelected = selection && KarmaFieldsAlpha.Selection.containRow(selection, index);

                      li.element.classList.toggle("selected", Boolean(isSelected));

                      li.element.classList.toggle("media-dropzone", filetype === "folder");

                      li.element.ondblclick = event => {
                        if (filetype === "folder") {
                          this.request("setParam", id, "parent");
                          // this.parent.setValue(id, "parent");
                        }
                      }

                      li.child = {
                        class: "frame",
                        init: frame => {
                          frame.element.tabIndex = -1;
                        },
                        update: async frame => {

                          frame.children = [
                            {
                              tag: "figure",
                              update: async figure => {

                                const src = this.getFile(id);
                                const icon = !src && this.getIcon(id);

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



                                if (src) {
                                  figure.children = [{
                                    tag: "img",
                                    update: async img => {
                                      if (!img.element.src.endsWith(src)) { // -> setting same src will reload image!
                                        img.element.src = src;
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
                                update: async filename => {
                                  filename.element.innerHTML = this.getCaption(id);
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
      update: async container => {

        const isMultiple = this.request("multiple");
        const filetypes = this.getValue("filetype");

        if (filetypes) {

          const filetype = filetypes[0];

          container.children = [
            {
              class: "karma-field-frame",
              children: [
                {
                  // -> multiple attachments/folders
                  update: frame => {
                    frame.element.classList.toggle("hidden", !isMultiple);
                    if (isMultiple) {
                      frame.child = {
                        tag: "span",
                        class: "dashicons dashicons-format-gallery",
                        init: span => {
                          span.element.style = "font-size:10em;text-align:left;height:auto;width:auto;";
                        }
                      };
                    }
                  }
                },
                {
                  // -> 1 attachment
                  update: frame => {
                    frame.element.classList.toggle("hidden", isMultiple || filetype !== "file");
                    if (!isMultiple && filetype === "file") {
                      const mimetypes = this.getValue("mimetype");
                      if (mimetypes) {
                        frame.children = [
                          {
                            tag: "figure",
                            class: "image",
                            update: figure => {
                              if (mimetypes[0].startsWith("image")) {
                                figure.child = {
                                  tag: "img",
                                  init: img => {
                                    img.element.sizes = "40em";
                                  },
                                  update: img => {
                                    const filenames = this.getValue("filename");
                                    const dirs = this.getValue("dir");
                                    const sizes = this.getValue("sizes");
                                    if (filenames && sizes && dirs) {
                                      if (!img.element.src.endsWith(filenames[0])) {
                                        const dir = KarmaFieldsAlpha.uploadURL+dirs[0];
                                        img.element.src = KarmaFieldsAlpha.uploadURL+"/"+filenames[0];
                                        img.element.srcset = sizes.filter(size => size.width).map(size => `${dir}/${encodeURI(size.filename)} ${size.width}w`);
                                      }
                                    }
                                  }
                                }
                              } else {
                                figure.children = [];
                              }
                            }
                          },
                          {
                            tag: "figure",
                            class: "video",
                            update: figure => {
                              if (mimetypes[0].startsWith("video")) {
                                figure.child = {
                                  tag: "video",
                                  child: {
                                    tag: "source",
                                    update: source => {
                                      const filenames = this.getValue("filename");
                                      if (filenames && mimetypes && !source.element.src.endsWith()) {
                                        source.element.src = KarmaFieldsAlpha.uploadURL+"/"+filenames[0];
                                        source.element.type = mimetypes[0];
                                      }
                                    }
                                  },
                                  update: async video => {
                                    video.element.setAttribute("controls", "1");
                                  }
                                }
                              } else {
                                figure.children = [];
                              }
                            }
                          }
                        ];
                      }
                    }
                  }
                },
                {
                  // -> 1 folder
                  update: frame => {
                    frame.element.classList.toggle("hidden", isMultiple && filetype !== "folder");
                    if (!isMultiple && filetype === "folder") {
                      frame.child = {
                        tag: "span",
                        class: "dashicons dashicons-category",
                        init: span => {
                          span.element.style = "font-size:8em;height:auto;width:auto;"
                        }
                      }
                    }
                  }
                }
              ]
            },
            {
              class: "karma-field-frame",
              children: [
                {
                  // -> multiple attachments/folders
                  update: frame => {
                    frame.element.classList.toggle("hidden", !isMultiple);
                    if (isMultiple) {
                      frame.children = [
                        {
                          tag: "label",
                          update: span => {
                            span.element.innerHTML = `${this.request("getSelectedIds").length} items selected`;
                          }
                        }
                      ];
                    }
                  }
                },
                {
                  // -> 1 attachment
                  class: "karma-field karma-field-container display-block",
                  update: frame => {
                    frame.element.classList.toggle("hidden", isMultiple || filetype !== "file");
                    if (!isMultiple && filetype === "file") {
                      frame.children = [
                        {
                          class: "filename",
                          children: [
                            {
                              tag: "label",
                              init: label => {
                                label.element.innerHTML = "Filename";
                              }
                            },
                            {
                              class: "value",
                              child: {
                                tag: "a",
                                update: async a => {
                                  const names = this.getValue("name");
                                  const filenames = this.getValue("filename");
                                  if (names && filenames) {
                                    a.element.innerHTML = names[0];
                                    a.element.href = KarmaFieldsAlpha.uploadURL+"/"+filenames[0];
                                  }
                                }
                              }
                            }
                          ]
                        },
                        {
                          children: [
                            {
                              tag: "label",
                              init: label => {
                                label.element.innerHTML = "Size";
                              }
                            },
                            {
                              update: async node => {
                                const sizes = this.getValue("size");
                                if (sizes) {
                                  node.element.innerHTML = `${(sizes[0]/1000).toFixed()} KB`;
                                }
                              }
                            }
                          ]
                        },
                        {
                          children: [
                            {
                              tag: "label",
                              init: label => {
                                label.element.innerHTML = "Dimensions";
                              }
                            },
                            {
                              update: async node => {
                                const widths = this.getValue("width");
                                const heights = this.getValue("height");
                                if (widths && heights) {
                                  node.element.innerHTML = `${widths[0]} x ${heights[0]} pixels`;
                                }
                              }
                            }
                          ]
                        },
                        {
                          children: [
                            {
                              tag: "label",
                              init: label => {
                                label.element.innerHTML = "Uploaded on";
                              }
                            },
                            {
                              update: async node => {
                                const dates = this.getValue("date");
                                if (dates) {
                                  const date = new Date(dates[0] || null);
                                  node.element.innerHTML = new Intl.DateTimeFormat(KarmaFieldsAlpha.locale, {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit"
                                  }).format(date);
                                }
                              }
                            }
                          ]
                        }
                      ]
                    }
                  }
                },
                {
                  // -> 1 folder
                  class: "one-folder",
                  update: async frame => {
                    frame.element.classList.toggle("hidden", isMultiple || filetype !== "folder");
                    if (!isMultiple && filetype === "folder") {
                      frame.children = [
                        this.createChild({
                          id: "open-folder",
                          type: "button",
                          title: "Open",
                          action: "open-folder"
                        }).build()
                      ];

                    }
                  }
                }
              ]
            }
          ];
        }
      }
    }
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
      values: [{filetype: "folder"}],
      title: "Create Folder",
      ...resource
    })
  }
}
