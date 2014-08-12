#pragma strict

var speed : int = 5;
var gravity : int = 5;
private var cc : CharacterController;

function Start () {
	cc = GetComponent(CharacterController);
}

function Update () {
	cc.Move(Vector3(Input.GetAxis("Horizontal")*speed*Time.deltaTime, -gravity*Time.deltaTime, Input.GetAxis("Vertical")*speed*Time.deltaTime));
}