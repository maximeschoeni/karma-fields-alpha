
KarmaFieldsAlpha.fields.table.tableContent = class extends KarmaFieldsAlpha.fields.form {

  getMask(id, key) {
		// if (key  === "trash") {
		// 	return "1";
		// }

    switch (key) {
      case "trash": return "1";
      case "extra": return "1";
    }
	}

  async edit() {
    await this.table.renderFooter();
  };

  getExtraIds() {
    // const ids = [];
    // const delta = this.getDeltaValue();
    // for (let id in delta) {
    //   if (delta[id].extra) {
    //     ids.push(id);
    //   }
    // }
    // return ids;
    const delta = this.getDeltaValue() || {};
    return Object.entries(delta).filter(([id, row]) => row && row.extra).map(([id, row]) => id);
  }

  updateIds() {

    const extraIds = this.getExtraIds();

    // extraIds.forEach(id => {
    //   this.registerValue("1", id, "trash");
    //   // KarmaFieldsAlpha.Gateway.setOriginal("1", this.resource.driver, id, "trash");
    // });
    this.ids = [
      ...extraIds.filter(id => !this.table.queriedIds.includes(id)),
      ...this.table.queriedIds
    ].filter(id => this.getValue(id, "trash") === "0"); // trash may be set in originals
  }

  hasIndex() {
    return this.table.resource.index || this.table.resource.index === undefined;
  }

  getIndexTitle() {
    return this.table.resource.index && this.table.resource.index.title || "#";
  }

  getIndexWidth() {
    return this.table.resource.index && this.table.resource.index.width || "auto";
  }

  getColumns() {
    return this.table.resource.columns || [];
  }

  hasHeader() {
    return true;
  }

  buildHeaderCell(column) {
    return {
      class: "th karma-field",
      update: th => {
        th.children = [
          {
            tag: "a",
            class: "header-cell-title",
            init: a => {
              a.element.textContent = column.title;
            }
          }
        ];
        if (column.sortable) {
          th.children.push(this.table.getButton("orderLink").build(column));
        }
      }
    };
  }

  buildIndexCell(rowIndex) {
    return {
      class: "th table-row-index karma-field",
      update: th => {
        if (rowIndex < 0) {
          th.element.textContent = "+";
        } else {
          let page = parseInt(this.table.getPage());
          let ppp = parseInt(this.table.getPpp());
          th.element.textContent = (page - 1)*ppp + rowIndex + 1;
        }
      }
    };
  }

  buildGrid() {
    return {
      class: "table grid",
      init: async grid => {
        if (this.table.resource.style) {
					grid.element.style = this.table.resource.style;
				}
      },
      update: async grid => {
        grid.children = [];

        // await new Promise(resolve => setTimeout(resolve, 1000000));

        await (this.table.queryPromise || this.table.query());

        // this.updateIds();
        this.ids = this.table.queriedIds.filter(id => this.getValue(id, "trash") !== "1");

        const extras = this.getExtra();

        for (let id in extras) {

          // const extra = KarmaFieldsAlpha.DeepObject.clone(extras[id], this.getDeltaValue(id));

          if (this.getDeltaValue(id, "trash") !== "1") {
            this.ids.splice(extras[id].index || 0, 0, id);
          }
        }

        // extraIds.forEach(id => {
        //   this.registerValue("1", id, "trash");
        //   // KarmaFieldsAlpha.Gateway.setOriginal("1", this.resource.driver, id, "trash");
        // });
        // this.ids = [
        //   ...extraIds.filter(id => !this.table.queriedIds.includes(id)),
        //   ...this.table.queriedIds
        // ].filter(id => this.getValue(id, "trash") === "0"); // trash may be set in originals


        const rows = this.ids.map(id => this.table.getRow(id));

        if (rows.length) {

          grid.element.classList.add("filled"); // -> draw table borders



          // table header index cell
          if (this.hasIndex() && this.hasHeader()) {
            grid.children.push({
              class: "th table-header-index karma-field",
              init: th => {
                th.element.textContent = this.getIndexTitle();
              }
            });
          }

          // table header cells
          if (this.hasHeader()) {
            this.getColumns().forEach((column, colIndex) => {
              grid.children.push(this.buildHeaderCell(column));
            });
          }

          let index = 0;

          rows.forEach(rowField => {
            if (this.hasIndex()) {
              let rowIndex = rowField.getValue("trash") !== "1" && ++index;
              grid.children.push({
                class: "th table-row-index karma-field",
                update: th => {
                  th.element.textContent = rowIndex && (parseInt(this.table.getPage()) - 1)*parseInt(this.table.getPpp()) + rowIndex || "+";
                }
              });
            }

            this.getColumns().forEach((column, colIndex) => {
              const cellField = rowField.children[colIndex];
              if (cellField) {
                grid.children.push(cellField.build());
              }
            });
          });

        }

        grid.element.style.gridTemplateColumns = (this.hasIndex() && this.hasHeader() && [this.getIndexWidth()] || []).concat(this.getColumns().map((column) => {
          return column.width || "1fr";
        })).join(" ");



      },
      complete: grid => {

        // grid.element.classList.remove("loading");
        // grid.element.classList.add("ready");

        this.table.select.registerTable(grid.element, this.getColumns().length, this.children.length, this.hasIndex(), this.hasHeader());
      }
    };

  }

  build() {
    return {
      class: "table-body",
      init: body => {
        this.render = body.render;
      },
      child: this.buildGrid(),
      // update: async body => {
      //
      //   body.element.classList.add("loading");
      //   await (this.table.queryPromise || this.table.query());
      //
      //   if (this.table.queriedIds && this.table.queriedIds.length || this.table.getExtraIds().length) {
      //     body.child = this.buildGrid();
      //   } else {
      //     body.child = null;
      //   }
      // },
      complete: () => {
        this.table.renderFooter(); // -> double render footer about always !
      }
    }
  }




  // setValue(value, rowId, key) {
  //
  //   const field = this.find(rowId, key);
  //
  //   if (field.constructor === KarmaFieldsAlpha.fields.input) {
  //
  //     this.table.getSelectedRowIds().forEach(id => {
  //       super.setValue(value, id, key);
  //       if (id !== rowId) {
  //         this.find(id, key).render();
  //       }
  //     });
  //
  //   } else {
  //
  //     super.setValue(value, rowId, key);
  //
  //   }
  //
  // }
  //
  // backup(id, key) {
  //
	// 	const historyId = id+"/"+key;
  //
	// 	if (historyId !== this.historyId) {
  //
	// 		this.historyId = historyId;
  //
  //     this.table.getSelectedRowIds().forEach(id => {
  //       this.write(id, key);
  //     });
  //
	// 		KarmaFieldsAlpha.History.backup();
	// 	}
	// }




}
