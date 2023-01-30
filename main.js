class Timer{

    constructor()
    {
        this.timeDisplay = document.getElementById('timer');
        this.minutes;
        this.seconds;

        this.totalTime = 60*25;

        this.typeOfTimer = 'pomodoro';

        this.controlButton = document.getElementById('control-button');
        this.pomodoroButton = document.getElementById('pomodoro-button');
        this.shortBreakButton = document.getElementById('short-break-button');
        this.longBreakButton = document.getElementById('long-break-button');

        this.skipButton = document.createElement('button');
        this.skipButton.innerText = 'skip';
        this.skipButton.id = 'skip-button';

        this.pomodoroCount = 0;

        this.pomodoroFinishAudio = new Audio('audios/mixkit-doorbell-tone-2864.wav');
        this.breakFinishAudio = new Audio('audios/mixkit-cowbell-sharp-hit-1743.wav');
    }

    changeEnvironment(){
        // sets the enviroments according to the time of timer
        if(this.typeOfTimer === 'pomodoro')
        {
            this.setUpPomodoroType();
            this.handleTimeFormat();

        }else if(this.typeOfTimer === 'short')
        {
            this.setUpShortType();
            this.handleTimeFormat();
        }
        else{
            this.setUpLongType();
            this.handleTimeFormat();
        }
    }
    
    handleTimeFormat()
    {   
        // show the time in the correct format '<minutes>:<seconds>'

        this.minutes = Math.floor(this.totalTime / 60);
        this.seconds = this.totalTime % 60;
        this.timeDisplay.innerHTML = this.minutes.toString().padStart(2, '0') + ':' + this.seconds.toString().padStart(2, '0');
    }

    setUpPomodoroType()
    {   
        // Changes to Pomodoro default environment
        this.totalTime = 60*25;

        document.body.style.backgroundColor = '#32965D';
        this.controlButton.style.color = '#32965D';

        this.pomodoroButton.style.backgroundColor = 'rgba(84, 66, 66, 0.446)';
        this.shortBreakButton.style.backgroundColor = 'transparent';
        this.longBreakButton.style.backgroundColor = 'transparent';

        this.handleTimeFormat();
    }

    setUpShortType()
    {   
        //Changes to Short Break environment
        this.totalTime = 60*5;

        document.body.style.backgroundColor = '#1098F7';
        this.controlButton.style.color = '#1098F7';

        this.pomodoroButton.style.backgroundColor = 'transparent';
        this.shortBreakButton.style.backgroundColor = 'rgba(84, 66, 66, 0.446)';
        this.longBreakButton.style.backgroundColor = 'transparent';

        this.handleTimeFormat();
    }

    setUpLongType()
    {
        // changes to Long Break enviroment
        this.totalTime = 60*15;

        document.body.style.backgroundColor = '#4E5166';
        this.controlButton.style.color = '#4E5166';

        this.pomodoroButton.style.backgroundColor = 'transparent';
        this.shortBreakButton.style.backgroundColor = 'transparent';
        this.longBreakButton.style.backgroundColor = 'rgba(84, 66, 66, 0.446)';

        this.handleTimeFormat();
    }

   

    
    countdown(timerCountdown)
    {   
        // decreases the timer by one, every time it's called
        this.totalTime--;
        this.handleTimeFormat();
        
        //
        if(this.totalTime === 0)
        {
            this.handleTotalTimeEnd(timerCountdown);
        }

    }

    handleTotalTimeEnd(timerCountdown)
    {
        // only counts the pomodoro timer is finish when it's in pomodoro type
            // and play a sound when finished
            if(this.typeOfTimer === 'pomodoro')
            {
                this.pomodoroCount += 1;
                this.pomodoroFinishAudio.play();
            }
            else{
                this.breakFinishAudio.play();
            }

            // handle the change of environment and stops the timer.
            clearInterval(timerCountdown);
            this.handlePomodoroEndSwitch();
            this.resetControlButton();
    }

    
    handlePomodoroEndSwitch()
    {   
        // When the timer goes 0 it automatically switches to the next enviroment.
        if(this.pomodoroCount % 4 === 0 && this.typeOfTimer === 'pomodoro')
        {
            this.typeOfTimer = 'long';
            this.setUpLongType();
        }
        else if(this.typeOfTimer === 'pomodoro')
        {
            this.typeOfTimer = 'short';
            this.setUpShortType();
        }
        else{
            this.typeOfTimer = 'pomodoro';
            this.setUpPomodoroType();
        }
    }
    
    startTimer()    
    {   
        //it will change the appearence of the button to 'pause'
        this.controlButton.innerText = 'Pause';
        this.controlButton.id = 'pause-control-button';
        let parent = document.querySelector('.control-section');
        parent.appendChild(this.skipButton);

    }
    
    pauseTimer()
    {
        //it will change the appearence of the button to 'start'
        this.controlButton.innerText = 'Start';
        this.controlButton.id = 'control-button';

        let parent = document.querySelector('.control-section');
        parent.removeChild(this.skipButton);
    }

    resetControlButton(){
         //it will change the appearence of the button to 'start', but it's for semantic purpose
        this.controlButton.innerText = 'Start';
        this.controlButton.id = 'control-button';
        let parent = document.querySelector('.control-section');
        parent.removeChild(this.skipButton)

    }

    skipTimer(timerCountdown){
        this.totalTime = 0;
        this.handleTotalTimeEnd(timerCountdown);
    }
    
    
}


function startCountdown()
{
    timerCountdown = setInterval(() => {timer.countdown(timerCountdown)}, 1000);
}

function pauseCountdown(){
    clearInterval(timerCountdown);
}



const timer = new Timer();


// variable that is the timer
let timerCountdown;


// assign event listener to all  3 enviroment buttons.
const elements = document.querySelectorAll(".type-button");
for(let i = 0; i < elements.length; i++)
{
    elements[i].addEventListener('click', function(){
        //receives the id of the button that's is being pressed.
        const type = this.id.split('-')[0];
        timer.typeOfTimer = type;

        // handles when the user switches the types when the countdown is running
        timer.resetControlButton();
        pauseCountdown();

        // set the timer appearence and the timer time;
        timer.changeEnvironment();
    });
}

// handles when the control button (start/pause) is pressed;
const controlButton = timer.controlButton;
controlButton.addEventListener('click', () =>{
    if(controlButton.id === 'control-button')
    {
        timer.startTimer();
        startCountdown();
    }
    else if(controlButton.id == 'pause-control-button'){
        timer.pauseTimer();
        pauseCountdown();
    }
})

// handles when you skip the timer completion
const skipButton = timer.skipButton;
skipButton.addEventListener('click', () =>{
    timer.skipTimer(timerCountdown);
});