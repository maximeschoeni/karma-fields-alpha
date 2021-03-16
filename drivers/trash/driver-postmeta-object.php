<?php

require_once KARMA_FIELDS_PATH.'/drivers/driver-postmeta.php';


Class Karma_Fields_Driver_Postmeta_Object extends Karma_Fields_Driver_Postmeta {

  /**
	 * update
	 */
  public function update($data, $output, $request, $karma_fields) {

    require_once KARMA_FIELDS_PATH.'/utils/object.php';

    foreach ($data as $id => $item) {

      foreach ($item as $key => $value) {

        $prev = get_post_meta($id, $key, true);

        echo '<pre>';
        var_dump($key, $prev, $value);

        Karma_Fields_Object::merge($prev, $value);

        $value = Karma_Fields_Object::clean($prev);

        var_dump($key, $value);
        die();

        update_post_meta($id, $key, $value);

      }

    }

  }

  /**
   * @hook Karma_Fields_Driver_Posts::query
   */
  public function order(&$args, $orderby, $order = 'ASC') {

  }

  /**
   * @hook Karma_Fields_Driver_Posts::query
   */
  public function filter(&$args, $filters) {

  }


}
