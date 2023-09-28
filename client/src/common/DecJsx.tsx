import React from "react";

let getNodes = (str: string) =>
  new DOMParser().parseFromString(str, "text/html").body.childNodes;

let createJSX = (nodeArray: Array<any>): any => {
  return nodeArray.map((node) => {
    let attributeObj: any = {};
    const { attributes, localName, childNodes, nodeValue } = node;
    if (attributes) {
      Array.from(attributes).forEach((attribute: any) => {
        if (attribute.name === "style") {
          let styleAttributes = attribute.nodeValue.split(";");
          let styleObj: any = {};
          styleAttributes.forEach((attribute: any) => {
            let [key, value] = attribute.split(":");
            styleObj[key as keyof typeof styleObj] = value;
          });
          attributeObj[attribute.name] = styleObj;
        } else {
          attributeObj[attribute.name] = attribute.nodeValue;
        }
      });
    }
    return localName
      ? React.createElement(
          localName,
          attributeObj,
          childNodes && Array.isArray(Array.from(childNodes))
            ? createJSX(Array.from(childNodes))
            : []
        )
      : nodeValue;
  });
};

export const DecJsx = (props: { domChars: string }) => {
  return createJSX(Array.from(getNodes(props.domChars)));
};
