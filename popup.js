let loadButton = document.getElementById("load");
let saveButton = document.getElementById("save");
let deleteButton = document.getElementById("delete");
let confirmButton = document.getElementById("confirm");
let mergeButton = document.getElementById("merge");
let replaceButton = document.getElementById("replace");
let cancelLoadButton = document.getElementById("cancelLoad");
let cancelDelButton = document.getElementById("cancelDel");
let fileInput = document.getElementById("file");
let file;

let confirmDiv = document.getElementById("confirmDiv");
let loadOptions = document.getElementById("loadOptions");

fileInput.onchange = e =>
{
	if(e.target.files[0] != null)
	{
		fileInput.style = "";
		let reader = new FileReader();
		reader.onload = e =>
		{
			try
			{
				file = JSON.parse(e.target.result).listContent;

			}
			catch
			{
				console.log("File incompatible, failed to parse JSON");
				fileInput.style = "background-color: red;";
			}
			
		}	
		reader.readAsText(e.target.files[0]);
	}	
}

loadButton.onclick = e =>
{
	loadOptions.style = "max-height: 50px;";
}
saveButton.onclick = e =>
{
	chrome.storage.sync.get(["listContent"], value =>
	{
		if(value != null)
		{
			downloadObjectAsJson(value, "annotations");
		}
	});
}
deleteButton.onclick = e =>
{	
	confirmDiv.style = "max-height: 30px;";
}
confirmButton.onclick = e =>
{
	chrome.storage.sync.clear();
	cancelDelButton.click();
	refresh();
}
cancelDelButton.onclick = e =>
{	
	confirmDiv.style = "max-height: 0px;";
}
cancelLoadButton.onclick = e =>
{	
	loadOptions.style = "max-height: 0px;";
}
mergeButton.onclick = e =>
{
	chrome.storage.sync.get(["listContent"], value =>
	{
		if(file != undefined)
		{
			let newList;
			if(value.listContent != undefined)
			{
				newList = value.listContent.concat(file);
				newList = newList.reduce((unique, o) => 
				{
					if(!unique.some(oagain => oagain.page === o.page && oagain.content === o.content)) 
					{
					  unique.push(o);
					}
					return unique;
				},[]);
			}
			else
			{
				newList = file;
			}
			chrome.storage.sync.set({"listContent": newList});
			cancelLoadButton.click();
			refresh();
		}
	});	
}
replaceButton.onclick = e =>
{
	if(file != undefined)
	{
		chrome.storage.sync.set({"listContent": file});
		cancelLoadButton.click();
		refresh();
	}
}
function downloadObjectAsJson(object, fileName)
{
	let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(object));
	let dl = document.createElement('a');
	dl.setAttribute("href", dataStr);
	dl.setAttribute("download", fileName + ".json");
	document.body.appendChild(dl);
	dl.click();
	dl.remove();
}

function refresh()
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    });
}