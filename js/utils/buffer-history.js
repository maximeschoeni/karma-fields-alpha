
KarmaFieldsAlpha.BufferHistory = class extends KarmaFieldsAlpha.Buffer {

	getObject() {
		return history.state || {};
	}

	setObject(delta) {

		history.pushState(delta, "");

	}

}

window.addEventListener("popstate", event => {
	KarmaFieldsAlpha.Nav.onpopstate && KarmaFieldsAlpha.Nav.onpopstate();
});
