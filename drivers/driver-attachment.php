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

          $image = array(
            'id' => $attachment->ID,
            'title' => get_the_title($attachment),
            'caption' => wp_get_attachment_caption($attachment->ID), // = post_excerpt
            'type' => get_post_mime_type($attachment),
            'src' => $thumb_src_data[0],
            'width' => $thumb_src_data[1],
            'height' => $thumb_src_data[2],
            'original_src' => wp_get_attachment_url($attachment->ID)
          );

          if (isset($params['sources']) && $params['sources']) {

            $img_sizes = is_array($params['sources']) ? $params['sources'] : array(
              'medium',
              'medium_large',
              'large',
              '1536x1536',
              '2048x2048'
            );

            $img_sizes = apply_filters('karma_fields_attachment_driver_image_sizes', $img_sizes, $image, $params);

            $image['sources'] = $this->get_image_source($attachment->ID, $img_sizes);

          }

          $images[] = $image;

        }

        return $images;

      } else {

        return array();

      }


    }

  }


  /**
	 * Get image sources
	 */
	public function get_image_source($img_id, $img_sizes = null, $type = null) {
		static $baseurl;

		if (!isset($baseurl)) {

			$uploads = wp_get_upload_dir();
			$baseurl = $uploads['baseurl'] . '/';

		}

		$sources = array();

		$metadata = wp_get_attachment_metadata($img_id);
		$path = '';
		$file = get_post_meta($img_id, '_wp_attached_file', true);

    if (!isset($type)) {

      $type = get_post_mime_type($img_id);

    }

		if ($type === 'image/jpeg' || $type === 'image/jpg' || $type === 'image/png') {

			if (!$img_sizes) {

				$img_sizes = get_intermediate_image_sizes();

			}

			$basename = basename($file);
			$path = str_replace($basename, '', $file);

			foreach ($img_sizes as $img_size) {

				if (isset($metadata['sizes'][$img_size])) {

					$sources[] = array(
						'src' => $baseurl . $path . $metadata['sizes'][$img_size]['file'],
						'width' => $metadata['sizes'][$img_size]['width'],
						'height' => $metadata['sizes'][$img_size]['height']
					);

				}

			}

		  // full ->
			$sources[] = array(
				'src' => $baseurl . $file,
				'width' => $metadata['width'],
				'height' => $metadata['height']
			);

		}

		return $sources;

	}




}
