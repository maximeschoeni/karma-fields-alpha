
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

      if (key && value && value.length === key.length && !isNaN(value)) {

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

  export() {

    if (this.resource.export !== false) {

      const content = this.getContent();

      if (!content.loading) {

        const date = this.constructor.parse(content.toString(), this.resource.storeFormat);

        if (date) {

          content.value = this.constructor.format(date, this.resource.displayFormat);

        }

      }

      return content;

    }

    return new KarmaFieldsAlpha.Content();

  }

  async import(collection) {

    if (typeof this.resource.import === "string") {

      const string = collection.value.shift();

      if (string) {

        const date = KarmaFieldsAlpha.field.date.parse(string, this.resource.import);

        if (date instanceof Date) {

          const value = KarmaFieldsAlpha.field.date.format(date, this.resource.storeFormat);

          await this.setValue(value);

        }

      }

    } else if (this.resource.import !== false) {

			const string = collection.value.shift();

			await this.setValue(string);

		}

  }


  getDefault() {

    let content;

    if (this.resource.default === "now") {

      const value = this.constructor.format(new Date(), this.resource.storeFormat);

      return new KarmaFieldsAlpha.Content(value);

    } else {

      return super.getDefault();

    }

  }

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


  async render() {

    if (this.element) {

      await KarmaFieldsAlpha.build(this.build(), this.element.parentNode, this.element);

    } else {

      await this.parent.render();

    }

  }

  *buildPopup() {

    const content = this.getContent();
    const hasFocus = this.hasFocus();

    // const currentDate = this.date || new Date();

    if (hasFocus) {


      const activeDate = !content.loading && this.constructor.parse(content.toString(), this.resource.storeFormat);

      if (!this.date) {

        this.date = activeDate || new Date();

      }

      const rows = this.createCalendar(this.date);


      yield {
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
                    a.element.onclick = async event => {
                      this.date.setMonth(this.date.getMonth()-1);
                      // await this.setState(currentDate, "date");
                      await this.render(); // local render
                    };
                  }
                }
              },
              {
                tag: "li",
                class: "current-month",
                update: li => {
                  li.element.textContent = this.date.toLocaleDateString(KarmaFieldsAlpha.locale, {month: "long", year: "numeric"});
                }
              },
              {
                tag: "li",
                class: "next-month calendar-arrow",
                child: {
                  tag: "a",
                  update: a => {
                    a.element.innerHTML = "&rsaquo;";
                    a.element.onclick = async event => {
                      this.date.setMonth(this.date.getMonth()+1);
                      // await this.setState(currentDate, "date");
                      await this.render();
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
                          await this.save("date", "Select Date");
                          await this.setValue(sqlDate);
                          // await this.setState("", "date");
                          await this.removeFocus();
                          await this.parent.render(); // -> global render
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
      };

    }

  }

  // buildPopup() {
  //   return {
  //     class: "date-popup",
  //     init: popup => {
  //       // prevent input loosing focus
  //       popup.element.onmousedown = event => {
  //         event.stopPropagation(); // -> prevent reseting modal selection
  //         event.preventDefault(); // -> prevent input blur event
  //       };
  //     },
  //     update: container => {
  //
  //       const content = this.getContent();
  //       const currentDate = this.getState("date");
  //       const hasFocus = this.hasFocus();
  //
  //       if (hasFocus && currentDate) {
  //
  //         const rows = this.createCalendar(currentDate);
  //         const activeDate = !content.loading && this.constructor.parse(content.toString(), this.resource.storeFormat);
  //
  //         container.children = [
  //           {
  //             class: "calendar",
  //             children: [
  //               {
  //                 tag: "ul",
  //                 class: "calendar-nav",
  //                 children: [
  //                   {
  //                     tag: "li",
  //                     class: "prev-month calendar-arrow",
  //                     child: {
  //                       tag: "a",
  //                       update: a => {
  //                         a.element.innerHTML = "&lsaquo;";
  //                         a.element.onclick = async event => {
  //                           currentDate.setMonth(currentDate.getMonth()-1);
  //                           await this.setState(currentDate, "date");
  //                           await container.render();
  //                         };
  //                       }
  //                     }
  //                   },
  //                   {
  //                     tag: "li",
  //                     class: "current-month",
  //                     update: li => {
  //                       li.element.textContent = currentDate.toLocaleDateString(KarmaFieldsAlpha.locale, {month: "long", year: "numeric"});
  //                     }
  //                   },
  //                   {
  //                     tag: "li",
  //                     class: "next-month calendar-arrow",
  //                     child: {
  //                       tag: "a",
  //                       update: a => {
  //                         a.element.innerHTML = "&rsaquo;";
  //                         a.element.onclick = async event => {
  //                           currentDate.setMonth(currentDate.getMonth()+1);
  //                           await this.setSelection(currentDate, "date");
  //                           await container.render();
  //                         };
  //                       }
  //                     }
  //                   }
  //                 ]
  //               },
  //               {
  //                 tag: "ul",
  //                 class: "calendar-days-title",
  //                 children: rows[0].map(day => {
  //                   return {
  //                     tag: "li",
  //                     update: li => {
  //                       li.element.textContent = day.date.toLocaleDateString(KarmaFieldsAlpha.locale, {weekday: "short"});
  //                     }
  //                   };
  //                 })
  //               },
  //               {
  //                 class: "calendar-days",
  //                 children: rows.map(row => {
  //                   return {
  //                     tag: "ul",
  //                     class: "calendar-days-content",
  //                     children: row.map(day => {
  //                       return {
  //                         tag: "li",
  //                         children: [{
  //                           tag: "a",
  //                           update: a => {
  //                             a.element.textContent = day.date.toLocaleDateString(KarmaFieldsAlpha.locale, {day: "numeric"});
  //                             a.element.onmouseup = async event => {
  //                               event.preventDefault();
  //                               const sqlDate = this.constructor.format(day.date, this.resource.storeFormat);
  //                               await this.save("date", "Select Date");
  //                               await this.setValue(sqlDate);
  //                               await this.removeState("date");
  //                               await container.render();
  //                               await this.render();
  //                             }
  //                           }
  //                         }],
  //                         update: li => {
  //                           li.element.classList.toggle("active", Boolean(activeDate && day.date.getTime() === activeDate.getTime()));
  //                           li.element.classList.toggle("offset", day.isOffset);
  //                           li.element.classList.toggle("today", day.isToday);
  //                         }
  //                       };
  //                     })
  //                   };
  //                 })
  //               }
  //             ]
  //           }
  //         ];
  //       } else {
  //         container.children = [];
  //       }
  //     }
  //   };
  // }


  build() {
    return {
      class: "karma-field karma-field-date",
      init: container => {
        container.element.onmousedown = event => {
          event.stopPropagation();
          // event.preventDefault();
        }
      },
      update: node => {
        this.element = node.element;
      },
      children: [
        {
          class: "date-popup-container open-down",
          child: {
            class: "date-popup",
            init: popup => {
              // prevent input loosing focus
              popup.element.onmousedown = event => {
                event.stopPropagation(); // -> prevent reseting modal selection
                event.preventDefault(); // -> prevent input blur event
              };
            },
            children: [...this.buildPopup()]
          }
        },
        {
          tag: "input",
          class: "text-input date karma-field-input",
          init: input => {
            input.element.type = "text";
            input.element.id = this.getUid();
          },
          update: input => {
            const content = this.getContent();
            // const currentDate = this.getState("date");

            input.element.placeholder = this.getPlaceholder();
            input.element.classList.toggle("loading", Boolean(content.loading));

            if (!content.loading) {

              let value = content.toString();

              input.element.classList.toggle("mixed", Boolean(content.mixed));
              input.element.classList.toggle("selected", Boolean(content.mixed && this.hasFocus()));

              if (this.resource.readonly) {

                input.element.readOnly = true;

              } else {

                input.element.readOnly = false;

                input.element.onkeyup = async () => {

                  const date = this.constructor.parse(input.element.value, this.resource.displayFormat);

                  await this.save("date", "Change Date");

                  if (date) {

                    // await this.setState(date, "date");
                    this.date = date;
                    const sqlDate = this.constructor.format(date, this.resource.storeFormat);
                    await this.setValue(sqlDate);

                  } else {

                    await this.setValue(input.element.value);

                  }

                  await this.parent.render(); // global render
                };

                input.element.onfocus = async () => {
                  // const date = this.constructor.parse(input.element.value, this.resource.displayFormat) || new Date();
                  //
                  // // await this.setState(date, "date");
                  // this.date = date;
                  await this.setFocus(content.mixed);

                  await this.parent.render(); // global render
                };

                // input.element.onblur = async () => {
                //
                //   await this.removeFocus();
                //   await this.parent.render(); // global render
                //
                // }


              }

              if (content.mixed) {

                input.element.value = "[mixed values]";
                input.element.readOnly = true;

              } else {

                let displayDate;

                const date = this.constructor.parse(content.toString(), this.resource.storeFormat);

                if (date) {

                  displayDate = this.constructor.format(date, this.resource.displayFormat);

                } else {

                  displayDate = content.toString() || "";

                }


                if (input.element.value !== displayDate) {

                  input.element.value = displayDate;

                }

              }


              // if (hasFocus && input.element !== document.activeElement && !content.mixed) {
              //
              //   input.element.focus();
              //
              // }
              //
              //
              //
              // if (!hasFocus || !currentDate && input.element === document.activeElement) {
              //
              //   input.element.blur();
              //
              // }





            }


          }
        }
      ]

    };
  }

}
