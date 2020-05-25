# :rocket: Lunar Lander with Genetic Algorithm

This project was highly inspired by [Machine Learning Flappy Bird](https://github.com/ssusnic/Machine-Learning-Flappy-Bird).

<a href="https://ian13456.github.io/lunar-lander-ai/">
<img src="https://i.imgur.com/0LRpwjS.png" style="padding-bottom: 20px"/>
</a>

Lunar Lander is a single-player arcade game in the Lunar Lander subgenre. In the game, the player controls a lunar landing module as viewed from the side and attempts to land safely on the Moon.

For this project, I thought it would be a nice idea to combine this classic game with modern technology, and train these rockets to land by themselves.

## How?

Inspired by [Machine Learning Flappy Bird](https://github.com/ssusnic/Machine-Learning-Flappy-Bird), I decided to combine the concept of Neuron Networks with Genetic Algorithm.

### Neural Network

Each rocket is assigned with a neural network, with an input layer of 9 neurons, a hidden layer of 16 neurons, and an output layer of 4 neurons:
![](https://i.imgur.com/Gpcfwf2.png)

#### Inputs of the NN

9 input neurons:

- 8 inputs represent the surroundings of the rocket, telling the rocket the distances to the obstacles around it
- 1 input is the closest "landable" platform to the rocket

![](https://i.imgur.com/EThdEsG.png)

#### Outputs of the NN

The outputs of the NN comes in an array of 4 numbers between 0-1. Four of them each represents `Thrust`, `Rotate Left`, `Rotate Right`, and `Do Nothing`. If the value is over 0.5, the action is performed by the rocket.

### Fitness

Each rocket has a `fitness` function that determines how successful a rocket is upon these criteria:

- Angle difference of landing/crashing platform
- Fuel used in rocket's lifetime
- Landing/crashing speed
- Distance of rocket to the closest landable platform

This is essentially the score of the rocket, used as a measure of how successful a certain rocket is at landing.

### Genetic Algorithm

I mass spawn 30 rockets each iteration. In a certain time period, the rockets either crash, land or stay in the air.

After each iteration, I calculate the fitness of each and every rocket, and rank them from high to low. I keep the top rockets, and [reproduce](https://natureofcode.com/book/chapter-9-the-evolution-of-code/#96-the-genetic-algorithm-part-iii-reproduction) new rockets out of them.

## Results

After a few iterations, rockets start to land by themselves, and the average fitness slowly reaches a maximum value.

<p align="center">
<img src="https://i.imgur.com/fZeiCZW.gif" width="1000"/>
</p>
![](https://i.imgur.com/fZeiCZW.gif)

## Resources

- [Machine Learning Flappy Bird](https://github.com/ssusnic/Machine-Learning-Flappy-Bird)
- [Coding Train's Evolution of Code](https://natureofcode.com/book/chapter-9-the-evolution-of-code/)
- [My friend Baltazar's project](https://github.com/balta-z-r/lunar-lander)
- [Artistic inspiration from online lunar lander](http://moonlander.seb.ly/)
