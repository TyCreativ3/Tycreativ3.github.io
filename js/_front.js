/* Angelina - Main JS */

var current_perc = 0,
	times = menu_item = $('#main_menu').find('li').length,
	active_part;

jQuery(window).load(function() {
	"use strict";
	knob_resize();
	vertAlign($('#countdown_block'));
	vertAlign($('#nav_wrap_inside'));
});

$(document).ready(function() {
	"use strict";

	$(window).resize(function() {
		knob_resize();		
	});

	if( $('#menu_button').length > 0 ) {


		$('#menu_button a').on('click', function() {
			"use strict";
			var nav_wrap = $('#nav_wrap');
			nav_wrap.toggleClass('visible').parents('body').toggleClass('menu-visible');
			steps_show('#nav_wrap');

			return false;
		});
	}

	if( $('#main_menu').length > 0 ) {
		$('#main_menu li a').on('click', function(){

			"use strict";
			var $th = $(this),
				cursect = $th.attr('href');

			$('#nav_wrap').removeClass('visible');
			$('body').removeClass('menu-visible');
			$('.part_content').fadeOut().find('.anims').removeClass('visible');

			if( cursect !== '#home' ) {
				$('#countdown_block').fadeOut();
				$('#site_content').fadeIn();
	
				$(cursect).fadeIn();
				steps_show(cursect);
			} else {
				$('#site_content').fadeOut();
				$('#countdown_block').fadeIn();
			}

			return false;
		});	
	}

	if( $('#subscribe_form').length > 0 ) {
		$('#subscribe_form h4').on('click', function() {
			"use strict";
			var $th = $(this);
			$th.next().slideDown();
				$th.parents('form').find('.flipInX').addClass('animated');
		});
	}

	/* Form Submiting */
	$('.form_submit').on('click', function(){
		"use strict";
		var form = $(this).parents('form');
		form.find('.form_item').removeClass('error');
		form.find('.error_block').remove();
		var post_data;
		var errors = formValidation(form),
			output;
		if( Object.keys(errors).length > 0 ) {
			showErrors(form, errors);
		} else {
			$(this).addClass('loading');
			if(form.attr('id') == 'contacts_form') {
					post_data = {
        		    'name'     : $('input[name=name]').val(),
        		    'email'    : $('input[name=email]').val(),
        		    'message'  : $('textarea[name=message]').val()
        		};

        		//Ajax post data to server
        		jQuery.post('contacts.php', post_data, function(response){	

        			$("#contacts_form .form_submit").removeClass('loading');

        		    if(response.type == 'error'){ //load json data from server and output message    
        		        output = '<div class="error_block">'+response.text+'</div>';
        		    } else{
        		        output = '<div class="success">'+response.text+'</div>';
        		        //reset values in all input fields
        		        $("#contacts_form .form_item").val('');
        		    }
        		    form.find('.form_row').slideUp();
        		    form.find(".form_results").hide().html(output).slideDown();
        		}, 'json');
    		} else {
    			post_data = {
        		    'subscribe_email': $('input[name=subscribe_email]').val(),
        		};
        		jQuery.post('subscribe.php', post_data, function(response){	
        	    	   
    		        output = '<div class="success">'+response.text+'</div>';
    		        //reset values in all input fields
    		        $("#contacts_form .form_item").val('');
    		        form.find('.form_row').slideUp();
        		    form.find(".form_results").hide().html(output).slideDown();
        		}, 'json');
    		}

		}
		return false;
	});

	if( $('#percent_ready').length > 0 ) {
		percent_inc();
	}

	if( $('#countdown').length > 0 ) {

		$('#countdown').countdown({
			until: new Date(SiteStartDate),
			format: 'DHMS',
			onTick: function(e) {
				var secs = e[6],
					mins = e[5],
					hr 	 = e[4],
					ds 	 = e[3];
				$("#countdown_ds").val(ds).trigger('change');
				$("#countdown_hr").val(hr).trigger('change');
				$("#countdown_min").val(mins).trigger('change');
				$("#countdown_sec").val(secs).trigger('change');
			}
		});

		if( $('.knob_progress').length > 0 ) {
			$('.knob').knob();
			steps_show('.knob_progress');
		}
	}

	if( $('#site_slogan span.morphtext').length > 0 ) {
		$('#site_slogan span.morphtext').smartytext();
	}

	$('#countdown_block #subscribe_form .form_submit').hover(function() {
		"use strict";
			$(this).parents('form').find('input').addClass('hover');
		}, function() {
			$(this).parents('form').find('input').removeClass('hover');
	});

	$('#site_content .part_content').each(function(){
		$(this).mCustomScrollbar({
			autoHideScrollbar: true,
			scrollbarPosition: 'outside'
		});
	});

	if( $('#gmap').length > 0 ) {
		new GMaps({
			div: '#gmap',
			lat: 41.07968, /* Latitude */
			lng: -77.028149, /* Longtitude */
			disableDefaultUI: true
		});
	}

	if( $('#site_video_bg.youtube').length > 0 ) {
		$('#site_video_bg.youtube').tubular({
			videoId: YoutubeBgCode,
			start: 30
		});
	}

	if( $('#site_video_bg.local').length > 0 ) {
		$('#site_video_bg.local').vide({
			mp4: "video/background-video.mp4", /* Local Video File Path */
		}, {
			muted: true
		});
	}

	if( $('#bg_slideshow').length > 0 ) {

		if( !$('#bg_slideshow').hasClass('controls')) {
			var mySwiper = new Swiper('#bg_slideshow',{
				loop : true,
				grabCursor: true,
				paginationClickable: false,
				keyboardControl: true,
				autoplay: false,
				speed: 1000
			});
		} else {
			$('#bg_slideshow.controls').flexslider({
				controlNav: false,
				prevText: '',
				nextText: '',
				start: function(e) {
					$('.flex-direction-nav li').append('<span></span>');
					slideControlsThumb(e);
				},
				after: function(e) {
					slideControlsThumb(e);
				}
			});
		}
	}

	if( $('body').hasClass('snowflakes') ) {
		snow_init();
	}

});


