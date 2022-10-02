KarmaFieldsAlpha.Params = class {

	static stringify(object) {
		return Object.entries(object).map(entries => entries[0]+"="+encodeURIComponent(entries[1])).join("&");
	}

	static parse(string) {
		return Object.fromEntries(string.split("&").map(param => param.split("=").map(string => decodeURIComponent(string))));
	}

}
