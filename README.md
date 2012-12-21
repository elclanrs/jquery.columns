jquery.columns extends the native jQuery css method to parse [viewport relative units](http://www.w3.org/TR/css3-values/#viewport-relative-lengths
) and provides a method to quickly create reponsive layouts.

### How to use it:

Markup:
```html
<header>
  <div class="col">
    <!-- content -->
  </div>
</header>

<article class="content">
  <div class='col'> 
    <!-- content -->
  </div>
  <div class='col'>
    <!-- content -->
  </div>
  <div class="col">
    <!-- content -->
  </div>
  <div class='col'> 
    <!-- content -->
  </div>
  <div class='col'>
    <!-- content -->
  </div>
  <div class="col">
    <!-- content -->
  </div>
</article>

<footer>
  <div class="col">
    <!-- content -->  
  </div>
</footer>
```

Set options and call plugin:
```javascript
$.columns.setDefaults({ 
  width: 60,
  center: true,
  fillAt: 1024,
  fontSize: $.columns.calcFontSize([1024, 16], [1440, 22])
              // @media-query________^     ^_____font-size
})

$('.content').columns({ colsPerRow: 3 })
$('header').columns({ colsPerRow: 1 })
$('footer').columns({ colsPerRow: 1 })
```

Configure @media-queries based on the fontSize set in the plugin. Any resolution in between min and max will be auto-adjusted.

**Note:** Since we're using JS the view might flicker for a second before auto-adjusting.

```css
@media all and (max-width: 1024px) {
  .col { 
    font-size: 16px !important;
  }
}
@media all and (min-width: 1440px) {
  .col { 
    font-size: 22px !important; 
  }
}
```

### Options:
```javascript
defaults = {
  colsPerRow: 3, // columns per row
  width: 75, // percentage of window width
  height: 'auto', // useful for some layouts, you can set it in viewport units (vh)
  center: true, // center layout
  fillAt: 1024, // Resolution at which the layout becomes 100% width (mobile)
  fontSize: 1.55 // font size in viewport units, calculate with $.columns.calcFontSize
}
```

### Using the extended css method:

With jquery.columns you can pass viewport units to the css method and it will get converted to px and updated on window.resize, so the integration is seamless.

**Note:** Make sure to pass an object when setting viewport units even if just one property.

```javascript
// Centered dialog
$('element').css({
  width: '50vw',
  height: '50vh',
  marginLeft: '25vw'
  marginTop: '25vh',
  fontSize: '5vw'
})
```


