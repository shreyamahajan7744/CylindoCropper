import React, { FC, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { Frame, ICropArea } from "../utils/types";
import { buildCylindoUrl } from "../utils/cylindoUrls";
import { Area, Point, Size } from "react-easy-crop/types";

interface IImageCropperProps {
  cropArea: ICropArea;
  handleChange: (cropArea: ICropArea) => void;
  baseImageSize: number;
  articleId: string;
  frame: Frame;
}

interface IImageCropperState {
  crop: IImageCrop;
  zoom: number;
}

interface IImageCrop {
  x: number;
  y: number;
}

const maxZoom = 20;

const getImageCropperPropertiesFromCropArea = (
  cropArea: ICropArea,
  imageCropperSize: Size,
  baseImageSize: number
): IImageCropperState => {
  const zoom = baseImageSize / Math.max(cropArea.width, cropArea.height);
  const maxCropperSize = Math.max(
    imageCropperSize.width,
    imageCropperSize.height
  );
  const crop: Point = {
    x:
      (0.5 - (cropArea.x + cropArea.width / 2) / baseImageSize) *
      maxCropperSize *
      zoom,
    y:
      (0.5 - (cropArea.y + cropArea.height / 2) / baseImageSize) *
      maxCropperSize *
      zoom,
  };
  return {
    zoom,
    crop,
  };
};

const getCropAreaFromImageCropAndZoom = (
  crop: Point,
  zoom: number,
  imageCropperSize: Size,
  baseImageSize: number
): ICropArea => {
  const aspectRatio = imageCropperSize.width / imageCropperSize.height;
  const wMax = aspectRatio >= 1 ? baseImageSize : baseImageSize * aspectRatio;
  const hMax = aspectRatio <= 1 ? baseImageSize : baseImageSize / aspectRatio;
  const maxCropperSize = Math.max(
    imageCropperSize.width,
    imageCropperSize.height
  );
  const width = wMax / zoom;
  const height = hMax / zoom;
  const x = Math.max(
    (0.5 - crop.x / zoom / maxCropperSize) * baseImageSize - width / 2,
    0
  );
  const y = Math.max(
    (0.5 - crop.y / zoom / maxCropperSize) * baseImageSize - height / 2,
    0
  );
  return {
    x,
    y,
    width,
    height,
  };
};

const ImageCropper: FC<IImageCropperProps> = ({
  cropArea,
  frame,
  articleId,
  baseImageSize,
  handleChange,
}) => {
  const [imageCropperSize, setImageCropperSize] = useState<Size>({
    width: 1,
    height: 1,
  });
  const [imgLoading, setImgLoading] = useState(false);

  const imageUrl = buildCylindoUrl(articleId, frame, undefined, baseImageSize);

  useEffect(() => {
    setImgLoading(true);
  }, [imageUrl]);

  const imgCropperProperties = getImageCropperPropertiesFromCropArea(
    cropArea,
    imageCropperSize,
    baseImageSize
  );

  const onCropChange = (crop: Point) => {
    handleChange(
      getCropAreaFromImageCropAndZoom(
        crop,
        imgCropperProperties.zoom,
        imageCropperSize,
        baseImageSize
      )
    );
  };
  const onZoomChange = (zoom: number) => {
    handleChange(
      getCropAreaFromImageCropAndZoom(
        imgCropperProperties.crop,
        zoom,
        imageCropperSize,
        baseImageSize
      )
    );
  };
  const aspect = cropArea.width / cropArea.height;

  return (
    <div className="image-cropper">
      <div className="crop-container">
        <Cropper
          image={imageUrl}
          maxZoom={maxZoom}
          crop={imgCropperProperties.crop}
          zoom={imgCropperProperties.zoom}
          aspect={aspect}
          onCropChange={onCropChange}
          // onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
          onCropSizeChange={setImageCropperSize}
          onMediaLoaded={() => setImgLoading(false)}
        />
        {imgLoading && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
      <div className="controls">
        <input
          type="range"
          value={imgCropperProperties.zoom}
          min={1}
          max={maxZoom}
          step={0.01}
          aria-labelledby="Zoom"
          onChange={(e) => {
            onZoomChange(parseFloat(e.target.value));
          }}
          className="zoom-range"
        />
      </div>
    </div>
  );
};

export default ImageCropper;
