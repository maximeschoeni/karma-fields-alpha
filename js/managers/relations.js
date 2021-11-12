
KarmaFieldsAlpha.Relations = class {

	static register(...path) {
		KarmaFieldsAlpha.DeepObject.assign3(this.relations, true, ...path);
	}

	static get(...path) {
		return KarmaFieldsAlpha.DeepObject.get3(this.relations, ...path);
	}

}

KarmaFieldsAlpha.Relations.relations = {};
