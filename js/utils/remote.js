KarmaFieldsAlpha.Remote = class {


	static async query(driver, paramstring) {

    const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);

    const idAlias = KarmaFieldsAlpha.Query.getAlias(driver, "id");

    for (let item of results) {

      const id = item[idAlias].toString();

      if (idAlias !== "id") {

        item.id = id;

      }

      for (let key in item) {

        const value = KarmaFieldsAlpha.Type.toArray(item[key]);

        KarmaFieldsAlpha.Store.set(value, "vars", driver, id, key);

      }

      KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, "query");

      KarmaFieldsAlpha.Store.set(["0"], "vars", driver, id, "trash");

    }

    KarmaFieldsAlpha.Store.set(results, "queries", driver, paramstring);

    return results;
  }

	static async queryIds(driver, ids) {

    if (ids.length) {

      for (let id of ids) {

        KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, "query");
        KarmaFieldsAlpha.Store.set(["1"], "vars", driver, id, "trash");

      }

      const paramstring = `ids=${ids.join(",")}`;

      const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}?${paramstring}`);

      const idAlias = KarmaFieldsAlpha.Query.getAlias(driver, "id") || "id";

      for (let item of results) {

        const id = item[idAlias].toString();

        for (let key in item) {

          const value = new KarmaFieldsAlpha.Content(item[key]).toArray();

          KarmaFieldsAlpha.Store.set(value, "vars", driver, id, key);

        }

        KarmaFieldsAlpha.Store.set(["0"], "vars", driver, id, "trash");

      }

      KarmaFieldsAlpha.Store.set(results, "queries", driver, paramstring);

			// return results;
    }

		// return [];
  }

	static async queryRelations(driver, ids, name) {

    if (ids.length) {

      const relations = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${name}?ids=${ids.join(",")}`);

      for (let relation of relations) {

        const id = relation.id.toString();
        const key = relation.key.toString();

        let value = KarmaFieldsAlpha.Store.get("vars", driver, id, key);

        if (!value) {

          value = [];

          KarmaFieldsAlpha.Store.set(value, "vars", driver, id, key);
        }

        value.push(relation.value);

      }

      for (let id of ids) {

        KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, name);

      }

    }

  }

	static async count(driver, paramstring) {

    let count = await KarmaFieldsAlpha.HTTP.get(`count/${driver}${paramstring ? `?${paramstring}` : ""}`);

    count = parseInt(count);

    KarmaFieldsAlpha.Store.set(count, "counts", driver, paramstring);

  }

	static async sync() {

    const delta = KarmaFieldsAlpha.Store.State.get("delta");

    if (delta) {

			await KarmaFieldsAlpha.Store.Buffer.remove("state", "delta"); // remove database as well but don't add history

      for (let driver in delta) {

        for (let id in delta[driver]) {

					await this.update(delta[driver][id], driver, id);

          // const data = Object.fromEntries(Object.entries(delta[driver][id]).map(([key, value]) => [KarmaFieldsAlpha.Store.getAlias(driver, key), value]));
					//
          // KarmaFieldsAlpha.Store.remove("vars", driver, id);
					//
          // await KarmaFieldsAlpha.Gateway.post(`update/${driver}/${id}`, data);
					//
          // for (let key in data) {
					//
          //   KarmaFieldsAlpha.Store.set(data[key], "vars", driver, id, key);
					//
          // }

        }

        KarmaFieldsAlpha.Store.remove("queries", driver);
        KarmaFieldsAlpha.Store.remove("counts", driver);

      }

    }

  }

	static async update(params, driver, id) {

		const data = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Query.getAlias(driver, key), value]));

		// KarmaFieldsAlpha.Store.remove("vars", driver, id);
		KarmaFieldsAlpha.Store.assign(params, "vars", driver, id);

		await KarmaFieldsAlpha.HTTP.post(`update/${driver}/${id}`, data);

		// for (let key in data) {
		//
		// 	KarmaFieldsAlpha.Store.set(data[key], "vars", driver, id, key);
		//
		// }

  }

	static async add(driver, params, index, length, ...path) {

		for (let i = 0; i < length; i++) {

			let id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`, params).then(id => id.toString());

			if (params) {

				await this.update(params, driver, id);

			}

	    // -> save must happen before new (loading) items are first set

	    const items = KarmaFieldsAlpha.Store.Layer.getItems();

			if (!items[index].loading) {

				console.warning("Replacing wrong item!!!")

			}

			items[index] = {id};

	    await KarmaFieldsAlpha.Store.Layer.setItems(items);





	    // for (let key in params) {
			//
	    //   const value = KarmaFieldsAlpha.Type.toArray(params[key]);
	    //   KarmaFieldsAlpha.Store.updateState(value, "delta", driver, id, key);
			//
	    // }

	    KarmaFieldsAlpha.Store.set(["1"], "vars", driver, id, "trash");
	    await KarmaFieldsAlpha.Store.State.set([], "delta", driver, id, "trash");

		}

  }

	static async upload(file, index, params, layer) {

		const driver = "posts";
    let id;

    if (KarmaFieldsAlpha.useWPMediaUploader) {

      id = await KarmaFieldsAlpha.HTTP.upload(file, params); // -> parent is not going to be saved!

    } else {

      id = await KarmaFieldsAlpha.HTTP.stream(file, params);

    }

		if (params) {

			await this.update(params, driver, id);

		}

    const items = KarmaFieldsAlpha.Store.getState("layers", layer, "items") || [];

		if (!items[index].loading) {

			console.warning("Replacing wrong item!!!")

		}

    items[index] = {
			id: id.toString(),
			type: "file",
		};

    KarmaFieldsAlpha.Store.updateState(newItems, "layers", layer, "items");

    // for (let key in task.params) {
		//
    //   const value = KarmaFieldsAlpha.Type.toArray(task.params[key]);
		//
    //   KarmaFieldsAlpha.Store.setValue(value, task.driver, id, key);
		//
    // }

    // if (!task.params.id) {

		KarmaFieldsAlpha.Store.set([], "vars", driver, id, "trash");
    KarmaFieldsAlpha.Store.updateState([], "delta", driver, id, "trash");

    // }

  }











}
