
KarmaFieldsAlpha.field.gallery = class extends KarmaFieldsAlpha.field.grid {

	static exit = Symbol("exit");


	edit(ids) {

		this.open();

	}

	uploadUrl(url) {

		let driver = this.resource.driver;

		if (!driver) {

			driver = this.parent.getDriver();

		}

		if (!driver) {

			console.error("uploading from url but driver is not set");

		}

		const token = KarmaFieldsAlpha.server.uploadUrl(url, driver);

		return token;

	}


	importAt(items, index = 0, length = Infinity) { // items is ids or urls

		let ids = this.getIds();

		if (ids === undefined) {

			console.error("importing but ids are undefined");

		}

		this.deleteAt(index, length);

		for (let item of items) {

			if (item.startsWith("http")) {

				const token = this.uploadUrl(item);

				this.addFiles(token);

			} else { // -> otherwise assume it is an id

				this.addFiles(item);

			}

		}

	}

	getExit() {

		return { exit: true };

	}

	isExit(socket) {

		return socket.exit || false;

	}

	// deprec. Use setSelection
	selectAt(index, length = 1) { // -> used by gallery to set right selection in case of exit item

		// const ids = this.getIds();

		// while (this.isExit(ids[index])) index++;

		// super.selectAt(index, length);

		this.setSelection({ index, length });

	}


	isMixed(key) {

		const sockets = this.getSelectedIds();

		if (sockets.length > 1) {

			let index = 0;
			const firstValue = this.parent.getSocketValue(key, sockets[index++]);

			if (firstValue === undefined) {

				return;

			}

			while (index < sockets.length) {

				const value = this.parent.getSocketValue(key, sockets[index++]);

				if (value === undefined) {

					return;

				}

				if (!KarmaFieldsAlpha.Collection.equal(value, firstValue)) {

					return true;

				}

			}

		}

		return false;

	}

	// *listItems() {

	// 	const parent = this.getValue("parent");

	// 	if (parent && parent[0] && parent[0] !== "0") {

	// 		yield "exit";

	// 	}

	// 	const query = this.parent.getQuery();

	// 	if (query !== undefined) {

	// 		for (let i = 0; i < query.ids.length; i++) {

	// 			yield i;

	// 		}

	// 	}

	// }

	// *listSockets() {

	// 	const parentKey = this.getParentKey();
	// 	const parentId = this.getParam(parentKey);

	// 	if (parentId && parentId !== "0") {

	// 		const grandParentId = this.getParent(parentId) || "0";

	// 		yield { id: grandParentId, exit: true };

	// 	}

	// 	const query = this.parent.getQuery();

	// 	if (query !== undefined) {

	// 		// for (let i = 0; i < query.ids.length; i++) {
	// 		for (let id of query.ids) {

	// 			yield { id };

	// 		}

	// 	}

	// }

	// *listIds() {

	// 	const parentKey = this.getParentKey();
	// 	const parentId = this.getParam(parentKey);

	// 	if (parentId && parentId !== "0") {

	// 		yield this.constructor.EXIT;

	// 	}

	// 	const query = this.parent.getQuery();

	// 	if (query !== undefined) {

	// 		for (let id of query.ids) {

	// 			yield id;

	// 		}

	// 	}

	// }

	// getIds() {
	getSockets() {

		const ids = this.getIds();

		if (ids !== undefined) {

			const parentKey = this.getParentKey();
			const parentId = this.getParam(parentKey);

			let sockets = ids.map(id => ({ id }));

			if (parentId && parentId !== "0") {

				sockets = [{ exit: true }, ...sockets];

			}

			return sockets;

		}

	}

	// setIds(ids) {

	// 	ids = ids.filter(id => !this.isExit(id));

	// 	this.parent.setIds(ids);

	// }

	setSockets(sockets) {

		const ids = sockets.filter(socket => !socket.exit).map(socket => socket.id);

		this.parent.setIds(ids);

	}

	getSocketSelection() {

		return super.getSelection();

	}

	setSocketSelection(selection) {

		super.setSelection(selection);

	}

	getSelection() {

		const socketSelection = this.getSocketSelection();
		const sockets = this.getSockets();

		if (sockets !== undefined && socketSelection !== undefined) {

			const selection = { ...socketSelection };

			if (selection.length && sockets[selection.index] && sockets[selection.index].exit) {

				selection.index += 1;
				selection.length -= 1;

			}

			return selection;

		}


	}

	setSelection(selection) {

		const sockets = this.getSockets();

		if (sockets && sockets.length > 0) {

			const socketSelection = { ...selection };

			if (sockets[0].exit && socketSelection.index === 0) {

				socketSelection.index += 1;

			}

			super.setSelection(socketSelection);

		}

	}

	isSocketSelected(socket) {

		const sockets = this.getSelectedSockets();

		if (sockets !== undefined) {

			return sockets.includes(socket);

		}

	}

	isSocketSelectedAt(index, length = 1) {

		const selection = this.getSocketSelection();

		if (selection) {

			return index >= selection.index && index + length <= selection.index + selection.length;

		}

		return false;

	}

	getSelectedSockets() {

		const selection = this.getSocketSelection();
		const sockets = this.getSockets();

		if (selection !== undefined && sockets !== undefined) {

			const { index = 0, length = 0 } = selection;

			return sockets.slice(index, index + length);

		}

	}

	deleteSocket(socket) {

		if (!socket.exit && !this.isAutoFolder(socket)) {

			this.parent.delete(socket.id);

		}

	}

	// getSockets() {

	// 	let sockets = KarmaFieldsAlpha.server.getState("sockets");

	// 	if (!sockets) {

	// 		sockets = [...this.listSockets()];

	// 	}

	// 	return sockets;
	// }

	// getIds() {

	// 	let ids = KarmaFieldsAlpha.server.getState("ids");

	// 	if (!ids) {

	// 		ids = [...this.listIds()];

	// 	}

	// 	return ids;
	// }


	// mapIndex(index) {

	// 	// return this.listItems().drop(index).next().value;

	// 	return this.listSockets().drop(index).next().value.id;

	// }

	getSocketLength() {

		const ids = this.getSockets();

		if (ids) {

			return ids.length;

		}

	}

	getExportableColumns() {

		return [
			{
				// type: "input", // -> type = "group"
				key: "id"
			}
		];

	}


  // getContentAt(index, key) {



  //   if (index === "exit") {

  //     switch (key) {
  //       case "id":
  //         const id = this.getContent("parent");
  //         return this.getParent(id.toString());

  //       case "filetype":
  //         return new KarmaFieldsAlpha.Content("folder");

  //       case "filename":
  //       case "name":
  //         return new KarmaFieldsAlpha.Content("..");

  //       default:
  //         return new KarmaFieldsAlpha.Content("");

  //     }

  //   } else if (index === "*" || index === "modal") {

  //     let selection = this.getSelection() || {};

  //     const socketsQuery = this.getSockets();

  //     if (socketsQuery.slice(selection.index || 0, (selection.index || 0)+(selection.length || 0)).some(socket => socket.id === "exit")) {

  //       const content = new KarmaFieldsAlpha.Content();

  //       if (length > 1) {

  //         content.mixed = true;

  //       } else if (key === "filetype") {

  //         content.value = "exit";

  //       }

  //       return content;

  //     } else {

  //       return super.getContentAt(index, key);

  //     }

  //   } else {

  //     return super.getContentAt(index, key);

  //   }

  // }


	getParentKey() {

		if (this.resource.hierarchical && typeof this.resource.hierarchical === "string") {

			return this.resource.hierarchical;

		}

		return "parent";

		// if (this.hierarchical === true) {

		// 	return "parent";

		// }

		// return this.hierarchical;
	}

	// getValueAt(index, key) {

	// 	index = this.mapIndex(index);

	// 	const parentKey = this.getParentKey();

	// 	if (index === "exit") {

	// 		switch (key) {
	// 			case "id":
	// 				const id = this.getValue(parentKey);
	// 				if (id) {
	// 					if (!id[0] || id[0] === "0") {
	// 						console.error("Getting id of exit but this folder is root");
	// 					}
	// 					return this.getWild(this.getDriver(), id[0], parentKey);
	// 				}
	// 				break;

	// 			case "filetype":
	// 				return ["folder"];

	// 			case "filename":
	// 			case "name":
	// 				return [".."];

	// 			default:
	// 				return [];

	// 		}

	// 	} else {

	// 		return this.parent.getValueAt(index, key);

	// 	}

	// }

	/**
 * Detect file type from ArrayBuffer using magic bytes
 * @param {ArrayBuffer} arrayBuffer - The file data as ArrayBuffer
 * @returns {Promise<string>} - Detected MIME type or 'application/octet-stream' if unknown
 */
	async detectFileType(arrayBuffer) {
		// Common file signatures (magic numbers)
		const signatures = {
			// Images
			'89504E47': 'image/png',
			'47494638': 'image/gif',
			'FFD8FFDB': 'image/jpeg',
			'FFD8FFE0': 'image/jpeg',
			'FFD8FFE1': 'image/jpeg',
			'FFD8FFE2': 'image/jpeg',
			'FFD8FFE3': 'image/jpeg',
			'FFD8FFE8': 'image/jpeg',
			'49492A00': 'image/tiff',
			'4D4D002A': 'image/tiff',
			'424D': 'image/bmp',
			'52494646': 'image/webp', // WEBP 'RIFF'

			// Documents
			'25504446': 'application/pdf',
			'504B0304': 'application/zip', // Also .docx, .xlsx, etc.
			'D0CF11E0': 'application/vnd.ms-office', // .doc, .xls, .ppt
			'377ABCAF': 'application/x-7z-compressed',
			'1F8B08': 'application/gzip',
			'75737461': 'application/x-tar',

			// Audio/Video
			'494433': 'audio/mpeg', // MP3 with ID3 tag
			'000001BA': 'video/mpeg',
			'000001B3': 'video/mpeg',
			'66747970': 'video/mp4', // MP4 'ftyp'
			'3026B275': 'video/x-ms-wmv',
			'4F676753': 'application/ogg',

			// Text files (no signature, but check for BOM)
			'EFBBBF': 'text/plain', // UTF-8 BOM
			'FFFE': 'text/plain', // UTF-16 LE BOM
			'FEFF': 'text/plain', // UTF-16 BE BOM
		};

		// Convert the first 8 bytes to hex string for checking
		const uint8Array = new Uint8Array(arrayBuffer);
		const bytes = Array.from(uint8Array.slice(0, 8)); // Get first 8 bytes
		let hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

		// Special case for MP3 without ID3 tag (starts with audio frame header)
		if (hex.startsWith('FFF') || hex.startsWith('FFE')) {
			return 'audio/mpeg';
		}

		// Check against known signatures
		for (const [signature, mimeType] of Object.entries(signatures)) {
			if (hex.startsWith(signature)) {
				return mimeType;
			}
		}

		// Check for plain text if no binary signature found
		// if (isLikelyText(uint8Array)) {
		// 	return 'text/plain';
		// }

		// Default to octet-stream if unknown
		return 'application/octet-stream';
	}

/**
 * Check if the file is likely plain text
 * @param {Uint8Array} uint8Array - The file data
 * @returns {boolean} - True if likely text
 */
// function isLikelyText(uint8Array) {
//     // Check first 512 bytes for non-text characters
//     const sample = uint8Array.slice(0, Math.min(512, uint8Array.length));
//     for (let i = 0; i < sample.length; i++) {
//         const byte = sample[i];
//         // Check for control chars that aren't whitespace or common text chars
//         if (byte < 32 && byte !== 9 && byte !== 10 && byte !== 13) {
//             return false;
//         }
//     }
//     return true;
// }

/**
 * Detect file type from a File object
 * @param {File} file - The File object to analyze
 * @returns {Promise<string>} - Detected MIME type
 */
// async function detectFileTypeFromFile(file) {
//     const arrayBuffer = await file.slice(0, 8).arrayBuffer();
//     return detectFileType(arrayBuffer);
// }

// Example usage:
// document.querySelector('input[type="file"]').addEventListener('change', async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//         const detectedType = await detectFileTypeFromFile(file);
//         console.log(`Detected type: ${detectedType}`);
//         console.log(`Browser type: ${file.type}`);
//     }
// });
//



	getSocketValue(key, socket) {

		// if (socket === undefined) {

		// 	const sockets = this.getSelectedSockets();

		// 	if (sockets === undefined) {

		// 		return;

		// 	}

		// 	if (sockets.length) {

		// 		socket = sockets[0];

		// 	} else {

		// 		console.warn("getting value but nothing is selected");

		// 		return [];

		// 	}

		// }


		if (socket.exit) {

			switch (key) {
				case "id":
					return id;
					// const parentKey = this.getParentKey();
					// const parentId = this.getParam(parentKey);
					// return parentId && this.getParent(parentId) || ["0"];

				case "filetype":
					return ["folder"];

				case "filename":
				case "name":
					return [".."];

				default:
					return [];

			}

		} else if (typeof socket.id === "object") {

			if (!socket.id) {

				console.warn("Socket id is null"); // why?
				return [];

			}

			if (socket.id.file) {

				if (key === "mimetype" && !id.mimetype) {

					socket.id.mimetype = [];

					socket.id.file.slice(0, 8).arrayBuffer().then(arrayBuffer => this.detectFileType(arrayBuffer)).then(mimetype => {
						socket.id.mimetype = [mimetype];
					});

					KarmaFieldsAlpha.Store.promise(done => {
						if (socket.id.mimetype.length) {
							done();
						}
					}, "get-mimetype");

					return socket.id.mimetype;

				}

				if (key === "filetype") {

					return ["upload"];

				}

			} else {

				if (key === "filetype") {

					return ["folder"];

				}

			}

			return id[key] || [];


		} else {

			return super.getValue(key, socket.id);

		}

	}

	// setValueAt(value, index, key) {

	// 	index = this.mapIndex(index);

	// 	if (index !== "exit") {

	// 		this.parent.setValueAt(value, index, key);

	// 	}

	// }

	setSocketValue(value, key, socket) {

		if (!socket.exit) {

			this.setValue(value, key, socket.id);

		}

	}

	// addAt(index, length = 1, params = {}, data = undefined) {

	// 	index = this.mapIndex(index);

	// 	if (index === "exit") {

	// 		index = 0;

	// 	}

	// 	this.parent.addAt(index, length, params, data);

	// }

	// add(length = 1, itemParams = {}, data = undefined) {

	// 	const socket = this.getNewItemSocket();

	// 	this.addAtSocket(socket, length, itemParams, data);

	// }

	// addAtSocket(socket, length = 1, params = {}, data = undefined) {

	// 	if (socket.exit) {

	// 		index = 0;

	// 	}

	// 	this.parent.addAt(socket.queryId, length, params, data);

	// }

	// addSocket() {

	// 	let index = 0;
	// 	const sockets = this.getSockets();

	// 	while (sockets[index].exit) index++;

	// 	const defaults = this.parent.getDefaults();
	// 	const filters = this.parent.getFilters();

	// 	const socket = Symbol("token");

	// 	sockets.splice(index, 0, socket);

	// 	KarmaFieldsAlpha.server.setState(sockets, "sockets");

	// }



	// this function is intended to be called by parent (table, etc.)
	// add(length, index = 0) {

	// 	// -> just for gallery:
	// 	while (ids[index] === this.constructor.exit) index++;

	// 	let ids = [...this.getIds()];
	// 	// const tokens = [];

	// 	// for (let i = 0; i < length; i++) {

	// 	// 	const token = KarmaFieldsAlpha.server.createToken();

	// 	// 	tokens.push(token);

	// 	// }

	// 	ids.splice(index, 0, ...tokens);

	// 	this.setIds(ids);

	// 	return tokens;

	// }





	getSocketsAt(index, length) {

		const sockets = this.getSockets();

		return sockets.slice(index, index + length);

	}



	// addIds(...tokens) { // -> to be called by parent

	// 	this.addFolders(...tokens);

	// }

	// // deprecated
	// addFolders(...tokens) { // -> to be called by parent

	// 	let ids = this.getIds();

	// 	let index = 0;

	// 	// -> just for gallery:
	// 	while (ids[index] === this.constructor.exit) index++;

	// 	ids = [...ids];
	// 	ids.splice(index, 0, ...tokens);

	// 	this.setIds(ids);

	// }

	// // deprecated
	// addFiles(tokens) { // -> to be called by parent

	// 	let ids = this.getIds();
	// 	let index = 0;

	// 	while (ids[index] === this.constructor.exit || this.isFolder(ids[index])) index++;

	// 	ids = [...ids];
	// 	ids.splice(index, 0, ...tokens);

	// 	this.setIds(ids);

	// }

	getFileIndex() {

		// const ids = this.parent.getIds();
		// let index = 0;

		// while (this.isFolder(ids[index])) index++;

		// return index;

		// const ids = this.getIds();
		// let index = 0;
		// let itemIndex = 0;

		// while (itemIndex < ids.length && this.isFolder(ids[itemIndex])) {

		// 	itemIndex++;

		// 	if (!this.isExit(ids[index])) {

		// 		index++;

		// 	}

		// }

		// return index;

		const ids = this.getIds();
		let index = 0;

		while (index < ids.length && this.isFolder({ id: ids[index] })) {

			index++;

		}

		return index;

	}

	getFolderIndex() {

		return 0;

		// const ids = this.parent.getIds();
		// let index = 0;

		// while (this.isExit(ids[index])) index++;

		// return index;

	}

	// deleteAt(index, length = 1) {

	// 	const ids = this.getIds();

	// 	// for (let i = 0; i < length; i++) {

	// 	// 	this.setValue(["1"], "trash", ids[i + index]);

	// 	// }

	// 	const remainingIds = [...ids];
	// 	const deletedIds = remainingIds.slice(index, index + length);

	// 	this.setIds(remainingIds);

	// 	this.parent.deleteIds(deletedIds);

	// 	// KarmaFieldsAlpha.server.setState(ids, this.uid, "ids");



	// 	// const ids = [...this.getIds()];

	// 	// const removedIds = ids.slice(index, length).filter(id => id !== this.constructor.exit);

	// 	// if (removedIds.length) {

	// 	// 	this.parent.deleteIds(removedIds);



	// 	// }

	// }

	// upload(files) {

	// 	const index = this.getNewFileIndex();

	// 	this.uploadAt(index, files);

	// }

	// uploadAt(index, files) {

	// 	index = this.mapIndex(index);

	// 	this.parent.uploadAt(index, files);

	// }

	// setContentAt(content, index, key) {

	// 	// if (index !== "exit") {

	// 	//   return super.setContentAt(content, index, key);

	// 	// }

	// 	return this.setValueAt(content.toArray(), index, key);

	// }


	// select(index = 0, length = 0) { // to be overrided (ie. Medias grid)

	// 	for (let socket of this.genSockets()) {

	// 		if (socket.id === index) {

	// 			this.setSelection({ index: socket.index, length });
	// 			break;

	// 		}

	// 	}

	// }

  // querySelection() {

  //   const selection = this.getSelection();

  //   if (selection) {

  //     const index = selection.index || 0;
  //     const length = selection.length || 0;

  //     const socketsQuery = this.getSockets();

  //     const sockets = socketsQuery.slice(index, index+length).filter(socket => socket.id !== "exit");

  //     if (sockets.length) {

  //       return {index: sockets[0].id, length: sockets.length};

  //     }

  //   }

  //   return {index: 0, length: 0};

  // }

  // getSockets() {

  //   return [...this.genSockets()];

  // }

	// *genSockets() {


	//   const length = this.parent.getLength();
	//   const parentQuery = this.getContent("parent");

	//   if (parentQuery.loading) {

	//     return;

	//   }

	//   const parent = parentQuery.toString() || "0";
	//   let index = 0;

	//   if (parent.toString() !== "0") {

	//     yield {
	//       index: index++,
	//       id: "exit",
	//       filetype: "folder"
	//     };

	//   }

	//   for (let i = 0; i < length; i++) {

	//     // const itemParent = this.getContentAt(i, "parent").toString() || "0";
	//     const filetype = this.getContentAt(i, "filetype");
	//     // const id = this.getContentAt(i, "id").toString();

	//     // if (itemParent === parent) {

	//       yield {
	//         id: i,
	//         index: index++,
	//         filetype: filetype.toString()
	//       };

	//     // }

	//   }

	// }



	// listDropZones() {

	// 	// yield* this.listItems().filter((item, i) => {
	// 	// 	const filetype = this.getValueAt(i, "filetype");
	// 	// 	return filetype && (filetype[0] === "folder" || filetype[0] === "autofolder");
	// 	// });

	// 	// yield* this.listItems()
	// 	// 	.map((item, i) => this.getValueAt(i, "filetype") || [])
	// 	// 	.filter(filetype => filetype[0] === "folder" || filetype[0] ===  "autofolder");

	// 	return this.listSockets().filter(socket => this.isFolder(socket.index)).map(socket => socket.index);

	// 	// for (let i = 0; i < this.getLength(); i++) {

	// 	// 	const filetype = this.getValueAt(i, "filetype");

	// 	// 	if (filetype && (filetype[0] === "folder" || filetype[0] ===  "autofolder")) {

	// 	// 		yield i;

	// 	// 	}

	// 	// }

	// }

	// selectSockets(index, length) {

	// 	const sockets = [...this.getSocketIndexes()];

	// 	this.setSelection({ index: sockets[index], length });

	// }

	// getSelectedSockets() {

	// 	const selection = this.getSelection();

	// 	// return {index: }


	// }

	// getIndexAt(socket) {

	// 	return [...this.getSocketIndexes()][socket];

	// }



  // queryItems() {
  //
  //
  //   const query = super.queryItems();
  //   const parent = this.parent.getContent("parent").toString() || "0";
  //
  //   if (!query.loading) {
  //
  //     query.value = query.toArray().map(item => {
  //
  //       const parent = this.getContent(item.index, "parent").toString() || "0";
  //       const filetype = this.getContent(item.index, "filetype").toString();
  //       let order;
  //
  //       if (item.uploading) {
  //
  //         order = 3;
  //
  //       } else if (item.adding) {
  //
  //         order = 1;
  //
  //       } else if (filetype === "folder") {
  //
  //         order = 2;
  //
  //       } else if (filetype === "file") {
  //
  //         order = 4;
  //
  //       } else {
  //
  //         order = 2;
  //
  //       }
  //
  //       return {...item, parent, filetype, order};
  //     });
  //
  //     query.value = query.toArray().filter(item => item.parent === parent);
  //
  //     query.value.sort((a, b) => a.order - b.order);
  //
  //     if (!this.isRoot()) {
  //
  //       const grandParent = this.queryUpperFolderId();
  //
  //       query.value = [
  //         {
  //           index: "exit",
  //           id: grandParent.toString() || "0",
  //           order: 0
  //         },
  //         ...query.toArray()
  //       ];
  //
  //     }
  //
  //   }
  //
  //   return query;
  //
  // }

  // getLength() {

  //   return this.getSockets().length;

  // }

	// getNewItemIndex() {

	// 	let index = 0;

	// 	for (let item of this.listItems()) {

	// 		if (item !== "root") {

	// 			return index;

	// 		}

	// 		index++;

	// 	}

	// 	return index;

	// }

	// getNewFileIndex() {

	// 	let index = 0;

	// 	for (let item of this.listItems()) {

	// 		const filetype = this.getValueAt(index, "filetype") || [];

	// 		if (filetype[0] === "file") {

	// 			return index;

	// 		}

	// 		index++;

	// 	}

	// 	return index;

	// }

  // async openFolder(socket) {

  //   if (socket.filetype === "folder" || socket.filetype === "autofolder") {

  //     if (socket.id === "exit") {

  //       await this.save(`open`, "Upper Directory");

  //       const parent = this.getContent("parent");

  //       let id = this.getParent(parent.toString());

  //       while (id.loading) {

  //         await this.render();
  //         id = this.getParent(parent.toString());

  //       }

  //       await this.setValue(id.toString() || "0", "parent");

  //       await this.removeSelection();


  //     } else {

  //       await this.save(`open`, "Open Directory");

  //       const id = this.getContentAt(socket.id, "id");

  //       await this.setValue(id.toString() || "0", "parent");

  //       await this.removeSelection();

  //     }

  //   }

  // }

	getFileType(socket) {

		if (socket.exit) {

			return "folder";

		}

		const filetype = this.getValue("filetype", socket.id);

		if (filetype === undefined) {

			return;

		}

		return filetype[0];

	}

	isFolder(socket) {

		// const filetype = this.getValue("filetype", socket.id) || [];

		// return filetype[0] === "folder" || filetype[0] === "autofolder";


		const filetype = this.getFileType(socket);

		return filetype === "folder" || filetype === "autofolder";

	}

	isAutoFolder(id) {

		// const filetype = this.getValue("filetype", id) || [];

		const filetype = this.getFileType(socket);

		return filetype[0] === "autofolder";

	}

	isDroppable(socket) {

		if (socket.exit) {

			return false;

		}

		const filetype = this.getFileType(socket);

		return filetype !== "autofolder"

	}

	openFolder(socket) {

		const filetype = this.getFileType(socket);

		if (filetype === undefined) {

			console.error("opening folder but filetype is not set");
			return;

		}

		if (filetype === "folder" || filetype === "autofolder") {

			const parentKey = this.getParentKey();
			let id;

			if (socket.exit) {

				const parentId = this.getParam(parentKey);

				if (!parentId || parentId === "0") {

					console.error("opening parent but folder is root");

				}

				id = this.getParent(parentId);

				if (id === undefined) {

					console.error("opening parent folder but grand-parent is undefined");
					return;

				}

			} else {

				id = socket.id;

			}

			this.setParam(id || "0", parentKey);
			this.removeSelection();

		}

	}

	openFolderAt(index) {

		const sockets = this.getSockets();
		const socket = sockets[index];

		if (socket) {

			this.openFolder(socket);

		}

	}

	getParent(id) {

		const parentKey = this.getParentKey();

		// const parentId = KarmaFieldsAlpha.server.getValue(driver, id, parentKey);
		const parentId = this.getValue(parentKey, id);

		if (parentId !== undefined) {

			return parentId[0] || "0";

		}

	}

	// hasGrandParent() {

	// 	const parentKey = this.getParentKey();
	// 	const parentId = this.getParam(parentKey);

	// 	if (!parentId || parentId === "0") {

	// 		return false

	// 	}

	// 	return true;

	// }

	// getGrandParent() {

	// 	const parentKey = this.getParentKey();
	// 	const parentId = this.getParam(parentKey);

	// 	if (!parentId || parentId === "0") {

	// 		console.error("getting grand-parent but there is no grand-parent!");

	// 	}

	// 	return this.getParent(parentId);

	// }


  // async move(sockets, targetSocket) {

  //   if (targetSocket.filetype === "folder" || targetSocket.filetype === "autofolder") {

  //     await this.removeSelection();

  //     if (targetSocket.id === "exit") {

  //       await this.save("move", "Move upper");

  //       const id = this.getContent("parent");

  //       let parent = this.getParent(id.toString());

  //       while (parent.loading) {

  //         await this.render();
  //         parent = this.getParent(id.toString());

  //       }

  //       await this.parent.move(sockets[0].id, sockets.length, parent.toString());

  //     } else {

  //       await this.save("move", "Move to Folder");

  //       const id = this.getContentAt(targetSocket.id, "id");

  //       // destId = id;

  //       await this.parent.move(sockets[0].id, sockets.length, id.toString());

  //     }

  //   }


  // }

	// move(index, target) {

	// 	const targetFiletype = this.getValueAt(target, "filetype");
	// 	const parentKey = this.getParentKey();

	// 	if (targetFiletype === undefined) {

	// 		console.error("moving item in target folder but folder filetype is undefined");

	// 	}

	// 	const targetId = this.mapIndex(target);

	// 	if (targetId === "exit") {

	// 		// this.save("move", "Move upper");
	// 		this.removeSelection();

	// 		const parentId = this.getParam(parentKey);

	// 		if (!parentId || parentId === "0") {

	// 			console.error("moving upper but folder is root");

	// 		}

	// 		let grandParentId = this.getParent(parentId);

	// 		if (grandParentId === undefined) {

	// 			console.error("moving upper but upper folder parent is undefined");

	// 		}

	// 		this.parent.move(index, length, { [parentKey]: grandParentId[0] || "0" });

	// 	} else if (targetFiletype[0] === "folder" || targetFiletype[0] === "autofolder") {

	// 		// this.save("move", "Move to Folder");
	// 		this.removeSelection();

	// 		const id = this.getValueAt(target, "id");

	// 		if (id === undefined) {

	// 			console.error("moving to folder but folder id is undefined");

	// 		}

	// 		this.parent.move(index, length, { [parentKey]: id[0] });

	// 	}

	// }

	moveAt(index, length, target) {

		const ids = this.getIdsAt(index, length);

		const [targetId] = this.getIdsAt(target, 1);

		this.move(ids, targetId);

	}

	move(sockets, targetSocket) {

		const parentKey = this.getParentKey();

		let targetId;

		if (targetSocket.exit) {

			const parentId = this.getParam(parentKey);

			if (!parentId || parentId === "0") {

				console.error("moving upper but folder is root");

			}

			targetId = this.getParent(parentId);

			if (targetId === undefined) {

				console.error("moving upper but upper folder parent is undefined");

			}

		} else {

			targetId = targetSocket.id;

		}

		const targetIsFolder = this.isFolder(targetSocket);

		if (targetIsFolder === undefined) {

			console.error("moving item in target folder but folder filetype is undefined");

		}

		if (targetIsFolder) {

			this.removeSelection();

			const ids = sockets.filter(socket => !socket.exit).map(socket => socket.id);

			for (let id of ids) {

				this.setValue(targetId, parentKey, id);

			}

			let remainingIds = this.getIds();

			if (remainingIds === undefined) {

				console.error("moving socket but ids are undefined");

			}

			remainingIds = remainingIds.filter(id => !ids.includes(id));

			this.setIds(remainingIds);

		}

	}


  // *upload(files, index) {
  //
  //   if (!this.parent.shuttle) {
  //
  //     return;
  //
  //   }
  //
  //   let defaults = this.parent.getDefaultParams();
  //
  //   while (defaults.loading) {
  //
  //     yield;
  //     defaults = this.parent.getDefaultParams();
  //   }
  //
  //   let filters = this.parent.getFilters();
  //
  //   while (filters.loading) { // should never happens since this.params is loaded now !
  //
  //     yield;
  //     filters = this.parent.getFilters();
  //   }
  //
  //   const params = {...filters.toObject(), ...defaults.toObject()};
  //
  //   if (index === undefined) {
  //
  //     index = this.getNewItemIndex();
  //
  //   }
  //
  //   this.save("insert", "Insert");
  //
  //   // set.add(params, index, length);
  //   const tokens = this.parent.shuttle.add(params, index, length);
  //
  //   yield* body.create(index, length);
  //
  //   this.select(index, length);
  //
  //   // const work = this.shuttle.loadTokens(tokens, params);
  //   //
  //   // KarmaFieldsAlpha.Jobs.add(work);
  //
  // }



  // getUploadIndex() {
  //
  //   return this.parent.getLength().toNumber();
  //
  // }
  //
  // upload(files) {
  //
  //   const index = this.getUploadIndex();
  //
  //   this.save("upload", "Upload");
  //
  //   this.uploadAt(files, index);
  //
  //
  //   const uploadedIndex = this.queryItems().toArray().findLastIndex(item => item.uploading);
  //
  //   if (uploadedIndex > -1) {
  //
  //     this.setSelection({index: uploadedIndex, length: 1});
  //
  //   }
  //
  //
  //   this.request("render");
  //
  // }
  //
  // uploadAt(files, index) { // index is relative to collection !
  //
  //   const collection = this.getCollection();
  //   const defaults = this.parse(this.resource.defaults || {});
  //   const filters = this.getFilters();
  //
  //
  //
  //   if (defaults.loading || filters.loading) {
  //
  //     console.warn("procrastinating uploadAt");
  //
  //     this.procrastinate("uploadAt", files, index);
  //
  //   } else {
  //
  //     const params = {...filters.toObject(), ...defaults.toObject()};
  //
  //     collection.upload(files, params, index);
  //
  //     let query = this.queryItems();
  //
  //     let items = query.toArray().filter(item => item.index >= index && item.index < index + files.length);
  //
  //     for (let item of items) {
  //
  //       const field = this.createChild({
  //         type: "row",
  //         children: this.resource.children,
  //       }, item.index);
  //
  //       field.create();
  //
  //       if (this.resource.modal) {
  //
  //         const field = this.createChild({
  //           type: "row",
  //           children: this.resource.modal.children,
  //         }, item.index);
  //
  //         field.create();
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }



  // remove(collectionIndex, length = 1) {
  //
  //   if (collectionIndex !== "exit") {
  //
  //     super.remove(collectionIndex, length);
  //
  //   }
  //
  // }


  // changeFile(file, id) {
  //
  //   this.upload([file], {id: id});
  //
  // }
  //
  // regen() {
  //
  //   const ids = this.getSelectedItems().filter(item => !item.exit).map(item => item.id).filter(id => id);
  //   const driver = this.getDriver();
  //
  //   if (ids.length) {
  //
  //     KarmaFieldsAlpha.Query.regen(driver, ids);
  //
  //   }
  //
  //   this.render();
  // }
  //
  // async uploadFromUrl(url) {
  //
  //   // url = "https://upload.wikimedia.org/wikipedia/commons/6/65/Schwalbenschwanz-Duell_Winterthur_Schweiz.jpg";
  //   const response = await fetch(url);
  //   const blob = await response.blob();
  //   const filename = url.split('/').pop();
  //
  //   // const file = new File([blob], filename, {type: "image/jpg"});
  //   const file = new File([blob], filename);
  //   // const [fileId] = await this.upload([file]);
  //   this.upload(file);
  //
  // }




  // isFolderAt(index) {
  //
  //   const query = this.getContentAt(index, "filetype");
  //
  //   return (query.toString() === "folder" || query.toString() === "exit");
  //
  // }

	*buildThumbnails() {

		// const selection = this.getSelection();
		// const hasFocus = this.hasFocus();
		// const sockets = this.genSockets();

		const sockets = this.getSockets();

		if (sockets === undefined) {

			return;

		}

		for (let i = 0; i < sockets.length; i++) {

			const socket = sockets[i];

			// const row = this.createChild({
			// 	type: "socket",
			// 	socket
			// }, i);

			const row = new KarmaFieldsAlpha.field.gallery.socket({ socket }, i, this);
			// 	this.createChild({
			// 	type: "socket",
			// 	socket
			// }, i);

			const media = row.createChild({
				type: "media",
				display: "thumb",
				// loading: typeof id === "object",
				// exit: socket.queryId === "exit"
				exit: socket.exit
			}, "media");

			yield {
				tag: "li",
				class: "frame",
				update: element => {

					const hasFocus = this.hasFocus() || this.hasFocusInside();

					element.classList.remove("drop-active");
					element.classList.toggle("selected", hasFocus && this.isSocketSelectedAt(i));
					element.classList.toggle("media-dropzone", this.isFolder(socket));
					element.classList.toggle("droppable", this.isDroppable(socket));

					element.ondblclick = event => {

						if (this.isFolder(socket)) {
							this.save("open-folder");
							this.openFolder(socket);
							this.render();
						} else { // -> edit image in files field
							this.save("edit-file");
							this.setSocketSelection({ index: i, length: 1 });
							this.request("edit", [socket.id]);
							this.render();
						}
					}
				},
				children: media.build()
			};

		}

	}

	*buildMain() {

		yield {
			class: "media-table-container",
			init: element => {
				element.ondrop = async event => {
					event.preventDefault();
					const files = event.dataTransfer.files;
					if (files.length) {
						this.request("upload", files);
						this.render();
					}
					element.classList.remove("drop-active");
				}

				element.ondragover = event => {
					event.preventDefault();
					element.classList.add("drop-active");
				}
				element.ondragleave = event => {
					event.preventDefault();
					element.classList.remove("drop-active");
				}
				if (this.parent.id === "popup") {
					element.classList.add("scroll-container");
				}
			},
			child: {
				class: "media-table",
				tag: "ul",
				init: element => {
					if (this.resource.style) {
						element.style = this.resource.style;
					}
				},
				update: element => {

					const hasFocus = this.hasFocus();
					const selection = hasFocus && this.getSocketSelection();

					const sockets = this.getSockets();

					if (sockets !== undefined) {

						if (this.resource.draganddrop) {

							const dropZones = sockets.map((socket, index) => index).filter(index => this.isFolder(sockets[index]));
							const selector = new KarmaFieldsAlpha.Handler.DragAndDrop(element, selection, dropZones);

							selector.onSelect = elements => {
								elements.map(element => element.classList.add("selected"));
								this.setSocketSelection(selector.state.selection);
							}

							selector.onUnselect = elements => {
								elements.map(element => element.classList.remove("selected"));
							}

							selector.onSelectionComplete = () => {

								this.setFocus(true);
								this.render();

							}

							selector.onDragOver = element => {
								element.classList.add("drop-active");
							};

							selector.onDragOut = element => {
								element.classList.remove("drop-active");
							};

							selector.onDraggedOver = element => {
								element.classList.add("drop-active");
							};

							selector.onDraggedOut = element => {
								element.classList.remove("drop-active");
							};

							selector.ondrop = (index, selection) => {
								const slice = sockets.slice(selector.state.selection.index, selector.state.selection.index + selector.state.selection.length);
								const target = sockets[index];

								// if (slice.every(id => !this.isExit(id) && !this.isAutoFolder(id))) {
								// 	this.move(slice, target);
								// }
								this.move(slice, target);

								this.setFocus(true);
								this.render();
							};

							selector.onCancelDrag = () => {
								this.setFocus(true);
								this.render();
							}

						} else if (this.resource.sortable) {

							const sorter = new KarmaFieldsAlpha.ListSorterInline(element, selection);

							sorter.onSelect = elements => {
								elements.map(element => element.classList.add("selected"));
								this.setSocketSelection(sorter.state.selection);
							}

							sorter.onUnselect = elements => {
								elements.map(element => element.classList.remove("selected"));
							}

							sorter.onSelectionComplete = () => {
								this.setFocus(true);
								 this.render();
							}

							sorter.onSwap = (newState, lastState) => {
								this.save("reorder");
								this.swapAt(lastState.selection.index, newState.selection.index, newState.selection.length);
								this.setSocketSelection(newState.selection);
							};

							sorter.onSort = (newSelection, lastSelection) => {
								if (!KarmaFieldsAlpha.Collection.equal(newSelection, lastSelection)) {
									this.setFocus(true);
									this.render();
								}
							}

						}

					}






					// grid.element.classList.toggle("has-selection", Boolean(this.hasFocus()));

					// grid.children = items.map((item, index) => {
					//   return {
					//     tag: "li",
					//     class: "frame",
					//     update: li => {
					//
					//       li.element.classList.remove("drop-active");
					//       li.element.classList.toggle("selected", KarmaFieldsAlpha.Segment.contain(selection, index));
					//       li.element.classList.toggle("media-dropzone", Boolean(item.exit || this.isFolderAt(index)));
					//
					//       li.element.ondblclick = event => {
					//         const query = this.getContent(item.index, "filetype");
					//         if (query.toString() === "folder" || query.toString() === "exit") {
					//           this.openFolder(item.index);
					//         }
					//       }
					//
					//       const row = this.createChild({
					//         type: "row",
					//       }, item.index);
					//
					//       const media = row.createChild({
					//         type: "media",
					//         // id: item.id,
					//         // driver: this.getDriver(),
					//         display: "thumb",
					//         exit: item.index === "exit",
					//         loading: item.loading,
					//         uploading: item.uploading
					//       }, item.index);
					//
					//       li.child = media.build();
					//
					//     }
					//
					//   };
					// });

					// }

					// const selection = this.getSelection();
					// const hasFocus = this.hasFocus();
					//
					// for (let socket of this.genSockets()) {

					// grid.children = [...this.buildThumbnails()];

				},
				children: this.buildThumbnails()
			}
		};

	}

	*buildContent() {

		yield* this.buildMain();

	}

}

