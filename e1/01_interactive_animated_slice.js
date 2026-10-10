"use strict";

const pizza_images = [
    "pizza_00.png",
    "pizza_15.png",
    "pizza_30.png",
    "pizza_45.png",
    "pizza_60.png",
    "pizza_75.png",
    "pizza_90.png",
    "pizza_105.png",
    "pizza_120.png",
    "pizza_135.png",
    "pizza_150.png",
    "pizza_165.png",
    "pizza_180.png",
    "pizza_195.png",
    "pizza_210.png",
    "pizza_225.png",
    "pizza_240.png",
    "pizza_255.png",
    "pizza_270.png",
    "pizza_285.png",
    "pizza_300.png",
    "pizza_315.png",
    "pizza_330.png",
    "pizza_345.png"
]

const pizza_slice_images = [
    "pizza_slice_00.png",
    "pizza_slice_00.png",
    "pizza_slice_01.png",
    "pizza_slice_01.png",
    "pizza_slice_01.png",
    "pizza_slice_02.png",
    "pizza_slice_02.png",
    "pizza_slice_02.png",
    "pizza_slice_03.png",
    "pizza_slice_03.png",
    "pizza_slice_03.png",
    "pizza_slice_04.png",
    "pizza_slice_04.png",
    "pizza_slice_04.png",
    "pizza_slice_05.png",
    "pizza_slice_05.png",
    "pizza_slice_05.png",
    "pizza_slice_06.png",
    "pizza_slice_06.png",
    "pizza_slice_06.png",
    "pizza_slice_07.png",
    "pizza_slice_07.png",
    "pizza_slice_07.png",
    "pizza_slice_08.png",
    "pizza_slice_08.png",
    "pizza_slice_08.png",
    "pizza_slice_09.png",
    "pizza_slice_09.png",
    "pizza_slice_09.png",
    "pizza_slice_10.png",
    "pizza_slice_11.png",
    "pizza_slice_12.png",
    "pizza_slice_13.png",
    "pizza_slice_14.png",
    "pizza_slice_15.png",
    "pizza_slice_16.png",
    "pizza_slice_17.png",
    "pizza_slice_18.png",
    "pizza_slice_19.png",
    "pizza_slice_20.png",
    "pizza_slice_21.png"
]

let pizzaImage;
let pizzaSliceImage;

let i = 0;
let j = 0;
let isMoving = false;
let animationInterval;


const Direction = {
    LEFT: "left",
    RIGHT: "right",
}

function init() {
    pizzaImage = new Image();
    pizzaImage.onload = function () {
        const img = document.getElementById('pizza');
        img.setAttribute('src', this.src);
    }
    pizzaImage.src = "textures/pizza/" + pizza_images[i];

    pizzaSliceImage = new Image();
    pizzaSliceImage.onload = function () {
        const img = document.getElementById('pizza_slice');
        img.setAttribute('src', this.src);
    }
    pizzaSliceImage.src = "textures/pizza_slice/" + pizza_slice_images[j];
    setInterval(animatePizzaSlice, 100);
}

function rotatePizza(direction) {
    if (direction === Direction.LEFT) {
        if (i === 0) {
            i = pizza_images.length - 1;
        } else {
            i--;
        }
    } else if (direction === Direction.RIGHT) {
        if (i === pizza_images.length - 1) {
            i = 0;
        } else {
            i++;
        }
    }

    pizzaImage.src = "textures/pizza/" + pizza_images[i];
}

function animatePizzaSlice() {
    if (j === pizza_slice_images.length - 1) {
        j = 0;
    } else {
        j++;
    }

    pizzaSliceImage.src = "textures/pizza_slice/" + pizza_slice_images[j];
}

function animatePizza() {
    isMoving = !isMoving;

    if (isMoving) {
        animationInterval = setInterval(() => rotatePizza(Direction.RIGHT), 250);
    } else {
        clearInterval(animationInterval);
    }
}

function singleStepAnimation(direction) {
    if (isMoving) {
        return;
    }

    rotatePizza(direction);
}

window.onkeydown = function (event) {
    const key = event.which ? event.which : event.keyCode;
    switch (String.fromCharCode(key)) {
        case ('A'):
            animatePizza();
            break;
        case ('L'):
            singleStepAnimation(Direction.LEFT);
            break;
        case ('R'):
            singleStepAnimation(Direction.RIGHT);
            break;
    }
}
