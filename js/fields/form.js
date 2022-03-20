
KarmaFieldsAlpha.fields.form = class extends KarmaFieldsAlpha.fields.field {

	constructor(...args) {
		super(...args);

		// this.prefix = "karma";

		this.buffer = new KarmaFieldsAlpha.Buffer("form", this.resource.id || this.getId());
		// this.buffer = new KarmaFieldsAlpha.Buffer(...(this.resource.bufferPath || [this.resource.id || this.getId()]));


	}

	getRelativeParent() {
    return this;
  }


	// used for checkboxes
	getForm() {
    return this;
  }

	// used for checkboxes
	getPath() {
		return [];
	}

	async isModified(...path) {

		if (path.length) {

			const value = this.buffer.get(...path);

			if (value !== undefined) {

				return KarmaFieldsAlpha.DeepObject.differ(value, await super.get(...path));

			}

		} else {

			const delta = this.buffer.get();

			for (let key in delta) {

				if (KarmaFieldsAlpha.DeepObject.differ(delta[key], await super.get(key))) {

					return true;

				}

			}

		}

		return false;
	}

	async getState(...path) {

		const action = path.pop();

		switch (action) {

			case "modified":
				return this.isModified(...path);

			default:
				return this.buffer.get(...path, 0);

		}


	}


	async get(...path) {

		let value = this.buffer.get(...path);

		// console.log("get", value, ...path, JSON.stringify(this.buffer.get()));


		if (value === undefined) {

			value = await super.get(...path);

		}

		return value;

	}

	async setState(value, ...path) {

		const action = path.pop();

		switch (action) {

			case "submit":
				if (value === null) {
					value = this.buffer.get();
					this.buffer.empty();
				} else {
					value = KarmaFieldsAlpha.DeepObject.create(value, ...path);
				}
				await super.set(value);
				break;

			case "edit":
				this.update();
				break;

			case "save":
			case "send":
			case "write":
			case "nextup":
				// -> deprecated
				// console.log("Form set", context);
				break;

			default:
				await super.setState(value, action);
				break;

		}


	}



	async set(value, ...path) {

		this.buffer.set(value, ...path);

		// console.log("set", value, path, JSON.stringify(this.buffer.get()));

		// this.update(); // -> render buttons

	}

	async remove(...path) {

		this.buffer.remove(...path);

		// console.log("set", value, path, JSON.stringify(this.buffer.get()));

		// this.update(); // -> render buttons

	}

	getContent() {
		return this.createChild({
			display: this.resource.display,
			children: this.resource.children,
			id: "content",
			type: "group"
		});
	}


	build() {
		return this.getContent().build();
	}

	render() {
		this.getContent().render();
	}


};
