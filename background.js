chrome.runtime.onInstalled.addListener(() =>
{
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
