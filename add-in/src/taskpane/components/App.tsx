import { DefaultButton, Stack } from "@fluentui/react";
import * as React from "react";
import { FormulasApi } from "../../api/formulas";
import { TacoApi } from "../../api/taco";
import { ColorMap } from "../../utils/colormap";
import Header from "./Header";
import Progress from "./Progress";
import Graph from "./Graph";
import {excelToNums, numsToExcel} from "../../utils/translations";

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
            console.log(edge);
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

async function getGraph(setElements: React.Dispatch<React.SetStateAction<any[]>>) {
  try {
    await Excel.run(async (context) => {
      const { formulas, rowOffset, colOffset } = await getFormulas(context);
      const tacoPatterns = await TacoApi.getPatterns(formulas);
      const patternMap = new Map();
      patternMap.set("TYPEZERO","RR");
      patternMap.set("TYPEONE","RR");
      patternMap.set("TYPETWO","RF");
      patternMap.set("TYPETHREE","FR");
      patternMap.set("TYPEFOUR","FF");
      patternMap.set("TYPEFIVE","RR Gap 1");
      patternMap.set("TYPESIX","RR Gap 2");
      patternMap.set("TYPESEVEN","RR Gap 3");
      patternMap.set("TYPEEIGHT","RR Gap 4");
      patternMap.set("TYPENINE","RR Gap 5");
      patternMap.set("TYPETEN","RR Gap 6");
      patternMap.set("TYPEELEVEN","RR Gap 7");
      patternMap.set("NOTYPE","");
      const colorMap = new Map();
      colorMap.set("RR", "#2274A5");
      colorMap.set("RF", "#F1C40F");
      colorMap.set("FR", "#D90368");
      colorMap.set("FF", "#F75C03");
      const elements = [];
      const seenRanges = new Set();
      const rowsToRange = new Map();
      const colsToRange = new Map();
      //console.log(`[DEBUG] Window offsets (row: ${rowOffset}, ${colOffset})`);
      //console.log("[DEBUG]", tacoPatterns);
      for (let [_sheetName, sheet] of Object.entries(tacoPatterns)) {
        for (let [prec, edges] of Object.entries(sheet)) {
          //console.log("[DEBUG]", prec);
          prec = prec.replace("default:", "").replace("(", "").replace(")", "");

          let precCoords = prec.match(/[A-Z]+[0-9]+/g);
          //console.log(`[DEBUG] precCoords: ${precCoords}`);
          let precRow = 0;
          let precCol = 0;
          for (let coord of precCoords) {
            let c = excelToNums(coord);
            precRow += c[0];
            precCol += c[1];
          }
          precRow = precRow / precCoords.length;
          precCol = precCol / precCoords.length;
          //console.log(`[DEBUG] ${precRow}, ${precCol}`);
          for (let edge of edges) {
            console.log("[DEBUG]", edge);
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
              if (rowsToRange.has(precRow)) {
                rowsToRange.get(precRow).push(elements.length);
              } else {
                rowsToRange.set(precRow, [elements.length]);
              }
              if (colsToRange.has(precCol)) {
                colsToRange.get(precCol).push(elements.length);
              } else {
                colsToRange.set(precCol, [elements.length]);
              }
              elements.push({
                data: {id: prec, label: prec},
                classes: patternType,
                position: {
                  x: precCol,
                  y: precRow
                },
                color: colorMap.get(patternType)
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
              elements.push({ data: 
                {id: dep, label: dep},
                classes: patternType,
                position: {
                  x: depCol,
                  y: depRow
                },
                color: colorMap.get(patternType)
              });
            }
            elements.push({ data:
              { classes: patternType, 
                source: dep, 
                target: prec, 
                label: patternType,
                color: colorMap.get(patternType)
              }
            });
            // elements.push({ data:
            //   { classes: "dummy", source: dep, target: prec}
            // });
          }
        }
      }
      const condense = true;
      if (rowsToRange.size > 0 && condense) {
        const sortedRows = Array.from(rowsToRange.keys()).sort();
        let freeSpace = sortedRows[0] as number + 1;
        console.log("free space", freeSpace)
        for (let index of sortedRows) {
          for (let elemIndex of rowsToRange.get(index)) {
            elements[elemIndex].position.y = freeSpace;
            //elements[elemIndex].position.y = freeSpace + Math.random() - .5;
          }
          freeSpace += 1;
        }

        const sortedCols = Array.from(colsToRange.keys()).sort();
        freeSpace = sortedCols[0] as number + 1;
        for (let index of sortedCols) {
          for (let elemIndex of colsToRange.get(index)) {
            elements[elemIndex].position.x = freeSpace;
           // elements[elemIndex].position.x = freeSpace + Math.random() - .5;
          }
          freeSpace += 1;
        }
      }
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
        <script>cytoGraph.render();</script>
        <Graph elements={elements} scale = {75}/>
      </Stack>
    </div>
  );
}
