// Solutions by Loïc Knuchel
// Stream, projections should take events one by one

Array.prototype.last = function() {
    return this[this.length-1];
};

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

const numberOfEvents = () => {
    let count = 0;
    return event => {
        return ++count;
    };
};

const numberOfRegistredPlayers = () => {
    let count = 0;
    return event => {
        return event.type === 'PlayerHasRegistered' ? ++count : count;
    };
};

const numberOfRegistredPlayersPerMonth = () => {
    const result = [];
    return event => {
        if(event.type === 'PlayerHasRegistered') {
            const month = getYearMonth(event);
            const count = result.find(r => r.month === month);
            if(count) {
                count.registered_players++;
            } else {
                result.push({month, registered_players: 1});
            }
        }
        return result;
    };
};

const mostPopularQuizs = () => {
    const resultComparator = (a, b) => -(a.times_played - b.times_played) || strComp(a.quiz_title, b.quiz_title) || strComp(a.quiz_id, b.quiz_id);
    const quizToName = {};
    const gameToQuiz = {};
    const quizCount = {};
    const results = [];
    return event => {
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

            const quiz = results.find(r => r.quiz_id === quiz_id);
            if(quiz) {
                quiz.times_played++;
                results.sort(resultComparator);
            } else if (results.length < 10) {
                results.push({
                    quiz_id: quiz_id,
                    times_played: quizCount[quiz_id],
                    quiz_title: quizToName[quiz_id]
                });
                results.sort(resultComparator);
            } else if(quizCount[quiz_id] >= results.last().times_played) {
                results.push({
                    quiz_id: quiz_id,
                    times_played: quizCount[quiz_id],
                    quiz_title: quizToName[quiz_id]
                });
                results.sort(resultComparator);
                results.pop();
            }
        }
        return results;
    };
};

const inactivePlayers = () => {
    const playerToName = {};
    const playerGamesByMonth = {};
    const results = [];
    return event => {
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

            const player = results.find(r => r.player_id === player_id);
            if(player) {

            } else if (results.length < 10) {

            } else if(quizCount[quiz_id] >= results.last().times_played) {

            }
        }
        return results;
    };
};

const activePlayers = () => {};

module.exports = {
    numberOfEvents: events => events.map(numberOfEvents()).last(),
    numberOfRegistredPlayers: events => events.map(numberOfRegistredPlayers()).last(),
    numberOfRegistredPlayersPerMonth: events => events.map(numberOfRegistredPlayersPerMonth()).last(),
    mostPopularQuizs: events => events.map(mostPopularQuizs()).last(),
    inactivePlayers: events => events.map(inactivePlayers()).last(),
    activePlayers: events => events.map(activePlayers()).last()
};
