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
const getAttribute = (el, attr) => Number(el.getAttribute(attr));
const setAttribute = (el, attr, val) => el.setAttribute(attr, val);

const ApplyHistory = (data, fun) => {
  let { sourceEl, destEl } = data[0];
  console.log("apply history....", { sourceEl, destEl });
  let [destRow, destCol, srcRow, srcCol] = [
    //here swapped as we are going back in time
    getAttribute(sourceEl, "data-row"),
    getAttribute(sourceEl, "data-col"),
    getAttribute(destEl, "data-row"),
    getAttribute(destEl, "data-col")
  ];
  sourceEl.style.top = srcRow * 51 + "px";
  sourceEl.style.left = srcCol * 51 + "px";
  destEl.style.top = destRow * 51 + "px";
  destEl.style.left = destCol * 51 + "px";
  setAttribute(sourceEl, "data-row", srcRow);
  setAttribute(sourceEl, "data-col", srcCol);
  setAttribute(destEl, "data-row", destRow);
  setAttribute(destEl, "data-col", destCol);
};
// const ApplyHistory  => create reference of elemts history
const trackElements = (
  sourceElCol,
  sourceElRow,
  destElCol,
  destElRow,
  props,
  isSwap,
  setHistory,
  sourceEl,
  destEl
) => {
  if (isSwap) {
    let n = props.matrix[0].length;
    const temp = props.matrix[sourceElRow][sourceElCol];
    props.matrix[sourceElRow][sourceElCol] = props.matrix[destElRow][destElCol];
    props.matrix[destElRow][destElCol] = temp;
    setHistory(prev => {
      console.log(sourceEl, destEl);
      return [...prev, { sourceEl, destEl }];
    });
    if (props.matrix[n - 1][n - 1] == 0) {
      let sequenceFound = checkSequence(props.matrix, n);
      alert("sequenceFound.......", sequenceFound);
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
    for (let i = 0; i < number * number; i++) {
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
            isSwap,
            sourceEl,
            destEl
          ) =>
            trackElements(
              sourceElCol,
              sourceElRow,
              destElCol,
              destElRow,
              props,
              isSwap,
              setHistory,
              sourceEl,
              destEl
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
          // let tempHistory = ;
          ApplyHistory(
            history.length ? history.slice(-1) : [],
            setHistory(prev => {
              let temp = [...prev];
              return temp.splice(temp.length - 1, 1);
            })
          );
          console.log(history);
        }}
      >
        {"Go To Previous state"}
      </button>
    </>
  );
};
