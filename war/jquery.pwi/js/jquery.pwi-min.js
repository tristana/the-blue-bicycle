/**
 * Picasa Webalbum Integration jQuery plugin This library was inspired aon pwa
 * by Dieter Raber
 * 
 * @name jquery.pwi.js
 * @author Jeroen Diderik - http://www.jdee.nl/
 * @author Johan Borkhuis - http://www.borkhuis.com/
 * @revision 2.0.0 Beta
 * @date December 18, 2011
 * @copyright (c) 2010-2011 Jeroen Diderik(www.jdee.nl)
 * @license Creative Commons Attribution-Share Alike 3.0 Netherlands License -
 *          http://creativecommons.org/licenses/by-sa/3.0/nl/
 * @Visit http://pwi.googlecode.com/ for more informations, discussions etc
 *        about this library
 */
function formatPhotoTitleColorBox() {
	var a = this.title;
	if (this.parentNode.childNodes && this.parentNode.childNodes.length > 1) {
		var b = $(".captiontext", this.parentNode);
		if (b.length > 0) {
			a = b[0].innerHTML
		}
		var c = $(".downloadlink", this.parentNode);
		if (c.length > 0) {
			return a + "  " + "Download".link(c[0].href)
		}
	}
	return a
}
function mapOverviewCallback() {
	var a = {
		zoom : 1,
		center : new google.maps.LatLng(0, 0),
		mapTypeId : google.maps.MapTypeId.HYBRID
	};
	var b = new google.maps.Map(document.getElementById("map_canvas"), a);
	var c = new google.maps.LatLngBounds;
	var d = new Array;
	for (i = 0; i < $.fn.pwi.additionalMapsSettings.length; i++) {
		var e = $.fn.pwi.additionalMapsSettings[i];
		var f = e.georss$where.gml$Point.gml$pos.$t.split(" ");
		var g = parseFloat(f[0]);
		var h = parseFloat(f[1]);
		for (j = i + 1; j < $.fn.pwi.additionalMapsSettings.length; j++) {
			var k = $.fn.pwi.additionalMapsSettings[j].georss$where.gml$Point.gml$pos.$t
					.split(" ");
			if (Math.abs(g - parseFloat(k[0])) < 1e-4
					&& Math.abs(h - parseFloat(k[1])) < 1e-4) {
				g += 1e-4;
				h += 1e-4
			}
		}
		var l = {};
		l.latitude = g;
		l.longitude = h;
		l.img = e.media$group.media$thumbnail[0].url;
		l.summary = e.summary.$t.replace(/\n/g, "<br />\n");
		d.push(l)
	}
	$.each(d, function(a, d) {
		var e = new google.maps.LatLng(d.latitude, d.longitude);
		var f = new google.maps.Marker({
			position : e,
			map : b
		});
		var g = "<div id='content'><img src='" + d.img + "' />" + d.summary
				+ "</div>";
		var h = new google.maps.InfoWindow({
			content : g
		});
		google.maps.event.addListener(f, "click", function() {
			h.open(b, f)
		});
		c.extend(e)
	});
	b.fitBounds(c)
}
function formatPhotoTitleFancyBox() {
	var a = this.element.title;
	if (this.element.parentNode.childNodes
			&& this.element.parentNode.childNodes.length > 1) {
		var b = $(".captiontext", this.element.parentNode);
		if (b.length > 0) {
			a = b[0].innerHTML
		}
		var c = $(".downloadlink", this.element.parentNode);
		if (c.length > 0) {
			var d = '<a style="color: #FFF;" href="' + c[0].href
					+ '">Download</a>';
			a = a + "  " + d
		}
	}
	this.title = a
}
(function(a) {
	var b, c = {};
	a.fn.pwi = function(c) {
		function w(b, c) {
			if (b) {
				if (e.loadingImage.length > 0) {
					a(e.loadingImage).show()
				}
				document.body.style.cursor = "wait";
				if (a.blockUI) {
					d.block(e.blockUIConfig)
				}
			} else {
				if (e.loadingImage.length > 0) {
					a(e.loadingImage).hide()
				}
				document.body.style.cursor = "default";
				if (a.blockUI) {
					d.unblock()
				}
				d.html(c)
			}
		}
		function v() {
			w(true, "");
			var b = f.picasaUrl + e.username
					+ (e.album !== "" ? "/album/" + e.album : "")
					+ "?kind=photo&max-results=" + e.maxResults
					+ "&alt=json&q="
					+ (e.authKey !== "" ? "&authkey=" + e.authKey : "")
					+ (e.keyword !== "" ? "&tag=" + e.keyword : "")
					+ "&imgmax=d&thumbsize=" + e.thumbSize
					+ (e.thumbCrop ? "c" : "u") + "," + t(e.photoSize);
			a.getJSON(b, "callback=?", p);
			return d
		}
		function u() {
			if (e.photostore[e.album]) {
				o(e.photostore[e.album])
			} else {
				var b = f.picasaUrl + e.username
						+ (e.album !== "" ? "/album/" + e.album : "")
						+ "?kind=photo&alt=json"
						+ (e.authKey !== "" ? "&authkey=" + e.authKey : "")
						+ (e.keyword !== "" ? "&tag=" + e.keyword : "")
						+ "&imgmax=d&thumbsize=" + e.thumbSize
						+ (e.thumbCrop ? "c" : "u") + "," + t(e.photoSize);
				w(true, "");
				a.getJSON(b, "callback=?", o)
			}
			return d
		}
		function t(b) {
			var c = [ 94, 110, 128, 200, 220, 288, 320, 400, 512, 576, 640,
					720, 800, 912, 1024, 1152, 1280, 1440, 1600 ];
			if (e.photoSize === "auto") {
				var d = a(window).height();
				var f = a(window).width();
				var g = d > f ? f : d;
				for ( var h = 1; h < c.length; h++) {
					if (g < c[h]) {
						return c[h - 1]
					}
				}
			} else {
				return b
			}
		}
		function s() {
			if (e.albumstore.feed) {
				n(e.albumstore)
			} else {
				w(true, "");
				var b = f.picasaUrl + e.username + "?kind=album&access="
						+ e.albumTypes + "&alt=json&thumbsize="
						+ e.albumThumbSize + (e.albumCrop ? "c" : "u");
				a.getJSON(b, "callback=?", n)
			}
			return d
		}
		function r(a) {
			a.stopPropagation();
			a.preventDefault();
			e.onclickThumb(a)
		}
		function q(a) {
			a.stopPropagation();
			a.preventDefault();
			e.onclickAlbumThumb(a)
		}
		function p(b) {
			var c = a("<div/>"), d = b.feed ? b.feed.entry.length : 0, g = 0;
			var h = e.username.replace(/[@\.]/g, "_");
			k(b.feed.entry, e.sortPhotos);
			while (g < e.maxResults && g < d) {
				var i = m(b.feed.entry[g], false, h);
				c.append(i);
				g++
			}
			c.append(f.clearDiv);
			var j = a("div.pwi_photo", c).css(e.thumbCss);
			if (e.popupPlugin === "fancybox" || e.popupPlugin === "colorbox") {
				e.popupExt(j.find("a[rel='lb-" + h + "']"));
				e.popupExt(j.find("a[rel='yt-" + h + "']"), "yt");
				e.popupExt(j.find("a[rel='map-" + h + "']"), "map");
				var j = a(".pwi_overviewmap", c).css(e.thumbCss);
				e.popupExt(j.find("a[rel='map_overview-" + h + "']"),
						"map_overview")
			} else if (e.popupPlugin === "slimbox") {
				j.find("a[rel='lb-" + h + "']").slimbox(
						e.slimbox_config,
						function(b) {
							var c = b.title;
							if (b.parentNode.childNodes
									&& b.parentNode.childNodes.length > 1) {
								var d = a(".captiontext", b.parentNode);
								if (d.length > 0) {
									c = d[0].innerHTML
								}
								var e = a(".downloadlink", b.parentNode);
								if (e.length > 0) {
									var f = '<a href="' + e[0].href
											+ '">Download</a>';
									c = c + "  " + f
								}
							}
							return [ b.href, c ]
						})
			}
			w(false, c);
			l("div.pwi_photo")
		}
		function o(b) {
			var c, d, g = "", h = b.feed.openSearch$totalResults.$t, j = "", n = "", o = b.feed.gphoto$location === undefined ? ""
					: b.feed.gphoto$location.$t, p, q = i(b.feed.gphoto$timestamp === undefined ? ""
					: b.feed.gphoto$timestamp.$t), r = h == "1" ? false : true;
			var t = e.username.replace(/[@\.]/g, "_");
			if (b.feed.subtitle === undefined) {
				p = ""
			} else {
				var v = b.feed.subtitle.$t
						.match(/\[keywords\s*:\s*.*\s*\](.*)/);
				if (v) {
					p = v[1]
				} else {
					p = b.feed.subtitle.$t
				}
			}
			j = b.feed.title === "undefined" || e.albumTitle.length > 0 ? e.albumTitle
					: b.feed.title.$t;
			c = a("<div/>");
			if (e.mode != "album" && e.mode != "keyword") {
				g = a(
						"<div class='pwi_album_backlink'>" + e.labels.albums
								+ "</div>").bind("click.pwi", function(a) {
					a.stopPropagation();
					s();
					return false
				});
				c.append(g)
			}
			if (e.showAlbumDescription) {
				d = a("<div class='pwi_album_description'/>");
				d.append("<div class='title'>" + j + "</div>");
				d
						.append("<div class='details'>" + h + " "
								+ (r ? e.labels.photos : e.labels.photo)
								+ (e.showAlbumdate ? ", " + q : "")
								+ (e.showAlbumLocation && o ? ", " + o : "")
								+ "</div>");
				d.append("<div class='description'>" + p + "</div>");
				c.append(d)
			}
			if (e.popupPlugin !== "slimbox" && e.showPhotoLocation
					&& typeof google != "undefined") {
				var x = a.grep(b.feed.entry, function(a, b) {
					if (a.georss$where && a.georss$where.gml$Point
							&& a.georss$where.gml$Point.gml$pos) {
						return true
					} else {
						return false
					}
				});
				var y = a("<div class='pwi_overviewmap' />");
				var z = a("<a class='fancybox.inline' href='#map_canvas' rel='map_overview-"
						+ t + "' >" + e.labels.showMap + "</a>");
				if (a.browser.msie && parseFloat(a.browser.version) < 8) {
					z[0].href = "#map_canvas"
				}
				y.append(z);
				c.append(y);
				c.append(f.clearDiv);
				var A = a("<div style='display:none' />");
				var B = a(window).height() * .75;
				var C = a(window).width() * .75;
				A.append("<div id='map_canvas' style='width: " + C
						+ "px; height: " + B + "px' />");
				c.append(A);
				a.fn.pwi.additionalMapsSettings = x
			}
			if (h > e.maxResults) {
				$pageCount = h / e.maxResults;
				var D = a("<div class='pwi_prevpage'/>").text(e.labels.prev), E = a(
						"<div class='pwi_nextpage'/>").text(e.labels.next);
				n = a("<div class='pwi_pager'/>");
				if (e.page > 1) {
					D.addClass("link").bind("click.pwi", function(a) {
						a.stopPropagation();
						e.page = parseInt(e.page, 10) - 1;
						u();
						return false
					})
				}
				n.append(D);
				for ( var F = 1; F < $pageCount + 1; F++) {
					if (F == e.page) {
						g = "<div class='pwi_pager_current'>" + F + "</div> "
					} else {
						g = a("<div class='pwi_pager_page'>" + F + "</div>")
								.bind("click.pwi", F, function(a) {
									a.stopPropagation();
									e.page = a.data;
									u();
									return false
								})
					}
					n.append(g)
				}
				if (e.page < $pageCount) {
					E.addClass("link").bind("click.pwi", function(a) {
						a.stopPropagation();
						e.page = parseInt(e.page, 10) + 1;
						u();
						return false
					})
				}
				n.append(E);
				n.append(f.clearDiv)
			}
			if (n.length > 0
					&& (e.showPager === "both" || e.showPager === "top")) {
				c.append(n)
			}
			k(b.feed.entry, e.sortPhotos);
			var G = (e.page - 1) * e.maxResults;
			var H = e.maxResults * e.page;
			for ( var I = 0; I < h; I++) {
				var J = m(b.feed.entry[I], !(I >= G && I < H), t);
				c.append(J)
			}
			if (n.length > 0
					&& (e.showPager === "both" || e.showPager === "bottom")) {
				c.append(n.clone(true))
			}
			if (e.showPermaLink) {
				c.append(f.clearDiv);
				var K = a("<div id='permalinkenable' class='pwi_nextpage'/>")
						.text(e.labels.showPermaLink).bind("click.pwi", F,
								function(b) {
									b.stopPropagation();
									a("#permalinkbox").show();
									a("#permalinkenable").hide();
									return false
								});
				var L = document.URL.split("?", 2);
				var M = L[0] + "?pwi_album_selected=" + b.feed.gphoto$name.$t
						+ "&pwi_albumpage=" + e.page;
				c.append(K);
				var N = a("<div style='display:none;' id='permalinkbox' />");
				var O = a("<form />");
				var P = a(
						"<input type='text' size='40' name='PermaLink' readonly />")
						.val(M);
				O.append(P);
				N.append(O);
				c.append(N)
			}
			e.photostore[e.album] = b;
			var Q = a(".pwi_photo", c).css(e.thumbCss);
			if (e.popupPlugin === "fancybox" || e.popupPlugin === "colorbox") {
				e.popupExt(Q.find("a[rel='lb-" + t + "']"));
				e.popupExt(Q.find("a[rel='yt-" + t + "']"), "yt");
				e.popupExt(Q.find("a[rel='map-" + t + "']"), "map");
				var Q = a(".pwi_overviewmap", c).css(e.thumbCss);
				e.popupExt(Q.find("a[rel='map_overview-" + t + "']"),
						"map_overview")
			} else if (e.popupPlugin === "slimbox") {
				Q.find("a[rel='lb-" + t + "']").slimbox(
						e.slimbox_config,
						function(b) {
							var c = b.title;
							if (b.parentNode.childNodes
									&& b.parentNode.childNodes.length > 1) {
								var d = a(".captiontext", b.parentNode);
								if (d.length > 0) {
									c = d[0].innerHTML
								}
								var e = a(".downloadlink", b.parentNode);
								if (e.length > 0) {
									var f = '<a href="' + e[0].href
											+ '">Download</a>';
									c = c + "  " + f
								}
							}
							return [ b.href, c ]
						})
			}
			c.append(f.clearDiv);
			w(false, c);
			l("div.pwi_photo")
		}
		function n(b) {
			var c = a("<div/>"), d = 0;
			var g, h;
			if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)/i) == null) {
				g = new Date(e.albumStartDateTime);
				if (isNaN(g)) {
					g = new Date(e.albumStartDateTime.replace(/-/g, "/"))
				}
				h = new Date(e.albumEndDateTime);
				if (isNaN(h)) {
					h = new Date(e.albumEndDateTime.replace(/-/g, "/"))
				}
			} else {
				g = new Date(e.albumStartDateTime.replace(/-/g, "/"));
				h = new Date(e.albumEndDateTime.replace(/-/g, "/"))
			}
			k(b.feed.entry, e.sortAlbums);
			var j = 0;
			var m = a
					.grep(
							b.feed.entry,
							function(b, c) {
								if (c >= e.albumMaxResults)
									return false;
								var d = new Date(Number(b.gphoto$timestamp.$t));
								if ((a.inArray(b.gphoto$name.$t, e.albums) > -1 || e.albums.length === 0)
										&& a.inArray(b.gphoto$name.$t,
												e.removeAlbums) == -1
										&& (b.gphoto$albumType === undefined || a
												.inArray(b.gphoto$albumType.$t,
														e.removeAlbumTypes) == -1)
										&& (e.albumStartDateTime == "" || d >= g)
										&& (e.albumEndDateTime == "" || d <= h)) {
									var f = true;
									if (e.albumKeywords.length > 0) {
										f = false;
										var i = b.summary.$t
												.match(/\[keywords\s*:\s*(.*)\s*\]/);
										if (i) {
											var k = new Array;
											var l = i[1].split(/,/);
											for ( var m in l) {
												var n = l[m]
														.match(/\s*['"](.*)['"]\s*/);
												if (n) {
													k.push(n[1])
												}
											}
											if (k.length > 0) {
												f = true;
												for ( var m in e.albumKeywords) {
													if (a.inArray(
															e.albumKeywords[m],
															k) < 0) {
														f = false;
														break
													}
												}
											}
										}
									}
									if (f == false)
										return false;
									j++;
									if (j > e.albumsPerPage * e.albumPage
											|| j <= e.albumsPerPage
													* (e.albumPage - 1))
										return false;
									else
										return true
								}
								return false
							});
			if (m.length == 0) {
				c = a("<div class='pwi_album_description'/>");
				c.append("<div class='title'>" + e.labels.noalbums + "</div>");
				w(false, c);
				return
			}
			a
					.each(
							m,
							function(b, d) {
								var f = a("<div class='pwi_album' style='cursor: pointer; "
										+ (e.albumThumbAlign ? "width:"
												+ (e.albumThumbSize + 1)
												+ "px;" : "") + "'/>");
								f
										.bind(
												"click.pwi",
												d,
												function(a) {
													a.stopPropagation();
													e.page = 1;
													e.album = a.data.gphoto$name.$t;
													if (typeof e.onclickAlbumThumb === "function") {
														e.onclickAlbumThumb(a)
													} else {
														u()
													}
													return false
												});
								if (e.showAlbumThumbs) {
									var g = d.media$group.media$thumbnail[0];
									f.append("<img src='" + g.url
											+ "' height='" + g.height
											+ "' width='" + g.width + "'/>")
								}
								if (e.showAlbumTitles) {
									var h = a("<div class='pwi_album_title'/>");
									h
											.append((d.title.$t.length > e.showAlbumTitlesLength ? d.title.$t
													.substring(0,
															e.showCaptionLength)
													: d.title.$t)
													+ "<br/>"
													+ (e.showAlbumdate ? i(d.gphoto$timestamp.$t)
															: "")
													+ (e.showAlbumPhotoCount ? "    "
															+ d.gphoto$numphotos.$t
															+ " "
															+ (d.gphoto$numphotos.$t == "1" ? e.labels.photo
																	: e.labels.photos)
															: ""));
									f.append(h)
								}
								c.append(f)
							});
			c.append(f.clearDiv);
			if (j > e.albumsPerPage) {
				var o = j / e.albumsPerPage;
				var p = a("<div class='pwi_prevpage'/>").text(e.labels.prev), q = a(
						"<div class='pwi_nextpage'/>").text(e.labels.next);
				$navRow = a("<div class='pwi_pager'/>");
				if (e.albumPage > 1) {
					p.addClass("link").bind("click.pwi", function(a) {
						a.stopPropagation();
						e.albumPage = parseInt(e.albumPage, 10) - 1;
						n(b);
						return false
					})
				}
				$navRow.append(p);
				for ( var r = 1; r < o + 1; r++) {
					if (r == e.albumPage) {
						tmp = "<div class='pwi_pager_current'>" + r + "</div> "
					} else {
						tmp = a("<div class='pwi_pager_page'>" + r + "</div>")
								.bind("click.pwi", r, function(a) {
									a.stopPropagation();
									e.albumPage = a.data;
									n(b);
									return false
								})
					}
					$navRow.append(tmp)
				}
				if (e.albumPage < o) {
					q.addClass("link").bind("click.pwi", function(a) {
						a.stopPropagation();
						e.albumPage = parseInt(e.albumPage, 10) + 1;
						n(b);
						return false
					})
				}
				$navRow.append(q);
				$navRow.append(f.clearDiv);
				if ($navRow.length > 0
						&& (e.showPager === "both" || e.showPager === "top")) {
					c.prepend($navRow.clone(true))
				}
				if ($navRow.length > 0
						&& (e.showPager === "both" || e.showPager === "bottom")) {
					c.append($navRow)
				}
			}
			e.albumstore = b;
			w(false, c);
			l("div.pwi_album")
		}
		function m(b, c, d) {
			var f, g = "", h = "", i = "", k;
			if (b.summary) {
				var l = b.summary.$t.match(/\[youtube\s*:\s*(.*)\s*\](.*)/);
				if (l) {
					i = l[1];
					h = l[2].replace(/[\r\n\t\s]+/g, " ");
					k = l[2].replace(/[\n]/g, "<br/>")
				} else {
					h = b.summary.$t.replace(/[\r\n\t\s]+/g, " ");
					k = b.summary.$t.replace(/[\n]/g, "<br/>")
				}
			}
			if (e.showPhotoDate) {
				if (b.exif$tags && b.exif$tags.exif$time) {
					g = j(b.exif$tags.exif$time.$t) + " "
				}
			}
			g += h.replace(new RegExp("'", "g"), "&#39;");
			var m = b.media$group.media$thumbnail[0];
			var n = b.media$group.media$thumbnail[1];
			if (c) {
				f = a("<div class='pwi_photo' style='display: none'/>");
				if (i == "") {
					f.append("<a href='" + n.url + "' rel='lb-" + d
							+ "' title='" + g + "'></a>")
				}
			} else {
				f = a("<div class='pwi_photo' style='cursor: pointer;'/>");
				if (i == "" || e.popupPlugin === "slimbox") {
					f.append("<a href='"
							+ n.url
							+ "' rel='lb-"
							+ d
							+ "' title='"
							+ g
							+ (i == "" ? "" : " (" + e.labels.videoNotSupported
									+ ")") + "'><img src='" + m.url
							+ "' height='" + m.height + "' width='" + m.width
							+ "'/></a>")
				} else {
					f.append("<a class='"
							+ (e.popupPlugin === "fancybox" ? "fancybox.iframe"
									: "iframe")
							+ "' href='http://www.youtube.com/embed/" + i
							+ "?autoplay=1&rel=0&hd=1&autohide=1' rel='yt-" + d
							+ "' title='" + g + "'><img id='main' src='"
							+ m.url + "' height='" + m.height + "' width='"
							+ m.width + "'/>" + "<img id='video' src='"
							+ e.videoBorder + "' height='" + m.height
							+ "' /></a>")
				}
				if (e.showPhotoLocation || e.showPhotoCaption) {
					f.append("<br/>");
					if (e.popupPlugin !== "slimbox" && e.showPhotoLocation
							&& e.mapIconLocation != "" && b.georss$where
							&& b.georss$where.gml$Point
							&& b.georss$where.gml$Point.gml$pos) {
						var o = a("<a class='"
								+ (e.popupPlugin === "fancybox" ? "fancybox.iframe"
										: "iframe")
								+ "' href='http://maps.google.com/?output=embed&t=h&z=15&q="
								+ b.georss$where.gml$Point.gml$pos.$t
								+ "' rel='map-" + e.username + "'>"
								+ "<img src='" + e.mapIconLocation + "'></a>");
						f.append(o)
					}
					if (e.showPhotoCaption) {
						if (e.showPhotoCaptionDate && e.showPhotoDate) {
							h = g
						}
						if (h.length > e.showCaptionLength) {
							h = h.substring(0, e.showCaptionLength)
						}
						if (e.showPhotoDownload) {
							h += '<a href="'
									+ b.media$group.media$content[0].url + '">'
									+ e.labels.downloadphotos + "</a>"
						}
						f.append(h)
					}
				}
				if (typeof e.onclickThumb === "function") {
					var p = b;
					f.bind("click.pwi", p, r)
				}
			}
			if (e.showPhotoDownloadPopup) {
				var q = a("<div style='display: none'/>");
				q.append("<a class='downloadlink' href='"
						+ b.media$group.media$content[0].url + "'/>");
				f.append(q)
			}
			var s = a("<div style='display: none'/>");
			s.append("<a class='captiontext'>" + k + "</a>");
			f.append(s);
			return f
		}
		function l(b) {
			var c = 0;
			var d = 0;
			a(b).each(function(a, b) {
				if (b.clientHeight > c) {
					c = b.clientHeight
				}
				if (b.clientWidth > d) {
					d = b.clientWidth
				}
			});
			a(b).css("height", c + 2 + "px");
			if (e.thumbAlign) {
				a(b).css("width", d + 2 + "px")
			}
		}
		function k(a, b) {
			function f(a, b) {
				var c = a.title.$t.toLowerCase();
				var d = b.title.$t.toLowerCase();
				if (c > d) {
					return -1
				}
				if (c < d) {
					return 1
				}
				return 0
			}
			function e(a, b) {
				var c = a.title.$t.toLowerCase();
				var d = b.title.$t.toLowerCase();
				if (c < d) {
					return -1
				}
				if (c > d) {
					return 1
				}
				return 0
			}
			function d(a, b) {
				return Number(b.gphoto$timestamp.$t)
						- Number(a.gphoto$timestamp.$t)
			}
			function c(a, b) {
				return Number(a.gphoto$timestamp.$t)
						- Number(b.gphoto$timestamp.$t)
			}
			if (b === "none")
				return;
			switch (b) {
			case "ASC_DATE":
				a.sort(c);
				break;
			case "DESC_DATE":
				a.sort(d);
				break;
			case "ASC_NAME":
				a.sort(e);
				break;
			case "DESC_NAME":
				a.sort(f);
				break
			}
		}
		function j(a) {
			var b = new Date(Number(a));
			$year = b.getUTCFullYear();
			if ($year < 1e3) {
				$year += 1900
			}
			if (b == "Invalid Date") {
				return a
			} else {
				if (b.getUTCHours() == 0 && b.getUTCMinutes() == 0
						&& b.getUTCSeconds() == 0) {
					return b.getUTCDate() + "-" + (b.getUTCMonth() + 1) + "-"
							+ $year
				} else {
					return b.getUTCDate()
							+ "-"
							+ (b.getUTCMonth() + 1)
							+ "-"
							+ $year
							+ " "
							+ b.getUTCHours()
							+ ":"
							+ (b.getUTCMinutes() < 10 ? "0" + b.getUTCMinutes()
									: b.getUTCMinutes())
				}
			}
		}
		function i(a) {
			var b = new Date(Number(a)), c = b.getUTCFullYear();
			if (c < 1e3) {
				c += 1900
			}
			return b.getUTCDate() + "-" + (b.getUTCMonth() + 1) + "-" + c
		}
		function h() {
			if (e.username === "") {
				alert("Make sure you specify at least your username." + "\n"
						+ "See http://pwi.googlecode.com for more info");
				return
			}
			if (e.useQueryParameters) {
				var a = document.URL.split("?", 2);
				if (a.length == 2) {
					var b = a[1].split("&");
					var c = false;
					var d = 1;
					for ($queryParam in b) {
						var f = b[$queryParam].split("=", 2);
						if (f.length == 2) {
							switch (f[0]) {
							case "pwi_album_selected":
								e.mode = "album";
								e.album = f[1];
								c = true;
								break;
							case "pwi_albumpage":
								d = f[1];
								break;
							case "pwi_showpermalink":
								e.showPermaLink = true;
								break
							}
						}
					}
					if (c) {
						e.page = d;
						e.showPermaLink = false
					}
				}
			}
			switch (e.mode) {
			case "latest":
				v();
				break;
			case "album":
			case "keyword":
				u();
				break;
			default:
				s();
				break
			}
		}
		function g() {
			e = c;
			ts = (new Date).getTime();
			e.id = ts;
			f = a.fn.pwi.strings;
			d = a("<div id='pwi_" + ts + "'/>").appendTo(b);
			d.addClass("pwi_container");
			h();
			return false
		}
		var d, e = {}, f = {};
		c = a.extend(true, {}, a.fn.pwi.defaults, c);
		if (c.popupPlugin == "") {
			if (a.fn.fancybox) {
				c.popupPlugin = "fancybox"
			} else if (a.fn.colorbox) {
				c.popupPlugin = "colorbox"
			} else if (a.fn.slimbox) {
				c.popupPlugin = "slimbox"
			}
		}
		if (c.popupExt == "") {
			if (c.popupPlugin === "fancybox") {
				c.popupExt = function(a, b) {
					b = typeof b != "undefined" ? b : "lb";
					if (b === "lb") {
						a.fancybox(c.fancybox_config.config_photos)
					} else if (b === "yt") {
						a.fancybox(c.fancybox_config.config_youtube)
					} else if (b === "map") {
						a.fancybox(c.fancybox_config.config_maps)
					} else if (b === "map_overview") {
						a.fancybox(c.fancybox_config.config_map_overview)
					}
				}
			} else if (c.popupPlugin === "colorbox") {
				c.popupExt = function(a, b) {
					b = typeof b != "undefined" ? b : "lb";
					if (b === "lb") {
						a.colorbox(c.colorbox_config.config_photos)
					} else if (b === "yt") {
						a.colorbox(c.colorbox_config.config_youtube)
					} else if (b === "map") {
						a.colorbox(c.colorbox_config.config_maps)
					} else if (b === "map_overview") {
						a.colorbox(c.colorbox_config.config_map_overview)
					}
				}
			}
		}
		b = this;
		g()
	};
	a.fn.pwi.defaults = {
		mode : "albums",
		username : "",
		album : "",
		authKey : "",
		albums : [],
		keyword : "",
		albumKeywords : [],
		albumStartDateTime : "",
		albumEndDateTime : "",
		albumCrop : true,
		albumTitle : "",
		albumThumbSize : 160,
		albumThumbAlign : true,
		albumMaxResults : 999,
		albumsPerPage : 999,
		albumPage : 1,
		albumTypes : "public",
		page : 1,
		photoSize : "auto",
		maxResults : 50,
		showPager : "bottom",
		thumbSize : 72,
		thumbCrop : false,
		thumbAlign : false,
		thumbCss : {
			margin : "5px"
		},
		onclickThumb : "",
		onclickAlbumThumb : "",
		sortAlbums : "none",
		sortPhotos : "none",
		removeAlbums : [],
		removeAlbumTypes : [],
		showAlbumTitles : true,
		showAlbumTitlesLength : 9999,
		showAlbumThumbs : true,
		showAlbumdate : true,
		showAlbumPhotoCount : true,
		showAlbumDescription : true,
		showAlbumLocation : true,
		showPhotoCaption : false,
		showPhotoCaptionDate : false,
		showCaptionLength : 9999,
		showPhotoDownload : false,
		showPhotoDownloadPopup : false,
		showPhotoDate : true,
		showPermaLink : false,
		showPhotoLocation : false,
		mapIconLocation : "",
		mapSize : .75,
		useQueryParameters : true,
		loadingImage : "",
		videoBorder : "images/video.jpg",
		labels : {
			photo : "photo",
			photos : "photos",
			downloadphotos : "Download photos",
			albums : "Back to albums",
			noalbums : "No albums available",
			page : "Page",
			prev : "Previous",
			next : "Next",
			showPermaLink : "Show PermaLink",
			showMap : "Show Map",
			videoNotSupported : "Video not supported"
		},
		months : [ "January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November",
				"December" ],
		fancybox_config : {
			config_photos : {
				closeClick : false,
				nextEffect : "none",
				loop : false,
				beforeLoad : formatPhotoTitleFancyBox,
				helpers : {
					buttons : {}
				}
			},
			config_youtube : {
				arrows : false,
				fitToView : false,
				width : "90%",
				height : "90%",
				autoSize : false,
				closeClick : false,
				openEffect : "none",
				closeEffect : "none"
			},
			config_maps : {
				arrows : false,
				width : "90%",
				height : "90%"
			},
			config_map_overview : {
				arrows : false,
				afterShow : mapOverviewCallback
			}
		},
		colorbox_config : {
			config_photos : {
				title : formatPhotoTitleColorBox,
				loop : false,
				slideshow : true,
				slideshowAuto : false
			},
			config_youtube : {
				iframe : true,
				innerWidth : "80%",
				innerHeight : "80%",
				rel : "nofollow"
			},
			config_maps : {
				iframe : true,
				innerWidth : "80%",
				innerHeight : "80%",
				rel : "nofollow"
			},
			config_map_overview : {
				inline : true,
				rel : "nofollow",
				onComplete : mapOverviewCallback
			}
		},
		slimbox_config : {
			loop : false,
			overlayOpacity : .6,
			overlayFadeDuration : 400,
			resizeDuration : 400,
			resizeEasing : "swing",
			initialWidth : 250,
			initlaHeight : 250,
			imageFadeDuration : 400,
			captionAnimationDuration : 400,
			counterText : "{x}/{y}",
			closeKeys : [ 27, 88, 67, 70 ],
			prevKeys : [ 37, 80 ],
			nextKeys : [ 39, 83 ]
		},
		blockUIConfig : {
			message : "<div class='lbLoading pwi_loader'>loading...</div>",
			css : "pwi_loader"
		},
		albumstore : {},
		photostore : {},
		popupPlugin : "",
		popupExt : "",
		token : ""
	};
	a.fn.pwi.strings = {
		clearDiv : "<div style='clear: both;height:0px;'/>",
		picasaUrl : "http://picasaweb.google.com/data/feed/api/user/"
	}
})(jQuery)
