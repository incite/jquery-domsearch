$(function($) {
  $.domsearch = function(elt, query, unit, criteria, minimumScore) { init(elt, query, unit, criteria, minimumScore) }
  
  function init(element, query, unit, criteria, minimumScore) {
    if (typeof minimumScore == 'undefined') var minimumScore = 0.5;
    if (typeof unit == 'undefined') {
      switch(element.tagName) {
        case 'TABLE':
          unit = 'tr';
          break
        case 'OL':
        case 'UL':
          unit = 'li';
          break
        case 'DIV':
          unit = 'div';
          break
      }      
    }
    $($.grep($(element).find(unit), function(row) {
      var text;
      if (typeof criteria == 'undefined') criteria = false
      switch(criteria.constructor) {
        case Array:
          text = $.map(criteria, function(e) {
            return $(row).find(e).text()
          }).join(' ')
          break;
        case String:
          text = $(row).find(criteria).text()
          break;
        default:
          text = $(row).text()
          break
      }

      $(row).show();
      return LiquidMetal.score(text, query) < minimumScore
    })).hide()
  }
  
  $.fn.domsearch = function(query, unit, criteria, minimumScore) {
    this.each(function() { new $.domsearch(this, query, unit, criteria, minimumScore) })
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
