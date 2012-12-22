# jquery.columns

jquery.columns extends the native jQuery css method to be able parse [viewport relative units](http://www.w3.org/TR/css3-values/#viewport-relative-lengths
) (vh & vw only) and provides a method to quickly create reponsive layouts.

**Demo:** http://elclanrs.github.com/jquery.columns/

**Support:** IE8\*, IE9-10, Webkit, Firefox, Opera  
\* _IE8 requires polyfills for [html5](http://code.google.com/p/html5shiv/) and [media queries](https://github.com/scottjehl/Respond)._

### How to use it:

Create block containers at body level so they cover 100% width and add a class `row-X` where X is "columns per row". Then put as many `div.col` inside as you want. You can push columns using the class `push-X`.

```html
<header class="row-1">
  <div class="col">
    <!-- content -->
  </div>
</header>

<article class="row-3">
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

<footer class="row-3">
  <div class="col">
    <!-- content -->  
  </div>
  <div class="col push-1">
    <!-- content -->  
  </div>
</footer>
```

Call the plugin on `body` with some options:
```javascript

$.columns.quickSetup('body', { 
  width: 70,
  center: true,
  fontSize: $.columns.calcFontSize([1024, 16], [1440, 20])
              // @media-query________^     ^_____font-size
})

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
    font-size: 20px !important; 
  }
}
```

### Options:
```javascript
defaults = {
  colsPerRow: 3, // columns per row
  width: 60, // percentage of window width
  height: 'auto', // useful for some layouts, you can set it in viewport units (vh)
  center: true, // center layout
  breakPoints: [ [1024, 95], [1440, 80] ] // assign width percentages to different resolutions [res, width]
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


