# US Geography

[![MkDocs](https://img.shields.io/badge/Made%20with-MkDocs-526CFE?logo=materialformkdocs)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/Material%20for%20MkDocs-526CFE?logo=materialformkdocs)](https://squidfunk.github.io/mkdocs-material/)
[![GitHub Pages](https://img.shields.io/badge/View%20on-GitHub%20Pages-blue?logo=github)](https://dmccreary.github.io/us-geography/)
[![GitHub](https://img.shields.io/badge/GitHub-dmccreary%2Fus--geography-blue?logo=github)](https://github.com/dmccreary/us-geography)
[![Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-DA7857?logo=anthropic)](https://claude.ai/code)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

## View the Live Site

Visit the interactive textbook at: [https://dmccreary.github.io/us-geography/](https://dmccreary.github.io/us-geography/)

## Overview

**Interactive Intelligent Geography: The United States** is an interactive intelligent textbook designed for grade school children from 3rd to 6th grade. Instead of passively reading maps, students explore, click, zoom, compare, and play with rich interactive maps and visual simulations that bring the United States to life.

Students learn all 50 states—their locations, capitals, symbols, landscapes, climates, and cultures—while discovering how states connect into larger regions such as the Rocky Mountains, the Midwest, the Southeast, and innovation hubs like Silicon Valley.

The textbook adapts to student curiosity and pace, offering instant feedback, hints, layered map views, and exploratory challenges. Built using MkDocs with the Material theme, it incorporates learning graphs, concept dependencies, and interactive MicroSims to make geography something students *do*, not just something they study.

### What Makes This an Intelligent Textbook

- **Interactive maps**: Clickable states, draggable borders, zoomable regions
- **Multiple map layers**: Physical, political, climate, population, economy
- **Learning by exploration**: Discovery prompts and "what happens if..." challenges
- **Built-in checks for understanding**: Low-stress quizzes and challenges
- **Adaptive pathways**: Extra support or enrichment based on student progress

## Site Status and Metrics

| Metric | Count |
|--------|-------|
| Chapters | 3 |
| Markdown Files | 12 |
| Glossary Terms | 9 |
| MicroSims | 0 (in development) |

**Status:** Initial project setup complete. Content development in progress.

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/dmccreary/us-geography.git
cd us-geography
```

### Install Dependencies

This project uses MkDocs with the Material theme:

```bash
pip install mkdocs mkdocs-material
```

### Build and Serve Locally

Serve locally for development (with live reload):

```bash
mkdocs serve
```

Open your browser to `http://127.0.0.1:8000/us-geography/`

### Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

## Repository Structure

```
us-geography/
├── docs/                          # MkDocs documentation source
│   ├── chapters/                  # Chapter content
│   │   ├── 01-introduction/
│   │   ├── 02-getting-started/
│   │   └── 03-core-concepts/
│   ├── sims/                      # Interactive MicroSims
│   ├── learning-graph/            # Learning graph data
│   ├── css/                       # Custom styles
│   ├── img/                       # Images, logo, favicon
│   ├── glossary.md                # Geography terms
│   ├── course-description.md      # Course overview and objectives
│   └── index.md                   # Home page
├── mkdocs.yml                     # MkDocs configuration
└── README.md                      # This file
```

## Reporting Issues

Found a bug, typo, or have a suggestion for improvement? Please report it:

[GitHub Issues](https://github.com/dmccreary/us-geography/issues)

## License

This work is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).

**You are free to:**

- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material for any purpose, even commercially

**Under the following terms:**

- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.

See [LICENSE.md](docs/license.md) for full details.

## Acknowledgements

This project is built with support from the open source community:

- **[MkDocs](https://www.mkdocs.org/)** - Static site generator for documentation
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** - Beautiful, responsive theme
- **[p5.js](https://p5js.org/)** - Creative coding library for interactive MicroSims
- **[vis-network](https://visjs.org/)** - Network visualization for learning graphs
- **[Claude AI](https://claude.ai)** by Anthropic - AI-assisted content generation
- **[GitHub Pages](https://pages.github.com/)** - Free hosting for open source projects

## Contact

**Dan McCreary**

- LinkedIn: [linkedin.com/in/danmccreary](https://www.linkedin.com/in/danmccreary/)
- GitHub: [@dmccreary](https://github.com/dmccreary)

Questions, suggestions, or collaboration opportunities? Feel free to connect on LinkedIn or open an issue on GitHub.
