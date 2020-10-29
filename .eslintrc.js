module.exports = {
  root: true, // Make sure eslint picks up the config at the root of the directory
  parserOptions: {
    ecmaVersion: 2020, // Use the latest ecmascript standard
    sourceType: 'module', // Allows using import/export statements
    ecmaFeatures: {
      jsx: true, // Enable JSX since we're using React
    },
  },
  settings: {
    react: {
      pragma: 'React', // Pragma to use, default to "React"
      version: 'detect', // Automatically detect the react version
    },
  },
  env: {
    es6: true, // Enables all ECMAScript 6 features except for modules (this automatically sets the ecmaVersion parser option to 6).
    browser: true, // Enables browser globals like window and document
    amd: true, // Enables require() and define() as global variables as per the amd spec.
    node: true, // Enables Node.js global variables and Node.js scoping.
    jest: true, // Enables Jest global variables
  },
  extends: [
    'react-app', // Create React App base settings
    'react-app/jest', // Create React App Jest settings
    'eslint:recommended', // ESLint recommended settings
  ],
};
