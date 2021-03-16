<?php

require_once KARMA_FIELDS_PATH.'/drivers/driver.php';

Class Karma_Fields_Driver_Postfield extends Karma_Fields_Driver {


	public $fields = array(
		'post_type',
		'post_status',
		'post_title',
		'post_name',
		'post_content',
		'post_excerpt',
		'post_date',
		'menu_order'
	);

	/**
	 * get
	 */
  public function parse($value, &$args) {

		if (in_array($this->key, $this->fields)) {

			$args[$this->key] = $value;

		}

  }

	/**
	 * get
	 */
  public function get($uri) {

    $id = apply_filters("karma_fields_posts_uri", $uri);

		return get_post($id)->{$this->key};

  }

	/**
	 * update
	 */
  public function update($uri, $value, &$args) {

		$args[$this->key] = $value;

  }

	/**
	 * sort
	 */
  public function sort(&$args) {

		if ($this->key === 'post_title') {

			$args['orderby'] = 'title';

		} else if ($this->key === 'post_date') {

			$args['orderby'] = 'date';

		} else if ($this->key === 'menu_order') {

			$args['orderby'] = 'menu_order';

		}

  }

	// /**
	//  *	get_sql_clauses
	//  */
	// public function get_sql_clauses($args) {
	//
	// 	$wheres = array();
	// 	$joins = array();
	//
	// 	foreach ($args as $key => $value) {
	//
	//
	//
	// 	}
	//
	// }

	// /**
	//  * sanitize_fields
	//  */
	// public function verify_key($key) {
	//
	// 	return in_array($value, array(
	// 		'post_type',
	// 		'post_status',
	// 		'post_title',
	// 		'post_name',
	// 		'post_content',
	// 		'post_excerpt',
	// 		'post_date',
	// 		'menu_order'
	// 	));
	//
	// }


}
