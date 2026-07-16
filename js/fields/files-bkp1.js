
KarmaFieldsAlpha.field.files = class extends KarmaFieldsAlpha.field.tags {

	// async import(collection, index = 0, length = Infinity) {

	// 	let idsQuery = this.getIds();

	// 	while (idsQuery.loading) {

	// 		await this.render();
	// 		idsQuery = this.getIds();

	// 	}

	// 	const string = collection.value.shift();


	// 	let addedItems = [];

	// 	if (string.startsWith("http")) {

	// 		const driver = this.getDriver();
	// 		let params = this.queryParams();

	// 		while (params.loading) {

	// 			await this.render();
	// 			params = this.getParams();

	// 		}

	// 		const defaults = Object.fromEntries(Object.entries(params.toObject()).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(driver, key), value]));

	// 		const token = Symbol("token");

	// 		for (let key in defaults) {

	// 			KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, [defaults[key]], "vars", driver, token, key);

	// 		}

	// 		KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.server.store, "ids", driver);

	// 		let ids = [...idsQuery.toArray()];
	// 		ids.splice(index, 0, token);

	// 		const key = this.getKey();
	// 		const content = this.parent.getContent("id");
	// 		const contentDriver = this.parent.getDriver();

	// 		KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, ids, "vars", contentDriver, content.toString(), key);

	// 		await this.render();

	// 		const response = await fetch(string);
	// 		const blob = await response.blob();
	// 		const filename = string.split('/').pop();

	// 		// const file = new File([blob], filename, {type: "image/jpg"});
	// 		const file = new File([blob], filename);

	// 		let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params need to be saved later

	// 		id = id.toString();

	// 		const delta = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.server.store, "vars", driver, token);

	// 		if (delta) {

	// 			KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, delta, "vars", driver, id);
	// 			KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.server.store, "vars", driver, token);

	// 			for (let key in delta) {

	// 				await KarmaFieldsAlpha.Database.States.set(delta[key], "external", driver, id, key);
	// 				await KarmaFieldsAlpha.History.write(delta[key], [], "external", driver, id, key);

	// 			}

	// 		}

	// 		await KarmaFieldsAlpha.Database.Vars.set(["0"], driver, id, "trash");
	// 		await KarmaFieldsAlpha.Database.States.set(["0"], "external", driver, id, "trash");
	// 		await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", driver, id, "trash");



	// 		await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, { [id]: defaults });

	// 		await KarmaFieldsAlpha.Database.States.remove("queries", driver);
	// 		await KarmaFieldsAlpha.Database.Queries.remove({ driver });


	// 		ids = ids.map(currentId => currentId === token ? id : currentId);

	// 		// -> remove symbol from store or it will trigger an error when updating history!
	// 		KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, idsQuery.toArray(), "vars", contentDriver, content.toString(), key);

	// 		await this.setIds(ids);

	// 	} else {

	// 		addedItems = string && string.split(",") || [];

	// 		const newIds = [...idsQuery.toArray()];
	// 		newIds.splice(index, length, ...addedIds);

	// 		await this.setIds(newIds);

	// 	}

	// }

	// getValue(key, id) {

	// 	if (key && id !== undefined) {

	// 		const driver = this.getDriver();

	// 		return super.getValue(key, id, driver);

	// 	}

	// 	return super.getValue(key, id);

	// }

	getBody() {

		return new KarmaFieldsAlpha.field.gallery({
			sortable: true
		}, "body", this);

	}

	getFooter() {

		return new KarmaFieldsAlpha.field.group({
			display: "flex",
			align: "flex-bottom",
			children: [
				{ type: "add" },
				{ type: "edit" },
				{type: "remove"}
			],
			...this.resource.footer,
			offsetContainer: true
		}, "footer", this);

		// return this.createChild({
		// 	type: "footer",
		// 	children: [
		// 		{ type: "add" },
		// 		{ type: "edit" },
		// 		{ type: "remove" }
		// 	],
		// 	...this.resource.footer,
		// 	offsetContainer: true
		// }, "footer", this);

	}

	// getPopup() {

	// 	return this.createChild({
	// 		type: "medias",
	// 		params: {
	// 			parent: "0"
	// 		},
	// 		...this.resource.popup
	// 	}, "popup");

	// }

	// getDriver() {

	// 	return this.resource.driver || "medias";

	// }

	// getTable() {

	// 	return this.resource.table || "medias";

	// }

	// open() {

	// 	this.edit([]);

	// }

	// edit(ids) {

	// 	if (this.resource.uploader === "wp" || this.resource.library === "wp") {

	// 		this.openMediaLibrary(ids);

	// 	} else {

	// 		super.edit(ids);

	// 	}

	// }

	openMediaLibrary() {

		// const rootSelection = KarmaFieldsAlpha.Store.State.getSelection();

		// const selection = await this.getSelection();

		const frame = wp.media({
			title: "Select file",
			button: {
				text: "Use this file"
			},
			library: {
				// post__in: this.getSelectedIds(),
				posts_per_page: this.resource.posts_per_page || 100,
				type: this.resource.file && (this.resource.file.type || this.resource.file.types)
					|| this.resource.mime_types
					|| this.resource.mimeTypes
					|| this.resource.mimetypes
					|| this.resource.mimeType
					|| this.resource.mimetype
					|| this.resource.mime_type
					|| "image" //'application/font-woff'
			},
			multiple: this.getMax() > 1 ? true : false
		});
		frame.on("select", () => {

			const attachments = frame.state().get("selection").toJSON();
			const attachmentIds = attachments.map(attachment => attachment.id.toString());
			//this.save("insert", "Insert attachments"); // -> already saved when opening modal
			this.insert(attachmentIds);
			this.setFocus(true);
			this.render();

		});
		frame.on("open", () => {
			let mediaSelection = frame.state().get("selection");

			const body = this.getBody();

			if (body) {

				const ids = body.getSelectedIds();

				for (let id of ids) {
					mediaSelection.add(wp.media.attachment(id));
				}

			}

		});

		frame.open();
	}

  // async uploadFile(file) {

  //   if (this.resource.uploader === "wp") {

  //     const fileName = file.name.normalize();

  //     const formData = new FormData();
  //     formData.append("async-upload", file);
  //     formData.append("name", fileName);
  //     formData.append("action", wp.Uploader.defaults.multipart_params.action);
  //     formData.append("_wpnonce", wp.Uploader.defaults.multipart_params._wpnonce);

  //     return fetch(KarmaFieldsAlpha.adminURL+"async-upload.php", {
  //       method: "post",
  //       body: formData,
  //       mode: "cors"
  //     }).then(response => response.json());

  //   }

  // }


	// hasFileSelected() {

	// 	return this.hasSelection();

	// }



}

