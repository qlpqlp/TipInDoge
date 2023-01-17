/**
 * The options page is displayed within the browser's extensions page on Chrome
 * and Firefox, and needs less prominent styling then. The options page can
 * also be open as a separate tab though, and full styling is needed then. To enable
 * this workflow, we load a base stylesheet in all cases, that contains the complete
 * collection of styles, and we load a smaller stylesheet that overrides some of
 * those styles when the options page is embedded in a frame.
 */

var isFramed = window.location.hash !== '#newtab';
var framedStylesheet = document.querySelector('[data-use-when="framed"]');
if (isFramed) framedStylesheet.setAttribute('href', framedStylesheet.getAttribute('data-href'));

$(document).ready(function() {


  var currentBrowser = (
    location.protocol === 'chrome-extension:' ? 'chrome' :
    location.protocol === 'moz-extension:' ? 'firefox' :
    location.protocol === 'safari-web-extension:' ? 'safari' : ''
  );

  // Dynamically update page title
  var hardcodedBrowserName = 'Chrome';
  var formattedCurrentBrowser = currentBrowser.substr(0, 1).toUpperCase() + currentBrowser.substr(1);
  document.title = document.title.replace(hardcodedBrowserName, formattedCurrentBrowser);;

  /**
   * Remove Firefox-specific option in other browsers
   */
  if (currentBrowser !== 'firefox') {
    $('#firefox-data-collection').remove();
  }

  /**
   * Turn radios on & off from localStorage based on their values
   */
  var radios = $('input[type="radio"]').each(function() {
    var $this = $(this);
    var key = 'doge.op.' + $this.attr('name');
    var val = $this.val();




    chrome.storage.local.get(key, function(result) {
      if (result[key] === val) {
        $this.prop('checked', true);
      }

    });
  });


  /**
   * Save it all
   */
  $('.submit').click(function(ev) {

    ev.preventDefault();

    var store = {};

    // Save the radio values based on their values
    $(radios)
      .filter(function() {
        return $(this).is(':checked');
      })
      .each(function() {
        var $this = $(this);
        var key = 'doge.op.' + $this.attr('name');
        var val = $this.val();

        store[key] = val;
      });


    chrome.storage.local.set(store, function() {
      // Indicate to the user that things went well
      $('.submit').text('Saved').addClass("saved");
//      $('.submit').text('Save').removeClass("saved");

    });
  });


  /**
   * Reset the save button
   */
  $('input').on('keyup click', function() {
    $('.submit').text('Save').removeClass("saved");
  });


});