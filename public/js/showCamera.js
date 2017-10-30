export const showCamera = () => {
	navigator.getUserMedia(
		{ audio: false, video: true },
		function(stream) {
			var video = document.getElementById('localVideo');
			video.srcObject = stream;
		},
		function(err) {
			console.log('The following error occurred: ' + err.name);
		}
	);
};
