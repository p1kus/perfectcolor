import generateHex from "./generateHex.js";

let backgroundColorInput: HTMLInputElement;
let textColorInput: HTMLInputElement;
let textColorPalette: HTMLInputElement;
let backgroundColorPalette: HTMLInputElement;
let body: HTMLBodyElement;
let contrastRatioHeader: HTMLHeadingElement;
let randomizeButton: NodeList;
let swapButton: HTMLButtonElement;

//

const domElements = () => {
  contrastRatioHeader = document.querySelector(
    "#contrastRatioHeader"
  ) as HTMLHeadingElement;
  if (contrastRatioHeader === null) {
    console.error("Element not found");
  }
  backgroundColorInput = document.querySelector(
    "#backgroundColorInput"
  ) as HTMLInputElement;
  if (!backgroundColorInput) {
    console.error("Element not found");
  }
  textColorInput = document.querySelector(
    "#textColorInput"
  ) as HTMLInputElement;
  if (!textColorInput) {
    console.error("Element not found");
  }
  textColorPalette = document.querySelector(
    "#textColorPicker"
  ) as HTMLInputElement;
  if (!textColorPalette) {
    console.error("Element not found");
  }
  backgroundColorPalette = document.querySelector(
    "#backgroundColorPicker"
  ) as HTMLInputElement;
  if (!backgroundColorPalette) {
    console.error("Element not found");
  }
  randomizeButton = document.querySelectorAll("svg") as NodeList;
  if (!randomizeButton) {
    console.error("Element not found");
  }
  swapButton = document.querySelector("#btn-swap") as HTMLButtonElement;
  if (!swapButton) {
    console.error("Element not found");
  }
  body = document.querySelector("body") as HTMLBodyElement;
  if (!body) {
    console.error("Element not found");
  }
};

const pickTextCFromPalette = (e: any) => {
  console.log(e.target);
  e.target.style.background = e.target.value;
  textColorInput!.setAttribute("value", e.target.value);
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
const pickBackgroundCFromPalette = (e: any) => {
  e.target.style.background = e.target.value;
  backgroundColorInput!.value = e.target.value;
  if (body) {
    body.style.backgroundColor = e.target.value;
  }
};
const pickTextCFromInput = (e: any) => {
  console.log(e.target.value);
  textColorPalette!.value = e.target.value;
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

const getContrastRatio = (hex1: string, hex2: string) => {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const lum1: number = getLuminance(rgb1);
  const lum2: number = getLuminance(rgb2);

  const contrastRatio =
    (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

  return contrastRatio.toFixed(2);
};

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const getLuminance = (rgb: any) => {
  const sRGB = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  let lRGB: number[] = sRGB.map((channel: number) => {
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lRGB[0] + 0.7152 * lRGB[1] + 0.0722 * lRGB[2];
};

const updateContrastRatio = () => {
  if (contrastRatioHeader) {
    contrastRatioHeader.textContent = `Contrast Ratio: ${getContrastRatio(
      backgroundColorInput!.value,
      textColorInput!.value
    )}`;
  }
};

const updateTextC = (e: any) => {
  textColorInput!.value = e.target.value;
  body!.style.color = e.target.value;
  updateContrastRatio();
};

const domEvents = () => {
  if (textColorPalette) {
    textColorPalette.style.background = textColorInput!.value;
  }
  if (backgroundColorPalette) {
    backgroundColorPalette.style.background = backgroundColorInput!.value;
  }
  textColorPalette?.addEventListener("change", pickTextCFromPalette);
  backgroundColorPalette?.addEventListener("change", (e: any) =>
    pickBackgroundCFromPalette(e)
  );
  textColorInput?.addEventListener("change", (e) => {
    pickTextCFromInput(e);
    updateTextC(e);
  });
  randomizeButton?.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (
        (e.target as Element).classList.value.indexOf(
          "btn-random-background"
        ) !== -1
      ) {
        let randomBackgroundHex = generateHex();
        backgroundColorInput!.value = randomBackgroundHex;
        body!.style.backgroundColor = randomBackgroundHex;
        backgroundColorPalette.style.backgroundColor = randomBackgroundHex;
      } else if (
        (e.target as Element).classList.value.indexOf("btn-random-text") !== -1
      ) {
        let randomTextHex = generateHex();
        textColorInput!.value = randomTextHex;
        body!.style.color = randomTextHex;
        textColorPalette.style.backgroundColor = randomTextHex;
        textColorInput!.style.color = randomTextHex;
        backgroundColorInput!.style.color = randomTextHex;
      }

      updateContrastRatio();
    });
  });
  swapButton?.addEventListener("click", () => {
    const temp = backgroundColorInput!.value;
    backgroundColorInput!.value = textColorInput!.value;
    textColorInput!.value = temp;
    body!.style.backgroundColor = backgroundColorInput!.value;
    body!.style.color = textColorInput!.value;
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
