
KarmaFieldsAlpha.field.date = class extends KarmaFieldsAlpha.field.input {

  constructor(resource, id, parent) {

		super({
      // format: "DD/MM/YYYY",
      // output_format: "YYYY-MM-DD hh:mm:ss",
      // export_format: "DD/MM/YYYY",
      // separator: "/",
      // regexp: "^(\\d{2})\\D(\\d{2})\\D(\\d{4})$",
      // formatBETA: "d/m/y",
      displayFormat: "dd/mm/yyyy",
      storeFormat: "yyyy-mm-dd",
      ...resource
    }, id, parent);



	}

  static parse(string, format) {

    const formats = format.split(/[^dmy]/);
    const values = string.split(/\D/);

    // const object = Object.fromEntries(formats.filter((format, index) => values[index] && values[index].length === format).map((format, index) => [format, Number(values[index])]));

    const object = {};

    for (let i = 0; i < 3; i++) {

      const key = formats[i];
      const value = values[i];

      if (key && value && key.length === value.length && !isNaN(value)) {

        object[key] = Number(value);

      }

    }

    if (object.dd && object.mm && object.yyyy) {

      return new Date(object.yyyy, object.mm-1, object.dd);

    }





    // const object = {};
    //
    // for (let item of format.split(/[^dmy]/)) {
    //
    //   const index = format.indexOf(item);
    //
    //   switch (item) {
    //
    //     case "dd":
    //       object.d = Number(string.slice(index, index+2));
    //       break;
    //
    //     case "mm":
    //       object.m = Number(string.slice(index, index+2));
    //       break;
    //
    //     case "yyyy":
    //       object.y = Number(string.slice(index, index+4));
    //       break;
    //
    //   }
    //
    //   // const index = format.indexOf(item);
    //   // const length = item.length;
    //   //
    //   // object[item] = Number(string.slice(index, index+length));
    //
    // }
    //
    // if (object.d && !isNaN(object.d) && object.m && !isNaN(object.m) && object.y && !isNaN(object.y)) {
    //
    //   return new Date(object.y, object.m-1, object.d);
    //
    // }
    //

  }

  static format(date, format) {

    return format
      .replace("dd", date.toLocaleDateString("en", {day: "2-digit"}))
      .replace("mm", date.toLocaleDateString("en", {month: "2-digit"}))
      .replace("yyyy", date.toLocaleDateString("en", {year: "numeric"}));

  }


  // match(value) {
  //
  //   return value.match(new RegExp(this.resource.regexp));
  //
  // }

  // formatDate(date) {
  //
  //   const d = date.toLocaleDateString(KarmaFieldsAlpha.locale, {day: "2-digit"});
  //   const m = date.toLocaleDateString(KarmaFieldsAlpha.locale, {month: "2-digit"});
  //   const y = date.toLocaleDateString(KarmaFieldsAlpha.locale, {year: "numeric"});
  //
  //   return this.resource.formatBETA.replace("d", d).replace("m", m).replace("y", y);
  // }
  //
  // parseDate(string) {
  //
  //   const matches = string.match(new RegExp(this.resource.regexp));
  //
  //   if (matches) {
  //
  //     const dmy = this.resource.formatBETA.replace(/[^dmy]/g, "");
  //     const d = dmy.indexOf("d");
  //     const m = dmy.indexOf("m");
  //     const y = dmy.indexOf("y");
  //
  //     return new Date(matches[y+1], matches[m+1]-1, matches[d+1]);
  //
  //   }
  //
  // }
  //
  // toSQL(date) {
  //
  //   // const y = date.getFullYear();
  //   // const m = ("00"+(date.getMonth() + 1)).slice(-2);
  //   // const d = ("00"+(date.getDate())).slice(-2);
  //
  //   const d = date.toLocaleDateString("en", {day: "2-digit"});
  //   const m = date.toLocaleDateString("en", {month: "2-digit"});
  //   const y = date.toLocaleDateString("en", {year: "numeric"});
  //
  //   return `${y}-${m}-${d} 00:00:00`;
  //
  // }

  getPlaceholder() {

    return super.getPlaceholder() || this.resource.displayFormat;

  }

  getDefault() {

    let content;

    if (this.resource.default === "now") {

      const value = this.constructor.format(new Date(), this.resource.storeFormat);

      content = new KarmaFieldsAlpha.Content(value);

    } else if (this.resource.default) {

      content = this.parse(this.resource.default);

    } else if (this.resource.default !== null) {

      content = new KarmaFieldsAlpha.Content();

    }

    return content;
  }

  // exportValue() {

  //   const key = this.getKey();
  //   const values = this.parent.request("get", {}, key);

  //   if (values) {

  //     let value = KarmaFieldsAlpha.Type.toString(values);

  //     const momentDate = moment(value, this.resource.output_format);

  //     if (momentDate.isValid()) {

  //       value = momentDate.format(this.resource.export_format);

  //     }


  //   }

  //   return value;
  // }

  // importValue(value) {

  //   const key = this.getKey();

  //   const momentDate = moment(value, this.resource.export_format);

  //   if (momentDate.isValid()) {
  //     value = momentDate.format(this.resource.output_format);
  //   }

  //   this.parent.request("set", value, key);

  // }

  // export(keys) {
  //   const key = this.getKey();
  //   const object = {};
  //   if (!keys.length || keys.includes(key)) {
  //     object[key] = await this.exportValue();
  //   }
  //   return object;
  // }

  // async import(object) {
  //   const key = this.getKey();
  //   if (object[key] !== undefined) {
  //     await this.importValue(object[key]);
  //   }
  // }

  getMonthDays(monthDate) {
		var days = [];

		var lastDayPrevMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 0);
		var firstDayNextMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);
		var date = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1 - lastDayPrevMonth.getDay());
		var today = (new Date()).setHours(0, 0, 0, 0);

		while((date.getTime() < firstDayNextMonth.getTime()) || date.getDay() !== 1) {
			var day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      // day.setHours(0, 0, 0, 0);
      var time = day.getTime();

			days.push({
				date: day,
        time: time,
        // sql: this.toSQL(day),
        // sql: this.constructor.format(day, this.resource.storeFormat),
        // moment: moment(day),
				// sqlDate: this.format(day),
				isDayBefore: time == lastDayPrevMonth.getTime(),
				isDayAfter: time == firstDayNextMonth.getTime(),
				isOffset: time <= lastDayPrevMonth.getTime() || time >= firstDayNextMonth.getTime(),
				isToday: time === today,
				isWeekend: time === 0 || time === 6
			});
			date.setDate(date.getDate() + 1);
		}
		return days;
	}

  createCalendar(date) {

    const days = this.getMonthDays(date);

    let rows = [];

    while(days.length) {

      rows.push(days.splice(0, 7));

    }

    return rows;
  }

  buildPopup() {
    return {
      class: "date-popup",
      init: popup => {
        // prevent input loosing focus
        popup.element.onmousedown = event => {
          event.stopPropagation(); // -> prevent reseting modal selection
          event.preventDefault(); // -> prevent input blur event
        };
      },
      update: container => {

        const content = this.getContent();
        // const selection = this.getSelection();

        const currentDate = this.getOption("date");

        if (this.hasFocus() && currentDate) {

          const rows = this.createCalendar(currentDate);
          const activeDate = !content.loading && this.constructor.parse(content.toString(), this.resource.storeFormat);

          container.children = [
            {
              class: "calendar",
              children: [
                {
                  tag: "ul",
                  class: "calendar-nav",
                  children: [
                    {
                      tag: "li",
                      class: "prev-month calendar-arrow",
                      child: {
                        tag: "a",
                        update: a => {
                          a.element.innerHTML = "&lsaquo;";
                          a.element.onclick = event => {
                            currentDate.setMonth(currentDate.getMonth()-1);
                            this.setOption(currentDate, "date");
                            container.render();
                          };
                        }
                      }
                    },
                    {
                      tag: "li",
                      class: "current-month",
                      update: li => {
                        li.element.textContent = currentDate.toLocaleDateString(KarmaFieldsAlpha.locale, {month: "long", year: "numeric"});
                      }
                    },
                    {
                      tag: "li",
                      class: "next-month calendar-arrow",
                      child: {
                        tag: "a",
                        update: a => {
                          a.element.innerHTML = "&rsaquo;";
                          a.element.onclick = event => {
                            currentDate.setMonth(currentDate.getMonth()+1);
                            this.setSelection(currentDate, "date");
                            container.render();
                          };
                        }
                      }
                    }
                  ]
                },
                {
                  tag: "ul",
                  class: "calendar-days-title",
                  children: rows[0].map(day => {
                    return {
                      tag: "li",
                      update: li => {
                        li.element.textContent = day.date.toLocaleDateString(KarmaFieldsAlpha.locale, {weekday: "short"});
                      }
                    };
                  })
                },
                {
                  class: "calendar-days",
                  children: rows.map(row => {
                    return {
                      tag: "ul",
                      class: "calendar-days-content",
                      children: row.map(day => {
                        return {
                          tag: "li",
                          children: [{
                            tag: "a",
                            update: a => {
                              a.element.textContent = day.date.toLocaleDateString(KarmaFieldsAlpha.locale, {day: "numeric"});
                              a.element.onmouseup = async event => {
                                event.preventDefault();
                                const sqlDate = this.constructor.format(day.date, this.resource.storeFormat);
                                this.save("date", "Select Date");
                                this.setValue(sqlDate);
                                this.removeOption("date");
                                await container.render();
                                this.render();
                              }
                            }
                          }],
                          update: li => {
                            li.element.classList.toggle("active", Boolean(activeDate && day.date.getTime() === activeDate.getTime()));
                            li.element.classList.toggle("offset", day.isOffset);
                            li.element.classList.toggle("today", day.isToday);
                          }
                        };
                      })
                    };
                  })
                }
              ]
            }
          ];
        } else {
          container.children = [];
        }
      }
    };
  }


  build() {
    return {
      class: "karma-field karma-field-date",
      init: container => {
        container.element.onmousedown = event => {
          event.stopPropagation();
          // event.preventDefault();
        }
      },
      update: (container) => {

          container.children = [
            {
              class: "date-popup-container open-down",
              child: this.buildPopup()
            },
            {
              tag: "input",
              class: "text-input date karma-field-input",
              init: (input) => {
                input.element.type = "text";
                input.element.id = this.getUid();
              },
              update: (input) => {

                // let value = this.getSingleValue();
                const content = this.getContent();

                // const selection = this.getSelection();
                const currentDate = this.getOption("date");

                input.element.placeholder = this.getPlaceholder();

                input.element.classList.toggle("loading", Boolean(content.loading));

                if (!content.loading) {

                  let value = content.toString();

                  if (content.notFound) {

        						// const defaultContent = this.getDefault();
                    //
        						// value = defaultContent.toString();
                    //
                    // this.setContent(defaultContent);

                    // KarmaFieldsAlpha.Query.init(); // -> add empty task to force rerendering

                  }

                  input.element.classList.toggle("mixed", Boolean(content.mixed));
        					input.element.classList.toggle("selected", Boolean(content.mixed && this.hasFocus()));

                  if (this.resource.readonly) {

                    input.element.readOnly = true;

                  } else {

                    input.element.readOnly = false;

                    input.element.onkeyup = async () => {

                      const date = this.constructor.parse(input.element.value, this.resource.displayFormat);

                      this.save("date", "Change Date");

                      if (date) {

                        this.setOption(date, "date");
                        // await container.render();
                        const sqlDate = this.constructor.format(date, this.resource.storeFormat);
                        // const content = new KarmaFieldsAlpha.Content(sqlDate);
                        this.setValue(sqlDate);

                      } else {

                        this.setValue(input.element.value);

                      }

                      this.render();
                    };

                    input.element.onfocus = () => {
                      const date = this.constructor.parse(input.element.value, this.resource.displayFormat) || new Date();

                      this.setOption(date, "date");

                      this.setFocus(content.mixed ? true : false);

                      container.render();
                    };

                    input.element.onblur = () => {

                      if (this.hasFocus()) {

                        this.removeFocus();
                        this.render();
                      }

                    }


                  }

                  if (content.mixed) {

                    input.element.value = "[mixed values]";
                    input.element.readOnly = true;

                  } else {

                    let displayDate;

                    const date = this.constructor.parse(value, this.resource.storeFormat);

                    if (date) {

                      displayDate = this.constructor.format(date, this.resource.displayFormat);

                    } else {

                      displayDate = value || "";

                    }


                    if (input.element.value !== displayDate) {

                      input.element.value = displayDate;

                    }

                  }


                  if (this.hasFocus() && input.element !== document.activeElement && !content.mixed) {

          					input.element.focus();

          				}



                  if (!this.hasFocus() || !currentDate && input.element === document.activeElement) {

                    input.element.blur();

                  }





                }


              }
            }
          ];


      }
    };
  }

}
