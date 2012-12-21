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
    <! content -->  
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

Configure you @media-queries based on the fonSize set in the plugin:
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

