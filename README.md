# BST Explorer

<p align="center">
  <strong>Explore binary search trees with an interactive front end and Flask AVL API.</strong><br>
  HTML, CSS, JavaScript, and Python (Flask) for tree operations and deploy on Vercel.
</p>

<p align="center">
  <a href="https://case-study-5-dsa-g3.vercel.app/">Live Demo</a>
  &nbsp;&middot;&nbsp;
  <a href="#quick-start">Quick Start</a>
  &nbsp;&middot;&nbsp;
  <a href="#project-structure">Structure</a>
  &nbsp;&middot;&nbsp;
  <a href="#license">License</a>
</p>

<p align="center">
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white">
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?logo=css&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=111111">
  <img alt="Python" src="https://img.shields.io/badge/Python-Flask-3776AB?logo=python&logoColor=white">
  <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-22c55e?logo=open-source-initiative&logoColor=white">
</p>

## Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [License](#license)
- [Course Note](#course-note)

## Overview

BST Explorer (TreeSearch.bin) pairs a browser UI for building and inspecting
search trees with a small Flask app that implements AVL-aware operations. Use it
to generate random trees, insert keys, and reason about structure.

## Features

| Feature | Description |
|---------|-------------|
| Build BST | Construct trees from values or random generation |
| Flask API | Python backend with AVL helpers in `app.py` |
| Theme toggle | Light and dark UI |
| Vercel config | `vercel.json` routes traffic through the Python app |

## Quick Start

Static UI only:

```bash
git clone https://github.com/cikeyz/bst-explorer.git
cd bst-explorer
python -m http.server 8000
```

Full stack (Flask):

```bash
pip install flask
python app.py
```

## Project Structure

```text
bst-explorer/
├── index.html
├── script.js
├── styles.css
├── app.py
├── vercel.json
├── LICENSE
├── README.md
└── .gitignore
```

## License

MIT. See [LICENSE](LICENSE).

## Course Note

Built for CMPE 201 (Data Structures and Algorithms), Polytechnic University of
the Philippines, under Engr. Julian L. Lorico Jr.. Final project case study.
Published here as a standalone project.
