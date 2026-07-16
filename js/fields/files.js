
KarmaFieldsAlpha.field.files = class extends KarmaFieldsAlpha.field.tags {

	getDriver() {

		return this.resource.driver || "medias";

	}

	getBody() {

		const value = this.parent.getValue(this.resource.key);

		if (value === undefined) {

			return;

		}

		return new KarmaFieldsAlpha.field.gallery({
			length: value.length,
			sortable: true
		}, "body", this);

	}

	getFooter() {

		return new KarmaFieldsAlpha.field.files.footer(this.resource.footer, "footer", this);

	}

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


KarmaFieldsAlpha.field.files.footer = class extends KarmaFieldsAlpha.field.tags.footer {

	constructor(resource, id, parent) {

		super({
			children: [
				"add",
				"edit",
				"remove"
			],
			...resource
		}, id, parent);

	}

}

// KarmaFieldsAlpha.field.files.footer.add = class extends KarmaFieldsAlpha.field.button {
// 	constructor(resource, id, parent) {
// 		super({
// 			title: "Add",
// 			text: "Add File",
// 			action: "open",
// 			// hidden: ["||", [">=", ["request", "getLength"], ["request", "getMax"]], ["isMixed", ["getValue"]]],
// 			hidden: ["||", [">=", ["length", ["get"]], ["request", "getMax"]], ["isMixed"]],
// 			save: "open-files",
// 			...resource
// 		}, id, parent);
// 	}
// }

// KarmaFieldsAlpha.field.remove = class extends KarmaFieldsAlpha.field.button {
// 	constructor(resource, id, parent) {
// 		super({
// 			title: "Remove",
// 			text: "Remove",
// 			action: "delete",
// 			// disabled: ["!", ["request", "hasSelection"]],
// 			disabled: ["!", ["hasSelection"]],
// 			// hidden: ["=", ["count", ["getValue"]], 0],
// 			hidden: ["=", ["length", ["get"]], 0],
// 			...resource
// 		}, id, parent);
// 	}
// }
// KarmaFieldsAlpha.field.files.footer.edit = class extends KarmaFieldsAlpha.field.button {
// 	constructor(resource, id, parent) {
// 		super({
// 			text: "Change",
// 			action: "edit",
// 			disabled: ["!", ["hasSelection"]],
// 			// hidden: ["||", ["=", ["count", ["getValue"]], 0], ["isMixed"]],
// 			// hidden: ["||", ["=", ["request", "getLength"], 0], ["isMixed", ["getValue"]]],
// 			hidden: ["||", ["=", ["length", ["get"]], 0], ["isMixed"]],
// 			...resource
// 		}, id, parent);
// 	}
// }

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
