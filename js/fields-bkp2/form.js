
KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field.table {

	// getWild(driver, id, key) {

	// 	return KarmaFieldsAlpha.server.queryValue(driver || this.getDriver(), id, key);

	// }

	// setWild(value, driver, id, key) {

	// 	return KarmaFieldsAlpha.server.setValue(value, driver || this.getDriver(), id, key);

	// }


	getBody() {

		return this.createChild({
			type: "single",
			id: this.getId(),
			...this.resource.body || { children: this.resource.children }
		}, "body");

	}





	getId() {

		if (this.resource.id !== undefined) {

			return this.parseString(this.resource.id);

		} else {

			let id = this.getParam("id");

			if (!id) {

				if (this.resource.params) {

					const params = this.parseObject(this.resource.params);

					if (params !== undefined) {

						id = params.id;

					}

				}

			}

			return id;
		}

	}

	// getContentAt(index, key) {

	// 	const id = this.getId();

	// 	if (id.loading) {

	// 		return new KarmaFieldsAlpha.Loading();

	// 	} else if (key === "id") {

	// 		return id;

	// 	} else {

	// 		return this.getWild(this.getDriver(), id.toString(), key);

	// 	}

	// }

	// async setValueAt(value, index, key) {

	// 	const id = this.getId();

	// 	if (!id.loading) {

	// 		return this.setWild(value, this.getDriver(), id.toString(), key);

	// 	}

	// }

	// *buildContent() {

	// 	const params = this.queryDefaultParams();

	// 	if (!params.loading) {

	// 		yield* super.buildContent();

	// 	}

	// }


	getDriver() {

		if (this.resource.driver) {

			return this.resource.driver;

		} else if (this.resource.body && this.resource.body.driver) { // compat

			return this.resource.body.driver;

		} else {

			return this.parent.getDriver();

		}

	}

}

KarmaFieldsAlpha.field.form.single = class extends KarmaFieldsAlpha.field.container.single {

	// getContent(key) {

	// 	return this.parent.getContentAt(null, key);

	// }

	// setValue(value, key) {

	// 	return this.parent.setValueAt(value, null, key);

	// }

	getValue(key) {

		if (this.resource.id !== undefined) {

			return this.parent.getValue(key, this.resource.id);

		}

	}

	setValue(value, key) {

		if (this.resource.id === undefined) {

			console.error("setting value but id is undefined");

		}

		this.parent.setValue(value, key, this.resource.id);

	}

}



KarmaFieldsAlpha.field.form.header = class extends KarmaFieldsAlpha.field.container.header {

	constructor(resource, id, parent) {

		super({
			display: "flex",
			children: [
				"title",
				"close"
			],
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.form.footer = class extends KarmaFieldsAlpha.field.container.footer {

	constructor(resource, id, parent) {

		super({
			display: "flex",
			children: [
				"save"
			],
			...resource
		}, id, parent);

	}

}
