import { uniqBy } from 'lodash';

const fetchData = (user) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const pathGames = `/user-games/${user}/games`;

    return Promise.all([fetch(pathGames).then((response) => response.json())]).then((values) => {
        let games = values[0];
        const toUnix = (date) => new Date(date).getTime() / 1000;

        games = games.sort((a, b) => toUnix(b.date) - toUnix(a.date));

        return {
            games
        };
    });
};

export default fetchData;
