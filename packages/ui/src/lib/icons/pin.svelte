<script lang="ts">
  export let active = false;
</script>

<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class:active>
  <g class="pin">
    <path
      class="pin-body"
      d="M54.778 9.55013L66.2117 12.264L74.0176 18.8434L79.9472 25.5122L84.0494 32.2942L84.8483 42.265L69.7952 44.6418L59.459 53.0987L57.8532 69.959L44.1452 65.7702L36.1294 57.7544L31.1799 51.8182L28.1064 44.3161L27.0593 34.8923L43.8149 34.5027L51.7651 24.4364L54.778 9.55013ZM53.6206 30.1542L47.769 37.5634L48.9572 42.3705L52.6453 46.6532L56.7712 48.8375L64.6563 42.3861L61.8005 40.2919L55.5791 34.0705L53.6206 30.1542ZM69.375 39.6462L73.9434 38.9249L72.2798 38.1134L66.0129 33.1925L61.2694 28.449L57.4598 21.5047L56.7182 25.1693L59.6882 31.1085L65.0656 36.486L69.375 39.6462ZM60.7351 16.103L63.8992 16.854L70.5201 22.4346L75.9061 28.4921L79.1597 33.8711L79.3294 35.9889L74.9495 33.8526L69.3365 29.4451L65.3097 25.4182L61.9569 19.3064L60.7351 16.103ZM54.4218 53.2512L49.4721 50.6307L44.3897 44.7288L43.1023 39.5206L32.6314 39.7641L32.9985 43.0683L35.5142 49.2088L39.8248 54.3787L46.799 61.3529L53.4565 63.3873L54.4218 53.2512Z"
    />
    <path class="needle" d="M36.2095 52.1775L17.9661 77.7748L43.2805 59.2486" />
  </g>
  <ellipse cx="21" cy="74" rx="8" ry="3" />
</svg>

<style>
  ellipse {
    transform-origin: 21% 74%;
    transform: scale(0) rotate(50deg);
    transition: transform 0.3s ease !important;
  }

  .active > ellipse {
    transform: scale(1.1) rotate(50deg);
  }

  .active .pin-body {
    transform: translate(0px, 0px);
  }

  .pin {
    transform: translate(10%, -10%);
    transition: transform 0.3s ease;
  }

  .active .pin {
    transform: translate(0px, 0px);
  }

  .pin-body {
    stroke: none !important;
    fill: white !important;
  }
</style>
