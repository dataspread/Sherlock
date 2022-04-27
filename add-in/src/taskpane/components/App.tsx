import { DefaultButton, Stack } from "@fluentui/react";
import * as React from "react";
import { FormulasApi } from "../../api/formulas";
import { TacoApi } from "../../api/taco";
import { ColorMap } from "../../utils/colormap";
import Header from "./Header";
import Progress from "./Progress";
import Graph, { GraphMeta } from "./Graph";
import {excelToNums, numsToExcel, getTACOPatterns, getNodeColors, appendToMapValue, scaleWidth} from "../../utils/graphUtils";

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

async function getGraph(setGraphMeta: React.Dispatch<React.SetStateAction<GraphMeta>>) {
  try {
    await Excel.run(async (context) => {
      const { formulas, rowOffset, colOffset } = await getFormulas(context);
      const tacoPatterns = await TacoApi.getPatterns(formulas);
      setGraphMeta({
        tacoPatterns: tacoPatterns,
        rowOffset: rowOffset,
        colOffset: colOffset
      })
    });
  } catch (error) {
    console.error(error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
  }
}

export default function App({ title, isOfficeInitialized }: { title: string; isOfficeInitialized: boolean }) {
  const [graphMeta, setGraphMeta] = React.useState({
    tacoPatterns: null,
    rowOffset: 0,
    colOffset: 0
  });
  console.log(graphMeta);
  if (!isOfficeInitialized) {
    return (
      <Progress
        title={title}
        logo={require("./../../../assets/logo-filled.png")}
        message="Please sideload your addin to see app body."
      />
    );
  }

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
          onClick={() => getGraph(setGraphMeta)}
        >
          Generate Graph
        </DefaultButton>
        <Graph graphMeta={graphMeta} scale={100}/>
      </Stack>
    </div>
  );
}
