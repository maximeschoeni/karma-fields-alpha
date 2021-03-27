KarmaFieldsAlpha.fields.array = function(field) {
  let value;
  let rows = [];

  let sortManager = {
    getRow: function(index) {
      let children = Array.from(sortManager.table.children);
      if (index+1 > 0 && index+1 < children.length/this.width) {
        return children.slice(this.width*(index+1), this.width*(index+2));
      }
    },
    getRowIndex: function(cell) {
      var index = 0;
      while (cell.previousElementSibling) {
        cell = cell.previousElementSibling;
        index++;
      }
      return Math.floor(index/this.width - 1);
    },
    mousedown: function(element, event) {
      let mouseX = event.clientX;
      let mouseY = event.clientY;
      let rowIndex = sortManager.getRowIndex(element);
      let mousemove = function(event) {
        let index = sortManager.getRowIndex(element);
        let row = sortManager.getRow(index);
        let prevRow = sortManager.getRow(index-1);
        let nextRow = sortManager.getRow(index+1);
        if (row) {
          let diffX = event.clientX - mouseX;
          let diffY = event.clientY - mouseY;
          if (prevRow && diffY < -prevRow[0].clientHeight/2) {
            row.forEach(function(cell) {
              cell.parentNode.insertBefore(cell, prevRow[0]);
            });
            mouseY -= prevRow[0].clientHeight;
            diffY = event.clientY - mouseY;
          }
          if (nextRow && diffY > nextRow[0].clientHeight/2) {
            nextRow.forEach(function(cell) {
              cell.parentNode.insertBefore(cell, row[0]);
            });
            mouseY += nextRow[0].clientHeight;
            diffY = event.clientY - mouseY;
          }
          row.forEach(function(cell) {
            cell.style.transform = "translate("+diffX+"px, "+diffY+"px)";
          });
        }
      };
      let mouseup = function() {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
        let index = sortManager.getRowIndex(element);
        let row = sortManager.getRow(index);
        row.forEach(function(cell) {
          cell.style.transform = "none";
          // cell.classList.remove("flying");
        });
        value = field.getValue();
        let items = value[rowIndex];
        value.splice(rowIndex, 1);
        value.splice(index, 0, items);
        field.setValue(value);

        sortManager.array.render();
      };
      // sortManager.getRow(rowIndex).forEach(function(cell) {
      //   cell.classList.add("flying");
      // });
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
    }
  };

  return {
    class: "karma-field-array",
    init: function(array) {
      field.fetchValue().then(function(value) {
        if (!value && field.resource.default) {
          field.setValue(field.resource.default);
        }
        array.render();
      });
      sortManager.array = array;
    },
    kids: [
      {
        className: "table",
        clear: true,
        update: function(table) {
          this.kids = [];

          // CSS Grid Layout
          let templateColumns = [];
          if (field.resource.sortable) {
            templateColumns.push("40px");
          }
          field.resource.columns.forEach(function(column, colIndex) {
            templateColumns.push(column.width || "1fr");
          });
          templateColumns.push("40px");
          this.style.gridTemplateColumns = templateColumns.join(" ");

          // Header (labels)
          if (field.resource.columns.some(function(column) {
            return column.label;
          })) {
            if (field.resource.sortable) {
              table.kids.push({
                className: "th table-index"
              });
            }
            field.resource.columns.forEach(function(column) {
              table.kids.push({
                className: "th",
                init: function() {
                  if (column.style) {
                    this.style = column.style;
                  }
                },
                kid: {
                  tag: "a",
                  init: function() {
                    this.textContent = column.label || "";
                  }
                }
              });
            });
            table.kids.push({
              className: "th"
            });
          }

          // Body
          let columns = field.getAttribute("columns") || [];
          value = field.getValue() || [];

          if (typeof value !== 'object') {
            value = [value];
          }


          sortManager.table = table;
          sortManager.width = columns.length + 2;
          sortManager.height = value.length;

          value.forEach(function(item, rowIndex) {
            if (field.resource.sortable) {
              table.kids.push({
                className: "th table-index",
                init: function() {
                  this.addEventListener("mousedown", function(event) {
                    sortManager.mousedown(this, event);
                  });
                },
                update: function() {
                  this.textContent = rowIndex+1;
                  // sortManager.updateCell(rowIndex, 0, this);
                }
              });
            }
            rows[rowIndex] = field.createChild({
              child_keys: [rowIndex]
            });

            columns.forEach(function(column, colIndex) {
              table.kids.push({
                className: "td",
                init: function(cell) {
                  // this.field = field.createChild(column);
                  // this.field.events.update = function() {
                  //   table.render();
                  // };
                  // this.kid = this.field.buildSingle();
                },
                update: function() {
                  let field = rows[rowIndex].createChild(column);
                  field.child_keys = [rowIndex, column.subkey];
                  // field.events.update = function() {
                  //
                  //   table.render();
                  // };

                  this.kid = field.buildSingle();

                  // sortManager.updateCell(rowIndex, colIndex+1, this);
                }
              });
            });
            table.kids.push({
              className: "td",
              kid: {
                tag: "button",
                kid: KarmaFieldsAlpha.includes.icon({
                  file: KarmaFieldsAlpha.icons_url+"/trash.svg"
                }),
                init: function() {
                  this.addEventListener("click", function(event) {
                    event.preventDefault();
                    value = field.getValue() || [];
                    value = value.filter(function(item) {
                      return item !== value[rowIndex];
                    });
                    field.setValue(value);
                    sortManager.array.render();
                  });
                }
              },
              update: function() {
                // sortManager.updateCell(rowIndex, columns.length+1, this);
              }
            });
          });
        }
      },
      {
        className:"field-more",
        kids: [
          {
            tag: "button",
            kid: KarmaFieldsAlpha.includes.icon({
              file: KarmaFieldsAlpha.icons_url+"/insert.svg"
            }),
            init: function() {
              this.addEventListener("click", function(event) {
                event.preventDefault();
                value = field.getValue() || [];
                value.push({});
                field.setValue(value);
                sortManager.array.render();
              });
            }
          }
        ]
      }
    ]
  };
}
