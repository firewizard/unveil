/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 *
 * Changelog
 * 2016-04-06 - Fixed webkit issues - https://github.com/firewizard/unveil
 */

;
(function ($) {

    $.fn.unveil = function (threshold, callback) {

        var $w = $(window),
            th = threshold || 0,
            retina = window.devicePixelRatio > 1,
            attrib = retina ? "data-src-retina" : "data-src",
            images = this,
            loaded;

        this.one("unveil", function () {
            var source = this.getAttribute(attrib),
                $t = $(this);
            source = source || this.getAttribute("data-src");
            if (source) {
                $t.fadeOut(0);
                this.setAttribute("src", source);
                this.onload = function () {
                    $t.fadeIn();
                }
                if (typeof callback === "function") callback.call(this);
            }
        });

        function unveil() {
            var inview = images.filter(function () {
                var $e = $(this);
                if ($e.is(":hidden")) return;

                var rect = this.getBoundingClientRect(),
                    et = rect.top,
                    eb = rect.bottom,
                    wh = $w.height();

                return eb >= 0 - th && et <= wh + th;
            });

            loaded = inview.trigger("unveil");
            images = images.not(loaded);
        }

        $w.on("scroll.unveil resize.unveil lookup.unveil", unveil);

        //webkit seems to have the heights ready only when the load event has been triggered
        navigator.userAgent.match(/webkit/i) && $w.on('load', unveil);

        unveil();

        return this;

    };

})(window.jQuery || window.Zepto);
