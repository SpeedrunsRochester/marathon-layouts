'use strict';

$(() => {

    if (offlineMode) {
        loadOffline();
    }
    else{
        loadFromSpeedControl();
    }

    function loadOffline() {
        // JQuery selectors.
        var timer = $('.timer');
        timer.html("1:59:50");
    }

    function loadFromSpeedControl(){
		// The bundle name where all the run information is pulled from.
        const speedcontrolBundle = 'nodecg-speedcontrol';
		var debug = $('.debug');
		var timer = $('.timer');
        // Declaring other variables.
        var backupTimerTO;

        // This is where the timer information is received.
        // The "change" event is triggered whenever the time changes or the state changes.
		debug.html("Starting stopwatch");
        var stopwatch = nodecg.Replicant('timer', speedcontrolBundle);
		debug.html("Replicant made...");
        //stopwatch.on('change', (newVal, oldVal) => {
            if (newVal) {
				debug.html("Updating");
				updateTimer(newVal, oldVal);
			}
			

            // Backup Timer
			//debug.html("Making backup timer");
            clearTimeout(backupTimerTO);
            backupTimerTO = setTimeout(backupTimer, 1000);
			debug.html("Backup done");
        });
		debug.html("Got stopwatch");

        // Backup timer that takes over if the connection to the server is lost.
        // Based on the last timestamp that was received.
        // When the connection is restored, the server timer will recover and take over again.
        function backupTimer() {
			
            backupTimerTO = setTimeout(backupTimer, 200);
            if (stopwatch.value.state === 'running') {
                var missedTime = Date.now() - stopwatch.value.timestamp;
                var timeOffset = stopwatch.value.milliseconds + missedTime;
                updateTimer({time:msToTime(timeOffset)});
            }
        }

        // Update the run timer when changed.
        function updateTimer(newVal, oldVal) {
			//debug.html("Updating Timer");
			var time = newVal.time || '88:88:88';
            var timer = $('.timer');
            // Change class on the timer to change the colour if needed.
            if (oldVal) {
                timer.removeClass('timer_' + oldVal.state);
            }
            timer.addClass('timer_'+newVal.state);
            timer.html(time);
        }

        // This is the finished times for the current runners.
        var finishedTimers = nodecg.Replicant('finishedTimers', speedcontrolBundle);
        finishedTimers.on('change', (newVal, oldVal) => {
            if (newVal) {
                updateFinishedTimes(newVal);
            }
        });

        // Sets the finished times for runners.
        function updateFinishedTimes(finishedTimes) {
            $('.finish-time').text("").hide();
            for (var time of finishedTimes) {
                // Runner index is zero-based.
                var i = Number.parseInt(time.index) + 1;
                $('.finish-time-runner' + i).html(time.time).show();
            }
        }
    }
});

