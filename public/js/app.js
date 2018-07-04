(function() {
  var counter = document.getElementById('counter');
  var logo = document.getElementById('logo');
  var audio = document.getElementById('audio');
  var eventSource;

  function play() {
    audio.play();
  }

  function updateCounter(options) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function(progressEvent) {
      var newCount = JSON.parse(progressEvent.currentTarget.response).count;
      counter.innerHTML = newCount;
    });

    options = options || {};
    if (options.increment) {
      request.open('POST', '/increment');
    } else {
      request.open('GET', '/db');
    }
    request.send();
  }

  logo.addEventListener('click', function(e) {
    updateCounter({ increment: true });
  });

  document.addEventListener('DOMContentLoaded', function() {
    updateCounter();
    eventSource = new EventSource('/subscribe');
    eventSource.addEventListener(
      'message',
      function(e) {
        play();
        updateCounter();
      },
      false
    );
  });
})();
