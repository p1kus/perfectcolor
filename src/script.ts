import generateHex from "./generateHex.js";

const domElements = () => {
  const contrastRatioHeader = document.querySelector(
    "#contrastRatioHeader"
  ) as HTMLHeadingElement;
  if (!contrastRatioHeader) {
    console.error("Contrast ratio header not found");
  }
  const backgroundColorInput = document.querySelector(
    "#backgroundColorInput"
  ) as HTMLInputElement;
  if (!backgroundColorInput) {
    console.error("backgroundColorInput not found");
  }
  const textColorInput = document.querySelector(
    "#textColorInput"
  ) as HTMLInputElement;
  if (!textColorInput) {
    console.error("textColorInput not found");
  }
  const textColorPalette = document.querySelector(
    "#textColorPicker"
  ) as HTMLInputElement;
  if (!textColorPalette) {
    console.error("Element not found");
  }
  const backgroundColorPalette = document.querySelector(
    "#backgroundColorPicker"
  ) as HTMLInputElement;
  if (!backgroundColorPalette) {
    console.error("Element not found");
  }
  const randomizeButton = document.querySelectorAll("svg") as NodeList;
  if (!randomizeButton) {
    console.error("Element not found");
  }
  const swapButton = document.querySelector("#btn-swap") as HTMLButtonElement;
  if (!swapButton) {
    console.error("Element not found");
  }
  const body = document.querySelector("body") as HTMLBodyElement;
  if (!body) {
    console.error("Element not found");
  }
  const gradientC1 = document.querySelector("#stop1") as SVGStopElement;
  if (!gradientC1) {
    console.error("Element not found");
  }
  const gradientC2 = document.querySelector("#stop2") as SVGStopElement;
  if (!gradientC2) {
    console.error("Element not found");
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

const {
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
} = domElements();

const pickTextCFromPalette = (e: any) => {
  e.target.style.background = e.target.value;
  textColorInput!.value = e.target.value;
  updateColors();
  updateContrastRatio();
  updateGradient();
};
const pickBackgroundCFromPalette = (e: any) => {
  backgroundColorInput!.value = e.target.value;
  updateColors();
  updateContrastRatio();
  updateGradient();
};
const pickTextCFromInput = (e: any) => {
  textColorPalette!.value = e.target.value;
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

const randomizeBackground = () => {
  do {
    let randomBackgroundHex = generateHex();
    backgroundColorInput!.value = randomBackgroundHex;
    backgroundColorPalette.style.backgroundColor = randomBackgroundHex;
  } while (
    parseFloat(
      getContrastRatio(backgroundColorInput!.value, textColorInput!.value)
    ) < 4.5
  );
};
const randomizeText = () => {
  do {
    let randomTextHex = generateHex();
    textColorInput!.value = randomTextHex;
  } while (
    parseFloat(
      getContrastRatio(backgroundColorInput!.value, textColorInput!.value)
    ) < 4.5
  );
};

const randomizeBoth = () => {
  randomizeBackground();
  randomizeText();
};

const updateColors = () => {
  body!.style.backgroundColor = backgroundColorInput!.value;
  body!.style.color = textColorInput!.value;
  backgroundColorPalette.style.backgroundColor = backgroundColorInput!.value;
  backgroundColorPalette.style.borderColor = textColorInput!.value;
  backgroundColorInput!.style.color = textColorInput!.value;
  textColorPalette!.style.backgroundColor = textColorInput!.value;
  textColorPalette!.style.borderColor = textColorInput!.value;
  textColorInput!.style.color = textColorInput!.value;
};

const updateGradient = () => {
  gradientC1.style.stopColor = backgroundColorInput!.value;
  gradientC2.style.stopColor = textColorInput!.value;
};

const domEvents = () => {
  updateContrastRatio();
  textColorPalette?.addEventListener("change", pickTextCFromPalette);
  backgroundColorPalette?.addEventListener("change", (e: any) =>
    pickBackgroundCFromPalette(e)
  );
  textColorInput?.addEventListener("change", (e) => {
    pickTextCFromInput(e);
  });
  randomizeButton?.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if ((e.target as Element).classList.contains("btn-random-background")) {
        randomizeBackground();
      }
      if ((e.target as Element).classList.contains("btn-random-text")) {
        randomizeText();
      }
      if ((e.target as Element).classList.contains("btn-random-both")) {
        randomizeBoth();
      }
      updateColors();
      updateContrastRatio();
      updateGradient();
    });
  });
  swapButton?.addEventListener("click", () => {
    const temp = backgroundColorInput!.value;
    backgroundColorInput!.value = textColorInput!.value;
    textColorInput!.value = temp;
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
