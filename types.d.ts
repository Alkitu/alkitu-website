// Type declarations for custom module imports

// WASM module declaration for Rive runtime
declare module '*.wasm' {
  const value: string;
  export default value;
}
