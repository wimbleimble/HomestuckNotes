class annotationList
{
	constructor(annotations)
	{
		if(annotations == undefined)
		{
			this._annotations = [];
		}
		else
		{
			this._annotations = annotations;
		}
	}
	get annotations()
	{
		return this._annotations;
	}
	set annotations(n)
	{
		this._annotations = n;
	}
	add(n)
	{
		this.annotations.push(n);
	}
	remove()
	{
		console.log("annotation removed");
	}
}
class annotation
{
	constructor(page, content)
	{
		this.page = page;
		this.content = content;
	}
}

const container = document.getElementsByClassName("pos-r")[0];
const wrapperDiv = document.createElement("div");
wrapperDiv.innerHTML = "<div class = 'row bg-hs-gray bg-light-gray--md pad-t-md--md pos-r'><div style = 'max-width:650px; margin-left: auto; margin-right: auto; text-align: center;'><textarea id='annotation' style = 'resize: vertical;'></textarea><button id='submit'>Submit Annotation</button></div></div>";
container.appendChild(wrapperDiv);
const submitButton = document.getElementById("submit");
const textArea = document.getElementById("annotation");
const url = window.location.href;
let commentDiv = document.createElement("div");
container.appendChild(commentDiv);
let pageNumber = parseInt(url.slice(32));
if(isNaN(pageNumber))
{
	pageNumber = 1;
}
let list;
chrome.storage.local.get(["listContent"], value => 
{
	if(value.listContent == undefined)
	{
		list = new annotationList();
	}
	else
	{
		list = new annotationList(value.listContent);
	}
	updateAnnotations();
});



function updateAnnotations()
{
	commentDiv.innerHTML = "";
	for(var i = 0; i < list.annotations.length; i++)
	{
		if(pageNumber == list.annotations[i].page)
		{
			let ano = document.createElement("div");
			ano.innerHTML = "<div class='row bg-hs-gray bg-light-gray--md pad-b-md pad-b-lg--md pos-r' style = 'padding-bottom: 15px; padding-top: 10px;'><div class='mar-x-auto disp-bl bg-hs-gray' style = 'max-width: 650px; padding: 15px;'>" + list.annotations[i].content + "</div></div>";
			commentDiv.appendChild(ano);
		}
	}
}

submitButton.addEventListener("click", () =>
{
	let text = textArea.value;
	textArea.value = "";
	text = text.replace(/\n\r/g,"<br />");
	text = text.replace(/\n/g,"<br />");
	let newNote = new annotation(pageNumber, text);
	list.add(newNote);
	updateAnnotations();
	chrome.storage.local.set({"listContent": list.annotations});
});
