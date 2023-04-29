KarmaFieldsAlpha.Params = class {

	// static stringify(object) {
	// 	// return Object.entries(object).filter(entries => entries[1]).map(entries => entries[0]+"="+encodeURIComponent(entries[1])).join("&");
	// }

	static parse(string) {
		return Object.fromEntries(string.split("&").map(param => param.split("=").map(string => decodeURIComponent(string))));
	}

  static stringify(object) {

		let entries = Object.entries(object).filter(entries => entries[1]);
    
    entries.sort((a, b) => {
      if (a[0] < b[0]) return -1;
      else if (a[0] > b[0]) return 1;
      else return 0;
    });

    entries = entries.map(entries => entries[0]+"="+encodeURIComponent(entries[1]));
    
    return entries.join("&");
	}




}
KarmaFieldsAlpha.Params.object = {};