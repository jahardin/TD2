#pragma strict

var levelMaster : LevelMaster;
var smokeTrail : ParticleEmitter;
var explosionEffect : GameObject;
var myCashValue : int = 50;
var forwardSpeed : float = 10;
var health : float = 100;
var maxHealth : float = 10;

function Awake()
{
	levelMaster = GameObject.FindWithTag("LevelMaster").GetComponent(LevelMaster);
	
	maxHealth = health;
}

function TakeDamage(damageAmount : float)
{
	if(health > 0)
	{
		health -= damageAmount;
		if(health <= 0)
		{
			Explode();
			return;
		}
	}
}

function Explode()
{
	levelMaster.enemyCount--;
	levelMaster.cashCount += myCashValue;
	levelMaster.UpdateGUI();
	
	Destroy(gameObject);
}