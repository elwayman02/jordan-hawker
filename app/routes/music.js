import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return [{
      title: 'Exchanges & Workshops',
      list: [{
        name: 'AndryX',
        location: 'Anderson, IN',
        styles: ['Blues', 'Fusion', 'Lindy'],
        dates: ['2013']
      }, {
        name: 'Austin Blues Party',
        location: 'Austin, TX',
        styles: ['Blues'],
        dates: ['2014']
      }, {
        name: 'Austin Fusion Party',
        location: 'Austin, TX',
        styles: ['Fusion'],
        dates: ['2015']
      }, {
        name: 'Bluemington',
        location: 'Bloomington, IN',
        styles: ['Blues'],
        dates: ['2013']
      }, {
        name: 'Bluesalicious',
        location: 'Memphis, TN',
        styles: ['Blues'],
        dates: ['2010']
      }, {
        name: 'Bradley University Lindy Exchange',
        location: 'Peoria, IL',
        styles: ['Blues', 'Lindy'],
        dates: ['2011', '2012', 'Spring 2013', 'Fall 2013']
      }, {
        name: 'DJX Fusion Weekend',
        location: 'Philadelphia, PA',
        styles: ['Fusion'],
        dates: ['2014']
      }, {
        name: 'Illinois State Lindy Exchange',
        location: 'Bloomington, IL',
        styles: ['Blues', 'Lindy'],
        dates: ['2013']
      }, {
        name: 'ISU Blues Workshop',
        location: 'Bloomington, IL',
        styles: ['Blues'],
        dates: ['2013']
      }, {
        name: 'Matt & Chris\' Wedding Workshop Exchange',
        location: 'Peoria, IL',
        styles: ['Blues', 'Fusion', 'Lindy'],
        dates: ['2013']
      }, {
        name: 'Peoria Blues & Jazz Exchange',
        location: 'Peoria, IL',
        styles: ['Blues', 'Lindy'],
        dates: ['2009', '2011', '2012']
      }, {
        name: 'Seattle Fusion Festival',
        location: 'Seattle, WA',
        styles: ['Fusion'],
        dates: ['2014']
      }, {
        name: 'Scramble Light Blues',
        location: 'Muncie, IN',
        styles: ['Blues'],
        dates: ['2011']
      }, {
        name: 'Show-Me Blues',
        location: 'St. Louis, MO',
        styles: ['Blues'],
        dates: ['2010']
      }, {
        name: 'Winter Blues Workshop',
        location: 'Champaign-Urbana, IL',
        styles: ['Blues'],
        dates: ['2010']
      }]
    }, {
      title: 'Frequent/Weekly Events',
      list: [{
        name: 'Atomic Cowboy',
        location: 'St. Louis, MO',
        styles: ['Lindy']
      }, {
        name: 'Beat The Blues',
        location: 'Berkeley, CA',
        styles: ['Blues']
      }, {
        name: 'Blues In The Burbs',
        location: 'St. Louis, MO',
        styles: ['Blues', 'Fusion']
      }, {
        name: 'Hellfire House',
        location: 'Bay Area, CA',
        styles: ['Fusion', 'House Party']
      }, {
        name: 'Swing Columbus',
        location: 'Columbus, OH',
        styles: ['Blues', 'Swing']
      }, {
        name: 'Friday Night Blues',
        location: 'San Francisco, CA',
        styles: ['Blues']
      }, {
        name: 'Illini Swing Society',
        location: 'Champaign-Urbana, IL',
        styles: ['Blues', 'Lindy']
      }, {
        name: 'ISU Swingin\' Redbirds',
        location: 'Bloomington, IL',
        styles: ['Blues', 'Lindy']
      }, {
        name: 'Mission: Fusion',
        location: 'San Francisco, CA',
        styles: ['Fusion']
      }, {
        name: 'Rhythm In Hues',
        location: 'Chicago, IL',
        styles: ['Fusion']
      }, {
        name: 'Shades Of Blues',
        location: 'San Francisco, CA',
        styles: ['Blues', 'Fusion']
      }, {
        name: 'South Bay Fusion',
        location: 'Redwood City, CA',
        styles: ['Blues', 'Fusion']
      }]
    }];
  }
});
