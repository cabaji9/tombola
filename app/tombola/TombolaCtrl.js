var app = angular.module('app');
app.controller('TombolaCtrl', ['$rootScope', '$scope', '$filter',
    '$routeParams', 'AppService', TombolaCtrl]);
function TombolaCtrl($rootScope, $scope, $filter, $routeParams, AppService) {

    $scope.value = 'HOLA TEST ONE';

    Math.TWO_PI = 2 * Math.PI;
    Math.sum = function (a, b) {
        return a + b;
    };

    var roulette_wheel_selection = function (fitness, random) {
        random = typeof random !== 'undefined' ? random : Math.random;

        var rand = random() * _.reduce(fitness, Math.sum, 0);
        var tmp = 0;
        var selected_index = -1;
        for (i = 0; i < fitness.length; i++) {
            tmp += fitness[i];
            if (rand < tmp) {
                selected_index = i;
                break;
            }
        }
        return selected_index;
    };

    $scope.bringData = function (evt) {
        AppService.getData().then(function (data) {
            $scope.dataBack = data;
        });
    };

    var create_wheel_image = function () {
        var canvas = document.createElement('canvas');
        canvas.width = (this.wheel_radius * 2) + 16;
        canvas.height = (this.wheel_radius * 2) + 16;

        var wheel_center_x = this.wheel_radius;
        var wheel_center_y = this.wheel_radius;

        var ctx = canvas.getContext("2d");

        ctx.translate(wheel_center_x, wheel_center_y);
        ctx.translate(-wheel_center_x, -wheel_center_y);

        var acr_start = 0;


        for (var i = 0; i < this.arc_widths.length; i++) {
            ctx.fillStyle = "#ff0000";
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.lineColor;
            ctx.beginPath();
            ctx.moveTo(wheel_center_x, wheel_center_y);
            var arc_end = acr_start + this.arc_widths[i];
            ctx.arc(wheel_center_x, wheel_center_y, this.wheel_radius - this.lineWidth, acr_start, arc_end, false);
            ctx.lineTo(wheel_center_x, wheel_center_y);
            ctx.fill();
            ctx.stroke();

            ctx.save();
            var adjacent = Math.cos(acr_start + (arc_end - acr_start) / 2) * (this.wheel_radius - 10);
            var opposite = Math.sin(acr_start + (arc_end - acr_start) / 2) * (this.wheel_radius - 10);
            ctx.translate(wheel_center_x + adjacent, wheel_center_y + opposite);
            ctx.rotate(acr_start + (arc_end - acr_start) / 2);

            ctx.fillStyle = "#000000";
            ctx.textAlign = "right";
            ctx.font = "20px marcellus";
            ctx.textBaseline = "middle";
            ctx.fillText(this.labels[i], 0, 0);

            ctx.restore();

            acr_start = arc_end;
        }
        return canvas;
    };

    var createInnerCircle = function (ctx) {
        var wheel_center_x = this.wheel_margin + this.wheel_radius;
        var wheel_center_y = this.wheel_margin + this.wheel_radius;
        ctx.fillStyle = "#ff0000";
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.lineColor;
        ctx.beginPath();
        ctx.arc(wheel_center_x, wheel_center_y, 50, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();

        var fontSize = 20;
        ctx.fillStyle = "#ffffff";
        ctx.font = fontSize + "px marcellus";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText('CLICK', wheel_center_x, wheel_center_y - (fontSize / 2));
        ctx.fillText('AQUÍ', wheel_center_x, wheel_center_y + (fontSize / 2));
    };


    var render = function (rotation) {
        rotation = typeof rotation !== 'undefined' ? rotation : 0;

        var canvas = this.wheel_canvas;
        var ctx = canvas.getContext("2d");

        var wheel_center_x = this.wheel_margin + this.wheel_radius;
        var wheel_center_y = this.wheel_margin + this.wheel_radius;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(wheel_center_x, wheel_center_y);
        ctx.rotate(rotation);
        ctx.translate(-wheel_center_x, -wheel_center_y);
        ctx.drawImage(this.wheel_image, this.wheel_margin, this.wheel_margin);
        ctx.restore();

        createInnerCircle(ctx);

        ctx.beginPath();
        ctx.moveTo(wheel_center_x + this.wheel_radius - 5, wheel_center_y);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.lineTo(wheel_center_x + this.wheel_radius + 50, wheel_center_y);
        ctx.stroke();

    };


    var getW = function (collection) {
        var index = -1;
        for (var i = 0; i < collection.length; i++) {
            var collectionItem = collection[i];
            if (collectionItem.w && collectionItem.w === 1) {
                index = i;
                break;
            }
        }
        return index;
    }

    var reset = function (collection) {

        this.indexW = getW(collection);

        var fitness_values = collection.map(function (individual) {
            return individual["fitness"];
        });
        var fitness_sum = _.reduce(fitness_values, Math.sum, 0);

        if (fitness_sum !== 0) {
            var label_values = collection.map(function (individual) {
                return individual["label"];
            });

            this.arc_widths = _.map(fitness_values, function (fitness) {
                return fitness / fitness_sum * Math.TWO_PI;
            });
            this.labels = label_values;

        } else {
            this.arc_widths = [];
            this.labels = [];
        }

        // resize canvas
        var canvas_el = this.$wheel_canvas;
        var canvas = this.wheel_canvas;

        var bounding_rect_width = Math.min(canvas.width, canvas.height);
        this.wheel_margin = 20;
        this.wheel_radius = bounding_rect_width / 2 - this.wheel_margin;

        canvas.width = Math.min(Math.max(Math.min(window.innerWidth, window.innerHeight), 320), 500);
        canvas.height = canvas.width;

        this.wheel_image = create_wheel_image();
        canvas_el.addClass("clickable");
        render();
    };


    var getIndex = function (self) {
        var index = this.indexW;
        if (this.indexW == -1) {
            index = roulette_wheel_selection(self.arc_widths, self.random);
        }
        return index;
    };

    /**
     * Spin the wheel
     * @param {Function} after - A callback which gets called at the end of the animation
     */
    var render_spin = function (after) {
        after = typeof after !== 'undefined' ? after : _.noop();

        var self = this;
        var index = getIndex(self);

        var partial_exclusive = _.reduce(self.arc_widths.slice(0, index), Math.sum, 0);
        var partial_inclusive = partial_exclusive + self.arc_widths[index];
        var angle_selected = partial_exclusive + (partial_inclusive - partial_exclusive) / 2;
        var full_rotations = 10;
        var rotation_max = Math.TWO_PI * full_rotations + (Math.TWO_PI - angle_selected);

        var animation_start = moment();
        var animation_interval = setInterval(function () {
            var time = moment().diff(animation_start);
            var easing = $.easing.easeOutCirc(null, time, 0, rotation_max, self.animation_duration);
            var rotation = easing % Math.TWO_PI;
            render(rotation);
        }, Math.min(1, Math.round(1000 / this.fps)));

        setTimeout(function () {
            clearInterval(animation_interval);
            after();
        }, self.animation_duration);
    };

    var spin = function () {
        var el = $("canvas").first();
        if (!el.hasClass("clickable")) {
            return;
        }
        el.removeClass("clickable");

        render_spin(function () {
            el.addClass("clickable");
        });
    };

    var initialize = function (options) {
        options = typeof options !== 'undefined' ? options : {};
        this.random = typeof options.random !== 'undefined' ? options.random : Math.random;
        this.animation_duration = typeof options.animation_duration !== 'undefined' ? options.animation_duration : 10000; // ms
        this.fps = typeof options.fps !== 'undefined' ? options.fps : 60;
        this.$wheel_canvas = $("canvas");
        this.wheel_canvas = this.$wheel_canvas.get(0);
        this.lineWidth = options.lineWidth !== 'undefined' ? options.lineWidth : 3;
        this.lineColor = options.lineColor !== 'undefined' ? options.lineColor : '#000000';
        var collection = options.collection;
        reset(collection);

        this.$wheel_canvas.click(spin);
    };

    var chance = new Chance();
    var rng = function () {
        return chance.random();
    };

    angular.element(document).ready(function () {


        var wheel = {
            random: rng,
            collection: [{'label': 'Uno', 'value': '1', 'fitness': 1, 'w': 0}, {
                'label': 'dos',
                'value': '2',
                'fitness': 1,
                'w': 0
            }, {'label': 'tres', 'value': '3', 'fitness': 1, 'w': 0}],
            lineWidth: 5,
            lineColor: '#000000'

        };

        var marcellus = new FontFace('marcellus', 'url(../font/MarcellusSC-Regular.ttf)', {
            style: 'normal',
            weight: '400'
        });
        document.fonts.add(marcellus);
        marcellus.load();
        marcellus.loaded.then(function (fontFace) {
            // This is where you can declare a new font-family, because the font is now loaded and ready.
            console.info('Current status', fontFace.status);
            console.log(fontFace.family, 'loaded successfully.');
            initialize(wheel);
// Throw an error if loading wasn't successful
        }, function (error) {
            console.log("not found font")
        });


    });


};

