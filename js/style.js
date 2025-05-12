$(document).ready(function() {
	// Title
	let mht = 0;
	let mhp = 0;
	// Hummer
	let point = false;
	let hammertime = new Hammer($('.manager__js-btn')[0]);
	// Cont height
	$(window).on('load resize', function() {
		$('.content').each(function() {

			let column = 0;

			$(this).find(".line-wrap").children('h3').each(function() {

				h = $(this).height();

				if (h > column) {

					column = h;
				}
			});

			$(this).find(".line-wrap").children('h3').height(column);
		});
	});
	// Hummer
	hammertime.on('pan', function(ev) {

		point = ev.center.x - window.innerWidth/2;
		point = point + 9;
		move(point);
	});

	$(window).resize(function() {
		if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			move(0);
		}
	});

	function move(point) {

		let vw = window.innerWidth/100;

		if (window.innerWidth >= 750) {

			if (point < -(100*vw - 29.4*vw - 85)/2) {
				point = -(100*vw - 29.4*vw - 85)/2;
			}

			if (point > (100*vw - 29.4*vw - 85)/2) {
				point = (100*vw - 29.4*vw - 85)/2;
			}

		} else {

			if (point < -(100*vw - 95)/2) {
				point = -(100*vw - 95)/2;
			}

			if (point > (100*vw - 95)/2) {
				point = (100*vw - 95)/2;
			}
		}

		let reversable = -point;
		let total = reversable*2;
		let percent = Math.round(parseFloat(100*point/window.innerWidth.toFixed(1)));

		$('.hints__right span').html(50 - percent);
		$('.hints__left span').html(50 + percent);
		$(".fixer__gray-image").css('width', 'calc(200% + '+total+'px)');
		$(".fixer__gray").css('width', 'calc(50% + '+point+'px');
		$(".manager__js-btn").css('left', 'calc(50% - 20px + '+point+'px)');
		$(".manager__active").css('width', 'calc(50% + '+point+'px)');
		$(".manager__divider").css('left', 'calc(50% + '+point+'px)');
		$(".content__left").css('width', 'calc(50% + '+point+'px)');
		$(".content__right").css('width', 'calc(50% - '+point+'px)');
	}
});