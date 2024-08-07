
/*

Store Data structure

- vars
- tasks
- attempts
- fields
- counts
- queries
- history
  - index
  - max
- buffer
  - loaded
  - state
    - delta
    - clipboard
    - fields
    - layerindex
    - layers
      layer 1
        - table
        - params
        - focus
        - items
      layer 2


 */

KarmaFieldsAlpha.store = {};

KarmaFieldsAlpha.Store = class {

  static async get(...path) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.store, ...path);
  }

  static async set(value, ...path) {

    KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.store, value, ...path);

  }

  static async remove(...path) {

    KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.store, ...path);

  }

	static async assign(value, ...path) {

    KarmaFieldsAlpha.DeepObject.assign(KarmaFieldsAlpha.store, value, ...path);

  }

  static clear() {
console.error("deprecated");
    this.remove("attempts");
    this.remove("items");
    this.remove("vars");
    this.remove("verifiedVars");
    this.remove("diff");

  }

}

KarmaFieldsAlpha.Store.Buffer = class {

  static async load(pageId) {

    // const buffer = await KarmaFieldsAlpha.Database.Options.get(pageId) || {};
    // buffer.loaded = true;
    // await this.set(buffer);

	}

  static isLoaded() {

    // return this.get("loaded") || false;

  }

	static async get(...path) {

		return KarmaFieldsAlpha.Store.get("buffer", ...path);

	}

  static add(recordId) {

    const buffer = {
      recordId: recordId,
      index: 0,
      max: 0
    };

    KarmaFieldsAlpha.Store.set(buffer, "buffer");
    KarmaFieldsAlpha.Database.Records.add(buffer);

  }

	static async set(value, ...path) {

		await KarmaFieldsAlpha.Store.set(value, "buffer", ...path);

		// KarmaFieldsAlpha.Database.Options.set(value, "buffer", ...path);

    const recordId = await this.get("recordId");
    await KarmaFieldsAlpha.Database.Records.set(value, recordId, ...path);

	}

  static async remove(...path) {

		await KarmaFieldsAlpha.Store.remove("buffer", ...path);

		// KarmaFieldsAlpha.Database.Options.remove("buffer", ...path);

    const recordId = await this.get( "recordId");
    await KarmaFieldsAlpha.Database.Records.remove(recordId, ...path);

	}

	static async assign(value, ...path) {

		await KarmaFieldsAlpha.Store.assign(value, "buffer", ...path);

		// KarmaFieldsAlpha.Database.Options.assign(value, "buffer", ...path);

    const recordId = await this.get("recordId");
    await KarmaFieldsAlpha.Database.Records.assign(value, recordId, ...path);

	}

	static async merge(value, ...path) {

		const source = await this.get(...path);

		KarmaFieldsAlpha.DeepObject.merge(source, value);

		await this.set(source, ...path);

  }

}

KarmaFieldsAlpha.Store.State = class {

  static async get(...path) {

    return KarmaFieldsAlpha.Store.Buffer.get("state", ...path);

  }

  static async set(value, ...path) {

    // KarmaFieldsAlpha.History.update(value, ...path);

    const currentValue = await this.get(...path);

    await KarmaFieldsAlpha.History.delta(value, currentValue, ...path);

    await KarmaFieldsAlpha.Store.Buffer.set(value, "state", ...path);

  }

  static async remove(...path) {

    // KarmaFieldsAlpha.History.update(null, ...path);

    const currentValue = await this.get(...path);

    await KarmaFieldsAlpha.History.delta(null, currentValue, ...path);

    await KarmaFieldsAlpha.Store.Buffer.remove("state", ...path);

  }


  // static async merge(value, ...path) {
  //
  //   const source = this.get(...path);
  //
  //   KarmaFieldsAlpha.DeepObject.merge(source, value);
  //
  //   await this.set(source, ...path);
  //
  // }

  static async getOption(...path) {

		return this.get("options", ...path);

	}

  static async setOption(data, ...path) {

		return this.set(data, "options", ...path);

	}

}

KarmaFieldsAlpha.Store.Delta = class {

  static async get(...path) {

    return KarmaFieldsAlpha.Store.State.get("delta", ...path);

  }

  static async set(value, ...path) {

    const currentValue = await this.get(...path) || await KarmaFieldsAlpha.Store.get(...path);

    await KarmaFieldsAlpha.History.delta(value, currentValue, "delta", ...path);

    await KarmaFieldsAlpha.Store.Buffer.set(value, "state", "delta", ...path);

  }

  static async remove(...path) {

    const currentValue = await this.get(...path) || await KarmaFieldsAlpha.Store.get(...path);

    await KarmaFieldsAlpha.History.delta([], currentValue, "delta", ...path);

    await KarmaFieldsAlpha.Store.Buffer.set([], "state", "delta", ...path);

  }

  static async hasChange() {

		const delta = await this.get("vars");

		if (delta) {

			const vars = await KarmaFieldsAlpha.Store.get("vars") || {};

			return !KarmaFieldsAlpha.DeepObject.include(vars, delta);

		}

		return false;
	}

	static async modified(...path) {

    const delta = await this.get("vars", ...path);

    if (delta) {

			const value = await KarmaFieldsAlpha.Store.get("vars", ...path);

			return KarmaFieldsAlpha.DeepObject.differ(value, delta);

    }

    return false;
  }

}

