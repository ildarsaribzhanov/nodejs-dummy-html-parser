var request     = require('request'),
    cheerio     = require('cheerio'),
    fs          = require('fs'),
    path        = require('path'),
    res_arr     = [],
    ind         = 0,
    count_posts = 20,
    domen       = 'http://site.ru';

var news_base_url = 'http://site.ru/?p=';

// Имя файла в той же папке, где лежит файл скрипта
var file_json = path.resolve(__dirname, 'parse_file.json');

get_page_content(news_base_url + 0, 0);

function get_page_content( url, i ) {
	request(url, function ( error, response, body ) {

		if( !error ) {
			var $      = cheerio.load(body),
			    newses = $('.news-item');

			newses.each(function () {
				var self  = $(this),
				    cont  = self.find('.news-text'),
				    link  = domen + cont.find('.news-text a').attr('href'),
				    title = cont.find('.news-text a').text();

				res_arr[ind] = {
					title  : title,
					date   : '26.01.2017',
					// img  : domen + self.find('img').attr('src'),
					content: ''
				};

				get_post_content(link, ind);

				ind++;
			});

		} else {
			console.log("Произошла ошибка: " + error);
		}
	});
}

// Получение контента
function get_post_content( link, array_index ) {
	request(link, function ( error, response, body ) {

		if( !error ) {
			var $ = cheerio.load(body, {decodeEntities: false});

			res_arr[array_index].content = $('.text').html();

		} else {
			console.log("Произошла ошибка: " + error);
		}

		if( count_posts-- <= 1 ) {
			write_parse_res(file_json, JSON.stringify(res_arr));
		}
	});
}

// Сохранение на диск
function write_parse_res( file_json, str ) {

	console.log('!!!!!!!!!!!!!!!!!!!WRRIIIIIIIIIIIIIIIIIIITEW!!!!!!!!!!!!!!!!');
	fs.writeFile(file_json, str, function ( err ) {
		if( err ) {
			console.log(err);
		} else {
			console.log('Добавил все');
		}
	});
}