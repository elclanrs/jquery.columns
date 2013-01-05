/**
 * jquery.columns extends the native jQuery css method
 * to be able parse viewport relative units (vh & vw only)
 * and provides a method to quickly create reponsive layouts.
 *
 * Author: Cedric Ruiz
 * Docs: https://github.com/elclanrs/jquery.columns
 * License: MIT
 */
 /*jshint asi:true */
;(function( $, window ) {

  $.columns = {} // global object

  var $win = $(window)
    , _css = $.fn.css // cache original css method

    // Default options
    , defaults = {
        colsPerRow: 3,
        breakPoints: [ [1024, 95], [2560, 45] ],
        fontSize: [16, 16],
        height: 'auto',
        center: true
      }

// ----------------------------------------------------

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

  function getNthCol( colsPerRow ) {
    return colsPerRow == 1 ? '1n' : colsPerRow == 2 ? 'odd' : colsPerRow + 1 +'n'
  }

// ----------------------------------------------------

  function Columns( el, opts ) {

    this.opts = $.extend( {}, defaults, opts )

    this.$wrap = $(el).addClass('clear')
    this.$cols = null
    this.$firstRowCol = null

    this.init()

  }

  Columns.prototype = {

    init: function() {

      var self = this

      this.$cols = this.$wrap.find('.col')
      this.$firstRowCol = this.$cols
        .filter(':first, :nth-child('+ getNthCol( this.opts.colsPerRow ) +')')

      this.$cols.css({
        height: this.opts.height,
      })

      this.$firstRowCol.css('clear', 'both')

      if ( this.opts.breakPoints ) {
        $win.on('resize.columns', function() { self.refresh() })
      }

      this.refresh()
      $win.resize()

    },

    refresh: function() {
      this.setColWidth( this.getViewportWidth() )
      this.setMargin( this.getViewportWidth() )
      this.pushCols( this.getViewportWidth() )
      this.$cols.css({
        fontSize: this.getFontRatio() +'vw'
      })
    },

    getViewportWidth: function() {

      var bp = this.opts.breakPoints
        , minRes = bp[0][0]
        , maxRes = bp[1][0]
        , minWidth = bp[1][1]
        , maxWidth = bp[0][1]
        , increment = (maxWidth - minWidth) / (maxRes - minRes)
        , curWidth = minWidth + Math.abs( $win.width() - maxRes ) * increment

      return $win.width() > maxRes ? minWidth
        : $win.width() < minRes ? maxWidth
        : curWidth

    },

    getFontRatio: function() {

      var winWidth = $win.width()
        , minFont = this.opts.fontSize[0]
        , maxFont = this.opts.fontSize[1]
        , minFontRatio = (minFont * 100) / winWidth
        , maxFontRatio = (maxFont * 100) / winWidth
        , curFont = (maxFont - minFont) / (maxFontRatio - minFontRatio)

      return curFont > maxFont || minFont == maxFont ? maxFontRatio
        : curFont < minFont ? minFontRatio
        : 1

    },

    getColWidth: function( width ) {
      return ( $win.width() * (width / 100) ) / this.opts.colsPerRow
    },

    setColWidth: function( width ) {
      this.$cols.css({ width: width / this.opts.colsPerRow +'vw' })
    },

    getMarginToLimits: function( width ) {
      return ( $win.width() - ( $win.width() * (width / 100) ) ) / 2
    },

    setMargin: function( width ) {
      if ( this.opts.center ) {
        this.$firstRowCol.css({ marginLeft: (100 - width) / 2 +'vw' })
      }
    },

    pushCols: function( width ) {

      var self = this

      this.$cols.each(function() {

        var $this = $(this)
          , push = ( /push\-(\d)/.exec( this.className ) || [,0] )[1]
          , margin = self.getColWidth( width ) * push
          , totalMargin = self.getMarginToLimits( width ) + margin
          , isFirstCol = self.$firstRowCol.filter( $this ).length

        if ( push ) {
          // 1ms timeout to run after viewport units have been parsed
          setTimeout(function() {
            $this.css({
              marginLeft: ( isFirstCol && self.opts.center ? totalMargin : margin ) +'px'
            })
          }, 1 )
        }

      })

    }

  }

  $.fn.columns = function( opts ) {
    return this.each(function () {
      if ( !$.data( this, 'columns' ) ) {
        $.data( this, 'columns', new Columns( this, opts ) )
      }
    })
  }

// ----------------------------------------------------

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

  $.columns.calcFontSize = function( min, max ) {
    var low = ( min[1] * 100 ) / min[0]
      , high = ( max[1] * 100 ) / max[0]
    return ( (low + high) / 2 ).toFixed(2)
  }

  $.columns.setDefaults = function( opts ) {
    $.extend( defaults, opts )
  }

  $.columns.quickSetup = function( opts ) {
    $.columns.setDefaults( opts )
    $('body').find('[class*="row"]').each(function() {
      var colsPerRow = +this.className.match(/row\-(\d+)/)[1]
      $(this).columns({ colsPerRow: colsPerRow })
    })
  }

  $.columns.refresh = function() {
    $win.off('resize.columns')
    $('body').find('[class*="row"]').each(function() {
      $(this).data('columns').init()
    })
  }

})( jQuery, window )
