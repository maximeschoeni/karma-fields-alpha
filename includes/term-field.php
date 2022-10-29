<div id="karma-fields-term-<?php echo $term_id; ?>-field-<?php echo $index; ?>-container" class="karma-fields karma-fields-term"></div>
<input type="hidden" name="karma-fields-items[]" id="karma-fields-term-<?php echo $term_id; ?>-input-<?php echo $index; ?>">

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
 ?>
<script>
	document.addEventListener("karmaFieldsAlpha", function() {

		let container = document.getElementById("karma-fields-term-<?php echo $term_id; ?>-field-<?php echo $index; ?>-container");
		let input = document.getElementById("karma-fields-term-<?php echo $term_id; ?>-input-<?php echo $index; ?>");

		let resource = <?php echo json_encode($args); ?>;
		let id = "<?php echo $term_id; ?>";

		class MetaField extends KarmaFieldsAlpha.field {

			static form = class extends KarmaFieldsAlpha.field.form {

				constructor() {
					super({
						driver: "taxonomy",
						joins: ["termmeta"],
						params: {
							ids: id
						},
						children: [resource]
					});

					this.buffer.getObject = function() {
						return {
							data: {
								taxonomy: {
									[id]: JSON.parse(input.value || "{}")
								}
							}
						};
					};

					this.buffer.setObject = function(delta) {
						input.value = JSON.stringify(delta.data.taxonomy[id]);
					}

				}

				async request(subject, object, ...path) {

					return super.request(subject, object, id, ...path);

				}

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

		const metaField = new MetaField();

		KarmaFieldsAlpha.build(metaField.build(), container);
	});
</script>
