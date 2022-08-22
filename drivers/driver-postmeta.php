<?php



class Karma_Fields_Alpha_Driver_Postmeta {


  /**
	 * query
	 */
  public function query($params) {
    global $wpdb, $wp_locale;

    $where_clauses = array();

    $where_clauses[] = "p.post_status != 'auto-draft' AND p.post_status != 'trash'";

    if (isset($params['post_type'])) {

      $where_clauses[] = $wpdb->prepare("p.post_type = %s", $params['post_type']);

    }

    if (isset($params['meta_key'])) {

      $where_clauses[] = $wpdb->prepare("pm.meta_key = %s", $params['meta_key']);

    }

    $where = implode(" AND ", $where_clauses);

    if (isset($params['groupby']) && $params['groupby'] === 'month') {

      $sql = "SELECT DISTINCT YEAR(pm.meta_value) AS year, MONTH(pm.meta_value) AS month
        FROM $wpdb->postmeta AS pm
        INNER JOIN $wpdb->posts AS p ON p.ID = pm.post_id
        WHERE $where
        ORDER BY pm.meta_value DESC";

      $results = $wpdb->get_results($sql);

      $output = array();

      foreach ($results as $result) {

        $month_name = $wp_locale->get_month($result->month);

        $output[] = array(
          'id' => "{$result->year}{$result->month}",
          'name' => "{$month_name} {$result->year}",
        );

      }

      return $output;

    } else if (isset($params['groupby']) && $params['groupby'] === 'year') {

      $sql = "SELECT DISTINCT YEAR( p.post_date ) AS year
        FROM $wpdb->postmeta AS pm
        INNER JOIN $wpdb->posts AS p ON p.ID = pm.post_id
        WHERE $where
        ORDER BY pm.meta_value DESC";

      $results = $wpdb->get_results($sql);

      $output = array();

      foreach ($results as $result) {

        $output[] = array(
          'id' => "$result->year",
          'name' => "$result->year",
        );

      }

      return $output;

    } else if (isset($params['groupby'])) {

      return apply_filters('karma_fields_driver_postmeta_results', array(), $params);

    } else {

      $sql = "SELECT
        pm.meta_value AS 'id',
        pm.meta_value AS 'name'
        FROM $wpdb->postmeta AS pm
        INNER JOIN $wpdb->posts AS p ON p.ID = pm.post_id
        WHERE $where
        GROUP BY pm.meta_value
        ORDER BY pm.meta_value ASC";

      $sql = apply_filters('karma_fields_driver_postmeta_sql', $sql, $params);

      return $wpdb->get_results($sql);

    }

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
        pm.meta_value AS 'value',
        pm.meta_key AS 'key',
        pm.post_id AS 'id'
        FROM $wpdb->postmeta AS pm
        WHERE pm.post_id IN ($sql_ids)";

			$results = $wpdb->get_results($sql);

      foreach ($results as $result) {

        $result->value = maybe_unserialize($result->value);

        $result->value = apply_filters('karma_fields_posts_driver_join_meta', $result->value, $result->key, $result->id); // -> actinic (works)

      }

      return $results;

    } else {

      return array();

    }




  }






}
