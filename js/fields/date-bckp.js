/**
 * version sept2020
 */

KarmaFields.fields.date = function(field) {

  return {
    class: "karma-field-date",
    update: function() {
      console.log(field.uri, this.element);
    },
    init: function(container) {
      var format = field.resource.format || "dd/mm/yyyy";
      var manager = {};

      field.fetchValue().then(function() {
        container.render();
      });
      container.children = [
        {
          class: "date-popup-container",
          update: function(popup) {
            this.element.classList.toggle("open-down", this.element.getBoundingClientRect().top+window.pageYOffset < 500);
            var value = field.getValue();
            this.child = manager.date && {
              class: "karma-popup",
              init: function() {
                // prevent closing
                this.element.onmousedown = function(event) {
                  event.preventDefault();
                };
              },
              child: {
                class: "karma-calendar",
                child: {
                  class: "karma-calendar-content",
                  children: [
                    {
                      class: "karma-calendar-header",
                      child: {
                        class: "karma-calendar-nav",
                        children: [
                          {
                            class: "karma-prev-month karma-calendar-arrow",
                            init: function() {
                              this.element.innerHTML = "&lsaquo;";
                              this.element.addEventListener("mouseup", function() {
                                manager.date.setMonth(manager.date.getMonth()-1);
                                popup.render();
                              });
                            }
                          },
                          {
                            class: "karma-current-month",
                            update: function() {
                              this.element.textContent = KarmaFields.Calendar.format(manager.date, "%fullmonth% yyyy");
                            }
                          },
                          {
                            class: "karma-next-month karma-calendar-arrow",
                            init: function() {
                              this.element.innerHTML = "&rsaquo;";
                              this.element.addEventListener("mouseup", function() {
                                manager.date.setMonth(manager.date.getMonth()+1);
                                popup.render();
                              });
                            }
                          }
                        ]
                      }
                    },
                    {
                      class: "karma-calendar-body",
                      update: function(body) {
                        var days = KarmaFields.Calendar.getMonthDays(manager.date);

                        var rows = [];
                        while(days.length) {
                          rows.push(days.splice(0, 7));
                        }
                        this.children = [
                          {
                            tag: "ul",
                            class: "calendar-days-title",
                            children: rows[0].map(function(day) {
                              return {
                                tag: "li",
                                update: function() {
                                  this.element.textContent = KarmaFields.Calendar.format(day.date, "%d2%");
                                }
                              };
                            })
                          }
                        ].concat(rows.map(function(row) {
                          return {
                            tag: "ul",
                            class: "calendar-days-content",
                            children: row.map(function(day) {
                              return {
                                tag: "li",
                                child: {
                                  tag: "span",
                                  update: function() {
                                    this.element.textContent = KarmaFields.Calendar.format(day.date, "#d");
                                  }
                                },
                                init: function(item) {
                                  this.element.onmouseup = function(event) {
                                    event.preventDefault();
                                    if (item.data.day) {
                                      field.setValue(item.data.day.sqlDate);
                                      manager.date = null;
                                      container.render();
                                    }
                                  }
                                },
                                update: function() {
                                  this.element.classList.toggle("active", value === day.sqlDate);
                                  this.element.classList.toggle("offset", day.isOffset);
                                  this.element.classList.toggle("today", day.isToday);
                                  this.data.day = day;
                                }
                              };
                            })
                          };
                        }));
                      }
                    }
                  ]
                }
              }
            };
          }
        },
        {
          tag: "input",
          class: "text karma-field-input",
          init: function(input) {
            // field.input = input;
            this.element.type = "text";
            this.element.id = field.getId();

            if (field.resource.readonly) {
              this.element.readOnly = true;
            } else {
              this.element.addEventListener("keyup", function() {
                var date = KarmaFields.Calendar.parse(this.value, format);
                if (date) {
                  var sqlDate = KarmaFields.Calendar.format(date);
                  field.setValue(sqlDate);
                  container.render();
                }
                this.classList.toggle("valid-date", date);
              });

              var keyChange = function(dir) {
                var value = field.getValue();
                var date = KarmaFields.Calendar.parse(value);
                var index = input.element.selectionStart || 0;
                if (format[index] === "y" || format[index-1] === "y") {
                  date.setFullYear(date.getFullYear() + dir);
                } else if (format[index] === "m" || format[index-1] === "m") {
                  date.setMonth(date.getMonth() + dir);
                } else if (format[index] === "d" || format[index-1] === "d") {
                  date.setDate(date.getDate() + dir);
                }

                input.element.setSelectionRange(index, index);
                var sqlDate = KarmaFields.Calendar.format(date);
                field.setValue(sqlDate);
                container.render();
              };
              this.element.addEventListener("keydown", function(event) {
                if (event.key === "ArrowDown") {
                  keyChange(1);
                  event.preventDefault();
                } else if (event.key === "ArrowUp") {
                  keyChange(-1);
                  event.preventDefault();
                }
              });
              this.element.addEventListener("mousedown", function() {
                var sqlDate = field.getValue();
                manager.date = sqlDate && KarmaFields.Calendar.parse(sqlDate) || new Date();
                container.render();
              });
              this.element.addEventListener("focus", function() {
                var sqlDate = field.getValue();
                manager.date = sqlDate && KarmaFields.Calendar.parse(sqlDate) || new Date();
                container.render();
              });
              this.element.addEventListener("focusout", function() {
                manager.date = null;
                container.render();
              });
            }
          },
          update: function() {
            var value = field.getValue();
            console.log(field.uri, value, this.element);
            var date = value && KarmaFields.Calendar.parse(value);
            if (date) {
              this.element.value = KarmaFields.Calendar.format(date, format);
            }
          }
        }
      ];

    }
  };
}
