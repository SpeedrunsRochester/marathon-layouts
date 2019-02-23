function getRunnersFromRunData(runData) {
    let currentTeamsData = [];
    runData.teams.forEach(team => {
        let teamData = {members: []};
        team.members.forEach(member => {teamData.members.push(createMemberData(member));});
        currentTeamsData.push(teamData);
    });
    return currentTeamsData;
}

function createMemberData(member) {
    // Gets username from URL.
    let twitchUsername;
    if (member.twitch && member.twitch.uri) {
        twitchUsername = member.twitch.uri.split('/');
        twitchUsername = twitchUsername[twitchUsername.length-1];
    }

    // Parse pronouns from the runner name, if they're present.
    let name = member.names.international.split('-');
    let pronouns = '';
    if (name.length > 1) {
        pronouns = name[1].trim();
    }
    name = name[0].trim();

    return {
        name: name,
        pronouns: pronouns,
        twitch: twitchUsername,
        region: member.region
    };
}