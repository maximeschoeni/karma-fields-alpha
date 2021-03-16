<?php if ($display === 'table') { ?>
  <table>
    <?php foreach ($fields as $field) {
      $meta_key = isset($field['meta_key']) ? $field['meta_key'] : $this->generate_key();
      if (!isset($args['id'])) {
        $field['id'] = 'karma_field-'.$meta_key;
      }
      ?>
      <tr>
        <th style="padding-right:20px">
          <label for="<?php echo $field['id']; ?>"><?php echo $field['label']; ?></label>
        </th>
        <td>
          <?php $this->print_field($post, $field); ?>
        </td>
      </tr>
    <?php } ?>
  </table>
<?php } else { ?>
  <div
    class="fields-group display-<?php echo $display; ?>"
    <?php if (isset($args['style'])) { ?>style="<?php echo $args['style']; ?>"<?php } ?>
    >
    <?php foreach ($fields as $field) {
      $meta_key = isset($field['meta_key']) ? $field['meta_key'] : $this->generate_key();
      if (!isset($field['id'])) {
        $field['id'] = 'karma_field-input-'.$meta_key;
      }
      ?>
      <div class="fields-item">
        <?php if (isset($field['label'])) { ?>
          <label for="<?php echo $field['id']; ?>" style="display:block"><?php echo $field['label']; ?></label>
        <?php } ?>
        <?php $this->print_field($post, $field); ?>
      </div>
    <?php } ?>
  </div>
<?php } ?>
