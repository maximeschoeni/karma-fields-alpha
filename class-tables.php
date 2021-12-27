<?php



Class Karma_Fields_Alpha {

	public $version = '27';

	public $middlewares = array();
	public $drivers = array();
	public $keys = array();


	public $menu_items = array();
	public $tables = array();


	/**
	 *	constructor
	 */
	public function __construct() {

		add_action('init', array($this, 'init'));

		add_action('rest_api_init', array($this, 'rest_api_init'));

		if (is_admin()) {

			add_action('admin_enqueue_scripts', array($this, 'enqueue_styles'));

			// add_action('karma_field_print_grid', array($this, 'print_grid_compat'));
			// add_action('karma_fields_print_field', array($this, 'print_field_compat'), 10, 2);

			add_action('karma_fields_alpha', array($this, 'print_field'));

			add_action('karma_fields_post_field', array($this, 'print_post_field'), 10, 2);
			add_action('karma_fields_option_field', array($this, 'print_option_field'));


			add_action('admin_head', array($this, 'print_footer'));

			add_action('adminmenu', array($this, 'adminmenu'));
			add_action('admin_footer', array($this, 'print_nav'));


			// -> prevent wp_admin_canonical_url() to delete history state... Dunno if theres side effects!
			// add_filter('removable_query_args', function() {
			// 	return array();
			// });


    // Function to be called on plugin initialisation


		}


	}


		/**
		 * Hook for 'admin_enqueue_scripts'
		 */
		public function enqueue_styles() {

			$plugin_url = trim(plugin_dir_url(__FILE__), '/');

			wp_enqueue_style('karma-styles-date-field', $plugin_url . '/css/date-field.css', array(), $this->version);
			wp_enqueue_style('multimedia-styles', $plugin_url . '/css/multimedia.css', array(), $this->version);
			wp_enqueue_style('karma-styles-alpha-grid', $plugin_url . '/css/grid.css', array(), $this->version);
			wp_enqueue_style('karma-styles-alpha-array', $plugin_url . '/css/array.css', array(), $this->version);
			wp_enqueue_style('karma-styles-alpha-toolbar', $plugin_url . '/css/toolbar.css', array(), $this->version);
			wp_enqueue_style('karma-styles-alpha-input', $plugin_url . '/css/input.css', array(), $this->version);
			wp_enqueue_style('karma-styles-alpha-dropdown', $plugin_url . '/css/dropdown.css', array(), $this->version);
			wp_enqueue_style('karma-styles-alpha-submit', $plugin_url . '/css/submit.css', array(), $this->version);
			wp_enqueue_style('karma-fields-alpha-checkbox', $plugin_url . '/css/checkbox.css', array(), $this->version);
			wp_enqueue_style('karma-fields-alpha-modal', $plugin_url . '/css/modal.css', array(), $this->version);

			wp_enqueue_style('karma-fields-alpha-navigation', $plugin_url . '/css/navigation.css', array(), $this->version);

			wp_enqueue_style('karma-fields-alpha-styles', $plugin_url . '/css/karma-fields.css', array(), $this->version);





			wp_enqueue_media();


			// var_dump($plugin_path.'/js/all.min.js', file_exists($plugin_path));
			// die('asdf');

			if (false && file_exists($plugin_path.'/js/all.min.js')) {

				// wp_enqueue_script('karma-fields', $plugin_url . '/js/media.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-alpha', $plugin_url . '/js/all.js', array('karma-fields'), $this->version, true);

			} else {



				wp_enqueue_script('karma-fields-alpha', $plugin_url . '/js/media.js', array(), $this->version, true);
				// wp_enqueue_script('karma-fields', $plugin_url . '/js/karma-fields.js', array(), $this->version, true); // -> extensions must comme after this!

				wp_enqueue_script('karma-fields-alpha-build', $plugin_url . '/js/build-v7.6.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-calendar', $plugin_url . '/js/calendar.js', array('karma-fields-alpha'), $this->version, true);


				// domain
				wp_enqueue_script('karma-fields-manager-domain', $plugin_url . '/js/managers/domain.js', array('karma-fields-alpha'), $this->version, true);


				// v2 fields
				wp_enqueue_script('karma-fields-alpha-field', $plugin_url . '/js/fields/field.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-number', $plugin_url . '/js/fields/number.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-container', $plugin_url . '/js/fields/container.js', array('karma-fields-alpha', 'karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-group', $plugin_url . '/js/fields/group.js', array('karma-fields-alpha', 'karma-fields-alpha-container'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-form', $plugin_url . '/js/fields/form.js', array('karma-fields-alpha', 'karma-fields-alpha-group'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-date', $plugin_url . '/js/fields/date.js', array('karma-fields-alpha', 'karma-fields-alpha-calendar'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-date', $plugin_url . '/js/fields/date.js', array('karma-fields-alpha-input', 'karma-fields-alpha', 'moment'), $this->version, true);


				wp_enqueue_script('karma-fields-alpha-input', $plugin_url . '/js/fields/input.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-grid', $plugin_url . '/js/fields/grid.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-file', $plugin_url . '/js/fields/file.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-files', $plugin_url . '/js/fields/files.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-dropdown', $plugin_url . '/js/fields/dropdown.js', array('karma-fields-alpha-input', 'karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-checkbox', $plugin_url . '/js/fields/checkbox.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-checkboxes', $plugin_url . '/js/fields/checkboxes.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-checkboxtest', $plugin_url . '/js/fields/checkbox-test.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-checkbox-basic', $plugin_url . '/js/fields/checkbox-basic.js', array('karma-fields-alpha-input', 'karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-textarea', $plugin_url . '/js/fields/textarea.js', array('karma-fields-alpha-input', 'karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-editor', $plugin_url . '/js/fields/editor.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-tinymce', $plugin_url . '/js/fields/tinymce.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-index', $plugin_url . '/js/fields/index.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-submit', $plugin_url . '/js/fields/submit.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-filterlink', $plugin_url . '/js/fields/filterlink.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-autocomplete-textinput', $plugin_url . '/js/fields/autocomplete-textinput.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-header', $plugin_url . '/js/fields/header.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-search', $plugin_url . '/js/fields/search.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-array', $plugin_url . '/js/fields/array.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-textinput-datalist', $plugin_url . '/js/fields/textinput-datalist.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-table', $plugin_url . '/js/fields/table.js', array('karma-fields-alpha', 'karma-fields-alpha-form'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-button', $plugin_url . '/js/fields/button.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-toolbar', $plugin_url . '/js/fields/toolbar.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-input-datalist', $plugin_url . '/js/fields/input-datalist.js', array('karma-fields-alpha', 'karma-fields-alpha-dropdown'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-icon', $plugin_url . '/js/fields/icon.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-separator', $plugin_url . '/js/fields/separator.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-text', $plugin_url . '/js/fields/text.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-link', $plugin_url . '/js/fields/link.js', array('karma-fields-alpha-text'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-modal', $plugin_url . '/js/fields/modal.js', array('karma-fields-alpha', 'karma-fields-alpha-link'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-hidden', $plugin_url . '/js/fields/hidden.js', array('karma-fields-alpha', 'karma-fields-alpha-text'), $this->version, true);

				// table
				// wp_enqueue_script('karma-fields-alpha-table', $plugin_url . '/js/fields/table/table.js', array('karma-fields-alpha', 'karma-fields-alpha-form'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-table', $plugin_url . '/js/fields/table/tableNEW.js', array('karma-fields-alpha', 'karma-fields-alpha-form'), $this->version, true);


				wp_enqueue_script('karma-fields-alpha-table-col', $plugin_url . '/js/fields/table/table-col.js', array('karma-fields-alpha-table'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-table-row', $plugin_url . '/js/fields/table/table-row.js', array('karma-fields-alpha-table'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-table-controls', $plugin_url . '/js/fields/table/table-controls.js', array('karma-fields-alpha-table'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-table-ordering', $plugin_url . '/js/fields/table/table-ordering.js', array('karma-fields-alpha-table'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-table-pagination', $plugin_url . '/js/fields/table/table-pagination.js', array('karma-fields-alpha-table'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-table-content', $plugin_url . '/js/fields/table/table-content.js', array('karma-fields-alpha-table'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-table-options', $plugin_url . '/js/fields/table/table-options.js', array('karma-fields-alpha-table'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-table-filters', $plugin_url . '/js/fields/table/table-filters.js', array('karma-fields-alpha-table'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-table-grid', $plugin_url . '/js/fields/table/table-grid.js', array('karma-fields-alpha-table', 'karma-fields-alpha-table-content'), $this->version, true);

				// navigation
				wp_enqueue_script('karma-fields-alpha-navigation', $plugin_url . '/js/fields/navigation.js', array('karma-fields-alpha', 'karma-fields-manager-nav'), $this->version, true);


				// deprecated
				// wp_enqueue_script('karma-fields-alpha-textinput', $plugin_url . '/js/fields/textinput.js', array('karma-fields-alpha'), $this->version, true);



				// tables
				// wp_enqueue_script('karma-table-grid', $plugin_url . '/js/tables/grid.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-table-pagination', $plugin_url . '/js/tables/pagination.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-table-footer', $plugin_url . '/js/tables/footer.js', array('karma-fields-alpha'), $this->version, true);

				// utils
				// wp_enqueue_script('karma-fields-select-grid', $plugin_url . '/js/grid-select.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-utils-rect', $plugin_url . '/js/utils/rect.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-utils-object', $plugin_url . '/js/utils/object.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-transfer', $plugin_url . '/js/transfer-manager.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-manager-selection', $plugin_url . '/js/managers/selection-manager.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-utils-deep-object', $plugin_url . '/js/utils/deep-object.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-deep-object-async', $plugin_url . '/js/utils/deep-object-async.js', array('karma-fields-utils-deep-object'), $this->version, true);

				// includes
				// wp_enqueue_script('karma-fields-includes-icon', $plugin_url . '/js/includes/icon.js', array('karma-fields-alpha'), $this->version, true);

				// managers
				wp_enqueue_script('karma-fields-manager-history', $plugin_url . '/js/managers/history.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-manager-nav', $plugin_url . '/js/managers/nav.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-manager-cache', $plugin_url . '/js/managers/cache.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-manager-gateway', $plugin_url . '/js/managers/gateway.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-manager-delta', $plugin_url . '/js/managers/delta.js', array('karma-fields-alpha'), $this->version, true);
				wp_enqueue_script('karma-fields-manager-session-storage', $plugin_url . '/js/managers/session-storage.js', array('karma-fields-alpha', 'karma-fields-manager-delta'), $this->version, true);

				wp_enqueue_script('karma-fields-manager-type', $plugin_url . '/js/managers/type.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-manager-storage', $plugin_url . '/js/managers/storage.js', array('karma-fields-alpha'), $this->version, true);

				// wp_enqueue_script('karma-fields-manager-field', $plugin_url . '/js/managers/field.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('karma-fields-manager-form', $plugin_url . '/js/managers/form.js', array('karma-fields-alpha'), $this->version, true);
				// wp_enqueue_script('table-manager', $plugin_url . '/js/managers/table-manager.js', array('karma-fields-alpha', 'karma-manager-history'), $this->version, true);
				// wp_enqueue_script('field-manager', $plugin_url . '/js/managers/field-manager.js', array('karma-fields-alpha', 'karma-manager-history'), $this->version, true);


			}

		}

		/**
		 * @hook admin_header
		 */
		public function print_footer() {
			// global $karma_cache;

			$karma_fields = array(
				// 'ajax_url' => admin_url('admin-ajax.php'),
				'icons_url' => plugin_dir_url(__FILE__).'dashicons',
				'restURL' => rest_url().'karma-fields-alpha/v1',
				// 'getURL' => rest_url().'karma-fields/v1/get',
				// 'getURL' => apply_filters('karma_cache_url', rest_url().'karma-fields/v1/get'), // -> apply_filters('karma_fields_get')
				'cacheURL' => apply_filters('karma_cache_url', false),
				// 'queryURL' => rest_url().'karma-fields/v1/query',
				// 'saveURL' => rest_url().'karma-fields/v1/update',
				// 'fetchURL' => rest_url().'karma-fields/v1/fetch',
				// 'defaultURL' => rest_url().'karma-fields/v1/default'


				// 'addURL' => rest_url().'karma-fields/v1/add',
				// 'removeURL' => rest_url().'karma-fields/v1/remove'
				// 'queryTermsURL' => rest_url().'karma-fields/v1/taxonomy',
				// 'user_edit' => home_url('wp-content/karma-fields/users/'.get_current_user_id().'.json'),
				'nonce' => wp_create_nonce( 'wp_rest' )
			);


			// if (isset($karma_cache)) {
			//
			// 	$karma_fields['getPostURL'] = home_url().'/'.$karma_cache->path;
			//
			// }

			echo '<script>KarmaFieldsAlpha = '.json_encode($karma_fields).';</script>';

			// foreach ($drivers as $driver) {
			//
			// }

		}

	/**
	 * @hook init
	 */
	public function init() {

		do_action('karma_fields_init', $this);

		$this->register_driver(
			'posts',
			KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-posts.php',
			'Karma_Fields_Alpha_Driver_Posts'
		);

		$this->register_driver(
			'taxonomy',
			KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-taxonomy.php',
			'Karma_Fields_Alpha_Driver_Taxonomy'
		);

		$this->register_driver(
			'attachment',
			KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-attachment.php',
			'Karma_Fields_Alpha_Driver_Attachment'
		);

		$this->register_driver(
			'options',
			KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-options.php',
			'Karma_Fields_Alpha_Driver_Options'
		);

		// $this->register_driver(
		// 	'postmeta',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-postmeta.php',
		// 	'Karma_Fields_Driver_Postmeta'
		// );
		// $this->register_driver(
		// 	'postmetaobject',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-postmeta-object.php',
		// 	'Karma_Fields_Driver_Postmeta_Object'
		// );
		// $this->register_driver(
		// 	'postmetafile',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-postmeta-file.php',
		// 	'Karma_Fields_Driver_Postmeta_File'
		// );
		// $this->register_driver(
		// 	'postmetafiles',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-postmeta-files.php',
		// 	'Karma_Fields_Driver_Postmeta_Files'
		// );
		// $this->register_driver(
		// 	'taxonomy',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-taxonomy.php',
		// 	'Karma_Fields_Driver_Taxonomy'
		// );

		add_action('save_post', array($this, 'save'), 10, 3);

	}

	/**
	 * Save meta boxes
	 *
	 * @hook 'save_post'
	 */
	public function save($post_id, $post, $update) {



		if (current_user_can('edit_post', $post_id) && (!defined( 'DOING_AUTOSAVE' ) || !DOING_AUTOSAVE )) {

			$action = "karma_field-action";
			$nonce = "karma_field-nonce";

			if (isset($_REQUEST[$nonce]) && wp_verify_nonce($_POST[$nonce], $action)) {

				if (isset($_REQUEST['karma-fields-items']) && $_REQUEST['karma-fields-items']) {

					foreach ($_REQUEST['karma-fields-items'] as $encoded_input) {

						if ($encoded_input) {

							$encoded_input = stripslashes($encoded_input);
							$input = json_decode($encoded_input, false);

							if ($input) {

								foreach ($input as $driver_name => $data) {

									$driver = $this->get_driver($driver_name);

									// -> should verify permissions here

									if (method_exists($driver, 'update')) {

										$driver->update($data);

									}

								}


								// $driver = $this->get_driver('posts');
								//
								// // -> should verify permissions here
								//
								// if (method_exists($driver, 'update')) {
								//
								// 	$driver->update($input);
								//
								// }


							}

						}

					}

				}

			}

		}

	}


	/**
	 *	@hook 'rest_api_init'
	 */
	public function rest_api_init() {

		register_rest_route('karma-fields-alpha/v1', '/get/(?P<driver>[^/]+)/(?P<path>.+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_get'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				),
				'path' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields-alpha/v1', '/update/(?P<driver>[^/]+)', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_update'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				),
				'data' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields-alpha/v1', '/add/(?P<driver>[^/]+)/?', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_add'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields-alpha/v1', '/fetch/(?P<driver>[^/]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_fetch'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields-alpha/v1', '/query/(?P<driver>[^/]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_query'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields-alpha/v1', '/relations/(?P<driver>[^/]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_relations'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				),
				'ids' => array(
					'required' => true
				)
	    )
		));

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/query/[driver]'
	 */
	public function rest_query($request) {

		$driver_name = $request->get_param('driver');
		$params = $request->get_params();

		$driver = $this->get_driver($driver_name);

		if ($driver) {

			if (method_exists($driver, 'query')) {

				return $driver->query($params);

			} else {

				return "karma fields error: driver has no method 'query'";

			}

		} else {

			return "karma fields error: driver not found";

		}

	}


	/**
	 *	@rest 'wp-json/karma-fields/v1/filter/[object]/[filter]'
	 */
	public function rest_fetch($request) {

		$driver_name = $request->get_param('driver');

		$params = $request->get_params();

		$driver = $this->get_driver($driver_name);

		if ($driver) {

			if (method_exists($driver, 'fetch')) {

				return $driver->fetch($params, $params); // -> compat

			} else {

				return "karma fields error: driver has no method 'fetch'";

			}

		} else {

			return "karma fields error: driver not found";

		}

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/get/'
	 */
	public function rest_get($request) {

		$driver_name = $request->get_param('driver');
		$path = $request->get_param('path');

		$driver = $this->get_driver($driver_name);

		if ($driver) {

			if (method_exists($driver, 'get')) {

				return $driver->get($path);

			} else {

				return "karma fields error: driver has no method 'get'";

			}

		} else {

			return "karma fields error: driver not found";

		}

	}


	/**
	 *	@rest 'wp-json/karma-fields/v1/update/{middleware}'
	 */
	public function rest_update($request) {

		$driver_name = $request->get_param('driver');
		$data = $request->get_param('data');

		$driver = $this->get_driver($driver_name);

		// var_dump($driver_name, $driver, $data);

		if ($driver) {

			if (method_exists($driver, 'update')) {

				return $driver->update($data);

			} else {

				return "karma fields error: driver ($driver_name) has no method 'update'";

			}

		} else {

			return "karma fields error: driver not found";

		}

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/add/{driver}'
	 */
	public function rest_add($request) {

		$driver_name = $request->get_param('driver');
		$data = $request->get_param('data');

		$driver = $this->get_driver($driver_name);

		if (method_exists($driver, 'add')) {

			$num = isset($data['num']) ? intval($data['num']) : 1;

			$output = array();

			for ($i = 0; $i < $num; $i++) {

				$output[] = $driver->add(array());

			}

			return $output;

		} else {

			return "karma fields error: driver has no method 'add'";

		}

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/relations/{driver}?ids={ids}'
	 */
	public function rest_relations($request) {

		$driver_name = $request->get_param('driver');
		// $ids = $request->get_param('ids');
		//
		// $ids = array_map('intval', $ids);

		$params = $request->get_params();

		$driver = $this->get_driver($driver_name);

		if (method_exists($driver, 'relations')) {

			return $driver->relations($params);

		}

		return array();

	}

	/**
	 *	register_driver
	 */
	public function register_driver($name, $path, $class) {

		$this->drivers[$name] = array(
			'path' => $path,
			'class' => $class
		);

	}

	/**
	 * Find driver by middleware/key
	 */
	public function get_driver($driver_name) {

		if (isset($this->drivers[$driver_name])) {

			require_once $this->drivers[$driver_name]['path'];

			$driver = new $this->drivers[$driver_name]['class'];
			$driver->name = $driver_name;

			return $driver;

		}

	}


	/**
	 *	@hook karma_fields_alpha
	 */
	public function print_field($args) {
		static $index = 0;

		$index++;

		// if (empty($args['type']) || $args['type'] !== 'form') {
		//
		// 	trigger_error('Root field must be of type "form"');
		//
		// }

		include plugin_dir_path(__FILE__) . 'includes/field.php';

	}

	/**
	 *	@hook karma_fields_post_field
	 */
	public function print_post_field($post_id, $args) {
		static $index = 0;

		$index++;

		include plugin_dir_path(__FILE__) . 'includes/post-field.php';

	}

	/**
	 *	@hook karma_fields_option_field
	 */
	public function print_option_field($args) {
		static $index = 0;

		$index++;

		include plugin_dir_path(__FILE__) . 'includes/option-field.php';

	}

	// /**
	//  *	parse_object
	//  */
	// public function parse_param($path, $value, &$results) {
	//
	// 	$key = array_shift($path);
	//
	// 	if (count($path)) {
	//
	// 		if (empty($results[$key])) {
	//
	// 			$results[$key] = array();
	//
	// 		}
	//
	// 		$this->parse_param($path, $value, $results[$key]);
	//
	// 	} else {
	//
	// 		$results[$key] = $value;
	//
	// 	}
	//
	// }
	//
	// /**
	//  *	parse_object
	//  */
	// public function parse_query_object($object) {
	//
	// 	$results = array();
	//
	// 	foreach ($object as $key => $value) {
	//
	// 		$path = explode('/', $key);
	//
	// 		$this->parse_param($path, $value, $results);
	//
	// 	}
	//
	// 	return $results;
	// }
	//




	/**
	 *	register_menu_item()
	 */
	public function register_menu_item($name, $url_search) {

		$this->menu_items[$name] = $url_search;

	}

	/**
	 *	register_table()
	 */
	public function register_table($args) {

		$this->tables[] = $args;

	}

	/**
	 * @hook 'adminmenu'
	 */
	public function adminmenu() {

		include plugin_dir_path(__FILE__) . 'includes/menu.php';

	}

	/**
	 * @hook 'print_footer'
	 */
	public function print_nav() {

		include plugin_dir_path(__FILE__) . 'includes/nav.php';

	}


}

global $karma_fields;
$karma_fields = new Karma_Fields_Alpha;




add_action( 'admin_print_footer_scripts', function() {
	if ( ! class_exists( '_WP_Editors', false ) ) {
	    require( ABSPATH . WPINC . '/class-wp-editor.php' );
	}
	_WP_Editors::print_default_editor_scripts();
} );
