$(function() {

	/* slider */
	var sliderSpeed = 1000, // время за которое слайдер меняет свю позицию должен быть больше repeatTime
	repeatTime = 6000; // 3000 ms = 3 sec, время через которое слайдер меняет позицию без участия юзера
	var animated = false,
	sliderInterval = setInterval(changeSlides, repeatTime);
	$('.main__slider-item').css('transition-duration', sliderSpeed);

	$('#slider_1').click(function() {
		if (!animated) {
			animated = true;
			$('.main__slider-item').stop().animate({
				'left': "0vw"
			},sliderSpeed);

			sliderText($('.main__slider-item-1'));
			setTimeout(function() {
				animated = false;
			}, sliderSpeed);
		}
	});

	$('#slider_2').click(function() {
		if (!animated) {
			animated = true;
			$('.main__slider-item').stop().animate({
				'left': "-100vw"
			},sliderSpeed);

			sliderText($('.main__slider-item-2'));

			setTimeout(function() {
				animated = false;
			}, sliderSpeed);
		}
	});

	$('#slider_3').click(function() {
		if (!animated) {
			animated = true;
			$('.main__slider-item').stop().animate({
				'left': "-200vw"
			},sliderSpeed);
			sliderText($('.main__slider-item-3'));
			setTimeout(function() {
				animated = false;
			}, sliderSpeed);
		}
	});

	function changeSlides() {
		clearInterval(sliderInterval);

		if ($('.active-slider').hasClass('main__slider-item-1'))
				$('#slider_2').click();
		else if ($('.active-slider').hasClass('main__slider-item-2'))
				$('#slider_3').click();
			else if ($('.active-slider').hasClass('main__slider-item-3'))
		$('#slider_1').click();
				animated = true;

		setTimeout(function() {
			animated = false;
			sliderInterval = setInterval(changeSlides, repeatTime);
		}, repeatTime);

	}

	function sliderText(selector) {
		var sliderTitle = selector.find('.main__slider-title'),
		firstSubtitle = selector.find('.main__slider-subtitle').first(),
		lastSubtitle = selector.find('.main__slider-subtitle').last();

		$('.main__slider-item').removeClass('active-slider');
		selector.addClass('active-slider');

		sliderTitle.fadeOut('0');
		sliderTitle.fadeIn(sliderSpeed + 500);

		firstSubtitle.css('top', '-1000px');
		firstSubtitle.animate({
			'top':0
		},sliderSpeed + 500);


		lastSubtitle.css('right', '-10000px');
		lastSubtitle.animate({
			'right':0
		},sliderSpeed + 500);
	}

	/* slider */

	var info = $('.form__main-info');

	if (info.val().length > 11) {
		info.css('font-size', '40px');
	}
	if (info.val().length > 15) {
		info.css('font-size', '25px');
	}

	$(".form__main-info").on('change', function() {
		if (info.val().length > 11) {
			info.css('font-size', '40px');
		}
	});

	$('.copy-icon').click(function(event) {
		var range = document.createRange();
		range.selectNode(document.querySelector('.form__copy'));
		window.getSelection().addRange(range); 

		try {  
			var successful = document.execCommand('copy');  
			var msg = successful ? 'successful' : 'unsuccessful';  
			console.log('Copy email command was ' + msg);  
		} catch(err) {  
			console.log('Oops, unable to copy');  
		}  

		window.getSelection().removeAllRanges();  
	});
});