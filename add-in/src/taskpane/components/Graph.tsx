import * as React from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import klay from 'cytoscape-klay';

cytoscape.use(klay);
export interface GraphProps {
    elements: Array<any>;
    scale: number;
}

export default class Graph extends React.Component<GraphProps> {
    constructor(prop) {
      super(prop);
      this.state = {
          elements: this.props
      }
      console.log("[DEBUG] made graph obj", this.props);
    }

    public render(){
      const elements = this.props.elements;
      for (let i = 0; i < elements.length; i++) {
        let position = elements[i].position;
        if (position) {
          elements[i].position.x =  position.x * this.props.scale;
          elements[i].position.y =  position.y * this.props.scale;
        }
      }
      const cytoscapeStylesheet = [
          {
            selector: "node",
            style: {
              width: "label",
              height: "label",
              padding: "6px",
              shape: "round-rectangle",
              "background-color": "data(color)"
            }
          },
          {
            selector: "node[label]",
            style: {
              label: "data(label)",
              "font-size": "12",
              color: "white",
              "text-halign": "center",
              "text-valign": "center"
            }
          },
          {
            selector: "edge",
            style: {
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              width: 3,
              shape: "round-rectangle",
              'line-color': 'data(color)',
              'target-arrow-color': 'data(color)'
            }
          },
          {
            selector: "edge[label]",
            style: {
              label: "data(label)",
              "font-size": "12",
      
              "text-background-color": "white",
              "text-background-opacity": 1,
              "text-background-padding": "2px",
      
              "text-border-color": "white",
              "text-border-style": "solid",
              "text-border-width": 0.5,
              "text-border-opacity": 1
            }
          },
          // {
          //   selector: ".RR",
          //   style: {
          //     'line-color': '#2274A5',
          //     "background-color": "#2274A5"
          //   }
          // },
          // {
          //   selector: ".RF",
          //   style: {
          //     "background-color": "#F1C40F",
          //     'line-color': '#F1C40F'
          //   }
          // },
          // {
          //   selector: ".FR",
          //   style: {
          //     "background-color": "#D90368",
          //     'line-color': '#D90368'
          //   }
          // },
          // {
          //   selector: ".FF",
          //   style: {
          //     "background-color": "#F75C03",
          //     'line-color': '#F75C03'
          //   }
          // },
          {
            selector: ".dummy",
            style: {
              width: 0
            }
          },
          {
            selector: ".tall",
            style: {
              "padding-bottom": "12px",
              "padding-top": "12px"
            }
          },
          {
            selector: ".wide",
            style: {
              "padding-left": "12px",
              "padding-right": "12px"
            }
          }
        ] as Array<cytoscape.Stylesheet>;
        console.log("elements received: ", elements);
      return <>
      
      <CytoscapeComponent 
              elements={elements} 
              style={ { width: '95%', height: '600px' , left: '2.5%'} } 
              stylesheet = {cytoscapeStylesheet}
              /></>;
    }
}