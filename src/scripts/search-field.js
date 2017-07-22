'use strict';

function SearchField(element) {
	var component = this;
	this.elem = $(element);
	this.inputElem = this.elem.find('.search-field');
	this.resultListElem = this.elem.find('.search-results');

	this.elem.on('click', this.stopEvent);
	this.inputElem.on('focus', this.handleFocusIn.bind(this));
	this.inputElem.on('input', this.handleInput.bind(this));
	this.resultListElem.on('click', '.result-item', this.selectItem.bind(this));
	$(document).on('click', this.handleFocusOut.bind(this));

	this.state = this.STATE.DEFAULT;
}

SearchField.prototype = {
	MAX_RESULT_LENGTH: 7,
	STATE: {
		DEFAULT: 'state-default',
		SEARCH: 'state-search',
		NOT_FOUND: 'state-not-found',
		RESULTS: 'state-results'
	},

	set state(state) {
		this.elem.removeClass(this._state);
		this.elem.addClass(state);
		this._state = state;
		switch (state) {
			case this.STATE.SEARCH:
				this.search(this.value).then(function (results) {
					if (results && results.length) {
						this.state = this.STATE.RESULTS;
					}
					else {
						this.state = this.STATE.NOT_FOUND;
					}
				}.bind(this));
				break;
			case this.STATE.DEFAULT:
				this.inputElem.blur();
				break;
			case this.STATE.NOT_FOUND:
			case this.STATE.RESULTS:
				break;
		}
	},
	get state() {
		return this._state;
	},

	set value(value) {
		this.inputElem.val(value);
	},
	get value() {
		return this.inputElem.val();
	},

	stopEvent: function(event){
		event.stopPropagation();
	},

	/**
	 * Produces request for searching users
	 */
	search: function (queryString) {
		return stats.searchUsers(queryString, { limit: this.MAX_RESULT_LENGTH }).then(this.renderResults.bind(this));
	},

	handleInput: function () {
		this.state = this.STATE.SEARCH;
	},

	handleFocusIn: function () {
		this.handleInput();
	},

	handleFocusOut: function () {
		this.state = this.STATE.DEFAULT;
	},

	/**
	 * Handles selection of item in search history or search suggestions. Triggers `.onchange()` callback
	 */
	selectItem: function (event) {
		var userName = $(event.currentTarget).text();

		this.value = userName;
		this.handleFocusOut();
	},


	/**
	 * Shows search results on the page
	 */
	renderResults: function (data) {
		if (!data) return;

		var resultElems = $(data.map(SearchField.prototype.renderResultItem).join(''));
		this.resultListElem
			.empty()
			.append(resultElems);
		return data;
	},

	renderResultItem: function (item) {
		return '<li class="result-item" tabindex="-1" data-id="' + item.account_id + '">' + item.nickname + '</li>';
	}
};