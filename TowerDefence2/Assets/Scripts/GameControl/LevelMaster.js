#pragma strict
import Pathfinding;
//Global Variables
static var playerDamage = 0;

//Pathfinding
var astarPath : AstarPath;

//States
var upgradePanelOpen : boolean = false;

//Player Variables
var healthCount : int = 10;
var scoreCount : int = 0;
var cashCount : int = 100000;
var playerBase : Transform;

//path block detecting
var startNode : GraphNode;
var endNode : GraphNode;
var isBlocked : boolean = false;

//Enemy variables
var enemyPrefabs : GameObject[];
var flyerSpawns : Transform;
var groundSpawns : Transform;
private var flyerSpawnPoints : Transform[];
private var groundSpawnPoints : Transform[];
var respawnMinBase : float = 3.0;
var respawnMaxBase : float = 10.0;
private var respawnMin : float = 3.0;
private var respawnMax : float = 10.0;
var respawnInterval : float = 2.5;
private var lastSpawnTime : float = 0;
var enemyCount : int = 0;

//Enemies
var enemyCosts : int[];
var allEnemies : GameObject[];
var enemyCostTexts : UILabel[];
private var enemyIndex;

//Turrets
var turretCosts : int[];
var onColor : Color;
var offColor : Color;
var allStructures : GameObject[];
var buildBtnGraphics : UISprite[];
var costTexts : UILabel[];
private var structureIndex : int = 0;

//---GUI ITEMS
//GUI Variables
var waveText : UILabel;
var healthText : UILabel;
var scoreText : UILabel;
var cashText : UILabel;
var upgradeText : UILabel;
var upgradeBtn : GameObject;

//NGUI items
var buildPanelOpen : boolean = false;
var buildPanelTweener : TweenPosition;
var buildPanelArrowTweener : TweenRotation;
var spawnPanelOpen : boolean = false;
var spawnPanelTweener : TweenPosition;
var spawnPanelArrowTweener : TweenRotation;
var upgradePanelTweener : TweenPosition;

//placement planes items
var placementPlanesRoot : Transform;
var hoverMat : Material;
var placementLayerMask : LayerMask;
var nguiLayerMask : LayerMask;
private var originalMat : Material;
private var lastHitObj : GameObject;

//upgrade variables
private var focusedPlane : PlacementPlane;
private var structureToUpgrade : Turret_Base;
private var upgradeStructure : GameObject;
private var upgradeCost : int;
//---



function Start () {
	for(var thePlane : Transform in placementPlanesRoot)
	{
		thePlane.gameObject.renderer.enabled = false;
	}
	structureIndex = 0;
	enemyIndex = 0;
	UpdateGUI();
	
	flyerSpawnPoints = new Transform[flyerSpawns.childCount];
	var i : int = 0;
	for(var theSpawnPoint : Transform in flyerSpawns)
	{
		flyerSpawnPoints[i] = theSpawnPoint;
		i++;
	}
	
	groundSpawnPoints = new Transform[groundSpawns.childCount];
	var j : int = 0;
	for(var theSpawnPoint : Transform in groundSpawns)
	{
		groundSpawnPoints[j] = theSpawnPoint;
		j++;
	}
}

function Update () {
	//---BEGIN GUI
	if(buildPanelOpen || spawnPanelOpen)
	{
		var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var hit : RaycastHit;
		if(Physics.Raycast(ray, hit, 1000, placementLayerMask))
		{
			if(lastHitObj)
			{
			
				lastHitObj.renderer.material = originalMat;
			}
			
			lastHitObj = hit.collider.gameObject;
			originalMat = lastHitObj.renderer.material;
			lastHitObj.renderer.material = hoverMat;
		}
		else
		{
			if(lastHitObj)
			{
				lastHitObj.renderer.material = originalMat;
				lastHitObj = null;
			}	
		}
		
		//turret placement
		PlaceTurret();
	}
	//---END GUI
}

function SetBuildChoice(obj : GameObject)
{
	if(obj.tag.Equals("Button_Cannon"))
	{	
		structureIndex = 0;
	}	
	else if(obj.tag.Equals("Button_SAM"))
	{
		structureIndex = 1;   
	}
}

