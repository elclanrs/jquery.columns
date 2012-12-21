# jquery.columns

jquery.columns extends the native jQuery css method to parse [viewport relative units](http://www.w3.org/TR/css3-values/#viewport-relative-lengths
) (vh & vw only) and provides a method to quickly create reponsive layouts.

### How to use it:

Create block containers at body level so they cover 100% width, then put as many `div.col` inside as you want.

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
  fontSize: $.columns.calcFontSize([1024, 16], [1440, 22])
              // @media-query________^     ^_____font-size
})

$('.content').columns({ colsPerRow: 3 })
$('header, footer').columns({ colsPerRow: 1 })
```

Configure @media-queries based on the fontSize set in the plugin. Any resolution in between min and max will be auto-adjusted. If you want to change fonts on elements inside columns always use percentages or ems to keep proportions.

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
  breakPoints: [ [768, 95], [1080, 80] ] // assign width percentages to different resolutions [res, width]
  fontSize: 1.55 // font size in viewport units, calculate with $.columns.calcFontSize
}
```

### Using the extended css method:

With jquery.columns you can pass viewport units to the css method and it will be converted to px and updated on window.resize, so the integration is seamless.

**Note:** Make sure to pass an object when setting viewport units even if just one property.

```javascript
// This centers an element in the middle of the screen and
// auto-adjusts when the window is resized to keep proportions
$('element').css({
  width: '50vw',
  height: '50vh',
  marginLeft: '25vw'
  marginTop: '25vh',
  fontSize: '5vw'
})

$(window).resize() // you may have to trigger window.resize to load the changes
```


