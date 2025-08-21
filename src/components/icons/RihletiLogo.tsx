import React from "react";
import { LogoProps } from "./types";
import RihletiLogoSvg from "@assets/rihleti-logo.svg";

const RihletiLogo: React.FC<LogoProps> = ({
  width = 48,
  height = 48,
  size,
  // variant = "default",
  // color,
  ...props
}) => {
  // If size is provided, use it for both width and height
  const finalWidth = size || width;
  const finalHeight = size || height;

  // Color variants - you can adjust these based on your design needs
  // const getColor = () => {
  //   if (color) return color;

  //   switch (variant) {
  //     case "white":
  //       return "#FFFFFF";
  //     case "dark":
  //       return "#000000";
  //     default:
  //       return undefined; // Use original SVG colors
  //   }
  // };

  // return <RihletiLogoSvg width={finalWidth} height={finalHeight} color={getColor()} {...props} />;
  return <RihletiLogoSvg width={finalWidth} height={finalHeight} {...props} />;
};

export default RihletiLogo;
