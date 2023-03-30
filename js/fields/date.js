
KarmaFieldsAlpha.field.date = class extends KarmaFieldsAlpha.field.input {

  constructor(resource) {

		super({
      format: "DD/MM/YYYY",
      output_format: "YYYY-MM-DD hh:mm:ss",
      export_format: "DD/MM/YYYY",
      ...resource
    });

	}

  getDefault() {
    let value = "";
    if (this.resource.default === "now") {
      value = moment().format(this.resource.output_format);
    } else if (this.resource.default) {
      const momentDate = moment(this.resource.default, [this.resource.format, this.resource.output_format]);
      if (momentDate.isValid()) {
        value = momentDate.format(this.resource.output_format);
      }
    }
    const key = this.getKey();
    return {[key]: value};
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
			days.push({
				date: day,
        moment: moment(day),
				// sqlDate: this.format(day),
				isDayBefore: day.getTime() == lastDayPrevMonth.getTime(),
				isDayAfter: day.getTime() == firstDayNextMonth.getTime(),
				isOffset: day.getTime() <= lastDayPrevMonth.getTime() || day.getTime() >= firstDayNextMonth.getTime(),
				isToday: day.getTime() === today,
				isWeekend: day.getDay() === 0 || day.getDay() === 6
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

  buildPopup(value) {
    return {
      class: "date-popup",
      init: popup => {
        // prevent input loosing focus
        popup.element.onmousedown = event => {
          event.preventDefault();
        };
      },
      update: container => {
        if (!this.date) {
          this.date = new Date();
        }
        const days = this.getMonthDays(this.date);
        let rows = [];
        while(days.length) {
          rows.push(days.splice(0, 7));
        }
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
                    init: a => {
                      a.element.innerHTML = "&lsaquo;";
                      a.element.onclick = event => {
                        this.date.setMonth(this.date.getMonth()-1);
                        container.render();
                      };
                    }
                  }
                },
                {
                  tag: "li",
                  class: "current-month",
                  update: li => {
                    li.element.textContent = moment(this.date).format("MMMM YYYY");
                  }
                },
                {
                  tag: "li",
                  class: "next-month calendar-arrow",
                  child: {
                    tag: "a",
                    init: a => {
                      a.element.innerHTML = "&rsaquo;";
                      a.element.onclick = event => {
                        this.date.setMonth(this.date.getMonth()+1);
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
                    // this.element.textContent = KarmaFieldsAlpha.Calendar.format(day.date, "%d2%");
                    // this.element.textContent = wp.date.dateI18n(day.date, "D").slice(0, 2);
                    li.element.textContent = day.moment.format("dd");
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
                          a.element.textContent = day.moment.format("D");
                          a.element.onmouseup = event => {
                            event.preventDefault();
                            let sqlDate = day.moment.format(this.resource.output_format);
                            this.date = null;
                            const key = this.getKey();

                            this.parent.request("set", sqlDate, key);
                            // this.render();
                            this.parent.request("render");
                          }
                        }
                      }],
                      update: li => {
                        let sqlDate = day.moment.format(this.resource.output_format);

                        li.element.classList.toggle("active", value === sqlDate);
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
    };
  }

  buildDateContainer() {
    return {
      class: "karma-field karma-field-date",
      init: (container) => {
        container.element.setAttribute('tabindex', '-1');
      },
      update: (container) => {
        this.render = container.render;

        const key = this.getKey();
        const values = this.parent.request("get", {}, key);

        container.element.classList.toggle("loading", !values);

        if (values) {

          let calendarDate = this.parent.request("get-option", {}, this.resource.key, "date");

          let [value] = values;

          // let mDate = moment(value);

          // console.log(value, mDate, mDate.isValid());

          container.children = [
            {
              class: "date-popup-container open-down",
              update: popup => {
                // popup.element.classList.toggle("open-left", popup.element.clientWidth - popup.element.offsetLeft < 280);

       
                // popup.children = this.date && !this.resource.readonly && [this.buildPopup(value)] || [];

                if (calendarDate && !this.resource.readonly) {

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
                        // if (!this.date) {
                        //   this.date = new Date();
                        // }
                        const days = this.getMonthDays(calendarDate);
                        let rows = [];
                        while(days.length) {
                          rows.push(days.splice(0, 7));
                        }
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
                                        calendarDate.setMonth(calendarDate.getMonth()-1);
                                        container.render();
                                      };
                                    }
                                  }
                                },
                                {
                                  tag: "li",
                                  class: "current-month",
                                  update: li => {
                                    // li.element.textContent = moment(calendarDate).format("MMMM YYYY");
                                    li.element.textContent = new Intl.DateTimeFormat(KarmaFieldsAlpha.locale, {month: "long", year: "numeric"}).format(calendarDate);
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
                                        calendarDate.setMonth(calendarDate.getMonth()+1);
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
                                    // this.element.textContent = KarmaFieldsAlpha.Calendar.format(day.date, "%d2%");
                                    // this.element.textContent = wp.date.dateI18n(day.date, "D").slice(0, 2);
                                    // li.element.textContent = day.moment.format("dd");
                                    // console.log(day);
                                    li.element.textContent = new Intl.DateTimeFormat(KarmaFieldsAlpha.locale, {weekday: "narrow"}).format(day.date);

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
                                          a.element.textContent = new Intl.DateTimeFormat(KarmaFieldsAlpha.locale, {day: "numeric"}).format(day.date);
                                          a.element.onmouseup = event => {
                                            event.preventDefault();
                                            let sqlDate = day.moment.format(this.resource.output_format);
                                            calendarDate = null;
                                            this.parent.request("set-option", calendarDate, this.resource.key, "date");

                                            const key = this.getKey();
                
                                            this.parent.request("set", sqlDate, key);
                                            this.parent.request("render");
                                          }
                                        }
                                      }],
                                      update: li => {
                                        let sqlDate = day.moment.format(this.resource.output_format);
                
                                        li.element.classList.toggle("active", value === sqlDate);
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
                input.element.id = this.getId();
              },
              update: (input) => {



                if (this.resource.readonly) {
                  input.element.readOnly = true;
                } else {
                  input.element.onkeyup = () => {

                    let mDate = moment(input.element.value, this.resource.format);

                    if (input.element.value.length === 10 && mDate.isValid()) {
                      calendarDate = mDate.toDate();
                      this.parent.request("set-option", calendarDate, this.resource.key, "date");

                      var sqlDate = mDate.format(this.resource.output_format || "YYYY-MM-DD hh:mm:ss");
                      this.parent.request("set", sqlDate, key);
                      this.render();
                    }

                  };
                  input.element.onfocus = () => {
                    let mDate = moment(input.element.value, this.resource.format);
                    calendarDate = mDate && mDate.isValid() && mDate.toDate() || new Date();
                    this.parent.request("set-option", calendarDate, this.resource.key, "date");
                    this.render();
                  };
                  input.element.onfocusout = () => {
                    calendarDate = null;
                    this.parent.request("set-option", calendarDate, this.resource.key, "date");
                    // console.log(input.element.value);
                    // if (!moment(input.element.value, this.resource.format).isValid()) {
                    //   this.parent.request("set", "", key);
                    // }
                    this.render();
                  };
                }


                // container.element.classList.toggle("modified", this.modified);


                // if (input.element !== document.activeElement) {

                let displayDate = "";

                if (value) {

                  let mDate = moment(value, this.resource.output_format);

                  if (mDate.isValid()) {

                    displayDate = mDate.format(this.resource.format);
                    
                  } else {

                    displayDate = value || "";

                  }

                }

                if (input.element.value !== displayDate) {

                  input.element.value = displayDate;

                }

                
                  
                  
                  // if (value && mDate.isValid()) {
                  //   input.element.value = mDate.format(this.resource.format);
                  // } else {

                  //   // console.log(value);
                  //   input.element.value = value || "";
                  // }


                // }

                

                if (!calendarDate) {
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


  build() {
    // const field = this;
    // if (this.resource.readonly) {
    //   return this.buildDateInput();
    // } else {
    //   return this.buildDateContainer();
    // }

    return this.buildDateContainer();

  }

}
