<?php if (isset($args['values']) && $args['values']) { ?>
  <ul class="karma-field-radio">
    <?php foreach($args['values'] as $option) { ?>
      <li>
        <label>
          <input type="radio" name="karma_field-<?php echo $meta_key; ?>" value="<?php echo $option['key']; ?>" <?php if ($value === $option['key']) echo 'checked' ?>/><?php echo $option['name']; ?>
        </label>
      </li>
    <?php } ?>
  </ul>
<?php } ?>
