const yaml = require('js-yaml');
const request = require('request-promise-native');
const AWS = require('aws-sdk');
const CDN = new AWS.S3();

exports.handler = async (event,context,callback) => {
	const rawBlacklist = await request("https://raw.githubusercontent.com/CryptoScamDB/blacklist/master/data/urls.yaml");
	const rawWhitelist = await request("https://raw.githubusercontent.com/CryptoScamDB/whitelist/master/data/urls.yaml");
	
	const blacklist = yaml.safeLoad(rawBlacklist);
	const whitelist = yaml.safeLoad(rawWhitelist);

	await CDN.putObject({
		Bucket: "cdn.cryptoscamdb.org",
		Key: "blacklist/urls.yaml",
		Body: rawBlacklist,
		ContentType: "text/yaml"
	}).promise();
	
	await CDN.putObject({
		Bucket: "cdn.cryptoscamdb.org",
		Key: "blacklist/urls.json",
		Body: JSON.stringify(blacklist,null,4),
		ContentType: "application/json"
	}).promise();
	
	await CDN.putObject({
		Bucket: "cdn.cryptoscamdb.org",
		Key: "whitelist/urls.yaml",
		Body: rawWhitelist,
		ContentType: "text/yaml"
	}).promise();
	
	await CDN.putObject({
		Bucket: "cdn.cryptoscamdb.org",
		Key: "whitelist/urls.json",
		Body: JSON.stringify(whitelist,null,4),
		ContentType: "application/json"
	}).promise();
	
	callback(null,{
		statusCode: 200,
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			success: true
		})
	});
};
