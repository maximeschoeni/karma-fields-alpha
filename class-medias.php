<?php



Class Karma_Fields_Alpha_Media_Library {

	public function __construct() {

		add_action('init', array($this, 'init'));
    add_action('karma_fields_init', array($this, 'karma_fields_init'));

  }

	public function init() {

    register_post_type('karma-folder', array(
      'public'             => false,
      'capability_type'    => 'post',
      'has_archive'        => false,
      'hierarchical'       => true
    ));

		add_filter('karma_fields_posts_driver_query_args', array($this, 'query_args'), 10, 2);
		// add_filter('karma_fields_posts_driver_query_output', array($this, 'query_output'), 10, 3);

	}

	/**
	 * @filter karma_fields_posts_driver_query_args
	 */
	public function query_args($args, $params) {
		global $wpdb;



		// add_filter('query', function($query) {
		// 	var_dump($query);
		// 	return $query;
		// });

		// $args['no_found_rows'] = true;

		// add_filter('posts_join_request', function($join) {
		// 	global $wpdb;
		// 	return "$join INNER JOIN $wpdb->posts as a ON (a.post_parent = $wpdb->posts.ID)";
		// });
		//
		// add_filter('posts_where_request', function($where) {
		// 	global $wpdb;
		// 	return "$where AND a.post_type = 'attachment' AND a.post_status = 'inherit'";
		// });


		// add_filter('posts_results', function($posts, $query) {
		// 	var_dump($query->query_vars['post_parent']);
		// 	//var_dump($ids);
		// 	return $posts;
		// }, 10, 2);
		//
		//
		// $q = new WP_Query($args);
		//
		// die();

		if (
			isset($args['post_type'], $args['post_parent'])
			&& in_array('karma-folder', $args['post_type'])
			&& in_array('attachment', $args['post_type'])
			&& $args['post_parent'] !== '') {

			add_filter('posts_results', function($posts, $query) {
				global $wpdb;

				$post_parent = intval($query->query_vars['post_parent']);

				$folders = $wpdb->get_results(
					"SELECT p.* FROM $wpdb->posts as p
					INNER JOIN $wpdb->posts as a ON (a.post_parent = p.ID)
					WHERE a.post_type = 'attachment' AND a.post_status = 'inherit'
						AND p.post_type NOT IN ('attachment', 'karma-folder', 'revision') AND p.post_parent = $post_parent
					GROUP BY p.ID
					ORDER BY p.post_title"
				);

				return array_merge(
					$folders,
					$posts
				);
			}, 10, 2);

		}

		return $args;
	}

	/**
	 * @filter karma_fields_posts_driver_query_output
	 */
	public function query_output($output, $query, $args) {
		global $wpdb;

		// return $output;

		// var_dump($query->posts);
		// die();

		// if (isset($args['post_type'], $args['post_parent']) && in_array('karma-folder', $args['post_type']) && $args['post_parent'] !== '') {
		//
		// 	$post_parent = intval($args['post_parent']);
		//
		// 	$results = $wpdb->get_results(
		// 		"SELECT p.ID AS 'id', p.post_title, p.post_type, p.post_parent, COUNT(a.ID) AS 'count' FROM $wpdb->posts as p
		// 		INNER JOIN $wpdb->posts as a ON (a.post_parent = p.ID)
		// 		WHERE a.post_type = 'attachment' AND a.post_status = 'inherit'
		// 			AND p.post_type NOT IN ('attachment', 'karma-folder', 'revision') AND p.post_parent = $post_parent
		// 		GROUP BY p.ID
		// 		ORDER BY p.post_title"
		// 	);
		//
		// 	$output = array_merge(
		// 		$results,
		// 		$output
		// 	);
		//
		// }

		return $output;
	}

	/**
	 * @hook karma_fields_init
	 */
	public function karma_fields_init($karma_fields) {

		// $karma_fields->register_driver(
		// 	'medias',
		// 	KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-medias.php',
		// 	'Karma_Fields_Alpha_Driver_Medias'
		// );

		// $karma_fields->register_driver(
		// 	'files',
		// 	KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-files.php',
		// 	'Karma_Fields_Alpha_Driver_Files'
		// );

		// $karma_fields->register_driver(
		// 	'files-sources',
		// 	KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-files-sources.php',
		// 	'Karma_Fields_Alpha_Driver_Files_Sources'
		// );

		// -> moved in karma-editor-theme
		// $karma_fields->register_menu_item('karma=medias', 'upload.php');

		$karma_fields->register_table(array(

			// 'driver' => 'posts?post_type=attachment,karma-folder&post_status=inherit&orderby=post_type',

			'id' => 'medias',
			// 'type' => 'tableMedias',
			// 'interface' => 'medias',



			'header' => array(
				'title' => 'Media Library'
				// 'children' => array(
				// 	'title'
				// 	'count',
				// 	'pagination',
				// 	'close'
				// )
			),
			'modal' => array(
				'width' => '25em',
				'header' => array(
					'children' => array(
						array(
							'type' => 'title',
							'value' => array(
								'?',
								array(">", array("count", array("get", "array", "id")), 1),
								'Multiple Items',
								array(
									'?',
									array('==', array('get', 'string', 'id'), '0'),
									'Upload',
									array('get', 'post_title')
								)
							),
						),

						array(
							'type' => 'close',
							'action' => 'close'
						)
					)
				)
			),
			'body' => array(
				'type' => 'medias',
				'driver' => 'medias',
				'joins' => array('files', 'files-sources'),
				'params' => array(
					'ppp' => 100,
				),
				'style' => 'flex: 1 1 0;',
				'modal' => array(
					'children' => array(
						array(
							'type' => 'mediaDescription'
						),
						array(
							'type' => 'input',
							'hidden' => array('!', array('selection')),
							'label' => 'Title',
							'key' => 'post_title'
						),
						array(
							'type' => 'textarea',
							'visible' => array('&', array("dispatch", "is-attachment"), array('selection')),
							'label' => 'Caption',
							'key' => 'post_excerpt'
						),
						array(
							'type' => 'breadcrumb',
							'key' => 'parent',
							'visible' => array('!', array('selection'))
						)
					)
				)
			),
			'controls' => array(
				'children' => array(
					'save',
					array(
						'type' => 'upload',
						'title' => 'upload file'
					),
					array(
						'type' => 'button',
						'title' => 'test',
						'action' => 'edit'
					),
					array(
						'type' => 'add',
						'value' => array(
							'post_type' => 'karma-folder',
							'post_status' => 'inherit'
						)
					),
					'delete',
					'undo',
					'redo',
					'insert'
				)
			),


			// 'children' => array(
			//
			//
			//
			// 	array(
			// 		'label' => 'Thumb',
			// 		'sortable' => false,
			// 		'width' => 'auto',
			// 		'type' => 'link',
			// 		'action' => 'open-modal',
			// 		'value' => array('replace', '<figure><img src="#"></figure>', '#', array('get', 'thumb_src')),
			// 	),
			// 	array(
			// 		'label' => 'Filename',
			// 		'sortable' => true,
			// 		'order' => 'asc',
			// 		'width' => '1fr',
			// 		// 'key' => 'filename',
			// 		'key' => 'post_title',
			// 		'type' => 'input'
			// 	),
			// 	array(
			// 		'label' => 'Size',
			// 		'sortable' => true,
			// 		'width' => 'auto',
			// 		// 'value' => '{{size}}',
			// 		// 'value' => array('<> KB', array('size', '/', '1000')),
			// 		// 'value' => array('<> KB', array(array('size', '/', '1000'), 'toFixed')),
			// 		'value' => array('replace', '# KB', '#', array('toFixed', array('/', array('get', 'size'), '1000'))),
			// 		'type' => 'text'
			// 	),
			// 	array(
			// 		'label' => 'Date',
			// 		'sortable' => true,
			// 		'width' => 'auto',
			// 		// 'value' => '{{date::post_date::DD/MM/YYYY}}',
			// 		'value' => array('date', array('get', 'post_date'), array(
			// 			'year' => 'numeric',
			// 			'month' => 'short',
			// 			'day' => '2-digit'
			// 		)),
			// 		'type' => 'text'
			// 	),
			// 	array(
			// 		'label' => 'Dimensions',
			// 		'sortable' => true,
			// 		'width' => 'auto',
			// 		// 'value' => '{{width}} x {{height}}',
			// 		'value' => array('replace', '# x #', '#', array('get', 'width'), array('get', 'height')),
			// 		'type' => 'text'
			// 	)
			// ),

			'filters' => array(
				'type' => 'group',
				'display' => 'flex',
				'children' => array(
					array(
						'label' => 'Directory',
						'type' => 'directoryDropdown',
						'key' => 'parent'
					),
					array(
						'label' => 'Dates',
						'type' => 'dropdown',
						'key' => 'date',
						'options' => array(
							array('id' => '', 'name' => 'All dates')
						),
						// 'driver' => 'postdate?post_type=attachment&groupby=month',
						'style' => 'flex:1'
					),
					array(
						'label' => 'All media items',
						'type' => 'dropdown',
						'key' => 'post_mime_type',
						'options' => array(
							array('id' => '', 'name' => '–'),
							array('id' => 'image', 'name' => 'Image'),
							array('id' => 'video', 'name' => 'Video'),
							array('id' => 'application', 'name' => 'Document')
						),
						'style' => 'flex:1'
					),
					array(
						'type' => 'input',
						'label' => 'Recherche',
						'key' => 'search',
						'style' => 'flex:1'
					)
				)
			)


		));

	}




}

new Karma_Fields_Alpha_Media_Library;
