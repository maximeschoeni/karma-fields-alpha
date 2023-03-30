
KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field.container {

	constructor(resource) {
		super(resource);

		// const bufferPath = this.resource.bufferPath || ["data", this.resource.driver || this.resource.key || "nodriver"];

		if (!this.resource.driver) {
			console.error("no driver", this.resource);
		}

    

		this.buffer = new KarmaFieldsAlpha.Buffer("data", this.resource.driver);
    this.delta = new KarmaFieldsAlpha.Buffer("data"); // -> "delta"


		this.initialBuffer = new KarmaFieldsAlpha.Buffer("gateway", this.resource.driver);
    this.data = new KarmaFieldsAlpha.Buffer("gateway"); // -> "vars"

		// this.trashBuffer = new KarmaFieldsAlpha.Buffer("trash", this.resource.driver);
		// this.store = new KarmaFieldsAlpha.Store(this.resource.driver, this.resource.joins);

		// this.cache = new KarmaFieldsAlpha.Buffer("cache", this.resource.driver);

    this.fieldOption = new KarmaFieldsAlpha.Buffer("field-option", this.resource.driver); // -> "data"

    // this.queries = new KarmaFieldsAlpha.Buffer("queries");
    // this.tasks = new KarmaFieldsAlpha.Buffer("tasks");


    // this.queryBuffer = new KarmaFieldsAlpha.Buffer("queries", this.resource.driver); // query cache indexed by ids

    // this.lazyBuffer = new KarmaFieldsAlpha.Buffer("lazy", this.resource.driver); // query cache indexed by ids


	}


	async send(data) {

		if (!data) {
			data = this.buffer.get();
		}

		// this.initialBuffer.merge(data);

    KarmaFieldsAlpha.DeepObject.merge(KarmaFieldsAlpha.Query.vars[this.resource.driver], data); // -> needed for autosave

		for (let id in data) {

			await KarmaFieldsAlpha.Gateway.post(`update/${this.resource.driver}/${id}`, data[id]);

		}

		this.buffer.remove();
  }

	isModified(...path) {

		const delta = this.buffer.get(...path);

		if (delta) {

			if (path.length) {

        const originals = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.Query.vars, this.resource.driver, ...path);

				return KarmaFieldsAlpha.DeepObject.differ(delta, originals);

			} else {

        const originals = KarmaFieldsAlpha.Query.vars[this.resource.driver] || {};

        return KarmaFieldsAlpha.DeepObject.differ(delta, originals);

			}

		}

		return false;
	}

	getValue(...path) {

		return this.delta.get(this.resource.driver, ...path) || KarmaFieldsAlpha.Query.getValue(this.resource.driver, ...path);

	}

	setValue(value, ...path) {

		const newValue = KarmaFieldsAlpha.Type.toArray(value);

		let currentValue = this.getValue(...path);

		if (KarmaFieldsAlpha.DeepObject.differ(newValue, currentValue)) {

			this.buffer.change(newValue, currentValue, ...path);

		}

	}




	request(subject, content = {}, ...path) {

		switch (subject) {

			// case "state": {

			// 	return {
			// 		value: this.buffer.get(...path) || await this.getInitial(...path),
			// 		modified: await this.isModified(...path)
			// 	};

			// }

      case "get": {

        if (content && content.driver && content.id && content.key) {

          return this.delta.get(content.driver, content.id, content.key) || KarmaFieldsAlpha.Query.getValue(content.driver, content.relations || [], content.id, content.key);

        } else {

          return this.getValue(...path);

        }


        // let driver, id, key, relations;

        // if (content.driver) {

        //   [driver, id, key, relations] = [content.driver, content.id, content.key, content.relations];

        // } else {

        //   driver = this.resource.driver;
        //   relations = this.resource.relations;

        //   [id, key] = path;

        // }

        // return this.delta.get(driver, id, key) || KarmaFieldsAlpha.Query.getValue(driver, relations, id, key);
        
      }


      case "query": {
        
        const driver = content.driver || this.resource.driver;
        const params = content.params || this.resource.params;

        return KarmaFieldsAlpha.Query.getResults(driver, params);

      }

			

			case "set": {

				this.setValue(content, ...path);

				break;
			}

      case "autosave": {

				this.setValue(content, ...path);

        const value = KarmaFieldsAlpha.Type.toArray(content);
        const data = KarmaFieldsAlpha.DeepObject.create(value, ...path);

        this.send(data);

				break;
			}

			case "modified": {
				return this.isModified(...path);
			}

			case "submit": {
				this.send();
				this.parent.request("render");
				break;
			}

			case "path": {
				return [this.resource.driver, ...path];
			}

      case "get-option": {
        return this.fieldOption.get("fields", ...path); 
      }

      case "set-option": {
        this.fieldOption.set(content, "fields", ...path);
        break;
      }

			default:
				return super.request(subject, content, ...path); // -> extends group

		}

	}

  count(paramString) {

    console.warn("Deprecated");

    return KarmaFieldsAlpha.Query.getCount(this.resource.driver, paramString);

  }

  query(paramString) {

    console.warn("Deprecated");

    return KarmaFieldsAlpha.Query.getResults(this.resource.driver, paramString);

  }



  
};
