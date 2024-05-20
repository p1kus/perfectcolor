import generateHex from "./generateHex.js";
const domElements = () => {
    const contrastRatioHeader = document.querySelector("#contrastRatioHeader");
    if (!contrastRatioHeader) {
        console.error("Element not found");
        throw new Error("contrastRatioHeader not found");
    }
    const backgroundColorInput = document.querySelector("#backgroundColorInput");
    if (!backgroundColorInput) {
        console.error("Element not found");
        throw new Error("bgInput not found");
    }
    const textColorInput = document.querySelector("#textColorInput");
    if (!textColorInput) {
        console.error("Element not found");
        throw new Error("txtInput not found");
    }
    const textColorPalette = document.querySelector("#textColorPicker");
    if (!textColorPalette) {
        console.error("Element not found");
        throw new Error("txtPalette not found");
    }
    const backgroundColorPalette = document.querySelector("#backgroundColorPicker");
    if (!backgroundColorPalette) {
        console.error("Element not found");
        throw new Error("bgPalette not found");
    }
    const randomizeButton = document.querySelectorAll("svg");
    if (!randomizeButton) {
        console.error("Element not found");
        throw new Error("randBtn not found");
    }
    const swapButton = document.querySelector("#btn-swap");
    if (!swapButton) {
        console.error("Element not found");
        throw new Error("swapBtn not found");
    }
    const body = document.querySelector("body");
    if (!body) {
        console.error("Element not found");
        throw new Error("Body not found????");
    }
    const gradientC1 = document.querySelector("#stop1");
    if (!gradientC1) {
        console.error("Element not found");
        throw new Error("gC1 not found????");
    }
    const gradientC2 = document.querySelector("#stop2");
    if (!gradientC2) {
        console.error("Element not found");
        throw new Error("gC2 not found????");
    }
    return {
        contrastRatioHeader,
        backgroundColorInput,
        textColorInput,
        textColorPalette,
        backgroundColorPalette,
        randomizeButton,
        swapButton,
        body,
        gradientC1,
        gradientC2,
    };
};
const { contrastRatioHeader, backgroundColorInput, textColorInput, textColorPalette, backgroundColorPalette, randomizeButton, swapButton, body, gradientC1, gradientC2, } = domElements();
const pickTextCFromPalette = (e) => {
    e.target.style.background = e.target.value;
    textColorInput.value = e.target.value;
    updateColors();
    updateContrastRatio();
    updateGradient();
};
const pickBackgroundCFromPalette = (e) => {
    backgroundColorInput.value = e.target.value;
    updateColors();
    updateContrastRatio();
    updateGradient();
};
const pickTextCFromInput = (e) => {
    textColorPalette.value = e.target.value;
};
const getContrastRatio = (hex1, hex2) => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const contrastRatio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    return contrastRatio.toFixed(2);
};
const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
};
const getLuminance = (rgb) => {
    const sRGB = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
    let lRGB = sRGB.map((channel) => {
        return channel <= 0.03928
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * lRGB[0] + 0.7152 * lRGB[1] + 0.0722 * lRGB[2];
};
const updateContrastRatio = () => {
    if (contrastRatioHeader) {
        contrastRatioHeader.textContent = `Contrast Ratio: ${getContrastRatio(backgroundColorInput.value, textColorInput.value)}`;
    }
};
const randomizeBackground = () => {
    do {
        let randomBackgroundHex = generateHex();
        backgroundColorInput.value = randomBackgroundHex;
        backgroundColorPalette.style.backgroundColor = randomBackgroundHex;
    } while (parseFloat(getContrastRatio(backgroundColorInput.value, textColorInput.value)) < 4.5);
};
const randomizeText = () => {
    do {
        let randomTextHex = generateHex();
        textColorInput.value = randomTextHex;
    } while (parseFloat(getContrastRatio(backgroundColorInput.value, textColorInput.value)) < 4.5);
};
const randomizeBoth = () => {
    randomizeBackground();
    randomizeText();
};
const updateColors = () => {
    body.style.backgroundColor = backgroundColorInput.value;
    body.style.color = textColorInput.value;
    backgroundColorPalette.style.backgroundColor = backgroundColorInput.value;
    backgroundColorInput.style.color = textColorInput.value;
    textColorPalette.style.backgroundColor = textColorInput.value;
    textColorInput.style.color = textColorInput.value;
};
const updateGradient = () => {
    gradientC1.style.stopColor = backgroundColorInput.value;
    gradientC2.style.stopColor = textColorInput.value;
};
const domEvents = () => {
    updateContrastRatio();
    textColorPalette?.addEventListener("change", pickTextCFromPalette);
    backgroundColorPalette?.addEventListener("change", (e) => pickBackgroundCFromPalette(e));
    textColorInput?.addEventListener("change", (e) => {
        pickTextCFromInput(e);
    });
    randomizeButton?.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-random-background")) {
                randomizeBackground();
            }
            if (e.target.classList.contains("btn-random-text")) {
                randomizeText();
            }
            if (e.target.classList.contains("btn-random-both")) {
                randomizeBoth();
            }
            updateColors();
            updateContrastRatio();
            updateGradient();
        });
    });
    swapButton?.addEventListener("click", () => {
        const temp = backgroundColorInput.value;
        backgroundColorInput.value = textColorInput.value;
        textColorInput.value = temp;
        updateColors();
        updateContrastRatio();
        updateGradient();
    });
};
const main = () => {
    domElements();
    domEvents();
};
// console.log(hexToRgb("#f0defd"));
// console.log(getLuminance({ r: 240, g: 222, b: 253 }));
// console.log(getLuminance({ r: 90, g: 22, b: 203 }));
main();