KarmaFieldsAlpha.field.grid.gallery.socket = class extends KarmaFieldsAlpha.field.grid.row {

	getValue(key) {

		return this.parent.getSocketValue(key, this.resource.socket);

	}

	setValue(value, key) {

		this.parent.setSocketValue(value, key, this.resource.socket);

	}

	delete() {

		return this.parent.deleteSocket(this.resource.socket);

	}

}

KarmaFieldsAlpha.field.gallery.modal = class extends KarmaFieldsAlpha.field.grid.modal {

	getValue(key) {

		const sockets = this.parent.getSelectedSockets();

		if (sockets === undefined) {

			return;

		}

		if (sockets.length) {

			return this.parent.getSocketValue(key, sockets[0]);

		} else {

			console.warn("getting value but nothing is selected");

			return [];

		}

	}

	setValue(value, key) {

		const sockets = this.parent.getSelectedSockets();

		if (sockets === undefined) {

			return;

		}

		for (let socket of sockets) {

			this.parent.setSocketValue(value, key, socket);

		}

	}

	delete() {

		const sockets = this.parent.getSelectedSockets();

		if (sockets === undefined) {

			return;

		}

		for (let socket of sockets) {

			this.parent.deleteSocket(this.resource.socket);

		}

	}

}

// KarmaFieldsAlpha.field.grid.row = class extends KarmaFieldsAlpha.field.group {

