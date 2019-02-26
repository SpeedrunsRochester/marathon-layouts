// Main run info update functionality.
'use strict';

// TODO: This is garbage, do better.
function FixSize(selector){

    setTimeout(function(){
        var divWidth = $(selector + ":visible").width();
        var fontSize = 92;

        // Reset font to default size to start.
        $(selector).css("font-size", "");

        var text_org = $(selector + ":visible").html();
        var text_update = '<span style="white-space:nowrap;">' + text_org + '</span>';
        $(selector + ":visible").html(text_update);

        var childWidth = $(selector + ":visible").children().width();

        // console.log(childWidth + " " + divWidth);

        while ($(selector + ":visible").children().width() > divWidth){
            // console.log($(selector + ":visible").children().width() + " " + divWidth);
            $(selector).css("font-size", fontSize -= 1);
        }

        // console.log(fontSize)
    }, 500);
}

$(() => {
    if (offlineMode) {
        loadOffline();
    }

    else{
        loadFromSpeedControl();
    }

    function loadOffline(){
        var gameTitle = $('.game-name');
        var gameCategory = $('.game-category');
        var gameSystem = $('.platform');
        var gameYear = $('.year');
        var gameEstimate = $('.estimate');
		var debug = $('.debug');
		//debug.html("Offline Mode");


        var name1 = $(".runner-name1");
        var pronouns1 = $(".pronouns1");

        var name2 = $(".runner-name2");
        var pronouns2 = $(".pronouns2");

        var name3 = $(".runner-name3");
        var pronouns3 = $(".pronouns3");

        var name4 = $(".runner-name4");
        var pronouns4 = $(".pronouns4");

        gameTitle.html("Super Smash Bros. Brawl Filler Words");
        gameCategory.html("Subspace Emissary Any% Easy Filler Words");

        gameSystem.html("system");
        gameYear.html("1902");
        gameEstimate.html("5:15:30");

        name1.text("swc19");

        pronouns1.text("He/Him");

        name2.text("Protomagicalgirl");
        pronouns2.text("It/She");

        name3.text("arael");
        pronouns3.text("They/She");

        name4.text("iBazly");
        pronouns4.text("He/They");

        fixPronounWrapping(globalLayoutInfo);
    }

    function loadFromSpeedControl() {
        // The bundle name where all the run information is pulled from.
        const speedcontrolBundle = 'nodecg-speedcontrol';
        const srrocBundle = 'nodecg-srroc';

        // JQuery selectors.
        var gameTitle = $('.game-name');
        var gameCategory = $('.game-category');
        var gameSystem = $('.platform');
        var gameYear = $('.year');
        var gameEstimate = $('.estimate');
		var debug = $('.debug');
		//debug.html("Online Mode");




        // This is where the information is received for the run we want to display.
        // The "change" event is triggered when the current run is changed.
        var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
        runDataActiveRun.on('change', (newVal, oldVal) => {
            if (newVal)
				//debug.html("Updating Scene Fields");
                updateSceneFields(newVal);
        });

        var currentLayout = nodecg.Replicant('currentGameLayout', srrocBundle);

        // Sets information on the pages for the run.
        function updateSceneFields(runData) {
            var currentTeamsData = getRunnersFromRunData(runData);
			//debug.html("Got Runners");
            // Split year out from system platform, if present.
            var system = runData.system.split("-");
            var year = '';

            if (system.length > 1) {
                year = system[1].trim();
            }
            system = system[0].trim();

            gameTitle.html(runData.game);
			//debug.html("Got Game");
            gameCategory.html(runData.category);
			//debug.html("Got Category");
            gameSystem.html(system);
			//debug.html("Got System");
            gameYear.html(year);
			//debug.html("Got Year");
            gameEstimate.html(runData.estimate);
			//debug.html("Got Estimate");

            // Set each player names and pronouns.
            var i = 0;
            for (var team of currentTeamsData) {
                for (var member of team.members) {
					//debug.html("Member: " + member.name);
                    i += 1;
                    var name = $(".runner-name" + i);
                    var pronouns = $(".pronouns" + i);
                    name.text(member.name);
                    pronouns.text(member.pronouns);
                    FixSize('.runner-name' + i);
                }
            }

            // Fix pronoun wrapping for the current layout if needed.
            fixPronounWrapping(currentLayout.value);
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

    }
});
