#pragma strict

class FlyingEnemy extends Enemy_Base
{
	
	function Start()
	{
	}
	
	function Update()
	{
		transform.Translate(Vector3.forward * (forwardSpeed*Time.deltaTime));
	}
}