// 	getValue(key) {

// 		return this.parent.getValueAt(key, this.resource.index);

// 	}

// 	setValue(value, key) {

// 		this.parent.setValueAt(value, key, this.resource.index);

// 	}

// 	getIndex() {

// 		return this.parent.getIndex() + this.resource.index;

// 	}

// 	delete() {

// 		return this.parent.deleteAt(this.resource.index);

// 	}

// }


// KarmaFieldsAlpha.field.saucer.table.footer = class extends KarmaFieldsAlpha.field.group {
//
//   constructor(resource) {
//
//     super({
//       display: "flex",
//       children: [
//         // "reload",
//         // "save",
//         // "add",
//         // "delete",
//         // "separator",
//         // "insert",
//         // "undo",
//         // "redo"
//         "save",
//         "upload",
//         "createFolder",
//         "delete",
//         "separator",
//         "undo",
//         "redo",
//         "insert"
//       ],
//       ...resource
//     });
//
//   }
//
// }




KarmaFieldsAlpha.field.gallery.description = class extends KarmaFieldsAlpha.field {

	*build() {

		const image = new KarmaFieldsAlpha.field.media({
			type: "media",
			width: "100%",
			height: "15em",
			caption: false,
			display: "medium", // = default
			...this.resource.media }, 0, this);

		const description = new KarmaFieldsAlpha.field.gallery.description.imageDescription({
			children: [
				"fileDescription",
				"sizeDescription",
				"resolutionDescription",
				"dateDescription",
				"multipleDescription"
			],
			...this.resource.image
		}, 1, this);

		yield {
			class: "karma-field karma-field-container media-description",
			children: [
				{
					children: image.build()
				},
				{
					children: description.build()
				}
			]
			// children: [
			// 	...this.createChild({
			// 		type: "media",
			// 		width: "100%",
			// 		height: "15em",
			// 		// loading: loading,
			// 		// uploading: uploading,
			// 		// token: token, // not implemented
			// 		// mixed: mixed,
			// 		// exit: exit,
			// 		// id: id,
			// 		caption: false,
			// 		display: "medium" // = default
			// 	}, "media").build(),
			// 	// ...this.createChild("imageDescription").build()
			// ]
		};
	}
}

