<div id="karma-fields-option-field-<?php echo $index; ?>-container" class="karma-fields karma-fields-option"></div>
<input type="hidden" name="karma-fields-items[]" id="karma-fields-option-input-<?php echo $index; ?>">

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
 ?>
<script>
	document.addEventListener("DOMContentLoaded", function() {
		let container = document.getElementById("karma-fields-option-field-<?php echo $index; ?>-container");
		let input = document.getElementById("karma-fields-option-input-<?php echo $index; ?>");
		let resource = <?php echo json_encode($args); ?>;

    console.log(resource);


		// let field = new KarmaFieldsAlpha.fields.form({
		// 	type: "form",
		// 	driver: "options",
		// 	children: [resource]
		// });

		// field.delta = {
		// 	getObject: function() {
		// 		// let delta = JSON.parse(input.value || "{}");
		// 		// delta = KarmaFieldsAlpha.Type.sanitizeObject(delta);
		// 		// return delta;
		// 		return JSON.parse(input.value || "{}");
		// 	},
		// 	setObject: function(delta) {
		// 		// delta = KarmaFieldsAlpha.Type.parseObject(delta);
		// 		input.value = JSON.stringify(delta);
		// 	},
		// 	get: function(...path) {
		// 		return KarmaFieldsAlpha.DeepObject.get(this.getObject(), ...path);
		// 	},
		// 	set: function(value, ...path) {
		// 		const delta = this.getObject();
		// 		KarmaFieldsAlpha.DeepObject.assign(delta, value, ...path);
		// 		this.setObject(delta);
		// 	},
		// 	remove: function(value, ...path) {
		// 		const delta = this.getObject();
		// 		if (delta) {
		// 			KarmaFieldsAlpha.DeepObject.remove(delta, ...path);
		// 			this.setObject(delta);
		// 		}
		// 	}
		// }

		// KarmaFieldsAlpha.build({
		// 	child: field.build(),
		// }, container);
	// });

	// document.addEventListener("karmaFieldsAlpha", function() {

		class MetaField extends KarmaFieldsAlpha.field {

			static form = class extends KarmaFieldsAlpha.field.form {

        static row = class extends KarmaFieldsAlpha.field {

          async request(subject, content, ...path) {

            switch (subject) {

              case "index":
                return this.index;

              default:
                return this.parent.request(subject, content, this.getKey(), ...path);
                break;
            }

          }

          build() {

            return {
              children: this.resource.children.map(resource => {
                return this.createChild(resource).build();
              })
            }

          }

        }

				constructor() {
					super({
						driver: "options",
						// joins: ["postmeta", "taxonomy"],
            // relations: ["meta", "taxonomy"],
						// params: {
						// 	ids: id
						// },
						children: [
              {
                type: "row",
                ...resource
              }
            ]
					});

					// this.buffer.getObject = function() {
					// 	return {
					// 		data: {
					// 			posts: {
					// 				[id]: JSON.parse(input.value || "{}")
					// 			}
					// 		}
					// 	};
					// };

					// this.buffer.setObject = function(delta) {
					// 	input.value = JSON.stringify(delta.data.posts[id]);
					// }

				}

				// async request(subject, object, ...path) {


        //   console.log(subject, object, ...path);

				// 	// return super.request(subject, object, id, ...path);
        //   return super.request(subject, object, ...path);

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
						// await form.query(form.resource.params);
						div.child = form.build()
					}
				}
			}

		}

		const metaField = new MetaField();

		KarmaFieldsAlpha.build(metaField.build(), container);
	});
</script>
