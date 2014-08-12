#pragma strict

var speed : int = 10;
var origX : int = -1.99;
var origY : int = 9;
var origZ : int = 0;

function Start () {

}

function Update () {
	 if(Input.GetKey(KeyCode.RightArrow))
    {
        transform.position -= new Vector3(0,0,speed * Time.deltaTime);
    }
    if(Input.GetKey(KeyCode.LeftArrow))
    {
        transform.position += new Vector3(0,0,speed * Time.deltaTime);
    }
    if(Input.GetKey(KeyCode.DownArrow))
    {
        transform.position -= new Vector3(speed * Time.deltaTime,0,0);
    }
    if(Input.GetKey(KeyCode.UpArrow))
    {
        transform.position += new Vector3(speed * Time.deltaTime,0,0);
    }
    if(Input.GetKeyDown("space"))
    {
    	transform.position = new Vector3(origX, origY, origZ);
    }
}