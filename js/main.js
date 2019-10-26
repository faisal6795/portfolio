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
            var firstName = $(".contact-first-name input").val(),
                lastName = $(".contact-last-name input").val(),
                email = $(".contact-email input").val(),
                msg = $(".contact-msg textarea").val(),
                name = firstName + " " + lastName,
                isValid = function (firstName, lastName, email, msg) {
                    return firstName.trim() !== "" && lastName.trim() !== "" && msg.trim() !== "" && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
                },
                showError = function () {
                    $(".submit-msg").text(JSONData.contact.error_msg);
                    $(".submit-msg").removeClass("hide").removeClass("correct");
                },
                showSuccess = function () {
                    $(".contact-form > div > *[required]").val("");
                    $(".submit-msg").text(JSONData.contact.success_msg);
                    $(".submit-msg").removeClass("hide").addClass("correct");
                };
            if (isValid(firstName, lastName, email, msg)) {
                Email.send({
                    Host: "smtp.gmail.com",
                    Username: "faisal.faizansari@gmail.com",
                    Password: "rmfdxngxiqltrybp",
                    To: "faisal.faizansari@gmail.com",
                    From: email,
                    Subject: "Message from " + name,
                    Body: msg
                }).then(function (message) {
                    console.log(message);
                });
                showSuccess();
            } else {
                showError();
            }
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