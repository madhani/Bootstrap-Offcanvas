(function() {
  var Offcanvas, OffcanvasTouch, touch, transformCheck,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  touch = false;

  OffcanvasTouch = (function() {
    function OffcanvasTouch(element, location, offcanvas) {
      this.element = element;
      this.location = location;
      this.offcanvas = offcanvas;
      this._clearCss = __bind(this._clearCss, this);
      this._getCss = __bind(this._getCss, this);
      this._touchEnd = __bind(this._touchEnd, this);
      this._touchMove = __bind(this._touchMove, this);
      this._touchStart = __bind(this._touchStart, this);
      this.endThreshold = 130;
      this.startThreshold = 20;
      this.maxStartThreshold = 60;
      this.currentX = 0;
      $(document).on("touchstart", this._touchStart);
      $(document).on("touchmove", this._touchMove);
      $(document).on("touchend", this._touchEnd);
    }

    OffcanvasTouch.prototype._touchStart = function(e) {
      return this.startX = e.originalEvent.touches[0].pageX;
    };

    OffcanvasTouch.prototype._touchMove = function(e) {
      var x;
      if (this.startX > this.startThreshold && this.startX < this.maxStartThreshold) {
        x = e.originalEvent.touches[0].pageX - this.startX;
        if (x < this.element.outerWidth()) {
          return this.element.css(this._getCss(x));
        }
      } else if (this.element.hasClass('in')) {
        x = e.originalEvent.touches[0].pageX + (this.currentX - this.startX);
        if (x < this.element.outerWidth()) {
          return this.element.css(this._getCss(x));
        }
      }
    };

    OffcanvasTouch.prototype._touchEnd = function(e) {
      var x;
      x = e.originalEvent.changedTouches[0].pageX;
      if (this.element.hasClass('in') && x < (this.endThreshold + 50)) {
        this.currentX = 0;
        this.element.removeClass('in').css(this._clearCss());
      } else if (x - this.startX > this.endThreshold && this.startX > this.startThreshold && this.startX < this.maxStartThreshold) {
        this.currentX = x;
        this.element.toggleClass('in').css(this._clearCss());
      } else {
        this.element.css(this._clearCss());
      }
      return this.offcanvas.bodyOverflow();
    };

    OffcanvasTouch.prototype._getCss = function(x) {
      return {
        "-webkit-transform": "translate3d(" + x + "px, 0px, 0px)",
        "-webkit-transition-duration": "0s",
        "-moz-transform": "translate3d(" + x + "px, 0px, 0px)",
        "-moz-transition": "0s",
        "-o-transform": "translate3d(" + x + "px, 0px, 0px)",
        "-o-transition": "0s",
        "transform": "translate3d(" + x + "px, 0px, 0px)",
        "transition": "0s"
      };
    };

    OffcanvasTouch.prototype._clearCss = function() {
      return {
        "-webkit-transform": "",
        "-webkit-transition-duration": "",
        "-moz-transform": "",
        "-moz-transition": "",
        "-o-transform": "",
        "-o-transition": "",
        "transform": "",
        "transition": ""
      };
    };

    return OffcanvasTouch;

  })();

  Offcanvas = (function() {
    function Offcanvas(element) {
      var t, target;
      this.element = element;
      this.bodyOverflow = __bind(this.bodyOverflow, this);
      this._documentClicked = __bind(this._documentClicked, this);
      this._clicked = __bind(this._clicked, this);
      target = this.element.attr('data-target') ? this.element.attr('data-target') : false;
      if (target) {
        this.target = $(target);
        if (this.target.length) {
          this.location = this.target.hasClass("navbar-offcanvas-right") ? "right" : "left";
          this.target.addClass(transform ? "offcanvas-transform" : "offcanvas-position");
          this.element.on("click", this._clicked);
          $(document).on("click", this._documentClicked);
          if (this.target.hasClass('navbar-offcanvas-touch')) {
            touch = true;
            t = new OffcanvasTouch(this.target, this.location, this);
          }
        } else {
          console.warn("Offcanvas: Can't find target element with selector " + target + ".");
        }
      } else {
        console.warn('Offcanvas: `data-target` attribute must be present.');
      }
    }

    Offcanvas.prototype._clicked = function(e) {
      e.preventDefault();
      this.target.toggleClass('in');
      return this.bodyOverflow();
    };

    Offcanvas.prototype._documentClicked = function(e) {
      var clickedEl;
      clickedEl = $(e.target);
      if (!clickedEl.hasClass('offcanvas-toggle') && clickedEl.parents('.offcanvas-toggle').length === 0 && clickedEl.parents('.navbar-offcanvas').length === 0 && !clickedEl.hasClass('navbar-offcanvas')) {
        if (this.target.hasClass('in')) {
          e.preventDefault();
          this.target.removeClass('in');
          return this.bodyOverflow();
        }
      }
    };

    Offcanvas.prototype.bodyOverflow = function() {
      return $("body").css({
        overflow: this.target.hasClass('in') ? 'hidden' : ''
      });
    };

    return Offcanvas;

  })();

  transformCheck = (function(_this) {
    return function() {
      var asSupport, el, regex, translate3D;
      el = document.createElement('div');
      translate3D = "translate3d(0px, 0px, 0px)";
      regex = /translate3d\(0px, 0px, 0px\)/g;
      el.style.cssText = "-webkit-transform: " + translate3D + "; -moz-transform: " + translate3D + "; -o-transform: " + translate3D + "; transform: " + translate3D;
      asSupport = el.style.cssText.match(regex);
      return _this.transform = asSupport.length != null;
    };
  })(this);

  $(function() {
    transformCheck();
    return $('[data-toggle="offcanvas"]').each(function() {
      var oc;
      return oc = new Offcanvas($(this));
    });
  });

}).call(this);
