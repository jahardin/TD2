#pragma strict

var gameName : String = "CGCookie_Tutorial_Networking";

private var refreshing = false;

private var btnX:float;
private var btnY:float;
private var btnW:float;
private var btnH:float;

function Start()
{
	btnX = Screen.width * .05;
	btnY = Screen.width * .05;
	btnW = Screen.width * .1;
	btnH = Screen.width * .1;
	
}

function Update()
{
	if(refreshing)
	{
		if(MasterServer.PollHostList().Length > 0)
		{
			//rereshing = false;
		}
	}
}

function StartServer()
{
	Network.InitializeServer(32, 25001, !Network.HavePublicAddress);
	MasterServer.RegisterHost(gameName, "Tutorial Game Name", "This is a tutorial game");
}

function refreshHostList()
{
	MasterServer.RequestHostList(gameName);
	refreshing = true;
	Debug.Log(MasterServer.PollHostList().Length);
}

function OnServerInitialized()
{
	Debug.Log("Server Initialized");
}

function OnMasterServerEvent(mse : MasterServerEvent)
{
	if(mse == MasterServerEvent.RegistrationSucceeded)
	{
		Debug.Log("Registered Server");
	}
}

function OnGUI()
{

	if(GUI.Button(Rect(btnX, btnY, btnW, btnH), "Start Server"))
	{
		StartServer();
	}
	
	if(GUI.Button(Rect(btnX, btnY * 1.2 + btnH, btnW, btnH), "Refresh Host"))
	{
		refreshHostList();	
	}
}