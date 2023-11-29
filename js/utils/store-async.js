KarmaFieldsAlpha.store = {};

KarmaFieldsAlpha.Store = class {

  static get(...path) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.store, ...path);
  }

  static set(value, ...path) {

    KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.store, value, ...path);

  }

  static remove(...path) {

    KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.store, ...path);

  }

	static assign(value, ...path) {

    KarmaFieldsAlpha.DeepObject.assign(KarmaFieldsAlpha.store, value, ...path);

  }

}

KarmaFieldsAlpha.Store.Buffer = class {

  static async load() {

    const buffer = await KarmaFieldsAlpha.Database.Options.get("buffer") || {};
    buffer.loaded = true;
    await this.set(buffer);

	}

  static isLoaded() {

    return this.get("loaded") || false;

  }

	static get(...path) {

		return KarmaFieldsAlpha.Store.get("buffer", ...path);

	}

	static async set(value, ...path) {

		KarmaFieldsAlpha.Store.set(value, "buffer", ...path);

		await KarmaFieldsAlpha.Database.Options.set(value, "buffer", ...path);

	}

  static async remove(...path) {

		KarmaFieldsAlpha.Store.remove("buffer", ...path);

		await KarmaFieldsAlpha.Database.Options.remove("buffer", ...path);

	}

	static async assign(value, ...path) {

		KarmaFieldsAlpha.Store.assign(value, "buffer", ...path);

		await KarmaFieldsAlpha.Database.Options.assign(value, "buffer", ...path);

	}

	static async merge(value, ...path) {

		const source = this.get(...path);

		KarmaFieldsAlpha.DeepObject.merge(source, value);

		await this.set(source, ...path);

  }

}

KarmaFieldsAlpha.Store.State = class {

  static get(...path) {

    return KarmaFieldsAlpha.Store.Buffer.get("state", ...path);

  }

  static async set(value, ...path) {

    await KarmaFieldsAlpha.History.update(value, ...path);

    await KarmaFieldsAlpha.Store.Buffer.set(value, "state", ...path);

  }

  static async remove(...path) {

    await KarmaFieldsAlpha.History.update(null, ...path);

    await KarmaFieldsAlpha.Store.Buffer.remove("state", ...path);

  }


  static async merge(value, ...path) {

    const source = this.get(...path);

    KarmaFieldsAlpha.DeepObject.merge(source, value);

    await this.set(source, ...path);

  }

  static getOption(...path) {

		this.get("options", ...path);

	}

  static async setOption(data, ...path) {

		await this.set(data, "options", ...path);

	}

}

KarmaFieldsAlpha.Store.Delta = class {

  static get(...path) {

    return KarmaFieldsAlpha.Store.State.get("delta", ...path);

  }

  static async set(value, ...path) {

    await KarmaFieldsAlpha.Store.State.set(value, "delta", ...path);

  }

  static async remove(...path) {

    await KarmaFieldsAlpha.Store.State.set("delta", ...path);

  }

  static hasChange() {

		const delta = this.get();

		if (delta) {

			const vars = KarmaFieldsAlpha.Store.get("vars") || {};

			return !KarmaFieldsAlpha.DeepObject.include(vars, delta);

		}

		return false;
	}

	static modified(...path) {

    const delta = this.get(...path);

    if (delta) {

			const value = KarmaFieldsAlpha.Store.get("vars", ...path);

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

    return KarmaFieldsAlpha.Store.State.set(layer, "layers", index, ...path);

  }

  static remove(index, ...path) {

    return KarmaFieldsAlpha.Store.State.remove("layers", index, ...path);

  }

  static getIndex() {

    return KarmaFieldsAlpha.Store.State.get("layerIndex") || 0;

  }

  static async setIndex(index) {

    await KarmaFieldsAlpha.Store.State.set(index, "layerIndex");

  }

  static getCurrent(...path) {

    const index = this.getIndex();

    return this.get(index, ...path);

  }

  static async setCurrent(value, ...path) {

    const index = this.getIndex();

    await this.set(value, index, ...path);

  }

  static async removeCurrent(...path) {

    const index = this.getIndex();

    await this.remove(index, ...path);

  }

  static getSelection() {

		return this.getCurrent("selection");

	}

	static async setSelection(selection) {

		await this.setCurrent(selection, "selection");

	}

  static async removeSelection() {

		await this.removeCurrent("selection");

	}

	static getTable() {

		return this.getCurrent("table");

	}

	static async setTable(table) {

		await this.setCurrent(table, "table");

	}

	static getParam(key) {

		return this.getCurrent("params", key);

	}

	static async setParam(value, key) {

		await this.setCurrent(value, "params", key);

	}

  static async removeParam(key) {

		await this.removeCurrent("params", key);

	}

  static getParams() {

		return this.getCurrent("params");

	}

	static async setParams(value) {

		await this.setCurrent(value, "params");

	}

	static getItems() {

		return this.getCurrent("items");

	}

	static async setItems(items) {

		await this.setCurrent(items, "items");

	}

  static async removeItems() {

		await this.removeCurrent("items");

	}

}

KarmaFieldsAlpha.Store.Embeds = class {

  get() {

    return KarmaFieldsAlpha.Store.get("embeds") || [];

  }

  add(resource) {

    const embeds = this.get();

    embeds.push(resource);

  }

}

KarmaFieldsAlpha.Store.Focus = class {

  get() {

    return KarmaFieldsAlpha.Store.Layer.get("focus");

  }

  set(focus) {

    KarmaFieldsAlpha.Store.Layer.set(focus, "focus");

  }

  remove() {

    KarmaFieldsAlpha.Store.Layer.remove(focus);

  }

  has(path) {

    const focus = this.get();

    return Boolean(focus && focus.length === path.length && path.every((id, index) => id === focus[index]));

  }

}

KarmaFieldsAlpha.Store.Clipboard = class {

  get() {

    return KarmaFieldsAlpha.Store.State.get("clipboard");

  }

  set(value) {

    KarmaFieldsAlpha.Store.Layer.set(value, "clipboard");

  }

}

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

}
