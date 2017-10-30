// Get dependencies
const express = require('express');
const path = require('path');
const cors = require('cors');
const chalk = require('chalk');
const compression = require('compression');
const errorHandler = require('errorhandler');
const expressStatusMonitor = require('express-status-monitor');
const bodyParser = require('body-parser');

//Load environment variables
require('dotenv').config();

//Route handlers
const indexController = require('./controllers/index');
const showCameraController = require('./controllers/showCamera/showCamera');
const recordCameraController = require('./controllers/recordCamera/recordCamera');
const recordCameraAPI = require('./controllers/recordCamera/recordCameraAPI');

//Create server
const app = express();

//Express configuration
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 1337);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compression());
//app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use(lusca.xframe('SAMEORIGIN'));
// app.use(lusca.xssProtection(true));
app.use(
	express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

//Error handler
app.use(errorHandler());

//App routes
app.get('/', indexController.index);
app.get('/showCamera', showCameraController.index);
app.get('/recordCamera', recordCameraController.index);

app.use('/video', recordCameraAPI);

let server = app.listen(app.get('port'), () => {
	console.log(
		'%s App is running at http://localhost:%d in %s mode',
		chalk.green('✓'),
		app.get('port'),
		app.get('env')
	);
	console.log('Press CTRL-C to stop\n');
});

//Setup Ngrok for creating URLs for different peers
var ngrok = require('ngrok');
ngrok.connect(
	{
		proto: 'http',
		addr: app.get('port')
	},
	function(err, url) {
		console.log(
			'%s App is also running over the web at %s thanks to Ngrok',
			chalk.green('✓'),
			chalk.blue(url)
		);
	}
);

//Web sockets setup (not currently used but can be used when doing peer to peer connections with signalling server)
let io = require('socket.io')(server);
io.on('connection', socket => {
	console.log('Connected...');
	socket.on('disconnect', function() {
		console.log('Disconnected.');
	});
});
app.set('socketio', io);

//Status monitor uses it's own socket.io instance by default, so we need to
//pass our instance as a parameter else it will throw errors on client side
app.use(expressStatusMonitor({ websocket: io, port: app.get('port') }));
