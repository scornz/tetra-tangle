<h1 align="left">Tetra Tangle</h1>

<p>
  <a href="https://github.com/scornz/taj-assassin/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://github.com/scornz" target="_blank">
    <img alt="Github" src="https://img.shields.io/badge/GitHub-@scornz-blue.svg" />
  </a>
  <a href="https://linkedin.com/in/mscornavacca" target="_blank">
    <img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-@mscornavacca-blue.svg" />
  </a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/scornz/tetra-tangle/main/media/tetra-tangle.png" alt="Example gameplay" width="20%"/>
</p>

> A recreation of familiar block puzzle game, extrapolated to 2.5D. Created individually
> as a final project for COS 426 (Computer Graphics) at Princeton University in F'23.

<p align="center">
  <img src="https://raw.githubusercontent.com/scornz/tetra-tangle/main/media/tetra-tangle-example.gif" alt="Example gameplay" width="50%"/>
</p>

<p align="center">
  Play the game on desktop
  <a href="https://tetra.mscornz.com"> here </a>
  and read the final report
  <a href="https://github.com/scornz/tetra-tangle/blob/main/final-report.pdf">here</a>.
</p>

## Abstract

This project represents the development of a block puzzle game completely compliant with the annually released Guideline from the Tetris Company [[1](#1)]. This includes but is not limited to, frame-perfect controls, the Super Rotation System (SRS), and the extended placement lockdown mechanism. The engine is built in Typescript, solely off of the three.js library, while the user interface overlay is created via React. Other features include fully customizable controls, a public leaderboard, and visual enhancements such as selective bloom. The project is composed of 2,796 lines of code and is thoroughly documented and well-structured, making it suitable as a template for others.

## Requirements

- `yarn` ([download](https://classic.yarnpkg.com/lang/en/docs/install))

## Setup

1.  Ensure requirements are installed correctly.
2.  Navigate to project folder.
3.  From root folder, call `yarn install`, to install all necessary packages.
4.  Go to [dreamlo.com](https://dreamlo.com/) and create a new leaderboard. Take the values and replace those found in `nonsecrets.ts` (feel free to use the ones already there, it's not like they are a secret or anything).
5.  Run `yarn dev`.
6.  Propser.

## License

Copyright © 2023 [Mike Scornavacca](https://github.com/scornz).<br />
This project is [MIT](https://github.com/scornz/tetra-tangle/blob/main/LICENSE) licensed.

## References

[<a id="1">1</a>]
Blue Planet Software, Inc. Tetris Design Guideline. PDF document. Accessed: 12-December-2023. 2009.
