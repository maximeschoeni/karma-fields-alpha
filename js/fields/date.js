
KarmaFieldsAlpha.field.date = class extends KarmaFieldsAlpha.field.input {

  constructor(resource) {

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
    });



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

    let value;

    if (this.resource.default === "now") {

      // value = moment().format(this.resource.output_format);

      // value = this.toSQL(new Date());
      value = this.constructor.format(new Date(), this.resource.storeFormat);

    } else if (this.resource.default) {

      // const momentDate = moment(this.resource.default, [this.resource.format, this.resource.output_format]);
      // if (momentDate.isValid()) {
      //   value = momentDate.format(this.resource.output_format);
      // }

      value = this.parse(this.resource.default);

    } else if (this.resource.default !== null) {

      value = "";

    }

    return value;
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

  // buildPopup(value) {
  //   return {
  //     class: "date-popup",
  //     init: popup => {
  //       // prevent input loosing focus
  //       popup.element.onmousedown = event => {
  //         event.preventDefault();
  //       };
  //     },
  //     update: container => {
  //       if (!this.date) {
  //         this.date = new Date();
  //       }
  //       const days = this.getMonthDays(this.date);
  //       let rows = [];
  //       while(days.length) {
  //         rows.push(days.splice(0, 7));
  //       }
  //       container.child = {
  //         class: "calendar",
  //         children: [
  //           {
  //             tag: "ul",
  //             class: "calendar-nav",
  //             children: [
  //               {
  //                 tag: "li",
  //                 class: "prev-month calendar-arrow",
  //                 child: {
  //                   tag: "a",
  //                   init: a => {
  //                     a.element.innerHTML = "&lsaquo;";
  //                     a.element.onclick = event => {
  //                       this.date.setMonth(this.date.getMonth()-1);
  //                       container.render();
  //                     };
  //                   }
  //                 }
  //               },
  //               {
  //                 tag: "li",
  //                 class: "current-month",
  //                 update: li => {
  //                   li.element.textContent = moment(this.date).format("MMMM YYYY");
  //                 }
  //               },
  //               {
  //                 tag: "li",
  //                 class: "next-month calendar-arrow",
  //                 child: {
  //                   tag: "a",
  //                   init: a => {
  //                     a.element.innerHTML = "&rsaquo;";
  //                     a.element.onclick = event => {
  //                       this.date.setMonth(this.date.getMonth()+1);
  //                       container.render();
  //                     };
  //                   }
  //                 }
  //               }
  //             ]
  //           },
  //           {
  //             tag: "ul",
  //             class: "calendar-days-title",
  //             children: rows[0].map(day => {
  //               return {
  //                 tag: "li",
  //                 update: li => {
  //                   // this.element.textContent = KarmaFieldsAlpha.Calendar.format(day.date, "%d2%");
  //                   // this.element.textContent = wp.date.dateI18n(day.date, "D").slice(0, 2);
  //                   li.element.textContent = day.moment.format("dd");
  //                 }
  //               };
  //             })
  //           },
  //           {
  //             class: "calendar-days",
  //             children: rows.map(row => {
  //               return {
  //                 tag: "ul",
  //                 class: "calendar-days-content",
  //                 children: row.map(day => {
  //                   return {
  //                     tag: "li",
  //                     children: [{
  //                       tag: "a",
  //                       update: a => {
  //                         a.element.textContent = day.moment.format("D");
  //                         a.element.onmouseup = event => {
  //                           event.preventDefault();
  //                           let sqlDate = day.moment.format(this.resource.output_format);
  //                           this.date = null;
  //                           const key = this.getKey();
  //
  //                           this.parent.request("set", sqlDate, key);
  //                           // this.render();
  //                           this.parent.request("render");
  //                         }
  //                       }
  //                     }],
  //                     update: li => {
  //                       let sqlDate = day.moment.format(this.resource.output_format);
  //
  //                       li.element.classList.toggle("active", value === sqlDate);
  //                       li.element.classList.toggle("offset", day.isOffset);
  //                       li.element.classList.toggle("today", day.isToday);
  //                     }
  //                   };
  //                 })
  //               };
  //             })
  //           }
  //         ]
  //       };
  //     }
  //   };
  // }

  // render() {
  //
  //   if (this.onRender) {
  //
  //     this.onRender();
  //
  //   }
  //
  // }

  build() {
    return {
      class: "karma-field karma-field-date",
      // init: (container) => {
      //   container.element.setAttribute('tabindex', '-1');
      // },
      update: (container) => {
        // this.onRender = container.render;

        let value = this.getSingleValue() || "";

        // const key = this.getKey();
        // const values = this.parent.request("get", {}, key);

        container.element.classList.toggle("loading", value === KarmaFieldsAlpha.loading);

        if (value === KarmaFieldsAlpha.mixed) {

          container.children = [this.createChild({
            type: "input"
          }).build()];

        } else if (value !== KarmaFieldsAlpha.loading) {

          const data = this.getData();

          let calendarDate = data.date;

          container.children = [
            {
              class: "date-popup-container open-down",
              update: popup => {

                if (data.date && !this.resource.readonly) {

                  popup.children = [
                    {
                      class: "date-popup",
                      init: popup => {
                        // prevent input loosing focus
                        popup.element.onmousedown = event => {
                          event.preventDefault();
                        };
                      },
                      update: container => {
                        const days = this.getMonthDays(data.date);
                        let rows = [];
                        while(days.length) {
                          rows.push(days.splice(0, 7));
                        }

                        // const activeDate = new Date(value);
                        const activeDate = value && this.constructor.parse(value, this.resource.storeFormat);

                        container.child = {
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
                                        data.date.setMonth(data.date.getMonth()-1);
                                        container.render();
                                      };
                                    }
                                  }
                                },
                                {
                                  tag: "li",
                                  class: "current-month",
                                  update: li => {
                                    // li.element.textContent = new Intl.DateTimeFormat(KarmaFieldsAlpha.locale, {month: "long", year: "numeric"}).format(data.date);
                                    li.element.textContent = data.date.toLocaleDateString(KarmaFieldsAlpha.locale, {month: "long", year: "numeric"});
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
                                        data.date.setMonth(data.date.getMonth()+1);
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
                                    // li.element.textContent = new Intl.DateTimeFormat(KarmaFieldsAlpha.locale, {weekday: "short"}).format(day.date);
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
                                          // a.element.textContent = day.moment.format("D");
                                          // a.element.textContent = new Intl.DateTimeFormat(KarmaFieldsAlpha.locale, {day: "numeric"}).format(day.date);
                                          a.element.textContent = day.date.toLocaleDateString(KarmaFieldsAlpha.locale, {day: "numeric"});

                                          a.element.onmouseup = event => {
                                            event.preventDefault();
                                            // let sqlDate = day.moment.format(this.resource.output_format);
                                            // const sqlDate = this.toSQL(day.date);
                                            const sqlDate = this.constructor.format(day.date, this.resource.storeFormat);
                                            data.date = null;
                                            // this.parent.request("set-option", data.date, this.resource.key, "date");

                                            // const key = this.getKey();
                                            //
                                            // this.parent.request("set", sqlDate, key);
                                            // this.parent.request("render");

                                            this.setValue(sqlDate);
                                            this.save("select");
                                            this.render();
                                          }
                                        }
                                      }],
                                      update: li => {
                                        // let sqlDate = day.moment.format(this.resource.output_format);
                                        // const sqlDate = this.toSQL(day.date);

                                        // li.element.classList.toggle("active", value === sqlDate);
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
                        };
                      }
                    }
                  ];

                } else {

                  popup.children = [];

                }
              }
            },
            {
              tag: "input",
              class: "text-input date karma-field-input",
              init: (input) => {
                input.element.type = "text";
                input.element.id = this.getUid();
              },
              update: (input) => {

                input.element.placeholder = this.getPlaceholder();


                if (this.resource.readonly) {
                  input.element.readOnly = true;
                } else {
                  input.element.onkeyup = () => {

                    // let mDate = moment(input.element.value, this.resource.format);
                    //
                    // if (input.element.value.length === 10 && mDate.isValid()) {
                    //   data.date = mDate.toDate();
                    //   var sqlDate = mDate.format(this.resource.output_format || "YYYY-MM-DD hh:mm:ss");
                    //   this.setValue(sqlDate);
                    // } else {
                    //   this.setValue(input.element.value);
                    //
                    // }

                    // const date = this.parseDate(input.element.value);
                    const date = this.constructor.parse(input.element.value, this.resource.displayFormat);

                    if (date) {
                      data.date = date;
                      // const sqlDate = this.toSQL(date);
                      const sqlDate = this.constructor.format(date, this.resource.storeFormat);
                      this.setValue(sqlDate);
                    } else {
                      this.setValue(input.element.value);
                    }

                    this.render();
                  };
                  input.element.onfocus = () => {
                    // let mDate = moment(input.element.value, this.resource.format);
                    // data.date = mDate && mDate.isValid() && mDate.toDate() || new Date();
                    // const date = this.parseDate(input.element.value);
                    const date = this.constructor.parse(input.element.value, this.resource.displayFormat);
                    data.date = date || new Date();
                    this.render();
                  };
                  input.element.onfocusout = () => {
                    // data.date = null;
                    // this.render();
                    // console.log("onfocusout");
                  };
                  input.element.onblur = () => {
                    data.date = null;
                    this.render();
                  };
                }

                let displayDate;

                // let mDate = moment(value, this.resource.output_format);

                // let date = new Date(value);
                const date = this.constructor.parse(value, this.resource.storeFormat);

                if (date) {

                  displayDate = this.constructor.format(date, this.resource.displayFormat);

                } else {

                  displayDate = value || "";

                }


                if (input.element.value !== displayDate) {

                  input.element.value = displayDate;

                }

                if (!data.date) {
                  input.element.blur();
                }
              }
            }
          ]

        }

      }
    };
  }

  // buildDateInput() {
  //   console.error("deprecated");
  //   return {
  //     tag: "input",
  //     class: "karma-field text-input date karma-field-input",
  //     init: input => {
  //       input.element.type = "text";
  //       input.element.id = this.getId();
  //       input.element.setAttribute('tabindex', '-1');
  //     },
  //     update: async input => {
  //       input.element.classList.add("loading");
  //
  //       let value = await this.fetchValue();
  //
  //       if (this.resource.readonly) {
  //         input.element.readOnly = true;
  //       } else {
  //         input.element.onkeyup = async () => {
  //           let inputDate = moment(input.element.value, this.format).toDate();
  //           if (inputDate) {
  //             this.date = inputDate;
  //             var sqlDate = moment(this.date).format(this.resource.output_format || "YYYY-MM-DD hh:mm:ss");
  //             await this.editValue(sqlDate);
  //             this.render();
  //           }
  //           input.element.classList.toggle("valid-date", inputDate);
  //         };
  //         input.element.onfocus = async () => {
  //
  //           if (this.isEmpty(value)) {
  //             this.date = new Date();
  //           } else {
  //             this.date = moment(value).toDate();
  //           }
  //           this.render();
  //         };
  //         input.element.onfocusout = async () => {
  //           this.date = null;
  //           if (!moment(input.element.value, this.format).isValid()) {
  //             await this.editValue("");
  //           }
  //           this.render();
  //         };
  //       }
  //
  //       input.element.classList.toggle("modified", this.isModified());
  //
  //       if (this.isEmpty(value)) {
  //         input.element.value = ""
  //       } else {
  //         let moment = moment(value);
  //         if (moment.isValid()) {
  //           input.element.value = moment(value).format(this.format);
  //         } else {
  //           input.element.value = value;
  //         }
  //
  //       }
  //
  //       if (!this.date) {
  //         input.element.blur();
  //       }
  //       input.element.classList.remove("loading");
  //     }
  //   }
  // }


  // build() {
  //   // const field = this;
  //   // if (this.resource.readonly) {
  //   //   return this.buildDateInput();
  //   // } else {
  //   //   return this.buildDateContainer();
  //   // }
  //
  //   return this.buildDateContainer();
  //
  // }

}
