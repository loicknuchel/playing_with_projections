// Solutions by Loïc Knuchel
// Imperative style

const strComp = (a, b) => {
    return a > b ? 1 : a < b ? -1 : 0;
};
const padLeft = (value, size, char) => {
    const str = value.toString();
    return new Array(size - str.length + 1).join(char || ' ') + str;
};
const dateToYearMonth = date => date.getFullYear() + '-' + padLeft(date.getMonth() + 1, 2, '0');
const getYearMonth = event => dateToYearMonth(event.timestamp);
const nextYearMonth = yearMonth => {
    const [year, month] = yearMonth.split('-').map(n => parseInt(n));
    if(month > 11) return (year+1)+'-01';
    else return year+'-'+padLeft(month+1, 2, '0');
};

module.exports = {
    numberOfEvents: events => {
        return events.length;
    },
    numberOfRegistredPlayers: events => {
        let count = 0;
        for(let i=0; i<events.length; i++) {
            if(events[i].type === 'PlayerHasRegistered') {
                count++;
            }
        }
        return count;
    },
    numberOfRegistredPlayersPerMonth: events => {
        const monthCount = {};
        for(let i=0; i<events.length; i++) {
            const event = events[i];
            if(event.type === 'PlayerHasRegistered') {
                const month = getYearMonth(event);
                if(monthCount[month]) {
                    monthCount[month]++;
                } else {
                    monthCount[month] = 1;
                }
            }
        }
        const result = [];
        for(let month in monthCount) {
            if(typeof monthCount[month] === 'number') {
                result.push({month, registered_players: monthCount[month]});
            }
        }
        return result;
    },
    mostPopularQuizs: events => {
        const gameToQuiz = {};
        const quizToName = {};
        const quizCount = {};
        for(let i=0; i<events.length; i++) {
            const event = events[i];
            if(event.type === 'QuizWasCreated') {
                quizToName[event.payload.quiz_id] = event.payload.quiz_title;
            } else if(event.type === 'GameWasOpened') {
                gameToQuiz[event.payload.game_id] = event.payload.quiz_id;
            } else if(event.type === 'GameWasStarted') {
                const quiz_id = gameToQuiz[event.payload.game_id];
                if(quizCount[quiz_id]) {
                    quizCount[quiz_id]++;
                } else {
                    quizCount[quiz_id] = 1;
                }
            }
        }

        const results = [];
        for(let quiz_id in quizCount) {
            if (typeof quizCount[quiz_id] === 'number') {
                results.push({
                    quiz_id: quiz_id,
                    times_played: quizCount[quiz_id],
                    quiz_title: quizToName[quiz_id]
                });
                results.sort((a, b) => -(a.times_played - b.times_played) || strComp(a.quiz_title, b.quiz_title) || strComp(a.quiz_id, b.quiz_id));
                if(results.length > 10) {
                    results.pop();
                }
            }
        }
        return results;
    },
    inactivePlayers: events => {
        const playedAtLeastOneGameEveryMonth = gamesByMonth => {
            const months = [];
            let startMonth = '';
            let endMonth = '';
            for(let month in gamesByMonth) {
                if(typeof gamesByMonth[month] === 'number') {
                    months.push(month);
                    if(month < startMonth || startMonth === '') {
                        startMonth = month;
                    }
                    if(month > endMonth || endMonth === '') {
                        endMonth = month;
                    }
                }
            }
            let currentMonth = startMonth;
            while (currentMonth !== endMonth) {
                if(!gamesByMonth[currentMonth]) {
                    return false;
                }
                currentMonth = nextYearMonth(currentMonth);
            }
            return true;
        };
        const playerToName = {};
        const playerGamesByMonth = {};
        for(let i=0; i<events.length; i++) {
            const event = events[i];
            if(event.type === 'PlayerHasRegistered') {
                playerToName[event.payload.player_id] = event.payload.first_name;
            } else if(event.type === 'PlayerJoinedGame') {
                const player_id = event.payload.player_id;
                const month = getYearMonth(event);
                if(!playerGamesByMonth[player_id]) { playerGamesByMonth[player_id] = {}; }
                if(playerGamesByMonth[player_id][month]) {
                    playerGamesByMonth[player_id][month]++;
                } else {
                    playerGamesByMonth[player_id][month] = 1;
                }
            }
        }

        const allResults = [];
        for(let player_id in playerGamesByMonth) {
            if(typeof playerGamesByMonth[player_id] === 'object' && playedAtLeastOneGameEveryMonth(playerGamesByMonth[player_id])) {
                let games_played = 0;
                for(let i in playerGamesByMonth[player_id]) {
                    if(typeof playerGamesByMonth[player_id][i] === 'number') {
                        games_played += playerGamesByMonth[player_id][i];
                    }
                }
                allResults.push({
                    player_id: player_id,
                    player_name: playerToName[player_id],
                    games_played: games_played
                });
            }
        }
        allResults.sort((a, b) => -(a.games_played - b.games_played) || strComp(a.player_name, b.player_name));

        const results = [];
        for(let i=0; i<10 && i<allResults.length; i++) {
            results.push(allResults[i]);
        }
        return results;
    },
    activePlayers: events => {
        const isInLastWeek = date => true; // TODO : implement !
        const playerToName = {};
        const lastGameCount = {};
        for(let i=0; i<events.length; i++) {
            const event = events[i];
            if(event.type === 'PlayerHasRegistered') {
                playerToName[event.payload.player_id] = event.payload.first_name;
            } else if(event.type === 'PlayerJoinedGame' && isInLastWeek(event.timestamp)) {
                if(lastGameCount[event.payload.player_id]) {
                    lastGameCount[event.payload.player_id]++;
                } else {
                    lastGameCount[event.payload.player_id] = 1;
                }
            }
        }

        const allResults = [];
        for(let player_id in lastGameCount) {
            if(typeof lastGameCount[player_id] === 'number') {
                allResults.push({
                    player_id: player_id,
                    player_name: playerToName[player_id],
                    games_played: lastGameCount[player_id]
                });
            }
        }
        allResults.sort((a, b) => -(a.games_played - b.games_played) || strComp(a.player_name, b.player_name));

        const results = [];
        for(let i=0; i<10 && i<allResults.length; i++) {
            results.push(allResults[i]);
        }
        return results;
    }
};
