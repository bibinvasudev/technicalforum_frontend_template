/**
 * Created by sree on 11/7/17.
 */

jQuery(document).ready(function () {
    'use strict';
    jQuery(window).on('scroll', function () {
        'use strict';
        if (jQuery(window).scrollTop() > 60) {
            jQuery('#header').addClass('animated fadeInDown sticky');
        } else {
            jQuery('#header').removeClass('animated fadeInDown sticky');
        }
    });
});

//function initMap () {
//
//    //Google maps
//
//    var iconBase = '../img/icons/map_pin.png';
//    var myLatlng = new google.maps.LatLng(8.5586755,76.8771387);
//
//    var mapContainer = document.getElementById('location');
//    var mapOptions = {
//        center: myLatlng,
//        mapTypeId: 'satellite',
//        zoom: 18,
//        //disableDefaultUI: true
//        //scrollwheel: mousescroll
//    };
//
//    var map = new google.maps.Map(mapContainer, mapOptions);
//    map.setTilt(45);
//
//    var marker = new google.maps.Marker({
//        position: myLatlng,
//        map: map
//    });
//
//    //map.setMapTypeId(google.maps.MapTypeId['ROADMAP']);
//    var fill_color = '#ff0000';
//    if (fill_color != '') {
//        var styles = [{
//            "featureType": "water",
//            "elementType": "geometry",
//            "stylers": [{"color": fill_color}]
//        }];
//    }
//    map.setOptions({styles: styles});
//}


google.maps.event.addDomListener(window, 'load', init);
var map, markersArray = [];

function bindInfoWindow(marker, map, location) {
    google.maps.event.addListener(marker, 'click', function () {
        function close(location) {
            location.ib.close();
            location.infoWindowVisible = false;
            location.ib = null;
        }

        if (location.infoWindowVisible === true) {
            close(location);
        } else {
            markersArray.forEach(function (loc, index) {
                if (loc.ib && loc.ib !== null) {
                    close(loc);
                }
            });

            var boxText = document.createElement('div');
            boxText.style.cssText = 'background: #fff;';
            boxText.classList.add('md-whiteframe-2dp');

            function buildPieces(location, el, part, icon) {
                if (location[part] === '') {
                    return '';
                } else if (location.iw[part]) {
                    switch (el) {
                        case 'photo':
                            if (location.photo) {
                                return '<div class="iw-photo" style="background-image: url(' + location.photo + ');"></div>';
                            } else {
                                return '';
                            }
                            break;
                        case 'iw-toolbar':
                            return '<div class="iw-toolbar"><h3 class="md-subhead">' + location.title + '</h3></div>';
                            break;
                        case 'div':
                            switch (part) {
                                case 'email':
                                    return '<div class="iw-details"><i class="material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><span><a href="mailto:' + location.email + '" target="_blank">' + location.email + '</a></span></div>';
                                    break;
                                case 'web':
                                    return '<div class="iw-details"><i class="material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><span><a href="' + location.web + '" target="_blank">' + location.web_formatted + '</a></span></div>';
                                    break;
                                case 'desc':
                                    return '<label class="iw-desc" for="cb_details"><input type="checkbox" id="cb_details"/><h3 class="iw-x-details">Details</h3><i class="material-icons toggle-open-details"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><p class="iw-x-details">' + location.desc + '</p></label>';
                                    break;
                                default:
                                    return '<div class="iw-details"><i class="material-icons"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><span>' + location[part] + '</span></div>';
                                    break;
                            }
                            break;
                        case 'open_hours':
                            var items = '';
                            if (location.open_hours.length > 0) {
                                for (var i = 0; i < location.open_hours.length; ++i) {
                                    if (i !== 0) {
                                        items += '<li><strong>' + location.open_hours[i].day + '</strong><strong>' + location.open_hours[i].hours + '</strong></li>';
                                    }
                                    var first = '<li><label for="cb_hours"><input type="checkbox" id="cb_hours"/><strong>' + location.open_hours[0].day + '</strong><strong>' + location.open_hours[0].hours + '</strong><i class="material-icons toggle-open-hours"><img src="//cdn.mapkit.io/v1/icons/keyboard_arrow_down.svg"/></i><ul>' + items + '</ul></label></li>';
                                }
                                return '<div class="iw-list"><i class="material-icons first-material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' + icon + '.svg"/></i><ul>' + first + '</ul></div>';
                            } else {
                                return '';
                            }
                            break;
                    }
                } else {
                    return '';
                }
            }

            boxText.innerHTML =
                buildPieces(location, 'photo', 'photo', '') +
                buildPieces(location, 'iw-toolbar', 'title', '') +
                buildPieces(location, 'div', 'address', 'location_on') +
                buildPieces(location, 'div', 'web', 'public') +
                buildPieces(location, 'div', 'email', 'email') +
                buildPieces(location, 'div', 'tel', 'phone') +
                buildPieces(location, 'div', 'int_tel', 'phone') +
                buildPieces(location, 'open_hours', 'open_hours', 'access_time') +
                buildPieces(location, 'div', 'desc', 'keyboard_arrow_down');

            var myOptions = {
                alignBottom: true,
                content: boxText,
                disableAutoPan: true,
                maxWidth: 0,
                pixelOffset: new google.maps.Size(-140, -40),
                zIndex: null,
                boxStyle: {
                    opacity: 1,
                    width: '280px'
                },
                closeBoxMargin: '0px 0px 0px 0px',
                infoBoxClearance: new google.maps.Size(1, 1),
                isHidden: false,
                pane: 'floatPane',
                enableEventPropagation: false
            };

            location.ib = new InfoBox(myOptions);
            location.ib.open(map, marker);
            location.infoWindowVisible = true;
        }
    });
}

