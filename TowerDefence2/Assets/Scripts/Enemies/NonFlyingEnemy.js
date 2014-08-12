#pragma strict
import Pathfinding;

class NonFlyingEnemy extends Enemy_Base{
var tankTurret : Transform;
var tankBody : Transform;
var tankCompass : Transform;
var turnSpeed : float = 10.0;

var targetPosition : Vector3; //dest point
var seeker : Seeker; 
var controller : CharacterController;
var path : Path;
var speed : float;
var nextWaypointDistance : float = 3.0;
private var currentWaypoint : int = 0;



function Start () {
	targetPosition = GameObject.FindWithTag("GroundTargetObject").transform.position;
	GetNewPath();
}

function GetNewPath()
{
	seeker.StartPath(transform.position, targetPosition, OnPathComplete);
}

function OnPathComplete(newPath : Path)
{
	if(!newPath.error)
	{
		path = newPath;
		currentWaypoint = 0;
	}
}

function FixedUpdate()
{
	if(path == null) //no path
	{
		return;// do nothing
	}
	if(currentWaypoint >= path.vectorPath.Count) //reached end
	{
		return;
	}
	var dir : Vector3 = (path.vectorPath[currentWaypoint] - transform.position).normalized; //find direction of next waypoint
	dir *= speed * Time.fixedDeltaTime; 
	
	
	controller.SimpleMove(dir); //move
	
	//tankCompass.LookAt(path.vectorPath[currentWaypoint]);\
	//tankBody.rotation = Quaternion.Lerp(tankBody.rotation, tankCompass.rotation, Time.deltaTime * turnSpeed);
	
	//check if we are close enough to next waypoint
	if(Vector3.Distance(transform.position, path.vectorPath[currentWaypoint]) < nextWaypointDistance)
	{
		currentWaypoint++;
	}
	
	
}
}
