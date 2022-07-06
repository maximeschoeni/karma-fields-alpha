

KarmaFieldsAlpha.fields.table.interface = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);



    this.elementsMap = new KarmaFieldsAlpha.Grid();
    this.fieldsMap = new KarmaFieldsAlpha.Grid();
    this.indexMap = {};


  }



  async importData(data, field) {

    const point = field && this.fieldsMap.find(field) || {};

    const {x, y, width, height} = {...new KarmaFieldsAlpha.Rect(), ...point, ...this.selection};



    // for (let j = 0; j < Math.max(height, data.length); j++) {
    //   for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
    //     const field = this.fieldsMap.get(x + i, y + j);
    //     if (field) {
    //       await field.backup();
    //     }
    //   }
    // }

    // this.parent.grid.save("import-data");
    KarmaFieldsAlpha.History.save();

    for (let j = 0; j < Math.max(height, data.length); j++) {
      for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {

        const field = this.fieldsMap.get(x + i, y + j);

        if (field) {
          const value = data[j%data.length][i%data[j%data.length].length];

          await field.dispatch({
  					action: "set",
  					type: "string",
  					backup: "pack",
  					// autosave: this.resource.autosave,
  					data: [value]
  				});



          // await field.render();
        }
      }
    }

    await this.dispatch({
      action: "edit"
    });

  }



  registerTable(element) {

    this.endSelection();

    this.elementsMap = new KarmaFieldsAlpha.Grid();
    this.fieldsMap = new KarmaFieldsAlpha.Grid();
    this.indexMap = {};

  }

  registerCell(element, col, row, field) {

    this.elementsMap.set(element, col, row);
    this.fieldsMap.set(field, col, row);

    const onMouseUp = event => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
      this.selecting = false;
      this.editSelection();
    }

    const onMouseMove = event => {
      const elementUnderPoint = document.elementFromPoint(event.clientX, event.clientY);
      const target = elementUnderPoint && elementUnderPoint.closest(".td");
      const point = target && this.elementsMap.find(target);
      if (point) {
        this.growSelection({...point, width: 1, height: 1});
      }
    }

    element.onmousedown = event => {
      this.selecting = true;
      if (event.shiftKey) {
        event.preventDefault(); // -> prevent focus lose on TA
        this.growSelection({x: col, y:row, width: 1, height: 1});
      } else {
        this.startSelection({x: col, y:row, width: 1, height: 1});
      }
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
    }

    // element.onfocusin = event => {
    //   this.focusTarget = event.target;
    // }


  }

  registerIndex(element, row) {

    this.indexMap[row] = element;

    const onMouseUp = event => {
      document.removeEventListener("mouseup", onMouseUp);
      this.selecting = false;
      this.editSelection();
    }

    element.onmousedown = event => {
      this.selecting = true;
      if (event.shiftKey) {
        event.preventDefault(); // -> prevent focus lose on TA
        this.growSelection({x: 0, y: row, width: this.elementsMap.width, height: 1});
      } else {
        this.startSelection({x: 0, y: row, width: this.elementsMap.width, height: 1});
      }
      document.addEventListener("mouseup", onMouseUp);
    }

    element.onmouseover = event => {
      if (this.selecting && event.buttons === 1) {
        this.growSelection({x: 0, y: row, width: this.elementsMap.width, height: 1});
      }
    }

  }

  registerHeader(element, col) {

    const onMouseUp = event => {
      document.removeEventListener("mouseup", onMouseUp);
      this.selecting = false;
      this.editSelection();
    }

    element.onmousedown = event => {
      this.selecting = true;
      if (event.shiftKey) {
        event.preventDefault(); // -> prevent focus lose on TA
        this.growSelection({x: col, y: 0, width: 1, height: this.elementsMap.height});
      } else {
        this.startSelection({x: col, y: 0, width: 1, height: this.elementsMap.height});
      }
      document.addEventListener("mouseup", onMouseUp);
    }

    element.onmouseover = event => {
      if (this.selecting && event.buttons === 1) {
        this.growSelection({x: col, y: 0, width: 1, height: this.elementsMap.height});
      }
    }

  }

  registerHeaderIndex(element) {

    const onMouseUp = event => {
      document.removeEventListener("mouseup", onMouseUp);
      this.selecting = false;
      this.editSelection();
    }

    element.onmousedown = event => {
      this.selecting = true;
      this.startSelection({x: 0, y: 0, width:this.elementsMap.width, height:this.elementsMap.height});
      document.addEventListener("mouseup", onMouseUp);
    }

    element.onmouseover = event => {
      if (this.selecting && event.buttons === 1) {
        this.growSelection({x: 0, y: 0, width:this.elementsMap.width, height:this.elementsMap.height});
      }
    }

    // element.onmousedown = event => {
    //   event.preventDefault();
    //   this.toggleSelection({x:0, y:0, width:this.elementsMap.width, height:this.elementsMap.height});
    // }
    //
    // element.onmousemove = event => {
    //   if (event.buttons === 1) {
    //     this.growSelection({x: 0, y :0, width: this.elementsMap.width, height: this.elementsMap.height});
    //   }
    // }
  }

  growSelection(r) {
    if (this.focusRect) {
      r = KarmaFieldsAlpha.Rect.union(this.focusRect, r);
    } else {
      this.focusRect = r;
    }

    // if (!this.selection) {
    //   this.selection = r;
    //   this.paint(this.selection);
    // } else if (!KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
    //   this.unpaint(this.selection);
    //   this.selection = r;
    //   this.paint(this.selection);
    // }


    if (!this.selection || !KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
      // if (this.selection) {
      //   this.unpaint(this.selection);
      // }
      // this.selection = r;
      // if (this.selection.width*this.selection.height > 1) {
      //   this.paint(this.selection);
      // }
      this.deltaSelection(r);
      this.hasSelection = true;
    }


  }

  deltaSelection(r) {
    if (this.selection) {
      this.unpaint(this.selection);
    }
    this.selection = r;
    if (this.selection.width*this.selection.height > 1) {
      this.paint(this.selection);
    }
  }

  startSelection(r) {
    this.focusRect = r;
    // if (this.selection) {
    //   this.unpaint(this.selection);
    // }
    // this.selection = r;
    // if (this.selection.width*this.selection.height > 1) {
    //   this.paint(this.selection);
    // }
    this.deltaSelection(r);
    this.hasSelection = true;
  }

  // toggleSelection(r) {
  //   if (this.selection && KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
  //     this.endSelection();
  //   } else {
  //     this.startSelection(r);
  //   }
  // }

  endSelection() {
    if (this.selection) {
      this.unpaint(this.selection);
      this.selection = null;
      this.hasSelection = false;
    }
  }

  hasRowSelected() {
    return this.selection && this.selection.x === 0 && this.selection.width === this.elementsMap.width || false;
  }
  hasCellsSelected() {
    return this.selection && (this.selection.width*this.selection.height > 1) || false;
  }

  editSelection() {
    const request = this.createEvent({
      action: "edit-selection"
    });

    this.dispatch(request);
    this.render();
  }

  paint(rect) {
    // console.log("paint");
    // console.time("paint");
    for (let j = rect.y; j < rect.y + rect.height; j++) {
      const fullLine = rect.x === 0 && rect.width === this.elementsMap.width;
      if (fullLine && this.indexMap[j]) {
        this.indexMap[j].classList.add("active");
      }
      for (let i = rect.x; i < rect.x + rect.width; i++) {
        let element = this.elementsMap.get(i, j);
        if (element) {
          element.classList.add("selected");
          if (fullLine) {
            element.classList.add("active");
          }
        }
      }
    }
    // console.timeEnd("paint");
  }

  unpaint(rect) {
    // console.log("unpaint");
    // console.time("unpaint");
    for (let j = rect.y; j < rect.y + rect.height; j++) {
      const fullLine = rect.x === 0 && rect.width === this.elementsMap.width;

      if (fullLine) {
        if (this.indexMap[j]) {
          this.indexMap[j].classList.remove("active");
        }
      }
      for (let i = rect.x; i < rect.x + rect.width; i++) {
        let element = this.elementsMap.get(i, j);
        if (element) {
          element.classList.remove("selected");
          if (fullLine) {
            element.classList.remove("active");
          }
        }
      }
    }
    // console.timeEnd("unpaint");
  }

  // throttle(callback, delay = 200) {
	// 	if (this.throttleTimer) {
	// 		clearTimeout(this.throttleTimer);
	// 	}
	// 	this.throttleTimer = setTimeout(callback, delay);
	// }

  // async renderTA() {
  //
  //   const ta = document.createElement("textarea");
  //
  //   ta.onfocusout = event => {
  //     const selection = this.selection;
  //     this.endSelection();
  //     if (selection && (this.selecting || event.shiftKey)) {
  //       this.startSelection(selection);
  //     } else {
  //       this.editSelection();
  //     }
  //   }
  //
  //   ta.oninput = async event => {
  //
  //     let data = ta.element.value.split(/[\r\n]/).map(row => row.split("\t"));
  //
  //     await this.importData(data);
  //
  //     switch (event.inputType) {
  //
  //       case "insertFromPaste":
  //       case "deleteByCut":
  //       case "deleteContentBackward":
  //       case "deleteContentForward":
  //       case "deleteContent":
  //         ta.element.blur();
  //         break;
  //
  //     }
  //
  //   }
  //
  //   const data = [];
  //
  //   if (this.hasCellsSelected()) {
  //
  //     for (let j = 0; j < this.selection.height; j++) {
  //
  //       const dataRow = [];
  //
  //       for (let i = 0; i < this.selection.width; i++) {
  //
  //         const field = this.fieldsMap.get(this.selection.x + i, this.selection.y + j);
  //         const value = await field.exportValue();
  //
  //         dataRow.push(value);
  //
  //       }
  //
  //       data.push(dataRow);
  //
  //     }
  //
  //     ta.element.focus();
  //     ta.element.value = data.map(row => row.join("\t")).join("\n");
  //     ta.element.select();
  //
  //   }
  //
  // }


  buildTA() {
    return {
      tag: "textarea",
      class: "karma-grid-ta2",
      init: ta => {
        this.render = ta.render;

        ta.element.style = "left:-100%;position:absolute;";
        // ta.element.style = "max-height:40px";

        // this.render = clean => {
        //   console.log("render");
        //   ta.render(clean);
        // };

        ta.element.onfocusout = event => {
          const selection = this.selection;
          this.endSelection();
          if (selection && (this.selecting || event.shiftKey)) {
            this.startSelection(selection);
          } else {
            this.editSelection();
          }
        }

        ta.element.oninput = async event => {

          let data = ta.element.value.split(/[\r\n]/).map(row => row.split("\t"));

          await this.importData(data);

          switch (event.inputType) {

            case "insertFromPaste":
            case "deleteByCut":
            case "deleteContentBackward":
            case "deleteContentForward":
            case "deleteContent":
              ta.element.blur();
              break;

          }

        }
      },
      update: async ta => {

        ta.element.blur();


        const data = [];
        // if (this.hasSelection && this.selection && this.selection.width*this.selection.height > 1) {
        // if (this.selection) {

        if (this.hasCellsSelected()) {

          for (let j = 0; j < this.selection.height; j++) {

            const dataRow = [];

            for (let i = 0; i < this.selection.width; i++) {

              const field = this.fieldsMap.get(this.selection.x + i, this.selection.y + j);
              const value = await field.exportValue();

              dataRow.push(value);

            }

            data.push(dataRow);

          }


          ta.element.focus();
          ta.element.value = data.map(row => row.join("\t")).join("\n");
          ta.element.select();



          // this.throttle(() => {
          //   console.log("xx");
          //   ta.element.focus();
          //   ta.element.value = data.map(row => row.join("\t")).join("\n");
          //   ta.element.select();
          // }, 2000);

        // } else if (this.focusTarget) {
        //
        //   ta.element.value = "";
        //   this.focusTarget.focus();
        //   this.focusTarget = null;

        } else {

          // ta.element.value = "";
          // ta.element.blur();


        }
      }
    }
  }


  build(ids, page, ppp, columns) {
    return {
      class: "table grid",
      init: async grid => {

        // this.grid.render = grid.render;

        if (this.resource.style) {
          grid.element.style = this.resource.style;
        }

        // if (this.resource.style) {
        //   grid.element.style = this.resource.style;
        // } else if (this.resource.grid && this.resource.grid.style) {
        //   grid.element.style = this.resource.grid.style;
        // }
      },
      update: async grid => {


        // const ids = await this.getIds();
        // const page = this.getPage();
        // const ppp = this.getPpp();
        // const columns = this.getColumns();
        // const order = this.getOrder();
        // const orderby = this.getOrderby();

        this.registerTable(grid.element);

        if (ids.length) {
          grid.element.classList.add("filled"); // -> draw table borders
          grid.children = [
            {
              class: "th",
              child: {
                class: "table-index",
                init: node => {
                  node.element.textContent = "#";
                }
              },
              update: th => {
                this.registerHeaderIndex(th.element);
              }
            },
            ...columns.map((colId, colIndex) => {
              const child = this.resource.children[colId];
              return {
                class: "th table-header-cell",
                init: th => {
                  if (child.style) {
                    th.element.style = child.style;
                  }
                },
                update: th => {
                  th.children = [
                    {
                      tag: "a",
                      class: "header-cell-title",
                      init: a => {
                        a.element.textContent = child.label;
                      }
                    },
                  ];
                  if (child.sortable) {

                    th.children.push(this.createChild({
                      type: "sorter",
                      id: "sorter-"+(child.orderby || child.key),
                      key: child.orderby || child.key,
                      order: child.order
                    }).build());

                  }
                  this.registerHeader(th.element, colIndex);
                }
              }
            }),
            ...ids.reduce((children, id, rowIndex) => {

              const row = this.createChild({
                key: id,
                type: "row",
                children: this.resource.children || [],
                id: id
              });
              return [
                ...children,
                {
                  class: "th",
                  child: {
                    class: "table-index",
                    update: node => {
                      node.element.textContent = (Number(page) - 1)* Number(ppp) + rowIndex + 1;
                    }
                  },
                  update: th => {
                    this.registerIndex(th.element, rowIndex);
                  }
                },
                ...columns.map((colId, colIndex) => {
                  const child = this.resource.children[colId];
                  const field = row.createChild({
                    ...child,
                    id: colId,
                    index: colIndex
                  });

                  return {
                    class: "td table-cell",
                    init: td => {
                      if (child.style) {
                        td.element.style = child.style;
                      }
                    },
                    update: td => {
                      this.registerCell(td.element, colIndex, rowIndex, field);
                    },
                    // child: field.build()
                    children: [
                      field.build(),
                      // {
                      //   tag: "span",
                      //   class: "dashicons dashicons-cloud"
                      // }
                    ]
                  };
                })
              ];
            }, [])
          ];

          grid.element.style.gridTemplateColumns = [
            this.resource.index && this.resource.index.width || "50px",
            ...columns.map(index => this.resource.children[index].width || "auto")
          ].join(" ");

        } else {
          grid.children = [];
          grid.element.classList.remove("filled");
        }
      }
    };
  }



  async dispatch(event, parent) {

    switch (event.action) {

      case "set":

        if (event.field.resource.type === "input" && event.pasted) {


          const value = KarmaFieldsAlpha.Type.toString(event.data);
          const data = value.split(/[\r\n]/).map(row => row.split("\t"));




          // if (data.length > 1 || data[0].length > 1) {

            // await this.dispatch(this.createEvent({
            //   action: "importselection",
            //   data: data,
            //   field: event.target
            // }));
            await super.dispatch({
              action: "importselection",
              data: data,
              field: event.field
            });

            break;

          // }

        }



        await super.dispatch(event);


        // -> render controls + interface
        // await super.dispatch(this.createEvent({
        //   action: "edit-grid",
        //   request: event
        // }));

        break;

      default:
        await super.dispatch(event);
        break;

    }

    return event;
  }

  static sorter = class extends KarmaFieldsAlpha.fields.field {


    build() {
      return {
        tag: "a",
        class: "header-cell-order",
        child: {
          tag: "span",
          class: "dashicons",
          update: span => {
            const order = KarmaFieldsAlpha.Nav.get("order");
            const orderby = KarmaFieldsAlpha.Nav.get("orderby");
            const isAsc = orderby === this.resource.key && order === "asc";
            const isDesc = orderby === this.resource.key && order === "desc";
            span.element.classList.toggle("dashicons-arrow-up", isAsc);
            span.element.classList.toggle("dashicons-arrow-down", isDesc);
            span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
          }
        },
        update: a => {
          a.element.onclick = async event => {
            event.preventDefault();
            a.element.parentNode.classList.add("loading");

            await this.dispatch({
              action: "order",
              order: this.resource.order,
              path: [this.resource.orderby || this.resource.key]
            });
            a.element.parentNode.classList.remove("loading");
          };
        }
      }
    }
  }

  static row = class extends KarmaFieldsAlpha.fields.field {


    async dispatch(event) {

      switch (event.action) {

        // case "get":
        //   if (event.path && event.path[event.path.length-1] === "id") {
        //     if (event.join) {
        //       await super.dispatch({
        //         action: "join",
        //         data: event.join,
        //         path: [...event.path]
        //       });
        //     }
        //     event.data = [this.resource.key];
        //     break;
        //   }
        //
        //   await super.dispatch(event);
        //   break;

        default:
          await super.dispatch(event);
          break;

      }


      return event;
    }

  }


}
