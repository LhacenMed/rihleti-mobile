// Reexport the native module. On web, it will be resolved to HelloModule.web.ts
// and on native platforms to HelloModule.ts
export { default } from './src/HelloModule';
export { default as HelloModuleView } from './src/HelloModuleView';
export * from  './src/HelloModule.types';
