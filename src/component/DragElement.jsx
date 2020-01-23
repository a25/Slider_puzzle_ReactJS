import React, { useEffect, useRef } from "react";
const checkElements = (children, filledCellCol, filledCellRow) => {
  let emptyCellCol, emptyCellRow;
  let emptyEl = "";
  let result = { beforeY: 0, beforeX: 0, afterX: 0, afterY: 0 };
  children.forEach((el, id) => {
    if (Number(el.getAttribute("data-blank"))) {
      emptyEl = el;
      [emptyCellCol, emptyCellRow] = [
        Number(el.getAttribute("data-col")),
        Number(el.getAttribute("data-row"))
      ];
      result["blankFieldXpos"] = el.offsetLeft;
      result["blankFieldYpos"] = el.offsetTop;
    }
  });

  if (
    emptyCellCol == filledCellCol &&
    (emptyCellRow - 1 == filledCellRow || emptyCellRow + 1 == filledCellRow)
  ) {
    result["stopX"] = 1;
    result["beforeY"] = emptyCellRow - 1 == filledCellRow;
    result["afterY"] = emptyCellRow + 1 == filledCellRow;
  }
  if (
    (emptyCellCol - 1 == filledCellCol || emptyCellCol + 1 == filledCellCol) &&
    emptyCellRow == filledCellRow
  ) {
    result["stopY"] = 1;
    result["beforeX"] = emptyCellCol - 1 == filledCellCol;
    result["afterX"] = emptyCellCol + 1 == filledCellCol;
  }
  result["emptyEl"] = emptyEl;
  result["emptyCellCol"] = emptyCellCol;
  result["emptyCellRow"] = emptyCellRow;
  if (!result.stopX && !result.stopY) {
    result = {
      stopY: 1,
      stopX: 1,
      beforeY: 0,
      beforeX: 0,
      afterX: 0,
      afterY: 0,
      emptyEl,
      emptyCellCol,
      emptyCellRow
    };
  }

  return result;
};
// filled,blankel
const getNum = num => {
  return Number(num);
};
const swapElement = (sourceEl, destEl) => {
  let isSwap = false;
  if (!sourceEl || !destEl) {
    return { isSwap };
  }
  let ac = getNum(sourceEl.current.getAttribute("data-col"));
  let br = getNum(sourceEl.current.getAttribute("data-row"));

  let cc = getNum(destEl.getAttribute("data-col"));
  let dr = getNum(destEl.getAttribute("data-row"));
  // debugge
  if (br != dr) {
    if (
      (dr < br &&
        (sourceEl.current.offsetTop <= destEl.offsetTop ||
          sourceEl.current.offsetTop <= destEl.offsetTop + 45)) ||
      (dr > br &&
        (sourceEl.current.offsetTop >= destEl.offsetTop ||
          sourceEl.current.offsetTop >= destEl.offsetTop - 45))
    ) {
      isSwap = true;
      destEl.style.top = br * 51 + "px";
      sourceEl.current.style.top = dr * 51 + "px";
      destEl.setAttribute("data-col", ac);
      destEl.setAttribute("data-row", br);
      sourceEl.current.setAttribute("data-col", cc);
      sourceEl.current.setAttribute("data-row", dr);
      sourceEl.current.style.backgroundColor = "blueviolet";
    } else {
      sourceEl.current.style.top = br * 51 + "px";
    }
  }

  if (br == dr) {
    if (
      (cc < ac &&
        (sourceEl.current.offsetLeft <= destEl.offsetLeft ||
          sourceEl.current.offsetLeft <= destEl.offsetLeft + 45)) ||
      (cc > ac &&
        (sourceEl.current.offsetLeft >= destEl.offsetLeft ||
          sourceEl.current.offsetLeft >= destEl.offsetLeft - 45))
    ) {
      isSwap = true;
      destEl.style.left = ac * 51 + "px";
      sourceEl.current.style.left = cc * 51 + "px";
      destEl.setAttribute("data-col", ac);
      destEl.setAttribute("data-row", br);
      sourceEl.current.setAttribute("data-col", cc);
      sourceEl.current.setAttribute("data-row", dr);
      sourceEl.current.style.backgroundColor = "blueviolet";
    } else {
      sourceEl.current.style.left = ac * 51 + "px";
    }
  }
  return {
    sourceElCol: ac,
    sourceElRow: br,
    destElCol: cc,
    destElRow: dr,
    sourceEl: sourceEl.current,
    destEl,
    isSwap
  };
};

