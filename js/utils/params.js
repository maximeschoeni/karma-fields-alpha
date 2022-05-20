KarmaFieldsAlpha.ParamString = class {

	static toString(object) {
		return object && Object.entries(object).map(entries => entries[0]+"="+entries[1]).join("&") || "";
	}

	static toObject(string) {
		return string && Object.fromEntries(string.split("&").map(param => param.split("="))) || {};
	}

	static merge(...strings) {
		return Object.assign(...strings.map(string => this.toObject(string)));
	}

}
