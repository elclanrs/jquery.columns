
/*
 * Create responsive layouts quickly using
 * viewport relative units. Plugin includes
 * polyfill for $.fn.css to parse viewport units
 *
 * http://www.w3.org/TR/css3-values/#viewport-relative-lengths
 */
 (function( $, window ) {

  $.columns = {} // global object

  var $win = $(window)
    , _css = $.fn.css // cache original css method

    // Default options
    , defaults = {
        colsPerRow: 3,
        width: 75, // percent of window
        height: 'auto',
        center: true,
        fontSize: calcFontSize( 75, 1920, 26 ) // maxMedia = 1920 * (75/100) = 1440
      }

    // Media query

  function typeOf( obj ) {
    return {}.toString.call( obj ).match(/\s\w+/)[0].toLowerCase()
  }

  function viewportToPixel( val ) {
    var percent = val.match(/[\d.]+/)[0] / 100
      , unit = val.match(/[vwh]+/)[0]
    return ( unit == 'vh' ? $win.height() : $win.width() ) * percent + 'px'
  }

  function parseProps( props ) {
    var p, prop
    for ( p in props ) {
      prop = props[ p ]
      if ( /[\d.][vwh]$/.test( prop ) ) {
        props[ p ] = viewportToPixel( prop )
      }
    }
    return props
  }

  /*
   * Calculate aprox font-size in viewport units
   * @param {Number} width Percent of window width
   * @param {Number} maxDevice Maximum target device width, ie. 1920 (desktop)
   * @param {Number} maxFontSize Maximum font-size for biggest device (px)
   * @return {Number}
   */
  function calcFontSize( width, maxDevice, maxFontSize ) {
    var maxMedia = maxDevice * ( width / 100 )
    return ( 100 * maxFontSize ) / maxMedia
  }

  // Override css method to parse viewport units
  $.fn.css = function() {
    var self = this
      , args = [].slice.call( arguments )
      , isObj = typeOf( args[0] ) == 'object'
      , update = function() {
          return _css.apply( self, isObj ? [ parseProps( $.extend( {}, args[0] ) ) ] : args )
        }
    $win.resize( update ).resize()
    return update()
  }

  // Build and arrange columns
  $.fn.columns = function( opts ) {

    var self = this.addClass('clear').find('.col')
      , o = $.extend( {}, defaults, opts )
      , colWidth = o.width / o.colsPerRow
      , isFullWidth = o.width == 100
      , nth = o.colsPerRow == 1 ? '1n' : o.colsPerRow == 2 ? 'odd' : ++o.colsPerRow +'n'
      , $firstRowCol = self.filter(':first, :nth-child('+ nth +')')

    $firstRowCol.css('clear', 'both')

    if ( !isFullWidth && o.center ) {
      $firstRowCol.css({ marginLeft: (100 - o.width) / 2 +'vw' })
    }

    return self.css({
      width: colWidth +'vw',
      height: o.height,
      fontSize: o.fontSize +'vw'
    })

  }

  $.columns.setDefaults = function( opts ) {
    $.extend( defaults, opts )
  }

}( jQuery, window ))

