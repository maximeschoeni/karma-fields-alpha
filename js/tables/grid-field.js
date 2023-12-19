
KarmaFieldsAlpha.field.gridField = class extends KarmaFieldsAlpha.field.grid {

  getParams() {

    // return KarmaFieldsAlpha.Store.Layer.getCurrent("params");


    const params = this.parse(this.resource.params);

    // console.log(params);

    return params;

  }

  getParam(key) {

    const params = this.getParams();

    if (!params.loading) {

      return params.toObject()[key];

    }

    return "";

  }

  setParam(value, key) {

    // KarmaFieldsAlpha.Store.Layer.setParam(value, key);
    //
    // this.request("render");

  }

  // getFilters() {
  //
  //   // const {page, ppp, order, orderby, ...params} = KarmaFieldsAlpha.Store.Layer.getParams() || {};
  //
  //   return this.getParams();
  //
  // }



  build() {

    return {
      class: "grid-field",
      children: [
        {
          class: "table grid grid-field-body",
          init: grid => {
            if (this.resource.style) {
              grid.element.style = this.resource.style;
            }
            if (this.resource.width) {
              grid.element.style.width = this.resource.width;
            }
          },
          update: grid => {

            const query = this.getQuery();

            grid.element.classList.toggle("loading", Boolean(query.loading));
            grid.element.classList.toggle("active", Boolean(this.hasFocus()));

            // const itemsUnder = this.request("tunnel", -1, "getSelectedItems");

            if (!query.loading) {

              const items = query.toItems();

              const page = this.request("getPage");
              const ppp = this.getPpp();
              const offset = (page - 1)*ppp;

              let selection = this.getSelection();

              grid.element.classList.toggle("even", items.length%2 === 0);
              // grid.element.classList.toggle("odd", items.length%2 === 1);

              const selector = new KarmaFieldsAlpha.RowPicker(grid.element, selection);

              selector.header = 1;
              selector.width = this.resource.children.length;

              selector.onSelect = elements => {

                elements.map(element => element.classList.add("selected"));
                this.setSelection(selector.state.selection);

              }

              selector.onUnselect = elements => {

                elements.map(element => element.classList.remove("selected"));

              }

              selector.onSelectionComplete = () => {

                // this.useClipboard();

                this.setFocus(true);
                // this.request("deferFocus");
                this.request("render");

              }

              if (items.length) {
                grid.element.classList.add("filled"); // -> draw table borders

                const columns = this.resource.children || [];

                grid.children = [];

                for (let i = 0; i < columns.length; i++) {

                  const resource = columns[i];

                  grid.children.push({
                    class: "th table-header-cell",
                    init: th => {
                      if (resource.style) {
                        th.element.style = resource.style;
                      }
                      th.element.tabIndex = -1;
                    },
                    update: th => {
                      th.element.classList.toggle("first-cell", i === 0);
                      th.element.classList.toggle("last-cell", i === columns.length - 1);
                      th.children = [
                        {
                          class: "header-cell-content title",
                          init: a => {
                            a.element.textContent = resource.label;
                          }
                        },
                        {
                          class: "header-cell-content order",
                          child: {
                            tag: "span",
                            class: "dashicons",
                            update: span => {
                              const order = this.getOrder() || "asc";
                              const orderby = this.getOrderby();
                              const isAsc = orderby === (resource.orderby || resource.key) && order === "asc";
                              const isDesc = orderby === (resource.orderby || resource.key) && order === "desc";
                              span.element.classList.toggle("dashicons-arrow-up", isAsc);
                              span.element.classList.toggle("dashicons-arrow-down", isDesc);
                              span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
                            }
                          },
                          update: a => {
                            a.element.classList.toggle("hidden", !resource.sortable);
                            if (resource.sortable) {
                              a.element.onmousedown = event => {
                                event.stopPropagation(); // -> prevent header selection
                              }
                              a.element.onclick = event => {
                                // debugger;
                                event.preventDefault();
                                this.toggleOrder(resource.orderby || resource.key, resource.order);
                                this.select();
                              };
                            }
                          }
                        }
                      ];
                    }
                  });
                }

                for (let i = 0; i < items.length; i++) {

                  const row = this.createChild({
                    id: items[i].id,
                    loading: items[i].loading,
                    type: "row",
                    children: columns,
                    index: offset + i,
                    rowIndex: offset + i
                  }, i);

                  const isRowSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, i);

                  for (let j = 0; j < columns.length; j++) {

                    const field = row.createChild(columns[j], j);


                    grid.children.push({
                      class: "td table-cell",
                      init: td => {
                        if (columns[j].style) {
                          td.element.style = columns[j].style;
                        }
                      },
                      update: td => {
                        td.element.classList.toggle("selected", Boolean(isRowSelected));
                        td.element.classList.toggle("odd", i%2 === 0);
                        td.element.classList.toggle("last-row", i === items.length-1);
                        td.element.classList.toggle("first-cell", j === 0);
                        td.element.classList.toggle("last-cell", j === columns.length - 1);
                      },
                      child: field.build()
                    });


                  }

                }

                // const footerCells = this.buildFooterCells(columns);



                // if (this.resource.footer) {
                //
                //   grid.children.push({
                //     class: "tf table-cell",
                //     init: node => {
                //       node.element.style.gridColumn = `span ${columns.length}`;
                //     },
                //     child: this.createChild(this.resource.footer, "footer").build()
                //   });
                //
                // }

                grid.element.style.gridTemplateColumns = columns.map(resource => resource.width || "auto").join(" ");

              } else {
                grid.children = [];
                grid.element.classList.remove("filled");
              }

            }

          }

        },
        {
          class: "grid-field-footer simple-buttons",
          update: node => {
            if (this.resource.footer !== false) {
              node.child = this.createChild({
                type: "group",
                display: "flex",
                children: ["add", "delete"],
                ...this.resource.footer
              }, "footer").build();
            }
          }
        }
      ]
    };

  }
  //
  // buildFooterCells(columns) {
  //
  //   if (this.resource.footer) {
  //
  //     return [{
  //       class: "tf table-cell",
  //       init: node => {
  //         node.element.style.gridColumn = `span ${columns.length}`;
  //       },
  //       child: this.createChild(this.resource.footer, "footer");
  //     }]
  //
  //   }
  //
  //
  // }

}


KarmaFieldsAlpha.field.gridField.add = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      request: ["add"],
      title: "Add",
      text: "Add",
      ...resource
    });
  }
}

KarmaFieldsAlpha.field.gridField.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      request: ["delete"],
      title: "Delete",
      text: "Delete",
      enabled: ["request", "getSelectedItems"],
      ...resource
    });
  }

}
