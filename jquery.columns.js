;(function( $, window ) {

  $.columns = {} // global object

  var $win = $(window)
    , _css = $.fn.css // cache original css method

    // Default options
    , defaults = {
        colsPerRow: 3,
        width: 70, // percent of window
        breakpoints: [ [1024, 95], [1440, 80] ],
        height: 'auto',
        center: true,
        fontSize: 1.55
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

  function Plugin( el, opts ) {

    this.opts = $.extend( {}, defaults, opts )

    this.$wrap = $(el).addClass('clear')
    this.$cols = null
    this.$firstRowCol = null

    this.curWidth = null

    this.init()

  }

  Plugin.prototype = {

    init: function() {

      var self = this

      this.$cols = this.$wrap.find('.col')
      this.$firstRowCol = this.$cols
        .filter(':first, :nth-child('+ getNthCol( this.opts.colsPerRow ) +')')

      this.$cols.css({
        height: this.opts.height,
        fontSize: this.opts.fontSize +'vw'
      })

      this.$firstRowCol.css('clear', 'both')

      if ( this.opts.breakpoints ) {
        $win.on('resize.columns', function() { self.resize() })
      }

      this.reset()
      $win.resize()

    },

    reset: function() {
      this.setColWidth( this.opts.width )
      this.setMargin( this.opts.width )
      this.pushCols( this.opts.width )
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
              marginLeft: ( isFirstCol && self.opts.center ? totalMargin : margin ) +'px',
            })
          }, 1 )
        }

      })

    },

    resize: function() {
      var self = this
      $.each( self.opts.breakpoints, function( i, arr ) {
        if ( $win.width() <= arr[0] ) {
          self.setColWidth( arr[1] )
          self.setMargin( arr[1] )
          self.pushCols( arr[1] )
          return false
        }
        self.reset()
      })
    }

  }

  $.fn.columns = function( opts ) {
    return this.each(function () {
      if ( !$.data( this, 'columns' ) ) {
        $.data( this, 'columns', new Plugin( this, opts ) )
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