function init() {
    var mapOptions = {
        center: new google.maps.LatLng(8.549735420237146, 76.88112993809818),
        zoom: 10,
        gestureHandling: 'auto',
        fullscreenControl: false,
        zoomControl: true,
        disableDoubleClickZoom: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        },
        scaleControl: true,
        scrollwheel: false,
        streetViewControl: true,
        draggable: true,
        clickableIcons: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{"visibility": "simplified"}]
        }, {
            "featureType": "road.arterial",
            "stylers": [{"hue": 149}, {"saturation": -78}, {"lightness": 0}]
        }, {
            "featureType": "road.highway",
            "stylers": [{"hue": -31}, {"saturation": -40}, {"lightness": 2.8}]
        }, {
            "featureType": "poi",
            "elementType": "label",
            "stylers": [{"visibility": "off"}]
        }, {
            "featureType": "landscape",
            "stylers": [{"hue": 163}, {"saturation": -26}, {"lightness": -1.1}]
        }, {"featureType": "transit", "stylers": [{"visibility": "off"}]}, {
            "featureType": "water",
            "stylers": [{"hue": 3}, {"saturation": -24.24}, {"lightness": -38.57}]
        }]
    }
    var mapElement = document.getElementById('location');
    var map = new google.maps.Map(mapElement, mapOptions);
    var locations = [
        {
            "title": "Technopark Campus",
            "address": "Technopark Campus, Kazhakkoottam, Kerala, India",
            "desc": "",
            "tel": "",
            "int_tel": "",
            "email": "",
            "web": "",
            "web_formatted": "",
            "open": "",
            "time": "",
            "lat": 8.5580957,
            "lng": 76.88074370000004,
            "vicinity": "Kazhakkoottam",
            "open_hours": "",
            "marker": {
                "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png",
                "scaledSize": {"width": 25, "height": 42, "f": "px", "b": "px"},
                "origin": {"x": 0, "y": 0},
                "anchor": {"x": 12, "y": 42}
            },
            "iw": {
                "address": true,
                "desc": true,
                "email": true,
                "enable": true,
                "int_tel": true,
                "open": true,
                "open_hours": true,
                "photo": true,
                "tel": true,
                "title": true,
                "web": true
            }
        }, {
            "title": "Technopark Campus",
            "address": "",
            "tel": "",
            "int_tel": "",
            "email": "",
            "web": "",
            "web_formatted": "",
            "open": "",
            "time": "",
            "lat": 8.5580957,
            "lng": 76.88074370000004,
            "vicinity": "Kazhakkoottam",
            "open_hours": "",
            "marker": {
                "fillColor": "#FF5722",
                "fillOpacity": 1,
                "strokeWeight": 0,
                "scale": 1.5,
                "path": "M10.2,2.5v4.2c0,0,0,0,0,0L10.2,2.5c-6,0-10.9,4.9-10.9,10.9s10.9,23.8,10.9,23.8v0c0,0,10.9-17.8,10.9-23.8 S16.2,2.5,10.2,2.5z M10.2,17.9c-2.5,0-4.6-2.1-4.6-4.6s2.1-4.6,4.6-4.6s4.6,2.1,4.6,4.6S12.8,17.9,10.2,17.9z M16.8,14.1 c0-0.2,0-0.3,0-0.5C16.9,13.8,16.9,14,16.8,14.1z",
                "anchor": {"x": 10, "y": 30},
                "origin": {"x": 0, "y": 0},
                "style": 0
            },
            "iw": {
                "address": true,
                "desc": true,
                "email": true,
                "enable": true,
                "int_tel": true,
                "open": true,
                "open_hours": true,
                "photo": true,
                "tel": true,
                "title": true,
                "web": true
            }
        }
    ];

    var layer = new google.maps.TrafficLayer();
    layer.setMap(map);

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            icon: locations[i].marker,
            position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
            map: map,
            title: locations[i].title,
            address: locations[i].address,
            desc: locations[i].desc,
            tel: locations[i].tel,
            int_tel: locations[i].int_tel,
            vicinity: locations[i].vicinity,
            open: locations[i].open,
            open_hours: locations[i].open_hours,
            photo: locations[i].photo,
            time: locations[i].time,
            email: locations[i].email,
            web: locations[i].web,
            iw: locations[i].iw
        });
        markersArray.push(marker);

        if (locations[i].iw.enable === true) {
            bindInfoWindow(marker, map, locations[i]);
        }
    }
}

