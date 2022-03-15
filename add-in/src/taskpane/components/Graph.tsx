import * as React from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import klay from 'cytoscape-klay';

cytoscape.use(klay);
export interface GraphProps {
    elements: Array<any>;
}

export default class Graph extends React.Component<GraphProps> {
    constructor(prop) {
        super(prop);
        this.state = {
            update: false
        }
    }

    public render(){
      const { elements } = this.props;
      const layout = {
          name: "grid"
          // other options
          //padding: 100,
          //nodeDimensionsIncludeLabels: true,
          // idealEdgeLength: 100,
          //edgeElasticity: 0.1
          // nodeRepulsion: 8500,
        };
      const cytoscapeStylesheet = [
          {
            selector: "node",
            style: {
              width: "label",
              height: "label",
              padding: "6px",
              shape: "round-rectangle"
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
              width: 1.5,
              shape: "round-rectangle"
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
      
              // "text-rotation": "autorotate"
            }
          },
          {
            selector: ".RR",
            style: {
              "background-color": "#2274A5"
            }
          },
          {
            selector: ".RF",
            style: {
              "background-color": "#F1C40F"
            }
          },
          {
            selector: ".FR",
            style: {
              "background-color": "#D90368"
            }
          },
          {
            selector: ".FF",
            style: {
              "background-color": "#F75C03"
            }
          }
        ] as Array<cytoscape.Stylesheet>;
        console.log("elements received: ", elements);
        /*
      const elements = [
          { data: { id: "created", label: "Created" } },
          { data: { id: "started", label: "Started" } },
          { data: { id: "onhold", label: "On Hold" } },
          { data: { id: "completed", label: "Completed" } },
          // edges
          { data: { source: "created", target: "started", label: 'RR'} },
          { data: { source: "onhold", target: "started", label: 'RR'} },
          { data: { source: "started", target: "onhold"} },
          { data: { source: "started", target: "started"} },
          { data: { source: "started", target: "completed"} }
      ]; */
      return <>
      
      <CytoscapeComponent 
              elements={elements} 
              style={ { width: '95%', height: '600px' , left: '2.5%'} } 
              stylesheet = {cytoscapeStylesheet}
              layout = {layout}
              /></>;
    }
}