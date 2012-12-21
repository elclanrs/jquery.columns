
/*
 * Create responsive layouts quickly using viewport relative units.
 * Plugin extends $.fn.css to parse viewport units.
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
        width: 60, // percent of window
        breakpoints: [ [768, 95], [1200, 80] ],
        height: 'auto',
        center: true,
        fontSize: 1.55
      }

  function typeOf( obj ) {
    return {}.toString.call( obj ).match(/\s(\w+)/)[1].toLowerCase()
  }

  function hasViewportUnits( obj ) {
    var has = false
    for ( var o in obj ) {
      if ( /\d[vwh]+/.test( obj[o] ) ) {
        has = true
        break
      }
    }
    return has
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
      if ( /\d[vwh]+$/.test( prop ) ) {
        props[ p ] = viewportToPixel( prop )
      }
    }
    return props
  }

  // Override css method to parse viewport units
  $.fn.css = function() {

    var self = this
      , args = [].slice.call( arguments )

      , hasUnits = typeOf( args[0] ) == 'object' && hasViewportUnits( args[0] )

      , update = function() {
          return _css.apply( self, hasUnits ? [ parseProps( $.extend( {}, args[0] ) ) ] : args )
        }

    if ( hasUnits ) {
      $win.resize( update )
    }

    return update()

  }

  // Build and arrange columns
  $.fn.columns = function( opts ) {

    var self = this.addClass('clear').find('.col')
      , o = $.extend( {}, defaults, opts )

      , nth = o.colsPerRow == 1 ? '1n' : o.colsPerRow == 2 ? 'odd' : o.colsPerRow + 1 +'n'
      , $firstRowCol = self.filter(':first, :nth-child('+ nth +')')

      , setColWidth = function( width ) {
          self.css({ width: width / o.colsPerRow +'vw' })
        }
      , setMargin = function( width ) {
          if ( o.center ) {
            $firstRowCol.css({ marginLeft: (100 - width) / 2 +'vw' })
          }
        }
      , reset = function() {
          setColWidth( o.width )
          setMargin( o.width )
        }

    $firstRowCol.css('clear', 'both')

    // Responsiveness
    if ( o.breakpoints ) {
      $win.resize(function(){
        $.each( o.breakpoints, function( i, arr ) {
          if ( $win.width() <= arr[0] ) {
            setColWidth( arr[1] )
            setMargin( arr[1] )
            return false
          }
          reset()
        })
      })
    }

    // Init
    reset()
    setTimeout( function(){ $win.resize() }, 1 )

    return self.css({
      height: o.height,
      fontSize: o.fontSize +'vw'
    })

  }

  /*
   * @param min {Array} [ media, font ]. ie [ 1024, 16 ]
   * @param max {Array} [ media, font ]. ie [ 1440, 24 ]
   */
  $.columns.calcFontSize = function( min, max ) {
    var low = ( min[1] * 100 ) / min[0]
      , high = ( max[1] * 100 ) / max[0]
    return ( (low + high) / 2 ).toFixed(2)
  }

  $.columns.setDefaults = function( opts ) {
    $.extend( defaults, opts )
  }

}( jQuery, window ))

