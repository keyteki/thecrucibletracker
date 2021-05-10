import React, { useState, useEffect } from 'react';
import Board from '../Board';

function Replay({ uuid }) {
    const [replay, setReplay] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/games/${uuid}/replay`);
            setReplay(await res.json());
        }
        fetchData();
    });

    if (!replay) return null;
    return null;

    const [turn, setTurn] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setTurn(Math.min(boards.length - 1, turn + 1));
        }, 2000);
    });

    return <Board data={boards[turn]} />;
}

export default Replay;
