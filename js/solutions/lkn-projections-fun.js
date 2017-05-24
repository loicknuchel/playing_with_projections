// Solutions by Loïc Knuchel
// Functionnal style

Object.prototype.map = function(f) {
    return Object.keys(this).map(key => f ? f(this[key], key) : this[key]);
};
Array.prototype.groupBy = function(f) {
    const res = {};
    this.map(e => {
        const key = f ? f(e) : e.toString();
        if(Array.isArray(res[key])) { res[key].push(e); }
        else { res[key] = [e]; }
    });
    return res;
};
Array.prototype.take = function(n) {
    const res = [];
    for(let i=0; i<n && i<this.length; i++) {
        res.push(this[i]);
    }
    return res;
};
Array.prototype.max = function(cmp) {
    return this.reduce((max, cur) => (cmp ? cmp(cur, max) : cur > max) ? cur : max, this.length > 0 ? this[0] : undefined);
};
Array.prototype.min = function(cmp) {
    return this.reduce((min, cur) => (cmp ? cmp(cur, min) : cur > min) ? min : cur, this.length > 0 ? this[0] : undefined);
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

module.exports = {
    numberOfEvents: events => {
        return events.length;
    },
    numberOfRegistredPlayers: events => {
        return events.filter(e => e.type === 'PlayerHasRegistered').length;
    },
    numberOfRegistredPlayersPerMonth: events => {
        return events
            .filter(e => e.type === 'PlayerHasRegistered')
            .groupBy(getYearMonth)
            .map((monthEvents, month) => ({month, registered_players: monthEvents.length}));
    },
    mostPopularQuizs: events => {
        const createdQuizs = events.filter(e => e.type === 'QuizWasCreated').groupBy(e => e.payload.quiz_id);
        const startedGames = events.filter(e => e.type === 'GameWasStarted').groupBy(e => e.payload.game_id);
        return events
            .filter(e => e.type === 'GameWasOpened' && startedGames[e.payload.game_id])
            .groupBy(e => e.payload.quiz_id)
            .map((games, quiz_id) => ({
                quiz_id: quiz_id,
                times_played: games.length,
                quiz_title: createdQuizs[quiz_id][0].payload.quiz_title
            }))
            .sort((a, b) => -(a.times_played - b.times_played) || strComp(a.quiz_title, b.quiz_title) || strComp(a.quiz_id, b.quiz_id))
            .take(10);
    },
    inactivePlayers: events => {
        const playedAtLeastOneGameEveryMonth = gamesByMonth => {
            const months = gamesByMonth.map((value, key) => key);
            const endMonth = months.max();
            let month = months.min();
            while (month !== endMonth) {
                if(!gamesByMonth[month] || gamesByMonth[month].length === 0) {
                    return false;
                }
                month = nextYearMonth(month);
            }
            return true;
        };
        const playerRegistered = events.filter(e => e.type === 'PlayerHasRegistered').groupBy(e => e.payload.player_id);
        return events
            .filter(e => e.type === 'PlayerJoinedGame')
            .groupBy(g => g.payload.player_id)
            .map((playerGames, player_id) => ({
                player_id: player_id,
                player_name: playerRegistered[player_id][0].payload.first_name,
                games_played: playerGames.length,
                gamesByMonth: playerGames.groupBy(getYearMonth)
            }))
            .filter(r => playedAtLeastOneGameEveryMonth(r.gamesByMonth))
            .sort((a, b) => -(a.games_played - b.games_played) || strComp(a.player_name, b.player_name))
            .take(10)
            .map(r => ({player_id: r.player_id, player_name: r.player_name, games_played: r.games_played}));
    },
    activePlayers: events => {
        const isInLastWeek = date => true; // TODO : implement !
        const playerRegistered = events.filter(e => e.type === 'PlayerHasRegistered');
        return events
            .filter(e => e.type === 'PlayerJoinedGame' && isInLastWeek(e.timestamp))
            .groupBy(g => g.payload.player_id)
            .map((lastPlayerGames, player_id) => ({
                player_id: player_id,
                player_name: playerRegistered.find(p => p.payload.player_id === player_id).payload.first_name,
                games_played: lastPlayerGames.length
            }))
            .filter(r => r.games_played >= 10)
            .sort((a, b) => -(a.games_played - b.games_played) || strComp(a.player_name, b.player_name))
            .take(10);
    }
};
