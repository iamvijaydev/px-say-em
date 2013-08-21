
(function(win, doc) {
	var self = this;

	// quick DOM access
	var $ = function (id) {
		return doc.getElementById(id);
	}

	// quick redraw results
	var template = function (emOut, pxOut) {
		var i = 0;
		var template = '';

		for (; i < 3; i++) {
			template += '<li><span>';

			if (self.toEm) {
				switch (i) {
					case 0:
						template += !emOut ? 'em only' : emOut;
						break;
					case 1:
						template += !emOut ? 'em and px' : emOut + '<b>' + pxOut + '</b>';
						break;
					case 2:
						template += !emOut ? 'em, px and base' : emOut + '<b>' + pxOut + ' /* base ' + self.baseVal + 'px */' + '</b>'
						break;
				}
			} else {
				switch (i) {
					case 0:
						template += !emOut ? 'px only' : pxOut;
						break;
					case 1:
						template += !emOut ? 'px and em' : pxOut + '<b>' + emOut + '</b>';
						break;
					case 2:
						template += !emOut ? 'px, em and base' : pxOut + '<b>' + emOut + ' /* base ' + self.baseVal + 'px */' + '</b>'
						break;
				}
			}

			template += '</span></li>'
		}

		return template;
	};

	// cache the DOM nodes
	this.$base    = $('base');
	this.$px_in   = $('px_in');
	this.$results = $('results');
	this.$mode    = $('mode');

	// default base value
	this.baseVal = 12;
	// default mode is toEm
	this.toEm = true;
	// default output
	this.$results.innerHTML = template();

	// do the execution
	var exec = function(value) {
		// local variables
		var key   = 0;
		var input = value.replace(/^\s+|\s+$/g, '').split(' ');
		var emOut = self.toEm ? '' : ' /* ';
		var pxOut = self.toEm ? ' /* ' : '';
		var tmpry = '';

		if(value === '' || input[0].length === 0) {
			self.$results.innerHTML = template();
			return true;
		}

		for (; key < input.length; key++) {
			if (key > 3) {
				break;
			};

			// convert to integer
			tmpry = parseInt(input[key]);
			
			// convert px value to em or em to px
			tmpry = self.toEm ? (tmpry / self.baseVal).toFixed(3) : Math.round(tmpry * self.baseVal);

			// remove 0 from front
			tmpry = tmpry.toString().charAt(0) === '0' ? tmpry.slice(1) : tmpry;

			// remove trailing '0' & '.'
			if (self.toEm) {
				while(tmpry.charAt(tmpry.length - 1) === '0' || tmpry.charAt(tmpry.length - 1) === '.'){
					tmpry = tmpry.slice(0, tmpry.length - 1);
				}

				// add calculated em to emOut string
				emOut += (tmpry === '') ? '0 ' : (tmpry + '<i>em</i> ');
				pxOut += input[key] + 'px ';
			} else {
				// add calculated px to pxOut string
				pxOut += (tmpry === '') ? '0 ' : (tmpry + '<i>px</i> ');
				emOut += input[key] + 'em ';
			}
		};

		if (self.toEm) {
			// closing for emOut
			emOut = emOut.slice(0, emOut.length - 1) + '<u>;</u>';
			// closing for pxOut
			pxOut += '*/';
		} else {
			// closing for emOut
			emOut += '*/';
			// closing for pxOut
			pxOut = pxOut.slice(0, pxOut.length - 1) + '<u>;</u>';
		};

		// print result
		self.$results.innerHTML = template(emOut, pxOut);
	};

	// save base font size from DOM. execute
	$base.addEventListener('input', function() {
		self.baseVal = this.value;
		exec($px_in.value);
	}, false);

	// as user changes mode
	$mode.addEventListener('change', function() {
		self.baseVal = $base.value;
		self.toEm = this.value === 'px' ? true : false;
		exec($px_in.value);
	}, false);

	// as user types, execute
	$px_in.addEventListener('input', function() {
		this.value = this.value.replace(/[^0-9 ]+/, '').replace(/^\s+|\s+$/g, ' ');
		exec(this.value);
	}, false);

})(window, document, undefined);