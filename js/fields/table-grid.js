
KarmaFieldsAlpha.fields.tableGrid = class extends KarmaFieldsAlpha.fields.formHistory {

  constructor(...params) {
    super(...params);

    this.grid = new KarmaFieldsAlpha.Grid();
    this.colMap = new Map();
    this.rowMap = new Map();

  // }
  //
  // createTA() {


    this.ta = document.createElement("textarea");
    this.ta.className = "karma-grid-ta";
    document.body.appendChild(this.ta);


    this.ta.onfocusout = event => {
      this.endSelection();
    }

    this.ta.oninput = async event => {

      let data = this.ta.value.split(/[\r\n]/).map(row => row.split("\t"));

      await this.importSelection(data, this.selection || {});

      switch (event.inputType) {

        case "insertFromPaste":
        case "deleteByCut":
        case "deleteContentBackward":
        case "deleteContentForward":
        case "deleteContent":
          this.ta.blur();

      }

      this.setState(null, "edit");
    }

  }


  async updateTA() {

    const data = [];


    // const ids = await table.getIds();
    const ids = await this.parent.get("ids");

    if (this.selection) {

      for (let j = 0; j < this.selection.height; j++) {

        const dataRow = [];
        const id = ids[this.selection.y+j];
        const row = this.getChild(id);

        for (let i = 0; i < this.selection.width; i++) {

          const field = row.children.find(child => child.resource.index === table.grid.selection.x+i);
          const value = await field.exportValue();

          dataRow.push(value);

        }

        data.push(dataRow);

      }

    }

    this.ta.focus();
    this.ta.value = data.map(row => row.join("\t")).join("\n");
    this.ta.select();

  }

  async setState(value, ...path) {

    const state = path.pop();

    switch (state) {

      case "pastedValue":
        this.pastedValue = true;
        break;

      default:
        await this.setState(value, ...path, state);
        break;

    }

  }

  async set(value, ...path) {

    if (this.pastedValue) {
      this.pastedValue = false;
      const data = value[0].split(/[\r\n]/).map(row => row.split("\t"));
      const field = this.getChild(...path);
      const index = this.resource.columns.find(column => column.field.resource.key === path.pop()).field.index;
      const point = {
        x: this.grid.colMap(field),
        y: this.grid.rowMap(field),
      };
      await this.importSelection(data, point);
      break;

    }


    switch (context) {

      // case "value":
      //   await this.super.set(value, ...path, context); // -> buffer
      //   break;

      case "pastedvalue":
        const data = value[0].split(/[\r\n]/).map(row => row.split("\t"));
        const field = this.getChild(...path);
        const point = {
          x: this.grid.colMap(field),
          y: this.grid.rowMap(field),
        };
        await this.importSelection(data, point);
        break;

      case "set":



      default:
        await this.super.set(value, ...path, context);
        break;

    }

  }

  async importSelection(data, selection) {

    const r = new KarmaFieldsAlpha.Rect();

    const {x, y, width, height} = {...r, ...selection};

    let ids = await super.get("ids");

    // for (let j = 0; j < Math.max(height, data.length); j++) {
    //   const rowField = this.getChild(ids[j+y]);
    //   if (rowField) {
    //     for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
    //       const cellField = rowField.children[i+x];
    //       if (cellField) {
    //         await cellField.write();
    //       }
    //     }
    //   }
    // }
    //
    // if (data.length > ids.length-y) {
    //   await this.add(data.length-(ids.length-y), false); // -> will backup
    //   ids = await this.getIds();
    // } else {
    //   KarmaFieldsAlpha.History.backup();
    //   KarmaFieldsAlpha.History.id = null;
    // }




    // if (KarmaFieldsAlpha.History.id !== selection) {
    //
    //   KarmaFieldsAlpha.History.id = selection;

      for (let j = 0; j < Math.max(height, data.length); j++) {
        const rowField = this.getChild(ids[j+y]);
        if (rowField) {
          for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
            const cellField = rowField.children[i+x];
            if (cellField) {
              await cellField.write();
            }
          }
        }
      }

      this.nextup(selection);

    //   KarmaFieldsAlpha.History.backup();
    //
    // }

    for (let j = 0; j < Math.max(height, data.length); j++) {
      const rowField = this.getChild(ids[j+y]);
      if (rowField) {
        for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
          const cellField = rowField.children[i+x];
          if (cellField) {
            const value = data[j%data.length][i%data[j%data.length].length];

            // console.log(value, cellField.getPath(), i, x);
            await cellField.importValue(value);
            await cellField.render();
          }
        }
      }

    }

  }





  registerTable(element) {

    this.endSelection();

    this.grid = new KarmaFieldsAlpha.Grid();
    this.fields = new KarmaFieldsAlpha.Grid();

    this.colMap = new Map();
    this.rowMap = new Map();

    // element.onmouseup = event => {
    //   if (this.selection) {
    //     if (this.selection.width === 1 && this.selection.height === 1) {
    //       this.endSelection();
    //     }
    //     super.edit("grid");
    //   }
    // }

  }


  registerCell(element, col, row, field) {

    this.grid.set(col, row, element);
    this.colMap.set(field, col);
    this.rowMap.set(field, row);

    element.onmousedown = event => {
      this.endSelection();
    }

    element.onmousemove = event => {
      if (event.buttons === 1) {
  			this.growSelection({x: col, y:row, width: 1, height: 1});
  		}
		}

  }

	registerIndex(element, row) {

    // element.onmousedown = event => {
    //   event.preventDefault();
		// 	this.toggleSelection({x: 0, y: row, width: this.grid.width, height: 1});
    //   // this.table.renderFooter();
		// }

		element.onmousemove = event => {
      if (event.buttons === 1) {
  			this.growSelection({x: 0, y: row, width: this.grid.width, height: 1});
      }
		}
  }

	registerHeader(element, col) {

    // element.onmousedown = event => {
    //   event.preventDefault();
		// 	this.toggleSelection({x: col, y: 0, width: 1, height: this.grid.height});
    //   // this.table.renderFooter();
		// }

		element.onmousemove = event => {
      if (event.buttons === 1) {
  			this.growSelection({x: col, y: 0, width: 1, height: this.grid.height});
      }
		}
  }

	registerHeaderIndex(element) {

    // element.onmousedown = event => {
    //   event.preventDefault();
		// 	this.toggleSelection({x:0, y:0, width:this.grid.width, height:this.grid.height});
    //   // this.table.renderFooter();
		// }

		element.onmousemove = event => {
      if (event.buttons === 1) {
  			this.growSelection({x: 0, y :0, width: this.grid.width, height: this.grid.height});
      }
		}
  }


	growSelection(r) {

    // if (this.selection) {
		// 	this.unpaint(this.selection);
		// }



    if (this.focusRect) {
      r = KarmaFieldsAlpha.Rect.union(this.focusRect, r);
    } else {
      this.focusRect = r;
    }

    if (r.width*r.height > 1) {

      if (this.selection) {

        if (!KarmaFieldsAlpha.Rect.equals(this.selection, r)) {

          this.unpaint(this.selection);
          this.selection = r;
          this.paint(this.selection);
          super.edit("grow-selection");

        }

      } else {

        this.selection = r;
        this.paint(this.selection);
        super.edit("grow-selection");

      }

    } else if (this.selection) {

      this.unpaint(this.selection);
      this.selection = null;
      super.edit("grow-selection");

    }

    // if (this.selection) {
    //
    //   if (!KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
    //
    //     this.unpaint(this.selection);
    //
    //     if (r.width*r.height > 1) {
    //
    //       this.selection = r;
    //       this.paint(this.selection);
    //
    //
    //     } else {
    //
    //       this.selection = null;
    //
    //     }
    //
    //     super.edit("grow-selection");
    //
    //   }
    //
    // } else {
    //
    //   if (r.width*r.height > 1) {
    //
    //     this.selection = r;
    //     this.paint(this.selection);
    //
    //     super.edit("grow-selection");
    //
    //   }
    //
    //
    //
    // }

    // if (!this.selection) {
    //
    //   this.selection = r;
    //   // this.paint(this.selection);
    //   super.edit("start-selection");
    //
    // } else if (!KarmaFieldsAlpha.Rect.equals(this.selection, r) && r.width*r.height > 1) {
    //
    //
    //   this.selection = r;
    //   this.paint(this.selection);
    //   super.edit("grow-selection");
    //
    // }

	}

  endSelection() {

		if (this.selection) {
			this.unpaint(this.selection);
      this.selection = null;
  		this.focusRect = null;

      super.edit("end-selection");
		}

	}

	// toggleSelection(r) {
  //
	// 	if (this.selection && KarmaFieldsAlpha.Rect.equals(r, this.selection)) {
  //     this.endSelection();
	// 	} else {
  //     this.endSelection();
	// 		this.growSelection(r);
	// 	}
  //
	// }




	paint(rect) {
		for (let i = rect.x; i < rect.x + rect.width; i++) {
			for (let j = rect.y; j < rect.y + rect.height; j++) {
				let element = this.grid.get(i, j);
				if (element) {
					element.classList.add("selected");
				}
			}
		}
	}

	unpaint(rect) {
		for (let i = rect.x; i < rect.x + rect.width; i++) {
			for (let j = rect.y; j < rect.y + rect.height; j++) {
				let element = this.grid.get(i, j);
				if (element) {
					element.classList.remove("selected");
				}
			}
		}
	}


  getIndexWidth() {
    return this.resource.index && this.resource.index.width || "50px";
  }

  build() {
    return {
      class: "table grid",
      init: async grid => {
        this.render = grid.render;
        if (this.resource.style) {
          grid.element.style = this.resource.style;
        }
      },
      update: async grid => {



        // const ids = await this.parent.fetchValue(null, "ids");
        // const page = await this.parent.fetchValue(null, "page");
        // const ppp = await this.parent.fetchValue(null, "ppp");
        // const columns = await this.parent.fetchValue(null, "columns");
        // const order = await this.parent.fetchValue(null, "order");
        // const orderby = await this.parent.fetchValue(null, "orderby");

        const ids = await this.get("ids");
        const page = await this.get("page");
        const ppp = await this.get("ppp");
        const columns = await this.get("columns");
        const order = await this.get("order");
        const orderby = await this.get("orderby");


        console.log(ids, page, ppp, columns, order, orderby);




        this.registerTable(grid.element);
        // this.manager.endSelection();
        // this.manager.grid = new KarmaFieldsAlpha.Grid();
        // this.manager.fields = new KarmaFieldsAlpha.Grid();
        //
        // grid.element.onmouseup = event => {
        //   if (this.manager.selection) {
        //     if (this.manager.selection.width === 1 && this.manager.selection.height === 1) {
        //       this.manager.endSelection();
        //     }
        //     this.renderFooter();
        //   }
        // }


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
                // th.element.onmousedown = event => {
                //   event.preventDefault();
                // 	this.manager.toggleSelection({x: 0, y: 0, width: this.manager.grid.width, height: this.manager.grid.height});
                //   this.renderFooter();
                // }
                // th.element.onmousemove = event => {
                //   if (event.buttons === 1) {
                // 		this.manager.growSelection({x: 0, y :0, width: this.manager.grid.width, height: this.manager.grid.height});
                //   }
                // }
              }

            },
            ...columns.map((colId, colIndex) => {
              const column = this.resource.columns[colId];
              return {
                class: "th table-header-cell",
                init: th => {
                  if (column.style) {
                    th.element.style = column.style;
                  }
                },
                update: th => {
                  th.children = [
                    {
                      tag: "a",
                      class: "header-cell-title",
                      init: a => {
                        a.element.textContent = column.title;
                      }
                    },
                  ];
                  if (column.sortable) {
                    th.children.push({
                      tag: "a",
                      class: "header-cell-order",
                      child: {
                        tag: "span",
                        class: "dashicons",
                        update: span => {
                          // const order = this.getParam("order");
                          // const orderby = this.getParam("orderby");
                          const isAsc = orderby.toString() === (column.orderby || column.field.key) && order.toString() === "asc";
                          const isDesc = orderby.toString() === (column.orderby || column.field.key) && order.toString() === "desc";
                          span.element.classList.toggle("dashicons-arrow-up", isAsc);
                          span.element.classList.toggle("dashicons-arrow-down", isDesc);
                          span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
                        }
                      },
                      update: a => {
                        a.element.onclick = async event => {
                          event.preventDefault();
                          a.element.parentNode.classList.add("loading");
                          // this.reorder(column);
                          const key = column.orderby || column.field.key;
                          if (key) {
                            if (orderby.toString() === key) {
                              this.setParam(order.toString() === "asc" ? "desc" : "asc", "order");
                            } else {
                              this.setParam(column.order || "asc", "order");
                              this.setParam(key, "orderby");
                            }
                            if (page !== 1) {
                              this.setParam(1, "page");
                            }
                          }
                          await this.parent.edit("order");
                          a.element.parentNode.classList.remove("loading");
                        };
                      }
                    });
                  }
                  this.registerHeader(th.element, colIndex);
                  // th.element.onmousedown = event => {
                  //   event.preventDefault();
                  // 	this.manager.toggleSelection({x: colIndex, y: 0, width: 1, height: this.manager.grid.height});
                  //   this.renderFooter();
                  // }
                  // th.element.onmousemove = event => {
                  //   if (event.buttons === 1) {
                  // 		this.manager.growSelection({x: colIndex, y: 0, width: 1, height: this.manager.grid.height});
                  //   }
                  // }
                }
              }
            }),
            ...ids.reduce((children, id, rowIndex) => {
              // const row = this.getRow(id);
              const row = this.form.createChild({
                key: rowIndex,
                type: "field",
                columns: this.resource.columns || []
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
                    // th.element.onmousedown = event => {
                    //   event.preventDefault();
                    // 	this.manager.toggleSelection({x: 0, y: rowIndex, width: this.manager.grid.width, height: 1});
                    //   this.renderFooter();
                    // }
                    // th.element.onmousemove = event => {
                    //   if (event.buttons === 1) {
                    // 		this.manager.growSelection({x: 0, y: rowIndex, width: this.manager.grid.width, height: 1});
                    //   }
                    // }
                  }
                },
                ...columns.map((colId, colIndex) => {
                  // const field = currentTable.grid.getRow(id).children[colIndex];
                  const column = this.resource.columns[colId];
                  const field = row.createChild({
                    ...column.field,
                    id: colId,
                    index: colIndex
                  });

                  return {
                    class: "td table-cell",
                    init: td => {
                      if (column.style) {
                        td.element.style = column.style;
                      }
                    },
                    update: td => {
                      this.registerCell(td.element, colIndex, rowIndex, field);
                      // this.manager.grid.set(colIndex, rowIndex, td.element);
                      // this.manager.fields.set(colIndex, rowIndex, field);
                      // td.element.onmousedown = event => {
                      //   if (this.manager.selection) {
                      //     this.manager.endSelection();
                      //   }
                      // }
                      // td.element.onmousemove = event => {
                      //   if (event.buttons === 1) {
                      // 		this.manager.growSelection({x: colIndex, y:rowIndex, width: 1, height: 1});
                      // 	}
                      // }
                    },
                    child: field.build()
                  };
                })
              ];
            }, [])
          ];

          grid.element.style.gridTemplateColumns = [this.getIndexWidth(), ...columns.map(index => this.resource.columns[index].width || "auto")].join(" ");

        } else {
          grid.children = [];
          grid.element.classList.remove("filled");
        }
      }
    };
  }



}
