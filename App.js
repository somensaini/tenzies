import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import { useInterval } from 'usehooks-ts'

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollCount, setRollCount] = React.useState(0)
    const [time, setTime] = React.useState(0)
    const [running, setRunning] = React.useState(false)
    const storedBestTime = JSON.parse(localStorage.getItem('bestTime'))
    const [bestTime, setBestTime] = React.useState(storedBestTime)
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setRunning(false)
            checkBestTime()            
        }
    }, [dice, localStorage])

    React.useEffect(() => {
        localStorage.setItem('bestTime', JSON.stringify(bestTime))
    }, [bestTime])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setRunning(true)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRollCount(oldRollCount => oldRollCount + 1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRollCount(0)
            checkBestTime()
            setTime(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    function checkBestTime(){
        if (bestTime === null || bestTime === '' || storedBestTime > time){
            setBestTime(time)
        }
    }

    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    useInterval(
        () => {
          setTime(prevTime => prevTime + 10)
        },
        running ? 10 : null,
      )

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same.</p>
            <p className="instructions">Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="stats">
                <p>Roll Count: {rollCount}</p>
                <p>Time:
                    <span> {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                    <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
                </p>
                <p>Best Time:
                    <span> {bestTime ? ("0" + Math.floor((bestTime / 60000) % 60)).slice(-2) : "00"}:</span>
                    <span>{bestTime ? ("0" + Math.floor((bestTime / 1000) % 60)).slice(-2) : "00"}</span>
                </p>
            </div>            
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}