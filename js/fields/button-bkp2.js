KarmaFieldsAlpha.fields.button = class extends KarmaFieldsAlpha.fields.text {



	// async isHidden() {
	// 	if (this.resource.hidden) {
	// 		return await this.fetchState(this.resource.hidden, "hidden");
	// 	}
	// 	return false;
	// }


	// constructor(...args) {
	// 	super(...args);
	//
	// 	if (this.resource.disabled) {
	// 		this.disabled = this.parseState(this.resource.disabled);
	// 	}
	//
	// }

	// checkState(state) {
	// 	if (!this.states[state]) {
	// 		let matches = state.match(/^(.*?)(=|<|>|!=|<=|>=|!|\?)(.*)$/);
	//     if (matches) {
	//       switch (matches[2]) {
	//         case "=":
	//           this.states[state] = async () => await this.fetchValue(this.resource.context || "value", matches[1]).toString() === matches[3];
	//           break;
	//         case "<":
	//           this.states[state] = async () => await this.fetchValue(this.resource.context || "value", matches[1]).toString() < matches[3];
	//           break;
	//         case ">":
	//           this.states[state] = async () => await this.fetchValue(this.resource.context || "value", matches[1]).toString() > matches[3];
	//           break;
	//         case "!=":
	//           this.states[state] = async () => await this.fetchValue(this.resource.context || "value", matches[1]).toString() != matches[3];
	//           break;
	//         case "<=":
	//           this.states[state] = async () => await this.fetchValue(this.resource.context || "value", matches[1]).toString() <= matches[3];
	//           break;
	//         case "!":
	//           this.states[state] = async () => !await this.fetchValue(this.resource.context || "value", matches[3]).toString();
	//           break;
	// 				case "?":
	//           this.states[state] = async () => Boolean(await this.fetchValue(this.resource.context || "value", matches[3]).toString());
	//           break;
	//       }
	//     } else {
	// 			this.states[state] = async () => Boolean(await this.fetchValue(this.resource.context || "value", state).toString());
	// 		}
	// 	}
	// 	return this.states[state]();
  // }

	// check(state) {
	// 	if (!this.states) {
	// 		this.states = {};
	// 	}
	// 	if (!this.states[state]) {
	// 		const context = this.resource.context || "value";
	// 		let matches = state.match(/^(.*?)(=|<|>|!=|<=|>=|!|\?)(.*)$/);
	//     if (matches) {
	//       switch (matches[2]) {
	//         case "=":
	//           this.states[state] = async () => await this.get(context, matches[1]).toString() === matches[3];
	//           break;
	//         case "<":
	//           this.states[state] = async () => await this.get(context, matches[1]).toString() < matches[3];
	//           break;
	//         case ">":
	//           this.states[state] = async () => await this.get(context, matches[1]).toString() > matches[3];
	//           break;
	//         case "!=":
	//           this.states[state] = async () => await this.get(context, matches[1]).toString() != matches[3];
	//           break;
	//         case "<=":
	//           this.states[state] = async () => await this.get(context, matches[1]).toString() <= matches[3];
	//           break;
	//         case "!":
	//           this.states[state] = async () => !await this.get(context, matches[3]).toString();
	//           break;
	// 				case "?":
	//           this.states[state] = async () => Boolean(await this.get(context, matches[3]).toString());
	//           break;
	// 				// case ":in:":
	//         //   this.states[state] = async () => (await this.get(context, matches[3])).includes(matches[0]);
	//         //   break;
	// 				// case ":notin:":
	//         //   this.states[state] = async () => !(await this.get(context, matches[3])).includes(matches[0]);
	//         //   break;
	//       }
	//     } else {
	// 			this.states[state] = async () => Boolean(await this.get(context, state).toString());
	// 		}
	// 	}
	// 	return this.states[state]();
  // }


	build() {
		return {
			tag: "button",
			class: "karma-button karma-field",
			child: {
				tag: "span",
				init: span => {
					if (this.resource.dashicon) {
						span.element.className = "dashicons dashicons-"+this.resource.dashicon;
						span.element.textContent = this.resource.text || "";
					} else {
						span.element.className = "text";
						span.element.textContent = this.resource.text || this.resource.title || "";
					}

				}
			},
			init: async button => {
				this.update = button.render;
				if (this.resource.primary) {
					button.element.classList.add("primary");
				}
				button.element.title = this.resource.title || "";
			},
			update: async button => {

				button.element.onclick = async event => {
					event.preventDefault();
					if (!button.element.classList.contains("editing")) {
						button.element.classList.add("editing");
						await this.edit(this.resource.action);
						// await this.set("edit", this.resource.value);
						button.element.classList.remove("editing");
					}
				}

				// -> group
				// if (this.resource.hidden) {
				// 	button.element.classList.add("hidden");
				// 	this.check(this.resource.hidden).then(hidden => {
				// 		button.element.classList.toggle("hidden", hidden);
				// 	});
				// }

				if (this.resource.disabled) {

					// button.element.classList.add("loading");
					button.element.disabled = true;
					this.check(this.resource.disabled).then(disabled => {
					// this.fetchState(this.resource.disabled).then(disabled => {
						button.element.disabled = disabled;
						// button.element.classList.remove("loading");
					});
				}
				// else if (this.resource.enabled) {
				// 	button.element.disabled = true;
				// 	// this.get("value", this.resource.enabled).then(enabled => {
				// 	this.check(this.resource.enabled).then(enabled => {
				// 		button.element.disabled = !enabled;
				// 	});
				// }

				if (this.resource.active) {
					this.check(this.resource.active).then(active => {
					// this.fetchState(this.resource.active).then(active => {
						button.element.classList.toggle("active", active);
					});
				}

				// if (this.resource.hidden) {
				// 	button.element.classList.add("hidden");
				// 	// button.element.classList.toggle("hidden", await this.fetchState(this.resource.hidden, "hidden"));
				// 	this.fetchState(this.resource.hidden).then(hidden => {
				// 		button.element.classList.toggle("hidden", hidden);
				// 	});
				// }



			}
		};

	}

	getModal() {
		return this.resource.modal && this.createChild(this.resource.modal);
	}


}