function SetEnemyChoice(obj : GameObject)
{
	if(obj.tag.Equals("Button_LilGuy"))
	{	
		enemyIndex = 1;
	}	
	else if(obj.tag.Equals("Button_FlyGuy"))
	{
		enemyIndex = 0;   
	}
	SendEnemy();
}

function ToggleBuildPanel()
{
	if(buildPanelOpen)
	{
		//hide all build tiles
		for(var thePlane : Transform in placementPlanesRoot)
		{
			thePlane.gameObject.renderer.enabled = false;
		}
		
		//fly out the build panel
		buildPanelTweener.Play(false);
		//rotate the build panel arrow
		buildPanelArrowTweener.Play(false);
		//Mark panel as closed
		buildPanelOpen = false;
	
	}
	else{
		//show all build tiles
		for(var thePlane : Transform in placementPlanesRoot)
		{
			thePlane.gameObject.renderer.enabled = true;
		}
		
		//fly in the build panel
		buildPanelTweener.Play(true);
		//rotate build panel arrow
		buildPanelArrowTweener.Play(true);
		//mark the panel as open
		buildPanelOpen = true;
	}

}

function ToggleSpawnPanel()
{
Debug.Log("in toggle spawn panel");
	if(spawnPanelOpen)
	{
		//hide all build tiles
		for(var thePlane : Transform in placementPlanesRoot)
		{
			thePlane.gameObject.renderer.enabled = false;
		}
		
		//fly out the build panel
		spawnPanelTweener.Play(false);
		//rotate the build panel arrow
		spawnPanelArrowTweener.Play(false);
		//Mark panel as closed
		spawnPanelOpen = false;
	
	}
	else{
		//show all build tiles
		for(var thePlane : Transform in placementPlanesRoot)
		{
			thePlane.gameObject.renderer.enabled = true;
		}
		
		//fly in the build panel
		spawnPanelTweener.Play(true);
		//rotate build panel arrow 
		spawnPanelArrowTweener.Play(true);
		//mark the panel as open
		spawnPanelOpen = true;
	}

}

function UpdateGUI()
{
	scoreText.text = "Score: "+scoreCount;
	healthText.text = "Health: "+ healthCount;
	cashText.text = "Cash: " +cashCount;
	

	for(var theBtnGraphic : UISprite in buildBtnGraphics)
	{
		theBtnGraphic.color = offColor;
	}
	
	buildBtnGraphics[structureIndex].color = onColor;
	CheckTurretCosts();
}

function ShowUpgradeGUI()
{
	structureToUpgrade = focusedPlane.myStructure.GetComponent(Turret_Base);
	upgradeStructure = structureToUpgrade.myUpgrade;
	
	if(upgradeStructure != null)
	{
		upgradePanelOpen = true;
		
		upgradeCost = structureToUpgrade.myUpgradeCost;
		var upgradeName = structureToUpgrade.myUpgradeName;
		
		upgradeText.text = ""+upgradeCost;
		CostCheckButton(upgradeBtn, upgradeCost);
		upgradePanelTweener.Play(true);
	}
}

function CheckTurretCosts()
{
	for(var i : int = 0; i < allStructures.length; i++)
	{
		if(turretCosts[i] > cashCount)
		{
			costTexts[i].color = Color.red;
			buildBtnGraphics[i].color = Color(.5, .5, .5, .5);
			buildBtnGraphics[i].transform.parent.gameObject.collider.enabled = false;
		}
		else{
			costTexts[i].color = Color.green;
			
			if(structureIndex == i)
			{
				buildBtnGraphics[i].color = onColor;
			}
			else{
				buildBtnGraphics[i].transform.parent.gameObject.collider.enabled = true;
			}
		}
	}
}

function CostCheckButton(theBtn : GameObject, itemCost : int)
{
	if(cashCount < itemCost)
	{
		theBtn.transform.Find("Label").gameObject.GetComponent(UILabel).color = Color.red;
		theBtn.transform.Find("Background").gameObject.GetComponent(UISprite).color = Color(.5,.5,.5,.5);
		theBtn.collider.enabled = false;
	}
	else{
		theBtn.transform.Find("Label").gameObject.GetComponent(UILabel).color = Color.green;
		theBtn.transform.Find("Background").gameObject.GetComponent(UISprite).color = onColor;
		theBtn.collider.enabled = true;
	}
}

