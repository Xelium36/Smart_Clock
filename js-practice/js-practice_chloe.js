//#region 1. Variables and data types

const appName = "Smart Clock";
let numberOfAlarms = 2;
let sleepState = false;


if (sleepState) console.log(`Bienvenue sur ${appName} ! Vous avez ${numberOfAlarms} alarmes actives.`);
else console.log("Mode nuit désactivé");


//#endregion 

//#region 2. 

const alarms = [
  {
    time: "7:00",
    name : "Il est tôôôôôt",
    days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
    snooze: {
      enabled: true,
      duration: 5 // en minutes
    }
  },
  {
    time: "7:10",
    name : "Il faut vraiment se lever",
    days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
    snooze: {
      enabled: true,
      duration: 2
    }
  },
  {
    time: "7:45",
    name : "Il faut partir",
    days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
    snooze: {
      enabled: false,
      duration: 0 
    }
  },
  {
    time: "9:30",
    name : "Matin chill",
    days: ["Samedi", "Dimanche"],
    snooze: {
      enabled: false,
      duration: 0
    }
  }
];

const newAlarm = {
    time: "10:00",
    name: "Go piscine",
    days: ["Dimanche"],
    snooze: {
      enabled: false,
      duration: 0
    }
  };

  alarms.push(newAlarm);

for (const [index, alarm] of alarms.entries()){
    console.log(`Alarm ${index+1} : ${alarm.name} at ${alarm.time}`);
}

function findAlarm(time) {
  return alarms.filter(alarm => alarm.time.includes(time));
}

console.log(findAlarm("9:30"));

const user = {
  name: "Chloé",
  sleepGoal: 8, // heures
  sleepHistory: ["7:00", "7:10", "7:45"],
  preferences: {
    wakeSound: "forest",
    dayType; "work"
  }
};

//#endregion
