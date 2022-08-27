

KarmaFieldsAlpha.fields.tableMedias = class extends KarmaFieldsAlpha.fields.table {

  // async dispatch(event) {
  //
  //   switch (event.action) {
  //
  //     case "queryChildren"
  //
  //
  //   }
  //
  //
  //   return event;
  // }



  static interface = class extends KarmaFieldsAlpha.fields.table.interface {




    constructor(...args) {

      super(...args);

      this.selectionBuffer = new KarmaFieldsAlpha.Buffer("state", this.resource.context, "selection");

      // this.idSelector = new KarmaFieldsAlpha.IdSelector();

      this.clipboard = new KarmaFieldsAlpha.Clipboard();

    }

    // unselect() {
    //
    //   const ids = this.selectionBuffer.get() || [];
    //
    //   if (ids.length) {
    //     KarmaFieldsAlpha.History.save();
    //     this.selectionBuffer.backup();
    //     this.selectionBuffer.remove();
    //
    //   }
    //
    //   this.idSelector.clearSelection();
    //
    // }



    async dispatch(event) {

      switch(event.action) {

        // case "get": {
        //
        //   event.path = ["content", ...path];
        //   await super.dispatch(event);
        //   break;
        // }

        // case "get": {
        //   return super.dispatch(event, "content", ...path);
        // }

        // case "unselect": {
        //
        //   const ids = this.selectionBuffer.get() || [];
        //
        //   if (ids.length) {
        //
        //     KarmaFieldsAlpha.History.save();
        //
        //     this.selectionBuffer.backup();
        //     this.selectionBuffer.remove();
        //
        //   }
        //
        //   this.idSelector.clearSelection();
        //   break;
        // }

        case "open-folder": {
          const [id] = event.path;
          // const id = KarmaFieldsAlpha.Type.toString(event.data);

          if (id !== KarmaFieldsAlpha.Nav.get("parent")) {

            KarmaFieldsAlpha.History.save();

            this.unselect();

            KarmaFieldsAlpha.Nav.change(id, "parent");

            await super.dispatch({
              action: "query-ids"
            });

            await super.dispatch({
              action: "render"
            });

          }
          break;
        }

        // case "actives": // -> deprec
        // case "selection":
        //   event.data = this.selectionBuffer.get() || [];
        //   break;

        case "upper-folder": {

          const id = KarmaFieldsAlpha.Nav.get("parent");

          if (id && id !== "0") {

            const parent = await this.getString(id, "parent");

            KarmaFieldsAlpha.History.save();

            this.unselect();

            KarmaFieldsAlpha.Nav.backup(parent, "parent");
            KarmaFieldsAlpha.Nav.set(parent, "parent"); // -> will remove key instead of setting ""

            const page = KarmaFieldsAlpha.Nav.get("page") || "1";

            if (page !== "1") {
              KarmaFieldsAlpha.Nav.backup(1, "page");
              KarmaFieldsAlpha.Nav.change(1, "page");
            }

            await super.dispatch({
              action: "query-ids"
            });

            await super.dispatch({
              action: "render"
            });
          }

          break;
        }

        // case "prev": {
        //   const selectedIds = this.selectionBuffer.get() || [];
        //   const ids = await this.dispatch({action: "ids"});
        //   const index = ids.findIndex(id => id === selectedIds[0]);
        //   if (selectedIds.length === 1 && index > 0) {
        //     const id = ids[index-1];
        //     this.selectionBuffer.backup([id]);
        //     this.selectionBuffer.set([id]);
        //     await this.dispatch({action: "render"});
        //   }
        //
        //   break;
        // }
        //
        // case "next": {
        //   const selectedIds = this.selectionBuffer.get() || [];
        //   const ids = await this.dispatch({action: "ids"});
        //   const index = ids.findIndex(id => id === selectedIds[0]);
        //   if (selectedIds.length === 1 && index > -1 && index < ids.length-1) {
        //     const id = ids[index+1];
        //     this.selectionBuffer.backup([id]);
        //     this.selectionBuffer.set([id]);
        //     await this.dispatch({action: "render"});
        //   }
        //   break;
        // }
        //
        // case "has-prev": {
        //   const selectedIds = this.selectionBuffer.get() || [];
        //   const ids = await this.dispatch({action: "ids"});
        //   event.data = selectedIds.length === 1 && selectedIds[0] !== ids[0];
        //   break;
        // }
        //
        // case "has-next": {
        //   const selectedIds = this.selectionBuffer.get() || [];
        //   const ids = await this.dispatch({action: "ids"});
        //   event.data = selectedIds.length === 1 && selectedIds[0] !== ids[ids.length-1];
        //   break;
        // }



        default:
          await super.dispatch(event);

      }

      return event;
    }



    // refocus() {
    //
    //   if (!this.parent.parent.resource.modal) { // => no modal -> click to background to unselect all
    //
    //     const ids = this.selectionBuffer.get() || [];
    //
    //     if (ids.length) {
    //       this.selectionBuffer.backup();
    //       this.selectionBuffer.remove();
    //
    //     }
    //
    //
    //   }
    //
    //   this.dispatch({action: "render"});
    //
    // }

    async updateSelection(index, length) {



      const selection = this.selectionBuffer.get() || {};
      const segment = new KarmaFieldsAlpha.Segment(index, length);

      if (!segment.equals(selection.index, selection.length)) {

        KarmaFieldsAlpha.History.save();

        this.select(index, length);

        // const request = await this.dispatch({
        //   action: "rows",
        //   index: index,
        //   length: length
        // });
        //
        // console.log(request.data);

        const ids = await this.dispatch({
          action: "ids"
        }).then(request => KarmaFieldsAlpha.Type.toArray(request.data));

        const selectedIds = ids.slice(index, index + length);

        this.clipboard.setData(selectedIds.map(id => [id]));
        await this.dispatch({action: "edit-selection"});

      } else {

        this.clipboard.focus();

      }

    }

    build(ids, page, ppp, columns) {
      return {
        class: "media-table",
        tag: "ul",
        init: async grid => {
          if (this.resource.style) {
            grid.element.style = this.resource.style;
          }
          grid.element.ondrop = event => {
            event.preventDefault();
            const files = event.dataTransfer.files;
            if (event.dataTransfer.files.length) {

              grid.element.classList.add("loading");
              this.dispatch({
                action: "upload",
                files: event.dataTransfer.files,
                params: {
                  parent: KarmaFieldsAlpha.Nav.get("parent") || "0"
                }
              }).then(async request => {
                // if (KarmaFieldsAlpha.Nav.has("parent")) {
                //   const parentId = KarmaFieldsAlpha.Nav.get("parent");
                //   for (let fileId of request.data) {
                //     await this.dispatch({
                //       action: "set",
                //       data: [parentId],
                //       path: [fileId, "parent"]
                //     });
                //   }
                // }
                grid.element.classList.remove("loading");
              });
            }
          }
          grid.element.ondragover = function(event) {
            event.preventDefault();
          }
        },
        update: async grid => {

          // this.idSelector.onSelectElement = element => {
          //   element.classList.add("selected");
          // };
          // this.idSelector.onUnselectElement = element => {
          //   element.classList.remove("selected");
          // }

          // this.idSelector.onSelectionComplete = async selection => {
          //   // const ids = manager.getSelectedIds();
          //   // const selectedIds = this.selectionBuffer.get() || [];
          //
          //   const currentSelection = this.selectionBuffer.get();
          //
          //   if (!KarmaFieldsAlpha.Segment.equals(selection, currentSelection)) {
          //
          //     KarmaFieldsAlpha.History.save();
          //
          //     this.selectionBuffer.backup(selection);
          //     this.selectionBuffer.set(selection);
          //
          //     const request = await this.dispatch({
          //       action: "selectedIds"
          //     });
          //
          //     const ids = KarmaFieldsAlpha.Type.toArray(request.data);
          //
          //     this.clipboard.setData(ids.map(id => [id]));
          //     await this.dispatch({action: "edit-selection"});
          //   }
          // }



          // this.idSelector.reset();

          this.clipboard.onInput = dataArray => {
            const data = KarmaFieldsAlpha.Clipboard.toJson(dataArray);
            const selection = this.selectionBuffer.get();
            if (selection) {
              this.dispatch({
                action: "write",
                data: data,
                index: selection.index,
                length: selection.length
              });
            }
          }

          this.clipboard.ta.onfocus = event => {
            grid.element.classList.add("focus");
          }
          this.clipboard.ta.onblur = event => {
            grid.element.classList.remove("focus");
          }

          const currentSelection = this.selectionBuffer.get() || {};

          // const selectedIds = this.selectionBuffer.get() || [];

          if (ids.length) {
            grid.element.classList.add("filled"); // -> draw table borders
            grid.children = ids.map((id, index) => {

              // const isSelected = selectedIds.includes(id);

              return {
                tag: "li",
                update: li => {



                  const isSelected = KarmaFieldsAlpha.Segment.contains(currentSelection, index);

                  li.element.classList.toggle("selected", isSelected);

                  li.element.onmousedown = async event => {

                    const currentSelection = this.selectionBuffer.get();

                    const newSelection = new KarmaFieldsAlpha.Selection(event, grid.element, [...grid.element.children], 1, ids.length, 0, index, currentSelection);

                    await newSelection.select();

                    await this.updateSelection(newSelection.index, newSelection.length);

                    // const segment = new KarmaFieldsAlpha.Segment(newSelection.index, newSelection.length);
                    //
                    // if (!segment.equals(currentSelection.index, currentSelection.length)) {
                    //
                    //   KarmaFieldsAlpha.History.save();
                    //
                    //   this.select(newSelection);
                    //
                    //   const selectedIds = ids.slice(newSelection.index, newSelection.index + newSelection.length);
                    //
                    //   this.clipboard.setData(selectedIds.map(id => [id]));
                    //   await this.dispatch({action: "edit-selection"});
                    //
                    // } else {
                    //
                    //   this.clipboard.focus();
                    //
                    // }

                  }
                },
                child: {
                  class: "frame",
                  init: frame => {
                    frame.element.tabIndex = -1;
                  },
                  update: async frame => {

                    frame.element.classList.add("loading");


                    // this.idSelector.registerItem(id, index);
                    // this.idSelector.registerCell(index, frame.element);

                    // const postType = await this.dispatch({
                    //   action: "get",
                    //   path: [id, "post_type"]
                    // }).then(request => KarmaFieldsAlpha.Type.toString(request.data));

                     // => mime type
                    const type = await this.dispatch({
                      action: "get",
                      path: [id, "type"]
                    }).then(request => KarmaFieldsAlpha.Type.toString(request.data));

                    const filetype = await this.dispatch({
                      action: "get",
                      path: [id, "filetype"]
                    }).then(request => KarmaFieldsAlpha.Type.toString(request.data));

                    const isFolder = !filetype || filetype === "folder";

                    const thumb = !isFolder && await this.dispatch({
                      action: "get",
                      path: [id, "thumb"]
                    }).then(request => KarmaFieldsAlpha.Type.toObject(request.data));





                    frame.element.ondblclick = event => {
                      if (isFolder) {
                        this.dispatch({
                          action: "open-folder",
                          path: [id]
                          // data: this.resource.key
                        });
                      }
                    }

                    frame.children = [
                      {
                        tag: "figure",
                        update: async figure => {


                          // figure.element.classList.toggle("dashicons", postType !== "attachment");
                          // figure.element.classList.toggle("dashicons-category", postType !== "attachment");

                          const [mediaType] = type.split("/");

                          figure.element.classList.toggle("dashicons", !thumb);
                          figure.element.classList.toggle("dashicons-category", isFolder);
                          figure.element.classList.toggle("dashicons-media-video", !thumb && mediaType === "video");
                          figure.element.classList.toggle("dashicons-media-audio", !thumb && mediaType === "audio");
                          figure.element.classList.toggle("dashicons-media-text", !thumb && mediaType === "text");
                          figure.element.classList.toggle("dashicons-media-document", !thumb && type === "application/pdf");
                          figure.element.classList.toggle("dashicons-media-default", !thumb && !isFolder && mediaType !== "video" && mediaType !== "audio" && mediaType !== "text" && type !== "application/pdf");

                          if (thumb) {
                            figure.child = {
                              tag: "img",
                              update: async img => {
                                img.element.src = KarmaFieldsAlpha.uploadURL+"/"+thumb.filename;
                              }
                            }
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
                            // const request = await this.dispatch({
                            //   action: "get",
                            //   path: postType === "attachment" ? [id, "filename"] : [id, "post_title"]
                            // });
                            // const key = postType === "attachment" ? "filename" : "post_title";
                            const name = await this.getString(id, "name");
                            filename.element.innerHTML = name || "no name";
                          }
                        }
                      }
                    ];
                  },
                  complete: frame => {
                    frame.element.classList.remove("loading");
                  }
                }

              };
            });
          } else {
            grid.children = [];
            grid.element.classList.remove("filled");
          }
        },
        complete: async grid => {


          // -> lose focus ie search field!


          // const request = await this.dispatch({
          //   action: "selectedIds"
          // });
          //
          // const selectedIds = KarmaFieldsAlpha.Type.toArray(request.data);
          //
          // this.clipboard.setData(selectedIds.map(id => [id]));


        }
      };
    }



    // static frame = class extends KarmaFieldsAlpha.fields.group {
    //
    //   async exportValue() {
    //     return this.resource.key;
    //   }
    //
    //   build() {
    //     return {
    //       class: "frame",
    //       init: frame => {
    //         frame.element.tabIndex = -1;
    //       },
    //       update: async frame => {
    //         // this.dispatch({
    //         //   action: "register-frame",
    //         //   id: this.resource.key,
    //         //   field: this,
    //         //   element: frame.element
    //         // });
    //
    //         frame.element.classList.add("loading");
    //
    //         this.parent.registerCell(frame.element, this, this.resource.key);
    //
    //         // const type = await this.dispatch({
    //         //   action: "get",
    //         //   path: ["type"]
    //         // }).then(request => KarmaFieldsAlpha.Type.toString(request.data));
    //
    //         const postType = await this.dispatch({
    //           action: "get",
    //           path: ["post_type"]
    //         }).then(request => KarmaFieldsAlpha.Type.toString(request.data));
    //
    //         // console.log(type, postType);
    //         //
    //         // frame.element.classList.toggle("image-type", type.startsWith("image"));
    //
    //         frame.element.ondblclick = event => {
    //           if (postType !== "attachment") {
    //             this.dispatch({
    //               action: "open-folder",
    //               data: this.resource.key
    //               // path: [this.resource.key]
    //             });
    //           }
    //         }
    //
    //         // frame.element.onclick = event => {
    //         //   this.dispatch({
    //         //     action: "open-modal"
    //         //   });
    //         // }
    //         frame.children = [
    //           {
    //             tag: "figure",
    //             update: async figure => {
    //
    //
    //               figure.element.classList.toggle("dashicons", postType !== "attachment");
    //               figure.element.classList.toggle("dashicons-category", postType !== "attachment");
    //
    //               if (postType === "attachment") {
    //                 figure.child = {
    //                   tag: "img",
    //                   update: async img => {
    //                     const request = await this.dispatch({
    //                       action: "get",
    //                       path: ["thumb_src"]
    //                     });
    //                     img.element.src = KarmaFieldsAlpha.Type.toString(request.data);
    //                   }
    //                 }
    //               } else {
    //                 figure.children = [];
    //               }
    //             }
    //           },
    //           {
    //             class: "filename",
    //             update: async filename => {
    //               const request = await this.dispatch({
    //                 action: "get",
    //                 path: postType === "attachment" ? ["filename"] : ["post_title"]
    //               });
    //               filename.element.innerHTML = KarmaFieldsAlpha.Type.toString(request.data) || "no name";
    //             }
    //           }
    //         ];
    //       },
    //       complete: frame => {
    //         frame.element.classList.remove("loading");
    //       }
    //     };
    //   }
    //
    // }

    static modal = class extends KarmaFieldsAlpha.fields.table.interface.modal {

      async dispatch(event) {

        switch (event.action) {

          case "close": {

            const request = await this.dispatch({
              action: "selection"
            });

            const selection = KarmaFieldsAlpha.Type.toObject(request.data);

            if (selection) {

              await this.dispatch({
                action: "unselect"
              });

            } else {

              await this.dispatch({
                action: "upper-folder"
              });

            }

            await this.dispatch({
              action: "render"
            });

            break;
          }

          case "open-folder": {
            const id = await super.dispatch({action: "selectedIds"}).then(request => KarmaFieldsAlpha.Type.toString(request.data));

            if (id) {
              event.path = [id, ...event.path];
              await super.dispatch(event);
            }


            // -> future:
            // const id = await super.dispatch({action: "selectedIds", type: "string"});
            //
            // if (id) {
            //   return super.dispatch(event, id, ...path);
            // }


            break;
          }

          case "is-attachment": {

            // -> handle multi selection
            const request = await super.dispatch({
              action: "get",
              path: ["filetype"]
            }); //.then(request => request.dataArray.every(data => KarmaFieldsAlpha.Type.toArray(data) === "attachment"));

            // console.log(request.data, request.dataArray);

            event.data = request.dataArray.length > 0 && request.dataArray.every(data => KarmaFieldsAlpha.Type.toString(data) === "file")

            break;
          }

          case "is-folder": {

            // -> handle multi selection
            const request = await super.dispatch({
              action: "get",
              path: ["filetype"]
            }); //.then(request => request.dataArray.some(data => KarmaFieldsAlpha.Type.toString(data) !== "attachment"));

            event.data = request.dataArray.some(data => KarmaFieldsAlpha.Type.toString(data) !== "file")

            break;
          }

          default:
            await super.dispatch(event);
            break;

        }

        return event;
      }

      static mediaDescription = class extends KarmaFieldsAlpha.fields.field {

        build() {
          return {
            class: "karma-field karma-field-container media-description display-flex",
            update: async container => {
              // const selectedIds = await dispatch({
              //   action: "selection"
              // }).then(request => request.data);
              // const selectedIds = await this.getArray("id");

              // debugger;

              // const selection = await this.getObject("selection");
              const selection = await this.dispatch({
                action: "selection"
              }).then(request => KarmaFieldsAlpha.Type.toObject(request.data));

              const filetype = await this.getString("filetype");


              const isAttachment = await this.dispatch({
                action: "is-attachment"
              }).then(request => KarmaFieldsAlpha.Type.toBoolean(request.data));


              container.children = [
                {
                  class: "karma-field-frame",
                  children: [
                    {
                      // -> multiple attachments/folders
                      update: frame => {
                        frame.element.classList.toggle("hidden", !selection || selection.length <= 1);
                        if (selection && selection.length > 1) {
                          frame.child = {
                            tag: "span",
                            class: "dashicons dashicons-format-gallery",
                            init: span => {
                              span.element.style = "font-size:10em;text-align:left;height:auto;width:auto;";
                            }
                          }
                        }
                      }
                    },
                    {
                      // -> 1 attachment
                      update: async frame => {
                        frame.element.classList.toggle("hidden", !selection || selection.length !== 1 || filetype !== "file");
                        if (selection && selection.length === 1 && filetype === "file") {
                          const type = await this.getString("type");
                          frame.children = [
                            {
                              tag: "figure",
                              class: "image",
                              update: figure => {
                                if (type.startsWith("image")) {
                                  figure.child = {
                                    tag: "img",
                                    init: img => {
                                      img.element.sizes = "40em";
                                    },
                                    update: async img => {
                                      const filename = await this.getString("filename");
                                      const src = KarmaFieldsAlpha.uploadURL+"/"+filename;
                                      const sizes = await this.getArray("sizes");
                                      const sources = sizes.filter(size => size.width).map(size => `${KarmaFieldsAlpha.uploadURL}/${encodeURI(size.filename)} ${size.width}w`);
                                      const srcset = [...new Set(sources)].join(",");

                                      img.element.src = src;
                                      img.element.srcset = srcset;
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
                                if (type.startsWith("video")) {
                                  figure.child = {
                                    tag: "video",
                                    child: {
                                      tag: "source",
                                      update: async source => {
                                        const filename = await this.getString("filename");
                                        source.element.src = KarmaFieldsAlpha.uploadURL+"/"+filename;
                                        source.element.type = type;
                                      }
                                    },
                                    update: async video => {
                                      video.element.setAttribute("controls", "1");
                                      // img.element.src = await this.getString("src");
                                      // img.element.srcset = await this.getString("srcset");
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
                    },
                    {
                      // -> 1 folder
                      update: frame => {
                        frame.element.classList.toggle("hidden", !selection || selection.length !== 1 || filetype === "file");
                        if (selection && selection.length === 1 && filetype !== "file") {
                          frame.child = {
                            tag: "span",
                            class: "dashicons dashicons-category",
                            init: span => {
                              span.element.style = "font-size:8em;height:auto;width:auto;"
                            }
                          }
                        }
                      }
                    },
                    {
                      // -> no selection
                      update: frame => {
                        frame.element.classList.toggle("hidden", Boolean(selection));
                        if (!selection) {
                          frame.child = {
                            tag: "span",
                            class: "dashicons dashicons-open-folder",
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
                        frame.element.classList.toggle("hidden", !selection || selection.length <= 1);
                        if (selection && selection.length > 1) {
                          frame.children = [
                            {
                              tag: "label",
                              update: span => {
                                span.element.innerHTML = `${selection.length} items selected`;
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
                        frame.element.classList.toggle("hidden", !selection || selection.length !== 1 || filetype !== "file");
                        if (selection && selection.length === 1 && filetype === "file") {
                          frame.children = [
                            {
                              children: [
                                {
                                  tag: "label",
                                  init: label => {
                                    label.element.innerHTML = "Filename";
                                  }
                                },
                                {
                                  child: {
                                    tag: "a",
                                    update: async a => {
                                      const name = await this.getString("name");
                                      const filename = await this.getString("filename");
                                      a.element.innerHTML = name;
                                      a.element.href = KarmaFieldsAlpha.uploadURL+"/"+filename;
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
                                    const size = await this.getNumber("size");
                                    node.element.innerHTML = `${(size/1000).toFixed()} KB`;
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
                                    node.element.innerHTML = `${await this.getString("width")} x ${await this.getString("height")} pixels`;
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
                                    const value = await this.getString("date");
                                    const date = new Date(value || null);

                                    node.element.innerHTML = new Intl.DateTimeFormat(KarmaFieldsAlpha.locale, {
                                      year: "numeric",
                                      month: "long",
                                      day: "2-digit"
                                    }).format(date);
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
                        frame.element.classList.toggle("hidden", !selection || selection.length !== 1 || filetype === "file");
                        if (selection && selection.length === 1 && filetype !== "file") {
                          frame.children = [
                            this.createChild({
                              id: "open-folder",
                              type: "button",
                              title: "Open",
                              action: "open-folder"
                              // value: await this.getString("id")
                              // hidden: [">", ["count", ["selection"]], 1]
                            }).build(),
                            // this.createChild({
                            //   id: "folder-name",
                            //   type: "input",
                            //   title: "Folder Name",
                            //   key: "post_title"
                            // }).build()
                          ];

                        }
                      }
                    },
                    {
                      // -> no selection
                      update: frame => {
                        frame.element.classList.toggle("hidden", Boolean(selection));
                        if (!selection) {
                          frame.children = [
                            this.createChild({
                              id: "breadcrumb",
                              type: "breadcrumb",
                              title: "Path"
                              // key: "post_parent"
                            })
                          ]
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

  }







  static directoryDropdown = class extends KarmaFieldsAlpha.fields.dropdown {

    // constructor(resource) {
    //   super({
    //     key: "post_parent",
    //     ...resource
    //   });
    // }

    async getAncestors() {

      let parent = KarmaFieldsAlpha.Nav.get("parent");
      const ancestors = [];

      while (parent && parent != "0") {

        let media = await this.dispatch({
          action: "queryid",
          id: parent
        }).then(request => KarmaFieldsAlpha.Type.toObject(request.data || {}));

        ancestors.unshift({
          id: parent,
          name: media.name || ""
          // active: id === parent
        });

        parent = media && media.parent;

      }

      return ancestors;
    }

    async fetchOptions() {

      // const parent = KarmaFieldsAlpha.Nav.get(this.resource.key);

      const options = this.resource.options || [
        {
          id: "",
          name: "–"
        },
        {
          id: "0",
          name: "Uploads"
        }
      ];

      const ancestors = await this.getAncestors();

      return [...options, ...ancestors];

      // const driver = "posts";
      // const store = new KarmaFieldsAlpha.Store(driver);
      // const children = [];
      //
      // const childrenIds = await store.queryIds(`post_type=karma-folder&post_status=inherit&${this.resource.key}=${parent}`);
      //
      // for (let childId of childrenIds) {
      //   children.push({
      //     id: childId,
      //     name: await store.getValue(childId, "post_title")
      //   });
      // }

      // const ancestors = [];
      //
      // let id = parent;
      //
      // while (id && id != '0') {
      //
      //   await store.query(`post_type=post,page,karma-folder&post_status=inherit,publish,draft&id=${id}`); // -> wtf wp!!
      //
      //   ancestors.unshift({
      //     id: id,
      //     name: await store.getValue(id, "post_title")
      //     //active: id === Number(parent)
      //   });
      //
      //   id = await store.getValue(id, "post_parent");
      //
      // }
      //
      // return [...options, ...ancestors, ...children];

    }

  }

  static breadcrumb = class extends this.directoryDropdown {

    // async getAncestors() {
    //
    //   const parent = KarmaFieldsAlpha.Nav.get(this.resource.key);
    //   // const driver = "posts";
    //   // const store = new KarmaFieldsAlpha.Store(driver);
    //   const ancestors = [];
    //
    //   let id = parent;
    //
    //   while (id && id != '0') {
    //
    //     const media = await this.dispatch({
    //       action: "queryid",
    //       id: id
    //     }).then(request => KarmaFieldsAlpha.Type.toObject(request.data));
    //
    //     if (media) {
    //
    //       ancestors.unshift({
    //         id: id,
    //         name: media.name,
    //         active: id === parent
    //       });
    //
    //       id = media.parent;
    //
    //     } else {
    //
    //       id = null;
    //
    //     }
    //
    //     // await store.query(`post_type=post,page,karma-folder&post_status=inherit,publish,draft&id=${id}`); // -> wtf wp!!
    //     //
    //     // ancestors.unshift({
    //     //   id: id,
    //     //   name: await store.getValue(id, "post_title"),
    //     //   active: id === parent
    //     // });
    //     //
    //     // id = await store.getValue(id, "post_parent");
    //
    //   }
    //
    //   return ancestors;
    // }

    build() {
      return {
        class: "karma-breadcrumb",
        tag: "ul",
        update: async ul => {

          const ancestors = await this.getAncestors();

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
                  a.element.classList.toggle("active", index === array.length - 1);
                  a.element.innerHTML = item.name || "no name";
                  a.element.onclick = async event => {

                    if (!item.active) {
                      KarmaFieldsAlpha.History.save();
                      KarmaFieldsAlpha.Nav.change(item.id, this.resource.key);

                      // new KarmaFieldsAlpha.Buffer("state", "ids").empty();

                      // await this.dispatch({
                      //   action: "clear-selection"
                      // });

                      await this.dispatch({
                        action: "query-ids"
                      });

                      await this.dispatch({
                        action: "render"
                      });

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




}
