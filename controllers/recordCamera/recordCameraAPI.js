const express = require('express');
const router = express.Router();
const https = require('https');

router.post('/uploadFile', (req, res) => {
	var formidable = require('formidable');
	var util = require('util');

	var form = new formidable.IncomingForm();

	var dir = 'public/uploads';

	form.uploadDir = dir;
	form.keepExtensions = true;
	form.maxFieldsSize = 10 * 1024 * 1024;
	form.maxFields = 1000;
	form.multiples = false;

	form.parse(req, function(err, fields, files) {
		var file = util.inspect(files);

		var fileName = file
			.split('path:')[1]
			.split('\',')[0]
			.split(dir)[1]
			.toString()
			.replace(/\\/g, '')
			.replace(/\//g, '');
		var fileURL = 'http://' + req.get('host') + '/uploads/' + fileName;
		res.write(
			JSON.stringify({
				fileURL: fileURL
			})
		);
		res.end();
	});
});

module.exports = router;
