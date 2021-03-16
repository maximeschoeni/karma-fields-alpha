KarmaFields.fields.array = function(field) {
  let value;
  return {
    class: "karma-field-array",
    init: function(array) {

      this.kids = [
        {
          tag: "table",
          className: "grid",
          kids: [
            {
              tag: "thead",
              init: function(thead) {
                if (field.resource.columns.some(function(column) {
                  return column.label;
                })) {
                  thead.kid = {
                    tag: "tr",
                    kids: field.resource.columns.map(function(column) {
                      return {
                        tag: "th",
                        init: function() {
                          if (column.style) {
                            this.style = column.style;
                          }
                        },
                        kid: {
                          class: "header-cell",
                          kid: {
                            tag: "a",
                            init: function() {
                              this.textContent = column.label || "";
                            }
                          }
                        }
                      };
                    }).concat([{
                      tag: "th",
                      init: function() {
                        this.style = "width:40px";
                      }
                    }])
                  };
                }
              }
            },
            {
              tag: "tbody",
              init: function() {
                field.fetchValue().then(function(value) {
                  if (!value && field.resource.default) {
                    field.setValue(field.resource.default);
  								}
                  array.render();
                });
              },
              update: function() {
                value = field.getValue() || [];
                this.kids = value.map(function(item, rowIndex) {
                  return {
                    tag: "tr",
                    update: function() {
                      this.kids = field.resource.columns.map(function(column, colIndex) {
                        return {
                          tag: "td",
                          init: function() {
                            this.field = field.createChild(column);
                          },
                          update: function() {
                            // let column = field.resource.columns[colIndex];
                            this.field.child_keys = [rowIndex, column.subkey];
                            this.kid = this.field.buildSingle();
                          }
                        };
                      }).concat([
                        {
                          tag: "td",
                          init: function() {
                            this.style = "width:40px";
                          },
                          kid: {
                            tag: "button",
                            kid: KarmaFields.includes.icon({
                              file: KarmaFields.icons_url+"/trash.svg"
                            }),
                            init: function() {
                              this.addEventListener("click", function(event) {
                                event.preventDefault();
                                value = value.filter(function(item) {
                                  return item !== value[rowIndex];
                                });
                                field.setValue(value);
                                array.render();
                              });
                            }
                          }
                        }
                      ]);
                    }
                  }
                });
              }
            }
          ]
        },
        {
          class:"field-controls",
          children: [
            {
              tag: "button",
              child: KarmaFields.includes.icon(KarmaFields.icons_url+"/insert.svg"),
              init: function() {
                this.element.addEventListener("click", function(event) {
                  event.preventDefault();
                  var values = field.getValue() || [];
                  values.push({});
                  field.setValue(values);
                  array.render();
                });
              }
            }
          ]
        }
      ];
    },
  };
}
