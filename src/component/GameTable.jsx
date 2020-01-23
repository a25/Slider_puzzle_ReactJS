import React, { useEffect, useRef } from "react";
import "./style.css";
import DragElement from "./DragElement";
const checkSequence = (matrix, n) => {
  let count = 0;
  for (let row of matrix) {
    for (let col of row) {
      count += 1;
      debugger;
      if (col != count) {
        if (count != n) {
          return 0;
        }
      }
    }
  }
  return 1;
};
const trackElements = (
  sourceElCol,
  sourceElRow,
  destElCol,
  destElRow,
  props,
  isSwap
) => {
  if (isSwap) {
    let n = props.matrix[0].length;
    const temp = props.matrix[sourceElRow][sourceElCol];
    props.matrix[sourceElRow][sourceElCol] = props.matrix[destElRow][destElCol];
    props.matrix[destElRow][destElCol] = temp;
    if (props.matrix[n - 1][n - 1] == 0) {
      let sequenceFound = checkSequence(props.matrix, n);
      console.log("sequenceFound.......", sequenceFound);
    }
  }
};

export default props => {
  let matrix = [];

  let mapper = number => {
    let squareArray = [];
    let row, col;
    [row, col] = [-1, 0];
    // console.log("hdh", props);
    for (let i = 0; i < number * number; i++) {
      // console.log(props.number, DragElement);

      if (i % number == 0) {
        row += 1;
        matrix.push([i]);
        col = 0;
      } else {
        matrix[row].push(i);
        col += 1;
      }
      // console.log(row * 51)
      squareArray.push(
        <DragElement
          trackElementsFn={(
            sourceElCol,
            sourceElRow,
            destElCol,
            destElRow,
            props,
            isSwap
          ) =>
            trackElements(
              sourceElCol,
              sourceElRow,
              destElCol,
              destElRow,
              props,
              isSwap
            )
          }
          key={i.toString()}
          x4={row * 51}
          row={row}
          col={col}
          x3={(i % number) * 51}
          value={i}
          matrix={matrix}
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
