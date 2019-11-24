chrome.runtime.onInstalled.addListener(() =>
{
	chrome.storage.sync.set({color: "#3aa757"}, function() {
		console.log("the colour is green");
	});
		chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
	  	chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
			pageUrl: {hostEquals: 'www.homestuck.com'},
		})
		],
			actions: [new chrome.declarativeContent.ShowPageAction()]
	  }]);
	});
});
