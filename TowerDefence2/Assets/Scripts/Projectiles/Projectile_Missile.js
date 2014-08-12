#pragma strict

var mySpeed : float = 10;
var myRange : float = 10;
var myTarget : Transform;
var myDamageAmount : int = 10;


private var myDist : float;


function Update () {
	transform.Translate(Vector3.forward*Time.deltaTime*mySpeed);
	myDist += Time.deltaTime* mySpeed;
	if(myDist >= myRange)
		Destroy(gameObject);
		
	if(myTarget)
	{
		transform.LookAt(myTarget);
	}
		

}

function OnTriggerEnter(other : Collider)
{
	Debug.Log("entered missile ontriggerenter");

	if(other.gameObject.tag =="Air Enemy")
	{
		Destroy(gameObject);
		other.gameObject.SendMessage("TakeDamage", myDamageAmount);
	}
}

function GetTarget(other : Transform)
{
	myTarget = other;
}