export default {
  npmClient: "yarn",
  tailwindcss: {},
  plugins: ["@umijs/plugins/dist/tailwindcss"],
  publicPath: process.env.NODE_ENV === "development" ? undefined : "./",
  history: {
    type: "hash",
  },
};
