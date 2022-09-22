import { Frame, ICropArea, ISize } from "./types";

const cylindoBaseUrl = process.env.REACT_APP_CYLINDO_API_URL_PREFIX;

export const buildCylindoUrl = (
  articleId: string,
  frame: Frame,
  crop?: ICropArea,
  size?: number,
  zoom: 1 | 2 | 4 = 4,
  encoding: string = "png"
): string => {
  let sizeParam = "";
  if (size) {
    if (crop) {
      const w = Math.round(
        crop.width >= crop.height ? size : (crop.width / crop.height) * size
      );
      const h = Math.round(
        crop.height >= crop.width ? size : (crop.height / crop.width) * size
      );
      sizeParam = `&size=(${w},${h})`;
    } else {
      sizeParam = `&size=(${size},${size})`;
    }
  }
  const cropParam = crop
    ? `&crop=(${applyZoomScaling(crop.x, zoom)},${applyZoomScaling(
        crop.y,
        zoom
      )},${applyZoomScaling(crop.width, zoom)},${applyZoomScaling(
        crop.height,
        zoom
      )})`
    : "";
  return `${cylindoBaseUrl}products/${articleId}/frames/${frame}/?${sizeParam}${cropParam}&zoom=${zoom}k&encoding=${encoding}`;
};

const applyZoomScaling = (value: number, zoom: number) => {
  const zoomFactor = zoom / 4;
  return Math.round(value * zoomFactor);
};
