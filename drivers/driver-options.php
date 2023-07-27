<?php



Class Karma_Fields_Alpha_Driver_Options {

  // /**
	//  * recursive_get
	//  */
  // public function get_recursive($obj, $keys) {

  //   if ($keys) {

  //     $key = array_shift($keys);

  //     $obj = (array) $obj;

  //     if (isset($obj[$key])) {

  //       return $this->get_recursive($obj[$key], $keys);

  //     }

  //   } else {

  //     return $obj;

  //   }

  //   return '';
  // }


  // /**
	//  * get
	//  */
  // public function get($path) {

  //   $keys = explode('/', $path);

  //   if ($keys) {

  //     $key = array_shift($keys);

  //     $value = get_option($key);

  //     if ($keys) {

  //       $value = $this->get_recursive($value, $keys);

  //     }

  //     return $value;

  //   }

  //   return '';
  // }

  /**
   * query
   */
  public function query($params) {

    $output = array();

    if (isset($params['id'])) {

      $id = $params['id'];
      $option = get_option($id);

      $option = apply_filters('karma_fields_query_options', $option, $id, $params);

      if ($option && is_array($option)) {

        $output[] = array_merge(
          array('id' => $id),
          $option
        );

      }

    } else if (isset($params['ids'])) {

      $ids = explode(',', $params['ids']);
      $ids = array_map('esc_attr', $ids);

      foreach ($ids as $id) {

        $option = get_option($id);
        $option = apply_filters('karma_fields_query_options', $option, $id, $params);

        if ($option && is_array($option)) {

          $output[] = array_merge(
            array('id' => $id),
            $option
          );

        }

      }

    }

    return $output;
  }

  /**
	 * update
	 */
  public function update($item, $id) {

    $option = get_option($id);

    if (!$option) {

      $option = array();

    }

    update_option($id, array_merge(
      $option,
      apply_filters('karma_fields_update_options', $item, $id)
    ));

    return true;
  }



  // /**
	//  * update_recursive
	//  */
  // public function update_recursive(&$obj, $data) {

  //   if (is_array($data)) {

  //     if (!is_array($obj)) {

  //       $obj = (array) $obj;

  //     }

  //     foreach ($data as $key => $value) {

  //       if (!isset($obj[$key])) {

  //         $obj[$key] = array();

  //       }

  //       $this->update_recursive($obj[$key], $value);

  //     }

  //   } else {

  //     $obj = $data;

  //   }

  // }

  // /**
	//  * update
	//  */
  // public function update($data) {

  //   foreach ($data as $key => $value) {

  //     $original_value = get_option($key, array());

  //     $this->update_recursive($original_value, $value);

  //     update_option($key, $original_value);

  //   }

  //   return true;
  // }





}
