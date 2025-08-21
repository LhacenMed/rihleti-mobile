/**
 * Icons System
 *
 * This module provides a centralized way to manage and use icons throughout the app.
 *
 * Usage:
 * import { RihletiLogo, HomeIcon } from '../../components/icons';
 *
 * To add new SVG icons:
 * 1. Place your .svg file in src/assets/
 * 2. Create a component that imports the SVG (see RihletiLogo.tsx as example)
 * 3. Export it from this index file
 *
 * The metro.config.js is configured to transform SVG files automatically.
 */

// Icon exports
export { default as RihletiLogo } from "./RihletiLogo";

// Re-export existing icons for consistency
export { default as HomeIcon } from "@assets/icons/HomeIcon";
export { default as ExploreIcon } from "@assets/icons/ExploreIcon";
export { default as BookingsIcon } from "@assets/icons/BookingsIcon";
export { default as SettingsIcon } from "@assets/icons/SettingsIcon";

// Export icon types
export type { IconProps } from "./types";
