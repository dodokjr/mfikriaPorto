import React from "react"
import Typewriter  from "typewriter-effect"

export default function Type(){
    return(
        <Typewriter
      options={{
        strings: [
          "Devlopers",
          "Gamers",
          "Photografer",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 40,
      }}
    />
    )
}