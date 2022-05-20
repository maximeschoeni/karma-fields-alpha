<?php



class Karma_Fields_Alpha_Driver_Termmeta {


  /**
	 * query
	 */
  public function query($params) {
    global $wpdb;

    $where_clauses = array();


    if (isset($params['taxonomy'])) {

      $where_clauses[] = $wpdb->prepare("tt.taxonomy = %s", $params['taxonomy']);

    }

    if (isset($params['meta_key'])) {

      $where_clauses[] = $wpdb->prepare("tm.meta_key = %s", $params['meta_key']);

    }

    if (!$where_clauses) {

      $where_clauses = "1=1";

    }

    $where = implode(" AND ", $where_clauses);

    $sql = "SELECT
      tm.meta_value AS 'id',
      tm.meta_value AS 'name'
      FROM $wpdb->termmeta AS tm
      INNER JOIN $wpdb->term_taxonomy AS tt ON tt.term_id = tm.term_id
      WHERE $where
      GROUP BY tm.meta_value
      ORDER BY tm.meta_value ASC";

    $sql = apply_filters('karma_fields_driver_termmeta_sql', $sql, $params);

    return $wpdb->get_results($sql);

  }





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
        tm.meta_value AS 'value',
        tm.meta_key AS 'key',
        tm.term_id AS 'id'
        FROM $wpdb->termmeta AS tm
        WHERE tm.term_id IN ($sql_ids)";

			$results = $wpdb->get_results($sql);

      return $results;

    } else {

      return array();

    }




  }






}
