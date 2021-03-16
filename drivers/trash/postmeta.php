<?php

require_once KARMA_FIELDS_PATH.'/drivers/driver.php';

Class Karma_Fields_Driver_Postmeta extends Karma_Fields_Driver {

	/**
	 * get
	 */
  public function get($uri) {

    $id = apply_filters("karma_fields_posts_uri", $uri);

    return get_post_meta($id, $this->key, true);

  }

	/**
	 * update
	 */
  public function update($uri, $value, &$args) {

    $id = apply_filters("karma_fields_posts_uri", $uri);

    update_post_meta($id, $this->key, $value);

  }

  /**
	 * get
	 */
  public function parse($value, &$args) {

		$args['meta_query'][] = array(
      'key' => $this->key,
      'value' => $value
    );

  }

	/**
	 * sort
	 */
  public function sort(&$args) {

    $args['orderby'] = array(
      'meta_value' => $order,
      'title' => 'ASC'
    );

    $args['meta_key'] = $this->key;

  }

  /**
	 * fetch
	 */
  // public function fetch($params) {
  //
  //   // return $wpdb->get_col($wpdb->prepare(
  //   //   "SELECT pm.meta_value FROM $wpdb->posts
  //   //   JOIN $wpdb->postmeta AS pm ON (pm.post_id = p.ID AND pm.meta_key = %s)
  //   //   WHERE p.post_type = %s ORDER BY p.post_date ASC LIMIT 1",
  //   //   $key,
  //   //   $request->get_param('type')
  //   // ));
  //
  // }

}
