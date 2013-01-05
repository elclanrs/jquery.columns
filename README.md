# jquery.columns

jquery.columns extends the native jQuery css method to be able parse [viewport relative units](http://www.w3.org/TR/css3-values/#viewport-relative-lengths
) (vh & vw only) and provides a method to quickly create reponsive layouts.

**Demo:** http://elclanrs.github.com/jquery.columns/

**License:** MIT  
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

Then call the plugin:
```javascript
$.columns.quickSetup()
```

### Options:
```javascript
defaults = {
  center: true // center layout?
  breakPoints: [ [1024, 95], [2560, 45] ] // [ [min res, width percent], [max res, width percent] ]
  fontSize: [14, 18] // [min, max] in pixels
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

// You may have to trigger window.resize 
// to load the changes for the first time
$(window).resize()
```


