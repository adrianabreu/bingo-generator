#  Bingo Generator

This app allows you to create some bingo boards and translate the number into text! We used it for playing a musical bingo.

[Try it online](https://adrianabreu.github.io/bingo-generator)

## Input
There are two different variations the standard which uses a 4x4 board and the simplified which uses a 3x2 board.

Just use the input area to add the interpolated text and select the amount of boards that you want to get!

## How many lines do I need to add?
The statistics behind bingo are based on [combinations](https://en.wikipedia.org/wiki/Combination). That means that we want to take 16 elements to build a bingo board from our pool and reach our target. We need that consider that this scales quickly with 20 songs we get 4845 different combinations.

## Tech Stack
This app is proudly powered by React, Typescript, and Vite.
