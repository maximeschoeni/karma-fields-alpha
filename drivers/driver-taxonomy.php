<?php



Class Karma_Fields_Alpha_Driver_Taxonomy {


  /**
	 * fetch
	 */
  public function fetch($params) {

    if (isset($params['key']) || isset($params['taxonomy'])) {

      $taxonomy = $params['key'] ?? $params['taxonomy'];

      $terms = get_terms(array(
        'taxonomy' => $taxonomy,
        'hide_empty' => false
      ));



      $results = array();
      $results['items'] = array();

      if (is_wp_error($terms)) {

        $results['error'] = $terms;
        $results['taxonomy'] = $taxonomy;

      } else if ($terms) {

        foreach ($terms as $term) {

          $results['items'][] = array(
            'key' => $term->term_id,
            'name' => $term->name
          );

        }

        $results = apply_filters('karma_fields_driver_taxonomy_query_key_results', $results, $terms, $taxonomy, $params);

      }

      return $results;
    }


  }




}
