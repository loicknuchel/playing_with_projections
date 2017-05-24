// Solutions by Loïc Knuchel
// Functionnal style using transducteurs (see https://speakerdeck.com/lilobase/des-boucles-aux-transducers-pyconfr-2015)

Array.prototype.groupBy = function(f) {
    const res = {};
    this.map(e => {
        const key = f ? f(e) : e.toString();
        if(Array.isArray(res[key])) { res[key].push(e); }
        else { res[key] = [e]; }
    });
    return res;
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

function sequence() {
    const fns = arguments;
    return function(result) {
        for (let i = 0; i < fns.length; i++) {
            result = fns[i].call(this, result);
        }
        return result;
    };
}

const mapReduce = (f, arr) => {
    return arr.reduce((acc, cur) => {
        acc.push(f(cur));
        return acc;
    }, []);
};
const filterReduce = (f, arr) => {
    return arr.reduce((acc, cur) => {
        if(f(cur)) { acc.push(cur); }
        return acc;
    }, []);
};

const maper = f => {
    return (acc, cur) => {
        acc.push(f(cur));
        return acc;
    };
};
const filterer = f => {
    return (acc, cur) => {
        if(f(cur)) { acc.push(cur); }
        return acc;
    };
};
const appender = (acc, cur) => {
    acc.push(cur);
    return acc;
};

const mapping = f => next => (acc, cur) => {
    return next(acc, f(cur));
};
const filtering = f => next => (acc, cur) => {
    if(f(cur)) { return next(acc, cur); }
    else { return acc; }
};
const taking = n => next => (acc, cur) => {
    if(acc.length < n) { return next(acc, cur); }
    else { return acc; }
};
const grouping = f => next => (acc, cur) => {
    const key = f(cur);
    // don't know :(
};
const sorting = f => next => (acc, cur) => {
    // don't know :(
};

module.exports = {
    numberOfEvents: events => {
        return events.length;
    },
    numberOfRegistredPlayers: events => {
        return events.reduce(sequence(
            filtering(e => e.type === 'PlayerHasRegistered')
        )(appender), []).length;
    },
    numberOfRegistredPlayersPerMonth: events => {
        return events.reduce(sequence(
            filtering(e => e.type === 'PlayerHasRegistered'),
            grouping(getYearMonth),
            mapping((monthEvents, month) => ({month, registered_players: monthEvents.length}))
        )(appender), []);
    },
    mostPopularQuizs: events => {
        const createdQuizs = events.filter(e => e.type === 'QuizWasCreated').groupBy(e => e.payload.quiz_id);
        const startedGames = events.filter(e => e.type === 'GameWasStarted').groupBy(e => e.payload.game_id);
        return events.reduce(sequence(
            filtering(e => e.type === 'GameWasOpened' && startedGames[e.payload.game_id]),
            grouping(e => e.payload.quiz_id),
            mapping((games, quiz_id) => ({
                quiz_id: quiz_id,
                times_played: games.length,
                quiz_title: createdQuizs[quiz_id][0].payload.quiz_title
            })),
            sorting((a, b) => -(a.times_played - b.times_played) || strComp(a.quiz_title, b.quiz_title) || strComp(a.quiz_id, b.quiz_id)),
            taking(10)
        )(appender), []);
    },
    inactivePlayers: events => {

    },
    activePlayers: events => {

    }
};
