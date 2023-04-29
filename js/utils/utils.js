
KarmaFieldsAlpha.Utils = class {

	static timers = {};

	static debounce(id, callback, interval = 1000) {

	  if (this.timers[id]) {

	    clearTimeout(this.timers[id]);

	  }

	  this.timers[id] = setTimeout(() => callback(), interval);

	}

};
