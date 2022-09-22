import { DraggableSyntheticListeners } from "@dnd-kit/core";
import React from "react";
import { FC } from "react";
import { ITemplate } from "../utils/types";
import { Handle } from "./Handle";
import { Remove } from "./Remove";

export interface ICropPreviewProps {
  template: ITemplate;
  isActive: boolean;
  imageUrl: string;
  listeners?: DraggableSyntheticListeners;
  handleTemplateClick?: () => void;
  handleDelete?: () => void;
}

const CropPreview: FC<ICropPreviewProps> = ({
  isActive,
  imageUrl,
  listeners,
  handleTemplateClick,
  handleDelete,
}) => {
  return (
    <div
      onClick={handleTemplateClick}
      className={`crop ${isActive ? "active-template" : ""}`}
    >
      <img src={imageUrl} alt="template-preview" />
      <span className="actions">
        {handleDelete ? (
          <Remove className="remove" onClick={handleDelete} />
        ) : null}
        {listeners ? <Handle {...listeners} /> : null}
      </span>
    </div>
  );
};

export default CropPreview;
