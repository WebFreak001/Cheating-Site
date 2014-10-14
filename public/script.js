io = io.connect();

function handleChat()
{
	var val = document.getElementById("msg").value;
	document.getElementById("msg").value = "";
	if(val.trim() != "")
		io.emit("chat:sendmsg", val);
}

function createMessage(content, isadmin)
{
	var msg = document.createElement("div");
	msg.setAttribute("class", "animated fadeInUp msg" + (isadmin ? " admin" : ""));
	msg.textContent = content;
	return msg;
}

function createDownload(link, title)
{
	var dl = document.createElement("a");
	dl.setAttribute("class", "animated flipInY download button");
	dl.setAttribute("href", link);
	dl.textContent = title;
	return dl;
}

io.emit("chat:getfiles");

io.on("chat", function (data)
{
	document.getElementById("messages").appendChild(createMessage(data.msg, data.admin));
	document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
});

io.on("file", function (data)
{
	document.getElementById("downloads").appendChild(createDownload(data.link, data.name));
});

var isFake = false;
var hideDura = fakeAnimations ? 1000 : 1;

function showFakeSite()
{
	if(!isFake)
	{
		document.getElementById("fake").setAttribute("class", "visible");
        document.getElementById("fake").style.display = "block";
        isFake = true;
	}
}

function hideFakeSite()
{
	if(isFake)
	{
		document.getElementById("fake").setAttribute("class", fakeAnimations ? "transition hidden" : "hidden");
        window.setTimeout(function () { document.getElementById("fake").style.display = "none"; }, hideDura);
        isFake = false;
	}
}
var fakeSiteIsActive;
function handleCheats(e)
{
    e = e || window.event;
    
    

	if (enableFakeSite)
	{
        if (e.keyCode == CheatCode)
        {

            if (fakeSiteIsActive)
            {
                hideFakeSite();
                fakeSiteIsActive = false;
            } 
            else
            {
                showFakeSite();
                fakeSiteIsActive = true;
            }
        }
	}
}

document.onkeyup = handleCheats;
