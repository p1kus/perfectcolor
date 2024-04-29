import generateHex from "./generateHex.js";
let backgroundColorInput;
let textColorInput;
let textColorPalette;
let backgroundColorPalette;
let body;
let contrastRatioHeader;
let randomizeButton;
let swapButton;
const domElements = () => {
    contrastRatioHeader = document.querySelector("#contrastRatioHeader");
    backgroundColorInput = document.querySelector("#backgroundColorInput");
    textColorInput = document.querySelector("#textColorInput");
    textColorPalette = document.querySelector("#textColorPicker");
    backgroundColorPalette = document.querySelector("#backgroundColorPicker");
    randomizeButton = document.querySelectorAll("svg");
    swapButton = document.querySelector("#btn-swap");
    body = document.querySelector("body");
};
const pickTextCFromPalette = (e) => {
    e.target.style.background = e.target.value;
    textColorInput.setAttribute("value", e.target.value);
    if (body) {
        body.style.color = e.target.value;
    }
    if (backgroundColorInput) {
        backgroundColorInput.style.color = e.target.value;
    }
    if (textColorInput) {
        textColorInput.style.color = e.target.value;
    }
    updateContrastRatio();
};
const pickBackgroundCFromPalette = (e) => {
    e.target.style.background = e.target.value;
    backgroundColorInput.value = e.target.value;
    if (body) {
        body.style.backgroundColor = e.target.value;
    }
};
const pickTextCFromInput = (e) => {
    console.log(e.target.value);
    textColorPalette.value = e.target.value;
    if (body) {
        body.style.color = e.target.value;
    }
    if (backgroundColorInput) {
        backgroundColorInput.style.color = e.target.value;
    }
    if (textColorInput) {
        textColorInput.style.color = e.target.value;
    }
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
const updateTextC = (e) => {
    textColorInput.value = e.target.value;
    body.style.color = e.target.value;
    updateContrastRatio();
};
const domEvents = () => {
    if (textColorPalette) {
        textColorPalette.style.background = textColorInput.value;
    }
    if (backgroundColorPalette) {
        backgroundColorPalette.style.background = backgroundColorInput.value;
    }
    textColorPalette?.addEventListener("change", pickTextCFromPalette);
    backgroundColorPalette?.addEventListener("change", (e) => pickBackgroundCFromPalette(e));
    textColorInput?.addEventListener("change", (e) => {
        pickTextCFromInput(e);
        updateTextC(e);
    });
    randomizeButton?.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            if (e.target.classList.value.indexOf("btn-random-background") !== -1) {
                let randomBackgroundHex = generateHex();
                backgroundColorInput.value = randomBackgroundHex;
                body.style.backgroundColor = randomBackgroundHex;
            }
            else if (e.target.classList.value.indexOf("btn-random-text") !== -1) {
                let randomTextHex = generateHex();
                textColorInput.value = randomTextHex;
                body.style.color = randomTextHex;
            }
            updateContrastRatio();
        });
    });
    swapButton?.addEventListener("click", () => {
        const temp = backgroundColorInput.value;
        backgroundColorInput.value = textColorInput.value;
        textColorInput.value = temp;
        body.style.backgroundColor = backgroundColorInput.value;
        body.style.color = textColorInput.value;
        updateContrastRatio();
    });
    body?.addEventListener("change", updateContrastRatio);
};
const main = () => {
    domElements();
    domEvents();
};
// console.log(hexToRgb("#f0defd"));
// console.log(getLuminance({ r: 240, g: 222, b: 253 }));
// console.log(getLuminance({ r: 90, g: 22, b: 203 }));
main();
