<?php


Class Karma_Fields_Alpha_WP_Block_Image {

  public function parse($wp_block) {

    $block = array();

    $block['type'] = 'blockGallery';

    if (isset($wp_block['attrs']) && $wp_block['attrs']) {

      if (isset($wp_block['attrs']['id']) && $wp_block['attrs']['id']) {

        $block['files'] = array($wp_block['attrs']['id']); // -> replace files by ids ?

      }

      $block['attrs'] = $wp_block['attrs'];

      // if (isset($wp_block['attrs']['id']) && $wp_block['attrs']['id']) {
      //
      //   $block['files'] = array($wp_block['attrs']['id']);
      //
      // }
      //
      // if (isset($wp_block['attrs']['width']) && $wp_block['attrs']['width']) {
      //
      //   $block['width'] = $wp_block['attrs']['width'];
      //
      // }
      //
      // if (isset($wp_block['attrs']['height']) && $wp_block['attrs']['height']) {
      //
      //   $block['height'] = $wp_block['attrs']['height'];
      //
      // }
      //
      // if (isset($wp_block['attrs']['sizeSlug']) && $wp_block['attrs']['sizeSlug']) {
      //
      //   $block['sizeSlug'] = $wp_block['attrs']['sizeSlug'];
      //
      // }
      //
      // if (isset($wp_block['attrs']['linkDestination']) && $wp_block['attrs']['linkDestination']) {
      //
      //   $block['linkDestination'] = $wp_block['attrs']['linkDestination'];
      //
      // }
      //
      // if (isset($wp_block['attrs']['className']) && $wp_block['attrs']['className']) {
      //
      //   $block['className'] = $wp_block['attrs']['className'];
      //
      // }
      //
      // if (isset($wp_block['attrs']['align']) && $wp_block['attrs']['align']) {
      //
      //   $block['align'] = $wp_block['attrs']['align'];
      //
      // }
      //
      // if (isset($wp_block['attrs']['lightbox']) && $wp_block['attrs']['lightbox']) {
      //
      //   $block['lightbox'] = $wp_block['attrs']['lightbox'];
      //
      // }

    }

    $block_content = new WP_HTML_Tag_Processor($wp_block['innerHTML']);

    while ($block_content->next_tag()) {

      if ($tags->get_tag() === 'A') {

        $href = $tags->get_attribute('href');
        $target = $tags->get_attribute('target');
        $linkClass = $tags->get_attribute('linkClass');
        $rel = $tags->get_attribute('linkClass');

        if ($href) {

          $block['href'] = $href;

        }

        if ($target) {

          $block['target'] = $target;

        }

        if ($linkClass) {

          $block['linkClass'] = $linkClass;

        }

        if ($rel) {

          $block['rel'] = $rel;

        }

      }

      if ($tags->get_tag() === 'FIGCAPTION') {

        $block['caption'] = $block_content->get_updated_html();

      }

      if ($tags->get_tag() === 'IMG') {

        $alt = $tags->get_attribute('alt');
        $title = $tags->get_attribute('title');

        if ($alt) {

          $block['alt'] = $title;

        }

        if ($title) {

          $block['title'] = $title;

        }

      }

    }

    return $block;

  }

  public function render($block) {

    $wp_block = array();

    $wp_block['blockName'] = 'core/image';
    $wp_block['innerBlocks'] = array();
    $wp_block['innerHTML'] = '';
    $wp_block['innerContent'] = array();
    $wp_block['attrs'] = array();

    if (isset($block['width']) && $block['width']) {

      $wp_block['attrs']['width'] = $block['width'];

    }

    if (isset($block['height']) && $block['height']) {

      $wp_block['attrs']['height'] = $block['height'];

    }

    if (isset($block['sizeSlug']) && $block['sizeSlug']) {

      $wp_block['attrs']['sizeSlug'] = $block['sizeSlug'];

    }

    if (isset($block['linkDestination']) && $block['linkDestination']) {

      $wp_block['attrs']['linkDestination'] = $block['linkDestination'];

    }

    if (isset($block['className']) && $block['className']) {

      $wp_block['attrs']['className'] = $block['className'];

    }

    if (isset($block['align']) && $block['align']) {

      $wp_block['attrs']['align'] = $block['align'];

    }

    if (isset($block['lightbox']) && $block['lightbox']) {

      $wp_block['attrs']['lightbox'] = $block['lightbox'];

    }

    $html = '';

    if (isset($block['files'][0])) {

      $id = $block['files'][0];
      $html = wp_get_attachment_image($id, 'large');
      $wp_block['attrs']['id'] = $id;

    }

    if (isset($block['href']) && $block['href']) {

      $link_attrs = array();

      $link_attrs["href=\"{$block['href']}\""];

      if (isset($block['target']) && $block['target']) {

        $link_attrs[] = "target=\"{$block['target']}\"";

      }

      if (isset($block['linkClass']) && $block['linkClass']) {

        $link_attrs[] = "class=\"{$block['linkClass']}\"";

      }

      if (isset($block['rel']) && $block['rel']) {

        $link_attrs[] = "rel=\"{$block['rel']}\"";

      }

      $link_attrs_string = implode(' ', $link_attrs);

      $html = "<a $link_attrs_string>$html</a>";

    }

    if (isset($block['caption']) && $block['caption']) {

      $html = "<figure>$html<figcaption>{$block['caption']}</figcaption></figure>";

    }

    $wp_block['innerHTML'] = $html;
    $wp_block['innerContent'][] = $html;

    return $wp_block;

  }

}
