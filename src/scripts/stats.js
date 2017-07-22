'use strict';

var stats = {
	APP_ID: 'f78262d696f0b177c0a7280b26c877cb',
	SEARCH_REQUEST_URL: 'https://api.worldoftanks.ru/wot/account/list/',
	searchUsers: function (searchString, options) {
		options = options || {};
		return http.get({
			url: this.SEARCH_REQUEST_URL,
			responseType: 'json',
			body: {
				// account_id: options.userId,
				search: searchString,
				limit: options.limit,
				application_id: this.APP_ID
			},
			cache: false
		}).then(function (response) {
			return response.body.data;
		});
	}
};
