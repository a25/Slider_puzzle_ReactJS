import React, { useEffect, useRef } from "react";
import "./style.css";
import DragElement from "./DragElement";

export default props => {
  let mapper = number => {
    let squareArray = [];
    let row, col;
    [row, col] = [-1, 0];
    // console.log("hdh", props);
    for (let i = 0; i < number * number; i++) {
      // console.log(props.number, DragElement);

      if (i % number == 0) {
        row += 1;
        col = 0;
      } else {
        col += 1;
      }
      // console.log(row * 51)
      squareArray.push(
        <DragElement
          key={i.toString()}
          x4={row * 51}
          row={row}
          col={col}
          x3={(i % number) * 51}
          value={i}
        />
      );
    }
    return squareArray;
  };

  return (
    <div
      className="table"
      style={{
        width: `${51 * props.number}px`,
        height: `${51 * props.number}px`
      }}
    >
      {mapper(props.number)}
    </div>
  );
};
