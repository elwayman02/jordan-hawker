export default function () {
    var createRouteTransition = (fromRoute, excludeRoutes) => {
        var duration = 150;
        if (!excludeRoutes) {
            excludeRoutes = [];
        }

        this.transition(
            this.fromRoute(fromRoute),
            this.toRoute(routeName => excludeRoutes.indexOf(routeName) === -1),
            this.use('toUp', { duration }),
            this.reverse('toDown', { duration })
        );
    };

    // Route Transitions
    createRouteTransition('index', ['splash']);
    createRouteTransition('code', ['splash', 'index']);
    createRouteTransition('music', ['splash', 'index', 'code']);
    createRouteTransition('dance', ['splash', 'index', 'code', 'music']);
    createRouteTransition('blog', ['splash', 'index', 'code', 'music', 'dance']);

    // Splash Transitions
    var splashDuration = 150;
    this.transition(
        this.hasClass('application'),
        this.toValue(false),
        this.use('explode', {
            pick: '.logo',
            use: ['fly-to', {duration: splashDuration}]
        }, {
            pick: '.site-title',
            use: ['fly-to', {duration: splashDuration}]
        })
    );

    // Carousel Transitions
    this.transition(
        this.childOf('.ember-carousel'),
        this.use('toLeft')
    );

    // Tech Description Transitions
    var techDuration = 200;
    this.transition(
        this.hasClass('tech-description'),
        this.use('explode', {
            pick: '.tech-description-header',
            use: ['fly-to', {duration: techDuration}]
        }, {
            pickNew: '.tech-description-body',
            use: ['toDown', {duration: techDuration}]
        }),
        this.reverse('explode', {
            pick: '.tech-description-header',
            use: ['fly-to', {duration: techDuration}]
        }, {
            pickOld: '.tech-description-body',
            use: ['toUp', {duration: techDuration}]
        })
    );
}
