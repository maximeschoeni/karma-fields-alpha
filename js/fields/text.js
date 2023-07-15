KarmaFieldsAlpha.field.text = class extends KarmaFieldsAlpha.field {

	// async getContent() {
	// 	if (this.resource.value) {
	// 		return this.parse(this.resource.value);
	// 	}
	// 	if (this.resource.key) {
	// 		return this.request("get", {}, this.resource.key).then(response => KarmaFieldsAlpha.Type.toString(response));
	// 	}
	// 	return "";
	// }

	// exportValue() {
	// 	return this.parse(this.resource.export || this.resource.value);
	// }

	export(items = []) {

		if (this.resource.export) {

			const value = new KarmaFieldsAlpha.Expression(this.resource.export, this).toString();

			items.push(value);

		}

	}

	getContent() {

		if (this.resource.value) {

			return this.parse(this.resource.value);

		}

	}


	build() {
		return {
			tag: this.resource.tag,
			class: "text karma-field",
			init: node => {
				if (this.resource.classes) {
					node.element.classList.add(...this.resource.classes);
				}
				// node.element.tabIndex = -1;
			},
			update: node => {
				// node.element.classList.add("loading");

				// node.element.innerHTML = await this.getContent();

				const content = this.getContent();

        if (content) {

					node.element.classList.toggle("loading", content === KarmaFieldsAlpha.loading);

          // const content = this.parse(this.resource.value);
					//
          // node.element.classList.toggle("loading", content === KarmaFieldsAlpha.loading);
					//
          // node.element.innerHTML = KarmaFieldsAlpha.Type.toString(content);

					if (content === KarmaFieldsAlpha.loading) {

						node.element.innerHTML = '...';

					} else {

						node.element.innerHTML = content;

					}

        } else if (this.resource.links) {

					// node.element.innerHTML = this.resource.links.map(link => {
					// 	return `<a href="${link.content}">${link.content}</a>`;
					//
					// }).join(this.resource.glue || "<br>");

					const links = KarmaFieldsAlpha.Type.toArray(this.resource.links);

					node.children = links.map((link, index) => {

						return this.createChild({
							type: "a",
							...link,
							index: index
						});

						// return {
						// 	tag: "a",
						// 	update: a => {
						// 		a.element.onmousedown = event => {
						// 			event.stopPropagation();
						// 		};
						// 		a.element.onclick = event => {
						// 			event.preventDefault();
						// 			const table = this.parse(link.table);
						// 			const params = this.parse(link.params);
						// 			if (table !== KarmaFieldsAlpha.loading && params !== KarmaFieldsAlpha.loading) {
						// 				KarmaFieldsAlpha.saucer.open(table, params);
						// 			}
						// 		}
						// 		const content = this.parse(link.content);
						// 		a.element.innerHTML = KarmaFieldsAlpha.Type.toString(content) || "...";
						// 	}
						// };
					});


				}

				// if (this.resource.highlight) {
				// 	const highlight = await this.parse(this.resource.highlight);
				// 	node.element.classList.toggle("highlight", Boolean(highlight));
				// }

				if (this.resource.disabled) {
					node.element.classList.toggle("disabled", KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.disabled)));
				}
        if (this.resource.enabled) {
					node.element.classList.toggle("disabled", !KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.enabled)));
				}

				// node.element.classList.remove("loading");

			}
		};
	}


}


KarmaFieldsAlpha.field.text.a = class extends KarmaFieldsAlpha.field {

	constructor(resource) {

		super(resource);

		this.tag = "a";

	}

	update(node) {

		node.element.onmousedown = event => {

			event.stopPropagation();

		};

		if (this.resource.href) {

			const href = this.parse(this.resource.href);

			if (href !== KarmaFieldsAlpha.loading) {

				node.element.href = href;

			}

		} else if (this.resource.table || this.resource.params) {

			node.element.onclick = event => {

				event.preventDefault();

				const table = this.parse(this.resource.table);
				const params = this.parse(this.resource.params);

				if (table !== KarmaFieldsAlpha.loading && params !== KarmaFieldsAlpha.loading) {

					KarmaFieldsAlpha.saucer.open(table, params);

				}

			}

		}

		const content = this.parse(this.resource.content);

		node.element.innerHTML = KarmaFieldsAlpha.Type.toString(content) || "...";

		if (this.resource.target) {

			node.element.target = this.resource.target;

		}

	}


}
