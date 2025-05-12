$(document).ready(function() {
	// Logo
	let minSize = 50,
	el = document.querySelector('.logo__image'),
	page = document.querySelector('html'),
	height = {

		el:el.offsetHeight-minSize,
		page: 500
	}

	document.addEventListener('scroll', () => {

		let st = page.scrollTop;
		if (st >= height.page) return;
		let percent = height.page/st,
		value = height.el/percent;
		el.style.height = height.el-value+minSize+'px';
	});
	// Menu
	$(".logo_menu, .main__menu--close").click(function() {

		$(".main__menu").toggleClass("menu__no__active");
		$("body").toggleClass("menu__active");
		return false;
	});
});