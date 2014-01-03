(function($) {

	$.randomImage = {
		defaults : {
			// you can change these defaults to your own preferences.
			path : '../images/', // change this to the path of your images
			myImages : [ 'main001.jpg', 'main002.jpg', 'main003.jpg',
					'main004.jpg', 'main005.jpg' ]
		}
	}

	$.fn.extend({
		randomImage : function(config) {

			var config = $.extend({}, $.randomImage.defaults, config);

			return this.each(function() {
				var imageNames = config.myImages;
				var imageNamesSize = imageNames.length;
				var lotteryNumber = Math.floor(Math.random() * imageNamesSize);
				var winnerImage = imageNames[lotteryNumber];
				var fullPath = config.path + winnerImage;
				$(this).attr({
					src : fullPath,
					alt : winnerImage
				});

			});
		}

	});

})(jQuery);