KarmaFieldsAlpha.field.gallery.description.imageDescription = class extends KarmaFieldsAlpha.field.group {

  // constructor(resource, id, parent) {

  //   super({
  //     children: [
  //       "fileDescription",
  //       "sizeDescription",
  //       "resolutionDescription",
  //       "dateDescription",
  //       "multipleDescription"
  //     ],
  //     ...resource
  //   }, id, parent);

  // }

}

KarmaFieldsAlpha.field.gallery.description.fileType = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["getValue", "filetype"],
      ...resource
    }, id, parent);
  }
}


KarmaFieldsAlpha.field.gallery.description.mimeType = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["getValue", "mimetype"],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.dateDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["date", ["getValue", "upload-date"], {year: "numeric", month: "long", day: "2-digit"}],
      hidden: ["||", ["isMixed", ["getValue", "upload-date"]], ["!", ["getValue", "upload-date"]], ["=", ["getValue", "filetype"], "folder"]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.sizeDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["?", [">", ["getValue", "size"], 1000], ["replace", "% KB", "%", ["math", "floor", ["/", ["getValue", "size"], 1000]]], ["replace", "% B", "%", ["getValue", "size"]]],
      hidden: ["||", ["isMixed", ["getValue", "size"]], ["!", ["getValue", "size"]], ["=", ["getValue", "filetype"], "folder"]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.resolutionDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["replace", "% x % pixels", "%", ["getValue", "width"], ["getValue", "height"]],
      visible: ["&&", ["like", ["getValue", "mimetype"], "^image/.*$"], ["!", ["isMixed", ["getValue", "width"]]], ["!", ["isMixed", ["getValue", "height"]]]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.fileDescription = class extends KarmaFieldsAlpha.field.link {
  constructor(resource, id, parent) {
    super({
      style: "word-break: break-word",
      content: ["getValue", "filename"],
      href: ["replace", `${KarmaFieldsAlpha.uploadURL}#/#`, "#", ["getValue", "dir"], ["getValue", "filename"]],
      target: "_blank",
      // hidden: ["||", ["=", ["getIds"], "0"], ["isMixed", ["getValue", "filename"]], ["!", ["getValue", "filename"]]],
      hidden: ["||", ["isMixed", ["getValue", "filename"]], ["!", ["getValue", "filename"]]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.multipleDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: "[Mixed files]",
      visible: ["isMixed", ["getValue", "filename"]],
      ...resource
    }, id, parent);
  }
}
KarmaFieldsAlpha.field.gallery.description.folderName = class extends KarmaFieldsAlpha.field.input {
  constructor(resource, id, parent) {
    super({
      type: "input",
      label: "Folder name",
      key: "name",
      visible: ["&&", ["!", ["getValue", "mimetype"]], ["!", ["isMixed", ["getValue", "mimetype"]]]],
      ...resource
    }, id, parent);
  }
}
