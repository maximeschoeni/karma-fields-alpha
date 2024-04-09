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

      if (!$option) {

        $option = array();

      }

      $output[] = array(
        'id' => $id,
        'option_value' => $option
      );

    } else if (isset($params['ids'])) {

      $ids = explode(',', $params['ids']);
      $ids = array_map('esc_attr', $ids);

      foreach ($ids as $id) {

        $option = get_option($id);
        $option = apply_filters('karma_fields_query_options', $option, $id, $params);

        if (!$option) {

          $option = array();

        }



        $output[] = array(
          'id' => $id,
          'option_value' => $option
        );

      }

    }

    return $output;
  }

  /**
   * count
   */
  public function count($params) {
    global $wpdb;

    return get_var("SELECT COUNT(option_id) FROM $wpdb->options");
  }

  /**
	 * update
	 */
  public function update($item, $id) {

    // $option = get_option($id);
    //
    // if (!$option) {
    //
    //   $option = array();
    //
    // }
    //
    // update_option($id, array_merge(
    //   $option,
    //   apply_filters('karma_fields_update_options', $item, $id)
    // ));



    if (isset($item['option_value'][0])) {

      $options = $item['option_value'][0];

      $options = apply_filters('karma_fields_update_options', $options, $id);

      update_option($id, $options);

    }



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