function ConfirmUpgrade()
{
	var spawnPos = structureToUpgrade.transform.position;
	var spawnRot = structureToUpgrade.transform.rotation;
	Destroy(structureToUpgrade.gameObject);
	var newStructure : GameObject = Instantiate(upgradeStructure, spawnPos, spawnRot);
	focusedPlane.myStructure = newStructure;
	
	cashCount -= upgradeCost;
	UpdateGUI();
	upgradePanelTweener.Play(false);
	upgradePanelOpen = false;
}

function CancelUpgrade()
{
	upgradePanelTweener.Play(false);
	upgradePanelOpen = false;
}

function RemoveTurret()
{
	Destroy(structureToUpgrade.gameObject);
	focusedPlane.myStructure = null;
	focusedPlane.gameObject.tag = "PlacementPlaneOpen";
	upgradePanelTweener.Play(false);
	upgradePanelOpen = false;
	astarPath.Scan();
	astarPath.FloodFill();
	RecalculateAIPath();
	//not working for some reason //cashCount += turretCosts[structureIndex];
}

function DetectBlocking()
{
	var startNode : GraphNode = astarPath.active.GetNearest(groundSpawnPoints[0].position, NNConstraint.Default).node;
	var endNode : GraphNode = astarPath.active.GetNearest(playerBase.position, NNConstraint.Default).node;
	
	if(!Pathfinding.PathUtilities.IsPathPossible(startNode, endNode))
	{
		isBlocked = true;
		Debug.Log("Path NOT possible: " + isBlocked);
	}
}

function PlaceTurret()
{
	if(Input.GetMouseButtonDown(0) && lastHitObj.tag == "PlacementPlaneOpen")
		{
			focusedPlane = lastHitObj.GetComponent(PlacementPlane);
			if(turretCosts[structureIndex] <= cashCount)
			{
				var newStructure : GameObject = Instantiate(allStructures[structureIndex], lastHitObj.transform.position, Quaternion.identity);
				//newStructure.transform.localEulerAngles.y = (Random.Range(0,360));
				newStructure.transform.localPosition.y = .5;
				lastHitObj.tag = "PlacementPlaneClosed";
				
				if(!isBlocked)
				{
					focusedPlane.myStructure = newStructure;
					focusedPlane.isOpen = false;
				}
				else
				{
					Debug.Log("in else");
				}
				
				DetectBlocking();
				Debug.Log("isBlocking AFTER detect blocking: " + isBlocked);
				
				cashCount -= turretCosts[structureIndex];
				UpdateGUI();
				
				//update A* path
				RecalculateAIPath();
			}
		}
		else if(Input.GetMouseButtonDown(0) && lastHitObj.tag == "PlacementPlaneClosed" && turretCosts[structureIndex] <= cashCount)
		{
			focusedPlane = lastHitObj.GetComponent(PlacementPlane);
			ShowUpgradeGUI();
		}
}

function SendEnemy()
{
	var spawnChoice : int; //determines which spawnpoint to spawn at
	if(enemyPrefabs[enemyIndex].tag == "Air Enemy")
	{
		spawnChoice = Random.Range(0, flyerSpawnPoints.length);
		Instantiate(enemyPrefabs[enemyIndex], flyerSpawnPoints[spawnChoice].position, flyerSpawnPoints[spawnChoice].rotation);
		
	}
	else{
		spawnChoice = Random.Range(0, groundSpawnPoints.length);
		Instantiate(enemyPrefabs[enemyIndex], groundSpawnPoints[spawnChoice].position, groundSpawnPoints[spawnChoice].rotation);
	}
}

function RecalculateAIPath()
{
	astarPath.Scan();
	for(var theEnemy : GameObject in GameObject.FindGameObjectsWithTag("Ground Enemy"))
	{
		theEnemy.GetComponent(NonFlyingEnemy).GetNewPath();
	}
}