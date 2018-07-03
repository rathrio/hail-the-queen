(function () {
  var counter = document.getElementById('counter');
  var logo = document.getElementById('logo');
  var audio = document.getElementById('audio');

  function play() {
    audio.play();
  }

  function updateCounter(options) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function (progressEvent) {
      var newCount = JSON.parse(progressEvent.currentTarget.response).count;
      counter.innerHTML = newCount;
    });

    if (options.increment) {
      request.open('POST', '/increment');
    } else {
      request.open('GET', '/db');
    }
    request.send();
  }

  logo.addEventListener('click', function (e) {
    play();
    updateCounter({ increment: true });
  });

  document.addEventListener('DOMContentLoaded', updateCounter);
})();
