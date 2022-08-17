module.exports = async (mayorData) => {
    const current = {
        year: mayorData.mayor.election.year,
        name: mayorData.mayor.name,
        type: mayorData.mayor.key,
        perks: mayorData.mayor.perks,
        chart: null,
        election: [],
    };

    for (const mayor of mayorData.mayor.election.candidates) {
        const mayorInfo = {
            name: mayor.name,
            type: mayor.key,
            perks: mayor.perks,
            votes: mayor.votes,
        }
        current.election.push(mayorInfo)
    }
    current.election = current.election.sort((a, b) => b.votes - a.votes)

    const currentGraph = {
        type: 'bar',
        data: {
            labels: [current.election[0].name, current.election[1].name, current.election[2].name, current.election[3].name, current.election[4].name],
            datasets: [{
                label: 'Votes',
                data: [current.election[0].votes, current.election[1].votes, current.election[2].votes, current.election[3].votes, current.election[4].votes],
                backgroundColor: [
                    'rgba(255, 85, 85, 0.8)',
                    'rgba(85, 255, 85, 0.8)',
                    'rgba(85, 255, 255, 0.8)',
                    'rgba(255, 255, 85, 0.8)',
                    'rgba(255, 85, 255, 0.8)',
                ]
            }]
        }
    }
    current.chart = `https://quickchart.io/chart?bkg=rgb(46,49,55)&c=${JSON.stringify(currentGraph)}`

    const upcoming = {
        year: mayorData.current.year,
        chart: null,
        election: [],
    };

    for (const mayor of mayorData.current.candidates) {
        const mayorInfo = {
            name: mayor.name,
            type: mayor.key,
            perks: mayor.perks,
            votes: mayor.votes,
        }
        upcoming.election.push(mayorInfo)
    }
    upcoming.election = upcoming.election.sort((a, b) => b.votes - a.votes)

    const upcomingGraph = {
        type: 'bar',
        data: {
            labels: [upcoming.election[0].name, upcoming.election[1].name, upcoming.election[2].name, upcoming.election[3].name, upcoming.election[4].name],
            datasets: [{
                label: 'Votes',
                data: [upcoming.election[0].votes, upcoming.election[1].votes, upcoming.election[2].votes, upcoming.election[3].votes, upcoming.election[4].votes],
                backgroundColor: [
                    'rgba(255, 85, 85, 0.8)',
                    'rgba(85, 255, 85, 0.8)',
                    'rgba(85, 255, 255, 0.8)',
                    'rgba(255, 255, 85, 0.8)',
                    'rgba(255, 85, 255, 0.8)',
                ]
            }]
        }
    }
    upcoming.chart = `https://quickchart.io/chart?bkg=rgb(46,49,55)&c=${JSON.stringify(upcomingGraph)}`

    return {
        last_updated: mayorData.lastUpdated,
        current,
        upcoming,
    }
};