(function() {

    var ParticleNetworkAnimation, PNA;
    ParticleNetworkAnimation = PNA = function() {};

    PNA.prototype.init = function(element) {
        this.$el = $(element);

        this.container = element;
        this.canvas = document.createElement('canvas');
        this.sizeCanvas();
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.particleNetwork = new ParticleNetwork(this);

        this.bindUiActions();

        return this;
    };

    PNA.prototype.bindUiActions = function() {
        $(window).on('resize', function() {
            // this.sizeContainer();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.sizeCanvas();
            this.particleNetwork.createParticles();
        }.bind(this));
    };

    PNA.prototype.sizeCanvas = function() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    };

    var Particle = function(parent, x, y) {
        this.network = parent;
        this.canvas = parent.canvas;
        this.ctx = parent.ctx;
        this.particleColor = returnRandomArrayitem(this.network.options.particleColors);
        this.radius = getLimitedRandom(1.5, 2.5);
        this.opacity = 0;
        this.x = x || Math.random() * this.canvas.width;
        this.y = y || Math.random() * this.canvas.height;
        this.velocity = {
            x: (Math.random() - 0.5) * parent.options.velocity,
            y: (Math.random() - 0.5) * parent.options.velocity
        };
    };

    Particle.prototype.update = function() {
        if (this.opacity < 1) {
            this.opacity += 0.01;
        } else {
            this.opacity = 1;
        }
        // Change dir if outside map
        if (this.x > this.canvas.width + 100 || this.x < -100) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y > this.canvas.height + 100 || this.y < -100) {
            this.velocity.y = -this.velocity.y;
        }

        // Update position
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };

    Particle.prototype.draw = function() {
        // Draw particle
        this.ctx.beginPath();
        this.ctx.fillStyle = this.particleColor;
        this.ctx.globalAlpha = this.opacity;
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();
    };

    var ParticleNetwork = function(parent) {
        this.options = {
            velocity: 1, // the higher the faster
            density: 15000, // the lower the denser
            netLineDistance: 200,
            netLineColor: '#929292',
            particleColors: ['#aaa'] // ['#6D4E5C', '#aaa', '#FFC458' ]
        };
        this.canvas = parent.canvas;
        this.ctx = parent.ctx;

        this.init();
    };

    ParticleNetwork.prototype.init = function() {
        // Create particle objects
        this.createParticles(true);

        // Update canvas
        this.animationFrame = requestAnimationFrame(this.update.bind(this));

        this.bindUiActions();
    };

    ParticleNetwork.prototype.createParticles = function(isInitial) {
        // Initialise / reset particles
        var me = this;
        this.particles = [];
        var quantity = this.canvas.width * this.canvas.height / this.options.density;

        if (isInitial) {
            var counter = 0;
            clearInterval(this.createIntervalId);
            this.createIntervalId = setInterval(function() {
                if (counter < quantity - 1) {
                    // Create particle object
                    this.particles.push(new Particle(this));
                }
                else {
                    clearInterval(me.createIntervalId);
                }
                counter++;
            }.bind(this), 250);
        }
        else {
            // Create particle objects
            for (var i = 0; i < quantity; i++) {
                this.particles.push(new Particle(this));
            }
        }
    };

    ParticleNetwork.prototype.createInteractionParticle = function() {
        // Add interaction particle
        this.interactionParticle = new Particle(this);
        this.interactionParticle.velocity = {
            x: 0,
            y: 0
        };
        this.particles.push(this.interactionParticle);
        return this.interactionParticle;
    };

    ParticleNetwork.prototype.removeInteractionParticle = function() {
        // Find it
        var index = this.particles.indexOf(this.interactionParticle);
        if (index > -1) {
            // Remove it
            this.interactionParticle = undefined;
            this.particles.splice(index, 1);
        }
    };

    ParticleNetwork.prototype.update = function() {
        if (this.canvas) {

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalAlpha = 1;

            // Draw connections
            for (var i = 0; i < this.particles.length; i++) {
                for (var j = this.particles.length - 1; j > i; j--) {
                    var distance, p1 = this.particles[i], p2 = this.particles[j];

                    // check very simply if the two points are even a candidate for further measurements
                    distance = Math.min(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y));
                    if (distance > this.options.netLineDistance) {
                        continue;
                    }

                    // the two points seem close enough, now let's measure precisely
                    distance = Math.sqrt(
                        Math.pow(p1.x - p2.x, 2) +
                        Math.pow(p1.y - p2.y, 2)
                    );
                    if (distance > this.options.netLineDistance) {
                        continue;
                    }

                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.options.netLineColor;
                    this.ctx.globalAlpha = (this.options.netLineDistance - distance) / this.options.netLineDistance * p1.opacity * p2.opacity;
                    this.ctx.lineWidth = 0.7;
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }

            // Draw particles
            for (var i = 0; i < this.particles.length; i++) {
                this.particles[i].update();
                this.particles[i].draw();
            }

            if (this.options.velocity !== 0) {
                this.animationFrame = requestAnimationFrame(this.update.bind(this));
            }

        }
        else {
            cancelAnimationFrame(this.animationFrame);
        }
    };

    ParticleNetwork.prototype.bindUiActions = function() {
        // Mouse / touch event handling
        this.spawnQuantity = 3;
        this.mouseIsDown = false;
        this.touchIsMoving = false;

        this.onMouseMove = function(e) {
            if (!this.interactionParticle) {
                this.createInteractionParticle();
            }
            this.interactionParticle.x = e.offsetX;
            this.interactionParticle.y = e.offsetY;
        }.bind(this);

        this.onTouchMove = function(e) {
            e.preventDefault();
            this.touchIsMoving = true;
            if (!this.interactionParticle) {
                this.createInteractionParticle();
            }
            this.interactionParticle.x = e.changedTouches[0].clientX;
            this.interactionParticle.y = e.changedTouches[0].clientY;
        }.bind(this);

        this.onMouseDown = function(e) {
            this.mouseIsDown = true;
            var counter = 0;
            var quantity = this.spawnQuantity;
            var intervalId = setInterval(function() {
                if (this.mouseIsDown) {
                    if (counter === 1) {
                        quantity = 1;
                    }
                    for (var i = 0; i < quantity; i++) {
                        if (this.interactionParticle) {
                            this.particles.push(new Particle(this, this.interactionParticle.x, this.interactionParticle.y));
                        }
                    }
                }
                else {
                    clearInterval(intervalId);
                }
                counter++;
            }.bind(this), 50);
        }.bind(this);

        this.onTouchStart = function(e) {
            e.preventDefault();
            setTimeout(function() {
                if (!this.touchIsMoving) {
                    for (var i = 0; i < this.spawnQuantity; i++) {
                        this.particles.push(new Particle(this, e.changedTouches[0].clientX, e.changedTouches[0].clientY));
                    }
                }
            }.bind(this), 200);
        }.bind(this);

        this.onMouseUp = function(e) {
            this.mouseIsDown = false;
        }.bind(this);

        this.onMouseOut = function(e) {
            this.removeInteractionParticle();
        }.bind(this);

        this.onTouchEnd = function(e) {
            e.preventDefault();
            this.touchIsMoving = false;
            this.removeInteractionParticle();
        }.bind(this);

        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('touchmove', this.onTouchMove);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('touchstart', this.onTouchStart);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.canvas.addEventListener('mouseout', this.onMouseOut);
        this.canvas.addEventListener('touchend', this.onTouchEnd);
    };

    ParticleNetwork.prototype.unbindUiActions = function() {
        if (this.canvas) {
            this.canvas.removeEventListener('mousemove', this.onMouseMove);
            this.canvas.removeEventListener('touchmove', this.onTouchMove);
            this.canvas.removeEventListener('mousedown', this.onMouseDown);
            this.canvas.removeEventListener('touchstart', this.onTouchStart);
            this.canvas.removeEventListener('mouseup', this.onMouseUp);
            this.canvas.removeEventListener('mouseout', this.onMouseOut);
            this.canvas.removeEventListener('touchend', this.onTouchEnd);
        }
    };

    var getLimitedRandom = function(min, max, roundToInteger) {
        var number = Math.random() * (max - min) + min;
        if (roundToInteger) {
            number = Math.round(number);
        }
        return number;
    };

    var returnRandomArrayitem = function(array) {
        return array[Math.floor(Math.random()*array.length)];
    };

    pna = new ParticleNetworkAnimation();	pna.init($('.particle-network-animation')[0]);

}());