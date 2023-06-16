KarmaFieldsAlpha.history = {}

KarmaFieldsAlpha.History = class {

  static useNative = false;
  // static index = 0;
  // // static length = 0;
  // static states = {
  //   length: 0
  // };
  static buffer = KarmaFieldsAlpha.history;

  static getState() {

    if (this.useNative) {

      return history.state || {};

    } else {

      // if (!this.index < 0) {
      //
      //   this.addState({});
      //
      // }
      // const history = KarmaFieldsAlpha.history;

      if (!this.buffer.states) {

        this.buffer.states = {};

      }

      return this.buffer.states[this.buffer.index] || {};

    }

  }

  static setState(state) {

    if (this.useNative) {

      history.replaceState(state, "");

    } else {

      // const history = KarmaFieldsAlpha.history;

      if (!this.buffer.states) {

        this.buffer.states = {};

      }

      if (!this.buffer.index) {

        this.buffer.index = 0;

      }

      this.buffer.states[this.buffer.index] = state;
      // this.buffer.states.length = this.buffer.index + 1;

    }

  }

  static addState(state) {

    if (this.useNative) {

      this.set(true, "redo");

      history.pushState(state, "");

    } else {

      if (!this.buffer.states) {

        this.buffer.states = {};

      }

      if (!this.buffer.index) {

        this.buffer.index = 0;

      }

      this.buffer.index++;
      this.buffer.states[this.buffer.index] = state;
      this.buffer.states.length = this.buffer.index + 1;

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

  static merge(value) {

    const state = this.getState();

		KarmaFieldsAlpha.DeepObject.merge(state, value);

    this.setState(state);

	}

  // static mergeUnder(value) {
  //
  //   const state = this.getState();
  //
	// 	KarmaFieldsAlpha.DeepObject.mergeUnder(state, value);
  //
  //   this.setState(state);
  //
	// }


	// static save(ref) {
  //
  //   // if ((!id || id !== this.lastId) && (!value || value !== this.lastValue)) {
  //   if (ref !== this.ref) {
  //
  //     console.log("history save", ref);
  //     // console.trace();
  //
  //     this.set(true, "redo");
  //
  //     this.addState(this.buffer, "");
  //
  //     this.buffer = {};
  //
  //     this.ref = ref;
  //
  //   }
  //
  //   // this.lastId = id;
  //   // this.lastValue = value;
  //
	// }
  //
  //
  // static backup(newValue, currentValue, ...path) {
  //
  //   KarmaFieldsAlpha.DeepObject.set(this.buffer, newValue, ...path);
  //
  //   const lastValue = this.get(...path);
  //
	// 	if (lastValue === undefined) {
  //
  //     this.set(currentValue, ...path);
  //
	// 	}
  //
  // }


  // static change(newValue, currentValue, ...path) {
  //
  //   if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", ...path)) {
  //
  //     KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, currentValue, "last", ...path);
  //
  //   }
  //
  //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, newValue, "next", ...path);
  //
  // }
  //
  // static record(newValue, currentValue, ...path) {
  //
  //   this.change(newValue, currentValue, ...path);
  //
  // }
  //
  //
  // static recordSelection(selection) {
  //
  //   this.change(newValue, currentValue, ...path);
  //
  // }

  // static rememberValue2(...path) {
  //
  //   if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "delta", ...path)) {
  //
  //     KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getValue(...path) || [], "last", "delta", ...path);
  //
  //   }
  //
	// 	KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, value || [], "next", "delta", ...path);
  //
	// }

  // static change(currentValue, ...path) {
  //
  //   if (!KarmaFieldsAlpha.DeepObject.has(this.buffer, "last", ...path)) {
  //
  //     KarmaFieldsAlpha.DeepObject.set(this.buffer, currentValue, "last", ...path);
  //
  //   }
  //
  // }

  static save(ref) {

    console.error("deprecated");


    if (ref && ref !== this.ref) {

      // console.log("history save PUSH", ref, KarmaFieldsAlpha.DeepObject.get(this.buffer, "current"), KarmaFieldsAlpha.DeepObject.get(this.buffer, "new"));
      // console.trace();

      console.log("history save PUSH", ref, this.buffer.last, this.buffer.next);

      if (!KarmaFieldsAlpha.DeepObject.equal(this.buffer.last, this.buffer.next)) {

      // if (!KarmaFieldsAlpha.Buffer.equal(this.buffer.new, "history", "current")) {

        this.merge(this.buffer.last);

        this.set(true, "redo");

        this.addState(this.buffer.next);

        this.ref = ref;

      }

    } else {

      console.log("history save REPLACE", ref, this.buffer.last, this.buffer.next);


      this.merge(this.buffer.next);

    }

    this.buffer.last = {};
    this.buffer.next = {};

    // this.lastId = id;
    // this.lastValue = value;

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

      if (this.buffer.index > 0) {

        this.buffer.index--;
        this.update();

      }

    }

    this.ref = null;

	}

	static hasUndo() {

    if (this.useNative) {

      return history.length > 1;

    } else {

      return this.buffer.index > 0;

    }

	}

  static redo() {

    if (this.useNative) {

      history.forward();

    } else if (this.buffer.states) {

      // if (this.index < this.states.max) {
      //
      //   this.index++;
      //   this.update();
      //
      // }

      if (this.buffer.index < this.buffer.states.length - 1) {

        this.buffer.index++;
        this.update();

      }

    }

	}

	static hasRedo() {

    if (this.useNative) {

      return Boolean(history.state && history.state.redo);

    } else if (this.buffer.states) {

      // console.log(this.index, this.states.length, this.states);

      return this.buffer.index < this.buffer.states.length - 1;

    }

	}

}
