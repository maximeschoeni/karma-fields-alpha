KarmaFieldsAlpha.field.group = class extends KarmaFieldsAlpha.field.container {

	request(subject, content, ...path) {

		const key = this.getKey();

		if (key) {

			// path = [key, ...path];

			switch (subject) {

				case "get": {
					// const response = await this.parent.request("get", {}, key);
					// const value = KarmaFieldsAlpha.Type.toObject(response);
					// return KarmaFieldsAlpha.DeepObject.get(value, ...path);

          const values = this.parent.request("get", {}, key);

          if (values) {

					  return KarmaFieldsAlpha.Type.toArray(KarmaFieldsAlpha.DeepObject.get(values[0], ...path));

          }
          
				}

				// case "state": {
				// 	const state = await this.parent.request("state", {}, key);
				// 	const value = KarmaFieldsAlpha.Type.toObject(state.value);
				// 	return {
				// 		...state,
				// 		value: KarmaFieldsAlpha.DeepObject.get(value, ...path)
				// 	};
				// }

				case "set": {
					const values = this.parent.request("get", {}, key);

          if (values) {

            const value = KarmaFieldsAlpha.Type.toObject(values[0]);
            const clone = KarmaFieldsAlpha.DeepObject.clone(value);
            KarmaFieldsAlpha.DeepObject.assign(clone, content, ...path);
            this.parent.request("set", clone, key);
            
          }
					// const value = KarmaFieldsAlpha.Type.toObject(response);
					// const clone = KarmaFieldsAlpha.DeepObject.clone(value);
					// KarmaFieldsAlpha.DeepObject.assign(clone, content.data, ...path);
					// await this.parent.request("set", {data: clone}, key);
					break;
				}

				// case "fetch": {
				// 	return this.parent.request(subject, content, key, ...path); // for transfer record value
				// }


				default:
					return this.parent.request(subject, content, key);

			}

		} else {

			return this.parent.request(subject, content, ...path);

		}

	}

	// getKeys() {

	// 	const key = this.getKey();

	// 	if (key) {

	// 		return new Set([key]);

	// 	} else {

	// 		return super.getKeys();

	// 	}

	// }

	getDefault() {

		const defaults = super.getDefault();
		const key = this.getKey();

		if (key) {

			return {[key]: defaults};

		}

		return defaults;
	}

	export() {

		const key = this.getKey();

		if (key) {

			const object = {};
			const values = this.parent.request("get", {}, key);

      if (values) {

        // const value = KarmaFieldsAlpha.Type.toObject(response);
        // object[key] = JSON.stringify(value || {});

        object[key] = KarmaFieldsAlpha.Type.toObject(response);

      }
			

			return object;

		} else {

			return super.export(keys);

		}

	}

	import(object) {

		const key = this.getKey();

		if (key) {

			if (object[key] !== undefined) {

				// const value = JSON.parse(object[key] || "{}");

				this.parent.request("set", object[key], key);

			}

		} else {

			super.import(object);

		}

	}

}

KarmaFieldsAlpha.field.foldableGroup = class extends KarmaFieldsAlpha.field.group {

	buildChildren() {

		return [
			{
				class: "foldable",
				init: foldable => {
					let open = false;
					foldable.children = [
						{
							tag: "label",
							children: [
								{
									tag: "span",
									update: span => {
										if (open) {
											span.element.className = "dashicons dashicons-arrow-down";
										} else {
											span.element.className = "dashicons dashicons-arrow-right";
										}
									}
								},
								{
									tag: "span",
									init: span => {
										span.element.htmlFor = field.getId();
										span.element.textContent = field.resource.label || "";
									}
								}
							],
							init: label => {
								label.element.style.display = "flex";
								label.element.style.alignItems = "center";
								label.element.onclick = event => {
									const content = label.element.nextElementSibling;
									content.style.height = content.children[0].clientHeight.toFixed()+"px";
									if (open) {
										requestAnimationFrame(() => {
											content.style.height = "0";
										});
										open = false;
									} else {
										open = true;
									}
									label.render();
								};
							}
						},
						{
							class: "group-fold-content",
							init: content => {
								content.element.style.overflow = "hidden";
								content.element.style.height = "0";
								content.element.style.transition = "height 200ms";
								content.element.style.display = "flex";
								content.element.style.alignItems = "flex-end";
								content.element.ontransitionend = () => {
									content.element.style.height = open ? "auto" : "0";
								};
							},
							child: field.build()
						}
					];
				}
			}
		];

	}

}
