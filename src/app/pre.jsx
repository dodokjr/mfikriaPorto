import React from 'react'

export default function Preload(props) {
  return (
    <div id={props.id ? "preload" : "preload-none"}></div>
  )
}
