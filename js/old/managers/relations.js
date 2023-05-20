
KarmaFieldsAlpha.Relations = class {

	static register(...path) {
		KarmaFieldsAlpha.DeepObject.set(this.relations, true, ...path);
	}

	static get(...path) {
		return KarmaFieldsAlpha.DeepObject.get(this.relations, ...path);
	}

}

KarmaFieldsAlpha.Relations.relations = {};
