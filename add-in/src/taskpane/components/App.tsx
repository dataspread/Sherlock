import HeroList, { HeroListItem } from "./HeroList";
import { FormulasApi } from "../../api/formulas";
import { DefaultButton } from "@fluentui/react";
import { ColorMap } from "../../utils/colormap"
import { transpose } from "../../utils/utils";
import { TacoApi } from "../../api/taco";
import * as React from "react";

import Progress from "./Progress";
import Header from "./Header";

/* global console, Excel, require  */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }

  componentDidMount() {
    this.setState({
      listItems: [
        {
          icon: "Ribbon",
          primaryText: "Achieve more with Office integration",
        },
        {
          icon: "Unlock",
          primaryText: "Unlock features and functionality",
        },
        {
          icon: "Design",
          primaryText: "Create and visualize like a pro",
        },
      ],
    });
  }

  clusterFormulae = async () => {
    try {
      await Excel.run(async (context) => {
        const colormap = new ColorMap();
        const range = context.workbook.getSelectedRange();
        range.load("formulas");
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
        console.log(range.formulas);
        console.log(hashMtx);
      });
    } catch (error) {
      console.error(error);
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    }
  };

  getTacoPatterns = async () => {
    try {
      await Excel.run(async (context) => {
        const colormap = new ColorMap();
        const range = context.workbook.getSelectedRange();
        range.load("formulas");
        await context.sync();
        const hashMtx = await TacoApi.getPatterns(range.formulas);
        hashMtx.forEach((row, i) => {
          row.forEach((pattern, j) => {
            if (pattern != null && pattern !== "NO_COMP" && pattern !== "UNKNOWN") {
              range.getCell(i, j).format.fill.color = colormap.add(pattern);
            } else {
              range.getCell(i, j).format.fill.clear();
            }
          });
        });
        console.log(range.formulas);
        console.log(hashMtx);
      });
    } catch (error) {
      console.error(error);
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    }
  };

  resetBackgroundColor = async () => {
    try {
      await Excel.run(async (context) => {
        const range = context.workbook.getSelectedRange();
        await context.sync();
        range.format.fill.clear();
      });
    } catch (error) {
      console.error(error);
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    }
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

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
        <Header logo={require("./../../../assets/logo-filled.png")} title={this.props.title} message="Welcome" />
        <HeroList message="Discover what Office Add-ins can do for you today!" items={this.state.listItems}>
          <p className="ms-font-l">Select a group of cells and press one of the buttons below!</p>
          <DefaultButton
            className="ms-welcome__action"
            iconProps={{ iconName: "ChevronRight" }}
            onClick={this.clusterFormulae}
          >
            Cluster Formulae!
          </DefaultButton>
          <DefaultButton
            className="ms-welcome__action"
            iconProps={{ iconName: "ChevronRight" }}
            onClick={this.getTacoPatterns}
          >
            Find TACO Patterns!
          </DefaultButton>
          <DefaultButton
            className="ms-welcome__action"
            iconProps={{ iconName: "ChevronRight" }}
            onClick={this.resetBackgroundColor}
          >
            Reset Background Color!
          </DefaultButton>
        </HeroList>
      </div>
    );
  }
}
