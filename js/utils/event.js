
KarmaFieldsAlpha.Event = class {

  constructor(args = null, target = null) {

    this.target = target;
    this.data = [];
    this.path = [];
    this.type = "array";

    if (args) {
      Object.assign(this, args);
    }

  }

  setArray(value) {
    this.data = value;
  }

  setString(value) {
    this.data = [value.toString()];
  }

  setNumber(value) {
    this.data = [Number(value)];
  }

  setBoolean(value) {
    this.data = [Boolean(value)];
  }

  setObject(value) {
    this.data = [value];
  }

  setValue(value) {
    if (Array.isArray(value)) {
      this.data = value;
    } else if (value === undefined || value === null) {
      this.data = [];
    } else {
      this.data = [value];
    }
  }

  getValue() {
    if (this.type === "string") {
      return this.getString();
    } else if (this.type === "number") {
      return this.getNumber();
    } else if (this.type === "boolean") {
      return this.getBoolean();
    } else if (this.type === "object") {
      return this.getObject();
    } else {
      return this.getArray();
    }
  }



  // parseCondition(args) {
  //   if (args.condition !== undefined) {
  //     let matches = state.match(/^(.*?)(=|<|>|!=|<=|>=|!)(.*)$/);
	//     if (matches) {
	//       switch (matches[2]) {
  //         case "=":
  //           this.states[state] = () => this.getState(matches[1]).then(value => value === matches[3]);
	//           break;
	//         case "<":
  //           this.states[state] = () => this.getState(matches[1]).then(value => value < matches[3]);
	//           break;
	//         case ">":
  //           this.states[state] = () => this.getState(matches[1]).then(value => value > matches[3]);
	//           break;
	//         case "!=":
  //           this.states[state] = () => this.getState(matches[1]).then(value => value !== matches[3]);
	//           break;
	//         case "<=":
  //           this.states[state] = () => this.getState(matches[1]).then(value => value <= matches[3]);
	//           break;
  //         case ">=":
  //           this.states[state] = () => this.getState(matches[1]).then(value => value >= matches[3]);
	//           break;
	//         case "!":
  //           this.states[state] = () => this.getState(matches[3]).then(value => !value);
	//           break;
	// 				// case ":in:":
  //         //   this.states[state] = () => this.get(matches[3]).then(value => value.includes(value[0]));
  //         //   break;
	// 				// case ":notin:":
  //         //   this.states[state] = () => this.get(matches[3]).then(value => !value.includes(value[0]));
	//         //   break;
  //         // case "::":
  //         //   this.states[state] = () => Promise.all(this.get(matches[1]), this.get(matches[3])).then(values => values[0][0] === values[1][0]);
	//         //   break;
	//       }
	//     } else {
  //       this.states[state] = () => this.getState(state).then(value => Boolean(value));
	// 		}
  //   }
  // }

  getString() {
    if (this.data.length) {
      return this.data[0].toString();
    } else {
      return "";
    }
  }

  getNumber() {
    return Number(this.data[0]) || 0;
  }

  getBoolean() {
    return Boolean(this.data[0]);
  }

  getObject() {
    return this.data[0];
  }

  getArray() {
    return this.data;
  }


  hasValue() {
    return this.data.length > 0;
  }

  duplicate() {
    const event = new KarmaFieldsAlpha.Event();
    event.target = this.target;
    event.data = [...this.data];
    event.path = [...this.path];
    event.type = this.type;
    event.action = this.action;
    event.default = this.default;

    return event;
  }

}

KarmaFieldsAlpha.Type = class {

  static getType(value) {
    if (Array.isArray(value)) {
      return "array";
    } else if (value === null) {
      return "null";
    } else {
      return typeof value;
    }
  }

}
