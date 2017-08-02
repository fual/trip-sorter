/**
* Module of Application which find the cheapest or fastest way
* to travel from a city to another.
*/
const TripSorter = (function(Components, document){
  const sorterParams = {
    arrival: null,
    departure: null,
    // cheapest || fastest
    sortRule: null
  };

  return {
    /**
    * Initialize the application
    */
    init() {
      this.content = document.querySelectorAll('.content')[0];
      this.initDealsData();
      this.renderSearch();
      this.initEventListeners();
    },

    /**
    * Initialize deals data
    */
    initDealsData() {
      this.deals = JSONresponse.deals;
      if (JSONresponse.deals) {
        this.deals = this._preparingDeals(JSONresponse.deals);
      }
      this._arrivalCitiesList = _.keys(_.groupBy(this.deals, 'arrival'));
      this._getDepartureCitiesList = _.keys(_.groupBy(this.deals, 'departure'));
    },

    /**
    * Prepare deals for sorting
    * @param {Array} deals - deal.
    * @param {String} deals[].cost - cost
    * @param {String} deals[].discount - discount
    * @param {String} deals[].duration.h - duration in hours
    * @param {String} deals[].duration.m - duration in minutes
    * @returns {Array} preparing deals
    */
    _preparingDeals(deals) {
      const costWithDiscount = deal => deal.cost * (deal.discount / 100);
      const durationFull = deal => (deal.duration.h * 60) + (deal.duration.m * 1);
      return deals.map(deal => Object.assign({}, deal, {
        fullPrice: deal.discount ? costWithDiscount(deal) : deal.cost,
        durationFull: durationFull(deal)
      }));
    },

    /**
    * Init switcher. Activate item
    */
    initSwitcher() {
      this.activeSwitcherItem = document.querySelectorAll('.switcher__item')[0];
      this.activateSwitcherItem();
    },

    /**
    * Activate switcher item
    */
    activateSwitcherItem() {
      this.activeSwitcherItem.classList.add('switcher__item_active');
      sorterParams.sortRule = this.activeSwitcherItem.getAttribute('data-rule');
    },

    /**
    * Init event listeners
    */
    initEventListeners() {
      this.initClickListeners();
      this.initChangeListeners();
    },

    /**
    * Init click listeners
    */
    initClickListeners() {
      document.addEventListener('click', (e) => {
        const classList = e.target.classList;
        if (classList.contains('switcher__item')) {
          this.onSwitcherItemClick(e.target);
        }
        if (classList.contains('button-search')) {
          this.onSearchButtonClick();
        }
        if (classList.contains('button-reset')) {
          this.renderSearch();
        }
      });
    },

    /**
    * Init change listeners
    */
    initChangeListeners() {
      document.addEventListener('change', (e) => {
        const classList = e.target.classList;
        if (classList.contains('arrival')) {
          this.updateSorterParamByTargetSelect('arrival', e.target);
        }
        if (classList.contains('departure')) {
          this.updateSorterParamByTargetSelect('departure', e.target);
        }
      });
    },

    /**
    * Update sorter param by target select
    * @param {String} name - name of property
    * @param {Object} target - target select
    */
    updateSorterParamByTargetSelect(name, target) {
      const paramTarget = [...target].find(option => option.selected);
      sorterParams[name] = paramTarget.value;
    },

    /**
    * Handler on switcher item click
    * @param {Object} target
    */
    onSwitcherItemClick(target) {
      this.activeSwitcherItem && this.activeSwitcherItem !== target
        && this.activeSwitcherItem.classList.remove('switcher__item_active')
      this.activeSwitcherItem = target;
      this.activateSwitcherItem();
    },

    /**
    * Handler of click on search button
    * @param {Object} target
    */
    onSearchButtonClick(target) {
      if (!_.every(sorterParams, i => i)) {
        console.log('error');
        return;
      }
      const deal = this.findDealBySorterParams(sorterParams);
      this.renderResults(deal);
    },

    /**
    * Find deal by sorter params
    * @param {Object} params - The x value.
    * @param {String} params[]arrival - arrival city
    * @param {String} params[]departure - departure city
    * @returns {Array} deals
    */
    findDealBySorterParams(params) {
      const searchingDeals = this.deals.filter(deal =>
        deal.arrival === params.arrival && deal.departure === params.departure
      );

      const sortingByPropery = property => (a, b) => {
        if (a[property] > b[property]) { return 1; }
        if (a[property] < b[property]) { return -1; }
        return 0;
      };
      const sortingProperty = sorterParams.sortRule === 'cheapest' ? 'fullPrice' : 'durationFull';
      return searchingDeals.sort(sortingByPropery(sortingProperty));
    },

    /**
    * Render Search
    */
    renderSearch() {
      const searchHTML = Components.getSearchHtml(
        this._arrivalCitiesList, this._getDepartureCitiesList
      );
      this.content.innerHTML = searchHTML;
      this.initSwitcher();
      this._setSorterParams();
    },

    /**
    * Set sorter params
    */
    _setSorterParams() {
      sorterParams.arrival = this._arrivalCitiesList[0];
      sorterParams.departure = this._getDepartureCitiesList[0];
    },

    /**
    * Render results
    */
    renderResults(deals) {
      const resultsHtml = Components.getResultsHtml(deals);
      this.content.innerHTML = resultsHtml;
    }
  };
})(Components, window.document);
