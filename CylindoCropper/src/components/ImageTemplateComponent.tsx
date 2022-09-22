import React, { FC, useState } from "react";
import { buildCylindoUrl } from "../utils/cylindoUrls";
import { ITemplate } from "../utils/types";
import { createTemplate } from "../utils/CylindoData";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SortableCropPreview from "./SortableCropPreview";
import AddIcon from "./AddIcon";

interface IImageTemplateProps {
  templateData: ITemplate[];
  presetsData: ITemplate[];
  articleId: string;
  activeTemplateId: string | undefined;
  handleReorder: (newTemplateData: ITemplate[]) => void;
  handleDelete: (id: string) => void;
  handleTemplateClick: (id: string) => void;
  handleTemplateAdd: () => void;
  handlePresetClick: (template: ITemplate) => void;
}

const thumbnailSize = 200;

// a little function to help us with reordering the result
const reorder = <T extends unknown>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const ImageTemplateComponent: FC<IImageTemplateProps> = ({
  handleDelete,
  handleTemplateClick,
  handleTemplateAdd,
  handlePresetClick,
  handleReorder,
  templateData,
  presetsData,
  activeTemplateId,
  articleId,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [activeId, setActiveId] = useState(null);

  const handleDragStart = (event) => {
    const { active } = event;

    setActiveId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = templateData.findIndex((t) => t.id === active.id);
      const newIndex = templateData.findIndex((t) => t.id === over.id);

      handleReorder(arrayMove(templateData, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  const draggingTemplate = templateData.find((t) => t.id === activeId);

  return (
    <div className="row">
      <div className="col-sm-10 offset-sm-1 mb-5">
        <h2 className="text-left">Selected crops</h2>
        <div className="crop-previews">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragCancel={() => setActiveId(null)}
          >
            <SortableContext items={templateData}>
              {templateData.map((template) => {
                return (
                  <SortableCropPreview
                    key={template.id}
                    isActive={template.id === activeTemplateId}
                    template={template}
                    handleTemplateClick={() => handleTemplateClick(template.id)}
                    handleDelete={() => handleDelete(template.id)}
                    imageUrl={buildCylindoUrl(
                      articleId,
                      template.frame,
                      template.cropArea,
                      thumbnailSize,
                      4
                    )}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
          <div className="add-crop crop" onClick={() => handleTemplateAdd()}>
            <div>
              <AddIcon />
              <div>Add new crop</div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-10 offset-sm-1">
        <h3 className="text-left">Preset crops</h3>
        <div className="crop-previews">
          {presetsData.map((preset, key) => {
            return (
              <div key={key} className="preset">
                <div className="crop">
                  <img
                    src={buildCylindoUrl(
                      articleId,
                      preset.frame,
                      preset.cropArea,
                      thumbnailSize,
                      4
                    )}
                    width="auto"
                    alt=""
                  />
                  <button
                    type="button"
                    className="btn btn-lg position-absolute"
                    onClick={() => {
                      handlePresetClick(preset);
                    }}
                  >
                    <AddIcon />
                    <div>Add this preset</div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ImageTemplateComponent;
