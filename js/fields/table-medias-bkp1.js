

KarmaFieldsAlpha.fields.table.medias = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);



    // this.elementsMap = new Map();
    // this.fieldsMap = new KarmaFieldsAlpha.Grid();
    // this.indexMap = {};

    this.map = new Map();
    this.elements = [];
    this.fields = [];

    this.selectionBuffer = new KarmaFieldsAlpha.Buffer("selection");


    this.ta = document.createElement("textarea");
    document.body.appendChild(this.ta);
    this.ta.className = "karma-fields-ta";
    this.ta.style = "position:fixed;bottom:0;right:0;z-index:999999999";

    this.ta.oninput = async event => {

      // let data = ta.element.value.split(/[\r\n]/);
      //
      // await this.importData(data);
      //
      // switch (event.inputType) {
      //
      //   case "insertFromPaste":
      //   case "deleteByCut":
      //   case "deleteContentBackward":
      //   case "deleteContentForward":
      //   case "deleteContent":
      //     ta.element.blur();
      //     break;
      //
      // }

      this.setValue(this.ta.value);

    }


  }

  async dispatch(event) {

    switch(event.action) {

      case "open-folder":

        const ids = this.selectionBuffer.get("ids") || [];

        // const request = await this.dispatch({
        //   action: "get",
        //   path:
        // })

        if (ids.length === 1) {
          // event.action = "set";
          event.data = ids.slice(0, 1);
          event.path = ["..", "post_parent"];
          this.clearSelection();
          this.selectionBuffer.remove("ids");
          await super.dispatch(event);
        }
        break;

      default:
        await super.dispatch(event);

    }

    return event;
  }



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


  getIds(segment) {
    const ids = [];
    if (segment) {
      for (let i = segment.index; i < segment.index + segment.length; i++) {
        ids.push(this.fields[i].resource.key);
      }
    }
    return ids;
  }

  hasId(segment, id) {
    if (segment) {
      for (let i = segment.index; i < segment.index + segment.length; i++) {
        if (this.fields[i] && this.fields[i].resource.key === id) {
          return true;
        }
      }
    }
    return false;
  }

  controlFocusOut() {

    // console.log("re-focus");
    // this.ta.focus();
    requestIdleCallback(() => {
      // this.ta.focus();
    });
  }


  setValue(value) {


    console.log(value);

  }



  async importData(data) {

    const {index, length} = {index: 0, length: 1, ...this.selection};

    KarmaFieldsAlpha.History.save();

    for (let i = 0; i < Math.max(length, data.length); i++) {

      // const field = this.fieldsMap.get(index + i, y + j);

      const field = this.fields[index+i];


      if (field) {
        const value = data[i%data.length];

        await field.dispatch({
					action: "set",
					type: "object",
					backup: "pack",
					data: [value]
				});

      }
    }

    await this.dispatch({
      action: "edit"
    });

  }



  registerTable(element) {

    // this.endSelection();


    this.map = new Map();
    this.elements = [];
    this.fields = [];

  }

  registerCell(element, field, id) {

    const index = this.map.size;
    this.elements.push(element);
    this.fields.push(field);

    this.map.set(element, {
      field: field,
      id: id,
      index: index
    });



    const selection = this.selectionBuffer.get("ids") || [];

    element.classList.toggle("selected", selection.includes(id));


    //
    // console.log("register cell");
    // if (selection && this.hasId(selection, id)) {
    // }

    const onMouseUp = event => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
      onMouseMove(event);
      this.selecting = false;
      this.editSelection();
    }

    const onMouseMove = event => {
      const elementUnderPoint = document.elementFromPoint(event.clientX, event.clientY);
      const target = elementUnderPoint && elementUnderPoint.closest(".frame");
      const item = target && this.map.get(target);
      if (item) {
        this.growSelection({index: item.index, length: 1});
      }
    }

    element.onmousedown = event => {
      this.selecting = true;
      if (event.shiftKey) {
        event.preventDefault(); // -> prevent focus lose on TA
        this.growSelection({index: index, length: 1});
      } else {
        this.startSelection({index: index, length: 1});
      }
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
    }

  }



  growSelection(segment) {
    if (this.anchor) {
      segment = KarmaFieldsAlpha.Segment.union(this.anchor, segment);
    } else {
      this.anchor = segment;
    }

    if (!this.selection || !KarmaFieldsAlpha.Segment.equals(this.selection, segment)) {
      this.deltaSelection(segment);
      this.hasSelection = true;
    }

  }

  deltaSelection(segment) {
    if (this.selection) {
      this.unpaint(this.selection);
    }
    this.selection = segment;
    if (this.selection.length > 0) {
      this.paint(this.selection);
    }
  }

  startSelection(segment) {
    this.anchor = segment;
    this.deltaSelection(segment);
    this.hasSelection = true;
  }

  endSelection() {
    if (this.selection) {
      this.unpaint(this.selection);
      this.selection = null;
      this.hasSelection = false;
    }
  }

  clearSelection() {
    this.selectionBuffer.remove("ids");

  }

  hasRowSelected() {
    // return this.selection && (this.selection.length > 0) || false;
    const currentSelection = this.selectionBuffer.get("ids") || [];
    return currentSelection.length > 0;
  }

  // clearSelection() {
  //
  //   this.endSelection();
  //   this.editSelection();
  // }

  unfocus() {

    if (!this.getChild("modal")) {

      this.endSelection();

      const currentSelection = this.selectionBuffer.get("ids");

      KarmaFieldsAlpha.History.backup([], currentSelection, false, "selection", "ids");

      this.selectionBuffer.set([], "ids");

      this.dispatch({
        action: "edit-selection"
      });

    }

  }


  async editSelection() {


    const currentIds = this.selectionBuffer.get("ids") || [];


    const ids = KarmaFieldsAlpha.Segment.toArray(this.selection || {index: 0, length: 0}).map(index => this.fields[index].resource.key);

    KarmaFieldsAlpha.History.backup(ids, currentIds, false, "selection", "ids");

    this.selectionBuffer.set(ids, "ids");


    this.ta.value = ids.join("\n");
    this.ta.focus();
    this.ta.select();


    await this.dispatch({
      action: "edit-selection"
    });

    // await this.renderTA();
  }

  paint(segment) {
    for (let i = segment.index; i < segment.index + segment.length; i++) {
      this.elements[i].classList.add("selected");
    }
  }

  unpaint(segment) {
    for (let i = segment.index; i < segment.index + segment.length; i++) {
      this.elements[i].classList.remove("selected");
    }
  }


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
        this.ta.onfocus = event => {
          grid.element.classList.add("ta-focus");
        }
        this.ta.onblur = event => {
          grid.element.classList.remove("ta-focus");
        }

        grid.element.ondrop = event => {
          event.preventDefault();
          const files = event.dataTransfer.files;
          if (event.dataTransfer.files.length) {

            grid.element.classList.add("loading");
            this.dispatch({
              action: "upload",
              data: event.dataTransfer.files
            }).then(() => {
              grid.element.classList.remove("loading");
            });
          }
        }
        grid.element.ondragover = function(event) {
          event.preventDefault();
        }
      },
      update: async grid => {

        this.registerTable(grid.element);

        if (ids.length) {
          grid.element.classList.add("filled"); // -> draw table borders
          grid.children = ids.map(id => {
            return {
              tag: "li",
              child: this.createChild({
                type: "frame",
                key: id,
                id: id
              }).build()
              // class: "media-item",
              // child: {
                // tag: "figure",
                // update: figure => {
                //   figure.element.onclick = event => {
                //
                //     this.dispatch({
                //       path: [id],
                //       action: "open-modal"
                //     });
                //   }
                // },
                // child: {
                //   tag: "img",
                //   update: async img => {
                //     // const column =
                //
                //     const request = await this.dispatch({
                //       action: "get",
                //       path: [id, "thumb_src"]
                //     });
                //     img.element.src = KarmaFieldsAlpha.Type.toString(request.data);
                //   }
                // }
              // }
            };
          });

        } else {
          grid.children = [];
          grid.element.classList.remove("filled");
        }



      },
      complete: grid => {

        // const selection = this.selectionBuffer.get("ids");
        // const ids = this.getIds(this.selection).join("\n");
        const ids = this.selectionBuffer.get("ids") || [];
        this.ta.value = ids.join("\n");
        if (ids.length) {
          this.ta.focus();
        }
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
        // init: frame => {
        //
        // },
        update: async frame => {
          // this.dispatch({
          //   action: "register-frame",
          //   id: this.resource.key,
          //   field: this,
          //   element: frame.element
          // });

          this.parent.registerCell(frame.element, this, this.resource.key);

          const type = await this.dispatch({
            action: "get",
            path: ["type"]
          }).then(request => KarmaFieldsAlpha.Type.toString(request.data));

          const postType = await this.dispatch({
            action: "get",
            path: ["post_type"]
          }).then(request => KarmaFieldsAlpha.Type.toString(request.data));

          frame.element.classList.toggle("image-type", type.startsWith("image"));
          // frame.element.onclick = event => {
          //   this.dispatch({
          //     action: "open-modal"
          //   });
          // }
          frame.children = [
            {
              tag: "figure",
              update: async figure => {


                figure.element.classList.toggle("dashicons", postType === "karma-folder");
                figure.element.classList.toggle("dashicons-category", postType === "karma-folder");
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
        }
      };
    }

  }



}
