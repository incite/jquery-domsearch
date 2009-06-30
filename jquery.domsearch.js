$(function($) {
  $.domsearch = function(elt, query) { init(elt, query) }
  
  function init(element, query) {
    var unit;
    switch(element.tagName) {
      case 'TABLE':
        unit = 'tr';
        break
      case 'OL':
      case 'UL':
        unit = 'li'
        break
    }
    $($.grep($(element).find(unit), function(row) {
      $(row).show();
      return LiquidMetal.score($(row).text(), query) == 0.0
    })).hide()
  }
  
  $.fn.domsearch = function(query) {
    this.each(function() { new $.domsearch(this, query) })
  }
})

// Then e.g.:
// $('someform input').keypress( 
//   function() { 
//     var proxy = $(this);
//     setTimeout( function() { $('#table-with-stuff').domsearch(proxy.val()) }, 100)
//   })
// )
// setTimeout helps avoid jerkyness when relying on keypress for that kind of stuff