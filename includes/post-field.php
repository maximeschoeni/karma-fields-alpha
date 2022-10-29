<div id="karma-fields-post-<?php echo $post_id; ?>-field-<?php echo $index; ?>-container" class="karma-fields karma-fields-post"></div>
<input type="hidden" name="karma-fields-items[]" id="karma-fields-post-<?php echo $post_id; ?>-input-<?php echo $index; ?>">

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
 ?>
<script>
	// document.addEventListener("DOMContentLoaded", function() {
	document.addEventListener("karmaFieldsAlpha", function() {


		let container = document.getElementById("karma-fields-post-<?php echo $post_id; ?>-field-<?php echo $index; ?>-container");
		let input = document.getElementById("karma-fields-post-<?php echo $post_id; ?>-input-<?php echo $index; ?>");


		let resource = <?php echo json_encode($args); ?>;
		let id = "<?php echo $post_id; ?>";



		// const form = new KarmaFieldsAlpha.field.form({
		// 	driver: "posts",
		// 	joins: ["postmeta", "taxonomy"],
		// 	children: [
		// 		{
		// 			type: "group",
		// 			key: id,
		// 			children: [resource]
		// 		}
		// 	]
		// });
		//
		// form.buffer.getObject = function() {
		// 	return {data: JSON.parse(input.value || "{}")};
		// };
		// form.buffer.setObject = function(delta) {
		// 	input.value = JSON.stringify(delta.data);
		// }
		// form.parent = {
		// 	request: (subject, object, ...path) => {
		// 		switch (subject) {
		// 			case "render":
		// 			case "edit":
		// 				await this.render();
		// 				break;
		// 		}
		// 	}
		// }

		// class MetaFieldForm extends KarmaFieldsAlpha.field.form {
		//
		// 	constructor() {
		// 		super({
		// 			driver: "posts",
		// 			joins: ["postmeta", "taxonomy"],
		// 			params: {
		// 				ids: id
		// 			},
		// 			children: [resource]
		// 		});
		//
		// 		this.buffer.getObject = function() {
		// 			return {
		// 				data: {
		// 					posts: {
		// 						[id]: JSON.parse(input.value || "{}")
		// 					}
		// 				}
		// 			};
		// 		};
		//
		// 		this.buffer.setObject = function(delta) {
		// 			input.value = JSON.stringify(delta.data.posts[id]);
		// 		}
		//
		// 	}
		//
		// 	async request(subject, object, ...path) {
		//
		// 		switch (subject) {
		//
		// 			case "render":
		// 			case "edit":
		// 				await this.render();
		// 				break;
		//
		// 			default:
		// 				return super.request(subject, object, id, ...path);
		// 		}
		//
		// 	}
		//
		// 	build() {
		// 		return {
		// 			init: async div => {
		// 				this.render = div.render;
		// 				await this.query(this.resource.params);
		// 			},
		// 			child: super.build()
		// 		}
		// 	}
		//
		// }

		class MetaField extends KarmaFieldsAlpha.field {

			static form = class extends KarmaFieldsAlpha.field.form {

				constructor() {
					super({
						driver: "posts",
						joins: ["postmeta", "taxonomy"],
						params: {
							ids: id
						},
						children: [resource]
					});

					this.buffer.getObject = function() {
						return {
							data: {
								posts: {
									[id]: JSON.parse(input.value || "{}")
								}
							}
						};
					};

					this.buffer.setObject = function(delta) {
						input.value = JSON.stringify(delta.data.posts[id]);
					}

				}

				async request(subject, object, ...path) {

					// switch (subject) {
					//
					// 	case "render":
					// 	case "edit":
					// 		await this.render();
					// 		break;
					//
					// 	default:
					// 		return super.request(subject, object, id, ...path);
					// }

					return super.request(subject, object, id, ...path);

				}

				// build() {
				// 	return {
				// 		init: async div => {
				// 			this.render = div.render;
				// 			await this.query(this.resource.params);
				// 		},
				// 		child: super.build()
				// 	}
				// }

			}

			async request(subject, object, ...path) {
				switch (subject) {
					case "render":
					case "edit":
						await this.render();
						break;
				}
			}

			build() {
				return {
					init: async div => {
						this.render = div.render;
						const form = this.createChild("form");
						await form.query(form.resource.params);
						div.child = form.build()
					}
				}
			}

		}

		// class MetaField extends KarmaFieldsAlpha.field {
		//
		// 	constructor(...args) {
		//
		// 		super(...args);
		//
		// 		this.form = this.createChild({
		// 			type: "form",
		// 			driver: "posts",
		// 			joins: ["postmeta", "taxonomy"],
		// 			params: {
		// 				ids: id
		// 			},
		// 			children: [
		// 				{
		// 					type: "group",
		// 					key: id,
		// 					children: [resource]
		// 				}
		// 			]
		// 		});
		//
		// 		this.form.buffer.getObject = function() {
		// 			return {
		// 				data: {
		// 					posts: {
		// 						[id]: JSON.parse(input.value || "{}")
		// 					}
		// 				}
		// 			};
		// 		};
		// 		this.form.buffer.setObject = function(delta) {
		// 			input.value = JSON.stringify(delta.data.posts[id]);
		// 		}
		// 	}
		//
		// 	async request(subject, object, ...path) {
		// 		switch (subject) {
		// 			case "render":
		// 			case "edit":
		// 				await this.render();
		// 				break;
		// 		}
		// 	}
		//
		// 	build() {
		// 		return {
		// 			init: async div => {
		// 				this.render = div.render;
		// 				await this.form.query(this.form.resource.params);
		// 			},
		// 			child: this.form.build()
		// 		}
		// 	}
		//
		// }

		// class Embeder extends KarmaFieldsAlpha.field {
		//
		// 	constructor(resource, input) {
		//
		// 		super(resource);
		//
		// 		this.form = this.createChild({
		// 			id: "form",
		// 			key: resource.id,
		// 			type: "form",
		// 			bufferPath: ["data"],
		// 			children: resource.children
		// 		});
		//
		// 		this.form.buffer.getObject = function() {
		// 			return {data: JSON.parse(input.value || "{}")};
		// 		};
		// 		this.form.buffer.setObject = function(delta) {
		// 			input.value = JSON.stringify(delta.data);
		// 		}
		//
		// 	}
		//
		// 	async request(subject, object, ...path) {
		// 		switch (subject) {
		// 			case "render":
		// 			case "edit":
		// 				await this.render();
		// 				break;
		//
		// 			case "get": {
		// 				const [id, key] = path;
		// 				const store = new KarmaFieldsAlpha.Store(this.resource.driver, this.resource.joins || []);
		// 				await store.query(`id=${id}`);
		// 				return store.getValue(...path);
		// 			}
		//
		// 			case "modified": {
		// 				// const originalValue = this.buffer.get(...path);
		// 				// return KarmaFieldsAlpha.DeepObject.differ(content.data, originalValue);
		// 				return false;
		// 			}
		//
		// 			default:
		// 				return super.request(subject, object, ...path);
		// 		}
		// 	}
		//
		// 	build() {
		// 		return {
		// 			init: div => {
		// 				this.render = div.render;
		// 			},
		// 			child: this.form.build()
		// 		}
		// 	}
		//
		// }
		//
		//
		// class Embeder extends KarmaFieldsAlpha.field.form {
		//
		// 	constructor(resource, input) {
		//
		// 		super(resource);
		//
		// 		this.form = this.createChild({
		// 			id: "form",
		// 			key: resource.id,
		// 			type: "form",
		// 			bufferPath: ["data"],
		// 			children: resource.children
		// 		});
		//
		// 		this.form.buffer.getObject = function() {
		// 			return {data: JSON.parse(input.value || "{}")};
		// 		};
		// 		this.form.buffer.setObject = function(delta) {
		// 			input.value = JSON.stringify(delta.data);
		// 		}
		//
		// 	}
		//
		// 	async request(subject, object, ...path) {
		// 		switch (subject) {
		// 			case "render":
		// 			case "edit":
		// 				await this.render();
		// 				break;
		//
		// 			case "get": {
		// 				const [id, key] = path;
		// 				const store = new KarmaFieldsAlpha.Store(this.resource.driver, this.resource.joins || []);
		// 				await store.query(`id=${id}`);
		// 				return store.getValue(...path);
		// 			}
		//
		// 			case "modified": {
		// 				// const originalValue = this.buffer.get(...path);
		// 				// return KarmaFieldsAlpha.DeepObject.differ(content.data, originalValue);
		// 				return false;
		// 			}
		//
		// 			default:
		// 				return super.request(subject, object, ...path);
		// 		}
		// 	}
		//
		// 	build() {
		// 		return {
		// 			init: div => {
		// 				this.render = div.render;
		// 			},
		// 			child: this.form.build()
		// 		}
		// 	}
		//
		// }

		// const embeder = new Embeder(id, resource, input);

		// const metaField = new MetaField();
		const metaField = new MetaField();



		KarmaFieldsAlpha.build(metaField.build(), container);
	});
</script>
