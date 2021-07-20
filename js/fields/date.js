
KarmaFieldsAlpha.fields.date = class extends KarmaFieldsAlpha.fields.field {

  constructor(resource, parent, form) {
		super(resource, parent, form);

		this.format = resource.format || "dd/mm/yyyy";
	}

  // validate(value) {
  //   value = value.toString();
  //   const base = "1900-01-01 00:00:00";
  //   const format = this.resource.output_format || "yyyy-mm-dd hh:ii:ss";
  //   value = value.slice(0, format.length);
  //   value = value.padEnd(format.length, base.slice(value.length));
  //   return Promise.resolve(value);
  // }
  convert(value) {
    value = value.toString();
    const base = "1900-01-01 00:00:00";
    const format = this.resource.output_format || "yyyy-mm-dd hh:ii:ss";
    value = value.slice(0, format.length);
    value = value.padEnd(format.length, base.slice(value.length));
    return value;
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
    const date = KarmaFieldsAlpha.Calendar.parse(value, this.resource.import_format || this.resource.format);
    if (date) {
      return this.updateValue(KarmaFieldsAlpha.Calendar.format(date, this.resource.import_format || this.resource.format));
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


  buildPopup(value) {
    const field = this;
    return {
      class: "karma-popup",
      init: function() {
        // prevent input loosing focus
        this.element.onmousedown = function(event) {
          event.preventDefault();
        };
      },
      update: function(container) {
        this.children = [{
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
                          container.render();
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
                          container.render();
                        });
                      }
                    }
                  ]
                }]
              },
              {
                class: "karma-calendar-body",
                update: function(body) {
                  const days = KarmaFieldsAlpha.Calendar.getMonthDays(field.date);
                  let rows = [];
                  while(days.length) {
                    rows.push(days.splice(0, 7));
                  }
                  body.children = [
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
                              field.date = null;
                              field.backup();
                              field.setValue(sqlDate);
                              field.edit();
                              field.render();
                              // field.updateChangeValue(sqlDate);
                            }
                            let sqlDate = KarmaFieldsAlpha.Calendar.format(day.date, field.resource.output_format);
                            this.element.classList.toggle("active", value === sqlDate);
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
        }];
      }
    };
  }


  build() {
    // const field = this;

    return {
      class: "karma-field karma-field-date",
      init: (container) => {
        container.element.setAttribute('tabindex', '-1');
        this.init(container.element);
        this.render = container.render;
      },
      update: container => {
        container.element.classList.add("loading");
        container.children = [
          {
            class: "date-popup-container",
            update: (popup) => {
              // field.onUpdatePopup = function(value) {
              const value = this.getValue();
              popup.element.classList.toggle("open-down", popup.element.getBoundingClientRect().top+window.pageYOffset < 500);

              popup.children = this.date && [this.buildPopup(value)] || [];
                // popup.render();
              // }
            }
          },
          {
            tag: "input",
            class: "text date karma-field-input",
            init: (input) => {
              input.element.type = "text";
              input.element.id = this.getId();
            },
            update: async (input) => {

              if (this.resource.readonly) {
                input.element.readOnly = true;
              } else {
                input.element.onkeyup = () => {
                  let inputDate = KarmaFieldsAlpha.Calendar.parse(input.element.value, this.format);
                  if (inputDate) {
                    this.date = inputDate;
                    var sqlDate = KarmaFieldsAlpha.Calendar.format(this.date, this.resource.output_format);
                    this.setValue(sqlDate);
                    this.edit();
                    this.render();
                    // this.changeValue(sqlDate).then(function() {
                    //   field.try("onUpdatePopup", sqlDate);
                    // });
                  }
                  input.element.classList.toggle("valid-date", inputDate);
                };
                input.element.onfocus = () => {
                  const value = this.getValue();
                  this.date = value && KarmaFieldsAlpha.Calendar.parse(value, this.resource.output_format) || new Date();
                  this.render();

                  // this.getValueAsync().then(function(value) {
                  //   this.date = value && KarmaFieldsAlpha.Calendar.parse(value, this.resource.output_format) || new Date();
                  //   this.try("onUpdatePopup", value);
                  // });
                };
                input.element.onfocusout = () => {
                  this.date = null;
                  if (!KarmaFieldsAlpha.Calendar.parse(input.element.value, this.format)) {
                    // field.changeValue("");
                    this.setValue("");
                    this.edit();
                  }
                  this.render();
                };
              }

              // field.onSet = function(value) {
              const value = await this.update();
              container.element.classList.toggle("modified", this.modified);

              let date = value && KarmaFieldsAlpha.Calendar.parse(value, this.resource.output_format);
              input.element.value = date && KarmaFieldsAlpha.Calendar.format(date, this.format) || "";
              if (!this.date) {
                input.element.blur();
              }
            },
            complete: input => {
              container.element.classList.remove("loading");
            }
          }
        ]
      }
    };
  }

}
