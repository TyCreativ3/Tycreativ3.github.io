/* Smarty Themes Text Rotator - Handtype Style */

$.fn.smartytext = function(opts) {


	var defaults = {
		showSpeed: 500,
		hideSpeed: 200,
		delay: 	   6000,
		separator: ','
	},
	settings = $.extend({}, defaults, opts);

	var $th = $(this),
		main_int,
		interval = settings.delay,
		words = $th.html().split(settings.separator),
		current = 0;


	// Display First Word 	
	$th.html(st_wrap_char(words[0])).find('span').hide();
	elems_show($th, settings.showSpeed);

	setInterval(function(){
		current++;
		if( current + 1 > words.length ) {
			current = 0;
		}
		st_word_anim($th, st_wrap_char(words[current]), settings.hideSpeed, settings.showSpeed);
	}, interval);

}

function st_wrap_char(word) {
	var wlength = word.length,
		output = '';

	for( var i = 0; i < wlength; i++ ) {
		output += '<span>'+word[i]+'</span>';
	}

	return output;
}

function st_word_anim(elem, current, speed, showspeed) {
	var st_int,
		word = elem.html(),
		chars = elem.find('span'),
		num;
	chars.each(function(i) {
		var letters = chars;

		setTimeout( function() {

			$(letters[(letters.length-1)-i]).fadeOut(speed/2);
			if(letters.parent().find('span:visible').length == 1) {

				setTimeout(function(){					
					elem.html(current).find('span').hide();
					elems_show(elem, showspeed);
				}, 300);
			}
		}, speed + (speed*i));
	});
}

function elems_show(elem, speed) {
	var new_chars = elem.find('span');
	new_chars.each(function(i) {
		var $th = $(this);
		setTimeout( function() {
			$th.fadeIn().css({'display':'inline-block'});
		}, speed + (speed*i));
	});
}