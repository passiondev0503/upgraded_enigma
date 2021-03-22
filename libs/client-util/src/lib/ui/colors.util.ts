const maxColorHexLength = 7;
const maxNumericColorValue = 256;
const radix = 16;

export const getRandomColor = () => {
  const c = () => Math.floor(Math.random() * maxNumericColorValue).toString(radix);
  let colorHEX = '#' + c() + c() + c();
  if (colorHEX.length < maxColorHexLength) {
    colorHEX += 'c';
  }
  return colorHEX;
};
