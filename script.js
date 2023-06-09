const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const setButton = document.getElementById("set-alarm");
const snoozeButton = document.getElementById("snooze-alarm");
const stopButton = document.getElementById("stop-alarm");
const alarmTime = document.getElementById("alarm-time");
const beepSound = new Audio("alarm.mp3"); 

let intervalId;
let snoozeTimeoutId;

function updateTime() {
  const now = new Date();
  hours.innerText = padNumber(now.getHours());
  minutes.innerText = padNumber(now.getMinutes());
  seconds.innerText = padNumber(now.getSeconds());

  if (alarmTime.value) {
    const [alarmHours, alarmMinutes] = alarmTime.value.split(":");
    if (
      now.getHours() === parseInt(alarmHours) &&
      now.getMinutes() === parseInt(alarmMinutes) &&
      now.getSeconds() === 0
    ) {
      startAlarm();
    }
  }
}

function padNumber(number) {
  return number < 10 ? `0${number}` : number;
}

function startAlarm() {
  setButton.disabled = true;
  snoozeButton.disabled = false;
  stopButton.disabled = false;

  beepSound.currentTime = 0;
  beepSound.loop = true;
  beepSound.play();
}

function stopAlarm() {
  setButton.disabled = false;
  snoozeButton.disabled = true;
  stopButton.disabled = true;

  beepSound.pause();
  beepSound.currentTime = 0;

  clearInterval(intervalId);
}

function snoozeAlarm() {
  snoozeButton.disabled = true;

  beepSound.pause();
  beepSound.currentTime = 0;

  snoozeTimeoutId = setTimeout(startAlarm, 60*1000); // Snooze for 5 seconds
}

function setAlarm() {
  const [alarmHours, alarmMinutes] = alarmTime.value.split(":");
  const now = new Date();
  const alarmTimeToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    parseInt(alarmHours),
    parseInt(alarmMinutes),
    0
  );

  if (alarmTimeToday <= now) {
    alarmTimeToday.setDate(alarmTimeToday.getDate() + 1);
  }

  const timeToAlarm = alarmTimeToday.getTime() - now.getTime();
  snoozeButton.disabled = true;

  intervalId = setInterval(() => {
    if (timeToAlarm <= 0) {
      clearInterval(intervalId);
      startAlarm();
    } else {
      timeToAlarm -= 1000;
    }
  }, 1000);

  setButton.disabled = true;
  stopButton.disabled = false;
}

setInterval(updateTime, 1000);
stopButton.addEventListener("click", stopAlarm);
snoozeButton.addEventListener("click", snoozeAlarm);
setButton.addEventListener("click", setAlarm);
