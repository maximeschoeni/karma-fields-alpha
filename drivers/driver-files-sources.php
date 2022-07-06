<?php

// https://stackoverflow.com/a/38088630/2086505
// https://developer.wordpress.org/reference/functions/wp_generate_attachment_metadata/

Class Karma_Fields_Alpha_Driver_Files_Sources {

  /**
	 * relations
	 */
  public function join($params) {
    global $wpdb;

    $results = array();

    $ids = array_map('intval', explode(',', $params['ids']));

    if ($ids) {

      $sql_ids = implode(',', $ids);

			$sql = "SELECT $wpdb->posts.* FROM $wpdb->posts WHERE ID IN ($sql_ids)";

			$attachments = $wpdb->get_results($sql);

			if ($attachments) {

				update_post_caches($attachments, 'any', false, true);

			}

      foreach ($attachments as $attachment) {

        $img_sizes = array(
          'medium',
          'medium_large',
          'large',
          '1536x1536',
          '2048x2048'
        );

        $img_sizes = apply_filters('karma_fields_attachment_driver_image_sizes', $img_sizes, $image);

        $sources = $this->get_image_source($attachment->ID, $img_sizes);

        $results[] = array(
          'id' => $attachment->ID,
          'key' => 'sources',
          'value' => $sources
        );

        $results[] = array(
          'id' => $attachment->ID,
          'key' => 'srcset',
          'value' => implode(', ', array_map(function($source) {
            return "{$source->url} {$source->width}w";
          }, $sources))
        );

      }

    }

    return $results;

  }

  /**
   * Get image sources
   */
  public static function get_image_source($img_id, $img_sizes = null) {
    static $baseurl;

    if (!isset($baseurl)) {

      $uploads = wp_get_upload_dir();
      $baseurl = $uploads['baseurl'] . '/';

    }

    $sources = array();

    $type = get_post_mime_type($img_id);

    if ($type === 'image/jpeg' || $type === 'image/jpg' || $type === 'image/png') {

      $metadata = wp_get_attachment_metadata($img_id);
      $path = '';
      $file = get_post_meta($img_id, '_wp_attached_file', true);

      if (!$img_sizes) {

        $img_sizes = get_intermediate_image_sizes();

      }

      $basename = basename($file);
      $path = str_replace($basename, '', $file);

      foreach ($img_sizes as $img_size) {

        if (isset($metadata['sizes'][$img_size])) {

          $sources[] = (object) array(
            'url' => $baseurl . $path . $metadata['sizes'][$img_size]['file'],
            'width' => $metadata['sizes'][$img_size]['width'],
            'height' => $metadata['sizes'][$img_size]['height']
          );

        }

      }

      $sources[] = (object) array(
        'url' => $baseurl . $file,
        'width' => $metadata['width'],
        'height' => $metadata['height']
      );

    }

    return $sources;

  }

}
