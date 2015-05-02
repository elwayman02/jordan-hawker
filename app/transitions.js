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
    createRouteTransition('index');
    createRouteTransition('code', ['index']);
    createRouteTransition('music', ['index', 'code']);
    createRouteTransition('dance', ['index', 'code', 'music']);
    createRouteTransition('blog', ['index', 'code', 'music', 'dance']);

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
            use: ['fly-to', {techDuration}]
        }, {
            pickNew: '.tech-description-body',
            use: ['toDown', {techDuration}]
        }),
        this.reverse('explode', {
            pick: '.tech-description-header',
            use: ['fly-to', {techDuration}]
        }, {
            pickOld: '.tech-description-body',
            use: ['toUp', {techDuration}]
        })
    );
}
