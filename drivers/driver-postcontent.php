<?php



class Karma_Fields_Alpha_Driver_Postcontent {

  /**
	 * join
	 */
  public function join($params) {
    global $wpdb;

    $ids = explode(',', $params['ids']);
    $ids = array_filter($ids);

    if ($ids) {

      $ids = array_map('intval', $ids);
      $sql_ids = implode(',', $ids);

      $sql = "SELECT
        post_content AS 'value',
        'post_content' AS 'key',
        ID AS 'id'
        FROM $wpdb->posts
        WHERE ID IN ($sql_ids)";

			$results = $wpdb->get_results($sql);

      return $results;

    }

    return array();

  }






}
