'use strict';
window.onload = () => {
    const ball = document.querySelector(".ball");
    const shadowEl = document.querySelector(".shadow");
    const btn = document.querySelector(".btn");
    const stick = document.querySelector(".stick");
    const target = document.querySelector(".target");
    const help = document.querySelector(".help h1");
    const art = document.querySelector(".art");
    const barPower_Fill = document.querySelector(".fill");
    const fillSpan = document.querySelector(".fillSpan");
    const scoreObj = document.querySelector(".score");
    const display = document.body.querySelector(".display");
    const livesObj = document.body.querySelector(".lives");
    const ballGradientPattern =  value => `radial-gradient(circle at ${value}% 15%, #fcf3a5 0%, #c5ba78 23%, #998a69 35%, #2e3a42 60%, black 90%)`
    let display_width = display.clientWidth;
    let matrixValue = [];
    let grdValue, lives, score, targetArea, ratioX = 0;
    const randomRange = (min, max) => {
        return Math.random() * (max - min) + min;
    };
    const rndTarget = () => {
        let min = parseInt(display_width - targetArea);
        let max = parseInt(display_width - target.clientWidth);
        let newTarget = randomRange(min, max);
        return newTarget;
    };
    const checkHit = () => {
        let target_StyleL = target.offsetLeft;
        let target_StyleR = target_StyleL + target.clientWidth;
        let ball_StyleL = (display_width * .15) + ((display_width * .85) * (ratioX / 100));
        let ball_StyleR = ball_StyleL + ball.clientWidth;
        let condition = ball_StyleR < target_StyleR && ball_StyleL > target_StyleL;
        return condition;
    };
    const ballAnim = () => {
        grdValue = 75 - (ratioX * .35);
        const skewShadow = (-79) + (ratioX * 1.1);
        const ballX = ratioX * .85;
        const main = () => {
            const tl = new TimelineMax({
                onComplete: () => scoring(checkHit()),
            });
            tl.timeScale(1 - (ratioX * .006));
            tl.add('start');
            tl.set(ball, { backgroundImage: ballGradientPattern(75), })
            tl.to(ball, .35, { ease: Power2.easeOut, y: `-=${ratioX * .1}vw`, }, 'start');
            tl.to(ball, .5, { ease: Power2.easeIn, y: '11vw', });
            tl.to(ball, .1, { ease: Power4.easeOut, y: '-=5vw', });
            tl.to(ball, .3, { ease: Bounce.easeOut, y: '+=5vw', });
            tl.to(ball, 1.3, { backgroundImage: ballGradientPattern(grdValue), ease: Power1.easeOut, }, 'start')
            tl.to(ball, 1.3, { x: `+${ballX}}vw`, ease: Power1.easeOut, }, 'start');
            return tl;
        }
        const shadow = () => {
            const tl = new TimelineMax();
            tl.timeScale(1 - (ratioX * .006));
            tl.add('start');
            tl.set(shadowEl, { transformOrigin: 'top center' })
            tl.to(shadowEl, .35, { ease: Power2.easeOut, y: `+=${ratioX * .1}vw`, }, 'start');
            tl.to(shadowEl, .5, { ease: Power2.easeIn, y: '-11vw', });
            tl.to(shadowEl, .1, { ease: Power4.easeOut, y: '+=5vw', });
            tl.to(shadowEl, .3, { ease: Bounce.easeOut, y: '-=5vw', });
            tl.to(shadowEl, 1.3, { skewX: `${skewShadow}deg`, x: `+${ballX}}vw`, ease: Power1.easeOut, }, 'start');
            return tl;
        }
        const master = new TimelineMax();
        master.add('start');
        master.add(main(), "start");
        master.add(shadow(), "start");
    };
    const btn_releasedAnim = () => {
        targetArea = display_width - display_width * 0.23;
        stick.style.transform = `matrix(${matrixValue[0]},${matrixValue[1]},${matrixValue[2]},${matrixValue[3]},${matrixValue[4]},${matrixValue[5]})`;
        stick.style.animation = "stick-shoot .4s forwards cubic-bezier(.58,1.46,1,-0.64)";
        stick.addEventListener("animationend", ballAnim);
    };
    const startGame = () => {
        lives = 3;
        score = 0;
        scoreObj.textContent = `SCORE: ${score}`;
        btn.removeEventListener("click", startGame);
        init();
    }
    const update = () => {
        scoreObj.textContent = `SCORE: ${score}`;
        let newValue = rndTarget();
        target.style.left = `${newValue}px`;
        init();
    };
    const reset = () => {
        lives = 0;
        target.style.left = `23%`;
        init()
    };
    const hitBallAnim = () => {
        const tm = new TimelineMax({
            onComplete: () => {
                update()
            }
        });
        tm.add('start');
        tm.from(target, .8, { background: `radial-gradient(at center, rgba(255, 230, 0, 0) 0%, rgb(241, 64, 64) 90%)`, ease: Power0.easeOut }, 'start')
        tm.to(ball, .5, { opacity: '0', backgroundImage: ballGradientPattern(grdValue), ease: Power2.easeIn, delay: 0.2 }, 'start')
        tm.to(shadowEl, .5, { opacity: '0', background: 'red', ease: Power2.easeIn, delay: 0.2 }, 'start');
        tm.add('hidden');
        tm.to(ball, 0, { x: '0', y: '0', backgroundImage: ballGradientPattern(75)}, 'hidden')
        tm.to(shadowEl, 0, { x: '0', y: '0', }, 'hidden');
        tm.add('end');
        tm.to(ball, .5, { opacity: '1', }, 'end')
        tm.to(shadowEl, .5, { opacity: '1', }, 'end');
    }
    const failBallAnim = () => {
        const tm = new TimelineMax(
            {
                delay: .666,
                onComplete: () => {
                    lives ? update() : reset()
                }
            });
        tm.add('start');
        tm.to(ball, 1, { backgroundImage: ballGradientPattern(75), ease: Power3.easeOut, }, 'start')
        tm.to(ball, 1, { x: '0', y: '0', ease: Power3.easeOut, }, 'start')
        tm.to(shadowEl, 1, { x: '0', y: '0', ease: Power3.easeOut, }, 'start');
    }
    const scoring = (bool) => {
        stick.removeEventListener("animationend", ballAnim);
        stick.style.animation = "";
        stick.style.transform = `translateY(0vh) rotate(-20deg) translateX(0)`;
        if (bool) {
            score++;
            hitBallAnim();
        } else {
            lives--
            failBallAnim();
        }
    };
    const setMatrixArray = () => {
        let computedStyle = window.getComputedStyle(stick, null);
        let matrix = computedStyle.getPropertyValue('transform');
        let matrixPattern = /^\w*\((-?((\d+)|(\d*\.\d+)),\s*)*(-?(\d+)|(\d*\.\d+))\)/i;
        if (matrixPattern.test(matrix)) {
            let matrixCopy = matrix.replace(/^\w*\(/, '').replace(')', '');
            matrixValue = matrixCopy.split(/\s*,\s*/);
        }
    };
    const nbrPattern = (i) => {
        let style = window.getComputedStyle(barPower_Fill, null);
        let trans = style.transform;
        let numberPattern = /-?\d+\.?\d+|\d+/g;
        let values = trans.match(numberPattern);
        return values[i]
    };
    const setPower = () => {
        let computedTranslateX = nbrPattern(4);
        let xPercentage = (computedTranslateX / barPower_Fill.offsetWidth) * 100;
        ratioX = xPercentage.toFixed(0);
    };
    const btn_released = () => {
        setMatrixArray();
        stick.style.animation = "";
        stick.style.animationName = "none";
        setPower();
        btn.disabled = true;
        btn.textContent = `POWER: ${ratioX}%`;
        barPower_Fill.style.animationPlayState = "paused";
        fillSpan.style.animationPlayState = "paused";
        btn_releasedAnim();
        btn.removeEventListener("touchend", btn_released);
        btn.removeEventListener("mouseup", btn_released);
    };
    const btn_pushed = () => {
        stick.style.animationName = "stick";
        barPower_Fill.style.animationName = "bar";
        fillSpan.style.animationName = "pbar";
        barPower_Fill.style.animationPlayState = "running";
        fillSpan.style.animationPlayState = "running";
        stick.style.animationPlayState = "running";
        btn.textContent = "???";
        btn.removeEventListener("touchstart", btn_pushed);;
        btn.removeEventListener("mousedown", btn_pushed);
    };
    const resize = () => {
        display_width = display.clientWidth;
        target.style.left = `23%`;
    };
    const setFscreen = () => {
        if (!Element.prototype.requestFullscreen) {
            Element.prototype.requestFullscreen = Element.prototype.mozRequestFullscreen || Element.prototype.webkitRequestFullscreen || Element.prototype.msRequestFullscreen;
        }
        if (!document.exitFullscreen) {
            document.exitFullscreen = document.mozExitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
        }
        if (!document.fullscreenElement) {
            Object.defineProperty(document, 'fullscreenElement', {
                get: function () {
                    return document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement;
                }
            });
            Object.defineProperty(document, 'fullscreenEnabled', {
                get: function () {
                    return document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitFullscreenEnabled;
                }
            });
        }
    };
    const addListeners = () => {
        window.addEventListener("resize", () => resize());
        setFscreen();
        document.addEventListener('click', function (event) {
            if (event.target == help ) {
                art.classList.toggle("hidden")
            }
            if (!event.target.hasAttribute('data-toggle-fullscreen')) return;
            if (document.fullscreenElement) {
                event.target.textContent = "Set Fullscreen"
                document.exitFullscreen();
            } 
            else {
                event.target.textContent = "Exit Fullscreen"
                document.documentElement.requestFullscreen();
            }
        }, false);
    };
    const init = () => {
        btn.disabled = false;
        !lives ? btn.textContent = 'Start Game' : btn.textContent = score > 0 && lives > 0 ? "Shoot again!" : "GET POWER!";
        if (!lives) {
            btn.removeEventListener("touchend", btn_released);
            btn.removeEventListener("mouseup", btn_released);
            btn.removeEventListener("touchstart", btn_pushed);;
            btn.removeEventListener("mousedown", btn_pushed);
            btn.addEventListener("click", startGame);
            lives = 0;
        } else {
            TweenMax.set(ball, { clearProps: "all" });
            TweenMax.set(shadowEl, { clearProps: "all" });
            btn.addEventListener("touchstart", btn_pushed);
            btn.addEventListener("touchend", btn_released);
            btn.addEventListener("mousedown", btn_pushed);
            btn.addEventListener("mouseup", btn_released);
        }
        livesObj.textContent = `Lives: ${lives}`
        barPower_Fill.style.animationName = "none";
        fillSpan.style.animationName = "none";
    };
    addListeners();
    init();
};
