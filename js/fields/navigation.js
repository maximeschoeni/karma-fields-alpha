
KarmaFieldsAlpha.fields.navigation = class extends KarmaFieldsAlpha.fields.field {

  // constructor(resource, parent, form) {
  //   super(resource, parent, form);
  //
  //   this.suffix = "karma";
  // }

  build() {
    return {
      class: "karma-fields-navigation",
      init: container => {

        this.render = container.render;

        // this.delta = new KarmaFieldsAlpha.Delta();

        // window.onhashchange = () => {
        // window.onpopstate = () => {
        window.addEventListener("popstate", event => {
          this.update();
          container.render();
        });

        // this.init();
      },
      update: container => {
        let key = KarmaFieldsAlpha.History.getParam("karma");

        let child = key && this.getChild(key);

        container.children = child && [child.build()] || [];

        document.body.style.overflow = child ? "hidden" : "visible";


        container.element.classList.toggle("single-open", KarmaFieldsAlpha.History.hasParam("id"));

        // this.children.map(child => {
				// 	return child.build();
				// });
      }
    };
  }

  // decodeParams(paramString) {
  //
  //   // return new URLSearchParams(paramsString);
  //
  //
  //   return paramString.split("&").reduce((object, item) => {
  //     const parts = item.split("=");
  //     if (parts.length === 2) {
  //       let key = decodeURIComponent(parts[0]);
  //       let value = decodeURIComponent(parts[1]);
  //       object[key] = value;
  //     }
  //     return object;
  //   }, {});
  // }
  //
  // encodeParams(object) {
  //
  //   let entries = [];
  //   for (let key in object) {
  //     if (object[key]) {
  //       entries.push(encodeURIComponent(key)+"="+encodeURIComponent(object[key]));
  //     }
  //   }
  //   return entries.join("&");
  //
  //   // let searchObj = new URLSearchParams(object);
  //   //
  //   // return searchObj.toString();
  // }




  // getParam(key) {
  //   return this.getParams()[key];
  // }
  //
  // getParams() {
  //   const hash = location.hash.slice(1);
  //   return this.decodeParams(hash);
  // }
  //
  // setParam(key, value, replace) {
  //   const params = this.getParams();
  //   if (params[key] !== (value || undefined)) {
  //     params[key] = value;
  //     this.setParams(params, replace);
  //   }
  // }
  //
  // setParams(params, replace) {
  //   let hash = this.encodeParams({
  //     ...this.getParams(),
  //     ...params
  //   });
  //   if (replace) {
  //     history.replaceState(null, null, "#"+hash);
  //   } else {
  //     history.pushState(null, null, "#"+hash);
  //   }
  //   this.render();
  // }

  getDelta() {
    if (!this.delta) {
      this.delta = new KarmaFieldsAlpha.Delta();
    }
    return this.delta;
  }

  editParam(clean) {
    return this.render && this.render(clean);
  }

  update() {
		if (history.state) {
			for (let path in history.state) {
				this.delta.setValue(history.state[path], path);
			}
		}
	}

	/**
	 * At start set an history step if there is unsaved changes
	 */
	// init() {
  //
	// 	if (this.delta.has()) {
	// 		const flatObject = this.delta.getObject();
	// 		for (let path in flatObject) {
	// 			KarmaFieldsAlpha.History.writeHistory(path, null);
	// 		}
	// 		KarmaFieldsAlpha.History.backup();
  //
	// 		for (let path in flatObject) {
	// 			KarmaFieldsAlpha.History.writeHistory(path, flatObject[path]);
	// 		}
	// 	}
  //
	// }




  // backup() {
  //   const paramString = location.hash.slice(1);
  //   const state = history.state || {};
  //   history.pushState({}, null, "#"+paramString);
  // }
  //
  // editParam(clean) {
  //   return this.render(clean);
  // }
  //
  // getSuffix(path = "") {
  //   return "karma/" + path;
  // }
  //
  //
  //
  // getOriginalValue(path) {
	// 	return this.original[path];
  // }
  //
	// removeOriginalValue(path) {
  //   delete this.original[path];
  // }
  //
  // setOriginalValue(value, path) {
	// 	this.original[path] = value;
  // }
  //
	// getDeltaValue(path) {
  //   path = this.getSuffix(path);
	// 	let value = localStorage.getItem(path) ?? undefined;
	// 	return value;
  // }
  //
	// setDeltaValue(value, path) { // overrided with async by arrays
  //   path = this.getSuffix(path);
	// 	if (this.original[path] !== value && value !== undefined && value !== null) {
	// 		localStorage.setItem(path, value);
	// 	} else {
	// 		localStorage.removeItem(path);
	// 	}
  // }
  //
	// removeDeltaValue(path) {
  //   path = this.getSuffix(path);
	// 	localStorage.removeItem(path);
  // }
  //
  // getDelta() {
	// 	const flatObject = {};
	// 	const dir = this.getSuffix();
	// 	for (let i = 0; i < localStorage.length; i++) {
	// 		let path = localStorage.key(i);
	// 		if (path.startsWith(dir)) {
	// 			flatObject[path.slice(dir.length)] = localStorage.getItem(path);
	// 		}
  // 	}
	// 	return flatObject;
  // }
  //
  // hasDelta() {
	// 	const dir = this.getSuffix();
	// 	for (let i = 0; i < localStorage.length; i++) {
	// 		let path = localStorage.key(i);
	// 		if (path.startsWith(dir)) {
	// 			return true;
	// 		}
  // 	}
	// 	return false;
  // }
  //
  // emptyDelta() {
	// 	const dir = this.getSuffix();
	// 	for (let i = 0; i < localStorage.length; i++) {
	// 		let path = localStorage.key(i);
	// 		if (path.startsWith(dir)) {
	// 			localStorage.removeItem(path);
	// 		}
  // 	}
  // }
  //
  // updateHistory() {
	// 	if (history.state) {
	// 		for (let path in history.state) {
	// 			this.setDeltaValue(history.state[path], path);
	// 		}
	// 	}
	// }
  //
  // writeHistory(path, rawValue) { // rawValue may be null
	// 	const state = history.state || {};
	// 	state[path] = rawValue;
	// 	history.replaceState(state, null);
	// }
  //
  // /**
	//  * At start set an history step if there is unsaved changes
	//  */
	// initHistory() {
  //
  //   if (this.hasDelta()) {
  //     const flatObject = this.getDelta();
  //     for (let path in flatObject) {
  //       this.writeHistory(path, null);
  //     }
  //     this.backup();
  //
  //     for (let path in flatObject) {
  //       this.writeHistory(path, flatObject[path]);
  //     }
  //   }
  //
  //
  //
	// 	// if (Object.values(flatObject).length) {
	// 	// 	this.backup("init");
	// 	// 	for (let path in flatObject) {
	// 	// 		// const relativePath = path.slice(this.resource.driver.length+1);
	// 	// 		// const value = ;
	// 	// 		this.writeHistory(path, flatObject[path]);
	// 	// 	}
	// 	// }
	// }



  // isParamsModified(paramString) {
  //   return this.getParamString() === paramString;
  // }
  //
  //
  // getParamsObject() {
  //   return new URLSearchParams(location.hash.slice(1));
  // }
  //
  // setParamsObject(searchParams, replace) {
  //   if (replace) {
  //     history.replaceState(null, null, "#"+searchParams.toString());
  //   } else {
  //     history.pushState(null, null, "#"+searchParams.toString());
  //   }
  // }
  //
  // getParamString() {
  //   return location.hash.slice(1);
  // }
  //
  // setParamString(paramString, replace) {
  //   if (replace) {
  //     history.replaceState(null, null, "#"+paramString);
  //   } else {
  //     history.pushState(null, null, "#"+paramString);
  //   }
  // }





}
