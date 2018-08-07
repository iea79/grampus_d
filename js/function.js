// Набор переменных для определения устройства
var TempApp = {
	// Ширина экрана
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    // Определение мобильных Apple устройств
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    // Определение тач устройств
    touchDevice: function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }
};

// На основе переменных функции для определения устройства
// Обычно использую при написании условий if(isIOS()){} - если это iOS устройства...
function isLgWidth() { return $(window).width() >= TempApp.lgWidth; } // >= 1200
function isMdWidth() { return $(window).width() >= TempApp.mdWidth && $(window).width() < TempApp.lgWidth; } //  >= 992 && < 1200
function isSmWidth() { return $(window).width() >= TempApp.smWidth && $(window).width() < TempApp.mdWidth; } // >= 768 && < 992
function isXsWidth() { return $(window).width() < TempApp.smWidth; } // < 768
function isIOS() { return TempApp.iOS(); } // for iPhone iPad iPod
function isTouch() { return TempApp.touchDevice(); } // for touch device

$(document).ready(function() {

    // Хак для клика по ссылке на iOS
    if (isIOS()) {
        $(function(){$(document).on('touchend', 'a', $.noop)});
    }

	if ('flex' in document.documentElement.style) {
		// Хак для UCBrowser
		if (navigator.userAgent.search(/UCBrowser/) > -1) {
			document.documentElement.setAttribute('data-browser', 'not-flex');
		} else {		
		    // Flexbox-совместимый браузер.
			document.documentElement.setAttribute('data-browser', 'flexible');
		}
	} else {
	    // Браузер без поддержки Flexbox, в том числе IE 9/10.
		document.documentElement.setAttribute('data-browser', 'not-flex');
	}

	// Задав класс full__height элемнту на странице можно растянуть его на высоту экрана
	// Саму функцию можно вынести из $(document).ready
	function setHeiHeight() {
	    $('.full__height').css({
	        minHeight: $(window).height() + 'px'
	    });
	}
	setHeiHeight(); // устанавливаем высоту окна при первой загрузке страницы

	// Сбрасываем стандартное поведение при нажатии на ссылку с href="#", при верстке очень удобно когда ссылки пустые
	$('[href="#"]').click(function(event) {
		event.preventDefault();
	});

	// Scroll to ID // Плавный скролл к элементу при нажатии на ссылку. В ссылке указываем ID элемента
	// $('#main__menu a[href^="#"]').click( function(){ 
	// 	var scroll_el = $(this).attr('href'); 
	// 	if ($(scroll_el).length != 0) {
	// 	$('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500);
	// 	}
	// 	return false;
	// });

	// Stiky menu // Липкое меню. При прокрутке к элементу #header добавляется класс .stiky который и стилизуем
    // var HeaderTop = $('#header').offset().top;
    // $(window).scroll(function(){
    //     if( $(window).scrollTop() > HeaderTop ) {
    //         $('#header').addClass('stiky');
    //     } else {
    //         $('#header').removeClass('stiky');
    //     }
    // });

   	// gridMatch();
});

// Обрабатываем событие изменения размера окна браузера
$(window).resize(function(event) {
    var windowWidth = $(window).width();
    // Запрещаем выполнение скриптов при смене только высоты вьюпорта (фикс для скролла в IOS и Android >=v.5)
    if (TempApp.resized == windowWidth) { return; }
    TempApp.resized = windowWidth;

	// Для собственного удобства создал отдельную функцию в которую пишу все скрипты которые нужно перезапускать при смене размера экрана или ориентации устройства
	checkOnResize();
});

function checkOnResize() {
	setHeiHeight(); // обновляем высоту блока с классом full__height при изменении размеров окна
   	// gridMatch();
}

// Используется библиотека jquery.matchHeight.js для выравнивания высоты элементов
function gridMatch() {
   	$('[data-grid-match] .grid__item').matchHeight({
   		byRow: true,
   	});
}

// Самописный скриптик для "резиновой" верстки. Чтобы работало все размеры пишуться в em или %
function fontResize() {
	// Записываем в переменную текущую ширину окна браузера
    var windowWidth = $(window).width();
    // Делаем проверку ширины экрана, редактируется под макет
    if (windowWidth < 1440 && windowWidth >= 768) {
    	// Правильный размер просто подбирается сменой циферки
    	var fontSize = windowWidth/19.05;
    } else if (windowWidth < 768) {
    	// Для мобилок простая адаптация с фиксированным размером для всей ширины экрана меньше 768 пикселей
    	var fontSize = 50;
    }
	$('body').css('fontSize', fontSize + '%');
}

