<?php



Class Karma_Fields_Alpha_Driver_Attachment {


  /**
	 * fetch
	 */
  public function fetch($request, $params) {
    global $wpdb;

    if (isset($params['ids'])) {

      $ids = explode(',', $params['ids']);
      $ids = array_map('intval', $ids);
      $ids = array_filter($ids);

      if ($ids) {

        $ids = implode(',', $ids);

  			$sql = "SELECT $wpdb->posts.* FROM $wpdb->posts WHERE ID IN ($ids)";

  			$attachments = $wpdb->get_results($sql);

  			if ($attachments) {

  				update_post_caches($attachments, 'any', false, true);

  			}

        $images = array();

        foreach ($attachments as $attachment) {

          $attachment = get_post($attachment->ID);
          $thumb_src_data = wp_get_attachment_image_src($attachment->ID, 'thumbnail', true);

          $images[] = array(
            'id' => $attachment->ID,
            'title' => get_the_title($attachment),
            'caption' => wp_get_attachment_caption($attachment->ID), // = post_excerpt
            'type' => get_post_mime_type($attachment),
            'src' => $thumb_src_data[0],
            'width' => $thumb_src_data[1],
            'height' => $thumb_src_data[2],
            'original_src' => wp_get_attachment_url($attachment->ID)
          );

        }

        return $images;

      } else {

        return array();

      }


    }

  }




}
