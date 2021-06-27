
KarmaFieldsAlpha.fields.date = class extends KarmaFieldsAlpha.fields.field {

  constructor(resource, domain, parent) {
		super(resource, domain, parent);

		this.format = resource.format || "dd/mm/yyyy";

    // this.date = new Date();

	}

  exportValue() {
    this.getValueAsync().then(function(value) {
      if (KarmaFieldsAlpha.Calendar.parse(value, this.resource.output_format)) {
        return value;
      }
      return '';
    });
  }

  importValue(value, context) {
    const date = KarmaFieldsAlpha.Calendar.parse(value, this.resource.import_format || this.resource.output_format || this.resource.format);
    if (date) {
      return this.updateValue(KarmaFieldsAlpha.Calendar.format(date, this.resource.output_format || this.resource.format), context);
    } else {
      return Promise.resolve("");
    }
  }

  // not used yet
  keyChange(input, dir) {
    const field = this;
    let value = this.getValue();
    this.date = KarmaFieldsAlpha.Calendar.parse(value, this.resource.output_format);
    let index = input.selectionStart || 0;
    if (this.format[index] === "y" || this.format[index-1] === "y") {
      this.date.setFullYear(this.date.getFullYear() + dir);
    } else if (this.format[index] === "m" || this.format[index-1] === "m") {
      this.date.setMonth(this.date.getMonth() + dir);
    } else if (this.format[index] === "d" || this.format[index-1] === "d") {
      this.date.setDate(this.date.getDate() + dir);
    }

    input.setSelectionRange(index, index);
    let sqlDate = KarmaFieldsAlpha.Calendar.format(this.date, this.resource.output_format);
    field.setValue(sqlDate);
  };


  build() {
    const field = this;

    return {
      class: "karma-field karma-field-date",

      init: function(container) {
        // field.fetchValue().then(function() {
        //   container.render();
        // });

        this.element.setAttribute('tabindex', '-1');

        if (!field.hasValue()) {
          field.fetchValue().then(function(value) {
						field.triggerEvent("set");
						field.triggerEvent("modify");
            // container.element.classList.remove("loading");
            // container.render();
          });
        }

        field.init(this.element);

      },
      update: function(container) {
        // let format = field.resource.format || "dd/mm/yyyy";

        this.children = [
          {
            class: "date-popup-container",
            update: function(popup) {
              this.element.classList.toggle("open-down", this.element.getBoundingClientRect().top+window.pageYOffset < 500);
              this.children = field.date && [{
                class: "karma-popup",
                init: function() {
                  // prevent input loosing focus
                  this.element.onmousedown = function(event) {
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
                                this.element.addEventListener("click", function() {
                                  field.date.setMonth(field.date.getMonth()-1);
                                  popup.render();
                                });
                              }
                            },
                            {
                              class: "karma-current-month",
                              update: function() {
                                this.element.textContent = KarmaFieldsAlpha.Calendar.format(field.date, "%fullmonth% yyyy");
                              }
                            },
                            {
                              class: "karma-next-month karma-calendar-arrow",
                              init: function() {
                                this.element.innerHTML = "&rsaquo;";
                                this.element.addEventListener("click", function() {
                                  field.date.setMonth(field.date.getMonth()+1);
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
                          let days = KarmaFieldsAlpha.Calendar.getMonthDays(field.date);
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
                                    this.element.textContent = KarmaFieldsAlpha.Calendar.format(day.date, "%d2%");
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
                                      this.element.textContent = KarmaFieldsAlpha.Calendar.format(day.date, "#d");
                                    }
                                  }],
                                  update: function(item) {
                                    this.element.onmouseup = function(event) {
                                      event.preventDefault();
                                      let sqlDate = KarmaFieldsAlpha.Calendar.format(day.date, field.resource.output_format);
                                      field.triggerEvent("history", true);
                                      field.setValue(sqlDate);
                                      field.triggerEvent("set");
                                      field.triggerEvent("change", true);
                                      field.date = null;
                                      container.render();
                                    }
                                    let sqlDate = KarmaFieldsAlpha.Calendar.format(day.date, field.resource.output_format);
                                    this.element.classList.toggle("active", field.getValue() === sqlDate);
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
              }] || [];
            }
          },
          {
            tag: "input",
            class: "text date karma-field-input",
            init: function(input) {
              this.element.type = "text";
              this.element.id = field.getId();

            },
            update: function(input) {

              if (field.resource.readonly) {
                this.element.readOnly = true;
              } else {
                this.element.onkeyup = function() {
                  let inputDate = KarmaFieldsAlpha.Calendar.parse(this.value, field.format);



                  if (inputDate) {
                    field.date = inputDate;
                    var sqlDate = KarmaFieldsAlpha.Calendar.format(field.date, field.resource.output_format);
                    field.setValue(sqlDate);
                    field.triggerEvent("change", true);
                    container.render();
                  }

                  this.classList.toggle("valid-date", inputDate);
                };
                // this.element.onkeydown = function(event) {
                //   event.preventDefault();
                //   let inputDate = KarmaFieldsAlpha.Calendar.parse(this.value, field.format);
                //   if (event.key === "ArrowDown") {
                //     inputDate.setFullYear(inputDate.getFullYear() + 1);
                //   } else if (event.key === "ArrowUp") {
                //     inputDate.setFullYear(inputDate.getFullYear() - 1);
                //   } else if (event.key === "ArrowRight") {
                //     inputDate.setMonth(inputDate.getMonth() + 1);
                //   } else if (event.key === "ArrowLeft") {
                //     inputDate.setMonth(inputDate.getMonth() - 1);
                //   }
                //   this.value = KarmaFieldsAlpha.Calendar.format(inputDate, field.format);
                // }
                // this.element.onkeydown = function(event) {
                //   // if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                //   //   event.preventDefault();
                //   //   field.keyChange(this, event.key === "ArrowDown" ? 1 : -1);
                //   //   field.triggerEvent("change", true);
                //   //   container.render();
                //   // }
                // };
                this.element.onfocus = function() {
                  var value = field.getValue();
                  field.date = value && KarmaFieldsAlpha.Calendar.parse(value, field.resource.output_format) || new Date();
                  container.render();
                };
                this.element.onfocusout = function() {
                  field.date = null;
                  if (!KarmaFieldsAlpha.Calendar.parse(this.value, field.format)) {
                    field.setValue("");
                    field.triggerEvent("change", true);
                  }
                  container.render();
                };
              }

              field.events.modify = function() {
      					input.element.classList.toggle("modified", field.isModified());
      				}
      				field.events.load = function() {
      					input.element.classList.toggle("loading", field.loading > 0);
      				}
      				field.events.set = function() {

                let value = field.getValue();
                let date = value && KarmaFieldsAlpha.Calendar.parse(value, field.resource.output_format);

                input.element.value = date && KarmaFieldsAlpha.Calendar.format(date, field.format) || "";
                if (!field.date) {
                  input.element.blur();
                }
      				}

      				// field.triggerEvent("load");
      				// field.triggerEvent("set");
      				// field.triggerEvent("modify");

              field.fetchValue();

            }
          }
        ];

      }
    };
  }

}
