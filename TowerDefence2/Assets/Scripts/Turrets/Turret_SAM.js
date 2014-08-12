#pragma strict


class Turret_SAM extends Turret_Base
{
	var myProjectile : GameObject;
	var reloadTime : float = 1f;
	var turnSpeed : float = 5f;
	var firePauseTime : float = .25f;
	var muzzleEffect : GameObject;
	var errorAmount : float = .001;
	var myTarget : Transform;
	var muzzlePositions : Transform[];
	var turretBall : Transform;

	private var nextFireTime : float;
	private var nextMoveTime : float;
	private var desiredRotation : Quaternion;
	private var aimError : float;

	function Start () {
		
	}

	function Update () {

		if(myTarget)
		{
			if(Time.time >= nextMoveTime)
			{
				CalculateAimPosition(myTarget.position);
				//turretBall.rotation = Quaternion.Lerp(turretBall.rotation, desiredRotation, Time.deltaTime*turnSpeed);
			}
			
			if(Time.time >= nextFireTime)
			{
				FireProjectile();
			}
		}
	}

	function OnTriggerEnter(other : Collider)
	{
		if(other.gameObject.tag == "Air Enemy" && !myTarget)
		{
			nextFireTime = Time.time + (reloadTime * .5);
			myTarget = other.gameObject.transform;
		}
	}

	function OnTriggerStay(other : Collider)
	{
		if(other.gameObject.tag == "Air Enemy" && !myTarget)
		{
			nextFireTime = Time.time + (reloadTime * .5);
			myTarget = other.gameObject.transform;
		}
	}

	function OnTriggerExit(other : Collider)
	{
		if(other.gameObject.transform == myTarget)
		{
			myTarget = null;
		}
	}

	function CalculateAimPosition(targetPos : Vector3)
	{
		var aimPoint = Vector3(targetPos.x + aimError, targetPos.y + aimError, targetPos.z + aimError);
		desiredRotation = Quaternion.LookRotation(aimPoint);
	}

	function FireProjectile()
	{
		nextFireTime = Time.time+reloadTime;
		nextMoveTime = Time.time+firePauseTime;
		CalculateAimError();
		var projectile : GameObject;
		
		for(theMuzzlePos in muzzlePositions)
		{
			projectile = GameObject.Instantiate(myProjectile, theMuzzlePos.position, theMuzzlePos.rotation);
			projectile.SendMessage("GetTarget", myTarget.transform, SendMessageOptions.DontRequireReceiver);
		}
	}

	function CalculateAimError()
	{
		aimError = Random.Range(-errorAmount, errorAmount);
	}
}












