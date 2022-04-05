
KarmaFieldsAlpha.fields.date = class extends KarmaFieldsAlpha.fields.input {

  constructor(resource, parent, form) {
		super(resource, parent, form);

		// this.format = resource.format || "dd/mm/yyyy";

    // compat:
    // if (resource.format) {
    //   // resource.format.replace("dd", "d").replace("mm", "m").replace("yyyy", "Y");
    //   resource.format = resource.format.toUpperCase();
    // }
    //
    // if (resource.output_format) {
    //   resource.format.replace("dd", "d").replace("mm", "m").replace("yyyy", "Y").replace("hh", "h").replace("ii", "i").replace("ss", "s");
    // }

    this.format = resource.format || "DD/MM/YYYY";

    // this.format = resource.format.replace("d", "DD").replace("m", "MM").replace("Y", "YYYY");
	}

  // getEmpty() {
  //   // return this.resource.empty || this.resource.output_format === 'yyyy-mm-dd' && '0000-00-00' || '0000-00-00 00:00:00';
  //
  //   return '';
  // }


  // isEmpty(value) {
  //   console.error("deprecated");
  //   return !value || value === this.getEmpty();
  // }
  //
  // setDefault() {
  //   console.error("deprecated");
  //   let value = "";
  //   if (this.resource.default === "now") {
  //     value = moment().format(this.resource.output_format || "YYYY-MM-DD hh:mm:ss");
  //   } else if (this.resource.default) {
  //     let momentDate = moment(this.resource.default, [this.format, this.resource.output_format || "YYYY-MM-DD hh:mm:ss"]);
  //     if (momentDate.isValid()) {
  //       value = momentDate.format(this.resource.output_format || "YYYY-MM-DD hh:mm:ss");
  //     }
  //   }
  //   this.initValue(value);
  // }

  getDefault() {
    if (this.resource.default === "now") {
      return moment().format(this.resource.output_format || "YYYY-MM-DD hh:mm:ss");
    } else if (this.resource.default) {
      let momentDate = moment(this.resource.default, [this.format, this.resource.output_format || "YYYY-MM-DD hh:mm:ss"]);
      if (momentDate.isValid()) {
        return momentDate.format(this.resource.output_format || "YYYY-MM-DD hh:mm:ss");
      }
    }
    return "";
  }

  async exportValue() {
    let value = await this.getValue();
    // value = this.format(value);
    // if (KarmaFieldsAlpha.Calendar.parse(value, this.resource.output_format)) {
    //   return value;
    // }
    // let date = new Date(value);
    // if (!isNaN(date)) {
    //   return wp.date.dateI18n(date, this.resource.export_format || 'd-m-Y');
    //   return moment(this.resource.default).format(this.resource.output_format || "YYYY-MM-DD hh:mm:ss");
    // }

    const momentDate = moment(value);
    if (momentDate.isValid()) {
      return momentDate.format(this.resource.export_format || "DD-MM-YYYY");
    }


    return value || '';
  }

  async importValue(value) {

    const momentDate = moment(value);
    if (momentDate.isValid()) {
      return momentDate.format(this.resource.export_format || this.format);
    }

    await this.setValue(value || "");


    // return value || '';
  }

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

  // not used yet
  // keyChange(input, dir) {
  //   const field = this;
  //   let value = this.getValue();
  //   this.date = KarmaFieldsAlpha.Calendar.parse(value, this.resource.output_format);
  //   let index = input.selectionStart || 0;
  //   if (this.format[index] === "y" || this.format[index-1] === "y") {
  //     this.date.setFullYear(this.date.getFullYear() + dir);
  //   } else if (this.format[index] === "m" || this.format[index-1] === "m") {
  //     this.date.setMonth(this.date.getMonth() + dir);
  //   } else if (this.format[index] === "d" || this.format[index-1] === "d") {
  //     this.date.setDate(this.date.getDate() + dir);
  //   }
  //
  //   input.setSelectionRange(index, index);
  //   let sqlDate = KarmaFieldsAlpha.Calendar.format(this.date, this.resource.output_format);
  //   field.setValue(sqlDate);
  // };


  buildPopup(value) {
    return {
      class: "popup",
      init: popup => {
        // prevent input loosing focus
        popup.element.onmousedown = event => {
          event.preventDefault();
        };
      },
      update: container => {
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
                    // this.element.textContent = KarmaFieldsAlpha.Calendar.format(field.date, "%fullmonth% yyyy");
                    // this.element.textContent = wp.date.dateI18n(field.date, "F Y");
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
                          // this.element.textContent = KarmaFieldsAlpha.Calendar.format(day.date, "#d");
                          // this.element.textContent = wp.date.dateI18n(day.date, "j");
                          a.element.textContent = day.moment.format("D");
                          a.element.onmouseup = async event => {
                            event.preventDefault();
                            // let sqlDate = KarmaFieldsAlpha.Calendar.format(day.date, field.resource.output_format);
                            // let sqlDate = wp.date.format(day.date, field.resource.output_format || "Y-m-d h:i:s");
                            let sqlDate = day.moment.format(this.resource.output_format || "YYYY-MM-DD hh:mm:ss");
                            this.date = null;
                            // this.backup();
                            // this.editValue(sqlDate);
                            await this.setValue(sqlDate);
                            this.render();
                          }
                        }
                      }],
                      update: li => {
                        // let sqlDate = wp.date.format(day.date, field.resource.output_format || "Y-m-d h:i:s");
                        let sqlDate = day.moment.format(this.resource.output_format || "YYYY-MM-DD hh:mm:ss");

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
        // this.init(container.element);
      },
      update: async (container) => {
        this.render = container.render;

        // let value = await this.getInputValue();

        // let array = await this.fetchValue() || [];
        //
				// // compat
				// if (!Array.isArray(array)) {
				// 	array = [array];
				// }
        //
				// // preset empty
				// if (!array.length) {
				// 	array = this.getDefault();
				// 	this.setValue(null, array);
				// }
        //
				// let value = array.toString();


        let value = await this.getValue();

        // let value = await this.fetchValue();
        // value = this.validate(value);
        let mDate = moment(value);

        container.element.classList.add("loading");


        container.children = [
          {
            class: "date-popup-container open-down",
            update: popup => {
              popup.element.classList.toggle("open-left", popup.element.offsetParent.clientWidth - popup.element.offsetLeft < 280);
              popup.children = this.date && !this.resource.readonly && [this.buildPopup(value)] || [];
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
                input.element.onkeyup = async () => {
                  // let inputDate = moment(input.element.value, this.format).toDate();
                  // if (inputDate) {
                  //   this.date = inputDate;
                  //   var sqlDate = moment(this.date).format(this.resource.output_format || "YYYY-MM-DD hh:mm:ss");
                  //   await this.editValue(sqlDate);
                  //   this.render();
                  // }
                  // input.element.classList.toggle("valid-date", inputDate);


                  mDate = moment(input.element.value, this.format);
                  if (input.element.value.length === 10 && mDate.isValid()) {
                    // console.log(input.element.value, mDate.isValid());
                    this.date = mDate.toDate();
                    var sqlDate = mDate.format(this.resource.output_format || "YYYY-MM-DD hh:mm:ss");
                    // await this.editValue(sqlDate);
                    await this.setValue(sqlDate);
                    this.render();
                  }
                  input.element.classList.toggle("valid-date", mDate.isValid());


                };
                input.element.onfocus = async () => {
                  // const value = await this.fetchValue();
                  // this.date = value && KarmaFieldsAlpha.Calendar.parse(value, this.resource.output_format) || new Date();


                  if (!value) {
                    this.date = new Date();
                  } else {
                    // this.date = KarmaFieldsAlpha.Calendar.parse(value, this.resource.output_format);
                    this.date = mDate.toDate();
                  }
                  this.render();
                };
                input.element.onfocusout = async () => {
                  this.date = null;

                  // if (!KarmaFieldsAlpha.Calendar.parse(input.element.value, this.format)) {
                  //   // field.changeValue("");
                  //   await this.editValue("");
                  // }
                  // console.log(input.element.value, this.format, !moment(input.element.value, this.format).isValid());
                  if (!moment(input.element.value, this.format).isValid()) {
                    // await this.editValue("");
                    await this.setValue("");
                  }
                  this.render();
                };
              }


              container.element.classList.toggle("modified", this.modified);

              // if (this.isEmpty(value)) {
              //   input.element.value = ""
              // } else {
              //
              //   if (moment.isValid()) {
              //     input.element.value = moment(value).format(this.format);
              //   } else {
              //     input.element.value = value;
              //   }
              //
              // }


              if (mDate.isValid()) {
                input.element.value = mDate.format(this.format);
              } else {
                input.element.value = value || "";
              }

              // let date = value && KarmaFieldsAlpha.Calendar.parse(value, this.resource.output_format);
              // input.element.value = date && KarmaFieldsAlpha.Calendar.format(date, this.format) || "";
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

  buildDateInput() {
    console.error("deprecated");
    return {
      tag: "input",
      class: "karma-field text-input date karma-field-input",
      init: input => {
        input.element.type = "text";
        input.element.id = this.getId();
        input.element.setAttribute('tabindex', '-1');
      },
      update: async input => {
        input.element.classList.add("loading");

        let value = await this.fetchValue();

        if (this.resource.readonly) {
          input.element.readOnly = true;
        } else {
          input.element.onkeyup = async () => {
            let inputDate = moment(input.element.value, this.format).toDate();
            if (inputDate) {
              this.date = inputDate;
              var sqlDate = moment(this.date).format(this.resource.output_format || "YYYY-MM-DD hh:mm:ss");
              await this.editValue(sqlDate);
              this.render();
            }
            input.element.classList.toggle("valid-date", inputDate);
          };
          input.element.onfocus = async () => {

            if (this.isEmpty(value)) {
              this.date = new Date();
            } else {
              this.date = moment(value).toDate();
            }
            this.render();
          };
          input.element.onfocusout = async () => {
            this.date = null;
            if (!moment(input.element.value, this.format).isValid()) {
              await this.editValue("");
            }
            this.render();
          };
        }

        input.element.classList.toggle("modified", this.isModified());

        if (this.isEmpty(value)) {
          input.element.value = ""
        } else {
          let moment = moment(value);
          if (moment.isValid()) {
            input.element.value = moment(value).format(this.format);
          } else {
            input.element.value = value;
          }

        }

        if (!this.date) {
          input.element.blur();
        }
        input.element.classList.remove("loading");
      }
    }
  }


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
