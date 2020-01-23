import React, { useState, useEffect, useRef, useMemo } from "react";
import DragElement from "./DragElement";
const checkSequence = (matrix, n) => {
  let count = 0;
  for (let row of matrix) {
    for (let col of row) {
      count += 1;
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
  isSwap,
  setHistory
) => {
  if (isSwap) {
    let n = props.matrix[0].length;
    const temp = props.matrix[sourceElRow][sourceElCol];
    props.matrix[sourceElRow][sourceElCol] = props.matrix[destElRow][destElCol];
    props.matrix[destElRow][destElCol] = temp;
    setHistory(prev => {
      console.log("kkk", prev);
      return [...prev, { [sourceElRow]: destElRow, [sourceElCol]: destElCol }];
    });
    if (props.matrix[n - 1][n - 1] == 0) {
      let sequenceFound = checkSequence(props.matrix, n);
      alert("sequenceFound.......");
    }
  }
};

export default props => {
  let matrix = [];
  const tableRef = useRef(null);
  let [history, setHistory] = useState([]);
  let getHistory = useMemo(() => {
    console.log("hdhdhdh", history);
    return [...history];
  }, [history]);
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
          tableRef={tableRef}
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
              isSwap,
              setHistory
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
  const width = `${Math.ceil((51 * props.number) / 2)}px`;
  return (
    <>
      <h3>Sliding puzzle</h3>
      <div
        className="table"
        ref={tableRef}
        style={{
          width: `${51 * props.number}px`,
          height: `${51 * props.number}px`,
          left: `calc(50% - ${width})`
        }}
      >
        {mapper(props.number)}
      </div>
      <button
        onClick={() => {
          console.log(history);
        }}
      >
        {"Go To Previous state"}
      </button>
    </>
  );
};
