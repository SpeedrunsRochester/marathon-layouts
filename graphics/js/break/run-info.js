// Main run info update functionality.
'use strict';
	const speedcontrolBundle = 'nodecg-speedcontrol';
	const srrocBundle = 'nodecg-srroc';
// Initialize the page.
$(() => {
  var debug = $('.debug');
  var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	//debug.html("Got Active Run");
  var runDataArray = nodecg.Replicant('runDataArray', speedcontrolBundle);
  if (offlineMode) {
    loadOffline();
  } else {
    // Wait for replicants to load before we do anything.
    NodeCG.waitForReplicants(runDataActiveRun, runDataArray).then(loadFromSpeedControl);
  }

  function loadOffline() {
    var debug = $('.debug');
    debug.html("Offline Mode");
    var comingUpInfo = $('.coming-up-info');
    comingUpInfo.html("SSBB by swc19");
  }

  // (As of writing) triggered from a dashboard button and also when a run's timer ends
  // nodecg.listenFor('forceRefreshIntermission', speedcontrolBundle, () => {
  //     refreshNextRunsData(runDataActiveRun.value);
  // });

  function loadFromSpeedControl() {

	
	


    // This is where the information is received for the run we want to display.
    // The "change" event is triggered when the current run is changed.
    runDataActiveRun.on('change', (newVal, oldVal) => {
      refreshNextRunsData(newVal);
    });

    runDataArray.on('change', (newVal, oldVal) => {
      refreshNextRunsData(runDataActiveRun.value);
    });

  }


  // Get the next X runs in the schedule.
  function getNextRuns(runData, amount) {
    var nextRuns = [];
    var indexOfCurrentRun = findIndexInRunDataArray(runData);
    for (var i = 1; i <= amount; i++) {
      if (!runDataArray.value[indexOfCurrentRun + i]) {
        break;
      }
      nextRuns.push(runDataArray.value[indexOfCurrentRun + i]);
    }
    return nextRuns;
  }
  function getRunnersFromRunData(runData) {
			//debug.html("Getting Runner Data");
			var currentTeamsData = [];
			//debug.html("Made Array");
			runData.teams.forEach(team => {
				//debug.html("Found a team");
				var teamData = {members: []};
				//debug.html("Making data");
				team.players.forEach(member => {
					//debug.html("Found a team member");
					teamData.members.push(createMemberData(member));
					});
				//debug.html("Pushing data");
				currentTeamsData.push(teamData);
				//debug.html("Got some Runner Data");
			});
			return currentTeamsData;
	}
	function createMemberData(member) {
			// Gets username from URL.
			//debug.html("Grabbing Member Name");
			var name = member.name.split('-');
			//debug.html("Got Member Name");
			if(name.length > 1){
				//debug.html("Adding Pronouns");
				var pronouns = name[1].trim();
				name = name[0].trim();
			} else {
				name = name[0].trim();
				var pronouns = ''
			}
			//debug.html("Returning MemberData");
			return {
				name: name,
				pronouns: pronouns,
			};
		}
		function fixPronounWrapping(layoutInfo) {
			var pronounElements = $('.pronouns');
			pronounElements.each((i, elem) => {
				// Use .html() so it doesn't get doubly escaped.
				$(elem).html($(elem).text().replace(/([-/_])/g,'$&&hairsp;'));
			});
		}
		
  // Find array index of current run based on it's ID.
  function findIndexInRunDataArray(run) {
    var indexOfRun = -1;

    // Compvarely skips this if the run variable isn't defined.
    if (run) {
      for (var i = 0; i < runDataArray.value.length; i++) {
        if (run.id === runDataArray.value[i].id) {
          indexOfRun = i; break;
        }
      }
    }

    return indexOfRun;
  }


  function getNamesForRun(runData) {
    var currentTeamsData = getRunnersFromRunData(runData);
    var names = [];
    for (var team of currentTeamsData) {
      for (var member of team.members) {
        names.push(member.name);
      }
    }
    return names;
  }

  function refreshNextRunsData(currentRun) {
	const numUpcoming = 2;
    var nextRuns = getNextRuns(currentRun, numUpcoming);

    var comingUpInfo = $('.coming-up-info');

    // Next up game.
	if(getNamesForRun(nextRuns[0]) == 0){
		comingUpInfo.html(nextRuns[0].game)
	} else{
		comingUpInfo.html(nextRuns[0].game + " | " + nextRuns[0].category + " by ");
		comingUpInfo.append(getNamesForRun(nextRuns[0]).join(', '));
		}
    //  + " by " + getNamesForRun(runDataActiveRun.value).join(', ')

  }
});