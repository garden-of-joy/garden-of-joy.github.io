// danwin. Gallery for img
// <img ...>
/*
<div class="container img-gallery">
	<div class="row filter scrollpoint sp-effect1">
		<div class="col-xs-1 col-md-4 col-lg-3">
			<a href="#" class="thumbnail">
				<img class="img-responsive" src="assets/img/slides/img02.jpg"/>
			</a>
		</div>
 */
if (!jQuery) {
	throw new Error('Gallery plugin requires jQuery');
}

(function ($) {
	// Install plugin
	$(function () {

		// find all grids
		var grids = $('*[data-sh-grid]');
		grids.each(function (ignore, collectionInstance) {
			console.log('Gallery found: ', collectionInstance)
			var Sgallery = $(collectionInstance);
			var cols = parseInt(Sgallery.attr('data-cols') || 3);
			var colMultiplier = Math.ceil(12/cols);
			var colClass = 'col-xs-1 col-sm-'+colMultiplier;
			// var colsForRow = [];
			var rowCount = 1;
			var rowClass;

			// Selector of the target items to wrap them:
			var itemSelector = Sgallery.attr('data-item-selector') || 'img';

			// var templateId = Sgallery.attr('data-template-id');
			// var templateEl = (templateId) ? document.getElementById(templateId) : null;
			// var templateHtml = (templateEl) ? templateEl.innerHTML : '';

			Sgallery.children(itemSelector).each(function (index, item) {
				var isRowEnd = (index + 1) % cols === 0, Scell, Sitem = $(item);
				rowClass = 'rownum-'+rowCount;

				// div.col-...:
				Scell = $('<div/>')
					.addClass(colClass)
					// .addClass('scrollpoint sp-effect5')
					.addClass(rowClass);

				// Image to background:
				var Simg = Sitem.find('img');
				var src = Simg.attr('src');
				if (src) {
					Scell.css({
						'background-image': 'url('+src+')',
						'background-size':'cover',
						'background-repeat': 'no-repeat',
						'background-position': 'left top'
					});
					Simg.remove();
					Sitem.append($('<div>'));
				}

				Sitem
					.wrap(Scell);

				if (isRowEnd) {
					console.log(index, Sgallery.find('.'+rowClass));
					Sgallery
						.children('.'+rowClass)
						.wrapAll('<div class="row scrollpoint sp-effect5"></div>');
					rowCount++;
				}

			})
			// try to wrap remaining cells if their count less than the cols:
			Sgallery
				.children('.'+rowClass)
				.wrapAll('<div class="row scrollpoint sp-effect5"></div>');
			// Sgallery.wrapInner('<div class="row"></div>')

		})

		// find all galleries
		var imageGalleries = $('*[data-sh-image-gallery]');

		var galleryCount = 0;

		imageGalleries.each(function (ignore, collectionInstance) {
			var Sgallery = $(collectionInstance);
			var cols = parseInt(Sgallery.attr('data-bs-col-count') || 2);
			var colMultiplier = Math.ceil(12/cols);
			var colClass = 'col-xs-1 col-sm-'+colMultiplier;
			// var colsForRow = [];
			var rowCount = 1;
			var rowClass;

			var galleryId = 'gallery-'+ (++galleryCount);

			Sgallery.attr('id', galleryId);

			// // Selector of the target items to wrap them:
			// var itemSelector = Sgallery.attr('data-item-selector') || 'img';

			// var templateId = Sgallery.attr('data-template-id');
			// var templateEl = (templateId) ? document.getElementById(templateId) : null;
			// var templateHtml = (templateEl) ? templateEl.innerHTML : '';

			Sgallery.children('img').each(function (index, img) {
				var isRowEnd = (index + 1) % cols === 0, Scell;
				rowClass = 'rownum-'+rowCount;

				// div.col-...:
				Scell = $('<div/>')
					.addClass(colClass)
					.attr('data-cell-id', index)
					// .addClass('scrollpoint sp-effect5')
					.addClass(rowClass);

				$(img)
					.addClass('img-responsive')
					.wrap(Scell)
					.attr({
						'data-gallery-id': galleryId,
						'data-cell-id': index
					})
					// .wrap('<a href="#" class="thumbnail"></a>')
					.wrap(
						$('<a>')
							.attr('href', 'javascript:void(0)')
							.addClass('thumbnail')
						)

				if (isRowEnd) {
					console.log(index, Sgallery.find('.'+rowClass));
					Sgallery
						.children('.'+rowClass)
						.wrapAll('<div class="row scrollpoint sp-effect5"></div>');
					rowCount++;
				}

			})
			// try to wrap remaining cells if their count less than the cols:
			Sgallery
				.children('.'+rowClass)
				.wrapAll('<div class="row scrollpoint sp-effect5"></div>');
			// Sgallery.wrapInner('<div class="row"></div>')

		});
	});
	// Add modal preview window
	$(document.body).append('\
		<div id="image-gallery-preview" class="modal fade" tabindex="-1" role="dialog">\
		  <a href="javascript:void(0)" class="gallery-back-button"><i class="fa fa-arrow-left fa-lg"></i></a>\
		  <a href="javascript:void(0)" class="gallery-forward-button"><i class="fa fa-arrow-right fa-lg"></i></a>\
		  <div class="modal-dialog modal-lg" role="document">\
		    <div class="modal-content">\
		      <div class="modal-header">\
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
		        <h4 class="modal-title">&nbsp;</h4>\
		      </div>\
		      <div class="modal-body"></div>\
		    </div><!-- /.modal-content -->\
		  </div><!-- /.modal-dialog -->\
		</div><!-- /.modal -->\
		');

	// Install << >> buttons
	$('.gallery-back-button')
		.off()
		.on('click', function () {
			var Spayload = $('#image-gallery-preview .modal-body img');
			var galleryId = Spayload.attr('data-gallery-id');
			var cellId = parseInt(Spayload.attr('data-cell-id'));
			var Sgallery = $('#'+galleryId);
			var Simages = Sgallery.find('div.row>div>a>img.img-responsive');

			cellId = cellId > 0 ? cellId - 1 : Simages.length - 1;

			var newImg = Simages.get(cellId);

			console.log('next Id', cellId, newImg, Simages);

			if (newImg) {
				$('#image-gallery-preview .modal-body').html('').append($(newImg).clone());
				// var SnewImg = $(newImg);
				// Spayload.attr({
				// 	src: SnewImg.attr('src'),
				// 	'data-gallery-id': SnewImg.attr('data-gallery-id'),
				// 	'data-cell-id': SnewImg.attr('data-cell-id-id')
				// })
			}
			return false;
		});

	// Install << >> buttons
	$('.gallery-forward-button')
		.off()
		.on('click', function () {
			var Spayload = $('#image-gallery-preview .modal-body img');
			var galleryId = Spayload.attr('data-gallery-id');
			var cellId = parseInt(Spayload.attr('data-cell-id'));
			var Sgallery = $('#'+galleryId);
			var Simages = Sgallery.find('div.row>div>a>img.img-responsive');

			cellId = cellId < Simages.length - 1 ? cellId + 1 : 0;
			
			var newImg = Simages.get(cellId);

			console.log('next Id', cellId, newImg, Simages);

			if (newImg) {
				$('#image-gallery-preview .modal-body').html('').append($(newImg).clone());
				// var SnewImg = $(newImg);
				// Spayload.attr({
				// 	src: SnewImg.attr('src'),
				// 	'data-gallery-id': SnewImg.attr('data-gallery-id'),
				// 	'data-cell-id': SnewImg.attr('data-cell-id-id')
				// })
			}
			return false;
		});

	// Install handler for popup viewer:
	$('*[data-sh-image-gallery]').on('click', 'a.thumbnail', function (evt) {
		console.log('[data-sh-image-gallery]', this)
		console.log(evt);
		var Sdialog = $('#image-gallery-preview');
		var Sa = $(this);
		var Simg = Sa.children('img');
		var src = Simg.attr('src');
		var galleryId = Sa.attr('data-gallery-id');
		var cellId = Sa.attr('data-cell-id');

		console.log(Simg);

		// return
		Sdialog
			.find('.modal-body')
			.html('')
			.append(
				Simg.clone()
				// $('<img/>')
				// 	.attr({
				// 		'data-gallery-id': galleryId,
				// 		'data-cell-id': cellId
				// 	})
				// 	.addClass('img-responsive')
				// 	.attr('src', src)
				);
		Sdialog.modal('show');

	})
})(jQuery);