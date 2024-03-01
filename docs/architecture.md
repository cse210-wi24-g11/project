# architecture

## file structure

```
.
├── .github/                github workflows, templates, etc
├── .vscode/                vscode settings
├── docs/                   project documentation
│   └── architecture.md     (you are here) project architecture
├── public/                 files in this folder get directly copied to the output
├── src/                    most actual application stuff goes here
│   ├── assets/                 images, svgs, etc
│   ├── components/             reusable components (e.g. button)
│   ├── pages/                  individual pages in the app
│   ├── utils/                  general utility functions
│   ├── index.css               global styles
│   └── main.tsx                application entry point
├── tests/                  tests go here
│   └── .../                (should match src file structure)
├── .eslintrc.*             eslint configuration
├── .prettier*              prettier configuration
├── index.html              html template
├── package.json            dependencies and scripts
├── postcss.config.js       postcss configuration for tailwind
├── readme.md               project readme
├── tailwind.config.js      tailwind configuration
└── vite.config.ts          vite configuration
```
