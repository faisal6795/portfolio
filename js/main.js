function initialize() {
    var JSONData;

    $.getJSON("data/data.json", function (data) {
        JSONData = data;
        initializeElements();
    });

    function renderTemplates(templateName, index, length, target, jsonData) {
        $.get('templates/' + templateName + '.handlebars', function (data) {
            var template = Handlebars.compile(data);
            $(target).html(template(jsonData));
        }, 'html').promise().done(function () {
            if (index === length - 1) {
                bindEvents();
                initMap();
            }
        });
    }

    function bindEvents() {
        var openNavBar = function () {
            $(".nav-container ul").addClass("nav-open");
            $(".overlay").addClass("active");
            $(".toggle-btn").addClass("close-btn");
        }, closeNavBar = function () {
            $(".nav-container ul").removeClass("nav-open");
            $(".overlay").removeClass("active");
            $(".toggle-btn").removeClass("close-btn");
        };

        $("#navbar .navlink").click(function (event) {
            $("#navbar .navlink").closest("li").removeClass("selected");
            $(event.target).closest("li").addClass("selected");

            if (this.hash !== "") {
                event.preventDefault();
                var hash = this.hash;
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 800, function () {
                    window.location.hash = hash;
                });
            }
            closeNavBar();
        });

        $(".project-nav-container li").click(function (event) {
            $(".project-nav-container li").removeClass("selected");
            $(event.target).addClass("selected");
            var filter = event.target.dataset.filter;
        });

        $(".toggle-btn").click(function (event) {
            if ($(".nav-container ul").hasClass("nav-open")) {
                closeNavBar();
            } else {
                openNavBar();
            }
        });

        $(".overlay").click(function (event) {
            closeNavBar();
        });

        $("#navbar .theme-changer button").click(function (event) {
            if ($("#portfolio").hasClass("light-mode")) {
                $("#portfolio").removeClass("light-mode");
            } else {
                $("#portfolio").addClass("light-mode");
            }
        });

        $("#send-button").click(function (event) {

        });
    }

    function initializeElements() {
        var length = JSONData.sections.length;
        JSONData.sections.forEach(function (data, index) {
            renderTemplates(data, index, length, '#' + data, JSONData[data]);
        });
    }

    function initMap() {
        var address = { lat: 19.043563, lng: 73.022391 };
        var map = new google.maps.Map(document.getElementById('map'), { zoom: 12, center: address });
        var marker = new google.maps.Marker({ position: address, map: map });
    }
}