// Видео youtube для страницы
// В html выглядит так 
// <div class="video__wrapper js_youtube" id="Y2uDpiHRz2Q">
// 	<img src="img/путь_к_фоновому изображению" alt="" class="video__prev">
// </div>
$(function () {
	// Проверяем наличие элемента с классом js_youtube
    if ($(".js_youtube")) {
    	// Перебираем все элементы js_youtube
        $(".js_youtube").each(function () {
            // Зная идентификатор видео на YouTube, легко можно найти его миниатюру и вывести фоном
            $(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');

            // Добавляем иконку Play поверх миниатюры, чтобы было похоже на видеоплеер
            $(this).append($('<img src="img/play.svg" alt="Play" class="video__play">'));

        });

        // При клике на картинку-превьюшку или кнопку play
        $('.video__play, .video__prev').on('click', function () {
        	// Получаем ID youtube видео
            var videoId = $(this).closest('.js_youtube').attr('id');
            // создаем iframe со включенной опцией autoplay
            var iframe_url = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&autohide=1";
            // Можно завести data-атрибуты для доп параметров. не обязательно.
            if ($(this).data('params')) iframe_url += '&' + $(this).data('params');

            // Высота и ширина iframe должны быть такими же, как и у родительского блока
            var iframe = $('<iframe/>', {
                'frameborder': '0',
                'src': iframe_url,
            });

            // Выводим HTML5 плеер с YouTube поверх превьюшек
            $(this).closest('.video__wrapper').append(iframe);

        });
    }

});

// Деление чисел на разряды Например из строки 10000 получаем 10 000
// Использование: thousandSeparator(1000) или используем переменную thousandSeparator(number)
// function thousandSeparator(str) {
//     var parts = (str + '').split('.'),
//         main = parts[0],
//         len = main.length,
//         output = '',
//         i = len - 1;
    
//     while(i >= 0) {
//         output = main.charAt(i) + output;
//         if ((len - i) % 3 === 0 && i > 0) {
//             output = ' ' + output;
//         }
//         --i;
//     }

//     if (parts.length > 1) {
//         output += '.' + parts[1];
//     }
//     return output;
// };


// Хак для яндекс карт втавленных через iframe
// Страуктура:
//<div class="map__wrap" id="map-wrap">
//  <iframe style="pointer-events: none;" src="https://yandex.ru/map-widget/v1/-/CBqXzGXSOB" width="1083" height="707" frameborder="0" allowfullscreen="true"></iframe>
//</div>
// Обязательное свойство в style которое и переключет скрипт
// document.addEventListener('click', function(e) {
//     var map = document.querySelector('#map-wrap iframe')
//     if(e.target.id === 'map-wrap') {
//         map.style.pointerEvents = 'all'
//     } else {
//         map.style.pointerEvents = 'none'
//     }
// })

// Простая проверка форм на заполненность и отправка аяксом
// function formSubmit() {
//     $("[type=submit]").on('click', function (e){ 
//         e.preventDefault();
//         // Заводим переменные
//         // Ищем родительскую фору для того чтобы манипулировать элементами находящимися только внутри неё
//         var form = $(this).closest('.form');
//         // Запоминаем путь к php обработчику формы
//         var url = form.attr('action');
//         // Собираем все данные с полей формы для отправки
//         var form_data = form.serialize();
//         // Выбираем все обязательные поля по атрибуту required
//         var field = form.find('[required]');

//         // Задаем количество пустых полей по умолчанию
//         empty = 0;

//         // Перебираем каждое обязательное поле
//         field.each(function() {
//             // Если поля пустые
//             if ($(this).val() == "") {
//                 // Добавляем класс invalid
//                 $(this).addClass('invalid');
//                 // Увеличиваем счеткик пустых полей
//                 empty++;
//             // Если поля не пустые
//             } else {
//                 // Убираем класс invalid
//                 $(this).removeClass('invalid');
//                 // Добавляем класс valid если необходимо для стилизации
//                 $(this).addClass('valid');
//             }  
//         });

//         // Можно проверить пересчет пустых полей в консоли
//         // console.log(empty);

//         // Если пустых полей больше 0
//         if (empty > 0) {
//             // Останавливаем работу скрипта запрещая отправку формы
//             return false;
//         // Если пустых полей нет
//         } else {        
//             // Запускаем отправку формы без перезагрузки страницы
//             $.ajax({
//                 // Используем переменные в параметрах для отправки формы
//                 url: url,
//                 type: "POST",
//                 dataType: "html",
//                 data: form_data,
//                 // При успешной отправке
//                 // В аргумент response(произвольное название) можно записать и видеть результат ответа сервера
//                 success: function (response) {
//                     console.log(response);
//                     // Дальше несколько вариантов
//                     // Открываем окно с сообщением
//                     // $('#success').modal('show');
//                     // Открываем какую то страницу. как правило так называемую "страницу спасибо"
//                     // document.location.href = "success.html";
//                 },
//                 // При ошибке отправки
//                 error: function (response) {
//                     console.log(response);
//                     // Тоже что нибудь делаем
//                     // $('#success').modal('show');
//                     // Выводим в заготовленный блок какое то сообщение
//                     // $('#rezult').text('Проверте корректность заполнения полей формы.');
//                 }
//             });
//         }

//     });
//     // Убираем класс invalid при снятии фокуса если поле не пустое
//     $('[required]').on('blur', function() {
//         if ($(this).val() != '') {
//             $(this).removeClass('invalid');
//         }
//     });
//     // Если есть чекбокс политикой можно отключать кнопку при снятом чекбоксе добавляя к кнопке атрибут disabled 
//     $('.form__privacy input').on('change', function(event) {
//         event.preventDefault();
//         var btn = $(this).closest('.form').find('.btn');
//         if ($(this).prop('checked')) {
//             btn.removeAttr('disabled');
//             // console.log('checked');
//         } else {
//             btn.attr('disabled', true);
//         }
//     });
// }

