
KarmaFieldsAlpha.field.selectable = class extends KarmaFieldsAlpha.field {

	pointerStart(index, tracker) {

		const selection = this.getSelection();
		const tie = tracker.startSelect(selection.index, selection.length);

		this.setSelection(tie);

		// if (index > -1 && selection && selection.length) {

		// 	// ->drag/sort

		// }

		// if (index > -1) {

		// 	let tie = { index, length: 1 };

		// 	if (selection && selection.length && tracker.event.shiftKey) {

		// 		tie = this.mergeSelection(tie, selection);

		// 	}

		// 	this.setData(tie, "tie");
		// 	this.setSelection(tie);


		// } else {

		// 	this.unselect();

		// }

		this.render();

	}

	pointerMove(tracker) {

		const selection = this.getSelection();

		const newSelection = tracker.growSelect(selection.index, selection.length);

		if (!selection || newSelection.index !== selection.index || newSelection.length !== selection.length) {

			this.setSelection(newSelection);
			this.render();

		}



	// }

	// growSelection(index) {

		// const tie = this.getData("tie");

		// if (index > -1 && tie) {

		// 	const selection = this.getSelection();

		// 	let newSelection = this.mergeSelection({ index, length: 1}, tie);

		// 	if (!selection || !this.compareSelection(newSelection, selection)) {

		// 		this.setSelection(newSelection);
		// 		this.render();

		// 	}

		// }

	}

	pointerEnd(index, tracker) {

		this.setData(null, "tie");
		this.render();

	}


	mergeSelection(s1, s2) {

		const index = Math.min(s1.index, s2.index);
		const length = Math.max(s1.index + s1.length, s2.index + s2.length);

		return { index, length };

	}

	compareSelection(s1, s2) {

		return s1.index === s2.index && s1.length === s2.length;

	}

	insideSelection(selection, index) {

		return index >= selection.index && index < selection.index + selection.length;

	}

};
