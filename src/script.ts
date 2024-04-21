let backgroundColorInput: HTMLInputElement | null;
let textColorInput: HTMLInputElement | null;
let textColorPalette: HTMLInputElement | null;
let backgroundColorPalette: HTMLInputElement | null;
let body: HTMLBodyElement | null;

const domElements = () => {
  backgroundColorInput = document.querySelector("#backgroundColorInput");
  textColorInput = document.querySelector("#textColorInput");
  textColorPalette = document.querySelector("#textColorPicker");
  backgroundColorPalette = document.querySelector("#backgroundColorPicker");
  body = document.querySelector("body");
};

const pickTextCFromPalette = () => {
  textColorPalette?.addEventListener("change", (e: any) => {
    console.log(e.target.value);
    e.target.style.background = e.target.value;
    // backgroundColorInput?.setAttribute("value", e.target.value);
    textColorInput?.setAttribute("value", e.target.value);
    if (body) {
      body.style.color = e.target.value;
    }
    if (backgroundColorInput) {
      backgroundColorInput.style.color = e.target.value;
    }
    if (textColorInput) {
      textColorInput.style.color = e.target.value;
    }
  });
};
const pickBackgroundCFromPalette = (e: any) => {
  console.log(e.target.value);
  e.target.style.background = e.target.value;
  textColorInput?.setAttribute("value", e.target.value);
  if (body) {
    body.style.backgroundColor = e.target.value;
  }
};
const pickTextCFromInput = (e: any) => {
  console.log(e.target.value);
  textColorInput?.setAttribute("value", e.target.value);
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

const domEvents = () => {
  if (textColorPalette) {
    textColorPalette.style.background = "#eeecf2";
  }
  if (backgroundColorPalette) {
    backgroundColorPalette.style.background = "#55505b";
  }
  textColorPalette?.addEventListener("change", pickTextCFromPalette);
  backgroundColorPalette?.addEventListener("change", (e: any) =>
    pickBackgroundCFromPalette(e)
  );
  textColorInput?.addEventListener("change", pickTextCFromInput);
};

const main = () => {
  domElements();
  domEvents();
};

// console.log(hexToRgb("#f0defd"));
// console.log(getLuminance({ r: 240, g: 222, b: 253 }));
// console.log(getLuminance({ r: 90, g: 22, b: 203 }));

main();
