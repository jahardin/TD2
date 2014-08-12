#pragma strict

var levelMaster : LevelMaster;

function Start () {
	levelMaster = GameObject.FindWithTag("LevelMaster").GetComponent(LevelMaster);
}

function Update () {

}

function OnTriggerEnter(other : Collider)
{
Debug.Log("entered base");
	if(other.gameObject.tag == "Air Enemy" || other.gameObject.tag == "Ground Enemy")
	{
		Destroy(other.gameObject);
		levelMaster.enemyCount--;
		levelMaster.healthCount--;
		levelMaster.UpdateGUI();
	}
}