/* Forms Validation */
function formValidation(form) {
	"use strict";

	var error = {};

	if(form) {
		form.find('.form_item').each(function(){
			var $th = $(this);

			if( $th.val() != '' ) {
				if( $th.attr('type') == 'email' ) {
					var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
					if( !emailReg.test( jQuery.trim($th.val()) ) ) {
						error[$th.attr('id')] = 'not_email';
					}
				}
			} else {				
				error[$th.attr('id')] = 'empty';
			}

		});
	}
	return error;
}

/* Validation Errors */
function showErrors(form, errors) {
	"use strict";
	var error_message = ''
	for(var i in errors) {
		var form_item = form.find($('#'+i)),
			form_item_name = form_item.attr('name').replace('_', ' ');

		form_item.addClass('error');
		if( errors[i] == 'empty' )
			error_message += '<div class="error">Field '+form_item_name+' is required</div>';
		else
			error_message += '<div class="error">You entered an invalid email</div>';
	}
	if( form.find('.error_block').length > 0) {
		form.find('.error_block').html(error_message);
	} else {
		form.find('.form_results').html('<div class="error_block">'+error_message+'</div>');
	}
}

function percent_inc() {
	"use strict";
	current_perc++;
	var time = current_perc,
		perc_timeout;
	clearTimeout(perc_timeout);

	if( current_perc <= percent_ready ) {
		$('#percent_ready').html(current_perc+'%');
		perc_timeout = setTimeout(percent_inc, time);
	}
}

function steps_show(act) {
	"use strict";

	var stepsTimeout;
	clearTimeout(stepsTimeout);

	if(act) {
		active_part = act;
	}

	$(active_part+ ' .anims').each( function(i, el){
		
	stepsTimeout = setTimeout(function(){
			$(el).addClass('visible');
		}, 120 + ( i * 120 ));
	
	});
}

function knob_resize() {
	"use strict";
	if( $(window).width() < 980 ) {
		//console.log('yes');
		$('.knob').trigger('configure', {width:100, height:100});
	} else {
		//console.log('no');
		$('.knob').trigger('configure', {width:168, height:168});
	}
}

/* Vertical Alignment */
function vertAlign(elem) {
	"use strict";
	if(elem) {
		elem.css({
			'marginTop' : - elem.outerHeight()/2
		}).fadeIn();
	}
}

function slideControlsThumb( slider ) {
	"use strict";
	var cur_index = slider.currentSlide,
		prev_index = cur_index != 0 ? cur_index-1 : slider.slides.length - 1,
		prev_bg = $(slider.slides[prev_index]).css('background-image'),
		next_index = cur_index < slider.slides.length-1 ? cur_index+1 : 0,
		next_bg = $(slider.slides[next_index]).css('background-image');

		$('.flex-direction-nav li span').css({'backgroundImage': prev_bg});
		$('.flex-direction-nav li + li span').css({'backgroundImage': next_bg});
}