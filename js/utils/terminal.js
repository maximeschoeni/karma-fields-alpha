
KarmaFieldsAlpha.Terminal = class {

  static async process() {

    return await KarmaFieldsAlpha.Query.process() || await KarmaFieldsAlpha.Delta.processUpdate();

  }

	static modified(...path) {

    if (path.length) {

      return !KarmaFieldsAlpha.DeepObject.equal(KarmaFieldsAlpha.Delta.get(...path), KarmaFieldsAlpha.Query.getValue(...path));

    } else {

      return KarmaFieldsAlpha.DeepObject.isIncluded(KarmaFieldsAlpha.Delta.object, KarmaFieldsAlpha.Query.vars);
    }

	}

	static getValue(...path) {

    return KarmaFieldsAlpha.Delta.get(...path) || KarmaFieldsAlpha.Query.getValue(...path);

	}

	static setValue(value, ...path) {

    const newValue = KarmaFieldsAlpha.Type.toArray(value);

		let currentValue = this.getValue(...path);

		if (KarmaFieldsAlpha.DeepObject.differ(newValue, currentValue)) {

      KarmaFieldsAlpha.History.backup(newValue, currentValue, "delta", ...path);
      KarmaFieldsAlpha.Delta.set(newValue, ...path);

		}

	}

};
