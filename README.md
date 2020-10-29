# Architecting a new codebase

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

React is a fantastic framework that comes in many flavours. Each is designed to provide a different solution depending on the projects needs, and while they are great starting points for any project, most of these packages are very bare bones in terms of niceties for a development team looking to unify their development approach and standards.

You can find a list of the recommended toolchains for different React project types on the [React documentation page](https://reactjs.org/docs/create-a-new-react-app.html#recommended-toolchains).

This document is an attempt to outline how we take the above toolchains and extend them so they are ready to be used as baselines for new dev teams to ensure consistency from the get-go. It is also intended as a way to capture the currently recommended best practices for how these tools should be configured. _(2020-10-26)_

_If you intend to create a toolchain from scratch please make sure you take the time to read [this](https://reactjs.org/docs/create-a-new-react-app.html#creating-a-toolchain-from-scratch) first._

The toolchains captured in this document are as follows:
- [Create React App](#create-react-app-(cra))
- ~~Create React App + TypeScript~~
- ~~Next.js~~
- ~~Next.js + TypeScript~~
- ~~Gatsby~~

Below is an indepth look at how we take the `CRA` framework and extend it to fit the needs of a cross-platform team who are loonking to standardise their development approach.

---

## [Create React App (CRA)](https://create-react-app.dev/)

`CRA` is designed for creating single-page applications. You can run the below to create a new project and navigate to the root folder:

```bash
npx create-react-app cra && cd cra
```

If you already have [VS Code](https://code.visualstudio.com/) installed you should be able to open your project straight after the `create-react-app` script has finished by running this instead:

```bash
npx create-react-app cra && code ./cra
```

---

### [ESLint](https://eslint.org/)

`ESLint` is a pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.

#### Install

`CRA` comes with `ESLint` preinstalled so there isn't a need to manually do it ourselves:

```bash
# create-react-app comes with eslint preinstalled so we don’t need to run `npm install -D eslint`
```

#### Commands

As `ESLint` is already being used under the hood by `CRA`, all you need to do is to add the necessary commands to the scripts object inside of the `package.json`.

To run the linter:

```json
"scripts": {
  "lint": "eslint ."
}
```

To run the linter and auto-fix problems:

```json
"scripts": {
  "lint:fix": "eslint . --fix"
}
```

_A list of the available CLI options can be found on the [ESLint docs page](https://eslint.org/docs/user-guide/command-line-interface#options)._

#### Ignore

`ESLint` will attempt to run against the path it has been supplied (e.g. `eslint .` will run against all the files in the root directory).

To control what you have `eslint` parse you can either pass it an explicit path:

```bash
eslint ./src/**/*.{js,jsx}
```

Or you can create a `.eslintignore` file at the root of your project and add what you would like `eslint` to ignore:

```bash
touch .eslintignore
```

```bash
node_modules
.vscode
package-lock.json
public
```

Alternatively, if you have a `.gitignore` file you can opt to supply that instead of creating an `.eslintignore` file

```
eslint . --fix --ignore-path ./.gitignore
```

_`eslint` will always look for a `.eslintignore` file (if one is present in the root) unless the `--ignore-path` flag is set. At that point `eslint` will only make use of the target file._

#### Usage

The ESLint inside of `CRA` works out-of-the-box as it comes supplied with default configurations baked into the project. These configurations are defined inside of `package.json` under the `eslintConfig` parameter block. While the default `eslint` config is a great starting point, you will invariably need to extend or replace the default config and CRA/ESLint allows this to be done in two ways which I will outline below.

_Whenever ESLint is run it will attempt to find a configuration file it can use. If there are multiple configuration files in the same directory, ESLint will only use one. The priority order can be found [here](https://eslint.org/docs/user-guide/configuring#configuration-file-formats)._

##### Option 1 | Seperate `.eslintrc.js` (Preferred)

My preferred method is to create a `.eslintrc.js` file at the root of the project (or within a `config` folder) like so:

```bash
touch .eslintrc.js
```

Inside of the newly created `.eslintrc.js` file you will be able to configure and change `eslint` to your liking. As it is recommened that we extend from the provided CRA config, we will make it so our new config contains those rules.

The below is an example config that is a close mirror of the [default one provided by CRA](https://github.com/facebook/create-react-app/tree/master/packages/eslint-config-react-app):

```javascript
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
  ],
};
```
*Plugins imported by default from [CRA]((https://github.com/facebook/create-react-app/tree/master/packages/eslint-config-react-app)) are `['import', 'flowtype', 'jsx-a11y', 'react', 'react-hooks']`*

Once the `.eslintrc.js` is in place you can go ahead and remove the entire `eslintConfig` block from `package.json`.

##### Option 2 | Extend `eslintConfig` (CRA Recommended)

The CRA documentation outlines a way for us to extend their default `eslintConfig` configuration without needing to create a seperate `eslintrc` file. If you would prefer to make use of this method then you will need to create a `.env` at the project root like so (see [here](https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used) for `.env` priority order):

```bash
touch .env
```

Then inside of the newly created `.env` file you will neede to include the following:

```
EXTEND_ESLINT=true
```

With the above setting in place you will now be able to extend the `eslintConfig` just like you would a normal `.eslintrc.js` file and CRA will pick up those changes:

```json
{
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
      "eslint:recommended"
    ]
  },
}
```

**Regardless of which method you choose, it is advised to you update your `.gitignore` to include `.eslintcache` to ensure it is not commited as part of the repository.**

#### IDE Integration | VS Code

While we can run everything over CLI, we can also make use of IDE integrations to speed up our developers workflow.

Install the `ESLint` (dbaeumer.vscode-eslint) extension from the `VS Code` marketplace.

It can also be installed in `VS Code` by launching VS Code Quick Open (⌘+P), pasting the following command, and then pressing enter:

```bash
ext install dbaeumer.vscode-eslint
```

Now, if you haven't done so already, create a folder called `.vscode` at the root of your project and inside of that folder create a `settings.json` file:

```bash
mkdir .vscode && touch .vscode/settings.json
```

Add the following to your `settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
}
```

This will allow `VS Code` to display any `eslint` issues it identifies within the IDE and will also allow it to run `eslint --fix` whenever you save a file.

The benefit of storing `eslint` settings within the `.vscode` folder is that we store these rules within the workspace making it easier to maintain a consistent development environment regardless of any individual user settings.

_It is strongly advised that you remove any global settings you may have provided in the past and that you only define workspace settings in the future. You can do this by opening the Command Palette by pressing (⌘+⇧+P) or F1 and typing `Open Settings (JSON)`. Select `Preferences:Open Settings (JSON)` to open the file and remove any `eslint` related settings you may have provided it in the past._

---

### [Prettier](https://prettier.io/)

`Prettier` is an opinionated code formatter with support for a whole host of languages and file types. With `Prettier` you can automatically format the code you write to ensure a consistent code style within your projects codebase. See the Prettier [GitHub page](https://github.com/prettier/prettier) for more information, or look at this [page to see it in action](https://prettier.io/playground/).

#### Install

Start by running the below command to install `prettier`:

```bash
npm install -D prettier
```

#### Commands

To be able to make use of the `prettier` CLI we need to add the necessary commands to the scripts object inside of `package.json`.

To run the formatter:

```json
"scripts": {
  "format": "prettier . --check"
}
```

To run the formatter and auto-fix problems:

```json
"scripts": {
  "lint:fix": "prettier . --write"
}
```

_A list of the available CLI options can be found on the [Prettier docs page](https://prettier.io/docs/en/cli.html)._

#### Ignore

`Prettier` will attempt to run against the path it has been supplied (e.g. `prettier . --write` will run against all the files in the root directory and format them if able).

To control what you have `prettier` parse you can either pass it an explicit path:

```bash
prettier ./**/*.{js,css,md,json} --write
```

Or you can create a `.prettierignore` file at the root of your project and add what you would like `prettier` to ignore:

```bash
touch .prettierignore
```

```bash
# Ignore artifacts:
build
coverage

# Ignore:
node_modules
.vscode
package-lock.json
public
```

Alternatively, if you have a `.gitignore` file you can opt to supply that instead of creating an `.prettierignore` file

```
prettier . --fix --ignore-path ./.gitignore
```

_`prettier` will always look for a `.prettierignore` file (if one is present in the root) unless the `--ignore-path` flag is set. At that point `prettier` will only make use of the target file._

#### Usage

`Prettier` is an opinionated formatter and as a consquence it comes presupplied with a default configuration included inside of the installed module. While the default `prettier` config is a great base, you will invariably want to extend or replace the default settings to suit whatever your personal (or your teams) preference will be. `Prettier` allows this to by allowing us to supply our own customised configuration file.

_Whenever `Prettier` is run it will attempt to find a configuration file it can use. If there are multiple configuration files in the same directory, `Prettier` will only use one. The priority order can be found [here](https://prettier.io/docs/en/configuration.html)._

My preferred method is to create a `.prettierrc` file at the root of the project (or within a `config` folder) like so:

```bash
touch .prettierrc
```

Inside of the newly created `.prettierrc` file you will be able to configure `prettier` to your liking.

The below is an example config:

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "jsxBracketSameLine": true
}
```

_A list of the available formatting options can be found [here](https://prettier.io/docs/en/options.html)_

#### IDE Integration | VS Code

While we can run everything over CLI, we can also make use of IDE integrations to speed up our developers workflow.

Install the `Prettier` (esbenp.prettier-vscode) extension from the `VS Code` marketplace.

It can also be installed in `VS Code` by launching VS Code Quick Open (⌘+P), pasting the following command, and then pressing enter:

```bash
ext install esbenp.prettier-vscode
```

Now, if you haven't done so already, create a folder called `.vscode` at the root of your project and inside of that folder create a `settings.json` file:

```bash
mkdir .vscode && touch .vscode/settings.json
```

Add the following to your `settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": false,
  "editor.formatOnPaste": false,
  "editor.formatOnType": true,
  "[javascript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
}
```

This will allow `VS Code` to run `prettier --fix` whenever you save a file of the types specified in the `settings.json` object. You can add or remove more types to make the formatting more specific if you so choose.

The benefit of storing `prettier` settings within the `.vscode` folder is that we store these rules within the workspace making it easier to maintain a consistent development environment regardless of any individual user settings.

_It is strongly advised that you remove any global settings you may have provided in the past and that you only define workspace settings in the future. You can do this by opening the Command Palette by pressing (⌘+⇧+P) or F1 and typing `Open Settings (JSON)`. Select `Preferences:Open Settings (JSON)` to open the file and remove or set to false any `prettier` related settings you may have provided it in the past._

---

### Integrating Prettier with ESLint

`Prettier` is our chosen formatter and `ESLint` is our chosen static code-quality checker. However, by using both together we find they come into conflict as `ESLint` also has rules that care about formatting like `max-len` (which will conflict with the `Prettier` rule `printWidth`). To resolve this we have to disable the formatting rules controlled by `ESLint` and then plug-in the `Prettier` rules we'd like `ESLint` to report on.

#### Install
To do this we first need to install some required dependencies:

```bash
npm install -D eslint-config-prettier eslint-plugin-prettier
```

- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) - _this turns off all ESLint rules that are unnecessary or might conflict with Prettier_
- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) - _this adds Prettier as an ESLint rule_

Once the dependencies have been installed we will need to let `ESLint` know about the required changes.

#### Configuration

Open `.eslintrc.js` and update to the following [recommended approach*](https://github.com/prettier/eslint-plugin-prettier#recommended-configuration):

```javascript
module.exports = {
  ...
  extends: [
    'react-app', // Create React App base settings
    'react-app/jest', // Create React App Jest settings
    'eslint:recommended', // Recommended ESLint rules
    'plugin:prettier/recommended', // Make this the last element so prettier config overrides other formatting rules
  ],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }], // Use our .prettierrc file as source
  },
  ...
};
```

This does three things:

- Enables eslint-plugin-prettier.
- Sets the prettier/prettier rule to "error".
- Extends the eslint-config-prettier configuration.

You can then set Prettier's own options inside your `.prettierrc` file.

If we now return to the project and run `npm run lint` you will see `Prettier` issues reported as part of the `ESLint` output.

_In order to support special ESLint plugins (e.g. [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react), [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), etc), add extra exclusions for the plugins you use like so:_

```javascript
{
  extends: [
    'plugin:prettier/recommended',
    'prettier/flowtype',
    'prettier/react',
    'prettier/standard'
  ]
}
```

_For the list of every available exclusion rule set, please see the [readme of eslint-config-prettier](https://github.com/prettier/eslint-config-prettier/blob/master/README.md)._

_*The recommended approach above is a more concise way of writing what you see below:_

```javascript
module.exports = {
  ...
  plugins: ['prettier'],
  extends: [
    'react-app', // Create React App base settings
    'react-app/jest', // Create React App Jest settings
    'eslint:recommended', // Recommended ESLint rules
    'prettier', // Make this the last element so prettier config overrides other formatting rules
  ],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }], // Use our .prettierrc file as source
  },
  ...
};
```

#### Extended Pugins

On top of adding `Prettier`, I personally advise adding the following two plugins as defaults for any project.

```bash
npm install -D eslint-plugin-jsx-a11y eslint-plugin-simple-import-sort
```

- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) - static AST checker for accessibility rules on JSX elements.
- [eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort/) - automatically groups and sorts imports

The below `.eslintrc.js` demonstartes how they should be used within a config:

```javascript
module.exports = {
  ...
  plugins: ['jsx-a11y', 'simple-import-sort'], // Add the required plugins
  extends: [
    'react-app', // Create React App base settings
    'react-app/jest', // Create React App Jest settings
    'eslint:recommended', // Recommended ESLint rules
    'plugin:jsx-a11y/recommended', // Accessibility settings
    'plugin:prettier/recommended', // Make this the last element so prettier config overrides other formatting rules
  ],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }], // Use our .prettierrc file as source
    'simple-import-sort/sort': 'error', // Enables import sort rules - only autofixes when `eslint --fix` is run
    'sort-imports': 'off', // Disable other sorting rules
    'import/order': 'off', // Disable other sorting rules
  },
  ...
};
```

#### Conflict Checker

As it's not always obvious which `ESLint` rule conflicts with which `Prettier` one, `eslint-config-prettier` ships with a little CLI tool to help you check if your configuration contains any rules that are unnecessary or conflict with Prettier.

To be able to make use of the CLI tool we need to add the necessary command to the scripts object inside of `package.json`.

```json
"scripts": {
  "eslint-prettier-check": "eslint --print-config ./src/index.js | eslint-config-prettier-check"
}
```

_In [theory](https://github.com/prettier/eslint-config-prettier#cli-helper-tool) you need to run `npx eslint --print-config path/to/file.js | npx eslint-config-prettier-check` for every single file in your project to be 100% sure that there are no conflicting rules, because ESLint supports having different rules for different files. As usually you’ll likely have the same rules for all files, it is enough to run the command on one file (pick one that you won’t be moving)._

---

### [Husky](https://github.com/typicode/husky) & [Lint Staged](https://github.com/okonet/lint-staged)

While it's great to have all these CLI tools available to us, it would be even better if we ensured the ran whenever we attempt to check something into our repository; [this is where `Husky` and `Lint Staged` come in](https://create-react-app.dev/docs/setting-up-your-editor/#formatting-code-automatically).

To format our code whenever we make a commit in git, we need to install the following dependencies:

```bash
npm install -D husky lint-staged
```

- `husky` makes it possible to use githooks as if they are npm scripts.
- `lint-staged` allows us to run scripts on staged files in git.

With these installed we can now make sure every file is formatted correctly when we commit by adding the below to our `package.json`:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

### [EditorConfig](https://editorconfig.org/)

Settings in `EditorConfig` files enable you to maintain consistent coding styles and settings in a codebase, such as indent style, tab width, end of line characters, encoding, and more, regardless of the editor or IDE you use. For example, when coding in React, if your codebase has a convention to prefer that indents always consist of two space characters, documents use UTF-8 encoding, and each line always ends with a CR/LF, you can configure an .editorconfig file to do that.



Coding conventions you use on your personal projects may differ from those used on your team's projects. For example, you might prefer that when you're coding, indenting adds a tab character. However, your team might prefer that indenting adds four space characters instead of a tab character. `EditorConfig` files resolve this problem by enabling you to have a configuration for each scenario. The main feature is that `EditorConfig` lets developers set file type specific whitespace rules automatically, across [virtually all editors](http://editorconfig.org/#download).

This is a good thing in projects where developers have the freedom (and they should have) to choose their tools and editors. Because the settings are contained in a file in the codebase, they travel along with that codebase. As long as you open the code file in an EditorConfig-compliant editor, the text editor settings are implemented. For more information about EditorConfig files, see the [EditorConfig.org](https://editorconfig.org/) website.

The difference to Prettier is that `EditorConfig` targets at a much more low level. It deals with programming independent text-related things, such as line endings, to use spaces or tabs, etc. Prettier, on the other hand, deals with the visual aspects. `EditorConfig` and `Prettier` are concerned with different but related things and, thus, should be used together. To drive home this relationship, the `Prettier` CLI will respect `.editorconfig` by default.

The rules respected by `Prettier` include:

- indent_style
- indent_size/tab_width
- max_line_length

For more details see the [blog post](https://prettier.io/blog/2017/12/05/1.9.0.html#add-editorconfig-support-3255httpsgithubcomprettierprettierpull3255-by-josephfrazierhttpsgithubcomjosephfrazier) detailing the inclusion.

#### IDE Integration - VSCode

This [plugin](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) attempts to override user/workspace settings with settings found in `.editorconfig` files. No additional or vscode-specific files are required. As with any EditorConfig plugin, if `root=true` is not specified, EditorConfig will continue to look for an `.editorconfig` file outside of the project.

Install the `EditorConfig` (editorconfig.editorconfig) extension from the [marketplace](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig).

It can also be installed in VS Code by launching VS Code Quick Open (Ctrl+P), pasting the following command, and pressing enter.

```bash
ext install editorconfig.editorconfig
```

Create `.editorconfig` at the root of the project. An example config can be found [here](https://editorconfig.org/#example-file).

```bash
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

A list of the supported properties can be found [here](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig#supported-properties).

---

### [Visual Studio Code (VS Code)](https://code.visualstudio.com/)

To make setting up and starting on a codebase easier for everyone, workspace defaults can be provided for a project by making use of the `.vscode`. This allow us to maintain project specfic configurations and tools as part of the codebase to ensure a standardised approach to development across the development team.

The below is not an exhaustive list of the possible options but instead outlines the use of the following config objects:

- `settings.json` - contains the codebases unique workspaces settings
- `extensions.json` - allows developer to quickly identify any necessary extensions important to the codebase
- `launch.json` - [to enable debugging within the IDE](https://create-react-app.dev/docs/setting-up-your-editor/#debugging-in-the-editor)

The configs below serve as good bases to extend and adapt to suit your projects personal requirements.

#### `settings.json`

An example config showcasing possible workspace settings.

```json
{
  // eslint extension options
  "editor.codeActionsOnSave": {
    // For ESLint
    "source.fixAll.eslint": true,
    // For TSLint
    "source.fixAll.tslint": true,
    // For Stylelint
    "source.fixAll.stylelint": true
  },

  // prettier extension settings
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": false,
  "editor.formatOnPaste": false,
  "editor.formatOnType": true,
  "[javascript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.formatOnSave": false,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.formatOnSave": false,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "prettier.configPath": ".prettierrc"
}
```

#### `extensions.json`

This allows us to store the recommended extensions for our project. With this in place all a developer needs to do is to navigate to the extensions manager and type `@recommended` to pull up a list of the required project extensions they will need to install.

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "editorconfig.editorconfig",
    "msjsdiag.debugger-for-chrome"
  ]
}
```

#### `launch.json`

This works in conjunction with the [Chrome debugger extension](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) for VS Code and is configured to work with the default `CRA` settings. To use just add your breakpoints and start your project as normal with `npm start`, then press `F5` to bring up the debugger to begin exploring.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

If you would prefer to use the [Firefox debugger extension](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug) as your default environment you will just need to install it in VS Code by launching VS Code Quick Open (Ctrl+P), pasting the following command, and pressing enter.

```bash
ext install firefox-devtools.vscode-firefox-debug
```

And then updating `launch.json` to be:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Firefox",
      "type": "firefox",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "suggestPathMappingWizard": true
    }
  ]
}
```

---

### TODO

- Add React Testing Library
- Add Cypress
- Add documentation for other React toolchains
- Add `react-axe`
- ???
