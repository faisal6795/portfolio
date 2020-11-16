(function initialize() {
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
            }
        }).done(function () {
            if (index === length - 1) {
                $("#loader").hide();
            }
        });
    }

    function bindEvents() {
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
        });

        $("#projects").on("click", ".project-nav-container li", function (event) {
            $(".project-nav-container li").removeClass("selected");
            $(event.target).addClass("selected");
            var filter = event.target.dataset.filter;
            $(".project-cards").removeClass("hide-card");
            filter !== "" && $(".project-cards:not(." + filter + ")").addClass("hide-card");
        });

        $("#navbar .theme-changer button").click(function (event) {
            if ($("#portfolio").hasClass("light-mode")) {
                $("#portfolio").removeClass("light-mode");
            } else {
                $("#portfolio").addClass("light-mode");
            }
        });

        document.addEventListener("scroll", function () {
            var animateClass = "animate-on-scroll",
                positionTech = $("#skills .container .progress")[0].getBoundingClientRect(),
                positionProf = $("#skills .container .circle-container")[0].getBoundingClientRect();
            if (positionTech.top + 100 < window.innerHeight && positionTech.bottom >= 50) {
                $("#skills .container .progress .filled-bar").addClass(animateClass);
            }
            if (positionProf.top + 100 < window.innerHeight && positionProf.bottom >= 50) {
                $("#skills .container .circle-container .circle .fill").addClass(animateClass);
            }
        });
    }

    function initializeElements() {
        $.getJSON('https://raw.githubusercontent.com/faisal6795/portfolio/master/data/codepen.json', (data => {
            data.map(item => {
                item.img_url = 'https://raw.githubusercontent.com/faisal6795/portfolio/master/assets/' + item.img_url;
                item.height = Math.round(Math.random() * 120) + 240;
                item.class_name = 'design';
                item.desc = 'Design';
            });
            JSONData.projects.list_cards.push(...data);
            var length = JSONData.sections.length;
            JSONData.sections.forEach(function (data, index) {
                renderTemplates(data, index, length, '#' + data, JSONData[data]);
            });
        }));
    }
})();