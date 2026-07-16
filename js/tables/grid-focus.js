

KarmaFieldsAlpha.field.focus = class extends KarmaFieldsAlpha.field {

	doAction(action, ...args) {

		switch (action) {

			case "getFocus":
				return this.getFocus();

			case "setFocus":
				this.setFocus();
				break;



			default:
				return super.doAction(action, ...args)

		}

	}





	copy() {

		return this.export();

	}

	// -> grid focus
	paste(string) {

		this.import(string, 0, Infinity);

	}


}
