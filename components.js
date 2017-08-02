/**
* Module of View Components
*/
const Components = (function () {
  return {
    getDealHtml(deal) {
      return `
        <div class="result">
          <div>
            <span class="city-from">${deal.arrival}</span><br/><span class="city-to">${deal.departure}</span>
          </div>
          <div class="description">
            ${deal.transport} <b>${deal.reference}</b> for <b>${deal.duration.h}h:${deal.duration.m}m</b>
          </div>
          <span class="price">${deal.fullPrice} €</span>
        </div>
      `;
    },

    getResultsHtml(deals) {
      const results = deals.length
        ? deals.map(deal => this.getDealHtml(deal)).join('')
        : this.getErrorHtml('There are no tickets in this direction');

      return `
      <div class="results">
        ${results}
        <div class="button">
          <button class="button-reset">Reset</button>
        </div>
      `;
    },

    getSelectHtml(options, className) {
      const optionsHtml = options.map(
        option => `<option value="${option}">${option}</option>`
      ).join('');
      return `<select class="${className}">${optionsHtml}</select>`;
    },

    getSearchHtml(arrivalCitiesList, departureCitiesList) {
      const departureSelect = this.getSelectHtml(departureCitiesList, 'departure');
      const arrivalSelect = this.getSelectHtml(arrivalCitiesList, 'arrival');
      return `
        <div class="select">
          From:
          ${arrivalSelect}
        </div>
        <div class="select">
          To:
          ${departureSelect}
        </div>
        <div class="switcher">
          <div class="switcher__item" data-rule="cheapest">
            Cheapest
          </div>
          <div class="switcher__item" data-rule="fastest">
            Fastest
          </div>
        </div>
        <div class="button">
          <button class="button-search">Search</button>
        </div>
      `;
    },

    getErrorHtml(text) {
      return `<div class="error">${text}</div>`;
    }
  };
})();
