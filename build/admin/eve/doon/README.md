# Doon - Do On

Super light weight event driven containers.

## Why ?
Built a wonderful application in HTML/CSS/JS . Client came around with a new design . 
Suspecting that this won't be the last I created a way to not need to touch the JS when 
HTML / CSS change. I create Do On. Needed to relink the JS with the new HTML . As expected
Client did it again ( It's okay, its by the hour ). This time all I really needed to change 
was the HTML and CSS and the JS still worked . 

## Requirements
* jQuery 1.4.2+

## Example

[JS Bin](http://jsbin.com/UjAsiqa/4/edit?html,js,output)

HTML:

    <div data-do="trigger" data-on="click|mouseover|mouseout"></div>

JavaScript:

    $(window).on('trigger-init', function(e, target) {
      $(target).html('Click Me');
    }).on('trigger-click', function(e, target) {
      $(target).css('color', 'red');
    }).on('trigger-mouseout', function(e, target) {
      $(target).css('color', 'blue');
      $(target).css('font-size', '12px');
    }).on('trigger-mouseover', function(e, target) {
      $(target).css('font-size', '20px');
    });
    
    $('div').doon();