export default props => {
  let elementRef = useRef();
  let x1, x2, x3, x4, preventX, preventY;
  let movingel = "";
  let setMovingEl = 0;
  [x1, x2, x3, x4, preventX, preventY] = [0, 0, 0, 0, 0, 0];
  useEffect(() => {
    elementRef.current.style.top = props.x4 + "px";
    elementRef.current.style.left = props.x3 + "px";
    // const parent = document.getElementsByClassName("table")[0];
    elementRef.current.onmousedown = e => {
      const col = Number(elementRef.current.getAttribute("data-col"));
      const row = Number(elementRef.current.getAttribute("data-row"));
      e.preventDefault();
      x1 = e.clientX;
      x2 = e.clientY;
      let children = Array.from(props.tableRef.current.childNodes);
      let {
        stopX,
        stopY,
        beforeY,
        beforeX,
        afterX,
        afterY,
        blankFieldYpos,
        blankFieldXpos,
        emptyEl,
        emptyCellCol,
        emptyCellRow
      } = checkElements(children, col, row);
      [preventX, preventY] = [stopX, stopY];
      document.onmouseup = e => {
        let { isSwap, ...other } = swapElement(movingel, emptyEl, props);
        if (isSwap) {
          let {
            sourceElCol,
            sourceElRow,
            destElCol,
            destElRow,
            sourceEl,
            destEl
          } = other;
          props.trackElementsFn(
            sourceElCol,
            sourceElRow,
            destElCol,
            destElRow,
            props,
            isSwap,
            sourceEl,
            destEl,
            { isSwap: true }
          );
        }

        setMovingEl = 0;
        [preventX, preventY] = [0, 0];
        document.onmouseup = null;
        document.onmousemove = null;
      };
      document.onmousemove = e => {
        e.preventDefault();

        if (!preventX) {
          x3 = x1 - e.clientX;
        }
        if (!preventY) {
          x4 = x2 - e.clientY;
        }

        if (beforeY) {
          if (
            elementRef.current.offsetTop - (x2 - e.clientY) < row * 51 ||
            elementRef.current.offsetTop - (x2 - e.clientY) > row * 51 + 51
          ) {
            preventY = 1;
          } else {
            preventY = 0;
            movingel = elementRef;
          }
        }
        if (afterY) {
          if (
            elementRef.current.offsetTop - (x2 - e.clientY) <
              blankFieldYpos - 2 ||
            elementRef.current.offsetTop - (x2 - e.clientY) >
              blankFieldYpos + 51
          ) {
            preventY = 1;
          } else {
            preventY = 0;
            movingel = elementRef;
          }
        }

        if (beforeX) {
          if (
            elementRef.current.offsetLeft - (x1 - e.clientX) < col * 51 ||
            elementRef.current.offsetLeft - (x1 - e.clientX) > col * 51 + 51
          ) {
            preventX = 1;
          } else {
            preventX = 0;
            movingel = elementRef;
          }
        }
        if (afterX) {
          if (
            elementRef.current.offsetLeft - (x1 - e.clientX) <
              blankFieldXpos - 2 ||
            elementRef.current.offsetLeft - (x1 - e.clientX) >
              blankFieldXpos + 53
          ) {
            preventX = 1;
          } else {
            preventX = 0;
            movingel = elementRef;
          }
        }

        if (!preventX) {
          x1 = e.clientX;
          elementRef.current.style.left =
            elementRef.current.offsetLeft - x3 + "px";
        }
        if (!preventY) {
          x2 = e.clientY;
          elementRef.current.style.top =
            elementRef.current.offsetTop - x4 + "px";
        }
      };
    };
  }, []);
  return (
    <span
      id="myDiv"
      className={props.row === 0 && props.col === 0 ? "blank" : "filled"}
      data-blank={props.row === 0 && props.col === 0 ? 1 : 0}
      data-row={props.row}
      data-col={props.col}
      ref={elementRef}
    >
      {props.value}
    </span>
  );
};