KarmaFieldsAlpha.Store.Layer = class {

  static get(index, ...path) {

    return KarmaFieldsAlpha.Store.State.get("layers", index, ...path);

  }

  static set(layer, index, ...path) {

    KarmaFieldsAlpha.Store.State.set(layer, "layers", index, ...path);

  }

  static remove(index, ...path) {

    KarmaFieldsAlpha.Store.State.remove("layers", index, ...path);

  }

  static getIndex() {

    return KarmaFieldsAlpha.Store.State.get("layerIndex") || 0;

  }

  static setIndex(index) {

    KarmaFieldsAlpha.Store.State.set(index, "layerIndex");

  }

  static getCurrent(...path) {

    const index = this.getIndex();

    return this.get(index, ...path);

  }

  static setCurrent(value, ...path) {

    const index = this.getIndex();

    this.set(value, index, ...path);

  }

  static removeCurrent(...path) {

    const index = this.getIndex();

    this.remove(index, ...path);

  }

  static getSelection() {

		return this.getCurrent("selection");

	}

	static setSelection(selection) {

		this.setCurrent(selection, "selection");

	}

  static removeSelection() {

		this.removeCurrent("selection");

	}

	static getTable() {

		return this.getCurrent("table");

	}

	static setTable(table) {

		this.setCurrent(table, "table");

	}

	static getParam(key) {

		return this.getCurrent("params", key);

	}

	static setParam(value, key) {

		this.setCurrent(value, "params", key);

	}

  static removeParam(key) {

		this.removeCurrent("params", key);

	}

  static getParams() {

		return this.getCurrent("params");

	}

	static setParams(value) {

		this.setCurrent(value, "params");

	}

	static getItems() {

		return this.getCurrent("items");

	}

	static setItems(items) {

		this.setCurrent(items, "items");

	}

  static removeItems() {

		this.removeCurrent("items");

	}

  // static insertItem(item, index, ...path) {
  //
  //   const items = this.getItems() || [];
  //   const newItems = [...items];
  //
  //   for (let i = 0; i < length; i++) {
  //
  //     KarmaFieldsAlpha.DeepArray.splice(newItems, 0, [item], index, ...path);
  //
  //   }
  //
  //   this.setItems(newItems);
  //
  // }

  static close() {

    let index = this.getIndex();

    if (index) {

      KarmaFieldsAlpha.Store.State.remove("layers", index);
      this.setIndex(index-1);

    }

  }

}

KarmaFieldsAlpha.Store.Embeds = class {

  static get() {

    return KarmaFieldsAlpha.Store.get("embeds") || [];

  }

  static add(resource) {

    const embeds = this.get();

    embeds.push(resource);

  }

}

// KarmaFieldsAlpha.Store.Focus = class {
//
//   get() {
//
//     return KarmaFieldsAlpha.Store.Layer.get("focus");
//
//   }
//
//   set(focus) {
//
//     KarmaFieldsAlpha.Store.Layer.set(focus, "focus");
//
//   }
//
//   remove() {
//
//     KarmaFieldsAlpha.Store.Layer.remove(focus);
//
//   }
//
//   has(path) {
//
//     const focus = this.get();
//
//     return Boolean(focus && focus.length === path.length && path.every((id, index) => id === focus[index]));
//
//   }
//
// }

// KarmaFieldsAlpha.Store.Clipboard = class {
//
//   get() {
//
//     return KarmaFieldsAlpha.Store.State.get("clipboard");
//
//   }
//
//   set(value) {
//
//     KarmaFieldsAlpha.Store.Layer.set(value, "clipboard");
//
//   }
//
// }

KarmaFieldsAlpha.Store.Tasks = class {

  static get() {

    return KarmaFieldsAlpha.Store.get("tasks");

  }

  static set(tasks) {

    KarmaFieldsAlpha.Store.set(tasks, "tasks");

  }

  static add(task) {

    const tasks = this.get() || [];

    this.set([...tasks, task]);

  }

  static find(callback) {

    const tasks = this.get();

    if (tasks) {

      return tasks.find(callback);

    }

  }

  static has() {

    const tasks = this.get();

    return tasks && tasks.length > 0 || false;

  }

}

// KarmaFieldsAlpha.Store.Verifications = class {
//
//   static get() {
//
//     return KarmaFieldsAlpha.Store.get("verifications");
//
//   }
//
//   static set(verifications) {
//
//     KarmaFieldsAlpha.Store.set(verifications, "verifications");
//
//   }
//
//   static add(verification) {
//
//     const verifications = this.get() || [];
//
//     this.set([...verifications, verification]);
//
//   }
//
//   static find(callback) {
//
//     const verifications = this.get();
//
//     if (verifications) {
//
//       return verifications.find(callback);
//
//     }
//
//   }
//
// }
