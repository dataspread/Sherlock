import { DefaultButton, Stack } from "@fluentui/react";
import * as React from "react";
import { FormulasApi } from "../../api/formulas";
import { TacoApi } from "../../api/taco";
import { ColorMap } from "../../utils/colormap";
import Header from "./Header";
import Progress from "./Progress";
import Graph from "./Graph";
import {excelToNums, numsToExcel, getTACOPatterns, getNodeColors} from "../../utils/graphUtils";

const colormap = new ColorMap();

async function clusterFormulae() {
  try {
    await Excel.run(async (context) => {
      const range = context.workbook.getSelectedRange();
      range.load({ formulas: true });
      await context.sync();
      const hashMtx = await FormulasApi.hashFormulae(range.formulas);
      hashMtx.forEach((row, i) => {
        row.forEach((hash, j) => {
          if (hash != null) {
            range.getCell(i, j).format.fill.color = colormap.add(hash);
          } else {
            range.getCell(i, j).format.fill.clear();
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
  }
}

async function getFormulas(context: Excel.RequestContext) {
  let range = context.workbook.getSelectedRange();
  range.load({ formulas: true, cellCount: true, rowIndex: true, columnIndex: true });
  await context.sync();
  const analyzeFullSheet = range.cellCount < 2;
  if (analyzeFullSheet) {
    range = context.workbook.worksheets.getActiveWorksheet().getUsedRange();
    range.load({ formulas: true, rowIndex: true, columnIndex: true });
    await context.sync();
  }
  const rowOffset = range.rowIndex;
  const colOffset = range.columnIndex;
  const formulas = range.formulas;
  return { formulas, rowOffset, colOffset };
}

async function getTacoPatterns() {
  try {
    await Excel.run(async (context) => {
      const { formulas, rowOffset, colOffset } = await getFormulas(context);
      const tacoPatterns = await TacoApi.getPatterns(formulas);

      for (let [_sheetName, sheet] of Object.entries(tacoPatterns)) {
        for (let [_edgeKey, edges] of Object.entries(sheet)) {
          for (let edge of edges) {
            const {
              ref: { _row, _column, _lastColumn, _lastRow },
            } = edge;
            const patternType = edge.edgeMeta.patternType;
            const targetRange = context.workbook.worksheets
              .getActiveWorksheet()
              .getRangeByIndexes(rowOffset + _row, colOffset + _column, _lastRow - _row + 1, _lastColumn - _column + 1);
            targetRange.format.fill.color = colormap.add(patternType);
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
  }
}

async function resetBackgroundColor() {
  try {
    await Excel.run(async (context) => {
      const range = context.workbook.getSelectedRange();
      range.load({ cellCount: true, formulas: true });
      await context.sync();
      if (range.cellCount === 1) {
        const fullRange = context.workbook.worksheets.getActiveWorksheet().getUsedRange();
        await context.sync();
        fullRange.format.fill.clear();
      } else {
        range.format.fill.clear();
      }
    });
  } catch (error) {
    console.error(error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
  }
}

const paddingScale = 24;
const defaultHeight = "24px";
const defaultWidth = "48px";
async function getGraph(setElements: React.Dispatch<React.SetStateAction<any[]>>) {
  try {
    await Excel.run(async (context) => {
      const { formulas, rowOffset, colOffset } = await getFormulas(context);
      const tacoPatterns = await TacoApi.getPatterns(formulas);
      const patternMap = getTACOPatterns();
      const colorMap = getNodeColors();
      const elements = [];
      const seenRanges = new Set();
      const rowsToRange = new Map();
      const colsToRange = new Map();
      for (let [_sheetName, sheet] of Object.entries(tacoPatterns)) {
        for (let [prec, edges] of Object.entries(sheet)) {
          prec = prec.replace("default:", "").replace("(", "").replace(")", "");

          let precCoords = prec.match(/[A-Z]+[0-9]+/g);
          let precRow = 0;
          let precCol = 0;
          for (let coord of precCoords) {
            let c = excelToNums(coord);
            precRow += c[0];
            precCol += c[1];
          }
          precRow = precRow / precCoords.length;
          precCol = precCol / precCoords.length;
          for (let edge of edges) {
            const depCoords = {
              rowStart: edge.ref._row + rowOffset + 1,
              rowEnd: edge.ref._lastRow + rowOffset + 1,
              colStart: edge.ref._column + colOffset,
              colEnd: edge.ref._column + colOffset
            };

            const patternType = patternMap.get(edge.edgeMeta.patternType);
            let dep;
            if (depCoords.colStart == depCoords.colEnd && depCoords.rowStart == depCoords.rowEnd) {
              dep = `${numsToExcel(depCoords.rowStart, depCoords.colStart)}`;
            } else {
              dep = `${numsToExcel(depCoords.rowStart, depCoords.colStart)}:${numsToExcel(depCoords.rowEnd, depCoords.colEnd)}`;
            }
            let depRow = (depCoords.rowStart + depCoords.rowEnd) / 2;
            let depCol = (depCoords.colStart + depCoords.colEnd) / 2;
            
            if (!seenRanges.has(prec)) {
              seenRanges.add(prec);
              if (rowsToRange.has(precRow)) { rowsToRange.get(precRow).push(elements.length); } 
              else { rowsToRange.set(precRow, [elements.length]); }
              if (colsToRange.has(precCol)) { colsToRange.get(precCol).push(elements.length); } 
              else { colsToRange.set(precCol, [elements.length]); }
              elements.push({
                data: {
                  id: prec, 
                  label: prec, 
                  bgColor: colorMap.get(patternType),
                  w: defaultWidth,
                  h: defaultHeight
                },
                classes: patternType,
                position: {
                  x: precCol,
                  y: precRow
                }
              });
            }
            if (!seenRanges.has(dep)) {
              seenRanges.add(dep);
              if (rowsToRange.has(depRow)) {
                rowsToRange.get(depRow).push(elements.length);
              } else {
                rowsToRange.set(depRow, [elements.length]);
              }
              if (colsToRange.has(depCol)) {
                colsToRange.get(depCol).push(elements.length);
              } else {
                colsToRange.set(depCol, [elements.length]);
              }
              elements.push(
                { data: 
                  {
                    id: dep, 
                    label: dep, 
                    bgColor: colorMap.get(patternType),
                    w: defaultWidth,
                    h: defaultHeight
                  },
                classes: patternType,
                position: {
                  x: depCol,
                  y: depRow
                }
              });
            }
            elements.push({ data:
              { classes: patternType, 
                source: dep, 
                target: prec, 
                //label: patternType,
                edgeColor: colorMap.get(patternType)
              }
            });
          }
        }
      }
      // Prevent overlapping nodes and condenses graph
      const condense = true;
      if (rowsToRange.size > 0 && condense) {
        const sortedRows = Array.from(rowsToRange.keys()).sort();
        let freeSpace = 0;
        for (let index of sortedRows) {
          for (let elemIndex of rowsToRange.get(index)) {
            elements[elemIndex].position.y = freeSpace;
            //elements[elemIndex].position.y = freeSpace + Math.random() * .4 - .2;
          }
          freeSpace += 1;
        }

        const sortedCols = Array.from(colsToRange.keys()).sort();
        freeSpace = 0;
        for (let index of sortedCols) {
          for (let elemIndex of colsToRange.get(index)) {
            elements[elemIndex].position.x = freeSpace;
            //elements[elemIndex].position.x = freeSpace + Math.random() * .4 - .2;
          }
          freeSpace += 1;
        }
      }

      // Attempts to prevent overlapping edges
      // if (rowsToRange.size > 0 && condense) {
      //   const sortedRows = Array.from(rowsToRange.keys()).sort();
      //   let freeSpace = 0;
      //   for (let index of sortedRows) {
      //     let elemIndexes = rowsToRange.get(index).sort();
      //     if (elemIndexes.length > 2) {
      //       for (let i = 0; i < elemIndexes.length; i++) {
      //         for (let j = i + 1; j < elemIndexes.length; j++) {

      //         }
      //       }
      //     }
      //       //elements[elemIndex].position.y = freeSpace + Math.random() * .5 - .25;
      //     }
      //   }

      //   const sortedCols = Array.from(colsToRange.keys()).sort();
      //   freeSpace = 0;
      //   for (let index of sortedCols) {
      //     for (let elemIndex of colsToRange.get(index)) {
      //       elements[elemIndex].position.x = freeSpace;
      //       //elements[elemIndex].position.x = freeSpace + Math.random() * .5 - .25;
      //     }
      //   }
      // }

      setElements(elements);
    });
  } catch (error) {
    console.error(error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
  }
}

export default function App({ title, isOfficeInitialized }: { title: string; isOfficeInitialized: boolean }) {
  const [elements, setElements] = React.useState([])
  
  if (!isOfficeInitialized) {
    return (
      <Progress
        title={title}
        logo={require("./../../../assets/logo-filled.png")}
        message="Please sideload your addin to see app body."
      />
    );
  }

  let cytoGraph = new Graph("hi");

  return (
    <div className="ms-welcome">
      <Header logo={require("./../../../assets/logo-filled.png")} title={title} message="Sheet Analyzer" />
      <p className="ms-font-l">Select a group of cells and press one of the buttons below!</p>
      <Stack tokens={{ childrenGap: 5 }}>
        <DefaultButton
          className="ms-welcome__action"
          iconProps={{ iconName: "ChevronRight" }}
          onClick={getTacoPatterns}
        >
          Find TACO Patterns
        </DefaultButton>
        <DefaultButton
          className="ms-welcome__action"
          iconProps={{ iconName: "ChevronRight" }}
          onClick={resetBackgroundColor}
        >
          Reset Background Color!
        </DefaultButton>
        <DefaultButton
          className="ms-welcome__action"
          iconProps={{ iconName: "ChevronRight" }}
          onClick={() => getGraph(setElements)}
        >
          Generate Graph
        </DefaultButton>
        <DefaultButton
          className="ms-welcome__action"
          iconProps={{ iconName: "ChevronRight" }}
          onClick={clusterFormulae}
        >
          Cluster Formulae! (old)
        </DefaultButton>
        <Graph elements={elements} scale = {75}/>
      </Stack>
    </div>
  );
}
