import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}       >
            <img class="die-face" src={`./images/die_${props.value}.png`} />

        </div>
    )
}