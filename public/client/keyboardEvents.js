(function() {
  function onkey(keyCode, pressed) {
    $keys[keyCode] = pressed;
  }
  // fix when window loses focus before key is up
  document.addEventListener('keydown', event => onkey(event.keyCode, true), false);
  document.addEventListener('keyup', event => onkey(event.keyCode, false), false);
})();
