/* eslint-disable */
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "module-resolver",
      {
        // Because @types/node exports node modules by default under the node: prefix, we need to remove it
        // so our tests can properly import the intended module.
        alias: {
          "^node:(.+)$": "\\1",
        },
      },
    ],
  ],
};