// KarmaFieldsAlpha.field.files.medias = class extends KarmaFieldsAlpha.field.medias {

// 	constructor() {

// 		super();

// 		this.resource = {
// 			driver: "medias",
// 			// params: {
// 			// 	parent: "0"
// 			// },
// 			header: {
// 				type: "header",
// 				title: "Medias",
// 				children: [
// 					"title",
// 					"count",
// 					"pagination",
// 					"close"
// 				]
// 			},
// 			body: {
// 				type: "gallery",
// 				draganddrop: true,
// 				modal: {
// 					body: {
// 						type: "single",
// 						children: [
// 							"description",
// 							{
// 								type: "input",
// 								key: "post_title",
// 								label: "Name",
// 								visible: ["=", "folder", ["get", "filetype"]]
// 							},
// 							{
// 								type: "textarea",
// 								key: "post_excerpt",
// 								label: "Caption",
// 								height: '3rem',
// 								visible: ["=", "file", ["get", "filetype"]]
// 							}
// 						]
// 					}
// 				},
// 			},
// 			footer: {}
// 		}

// 	}

// }

KarmaFieldsAlpha.field.files.footer = class extends KarmaFieldsAlpha.field.group {

	constructor(resource, id, parent) {

		super({
			display: "flex",
			children: [
				"add",
				"edit",
				"remove"
			],
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.files.footer.add = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			title: "Add",
			text: "Add File",
			action: "open",
			// hidden: ["||", [">=", ["request", "getLength"], ["request", "getMax"]], ["isMixed", ["getValue"]]],
			hidden: ["||", [">=", ["length", ["get"]], ["request", "getMax"]], ["isMixed"]],
			save: "open-files",
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.remove = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			title: "Remove",
			text: "Remove",
			action: "delete",
			// disabled: ["!", ["request", "hasSelection"]],
			disabled: ["!", ["hasSelection"]],
			// hidden: ["=", ["count", ["getValue"]], 0],
			hidden: ["=", ["length", ["get"]], 0],
			...resource
		}, id, parent);
	}
}
KarmaFieldsAlpha.field.files.footer.edit = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			text: "Change",
			action: "edit",
			disabled: ["!", ["hasSelection"]],
			// hidden: ["||", ["=", ["count", ["getValue"]], 0], ["isMixed"]],
			// hidden: ["||", ["=", ["request", "getLength"], 0], ["isMixed", ["getValue"]]],
			hidden: ["||", ["=", ["length", ["get"]], 0], ["isMixed"]],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.file = class extends KarmaFieldsAlpha.field.files {
	constructor(resource, id, parent) {
		super({
			max: 1,
			width: "auto",
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.attachFileButton = class extends KarmaFieldsAlpha.field.files {

	getDriver() {

		return this.resource.driver || "medias";

	}

	*build() {

		yield {
			children: [
				...this.createChild({
					type: "button",
					action: "open",
					dashicon: "paperclip"
				}).build(),
				...this.buildPopup()
			]
		}

	}

	// async insert(ids) {
	// 	const id = ids[0];

	// 	let filename = this.getWild("medias", id, "filename");
	// 	let dir = this.getWild("medias", id, "dir");

	// 	while (filename.loading || dir.loading) {

	// 		await this.render();
	// 		filename = this.getWild("medias", id, "filename");
	// 		dir = this.getWild("medias", id, "dir");
	// 	}

	// 	const src = `${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${filename.toString()}`;

	// 	this.parent.setValue(src, this.resource.key);

	// }


}
