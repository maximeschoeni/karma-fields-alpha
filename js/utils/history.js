

KarmaFieldsAlpha.log = () => {
  console.log({
    history: {
      state: history.state,
      buffer: KarmaFieldsAlpha.History.buffer
    },
    selection: KarmaFieldsAlpha.Selection.object,
    delta: KarmaFieldsAlpha.Delta.object,
    data: {
      vars: KarmaFieldsAlpha.Query.vars,
      queries: KarmaFieldsAlpha.Query.queries
    },
    params: KarmaFieldsAlpha.Params.object
  });
}

KarmaFieldsAlpha.History = class {

	// static buffer = new KarmaFieldsAlpha.Buffer();
  // static selectionBuffer = new KarmaFieldsAlpha.Buffer("selection");
  // static delta = {};


  static getState() {

    // let state = history.state;

    // if (!state) {

    //   state = {};

    //   history.replaceState(state, "");

    // }

    // return state;

    return history.state || {};

  }

  static setState(state) {

    history.replaceState(state, "");

  }

  static addState(state) {

    history.pushState(state, "");

  }

	static get(...path) {

		return KarmaFieldsAlpha.DeepObject.get(this.getState(), ...path);

	}

	static set(value, ...path) {

    // console.log("history set", value, ...path);

    const state = this.getState();

		KarmaFieldsAlpha.DeepObject.assign(state, value, ...path);

    this.setState(state);

	}

  static remove(...path) {

    const state = this.getState();

		KarmaFieldsAlpha.DeepObject.remove(state, ...path);

    this.setState(state);

	}


  // static debounce(callback, interval = 2000) {

  //   if (this.debounceTimer) {

  //     clearTimeout(this.debounceTimer);

  //   }

  //   this.debounceTimer = setTimeout(callback, interval);

  // }

	static save() {

		// // -> increase index and max
		// let index = this.getIndex() || 0;
		// index++;

		// this.buffer.set(index, "history", "index");
		// this.buffer.set(index, "history", "max");

		// // erase history forward
		// if (this.buffer.has("history", index)) {
		// 	this.buffer.remove("history", index);
		// }

    // const state = this.getState();
    // let index = state.index || 0;

    // history.pushState({
    //   ...state,
    //   index: index+1,
    //   max: index+1
    // }, "");

    // state.redo = true;

    console.log("history saving");

    this.set(true, "redo");

    this.addState(this.buffer, "");

    this.buffer = {};

	}

  static debounceSave(interval = 500) {

    if (this.debounceTimer) {

      clearTimeout(this.debounceTimer);

    }

    this.debouncing = true;

    this.debounceTimer = setTimeout(() => {
      this.save();
      this.debouncing = false;
    }, interval);

  }


	// static remove(...path) {
	// 	this.buffer.remove("history", ...path);
	// }

	// static getIndex() {
	// 	return this.buffer.get("history", "index") || 0;
	// }

	// static setIndex(index) {
	// 	return this.buffer.set(index, "history", "index");
	// }


  static backup(newValue, currentValue, ...path) {

		// let index = this.getIndex();
    // const state = history.state || {};
    // let index = state.index || 0;

		// newValue = KarmaFieldsAlpha.DeepObject.clone(newValue);

    KarmaFieldsAlpha.DeepObject.assign(this.buffer, newValue, ...path);

		// this.set(newValue, index, ...path);

    // this.buffer.set(newValue, "history", ...path);

		// if (index > 0) {

			// const lastValue = this.get(index-1, ...path);

      // const lastValue = KarmaFieldsAlpha.DeepObject.get(state, "delta", ...path);

      const lastValue = this.get(...path);

			if (lastValue === undefined) {

				// this.set(currentValue, index-1, ...path);

        // KarmaFieldsAlpha.DeepObject.assign(state, currentValue, "delta", ...path);

        this.set(currentValue, ...path);


        // history.replaceState({...state}, "");
        // this.setState(state);
			}

		// }


  }

  /**
   * on popstate
   */
  static update() {

    const state = this.getState();

    if (state) {

      if (state.table !== undefined) {

        KarmaFieldsAlpha.Query.table = state.table;

      }

      if (state.delta) {

        KarmaFieldsAlpha.Delta.merge(state.delta);

      }

      if (state.selection !== undefined) {

        KarmaFieldsAlpha.Selection.object = state.selection;

      }

      if (state.nav) {

        // KarmaFieldsAlpha.Params.object = state.nav;
        // KarmaFieldsAlpha.DeepObject.merge(KarmaFieldsAlpha.Params.object, state.nav);
        KarmaFieldsAlpha.DeepObject.merge(KarmaFieldsAlpha.Query.params, state.nav);

      }

      if (state.ids !== undefined) {

        KarmaFieldsAlpha.Query.ids = state.ids;

      }

      // if (state.fieldData) {
      //
      //   KarmaFieldsAlpha.DeepObject.merge(KarmaFieldsAlpha.field.data, state.fieldData);
      //
      // }

    } else {

      KarmaFieldsAlpha.Query.table = null;

    }

  }


	// static backup(...path) { // path = ["data", "driver", "id", "key"]
	// 	const value = this.buffer.get(...path) || null;
	// 	this.write(value, ...path);
	// }

	// static write(value, ...path) {
	// 	const index = this.buffer.get("history", "index") || 0;
	// 	this.buffer.set(value, "history", index, ...path);
	// }

	static undo() {

    // const state = history.state || {};
		// let index = state.index || 0;



		// if (index > 0) {

		// 	// decrement index and save
		// 	index--;
		// 	this.buffer.set(index, "history", "index");

		// 	// rewind previous state
		// 	const data = this.buffer.get("history", index, "data") || {};
		// 	this.buffer.merge(data, "data");

    //   const nav = this.buffer.get("history", index, "nav") || {};
		// 	// KarmaFieldsAlpha.Nav.merge(nav);

    //   history.replaceState({...history.state, ...nav}, "");

		// 	// const state = this.buffer.get("history", index, "state") || {};
		// 	// this.buffer.merge(state, "state");




		// }

    history.back();

	}

	static hasUndo() {
		// const index = this.buffer.get("history", "index") || 0;
		// return index > 0;

    return history.length > 1;
	}

  static redo() {
		// let index = this.buffer.get("history", "index") || 0;
		// let max = this.buffer.get("history", "max") || 0;

		// if (index < max) {

		// 	// increment index and save
		// 	index++;
		// 	this.buffer.set(index, "history", "index");

		// 	// merge state in delta
		// 	const data = this.buffer.get("history", index, "data") || {};
		// 	this.buffer.merge(data, "data");
		// 	// this.buffer.clean("data");

    //   const nav = this.buffer.get("history", index, "nav") || {};
		// 	// KarmaFieldsAlpha.Nav.merge(nav);

    //   history.replaceState({...history.state, ...nav}, "");

		// 	// const state = this.buffer.get("history", index, "state") || {};
		// 	// this.buffer.merge(state, "state");

		// }

    history.forward();

	}

	static hasRedo() {
		// const index = this.buffer.get("history", "index") || 0;
		// const max = this.buffer.get("history", "max") || 0;

		// return index < max;

    return Boolean(history.state && history.state.redo);
	}

	// static hasChange(...path) {
	// 	const index = this.buffer.get("history", "index") || 0;
	// 	return this.buffer.has("history", index, ...path);
	// }

}

KarmaFieldsAlpha.History.buffer = {};

// document.addEventListener("keydown", event => {
//   if (event.key === "z" && event.metaKey) {
//     event.preventDefault();
//     KarmaFieldsAlpha.History.undo();

//   } else if (event.key === "z" && event.metaKey && event.shiftKey) {
//     event.preventDefault();
//     KarmaFieldsAlpha.History.redo();
//   }
// });
