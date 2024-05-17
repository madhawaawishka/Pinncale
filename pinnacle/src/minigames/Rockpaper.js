import React, { useState } from 'react';
// import './styles/rock.css';
import paper from "../assets/minigames/paper.png"
import rock from "../assets/minigames/rock.png"
import scissors from "../assets/minigames/scissors.png"

export default function Rockpaper() {
    const [gameStarted, setGameStarted] = useState(false);
    const [hand1, setHand1] = useState(null);
    const [hand2, setHand2] = useState(null);

    const clickedHand = [
        <img src={rock} alt="rock" id="img1" />,
        <img src={paper} alt="paper" id="img1" />,
        <img src={scissors} alt="scissors" id="img1" />
    ];

    const clickedRightHand = [
        <img src={rock} alt="rock" id="img2" />,
        <img src={paper} alt="paper" id="img2" />,
        <img src={scissors} alt="scissors" id="img2" />
    ];

    const start = () => {
        setGameStarted(true);
    }

    const game = (position) => {
        document.getElementById("img1").style.animation = 'shakeLeft 1s 5 ease-in-out';
        document.getElementById("img2").style.animation = 'shakeRight 1s 5 ease-in-out';

        const random = Math.floor(Math.random() * 3);
        setTimeout(() => {
            setHand2(clickedRightHand[random]);
            setHand1(clickedHand[position]);
        }, 5000);
        setTimeout(() => {
            if (random === position) {
                alert("MATCH DRAW !!");
                window.location.reload();
            }
            else if (position === 0 && random === 2) {
                alert("YOU ARE WINNER , GOOD JOB !!");
                window.location.reload();
            }
            else if (position === 1 && random === 0) {
                alert("YOU ARE WINNER , GOOD JOB !!");
                window.location.reload();
            }
            else if (position === 2 && random === 1) {
                alert("YOU ARE WINNER , GOOD JOB !!");
                window.location.reload();
            }
            else {
                alert("COMPUTER IS WINNER,TRY NEXT TIME !!");
                window.location.reload();
            }
        }, 5500);
    }
  return (
    <div>
            <h1>&nbsp; ROCK &nbsp; PAPER &nbsp; SCISSOR</h1>
            <div id="hand1">{hand1}</div>
            <div id="hand2">{hand2}</div>
            {!gameStarted && <button type="button" onClick={start}>START</button>}
            {gameStarted && (
                <div>
                    <button type="button" onClick={() => game(0)}>ROCK</button>
                    <button type="button" onClick={() => game(1)}>PAPER</button>
                    <button type="button" onClick={() => game(2)}>SCISSOR</button>
                </div>
            )}
        </div>
  )
}
