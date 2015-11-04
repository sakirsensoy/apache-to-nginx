var fs         = require('graceful-fs');
var apacheconf = require('apacheconf');
var format     = require('string-template');

// parameters
var args           = process.argv;
var apacheConfFile = args[2];
var outputFolder   = args[3];
var tplFile        = args[4];

// parameter controls
if (! apacheConfFile || ! outputFolder) throw 'Error: Wrong parameters!';

// get nginx conf template
var configTpl = fs.readFileSync(tplFile || __dirname + '/default.tpl', 'utf8');

// read apache virtual.conf
apacheconf(apacheConfFile, function (err, config, parser) {

	if (err) throw err;

	config.VirtualHost.forEach(function (hostConf) {

		// prepare server name
		var serverName = [];

		if (hostConf.ServerName) {

			serverName.push(hostConf.ServerName[0]);
		}

		if (hostConf.ServerAlias && hostConf.ServerAlias.length > 0) {

			serverName = serverName.concat(hostConf.ServerAlias);
		}

		// ip-port
		var listen = hostConf.$args || '80';

		// format template
		var formattedTpl = format(configTpl, {
			listen     : listen,
			serverName : serverName[0],
			directory  : hostConf.DocumentRoot[0]
		});

		// save nginx config file
		fs.writeFile(outputFolder + '/' + serverName[0] + '.conf', formattedTpl, 'utf8', function (err) {

			if (err) throw err;

			console.log(serverName[0] + ' configuration saved.');
		});
	});
});
