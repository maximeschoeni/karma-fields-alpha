
KarmaFieldsAlpha.Store = class {

	static getObject() {

		if (!KarmaFieldsAlpha.store && KarmaFieldsAlpha.History.useNative) {

			const string = localStorage.getItem(this.storageName);

			if (string) {

				KarmaFieldsAlpha.store = JSON.parse(string);

			} else {

				KarmaFieldsAlpha.store = {};

			}

		}

		return KarmaFieldsAlpha.store;
	}

	static setObject(object) {

		KarmaFieldsAlpha.store = object;

		if (KarmaFieldsAlpha.History.useNative) {

			const string = JSON.stringify(KarmaFieldsAlpha.store);

			localStorage.setItem(this.storageName, string);

		}

	}

	static get(...path) {

		return KarmaFieldsAlpha.DeepObject.get(this.getObject(), ...path);

	}

	static set(value, ...path) {

		const object = this.getObject();

		KarmaFieldsAlpha.DeepObject.set(object, value, ...path);

		this.setObject(object);

	}

	static remove(...path) {

		const object = this.getObject();

		KarmaFieldsAlpha.DeepObject.remove(object, ...path);

		this.setObject(object);
	}

	static assign(value, ...path) {

		const object = this.getObject();

		KarmaFieldsAlpha.DeepObject.assign(object, value, ...path);

		this.setObject(object);

	}

	static merge(value) {

		const object = this.getObject();

		KarmaFieldsAlpha.DeepObject.merge(object, value);

		this.setObject(object);

	}





	static getTable() {

    return this.get("table") || "";

  }

  static setTable(value) {

    // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "table")) {
		//
    //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getTable() || "", "last", "table");
		//
    // }
		//
    // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, table || "", "next", "table");

		const current = this.getTable();

		KarmaFieldsAlpha.Backup.add(value || "", current || "", "table");

    // if (value) {

			this.set(value, "table");

		// } else {
		//
		// 	this.remove("table");
		//
		// }

  }

	static removeTable() {

		const current = this.getTable();

		KarmaFieldsAlpha.Backup.add("", current || "", "table");

    this.remove("table");

  }



	// static changeNav() {
	//
	// 	if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "table")) {
	//
  //     KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getTable() || "", "last", "table");
	//
  //   }
	//
	// 	if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "params", key)) {
	//
  //     KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getParam(key), "last", "params", key);
	//
  //   }
	//
	// 	if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "ids")) {
	//
  //     KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getIds() || [], "last", "ids");
	//
  //   }
	//
	// 	if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "selection", ...path)) {
	//
  //     KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getSelection(...path), "last", "selection", ...path);
	//
  //   }
	//
	// }



	static getParam(key) {

    return this.get("params", key) || "";

  }


	static setParam(value, key) {

    // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "params", key)) {
		//
    //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getParam(key), "last", "params", key);
		//
    // }
		//
    // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, value || "", "next", "params", key);

		const currentValue = this.getParam(key);

		KarmaFieldsAlpha.Backup.add(value || "", currentValue || "", "params", key);


		if (value) {

			this.set(value, "params", key);

		} else {

			this.remove("params", key);

		}
    // this.set(value || "", "params", key);

  }


	static getParams() {

    return this.get("params") || {};

  }


	static setParams(value) {

		const currentValue = this.getParams();

		for (let key in {...value, ...currentValue}) {

			KarmaFieldsAlpha.Backup.add(value[key] || "", currentValue[key] || "", "params", key);

		}

		this.set(value, "params");

  }

	static updateParams(value) {

		KarmaFieldsAlpha.Backup.update(value, "params");

		this.set(value, "params");

  }

	static removeParams() {

		const currentValue = this.getParams();

		for (let key in currentValue) {

			KarmaFieldsAlpha.Backup.add("", currentValue[key], "params", key);

		}

		this.remove("params");

  }



	static getIds() {

    return this.get("ids");

  }

  static setIds(ids) {

    // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "ids")) {
		//
    //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getIds() || [], "last", "ids");
		//
    // }
		//
    // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, ids || [], "next", "ids");

		// const currentIds = this.getIds() || [];
		//
		// KarmaFieldsAlpha.History.set(currentIds, "ids");

		const currentIds = this.getIds();

		KarmaFieldsAlpha.Backup.add(ids || [], currentIds || [], "ids");

		if (ids) {

			this.set(ids, "ids");

		} else {

			this.remove("ids");

		}



  }

  static removeIds() {

		this.setIds();

    // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "ids")) {
		//
    //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getIds() || [], "last", "ids");
		//
    // }
		//
    // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, [], "next", "ids");
		//
    // this.remove("ids");

  }


	static getSelection(...path) {

    return this.get("selection", ...path);

  }

  static setSelection(selection) {

    // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "selection", ...path)) {
		//
    //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getSelection(...path), "last", "selection", ...path);
		//
    // }
		//
    // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, value || {}, "next", "selection", ...path);

		Object.freeze(selection);

		const currentSelection = this.getSelection();

		// KarmaFieldsAlpha.History.set(currentSelection, "selection");

		KarmaFieldsAlpha.Backup.add(selection || {}, currentSelection || {}, "selection");


		if (selection) {

			this.set(selection, "selection");

		} else {

			this.remove("selection");

		}

  }

	static getTransfers() {

    return this.get("transfers") || [];

  }

  static setTransfers(transfers) {

    // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "transfers")) {
		//
    //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getTransfers(), "last", "transfers");
		//
    // }
		//
    // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, transfers || [], "next", "transfers");

		const current = this.getTransfers();

		KarmaFieldsAlpha.Backup.add(transfers || [], current || [], "transfers");

		if (transfers && transfers.length) {

			this.set(transfers, "transfers");

		} else {

			this.remove("transfers");

		}

  }

	static getValue(...path) {

    return this.get("delta", ...path) || KarmaFieldsAlpha.Query.getValue(...path);

  }

	// static rememberValue(...path) {
	//
  //   if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "delta", ...path)) {
	//
  //     KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getValue(...path) || [], "last", "delta", ...path);
	//
  //   }
	//
	// }
	//
	// static changeValue(value, ...path) {
	//
	// 	KarmaFieldsAlpha.History.change(value || [], this.getValue(...path) || [], "delta", ...path);
	//
	// }

  static setValue(value, ...path) {

    // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "delta", ...path)) {
		//
    //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getValue(...path) || [], "last", "delta", ...path);
		//
    // }

		// this.rememberValue(...path);
		//
		// KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, value || [], "next", "delta", ...path);

		const current = this.getValue(...path) || [];

		KarmaFieldsAlpha.Backup.add(value, current, "delta", ...path);

    this.set(value || [], "delta", ...path);

	}




}

KarmaFieldsAlpha.store = {};
KarmaFieldsAlpha.Store.storageName = "UF0";
