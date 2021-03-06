$(function($) {
  
  $.fn.sort = function() { return this.pushStack([].sort.apply(this, arguments), []) }
  
  $.domsearch = function(element, searchIn, options) { init(element, searchIn, options) }

  function init(element, searchIn, options) {
    var target = $(searchIn);    
    var defaults = { unit: undefined, criteria: false, minimumScore: 0.5 }
    var options = $.extend(defaults, options);
    
    // Guess options.unit
    if (!options.unit) {
      switch(target[0].tagName) {
        case 'TBODY':
        case 'TABLE':
          options.unit = 'tr';
          break
        case 'OL':
        case 'UL':
          options.unit = 'li';
          break
        case 'DIV':
          options.unit = 'div';
          break
      }      
    }
    
    var originalOrder = target.find(options.unit);

    $(element).keydown(function(event) {
      if (event.keyCode == 9) return true; // TAB
      var field = $(this);
      setTimeout(
        function() {
          if (field.val() == '') {
            originalOrder.show().appendTo(target)
          } else {
            search(field.val(), target[0], options);
          }
          if (typeof options.onkeydown == 'function') options.onkeydown(field);
        }, 
      100)
    })
  }

  function search(query, searchIn, options) {  
    $($.grep($(searchIn).find(options.unit), function(row) {
      var text;
      switch(options.criteria.constructor) {
        case Array:
          text = $.map(options.criteria, function(crit) {
            return $(row).find(crit).text()
          }).join(' ')
          break;
        case String:
          text = $(row).find(options.criteria).text()
          break;
        default:
          text = $(row).text()
          break;
      }
      $(row).show().data('domsearch.score', LiquidMetal.score(text, query));
      return $(row).data('domsearch.score') < options.minimumScore;
    })
      .sort(function(a, b) { return $(a).data('domsearch.score') < $(b).data('domsearch.score') }))
        .appendTo(searchIn)
        .hide();
  }
  
  $.fn.domsearch = function(query, options) {
    if (!$(this).data('domsearch.enabled')) {
      $(this).data('domsearch.enabled', true);
      return this.each(function() { new $.domsearch(this, query, options) });
    }
  }
});

// Then e.g.:
// $('#my_text_field').domsearch('#table_with_stuff')
