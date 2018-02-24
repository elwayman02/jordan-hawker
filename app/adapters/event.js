import DS from 'ember-data';

const { RESTAdapter } = DS;

export default RESTAdapter.extend({
  findAll() {
    return { events: this.getData() };
  },

  getData() {
    return [{
      "id": 1,
      "name": 'AndryX',
      "location": 'Anderson, IN',
      "type": 'weekend',
      "styles": ['Blues', 'Fusion', 'Lindy'],
      "dates": ['2013']
    }, {
      "id": 2,
      "name": 'Austin Blues Party',
      "location": 'Austin, TX',
      "type": 'weekend',
      "styles": ['Blues'],
      "dates": ['2014']
    }, {
      "id": 3,
      "name": 'Austin Fusion Party',
      "location": 'Austin, TX',
      "type": 'weekend',
      "styles": ['Fusion'],
      "dates": ['2015']
    }, {
      "id": 4,
      "name": 'Bluemington',
      "location": 'Bloomington, IN',
      "type": 'weekend',
      "styles": ['Blues'],
      "dates": ['2013']
    }, {
      "id": 5,
      "name": 'Bluesalicious',
      "location": 'Memphis, TN',
      "type": 'weekend',
      "styles": ['Blues'],
      "dates": ['2010']
    }, {
      "id": 6,
      "name": 'Bradley University Lindy Exchange',
      "location": 'Peoria, IL',
      "type": 'weekend',
      "styles": ['Blues', 'Lindy'],
      "dates": ['2011', '2012', 'Spring 2013', 'Fall 2013']
    }, {
      "id": 7,
      "name": 'DJX Fusion Weekend',
      "location": 'Philadelphia, PA',
      "type": 'weekend',
      "styles": ['Fusion'],
      "dates": ['2014']
    }, {
      "id": 8,
      "name": 'Illinois State Lindy Exchange',
      "location": 'Bloomington, IL',
      "type": 'weekend',
      "styles": ['Blues', 'Lindy'],
      "dates": ['2011', '2012', '2013']
    }, {
      "id": 9,
      "name": 'ISU Blues Workshop',
      "location": 'Bloomington, IL',
      "type": 'weekend',
      "styles": ['Blues'],
      "dates": ['2013']
    }, {
      "id": 10,
      "name": 'Matt & Chris\' Wedding Workshop Exchange',
      "location": 'Peoria, IL',
      "type": 'weekend',
      "styles": ['Blues', 'Fusion', 'Lindy'],
      "dates": ['2013']
    }, {
      "id": 11,
      "name": 'Peoria Blues & Jazz Exchange',
      "location": 'Peoria, IL',
      "type": 'weekend',
      "styles": ['Blues', 'Lindy'],
      "dates": ['2009', '2011', '2012']
    }, {
      "id": 12,
      "name": 'Seattle Fusion Festival',
      "location": 'Seattle, WA',
      "type": 'weekend',
      "styles": ['Fusion'],
      "dates": ['2014']
    }, {
      "id": 13,
      "name": 'Scramble Light Blues',
      "location": 'Muncie, IN',
      "type": 'weekend',
      "styles": ['Blues'],
      "dates": ['2011']
    }, {
      "id": 14,
      "name": 'Show-Me Blues',
      "location": 'St. Louis, MO',
      "type": 'weekend',
      "styles": ['Blues'],
      "dates": ['2010']
    }, {
      "id": 15,
      "name": 'Winter Blues Workshop',
      "location": 'Champaign-Urbana, IL',
      "type": 'weekend',
      "styles": ['Blues'],
      "dates": ['2010']
    }, {
      "id": 16,
      "name": 'Atomic Cowboy',
      "location": 'St. Louis, MO',
      "type": 'recurring',
      "styles": ['Lindy']
    }, {
      "id": 17,
      "name": 'Beat The Blues',
      "location": 'Berkeley, CA',
      "type": 'recurring',
      "styles": ['Blues']
    }, {
      "id": 18,
      "name": 'Blues In The Burbs',
      "location": 'St. Louis, MO',
      "type": 'recurring',
      "styles": ['Blues', 'Fusion']
    }, {
      "id": 19,
      "name": 'Hellfire House',
      "location": 'Bay Area, CA',
      "type": 'recurring',
      "styles": ['Fusion', 'House Party']
    }, {
      "id": 20,
      "name": 'Swing Columbus',
      "location": 'Columbus, OH',
      "type": 'recurring',
      "styles": ['Blues', 'Swing']
    }, {
      "id": 21,
      "name": 'Friday Night Blues',
      "location": 'San Francisco, CA',
      "type": 'recurring',
      "styles": ['Blues']
    }, {
      "id": 22,
      "name": 'Illini Swing Society',
      "location": 'Champaign-Urbana, IL',
      "type": 'recurring',
      "styles": ['Blues', 'Lindy']
    }, {
      "id": 23,
      "name": 'ISU Swingin\' Redbirds',
      "location": 'Bloomington, IL',
      "type": 'recurring',
      "styles": ['Blues', 'Lindy']
    }, {
      "id": 24,
      "name": 'Mission: Fusion',
      "location": 'San Francisco, CA',
      "type": 'recurring',
      "styles": ['Fusion']
    }, {
      "id": 25,
      "name": 'Rhythm In Hues',
      "location": 'Chicago, IL',
      "type": 'recurring',
      "styles": ['Fusion']
    }, {
      "id": 26,
      "name": 'Shades Of Blues',
      "location": 'San Francisco, CA',
      "type": 'recurring',
      "styles": ['Blues', 'Fusion']
    }, {
      "id": 27,
      "name": 'South Bay Fusion',
      "location": 'Redwood City, CA',
      "type": 'recurring',
      "styles": ['Blues', 'Fusion']
    }];
  }
});
