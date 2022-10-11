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

		// let gateway = KarmaFieldsAlpha.tables.createChild({
		// 	type: "gateway",
		// 	driver: "posts",
		// 	joins: ["postmeta", "taxonomy"]
		// });
		// let form = gateway.createChild({
		// 	id: "form",
		// 	key: id,
		// 	type: "form",
		// 	bufferPath: ["data"],
		// 	children: [resource]
		// });
		//
		// form.buffer.getObject = function() {
		// 	return {data: JSON.parse(input.value || "{}")};
		// };
		// form.buffer.setObject = function(delta) {
		// 	input.value = JSON.stringify(delta.data);
		// }
		// KarmaFieldsAlpha.build({
		// 	child: form.build()
		// }, container);



		class Embeder extends KarmaFieldsAlpha.field.gateway {

			constructor(resource, input) {

				super(resource);

				this.form = this.createChild({
					id: "form",
					key: resource.id,
					type: "form",
					bufferPath: ["data"],
					children: resource.children
				});

				this.form.buffer.getObject = function() {
					return {data: JSON.parse(input.value || "{}")};
				};
				this.form.buffer.setObject = function(delta) {
					input.value = JSON.stringify(delta.data);
				}

			}

			async request(subject, object, ...path) {
				switch (subject) {
					case "render":
					case "edit":
						await this.render();
						break;

					case "get": {
						const [id, key] = path;
						const store = new KarmaFieldsAlpha.Store(this.resource.driver, this.resource.joins || []);
						await store.query(`id=${id}`);
						return store.getValue(...path);
					}

					case "modified": {
						// const originalValue = this.buffer.get(...path);
						// return KarmaFieldsAlpha.DeepObject.differ(content.data, originalValue);
						return false;
					}

					default:
						return super.request(subject, object, ...path);
				}
				return event;
			}

			build() {
				return {
					init: div => {
						this.render = div.render;
					},
					child: this.form.build()
				}
			}

		}

		// const embeder = new Embeder(id, resource, input);

		const embeder = new Embeder({
			driver: "posts",
			joins: ["postmeta", "taxonomy"],
			children: [resource],
			id: id
		}, input);

		KarmaFieldsAlpha.build(embeder.build(), container);
	});
</script>
