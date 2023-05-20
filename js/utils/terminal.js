
KarmaFieldsAlpha.Terminal = class {

  // static async process() {
  //
  //   return await KarmaFieldsAlpha.Query.process() || await KarmaFieldsAlpha.Delta.processUpdate();
  //
  // }

  // static async *loader() {
  //
  //   const requirements = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.Query.requirements, "queries");
  //
  //   while (requirements.length) {
  //
  //     const requirement = requirements.shift();
  //
  //     const results = await this.query(driver, paramstring);
  //
  //     KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.Query.queries, results, driver, paramstring);
  //
  //     yield true;
  //
  //   }
  //
  //   if (requirements) {
  //
  //     const driver = Object.keys(requirements).find(driver => requirements[driver].size);
  //
  //     if (driver) {
  //
  //       const set = requirements[driver];
  //       const paramstring = [...set][0];
  //
  //       const results = await this.query(driver, paramstring);
  //
  //       KarmaFieldsAlpha.DeepObject.set(this.queries, results, driver, paramstring);
  //
  //       set.delete(paramstring);
  //
  //       return true;
  //
  //     }
  //
  //   }
  //
  //   return false;
  //
  //
  // }


	static modified(...path) {
console.error("Deprecated");
    return !KarmaFieldsAlpha.DeepObject.include(KarmaFieldsAlpha.Query.vars, KarmaFieldsAlpha.Store.get("delta", ...path), ...path);

	}

	static getValue(...path) {
console.error("Deprecated");
    return KarmaFieldsAlpha.Store.get("delta", ...path) || KarmaFieldsAlpha.Query.getValue(...path);

	}

	static setValue(value, ...path) {
console.error("Deprecated");
    const newValue = KarmaFieldsAlpha.Type.toArray(value);

		let currentValue = this.getValue(...path);

		if (KarmaFieldsAlpha.DeepObject.differ(newValue, currentValue)) {

      KarmaFieldsAlpha.History.backup(newValue, currentValue, "delta", ...path);
      // KarmaFieldsAlpha.Delta.set(newValue, ...path);
      KarmaFieldsAlpha.Store.set(newValue, "delta", ...path);

		}

	}

};
