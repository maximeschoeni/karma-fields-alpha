/**
 * version sept2020
 */


// KarmaFields.wm.date = new WeakMap();

KarmaFields.fields.date = function(field) {

  // let date;

  return {
    class: "karma-field-date",

    init: function(container) {
      // field.fetchValue().then(function() {
      //   container.render();
      // });
    },
    update: function(container) {
      let format = field.resource.format || "dd/mm/yyyy";

      this.children = [
        {
          class: "date-popup-container",
          update: function(popup) {
            this.element.classList.toggle("open-down", this.getBoundingClientRect().top+window.pageYOffset < 500);
            this.children = field.data.date && [{
              class: "karma-popup",
              init: function() {
                // prevent closing
                this.onmousedown = function(event) {
                  event.preventDefault();
                };
              },
              children: [{
                class: "karma-calendar",
                children: [{
                  class: "karma-calendar-content",
                  children: [
                    {
                      class: "karma-calendar-header",
                      children: [{
                        class: "karma-calendar-nav",
                        children: [
                          {
                            class: "karma-prev-month karma-calendar-arrow",
                            init: function() {
                              this.element.innerHTML = "&lsaquo;";
                              this.element.addEventListener("mouseup", function() {
                                field.data.date.setMonth(field.data.date.getMonth()-1);
                                popup.render();
                              });
                            }
                          },
                          {
                            class: "karma-current-month",
                            update: function() {
                              this.element.textContent = KarmaFields.Calendar.format(field.data.date, "%fullmonth% yyyy");
                            }
                          },
                          {
                            className: "karma-next-month karma-calendar-arrow",
                            init: function() {
                              this.element.innerHTML = "&rsaquo;";
                              this.element.addEventListener("mouseup", function() {
                                field.data.date.setMonth(field.data.date.getMonth()+1);
                                popup.render();
                              });
                            }
                          }
                        ]
                      }]
                    },
                    {
                      class: "karma-calendar-body",
                      update: function(body) {
                        let days = KarmaFields.Calendar.getMonthDays(date);
                        let value = field.getValue();
                        let rows = [];
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
                                children: [{
                                  tag: "span",
                                  update: function() {
                                    this.element.textContent = KarmaFields.Calendar.format(day.date, "#d");
                                  }
                                }],
                                update: function(item) {
                                  this.element.onmouseup = function(event) {
                                    event.preventDefault();
                                    field.setValue(day.sqlDate);
                                    field.data.date = null;
                                    container.render();
                                  }
                                  this.element.classList.toggle("active", field.getValue() === day.sqlDate);
                                  this.element.classList.toggle("offset", day.isOffset);
                                  this.element.classList.toggle("today", day.isToday);
                                }
                              };
                            })
                          };
                        }));
                      }
                    }
                  ]
                }]
              }]
            }];
          }
        },
        {
          tag: "input",
          class: "text karma-field-input",
          init: function(input) {
            this.element.type = "text";
            this.element.id = field.getId();

            if (field.resource.readonly) {
              this.element.readOnly = true;
            } else {
              this.element.addEventListener("keyup", function() {
                let inputDate = KarmaFields.Calendar.parse(this.value, format);
                if (inputDate) {
                  field.data.date = inputDate;
                  var sqlDate = KarmaFields.Calendar.format(field.data.date);
                  field.setValue(sqlDate);
                  container.render();
                }
                this.element.classList.toggle("valid-date", inputDate);
              });

              var keyChange = function(dir) {
                var value = field.getValue();
                field.data.date = KarmaFields.Calendar.parse(value);
                var index = input.selectionStart || 0;
                if (format[index] === "y" || format[index-1] === "y") {
                  date.setFullYear(date.getFullYear() + dir);
                } else if (format[index] === "m" || format[index-1] === "m") {
                  date.setMonth(date.getMonth() + dir);
                } else if (format[index] === "d" || format[index-1] === "d") {
                  date.setDate(date.getDate() + dir);
                }

                input.setSelectionRange(index, index);
                var sqlDate = KarmaFields.Calendar.format(field.data.date);
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
                var value = field.getValue();
                field.data.date = value && KarmaFields.Calendar.parse(value) || new Date();
                container.render();
              });
              this.element.addEventListener("focus", function() {
                var value = field.getValue();
                field.data.date = value && KarmaFields.Calendar.parse(value) || new Date();
                container.render();
              });
              this.element.addEventListener("focusout", function() {
                field.data.date = null;
                if (!KarmaFields.Calendar.parse(this.value, format)) {
                  field.setValue("");
                }
                container.render();
              });
            }
          },
          update: function() {
            let value = field.getValue();
            let date = value && KarmaFields.Calendar.parse(value);
            this.element.value = date && KarmaFields.Calendar.format(date, format) || "";
          }
        }
      ];

    }
  };
}
