

KarmaFieldsAlpha.fields.tableMedias = class extends KarmaFieldsAlpha.fields.table {

  static interface = class extends KarmaFieldsAlpha.fields.table.interface {




    constructor(...args) {

      super(...args);

      this.selectionBuffer = new KarmaFieldsAlpha.Buffer("state", "selection");

      this.idSelector = new KarmaFieldsAlpha.IdSelector();

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

        case "open-folder":

          const id = KarmaFieldsAlpha.Type.toString(event.data);

          if (id !== KarmaFieldsAlpha.Nav.get("post_parent")) {

            KarmaFieldsAlpha.History.save();
            KarmaFieldsAlpha.Nav.change(id, "post_parent");

            await super.dispatch({
              action: "query-ids"
            });

            await super.dispatch({
              action: "render"
            });

          }
          break;

        // case "actives": // -> deprec
        // case "selection":
        //   event.data = this.selectionBuffer.get() || [];
        //   break;

        case "upper-folder": {

          const id = KarmaFieldsAlpha.Nav.get("post_parent");

          if (id && id !== "0") {

            const parent = await this.getString(id, "post_parent");

            KarmaFieldsAlpha.History.save();

            this.unselect();

            KarmaFieldsAlpha.Nav.backup(id, "post_parent");
            KarmaFieldsAlpha.Nav.set(id, "post_parent"); // -> will remove key instead of setting ""

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
                files: event.dataTransfer.files
              }).then(async request => {
                if (KarmaFieldsAlpha.Nav.has("post_parent")) {
                  const parentId = KarmaFieldsAlpha.Nav.get("post_parent");
                  for (let fileId of request.data) {
                    await this.dispatch({
                      action: "set",
                      data: [parentId],
                      path: [fileId, "post_parent"]
                    });
                  }
                }
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

          this.idSelector.onSelectionComplete = async selection => {
            // const ids = manager.getSelectedIds();
            // const selectedIds = this.selectionBuffer.get() || [];

            const currentSelection = this.selectionBuffer.get();

            if (!KarmaFieldsAlpha.Segment.equals(selection, currentSelection)) {

              KarmaFieldsAlpha.History.save();

              this.selectionBuffer.backup(selection);
              this.selectionBuffer.set(selection);

              const request = await this.dispatch({
                action: "selectedIds"
              });

              const ids = KarmaFieldsAlpha.Type.toArray(request.data);

              this.clipboard.setData(ids.map(id => [id]));
              await this.dispatch({action: "edit-selection"});
            }
          }



          // this.idSelector.reset();

          this.clipboard.onInput = dataArray => {
            const data = KarmaFieldsAlpha.Clipboard.toJson(dataArray);
            this.dispatch({
              action: "write",
              data: data,
              selection: this.selectionBuffer.get()
            });
          }

          this.clipboard.ta.onfocus = event => {
            grid.element.classList.add("focus");
          }
          this.clipboard.ta.onblur = event => {
            grid.element.classList.remove("focus");
          }

          // const selectedIds = this.selectionBuffer.get() || [];

          if (ids.length) {
            grid.element.classList.add("filled"); // -> draw table borders
            grid.children = ids.map((id, index) => {

              // const isSelected = selectedIds.includes(id);

              return {
                tag: "li",
                child: {
                  class: "frame",
                  init: frame => {
                    frame.element.tabIndex = -1;
                  },
                  update: async frame => {

                    frame.element.classList.add("loading");
                    // frame.element.classList.toggle("selected", isSelected);

                    this.idSelector.registerItem(id, index);
                    this.idSelector.registerCell(index, frame.element);

                    const postType = await this.dispatch({
                      action: "get",
                      path: [id, "post_type"]
                    }).then(request => KarmaFieldsAlpha.Type.toString(request.data));

                    frame.element.ondblclick = event => {
                      if (postType !== "attachment") {
                        this.dispatch({
                          action: "open-folder",
                          data: this.resource.key
                        });
                      }
                    }

                    frame.children = [
                      {
                        tag: "figure",
                        update: async figure => {


                          figure.element.classList.toggle("dashicons", postType !== "attachment");
                          figure.element.classList.toggle("dashicons-category", postType !== "attachment");

                          if (postType === "attachment") {
                            figure.child = {
                              tag: "img",
                              update: async img => {
                                const request = await this.dispatch({
                                  action: "get",
                                  path: [id, "thumb_src"]
                                });
                                img.element.src = KarmaFieldsAlpha.Type.toString(request.data);
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
                            const key = postType === "attachment" ? "filename" : "post_title";
                            const name = await this.getString(id, key);
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
          // const selectedIds = this.selectionBuffer.get() || [];
          const selection = this.selectionBuffer.get();

          this.idsSelector.updateSelection(selection);

          const request = await this.dispatch({
            action: "selectedIds"
          });

          const selectedIds = KarmaFieldsAlpha.Type.toArray(request.data);

          this.clipboard.setData(selectedIds.map(id => [id]));
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

          case "is-attachment": {

            // -> handle multi selection
            const request = await super.dispatch({
              action: "get",
              path: ["post_type"]
            }); //.then(request => request.dataArray.every(data => KarmaFieldsAlpha.Type.toArray(data) === "attachment"));

            event.data = request.dataArray.every(data => KarmaFieldsAlpha.Type.toString(data) === "attachment")

            break;
          }

          case "is-folder": {

            // -> handle multi selection
            const request = await super.dispatch({
              action: "get",
              path: ["post_type"]
            }); //.then(request => request.dataArray.some(data => KarmaFieldsAlpha.Type.toString(data) !== "attachment"));

            event.data = request.dataArray.some(data => KarmaFieldsAlpha.Type.toString(data) !== "attachment")

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
            class: "karma-field karma-field-container display-flex",
            update: async container => {
              // const selectedIds = await dispatch({
              //   action: "selection"
              // }).then(request => request.data);
              // const selectedIds = await this.getArray("id");
              const selection = await this.getObject("selection");

              const type = await this.getString("post_type");

              const isAttachment = await this.dispatch({action: "is-attachment"});
              console.log(isAttachment);

              container.children = [
                {
                  class: "karma-field-frame",
                  children: [
                    {
                      // -> multiple attachments/folders
                      update: frame => {
                        frame.element.classList.toggle("hidden", !selection || selection <= 1); // selectedIds.length <= 1
                        if (selection && selection.length > 1) {
                          frame.child = {
                            tag: "span",
                            class: "dashicons dashicons-images-alt",
                            init: span => {
                              span.element.style = "font-size:10em;text-align:left;height:auto;width:auto;";
                            }
                          }
                        }
                      }
                    },
                    {
                      // -> 1 attachment
                      update: frame => {
                        frame.element.classList.toggle("hidden", !selection || selection.length !== 1 || type !== "attachment");
                        if (selection && selection.length === 1 && type === "attachment") {
                          frame.child = {
                            tag: "figure",
                            child: {
                              tag: "img",
                              init: img => {
                                img.element.sizes = "40em";
                              },
                              update: async img => {
                                img.element.src = await this.getString("thumb_src");
                                img.element.srcset = await this.getString("srcset");
                              }
                            }
                          }
                        }
                      }
                    },
                    {
                      // -> 1 folder
                      update: frame => {
                        frame.element.classList.toggle("hidden", !selection || selection.length !== 1 || type === "attachment");
                        if (selection && selection.length === 1 && type !== "attachment") {
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
                        frame.element.classList.toggle("hidden", !selection || selection <= 1);
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
                        frame.element.classList.toggle("hidden", !selection || selection.length !== 1 || type !== "attachment");
                        if (selection && selection.length === 1 && type === "attachment") {
                          frame.children = [
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
                                    label.element.innerHTML = "Uploaded on";
                                  }
                                },
                                {
                                  update: async node => {
                                    const value = await this.getString("post_date");
                                    const date = new Date(value);
                                    node.element.innerHTML = new Intl.DateTimeFormat(KarmaFieldsAlpha.locale, {
                                      year: "numeric",
                                      month: "long",
                                      day: "2-digit"
                                    }).format(date);
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
                            }
                          ]
                        }
                      }
                    },
                    {
                      // -> 1 folder
                      update: frame => {
                        frame.element.classList.toggle("hidden", !selection || selection.length !== 1 || type === "attachment");
                        if (selection && selection.length === 1 && type !== "attachment") {
                          frame.children = [
                            this.createChild({
                              id: "open-folder",
                              type: "button",
                              title: "Open",
                              action: "open-folder",
                              // value: await this.getString("id")
                              // hidden: [">", ["count", ["selection"]], 1]
                            }),
                            this.createChild({
                              id: "folder-name",
                              type: "input",
                              title: "Folder Name",
                              key: "post_title"
                            })
                          ]
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
                              title: "Path",
                              key: "post_parent"
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

    constructor(resource) {
      super({
        key: "post_parent",
        ...resource
      });
    }

    async fetchOptions() {

      const parent = KarmaFieldsAlpha.Nav.get(this.resource.key);

      const options = [
        {
          id: "",
          name: "–"
        },
        {
          id: "0",
          name: "Uploads"
        }
      ];

      const driver = "posts";
      const store = new KarmaFieldsAlpha.Store(driver);

      const children = [];

      const childrenIds = await store.queryIds(`post_type=karma-folder&post_status=inherit&${this.resource.key}=${parent}`);

      for (let childId of childrenIds) {
        children.push({
          id: childId,
          name: await store.getValue(childId, "post_title")
        });
      }

      const ancestors = [];

      let id = parent;

      while (id && id != '0') {

        await store.query(`post_type=post,page,karma-folder&post_status=inherit,publish,draft&id=${id}`); // -> wtf wp!!

        ancestors.unshift({
          id: id,
          name: await store.getValue(id, "post_title")
          //active: id === Number(parent)
        });

        id = await store.getValue(id, "post_parent");

      }

      return [...options, ...ancestors, ...children];

    }

  }

  static breadcrumb = class extends KarmaFieldsAlpha.fields.field {

    async getAncestors() {

      const parent = KarmaFieldsAlpha.Nav.get(this.resource.key);
      const driver = "posts";
      const store = new KarmaFieldsAlpha.Store(driver);
      const ancestors = [];

      let id = parent;

      while (id && id != '0') {

        await store.query(`post_type=post,page,karma-folder&post_status=inherit,publish,draft&id=${id}`); // -> wtf wp!!

        ancestors.unshift({
          id: id,
          name: await store.getValue(id, "post_title"),
          active: id === parent
        });

        id = await store.getValue(id, "post_parent");

      }

      return ancestors;
    }

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
          }, ...ancestors].map(item => {
            return {
              tag: "li",
              child: {
                tag: "a",
                update: a => {
                  a.element.classList.toggle("active", item.active);
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
