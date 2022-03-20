


KarmaFieldsAlpha.fields.navigation = class extends KarmaFieldsAlpha.fields.group {

	constructor(...args) {
		super(...args);

		// this.prefix = "karma";

		// KarmaFieldsAlpha.forms[this.resource.driver || this.resource.key] = this;


		this.buffer = new KarmaFieldsAlpha.DeepObject();

	}

	fetchValue(expectedType, key) {
	  return [this.getParam(key) || ""];
	}

	// getValue(key) {
	//   if (KarmaFieldsAlpha.Nav.hasParam(key)) {
	//     return [KarmaFieldsAlpha.Nav.getParam(key) || ""];
	//   }
	// }

	setValue(deprec, value, key) {
	  value = value.toString();
	  if (value) {
	    this.setParam(value, key);
	  } else {
	    this.removeParam(key);
	  }
	}

	removeValue(key) {
	  this.removeParam(key);
	}

	edit(value) {
		super.edit(this.resource.value || "navigation");
	}


};
