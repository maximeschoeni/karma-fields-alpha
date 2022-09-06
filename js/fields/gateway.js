
KarmaFieldsAlpha.fields.gateway = class extends KarmaFieldsAlpha.fields.field {

	constructor(...args) {
		super(...args);

		this.buffer = new KarmaFieldsAlpha.Buffer("gateway", this.resource.driver);
		this.store = new KarmaFieldsAlpha.Store(this.resource.driver, this.resource.joins);

	}

	// async dispatch(event) {
	//
	// 	switch (event.action) {
	//
	// 		// case "driver": {
	// 		// 	event.data = this.resource.driver;
	// 		// 	break;
	// 		// }
	// 		//
	// 		// case "join": { // deprecated
	// 		// 	const path = event.absolutePath || event.path;
	// 		// 	const idsPromise = this.getRemoteValue(false, ...path);
	// 		// 	event.data.forEach(driver => this.registerJoin(driver, idsPromise)); // -> event.data is an array of drivers
	// 		//
	// 		// 	// this.registerJoin(event.data, ...(event.absolutePath || event.path)); // -> event.data is an array of drivers
	// 		// 	break;
	// 		// }
	// 		//
	// 		// case "get": {
	// 		// 	console.log("gateway get", event.path);
	// 		// 	// const [id, ...path] = event.absolutePath || event.path;
	// 		// 	//
	// 		// 	// const [driver, ...params] = this.resource.driver.split("?");
	// 		// 	// const paramString = this.driver+"?"+[...params, "id="+id].join("&");
	// 		// 	// const query = KarmaFieldsAlpha.Query.create(paramString, this.resource.joins);
	// 		// 	// event.driver = this.driver;
	// 		// 	// event.data = await query.get(id, ...path);
	// 		//
	// 		//
	// 		// 	const store = new KarmaFieldsAlpha.Store(this.resource.driver, this.resource.joins || []);
	// 		// 	await store.query(this.resource.params || "");
	// 		// 	event.data = await store.getValue(...event.path);
	// 		//
	// 		//
	// 		//
	// 		// 	break;
	// 		// }
	// 		//
	// 		// case "set":
	// 		// 	await this.send(event.getArray(), ...event.path);
	// 		// 	break;
	// 		//
	// 		// case "send":
	// 		// 	await this.send(event.data, ...event.path);
	// 		// 	break;
	// 		//
	// 		//
	// 		//
	// 		// case "query": {
	// 		// 	console.error("deprecated");
	// 		// 	// if (event.absolutePathes) {
	// 		// 	// 	event.data = {};
	// 		// 	// 	for (let path of event.absolutePathes) {
	// 		// 	// 		const value = await this.getRemoteValue(event.allowSingle !== false, ...path);
	// 		// 	// 		KarmaFieldsAlpha.DeepObject.assign(event.data, value, ...path);
	// 		// 	// 	}
	// 		// 	// } else if (event.absolutePath) {
	// 		// 	// 	event.data = await this.getRemoteValue(event.allowSingle !== false, ...event.absolutePath);
	// 		// 	// }
	// 		//
	// 		// 	const [id, ...path] = event.absolutePath;
	// 		// 	const paramString = "id="+id;
	// 		// 	event.driver = this.resource.driver;
	// 		// 	event.data = await KarmaFieldsAlpha.Driver.get(this.resource.driver, paramString, event.joins, id, ...path);
	// 		//
	// 		//
	// 		//
	// 		// 	// if (event.keys) {
	// 		// 	// 	event.value = {};
	// 		// 	// 	for (let key of event.keys) {
	// 		// 	// 		event.value[key] = await this.getRemoteValue(...event.queryPath, key);
	// 		// 	// 	}
	// 		// 	//
	// 		// 	// 	// const values = await Promise.all(event.keys.map(key => {
	// 		// 	// 	// 	return this.getRemoteValue(...event.queryPath, key)
	// 		// 	// 	// }));
	// 		// 	// 	// event.value = values.reduce((object, item, index) => {
	// 		// 	// 	// 	return {...object, [event.keys[index]]: item};
	// 		// 	// 	// }, {});
	// 		// 	// 	// console.log(event.value);
	// 		// 	// } else {
	// 		// 	// 	const value = await this.getRemoteValue(...event.queryPath);
	// 		// 	// 	event.setValue(value);
	// 		// 	// }
	// 		//
	// 		//
	// 		// 	break;
	// 		// }
	// 		//
	// 		// case "getDriver":
  //     //   event.data = this.resource.driver;
  //     //   break;
	//
	// 		// case "join":
	// 		// 	await KarmaFieldsAlpha.Relations.request(event.driver, ...event.path);
	// 		// 	event.setValue();
	//
	// 		// case "compare": {
	// 		// 	const originalValue = this.buffer.get(...event.path);
	// 		// 	event.data = KarmaFieldsAlpha.DeepObject.differ(event.data, originalValue);
	// 		// 	break;
	// 		// }
	//
	// 		case "get": {
  //       event.data = await this.store.getValue(...event.path);
  //       break;
	// 		}
	//
	// 		case "set": {
	// 			// -> autosave
  //       const [id, ...path] = event.path;
  //       const value = KarmaFieldsAlpha.Type.toArray(event.data);
	// 			const data = KarmaFieldsAlpha.DeepObject.create(value, ...path);
	//
	// 			await this.send(data, this.driver, id); // -> data is an array
	//
  //       break;
	//
	// 		}
	//
	// 		case "modified": {
	// 			const originalValue = this.buffer.get(...event.path);
	// 			event.data = KarmaFieldsAlpha.DeepObject.differ(event.data, originalValue);
	// 			break;
	// 		}
	//
	// 		// -> like get_post()
  //     // -> for media breadcrumb (ancestors)
  //     case "queryid": {
  //       event.data = await KarmaFieldsAlpha.Gateway.get("get/"+this.driver+"/"+event.id);
  //       break;
  //     }
	//
	//
	// 		case "edit":
	// 			await this.render();
	// 			break;
	//
	// 		default:
	// 			await super.dispatch(event);
	//
	// 	}
	//
	// 	return event;
	// }

	async request(subject, content, ...path) {

		switch (subject) {

			case "get": {
        return this.store.getValue(...path);
			}

			case "set": {
				// -> autosave
        const [id, ...subpath] = path;
        const value = KarmaFieldsAlpha.Type.toArray(content.data);
				const data = KarmaFieldsAlpha.DeepObject.create(value, ...subpath);

				await this.send(data, this.driver, id); // -> data is an array

        break;
			}

			case "modified": {
				const originalValue = this.buffer.get(...path);
				return KarmaFieldsAlpha.DeepObject.differ(content.data, originalValue);
			}

			// -> like get_post()
      // -> for media breadcrumb (ancestors)
      case "queryid": {
        return KarmaFieldsAlpha.Gateway.get("get/"+this.driver+"/"+content.id);
      }

			case "edit":
				// return this.render();

			default:
				return this.parent.request(subject, content, ...path);

		}

	}

	async send(value, ...path) {

		await KarmaFieldsAlpha.Gateway.post("update/"+path.join("/"), value);

  }


};
