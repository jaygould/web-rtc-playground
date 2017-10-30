import RecordRTC from 'recordrtc';

export const recordCamera = () => {
	let recordRTC;
	let video = document.getElementById('localVideo');
	let videoPlayback = document.getElementById('recordedVideo');
	let startBtn = document.getElementById('startBtn');
	let stopBtn = document.getElementById('stopBtn');

	const uploadVideo = () => {
		var fileName = generateRandomString() + '.webm';
		var videoData = recordRTC.getBlob();

		var file = new File([videoData], fileName, {
			type: 'video/webm'
		});
		videoPlayback.src = '';
		xhr('/video/uploadFile', file, function(responseText) {
			var fileURL = JSON.parse(responseText).fileURL;
			console.info('fileURL', fileURL);
			videoPlayback.src = fileURL;
			videoPlayback.play();
			videoPlayback.muted = false;
			videoPlayback.controls = true;
			console.log(videoPlayback.src);
		});
	};

	const _successCallback = stream => {
		video.srcObject = stream;
		var options = {
			mimeType: 'video/webm',
			audioBitsPerSecond: 256000,
			videoBitsPerSecond: 256000
		};
		recordRTC = RecordRTC(stream, options);
		recordRTC.startRecording();
	};
	const _errorCallback = err => {
		console.log('The following error occurred: ' + err.name);
	};

	//Start/Stop event handlers
	startBtn.onclick = () => {
		navigator.getUserMedia(
			{ audio: false, video: true },
			_successCallback,
			_errorCallback
		);
	};
	stopBtn.onclick = () => {
		recordRTC.stopRecording(uploadVideo);
	};
};

const xhr = (url, data, callback) => {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			callback(request.responseText);
		}
	};
	request.open('POST', url);
	var formData = new FormData();
	formData.append('file', data);
	request.send(formData);
};

const generateRandomString = () => {
	if (window.crypto) {
		var a = window.crypto.getRandomValues(new Uint32Array(3)),
			token = '';
		for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
		return token;
	} else {
		return (Math.random() * new Date().getTime())
			.toString(36)
			.replace(/\./g, '');
	}
};
