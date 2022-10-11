<?php



Class Karma_Fields_Alpha_Posts {

	public function __construct() {

    add_action('karma_fields_init', array($this, 'karma_fields_init'));

  }

	/**
	 * @hook karma_fields_init
	 */
	public function karma_fields_init($karma_fields) {

		// -> moved in karma-editor-theme
		// $karma_fields->register_menu_item('karma=posts', 'edit.php');

		// $karma_fields->register_navigation(array(
		// 	'children' => array(
		// 		array(
		// 			'type' => 'menu',
		// 			'items' => array(
		// 				array(
		// 					'title' => 'Post',
		// 					'hash' => 'karma=posts'
		// 				),
		// 				array(
		// 					'title' => 'Pages',
		// 					'hash' => 'karma=pages'
		// 				),
		// 				array(
		// 					'title' => 'Medias',
		// 					'hash' => 'karma=medias'
		// 				)
		// 			)
		// 		)
		// 	)
		// ));



		$karma_fields->register_table(array(
			// 'driver' => 'posts?post_type=post',
			'id' => 'posts',
			// 'type' => 'layout',
			// 'joins' => array(
			// 	'taxonomy',
			// 	'postmeta',
			// 	'postcontent'
			// 	// array('driver' => 'taxonomy', 'on' => 'id'),
			// 	// array('driver' => 'postmeta', 'on' => 'id')
			// 	// array('driver' => 'taxonomy?taxonomy=category'),
			// 	// array('driver' => 'taxonomy?taxonomy=post_tag')
			// ),
			// 'ppp' => 100,
			// 'index' => array(
			// 	'title' => '#',
			// 	'width' => 'auto'
			// ),
			// 'style' => 'flex: 1 1 0;',
			// 'orderby' => 'post_title',
			// 'autosave' => false,

			'body' => array(
				'type' => 'collection',
				'driver' => 'posts',
				'joins' => array('taxonomy', 'postmeta', 'postcontent'),
				'params' => array(
					'ppp' => 100,
					'orderby' => 'post_title'
				),
				'children' => array(
					array(
						'type' => 'tableIndex',
						'value' => 'asdfasdf'
					),
					array(
						'label' => 'Title',
						'sortable' => true,
						'order' => 'asc',
						'width' => '1fr',
						'value' => ['get', 'post_title'],
						'type' => 'modalHandle',
						'orderby' => 'post_title'
					),
					array(
						'label' => 'AA',
						'sortable' => true,
						'order' => 'asc',
						'type' => 'input',
						'key' => 'aa',
					),
					array(
						'label' => 'Category',
						'sortable' => true,
						'width' => 'auto',
						'type' => 'dropdown',
						'key' => 'category',
						'default' => '1',
						'options' => array('getOptions', 'taxonomy', 'taxonomy=category')
					),
					array(
						'label' => 'Status',
						'sortable' => true,
						'width' => 'auto',
						'value' => ['get', 'post_status'],
						'type' => 'text'
					),
					array(
						'label' => 'Type',
						'sortable' => true,
						'width' => 'auto',
						'value' => ['get', 'post_type'],
						'type' => 'text'
					),
					array(
						'label' => 'Date',
						'sortable' => true,
						'width' => 'auto',
						'value' => ['date', ['get', 'post_date'], 'DD/MM/YYYY'],
						'type' => 'text'
					)
				),
				'modal' => array(
					'children' => array(
						array(
							'type' => 'input',
							'label' => 'Title',
							'key' => 'post_title'
						),
						array(
							// 'type' => 'textarea',
							'type' => 'tinymce',
							'label' => 'Content',
							'key' => 'post_content'
						),
						array(
							'type' => 'gallery',
							// 'uploader' => 'wp',
							'key' => 'images',
							'label' => 'Gallery',
							// 'max' => 1
						),
						array(
							'label' => 'Array',
							'type' => 'array',
							'key' => 'array1',
							'children' => array(
								'index',
								array(
									'type' => 'input',
									'key' => 'x'
								),
								array(
									'type' => 'array',
									'key' => 'subarray',
									'children' => array(
										array(
											'type' => 'input',
											'key' => 'z'
										),
									)
								),
								'delete'
							)
						),
						array(
							'label' => 'Array 2',
							'type' => 'array',
							'children' => array(
								'index',
								array(
									'type' => 'input',
									'key' => 'x'
								),
								array(
									'type' => 'input',
									'key' => 'y'
								),
								'delete'
							)
						)
					)
				)
			),
			'header' => array(
				'title' => 'Posts',
				'children' => array(
					'title',
					'count',
					'pagination',
					'close'
				)
			),
			// 'controls' => array(
      //   'type' => 'controls',
      //   'children' => array(
      //     'save',
      //     array(
      //       'type' => 'button',
      //       'title' => 'xxx'
      //     )
      //   )
      // ),




			'filters' => array(
				'type' => 'group',
				'display' => 'flex',
				'children' => array(
					array(
						'type' => 'dropdown',
						'label' => 'Category',
						'key' => 'category',
						// 'driver' => 'taxonomy',
						// 'params' => array('taxonomy' => 'category'),
						// 'empty' => '',
						// 'style' => 'flex:1'
						// 'options' => array(
						// 	array('id' => '', 'name' => '-')
						// ),
						//
						// 'driver' => 'taxonomy?taxonomy=category&field=name',
						// 'options' => array('queryArray', 'taxonomy?taxonomy=category')
						'options' => array(
							'...',
							array('id' => '', 'name' => '–'),
							array('getOptions', 'taxonomy', 'taxonomy=category')
						)
					),
					array(
						'type' => 'dropdown',
						'label' => 'Status',
						'key' => 'post_status',
						'options' => array(
							array('id' => '', 'name' => 'All'),
							array('id' => 'publish', 'name' => 'Publish'),
							array('id' => 'pending', 'name' => 'Pending'),
							array('id' => 'draft', 'name' => 'Draft'),
							array('id' => 'future', 'name' => 'Future'),
							array('id' => 'trash', 'name' => 'Trash')
						),
						'style' => 'flex:1'
					),
					array(
						'type' => 'dropdown',
						'label' => 'AA',
						'key' => 'aa',
						'driver' => 'postmeta?meta_key=aa',
						'options' => array(
							array('id' => '', 'name' => '-')
						),
						// 'params' => array('meta_key' => 'aa'),
						// 'map' => array('id' => 'meta_value', 'name' => 'meta_value'),
						// 'empty' => '',
						'style' => 'flex:1'
					),

					array(
						'type' => 'input',
						'label' => 'Recherche',
						'value' => '',
						'key' => 'search',
						'style' => 'flex:1'
					)
				)
			)


		));

	}


}

new Karma_Fields_Alpha_Posts;
