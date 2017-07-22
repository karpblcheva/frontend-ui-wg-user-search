'use strict';

/**
 * Parses HTTP response headers and represent them as an Object
 * @param {String} httpHeaders - response headers according to HTTP spec
 * @returns {Promise}
 */
function parseHttpHeaders (httpHeaders) {
	var headers = {};
	httpHeaders
		.split(/[\n\r]/)
		.filter(function(header){
			return header;
		})
		.forEach(function (header) {
			var value = header.substr(header.indexOf(':') + 1).replace(/^\s+/, '');
			var key = header.substr(0, header.indexOf(':'));
			headers[key] = value;
		});
	return headers;
};

/**
 * Options model
 */
function Options(options) {
	this.url = String(options.url);
	this.method = String(options.method) || 'GET';
	this.body = options.body || null;
	//this.query = options.query;
	this.headers = Object(options.headers);
	this.responseType = String(options.responseType || 'text');
}

/**
 * Response object model
 */
function Response(data, textStatus, jqXHR) {
	var responseHeaders = jqXHR.getAllResponseHeaders();
	this.body = data;
	this.headers = parseHttpHeaders(responseHeaders);
	this.statusText = textStatus;
	this.status = jqXHR.status;
}

var http = {
	/**
	 * Produces HTTP request
	 * @returns {Promise}
	 */
	request: function (options) {
		options = new Options(options);
		return new Promise(function (success, fail) {
			$.ajax({
				async: true,
				url: options.url,
				type: options.method,
				data: options.body,
				dataType: (options.responseType === 'document') ? 'xml' : options.responseType,
				headers: options.headers,
				success: function (data, textStatus, jqXHR) {
					var response = new Response(data, textStatus, jqXHR);
					success(response);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					fail(errorThrown);
				}
			});
		});
	},
	/**
	 * Produces HTTP GET request
	 * @returns {Promise}
	 */
	get: function (options) {
		options.method = 'GET';
		return http.request(options);
	},
	/**
	 * Produces HTTP HEAD request
	 * @returns {Promise}
	 */
	head: function (options) {
		options.method = 'HEAD';
		return http.request(options);
	}
};
