
KarmaFieldsAlpha.exit = Symbol("exit");

KarmaFieldsAlpha.field.medias = class extends KarmaFieldsAlpha.field.grid {

  getDriver() {

    return this.resource.driver || "medias";

  }

  getIds() {

    const ids = super.getIds();
    const parent = this.getParent() || "0";

    if (ids && parent !== "0") {

      // -> append exit folder:
      return [KarmaFieldsAlpha.exit, ...ids];

    }

    return ids;
  }

  getSelectedIds() {

    return super.getSelectedIds()

  }

  async add(index = 0, params = {}) {

    const parent = this.getParent() || "0";

    // if (parent !== "0" && index > 0) {
    //
    //   index++; // -> index is relative to store ids
    //
    // }
    //
    // if (parent === "0") {
    //
    //   index = 0;
    //
    // } else {
    //
    //   index = 1;
    //
    // }

    // await super.add(index + (parent !== "0" ? 0 : 0), {
    //   filetype: ["folder"],
    //   mimetype: [""],
    //   parent: [parent],
    //   ...params
    // });

    KarmaFieldsAlpha.Query.add(this.resource.driver, index, {
      filetype: ["folder"],
      mimetype: [""],
      parent: [parent],
      ...params
    });

    // const ids = KarmaFieldsAlpha.Store.getIds() || [];
    // const newIds = [...ids];
    //
    // newIds.splice(index, 0, null); // -> null means item is being added. Cannot use symbols in json
    //
    // KarmaFieldsAlpha.Store.setIds(newIds);

    if (parent !== "0") {

      index++;

    }

    this.setSelection({final: true, index: index, length: 1});

    await this.render();

    this.save("add"); // -> wait until default fields are all set to save




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

  removeIds(ids) {

    ids = ids.filter(id => id !== KarmaFieldsAlpha.exit);

    super.removeIds(ids);

  }

  export(items = [], index = 0, length = 999999) {

    const ids = this.getIds();
    const grid = new KarmaFieldsAlpha.Grid();
    const slice = ids.slice(index, index + length).filter(id => id !== KarmaFieldsAlpha.exit);

    grid.addColumn(slice);

    items.push(grid.toString());

    return items;

  }

  import(items, index = 0, length = 999999) {

    const string = items.shift();

    // const [current] = this.export([], index, length);
    //
    // if (string !== current) {

      const grid = new KarmaFieldsAlpha.Grid(string);
      const ids = grid.getColumn(0);
      const parent = this.getParent() || "0";

      if (parent) {

        const driver = this.getDriver();
        const parentAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "parent") || "parent";

        ids.forEach(id => {

          KarmaFieldsAlpha.Store.setValue([parent], driver, id, parentAlias);
          KarmaFieldsAlpha.Store.setValue([], driver, id, "trash");

          KarmaFieldsAlpha.Query.saveValue({
            [parentAlias]: [parent],
            trash: []
          }, driver, id);

        });

        const newIds = this.getIds().filter(id => !ids.includes(id));

        if (parent !== "0") {

          index = Math.max(index, 1); // -> never insert before exit folder

        }

        newIds.splice(index, 0, ...ids);

        KarmaFieldsAlpha.Store.setIds(newIds);

        KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.Query.queries, driver);

      }

    // }

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

    if (id === KarmaFieldsAlpha.exit) {

      id = this.getParent(this.getParent());

    }

    this.parent.setValue(id || "0", "parent");

    this.save("open");

  }

  upperFolder() {

    this.openFolder(KarmaFieldsAlpha.exit);

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

    return !parent || parent === "0";
  }

  getParent(id) {

    if (id) {

      const driver = this.getDriver();
      const parentAlias = KarmaFieldsAlpha.Query.get(driver, "alias", "parent") || "parent";
      const values = KarmaFieldsAlpha.Query.getValue(driver, id, parentAlias);

      if (values) {

        return values[0];

      }

    } else {

      const values = this.parent.getValue("parent");

      if (values) {

        return values[0];

      }

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

    ids.forEach(id => {

      KarmaFieldsAlpha.Store.setValue([target || "0"], driver, id, parentAlias);
      KarmaFieldsAlpha.Query.saveValue([target || "0"], driver, id, parentAlias);


      // KarmaFieldsAlpha.Store.changeValue([target || "0"], driver, id, parentAlias);
      // KarmaFieldsAlpha.Store.changeValue(["0"], driver, id, "trash");
      //
      // KarmaFieldsAlpha.Query.saveValue({
      //   [parentAlias]: [target || "0"],
      //   trash: ["0"]
      // }, driver, id);

    });

    KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.Query.queries, driver);

    const newIds = this.getIds().filter(id => id !== KarmaFieldsAlpha.exit && !ids.includes(id));

    KarmaFieldsAlpha.Store.setIds(newIds);

    this.setSelection({final: true, index: 0, length: 0});

    this.save("move");
    this.render();

  }

  upload(files, index = 0, length = 0) {

    const parent = this.getParent() || "0";
    const driver = this.getDriver();

    if (parent !== "0") {

      index = Math.max(index, 1); // -> never insert before exit folder

    }

    KarmaFieldsAlpha.Query.upload(driver, files, {
      parent: parent
    }, index, length);

    this.save("upload");

    this.render();
  }

  changeFile(files) {

    const selection = this.getSelection();

    const parent = this.getParent() || "0";

    if (selection && (parent !== "0" || selection.index > 0)) { // -> not if the selected folder is exit folder

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




  getIcon(id) {

    return KarmaFieldsAlpha.field.files.prototype.getIcon.call(this, id);

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

  getFile(id) {

    return KarmaFieldsAlpha.field.files.prototype.getFile.call(this, id);

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

  getCaption(id) {

    return KarmaFieldsAlpha.field.files.prototype.getCaption.call(this, id);

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

    if (id === KarmaFieldsAlpha.exit) {

      return true;

    } else if (id !== null && id !== undefined) {

      const [filetype] = this.getValue(id, "filetype") || [];

      return filetype === "folder";

    }

    return false;
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

              let ids = this.getIds();

              grid.element.classList.toggle("loading", !ids);

              if (ids) {

                const page = this.parent.request("getPage");
                const ppp = this.getPpp();
                const offset = (page - 1)*ppp;
                const [parent] = this.parent.getValue("parent") || [];

                let selection = this.getSelection();





                // const selector = new KarmaFieldsAlpha.Selector(grid.element);
                const selector = new KarmaFieldsAlpha.DragAndDrop(grid.element);
                selector.colCount = 1;

                const items = ids;

                // if (parent && parent !== "0") {
                //
                //   items.unshift(KarmaFieldsAlpha.exit);
                //
                // }

                selector.rowCount = items.length;
                selector.dropZones = items.map((item, index) => index).filter(index => this.isFolder(items[index]));

                if (selection && selection.final) {
                  selector.selection = selection;
                  // const [string] = this.export([], selection.index, selection.length);
                  // KarmaFieldsAlpha.Clipboard.write(string);
                }

                selector.onselect = newSelection => {
                  if (!KarmaFieldsAlpha.Selection.compare(newSelection, selection)) {
                    // selection = newSelection;
                    // this.select(selection.index, selection.length);

                    KarmaFieldsAlpha.Clipboard.focus();
                    this.setSelection(newSelection);
                    // this.save("nav");
                    this.render();

                  }
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
                  const targetId = items[index];
                  const selectedIds = items.slice(selection.index, selection.index + selection.length);

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


                grid.children = items.map((id, index) => {
                  return {
                    tag: "li",

                    update: li => {

                      // const filetype = this.getValue(id, "filetype");

                      // const isSelected = selection && KarmaFieldsAlpha.Selection.containRow(selection, index);
                      //
                      // li.element.classList.toggle("selected", Boolean(isSelected));

                      // li.element.classList.remove("hidden"); // -> because it get hidden when dropped

                      li.element.classList.toggle("selected", selector.includes(index));
                      li.element.classList.toggle("media-dropzone", Boolean(id && this.isFolder(id)));

                      li.element.ondblclick = event => {
                        if (id && this.isFolder(id)) {
                          // this.request("setParam", id, "parent");
                          // this.parent.setValue(id, "parent");
                          this.openFolder(id)
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

                                const src = this.getFile(id);
                                const icon = !src && this.getIcon(id);

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
                                update: filename => {
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
      class: "karma-field karma-field-container media-description display-block",
      update: container => {

        const ids = this.request("getSelectedIds");


        // if (!ids.includes(KarmaFieldsAlpha.exit)) {


        // }
        //
        // const isMultiple = this.request("multiple");
        // const filetypes = this.getValue("filetype");
        //
        // if (filetypes) {

          const isMultiple = this.request("multiple");
          const [filetype] = this.getValue("filetype") || [""];

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
                                  update: async video => {
                                    video.element.setAttribute("controls", "1");
                                    video.child = {
                                      tag: "source",
                                      update: source => {
                                        const filenames = this.getValue("filename");
                                        if (filenames && mimetypes && !source.element.src.endsWith(filenames[0])) {
                                          video.element.pause();
                                          source.element.src = KarmaFieldsAlpha.uploadURL+"/"+filenames[0];
                                          source.element.type = mimetypes[0];
                                          video.element.load();
                                        }
                                      }
                                    };
                                  }
                                }
                              } else {
                                figure.children = [];
                              }
                            }
                          },
                          {
                            tag: "figure",
                            class: "audio",
                            update: figure => {
                              if (mimetypes[0].startsWith("audio")) {
                                figure.child = {
                                  tag: "audio",
                                  update: audio => {
                                    audio.element.setAttribute("controls", "1");
                                    audio.child = {
                                      tag: "source",
                                      update: source => {
                                        const filenames = this.getValue("filename");
                                        if (filenames && mimetypes && !source.element.src.endsWith(filenames[0])) {
                                          audio.element.pause();
                                          source.element.src = KarmaFieldsAlpha.uploadURL+"/"+filenames[0];
                                          source.element.type = mimetypes[0];
                                          audio.element.load();
                                        }
                                      }
                                    };
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
                  class: "karma-field karma-field-container display-table",
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
                                update: a => {
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
                      const [id] = this.request("getSelectedIds") || [];
                      frame.children = [
                        this.createChild({
                          type: "group",
                          display: "flex",
                          children: [
                            {
                              type: "input",
                              label: "Name",
                              key: "name",
                              style: "flex-grow:1"
                            },
                            {
                              type: "button",
                              title: "Open",
                              action: "openFolder",
                              values: [id]
                            }
                          ]
                        }).build()
                      ];
                    } else {
                      frame.children = [];
                    }
                  }
                }
              ]
            }
          ];
        // } else {
        //   container.children = [];
        // }
      }
    }
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
