(function ($) {
  "use strict";

  // Contact form: POST to AWS Lambda and show status
  $(function () {
    var $form = $("#contactForm");
    if ($form.length) {
      $form.on("submit", async function (e) {
        e.preventDefault();
        var payload = {
          name: ($("#contactName").val() || "").trim(),
          email: ($("#contactEmail").val() || "").trim(),
          phone: ($("#contactPhone").val() || "").trim(),
          service: ($("#contactService").val() || "").trim(),
          message: ($("#contactMessage").val() || "").trim(),
        };

        var $status = $("#contactStatus");

        function setStatus(kind, text) {
          if (!$status.length) return;
          try {
            $status.removeClass("alert alert-success alert-danger");
            if (kind === "success") $status.addClass("alert alert-success");
            else if (kind === "error") $status.addClass("alert alert-danger");
            $status.text(text).css("display", "block");
          } catch (_) {}
        }

        function validatePayload(p) {
          var errors = [];
          var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!p.name) errors.push("Name is required");
          if (!p.email || !emailRe.test(p.email))
            errors.push("Valid email is required");
          if (!p.service) errors.push("Please select a service");
          if (!p.message) errors.push("Message is required");
          return errors;
        }
        // Debug: log outgoing payload (avoid sensitive info in production)
        try {
          console.log("[ContactForm] Submitting payload", payload);
        } catch (_) {}

        var endpoint =
          "https://ouk5caf7kvvakmfirijjeyvdj40qnefw.lambda-url.ap-southeast-2.on.aws/";
        var validationErrors = validatePayload(payload);
        if (validationErrors.length) {
          setStatus(
            "error",
            "Please correct the following: " + validationErrors.join("; ")
          );
          return;
        }

        setStatus(null, "Sending...");

        try {
          var res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          try {
            console.log("[ContactForm] Response", res.status, res.statusText);
          } catch (_) {}
          if (!res.ok) {
            var bodyText = "";
            try {
              bodyText = await res.text();
            } catch (_) {}
            throw new Error(
              "Request failed: " +
                res.status +
                " " +
                res.statusText +
                (bodyText ? " | " + bodyText : "")
            );
          }
          try {
            await res.json();
          } catch (_) {}
          setStatus("success", "Thanks! Your message was sent successfully.");
          $form[0].reset();
        } catch (err) {
          try {
            console.error("[ContactForm] Submission failed", err);
          } catch (_) {}
          setStatus(
            "error",
            "Sorry, something went wrong while sending your message. Please try again."
          );
        }
      });
    }
  });

  $(window).stellar({
    responsive: true,
    parallaxBackgrounds: true,
    parallaxElements: true,
    horizontalScrolling: false,
    hideDistantElements: false,
    scrollProperty: "scroll",
  });

  var fullHeight = function () {
    $(".js-fullheight").css("height", $(window).height());
    $(window).resize(function () {
      $(".js-fullheight").css("height", $(window).height());
    });
  };
  fullHeight();

  // loader
  var loader = function () {
    setTimeout(function () {
      if ($("#ftco-loader").length > 0) {
        $("#ftco-loader").removeClass("show");
      }
    }, 1);
  };
  loader();

  var carousel = function () {
    $(".carousel-testimony").owlCarousel({
      center: false,
      loop: true,
      items: 1,
      margin: 30,
      stagePadding: 0,
      nav: false,
      navText: [
        '<span class="ion-ios-arrow-back">',
        '<span class="ion-ios-arrow-forward">',
      ],
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 3,
        },
      },
    });
  };
  carousel();

  $("nav .dropdown").hover(
    function () {
      var $this = $(this);
      // 	 timer;
      // clearTimeout(timer);
      $this.addClass("show");
      $this.find("> a").attr("aria-expanded", true);
      // $this.find('.dropdown-menu').addClass('animated-fast fadeInUp show');
      $this.find(".dropdown-menu").addClass("show");
    },
    function () {
      var $this = $(this);
      // timer;
      // timer = setTimeout(function(){
      $this.removeClass("show");
      $this.find("> a").attr("aria-expanded", false);
      // $this.find('.dropdown-menu').removeClass('animated-fast fadeInUp show');
      $this.find(".dropdown-menu").removeClass("show");
      // }, 100);
    }
  );

  $("#dropdown04").on("show.bs.dropdown", function () {
    console.log("show");
  });

  // magnific popup
  $(".image-popup").magnificPopup({
    type: "image",
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: "mfp-no-margins mfp-with-zoom", // class to remove default margin from left and right side
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      verticalFit: true,
    },
    zoom: {
      enabled: true,
      duration: 300, // don't foget to change the duration also in CSS
    },
  });

  $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
    disableOn: 700,
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false,
  });

  var counter = function () {
    $("#section-counter").waypoint(
      function (direction) {
        if (
          direction === "down" &&
          !$(this.element).hasClass("ftco-animated")
        ) {
          var comma_separator_number_step =
            $.animateNumber.numberStepFactories.separator(",");
          $(".number").each(function () {
            var $this = $(this),
              num = $this.data("number");
            console.log(num);
            $this.animateNumber(
              {
                number: num,
                numberStep: comma_separator_number_step,
              },
              7000
            );
          });
        }
      },
      { offset: "95%" }
    );
  };
  counter();

  var contentWayPoint = function () {
    var i = 0;
    $(".ftco-animate").waypoint(
      function (direction) {
        if (
          direction === "down" &&
          !$(this.element).hasClass("ftco-animated")
        ) {
          i++;

          $(this.element).addClass("item-animate");
          setTimeout(function () {
            $("body .ftco-animate.item-animate").each(function (k) {
              var el = $(this);
              setTimeout(
                function () {
                  var effect = el.data("animate-effect");
                  if (effect === "fadeIn") {
                    el.addClass("fadeIn ftco-animated");
                  } else if (effect === "fadeInLeft") {
                    el.addClass("fadeInLeft ftco-animated");
                  } else if (effect === "fadeInRight") {
                    el.addClass("fadeInRight ftco-animated");
                  } else {
                    el.addClass("fadeInUp ftco-animated");
                  }
                  el.removeClass("item-animate");
                },
                k * 50,
                "easeInOutExpo"
              );
            });
          }, 100);
        }
      },
      { offset: "95%" }
    );
  };
  contentWayPoint();
})(jQuery);
