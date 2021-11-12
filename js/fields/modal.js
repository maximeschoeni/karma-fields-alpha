KarmaFieldsAlpha.fields.modal = class extends KarmaFieldsAlpha.fields.container {

	// initField() {
	// 	super.initField();
  //   this.content = this.createChild(this.resource.content);
	//
  // }

	createTitle() {
		if (!this.title) {
			this.title = this.createChild({
				type: "text",
				// tag: "h1",
				value: this.resource.text || "Edit"
			});
		}
		return this.title;
	}

	initField() {
		super.initField();
    this.content = this.createChild(this.resource.content);

		// this.link = this.createChild({type: "link", ...this.resource});
  }

	build() {
		// return this.link.build();

		return {
			tag: "a",
			child: this.createTitle().build(),
			update: a => {
				// a.element.innerHTML = this.resource.text || "Edit";
				a.element.onclick = event => {
					KarmaFieldsAlpha.History.setParam("id", this.parent.getValue("id"));
					this.editParam(true);
				};
			}
		};
	}

	buildTitle() {
		return this.createTitle().build();
	}

}
