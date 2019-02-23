// Main run info update functionality.
'use strict';

// TODO: This is garbage, do better.
function FixSize(selector){

    setTimeout(function(){
        let divWidth = $(selector + ":visible").width();
        let fontSize = 92;

        // Reset font to default size to start.
        $(selector).css("font-size", "");

        let text_org = $(selector + ":visible").html();
        let text_update = '<span style="white-space:nowrap;">' + text_org + '</span>';
        $(selector + ":visible").html(text_update);

        let childWidth = $(selector + ":visible").children().width();

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
    	console.log("Offline mode");
        loadOffline();
    }
    else{
    	console.log("Online mode:");
        loadFromSpeedControl();
    }

    function loadOffline(){
        let gameTitle = $('.game-name');
        let gameCategory = $('.game-category');
        let gameSystem = $('.platform');
        let gameYear = $('.year');
        let gameEstimate = $('.estimate');

        let name1 = $(".runner-name1");
        let pronouns1 = $(".pronouns1");

        let name2 = $(".runner-name2");
        let pronouns2 = $(".pronouns2");

        let name3 = $(".runner-name3");
        let pronouns3 = $(".pronouns3");

        let name4 = $(".runner-name4");
        let pronouns4 = $(".pronouns4");

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
        const puwpBundle = 'nodecg-puwp';

        // JQuery selectors.
        let gameTitle = $('.game-name');
        let gameCategory = $('.game-category');
        let gameSystem = $('.platform');
        let gameYear = $('.year');
        let gameEstimate = $('.estimate');



        // This is where the information is received for the run we want to display.
        // The "change" event is triggered when the current run is changed.
        let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
        runDataActiveRun.on('change', (newVal, oldVal) => {
            if (newVal)
                updateSceneFields(newVal);
        });

        let currentLayout = nodecg.Replicant('currentGameLayout', puwpBundle);

        // Sets information on the pages for the run.
        function updateSceneFields(runData) {
            let currentTeamsData = getRunnersFromRunData(runData);

            // Split year out from system platform, if present.
            let system = runData.system.split("-");
            let year = '';

            if (system.length > 1) {
                year = system[1].trim();
            }
            system = system[0].trim();

            gameTitle.html(runData.game);
            gameCategory.html(runData.category);
            gameSystem.html(system);
            gameYear.html(year);
            gameEstimate.html(runData.estimate);

            // Set each player names and pronouns.
            let i = 0;
            for (let team of currentTeamsData) {
                for (let member of team.members) {
                    i += 1;
                    let name = $(".runner-name" + i);
                    let pronouns = $(".pronouns" + i);
                    name.text(member.name);
                    pronouns.text(member.pronouns);
                    FixSize('.runner-name' + i);
                }
            }

            // Fix pronoun wrapping for the current layout if needed.
            FixSize('.game-name');
            fixPronounWrapping(currentLayout.value);
        }
    }
});
