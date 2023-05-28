
KarmaFieldsAlpha.History = class {

  static useNative = false;
  static index = 0;
  static states = {};

  static getState() {

    if (this.useNative) {

      return history.state || {};

    } else {

      // if (!this.index < 0) {
      //
      //   this.addState({});
      //
      // }

      return this.states[this.index] || {};

    }

  }

  static setState(state) {

    if (this.useNative) {

      history.replaceState(state, "");

    } else {

      this.states[this.index] = state;

    }

  }

  static addState(state) {

    if (this.useNative) {

      history.pushState(state, "");

    } else {

      this.index++;
      this.states[this.index] = state;
      this.states.max = this.index;

    }

  }

	static get(...path) {

		return KarmaFieldsAlpha.DeepObject.get(this.getState(), ...path);

	}

	static set(value, ...path) {

    const state = this.getState();

		KarmaFieldsAlpha.DeepObject.set(state, value, ...path);

    this.setState(state);

	}

  static remove(...path) {

    const state = this.getState();

		KarmaFieldsAlpha.DeepObject.remove(state, ...path);

    this.setState(state);

	}

	static save(ref) {

    // if ((!id || id !== this.lastId) && (!value || value !== this.lastValue)) {
    if (ref !== this.ref) {

      console.log("history save", ref);

      this.set(true, "redo");

      this.addState(this.buffer, "");

      this.buffer = {};

      this.ref = ref;

    }

    // this.lastId = id;
    // this.lastValue = value;

	}

  static backup(newValue, currentValue, ...path) {

    KarmaFieldsAlpha.DeepObject.set(this.buffer, newValue, ...path);

    const lastValue = this.get(...path);

		if (lastValue === undefined) {

      this.set(currentValue, ...path);

		}

  }

  /**
   * on popstate
   */
  static update() {

    const state = this.getState();

    if (state) {

      KarmaFieldsAlpha.Store.merge(state);

    } else {

      KarmaFieldsAlpha.Store.remove("table");

    }

  }

	static undo() {

    if (this.useNative) {

      history.back();

    } else {

      if (this.index > 0) {

        this.index--;
        this.update();

      }

    }

	}

	static hasUndo() {

    if (this.useNative) {

      return history.length > 1;

    } else {

      return this.index > 0;

    }

	}

  static redo() {

    if (this.useNative) {

      history.forward();

    } else {

      if (this.index < this.states.max) {

        this.index++;
        this.update();

      }

    }

    history.forward();

	}

	static hasRedo() {

    if (this.useNative) {

      return Boolean(history.state && history.state.redo);

    } else {

      // console.log(this.index, this.states.length, this.states);

      return this.index < this.states.max;

    }
	}

}

KarmaFieldsAlpha.History.buffer = {};
