
KarmaFieldsAlpha.field.date = class extends KarmaFieldsAlpha.field.input {

	constructor(resource, id, parent) {

		super({
			displayFormat: "dd/mm/yyyy",
			storeFormat: "yyyy-mm-dd",
			...resource
		}, id, parent);



	}

	static parse(string, format) {

		const formats = format.split(/[^dmy]/);
		const values = string.split(/\D/);

		const object = {};

		for (let i = 0; i < 3; i++) {

			const key = formats[i];
			const value = values[i];

			if (key && value && value.length === key.length && !isNaN(value)) {

				object[key] = Number(value);

			}

		}

		if (object.dd && object.mm && object.yyyy) {

			return new Date(object.yyyy, object.mm - 1, object.dd);

		}

	}

	static format(date, format) {

		return format
			.replace("dd", date.toLocaleDateString("en", { day: "2-digit" }))
			.replace("mm", date.toLocaleDateString("en", { month: "2-digit" }))
			.replace("yyyy", date.toLocaleDateString("en", { year: "numeric" }));

	}

	export() {

		if (this.resource.export !== false) {

			const values = this.getValue();

			if (values !== undefined) {

				const date = this.constructor.parse(values[0], this.resource.storeFormat);

				if (date) {

					const value = this.constructor.format(date, this.resource.displayFormat);

					return [value];

				}

				return [];

			}

			return;

		}

		return [];

	}

	import(collection) {

		if (typeof this.resource.import === "string") {

			const string = collection.shift();

			if (string) {

				const date = this.constructor.parse(string, this.resource.import);

				if (date instanceof Date) {

					const value = this.constructor.format(date, this.resource.storeFormat);

					this.setValue([value]);

				}

			}

		} else if (this.resource.import !== false) {

			const string = collection.shift();

			this.setValue([string]);

		}

	}


	getDefault() {

		if (this.resource.default === "now") {

			const value = this.constructor.format(new Date(), this.resource.storeFormat);

			return [value];

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

		while ((date.getTime() < firstDayNextMonth.getTime()) || date.getDay() !== 1) {
			var day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
			var time = day.getTime();

			days.push({
				date: day,
				time: time,
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

		while (days.length) {

			rows.push(days.splice(0, 7));

		}

		return rows;
	}


	render() {

		if (this.element) {

			// await KarmaFieldsAlpha.build(this.build(), this.element.parentNode, this.element);
			abduct(this.element.parentNode, this.build());

		} else {

			this.parent.render();

		}

	}

	*buildPopup() {

		if (this.hasFocus()) {

			const values = this.getValue();
			const value = values[0] || "";
			const activeDate = values !== undefined && this.constructor.parse(value, this.resource.storeFormat);

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
									update: element => {
										element.innerHTML = "&lsaquo;";
										element.onclick = event => {
											this.date.setMonth(this.date.getMonth() - 1);
											this.render(); // local render
										};
									}
								}
							},
							{
								tag: "li",
								class: "current-month",
								update: element => {
									element.textContent = this.date.toLocaleDateString(KarmaFieldsAlpha.locale, { month: "long", year: "numeric" });
								}
							},
							{
								tag: "li",
								class: "next-month calendar-arrow",
								child: {
									tag: "a",
									update: element => {
										element.innerHTML = "&rsaquo;";
										element.onclick = event => {
											this.date.setMonth(this.date.getMonth() + 1);
											this.render();
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
								update: element => {
									element.textContent = day.date.toLocaleDateString(KarmaFieldsAlpha.locale, { weekday: "short" });
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
											update: element => {
												element.textContent = day.date.toLocaleDateString(KarmaFieldsAlpha.locale, { day: "numeric" });
												element.onmouseup = event => {
													event.preventDefault();
													const sqlDate = this.constructor.format(day.date, this.resource.storeFormat);

													this.save("date", "Select Date");
													this.setValue([sqlDate]);
													this.removeFocus();
													this.parent.render(); // -> global render
												}
											}
										}],
										update: element => {
											element.classList.toggle("active", Boolean(activeDate && day.date.getTime() === activeDate.getTime()));
											element.classList.toggle("offset", day.isOffset);
											element.classList.toggle("today", day.isToday);
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

	*build() {
		yield {
			class: "karma-field karma-field-date",
			init: element => {
				element.onmousedown = event => {
					event.stopPropagation();
					// event.preventDefault();
				}
			},
			update: element => {
				this.element = element;
			},
			children: [
				{
					class: "date-popup-container open-down",
					child: {
						class: "date-popup",
						init: element => {
							// prevent input loosing focus
							element.onmousedown = event => {
								event.stopPropagation(); // -> prevent reseting modal selection
								event.preventDefault(); // -> prevent input blur event
							};
						},
						children: this.buildPopup()
					}
				},
				{
					tag: "input",
					class: "text-input date karma-field-input",
					init: element => {
						element.type = "text";
						element.id = this.getUid();
					},
					update: element => {
						const values = this.getValue();

						element.placeholder = this.getPlaceholder();

						if (values !== undefined) {

							const mixed = this.isMixed();

							element.classList.toggle("mixed", mixed);
							element.classList.toggle("selected", mixed && this.hasFocus());

							if (this.resource.readonly) {

								element.readOnly = true;

							} else {

								element.readOnly = false;

								element.onkeyup = () => {

									const date = this.constructor.parse(element.value, this.resource.displayFormat);

									this.save("date", "Change Date");

									if (date) {

										this.date = date;
										const sqlDate = this.constructor.format(date, this.resource.storeFormat);
										this.setValue([sqlDate]);

									} else {

										this.setValue([element.value]);

									}

									this.parent.render(); // global render
								};

								element.onfocus = () => {
									this.setFocus(mixed);
									this.parent.render(); // global render
								};

								// input.element.onblur = async () => {
								//
								//   await this.removeFocus();
								//   await this.parent.render(); // global render
								//
								// }


							}

							if (mixed) {

								element.value = "[mixed values]";
								element.readOnly = true;

							} else {

								let displayDate = values[0] || "";

								const date = this.constructor.parse(displayDate, this.resource.storeFormat);

								if (date) {

									displayDate = this.constructor.format(date, this.resource.displayFormat);

								}


								if (element.value !== displayDate) {

									element.value = displayDate;

								}

							}

						}


					}
				}
			]

		};
	}

}
