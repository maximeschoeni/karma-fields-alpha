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

    if (isset($params['id'])) {

      $name = $params['id'];
      $option = get_option($name);

      return array(array_merge(
        array('id' => $name),
        $option
      ));

    }

    return array();
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
      $item
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
