KarmaFieldsAlpha.field.container = class extends KarmaFieldsAlpha.field {

	async abduct() {

		await KarmaFieldsAlpha.build(this.build(), this.element.parentNode, this.element);

	}

	async render() {

		if (this.id === "popup" && this.element) {

			// console.log(this.element.parentNode, this.element);

			this.element.classList.add("container-loading");

			await KarmaFieldsAlpha.server.init();

			await this.abduct();

			while (KarmaFieldsAlpha.server.hasOrder()) {

				await KarmaFieldsAlpha.server.process();

				await this.abduct();

			}

			this.element.classList.remove("container-loading");

		} else {

			await this.parent.render();

		}

	}

	async close() {

    await this.parent.setFocus();

		await this.parent.render();

  }

	// used by array
  getKeys() {

    const key = this.getKey();
    let keys = [];

    if (key) {

      keys.push(key);

    } else {

			const body = this.getBody();

			if (body) {

        keys.push(...body.getKeys());

			}

    }

    return keys;

  }

	exportDefaults() {

		let defaults = new KarmaFieldsAlpha.Content({});

		const header = this.getHeader();
		const footer = this.getFooter();

		if (header) {

			const response = header.exportDefaults();

      if (response.loading) {

        defaults.loading = true;

      } else {

        defaults.value = {...defaults.toObject(), ...response.toObject()};

      }

		}

		if (footer) {

			const response = footer.exportDefaults(defaults);

      if (response.loading) {

        defaults.loading = true;

      } else {

        defaults.value = {...defaults.toObject(), ...response.toObject()};

      }

		}

    return defaults;

	}

	getHeader() {

		if (this.resource.header) {

			const constructor = this.getConstructor(this.resource.header.type || "header");

			return new constructor(this.resource.header, "header", this);

		}

	}

	getFooter() {

		if (this.resource.footer) {

			const constructor = this.getConstructor(this.resource.footer.type || "footer");

			return new constructor(this.resource.footer, "footer", this);

		}

	}

	getBody() {

		const constructor = this.getConstructor(this.resource.body && this.resource.body.type || "group");

		return new constructor({
			children: this.resource.children,
			...this.resource.body
		}, "body", this);

	}

	async blank() {

		await this.setSelection({index: 0, length: 0});

		const body = this.getBody();

		if (body && body.unselect) {

			await body.unselect();

		}

		await this.setFocus(true);
		await this.render();

	}

	getHeaderTop(element) {

		let scrollContainer = element.closest(".scroll-container");
		let popup = element.closest(".popup");
		let top = 0;

		if (!scrollContainer && !popup) {

			const adminBar = document.getElementById("wpadminbar");

			if (adminBar) {

				top += adminBar.clientHeight;

			}

		}

		return top;
	}

	getModalTop(element) {

		let tableBody = element.closest(".table-body");
		let tableHeader = tableBody.previousElementSibling;

		let top = 0;

		if (tableHeader) {

			top += this.getHeaderTop(tableHeader);

			top += tableHeader.clientHeight;

		} else {

			let scrollContainer = element.parentNode.closest(".scroll-container");

			if (!scrollContainer) {

				const adminBar = document.getElementById("wpadminbar");

				if (adminBar) {

					top += adminBar.clientHeight;

				}

			}

		}

		return top;
	}

	getModalHeight(element) {

		let scrollContainer = element.parentNode.closest(".scroll-container");
		let tableBody = element.closest(".table-body");
		let tableHeader = tableBody.previousElementSibling;
		let tableFooter = tableBody.nextElementSibling;
		let height = 0;

		if (scrollContainer) {

			height = scrollContainer.clientHeight;

		} else {

			height = window.innerHeight;

			const adminBar = document.getElementById("wpadminbar");

			if (adminBar) {

				height -= adminBar.clientHeight;

			}

		}

		if (tableHeader) {

			height -= tableHeader.clientHeight;

		}

		if (tableFooter) {

			height -= tableFooter.clientHeight;

		}

		return height;
	}

	newChild(id) {

    if  (id === "header") {

			return this.getHeader();

    } else if (id === "footer") {

      return this.getFooter();

    } else if (id === "body") {

      return this.getBody();

    }

  }

	*buildHeader() {

		const header = this.getHeader();

		if (header) {

			yield {
        // class: "karma-header table-header table-main-header simple-buttons",
				class: "karma-header table-header table-main-header",
        child: header.build(),
				update: node => {

					// -> sticky
					node.element.style.top = `${this.getHeaderTop(node.element)}px`;
				}
      };

		}

	}

	// *buildHeaderContent() {
	//
	// 	const header = this.getHeader();
	//
	// 	if (header) {
	//
	// 		yield header.build();
	//
	// 	}
	//
	// }

	*buildFooter() {

		const footer = this.getFooter();

		if (footer) {

			yield {
        class: "table-footer table-control",
        child: footer.build(),
        update: node => {
          node.element.classList.toggle("loading", Boolean(this.hasTask()));
        }
      };

		}

	}

	// *buildFooterContent() {
	//
	// 	const footer = this.getFooter();
	//
	// 	if (footer) {
	//
	// 		yield footer.build();
	//
	// 	}
	//
	// }

	*buildBody() {

		const body = this.getBody();

		yield {
      class: "table-body",
      child: body.build()
    };

	}

	// *buildContent() {
	//
	// 	yield {
	// 		// class: "karma-header table-header table-main-header simple-buttons",
	// 		class: "karma-header table-header table-main-header",
	// 		children: [...this.buildHeaderContent()]
	// 	};
	//
	// 	yield {
  //     class: "table-body",
  //     child: this.getBody().build()
  //   };
	//
	// 	yield {
	// 		class: "table-footer table-control",
	// 		children: [...this.buildFooterContent()],
	// 		update: node => {
	// 			node.element.classList.toggle("loading", Boolean(this.hasTask()));
	// 		}
	// 	};
	//
	// }

  build() {

    return {
      class: "table-field",
			// init: node => {
			// 	node.element.classList.add(`container-${this.id}`);
			// },
			update: node => {
				this.element = node.element;
			},
      child: {
				class: "karma-field-table",
				init: node => {
					if (this.resource.class) {
						node.element.classList.add(this.resource.class);
					}
					if (this.resource.classes) {
						node.element.classList.add(...this.resource.classes);
					}
					node.element.style.width = this.resource.width || "100%";
				},
				update: node => {
					const hasFocus = this.hasFocusInside();
					node.element.classList.toggle("has-selection", Boolean(hasFocus));
					node.element.onmousedown = event => {
						event.stopPropagation();
						this.blank();
					}
				},
				children: [
					...this.buildHeader(),
					...this.buildBody(),
					...this.buildFooter()
					// {
					// 	// class: "karma-header table-header table-main-header simple-buttons",
					// 	class: "karma-header table-header table-main-header",
					// 	children: [...this.buildHeaderContent()]
					// },
					// {
			    //   class: "table-body",
			    //   child: this.getBody().build()
			    // },
					// {
					// 	class: "table-footer table-control",
					// 	children: [...this.buildFooterContent()],
					// 	update: node => {
					// 		node.element.classList.toggle("loading", Boolean(this.hasTask()));
					// 	}
					// }
				]
			}
    };

  }

}

KarmaFieldsAlpha.field.container.header = class extends KarmaFieldsAlpha.field.group {

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

KarmaFieldsAlpha.field.container.header.title = class extends KarmaFieldsAlpha.field.text {

  constructor(resource, id, parent) {

    super({
      tag: "h1",
      style: "flex-grow:1",
      class: "ellipsis",
      content: "Title",
      ...resource
    }, id, parent);

  }

  getContent() {

    // const content = this.getResource("title");
		//
    // return this.parse(content || this.resource.content);


		return this.queryLabel();

  }

}

KarmaFieldsAlpha.field.container.close = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      dashicon: "no",
      title: "Close",
      request: ["close"],
      ...resource
    }, id, parent);
  }
}


KarmaFieldsAlpha.field.container.footer = class extends KarmaFieldsAlpha.field.group {

  constructor(resource, id, parent) {

    super({
      display: "flex",
      children: [],
      ...resource
    }, id, parent);

  }

}
