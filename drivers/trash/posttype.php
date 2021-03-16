<?php

require_once KARMA_FIELDS_PATH.'/drivers/postfield.php';

Class Karma_Fields_Driver_Posttype extends Karma_Fields_Driver_Postfield {

	/**
	 * get
	 */
  public function parse($value, &$args) {

    $args['post_type'] = $value;

  }

  /**
	 * fetch
	 */
  public function fetch($params) {

    return 1;

  }

}
