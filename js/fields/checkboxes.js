
KarmaFieldsAlpha.field.checkboxes = class extends KarmaFieldsAlpha.field {

	getDefault() {

		if (this.resource.default) {

			const key = this.getKey();
			const defaultValue = this.parse(this.resource.default);
			const values = KarmaFieldsAlpha.Type.toArray(defaultValue);

			return {
				[key]: values
			}

		}

		return [];
	}

	// async dispatch(event) {
	//
	// 	switch (event.action) {
	//
	// 		case "get": {
	//
	// 			const [key] = event.path;
	//
	// 			const set = await super.dispatch({
	// 				action: "get",
	// 				type: "array"
	// 			}).then(request => new Set(KarmaFieldsAlpha.Type.toArray(request.data)));
	//
	// 			event.data = set.has(key);
	// 			break;
	// 		}
	//
	// 		case "set": {
	// 			// const key = event.path[0];
	// 			// if (event.getValue()) {
	// 			// 	await this.add(key);
	// 			// } else {
	// 			// 	await this.remove(key);
	// 			// }
	// 			// break;
	// 			// const key = event.path[0];
	// 			// const array = await this.getArray();
	// 			// if (event.getValue()) {
	// 			// 	array.push(key);
	// 			// } else {
	// 			// 	const index = array.indexOf(key);
	// 			// 	if (index > -1) {
	// 			// 		array.splice(index, 1);
	// 			// 	}
	// 			// }
	// 			// const options = await this.fetchOptions(this.resource.driver);
	// 			// await this.setArray(options.map(option => option.key).filter(key => array.indexOf(key) > -1));
	// 			// break;
	//
	// 			const [key] = event.path;
	// 			// const options = await this.parse(this.resource.options);
	// 			const set = await super.dispatch({
	// 				action: "get",
	// 				type: "array"
	// 			}).then(request => new Set(KarmaFieldsAlpha.Type.toArray(request.data)));
	//
	// 			if (event.data && !set.has(key)) {
	// 				set.add(key);
	// 			} else if (!event.data && set.has(key)) {
	// 				set.delete(key);
	// 			}
	//
	// 			await super.dispatch({
	// 				action: "set",
	// 				data: [...set]
	// 			})
	//
	// 		}
	//
	// 	}
	//
	// 	return event;
	// }

  getOptions(driver, params) {

    if (!KarmaFieldsAlpha.drivers[driver]) {

      console.error("Driver not found", driver);

    }


    const results = KarmaFieldsAlpha.Query.getResults(driver, params) || [{id: "", name: "..."}];

    const options = [];
    const alias = KarmaFieldsAlpha.drivers[driver].alias;
    const idAlias = alias.id || "id";
    const nameAlias = alias.name || "name";

    for (let item of results) {

      options.push({
        id: item[idAlias],
        name: item[nameAlias] || KarmaFieldsAlpha.Type.toString(KarmaFieldsAlpha.Query.getValue(driver, item[idAlias], nameAlias) || ["..."])
      });

    }
  
    return options;

  }

	request(subject, content = {}, ...path) {

    const key = this.getKey();

    if (key) {

      switch (subject) {

        case "get": {
          
          const [childKey] = path;
  
          const values = this.parent.request("get", {}, key);
  
          if (values) {
  
            return KarmaFieldsAlpha.Type.toArray(values.includes(childKey) ? "1" : "");
  
          }
          
        }
  
        case "set": {
  
          const [childKey] = path;
          const values = this.parent.request("get", {}, key);
          // const array = KarmaFieldsAlpha.Type.toArray(response);
  
          if (values) {
            const set = new Set([...values]);
  
            if (content && !set.has(childKey)) {
  
              set.add(childKey);
  
            } else if (!content && set.has(childKey)) {
  
              set.delete(childKey);
  
            }
  
            this.parent.request("set", [...set], key);
          }
  
          break;
        }
  
        default: {

          this.parent.request(subject, content, key);
          break;
        }
  
      }

    } else {

      return super.request(subject, content, ...path);

    }

		

	}


	export() {

		const key = this.getKey();
		const defaults = {};
    const values = this.parent.request("get", {}, key);

		if (values) {

			defaults[key] = KarmaFieldsAlpha.Type.toArray(response);

		}

		return defaults;
	}

	import(object) {

		const key = this.getKey();
    const array = KarmaFieldsAlpha.Type.toArray(object[key]);

		this.parent.request("set", array, key);
	}

	build() {
		return {
			class: "karma-field checkboxes",
			update: async dropdown => {
				dropdown.element.classList.add("loading");

        let options = [];

        if (this.resource.options) {

          options = KarmaFieldsAlpha.Type.toArray(this.parse(this.resource.options))

        }

        if (this.resource.driver) {

          options = [...options, ...this.getOptions(this.resource.driver, this.resource.params || {})];

        }
        
				dropdown.child = {
					tag: "ul",
					update: ul => {
						ul.children = options.map((option, index) => {

							const checkboxField = this.createChild({
								type: "checkbox",
								key: option.id,
								text: option.name,
								tag: "li",
								false: "",
								true: "1",
								id: option.id
							});
							return checkboxField.build();
						});
					}
				};
				dropdown.element.classList.remove("loading");
			}
		};
	}
}
