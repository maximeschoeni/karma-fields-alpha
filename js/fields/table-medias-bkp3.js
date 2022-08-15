

// KarmaFieldsAlpha.fields.table.medias = class extends KarmaFieldsAlpha.fields.field {
KarmaFieldsAlpha.fields.tableMedias = class extends KarmaFieldsAlpha.fields.table {

  constructor(...args) {
    super(...args);



    // this.elementsMap = new Map();
    // this.fieldsMap = new KarmaFieldsAlpha.Grid();
    // this.indexMap = {};

    // this.map = new Map();
    // this.elements = [];
    // this.fields = [];
    //
    // this.items = [];

    this.selectionBuffer = new KarmaFieldsAlpha.Buffer("state", "selection");

    this.idSelector = new KarmaFieldsAlpha.IdSelector();

    this.clipboard = new KarmaFieldsAlpha.Clipboard();

    // this.idsBuffer = new KarmaFieldsAlpha.Buffer("state", "ids");
    //
    //
    // this.ta = document.createElement("textarea");
    // document.body.appendChild(this.ta);
    // this.ta.className = "karma-fields-ta";
    // this.ta.style = "position:fixed;bottom:0;right:0;z-index:999999999";
    //
    // this.ta.oninput = async event => {
    //
    //   const ids = this.ta.value && this.ta.value.split(/[\r\n]/) || [];
    //   const currentIds = this.selectionBuffer.get() || [];
    //   const post_parent = KarmaFieldsAlpha.Nav.get("post_parent") || 0;
    //
    //
    //   // let params = await this.dispatch({
    //   //   action: "params"
    //   // }).then(request => KarmaFieldsAlpha.Type.toObject(request.data));
    //
    //   // KarmaFieldsAlpha.History.save();
    //
    //   // for (let id of ids) {
    //   //
    //   //   await this.dispatch({
    //   //     action: "set",
    //   //     data: [params.post_parent],
    //   //     path: [id, "post_parent"]
    //   //   });
    //   //
    //   // }
    //
    //   // console.log(event.inputType);
    //
    //   //
    //   // await this.importData(data);
    //   //
    //   switch (event.inputType) {
    //
    //     // case "insertFromPaste":
    //     case "deleteByCut":
    //     case "deleteContentBackward":
    //     case "deleteContentForward":
    //     case "deleteContent":
    //
    //       if (currentIds.length) {
    //
    //         await this.dispatch({
    //           action: "delete",
    //           data: currentIds
    //         });
    //
    //       }
    //
    //       break;
    //
    //     case "insertFromPaste":
    //
    //       if (ids.length || currentIds.length) {
    //
    //         for (let id of ids) {
    //
    //           await this.dispatch({
    //             action: "set",
    //             path: [id, "post_parent"],
    //             data: [post_parent]
    //           });
    //
    //         }
    //
    //         await this.dispatch({
    //           action: "insert",
    //           data: ids
    //         });
    //
    //       }
    //
    //       break;
    //
    //   }
    //
    //   // this.setValue(this.ta.value);
    //
    //
    // }


  }

  async dispatch(event) {

    switch(event.action) {

      case "open-folder":

        const id = KarmaFieldsAlpha.Type.toString(event.data);

        if (id !== KarmaFieldsAlpha.Nav.get("post_parent")) {

          KarmaFieldsAlpha.History.save();
          KarmaFieldsAlpha.Nav.change(id, "post_parent");

          await this.dispatch({
            action: "query-ids"
          });

          await this.dispatch({
            action: "render"
          });

        }
        break;

      case "actives":
        event.data = this.selectionBuffer.get() || [];
        break;

      case "upper-folder": {

        const id = KarmaFieldsAlpha.Nav.get("post_parent");
        if (id && id > 0) {
          const parent = await this.dispatch({
            action: "get",
            path: [id, "post_parent"]
          }).then(request => KarmaFieldsAlpha.Type.toString(request.data));

          KarmaFieldsAlpha.History.save();
          KarmaFieldsAlpha.Nav.change(parent, "post_parent");

          this.selectionBuffer.backup();
          this.selectionBuffer.remove();

          await this.dispatch({
            action: "query-ids"
          });

          await this.dispatch({
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

  // getSelectedIds() {
  //   let ids = this.selectionBuffer.get() || [];
  //   if (ids.length === 0) {
  //     ids = [KarmaFieldsAlpha.Nav.get("post_parent") || 0];
  //   }
  //   return ids;
  // }



  // findItem(index) {
  //   for (let item of this.map) {
  //     if (item.index === index) {
  //       return item;
  //     }
  //   }
  // }
  //
  // findElement(index) {
  //   for (let [key, value] of this.map.entries()) {
  //     if (value.index === index) {
  //       return key;
  //     }
  //   }
  // }


  // getIds(segment) {
  //   const ids = [];
  //   if (segment) {
  //     for (let i = segment.index; i < segment.index + segment.length; i++) {
  //       ids.push(this.fields[i].resource.key);
  //     }
  //   }
  //   return ids;
  // }
  //
  // hasId(segment, id) {
  //   if (segment) {
  //     for (let i = segment.index; i < segment.index + segment.length; i++) {
  //       if (this.fields[i] && this.fields[i].resource.key === id) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

  // controlFocusOut() {
  //
  //   // console.log("re-focus");
  //   // this.ta.focus();
  //   requestIdleCallback(() => {
  //     // this.ta.focus();
  //   });
  // }

  //
  // setValue(value) {
  //
  //
  //   console.log(value);
  //
  // }



  // async importData(data) {
  //
  //   const {index, length} = {index: 0, length: 1, ...this.selection};
  //
  //   KarmaFieldsAlpha.History.save();
  //
  //   for (let i = 0; i < Math.max(length, data.length); i++) {
  //
  //     // const field = this.fieldsMap.get(index + i, y + j);
  //
  //     const field = this.fields[index+i];
  //
  //
  //     if (field) {
  //       const value = data[i%data.length];
  //
  //       await field.dispatch({
	// 				action: "set",
	// 				type: "object",
	// 				backup: "pack",
	// 				data: [value]
	// 			});
  //
  //     }
  //   }
  //
  //   await this.dispatch({
  //     action: "edit"
  //   });
  //
  // }



  // registerTable(element) {
  //
  //   // this.endSelection();
  //
  //
  //   this.map = new Map();
  //   this.elements = [];
  //   this.fields = [];
  //
  //   this.items = [];
  //
  // }
  //
  // registerCell(element, field, id) {
  //
  //   const index = this.map.size;
  //   this.elements.push(element);
  //   this.fields.push(field);
  //
  //   this.map.set(element, {
  //     field: field,
  //     id: id,
  //     index: index
  //   });
  //
  //   this.items.push({
  //     element: element,
  //     id: id,
  //     field: field
  //   });
  //
  //
  //
  //   const ids = this.selectionBuffer.get() || [];
  //
  //   element.classList.remove("selected");
  //   element.classList.toggle("active", ids.includes(id));
  //
  //
  //   //
  //   // console.log("register cell");
  //   // if (selection && this.hasId(selection, id)) {
  //   // }
  //
  //   const onMouseUp = event => {
  //     document.removeEventListener("mouseup", onMouseUp);
  //     document.removeEventListener("mousemove", onMouseMove);
  //     onMouseMove(event);
  //
  //     // this.ids = await this.dispatch({action:"ids"})
  //     const selectedIds = this.selectionBuffer.get() || [];
  //
  //     const newIds = KarmaFieldsAlpha.Segment.toArray(this.selection).map(index => this.items[index].id);
  //
  //     if (KarmaFieldsAlpha.DeepObject.differ(selectedIds, newIds)) {
  //       KarmaFieldsAlpha.History.save();
  //       this.selectionBuffer.backup(newIds);
  //       this.selectionBuffer.set(newIds);
  //     }
  //
  //
  //
  //
  //     this.selecting = false;
  //     this.endSelection();
  //     // this.dispatch({
  //     //   action: "edit-selection"
  //     // });
  //     this.dispatch({
  //       action: "render"
  //     });
  //   }
  //
  //   const onMouseMove = event => {
  //     const elementUnderPoint = document.elementFromPoint(event.clientX, event.clientY);
  //     const target = elementUnderPoint && elementUnderPoint.closest(".frame");
  //     // const item = target && this.map.get(target);
  //     // if (item) {
  //     //   // this.growSelection({index: item.index, length: 1});
  //     //   this.growSelection({index: item.index, length: 1});
  //     // }
  //
  //     const index = this.items.findIndex(item => item.element === target);
  //     if (index > -1) {
  //       this.growSelection({index: index, length: 1});
  //     }
  //   }
  //
  //   element.onmousedown = event => {
  //     this.selecting = true;
  //     if (event.shiftKey) {
  //       event.preventDefault(); // -> prevent focus lose on TA
  //       this.growSelection({index: index, length: 1});
  //     } else {
  //       this.startSelection({index: index, length: 1});
  //     }
  //     document.addEventListener("mouseup", onMouseUp);
  //     document.addEventListener("mousemove", onMouseMove);
  //   }
  //
  // }
  //
  //
  //
  // growSelection(segment) {
  //   if (this.anchor) {
  //     segment = KarmaFieldsAlpha.Segment.union(this.anchor, segment);
  //   } else {
  //     this.anchor = segment;
  //   }
  //
  //   if (!this.selection || !KarmaFieldsAlpha.Segment.equals(this.selection, segment)) {
  //     this.deltaSelection(segment);
  //   }
  //
  // }
  //
  // deltaSelection(segment) {
  //   if (this.selection) {
  //     const elements = KarmaFieldsAlpha.Segment.toArray(this.selection).map(index => this.items[index].element);
  //     this.unpaint(elements, "selected");
  //   }
  //   this.selection = segment;
  //   if (this.selection && this.selection.length > 0) {
  //     const elements = KarmaFieldsAlpha.Segment.toArray(this.selection).map(index => this.items[index].element);
  //     this.paint(elements, "selected");
  //   }
  // }
  //
  // startSelection(segment) {
  //   this.anchor = segment;
  //   this.deltaSelection(segment);
  // }
  //
  // endSelection() {
  //   this.deltaSelection(null);
  //   this.anchor = null;
  // }
  //
  // // clearSelection() {
  // //   this.selectionBuffer.remove("ids");
  // //
  // // }
  //
  // hasRowSelected() {
  //
  //   return true;
  //
  //   // const currentSelection = this.selectionBuffer.get("ids") || [];
  //   // return currentSelection.length > 0;
  // }
  //
  // // clearSelection() {
  // //
  // //   this.endSelection();
  // //   this.editSelection();
  // // }
  //
  // async unfocus() {
  //
  //   if (!this.getChild("modal")) {
  //
  //     // this.clearSelection();
  //     //
  //     // this.dispatch({
  //     //   action: "edit-selection"
  //     // });
  //
  //     KarmaFieldsAlpha.History.save();
  //
  //     this.selectionBuffer.backup();
  //     this.selectionBuffer.remove();
  //
  //     await this.dispatch({
  //       action: "render"
  //     });
  //
  //   }
  //
  // }

  refocus() {

    // console.log("refocus");

    // this.ta.select();
    // this.ta.focus();

    if (!this.parent.parent.resource.modal) { // => no modal -> click to background to unselect all

      const ids = this.selectionBuffer.get() || [];

      if (ids.length) {
        this.selectionBuffer.backup();
        this.selectionBuffer.remove();

      }


    }

    this.dispatch({action: "render"});

  }

  // clearSelection() {
  //   const currentIds = this.selectionBuffer.get() || [];
  //   const elements = this.items.filter(item => currentIds.includes(item.id)).map(item => item.element);
  //
  //   this.unpaint(elements, "active");
  //
  //   // KarmaFieldsAlpha.History.backup([], currentIds, false, "selection");
  //   this.selectionBuffer.set([]);
  //   this.ta.value = "";
  // }

  // async changeSelection(segment) {
  //
  //   const currentIds = this.selectionBuffer.get() || [];
  //
  //   let elements = this.items.filter(item => currentIds.includes(item.id)).map(item => item.element);
  //
  //   this.unpaint(elements, "active");
  //
  //   const ids = KarmaFieldsAlpha.Segment.toArray(segment).map(index => this.items[index].id);
  //
  //   elements = this.items.filter(item => ids.includes(item.id)).map(item => item.element);
  //
  //   this.paint(elements, "active");
  //
  //   // KarmaFieldsAlpha.History.backup(ids, currentIds, false, "selection");
  //
  //   this.selectionBuffer.set(ids);
  //
  //   this.ta.value = ids.join("\n");
  //   this.ta.focus();
  //   this.ta.select();
  // }



  // async editSelection() {
  //
  //
  //   const currentIds = this.selectionBuffer.get("ids") || [];
  //
  //
  //   const ids = KarmaFieldsAlpha.Segment.toArray(this.selection || {index: 0, length: 0}).map(index => this.fields[index].resource.key);
  //
  //   KarmaFieldsAlpha.History.backup(ids, currentIds, false, "selection", "ids");
  //
  //   this.selectionBuffer.set(ids, "ids");
  //
  //
  //   this.ta.value = ids.join("\n");
  //   this.ta.focus();
  //   this.ta.select();
  //
  //
  //   await this.dispatch({
  //     action: "edit-selection"
  //   });
  //
  //   // await this.renderTA();
  // }

  // paint(segment) {
  //   for (let i = segment.index; i < segment.index + segment.length; i++) {
  //     this.elements[i].classList.add("selected");
  //   }
  // }
  //
  // unpaint(segment) {
  //   for (let i = segment.index; i < segment.index + segment.length; i++) {
  //     this.elements[i].classList.remove("selected");
  //   }
  // }

  // paint(elements, className) {
  //   for (let element of elements) {
  //     element.classList.add(className);
  //   }
  // }
  //
  // unpaint(elements, className) {
  //   for (let element of elements) {
  //     element.classList.remove(className);
  //   }
  // }



  // buildTA() {
  //   return {};
  //
  //   return {
  //     tag: "textarea",
  //     class: "karma-grid-ta2",
  //     init: ta => {
  //       this.renderTA = ta.render;
  //
  //       // ta.element.style = "left:-100%;position:absolute;";
  //       ta.element.style = "max-height:40px";
  //
  //       ta.element.onfocusout = event => {
  //         const selection = this.selection;
  //         this.endSelection();
  //         if (selection && (this.selecting || event.shiftKey)) {
  //           this.startSelection(selection);
  //         } else {
  //           this.editSelection();
  //         }
  //       }
  //
  //       ta.element.oninput = async event => {
  //
  //         let data = ta.element.value.split(/[\r\n]/);
  //
  //         await this.importData(data);
  //
  //         switch (event.inputType) {
  //
  //           case "insertFromPaste":
  //           case "deleteByCut":
  //           case "deleteContentBackward":
  //           case "deleteContentForward":
  //           case "deleteContent":
  //             ta.element.blur();
  //             break;
  //
  //         }
  //
  //       }
  //     },
  //     update: async ta => {
  //
  //       ta.element.blur();
  //
  //       const data = [];
  //
  //       if (this.selection && this.selection.length) {
  //
  //         for (let i = 0; i < this.selection.length; i++) {
  //
  //           // const field = this.map.get(this.selection.x + i, this.selection.y + j);
  //           // const value = await field.exportValue();
  //
  //           // const element = this.elements[this.selection.index + i];
  //           // const field = this.map.get(element).field;
  //           const field = this.fields[this.selection.index + i];
  //
  //
  //           const value = await field.exportValue();
  //
  //
  //
  //
  //           data.push(value);
  //
  //         }
  //
  //
  //
  //         ta.element.focus();
  //         ta.element.value = data.join("\n");
  //         ta.element.select();
  //
  //
  //
  //       }
  //
  //     }
  //   }
  // }


  build(ids, page, ppp, columns) {
    return {
      class: "media-table",
      tag: "ul",
      init: async grid => {
        if (this.resource.style) {
          grid.element.style = this.resource.style;
        }
        // this.ta.onfocus = event => {
        //   grid.element.classList.add("ta-focus");
        // }
        // this.ta.onblur = event => {
        //   grid.element.classList.remove("ta-focus");
        // }

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

        this.idSelector.onSelectElement = element => {
          element.classList.add("selected");
        };
        this.idSelector.onUnselectElement = element => {
          element.classList.remove("selected");
        }

        this.idSelector.onSelectionComplete = async manager => {
          const ids = manager.getSelectedIds();
          const selectedIds = this.selectionBuffer.get() || [];
          if (KarmaFieldsAlpha.DeepObject.differ(ids, selectedIds)) {
            KarmaFieldsAlpha.History.save();
            this.selectionBuffer.backup(ids);
            this.selectionBuffer.set(ids);

            this.clipboard.setData(ids.map(id => [id]));
            await this.dispatch({action: "edit-selection"}); // -> todo "edit-selection"
          }
          // await this.dispatch({action: "render"}); // -> todo "edit-selection"
        }


        this.idSelector.reset();

        this.clipboard.onInput = dataArray => {
          const data = KarmaFieldsAlpha.Clipboard.toJson(dataArray);
          this.dispatch({
            action: "write",
            data: data
          });
        }

        this.clipboard.ta.onfocus = event => {
          grid.element.classList.add("focus");
        }
        this.clipboard.ta.onblur = event => {
          grid.element.classList.remove("focus");
        }

        const selectedIds = this.selectionBuffer.get() || [];





        // this.registerTable(grid.element);

        if (ids.length) {
          grid.element.classList.add("filled"); // -> draw table borders
          grid.children = ids.map((id, index) => {

            const isSelected = selectedIds.includes(id);

            return {
              tag: "li",
              // child: this.createChild({
              //   type: "frame",
              //   key: id,
              //   id: id
              // }).build()

              child: {
                class: "frame",
                init: frame => {
                  frame.element.tabIndex = -1;
                },
                update: async frame => {
                  // this.dispatch({
                  //   action: "register-frame",
                  //   id: this.resource.key,
                  //   field: this,
                  //   element: frame.element
                  // });

                  frame.element.classList.add("loading");

                  frame.element.classList.toggle("selected", isSelected);

                  // this.parent.registerCell(frame.element, this, this.resource.key);


                  this.idSelector.registerItem(id, index);
                  this.idSelector.registerCell(index, frame.element, isSelected);



                  // const type = await this.dispatch({
                  //   action: "get",
                  //   path: ["type"]
                  // }).then(request => KarmaFieldsAlpha.Type.toString(request.data));

                  const postType = await this.dispatch({
                    action: "get",
                    path: [id, "post_type"]
                  }).then(request => KarmaFieldsAlpha.Type.toString(request.data));


                  // console.log(type, postType);
                  //
                  // frame.element.classList.toggle("image-type", type.startsWith("image"));

                  frame.element.ondblclick = event => {
                    if (postType !== "attachment") {
                      this.dispatch({
                        action: "open-folder",
                        data: this.resource.key
                        // path: [this.resource.key]
                      });
                    }
                  }

                  // frame.element.onclick = event => {
                  //   this.dispatch({
                  //     action: "open-modal"
                  //   });
                  // }
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
                      class: "filename",
                      update: async filename => {
                        const request = await this.dispatch({
                          action: "get",
                          path: postType === "attachment" ? [id, "filename"] : [id, "post_title"]
                        });
                        filename.element.innerHTML = KarmaFieldsAlpha.Type.toString(request.data) || "no name";
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

          // const parent = KarmaFieldsAlpha.Nav.get("post_parent") || "0";
          //
          // if (parent) {
          //
          // }

        } else {
          grid.children = [];
          grid.element.classList.remove("filled");
        }



      },
      complete: grid => {

        // const selection = this.selectionBuffer.get("ids");
        // const ids = this.getIds(this.selection).join("\n");
        // const ids = this.selectionBuffer.get() || [];
        // this.ta.value = ids.join("\n");
        // this.ta.focus();
        // this.ta.select();


        const selectedIds = this.selectionBuffer.get() || [];

        this.clipboard.setData(selectedIds.map(id => [id]));


      }
    };
  }



  // async dispatch(event, parent) {
  //
  //   switch (event.action) {
  //
  //     case "close":
  //       // await super.dispatch({
  //       //   action: "edit-selection"
  //       // });
  //
  //       this.selectionBuffer.remove("ids");
  //
  //       event.action = "edit-selection";
  //       await super.dispatch(event);
  //       break;
  //
  //     case "selection":
  //       event.data = this.selectionBuffer.get("ids") || [];
  //       break;
  //
  //     case "get": {
  //       const ids = this.selectionBuffer.get("ids") || [];
  //       if (ids.length === 1) {
  //         event.path = [ids[0], ...event.path];
  //         await super.dispatch(event);
  //       } else {
  //         event.data = ["— No Change —"];
  //         event.placeholder = "— No Change —";
  //       }
  //       break;
  //     }
  //
  //     case "set": {
  //       const ids = this.selectionBuffer.get("ids") || [];
  //
  //       KarmaFieldsAlpha.History.save();
  //
  //       for (let id of ids) {
  //         await super.dispatch({
  //           ...event,
  //           backup: "pack",
  //           path: [id, ...event.path]
  //         });
  //       }
  //       break;
  //     }
  //
  //     case "modified": {
  //       const ids = this.selectionBuffer.get("ids") || [];
  //       event.data = false;
  //       for (let id of ids) {
  //         const request = await super.dispatch({
  //           action: "modified",
  //           type: "boolean",
  //           path: [id, ...event.path]
  //         });
  //         if (event.data) {
  //           event.data = true;
  //           break;
  //         }
  //       }
  //       break;
  //     }
  //
  //     default: {
  //       await super.dispatch(event);
  //       break;
  //     }
  //   }
  //
  //
  //
  //   return event;
  // }



  static frame = class extends KarmaFieldsAlpha.fields.group {

    // constructor(resource) {
    //
    //   const defaultResource = {
    //     children: [
    //       {
    //         type: "text",
    //         value: ["replace", ]
    //
    //         'value' => array('replace', '<figure><img src="#"></figure>', '#', array('get', 'thumb_src')),
    //
    //       }
    //     ]
    //   }
    //
    // }


    async exportValue() {
      return this.resource.key;
    }

    build() {
      return {
        class: "frame",
        init: frame => {
          frame.element.tabIndex = -1;
        },
        update: async frame => {
          // this.dispatch({
          //   action: "register-frame",
          //   id: this.resource.key,
          //   field: this,
          //   element: frame.element
          // });

          frame.element.classList.add("loading");

          this.parent.registerCell(frame.element, this, this.resource.key);

          // const type = await this.dispatch({
          //   action: "get",
          //   path: ["type"]
          // }).then(request => KarmaFieldsAlpha.Type.toString(request.data));

          const postType = await this.dispatch({
            action: "get",
            path: ["post_type"]
          }).then(request => KarmaFieldsAlpha.Type.toString(request.data));

          // console.log(type, postType);
          //
          // frame.element.classList.toggle("image-type", type.startsWith("image"));

          frame.element.ondblclick = event => {
            if (postType !== "attachment") {
              this.dispatch({
                action: "open-folder",
                data: this.resource.key
                // path: [this.resource.key]
              });
            }
          }

          // frame.element.onclick = event => {
          //   this.dispatch({
          //     action: "open-modal"
          //   });
          // }
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
                        path: ["thumb_src"]
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
              class: "filename",
              update: async filename => {
                const request = await this.dispatch({
                  action: "get",
                  path: postType === "attachment" ? ["filename"] : ["post_title"]
                });
                filename.element.innerHTML = KarmaFieldsAlpha.Type.toString(request.data) || "no name";
              }
            }
          ];
        },
        complete: frame => {
          frame.element.classList.remove("loading");
        }
      };
    }

  }




}
