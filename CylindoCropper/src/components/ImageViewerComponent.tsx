import React, { FC, useEffect, useState } from "react";
import { createTemplate, cylindoData } from "../utils/CylindoData";
import { buildCylindoUrl } from "../utils/cylindoUrls";
import { Frame, ICropArea, ITemplate } from "../utils/types";
import DropdownComponent from "./DropdownComponent";
import ImageCropper from "./ImageCropper";
import ImageTemplateComponent from "./ImageTemplateComponent";

type Orientation = "landscape" | "portrait" | "square";

export interface IOrientationOption {
  value: Orientation;
  name: string;
  width: number;
  height: number;
  isDefault: boolean;
}

const baseImageSize = 4096;
const aspectRatio = 5 / 7;
const orientations: IOrientationOption[] = [
  {
    value: "landscape",
    name: "Landscape",
    width: baseImageSize,
    height: baseImageSize * aspectRatio,
    isDefault: false,
  },
  {
    value: "portrait",
    name: "Portrait",
    width: baseImageSize * aspectRatio,
    height: baseImageSize,
    isDefault: false,
  },
  {
    value: "square",
    name: "Square",
    width: baseImageSize,
    height: baseImageSize,
    isDefault: true,
  },
];
const defaultTemplate: ITemplate = {
  id: "default",
  frame: "1",
  cropArea: {
    x: 0,
    y: 0,
    width: baseImageSize,
    height: baseImageSize,
  },
};

const presetsData: ITemplate[] = [
  {
    id: "preset-1",
    frame: "1",
    cropArea: { x: 284, y: 284, width: 3532, height: 3532 },
  },
  {
    id: "preset-2",
    frame: "5",
    cropArea: { x: 80, y: 284, width: 3532, height: 3532 },
  },
  {
    id: "preset-3",
    frame: "29",
    cropArea: { x: 444, y: 284, width: 3532, height: 3532 },
  },
  {
    id: "preset-4",
    frame: "17",
    cropArea: { x: 1400, y: 1800, width: 600, height: 600 },
  },
  {
    id: "preset-5",
    frame: "1",
    cropArea: { x: 3367, y: 1621, width: 618 * aspectRatio, height: 618 },
  },
  {
    id: "preset-6",
    frame: "1",
    cropArea: { x: 3428, y: 2382, width: 520 * aspectRatio, height: 520 },
  },
];

const framesData: IFrameOption[] = (() => {
  let framesData = [];
  for (let index = 1; index <= 32; index++) {
    framesData.push({ value: index, name: index });
  }
  return framesData;
})();

interface IFrameOption {
  value: Frame;
  name: Frame;
}

const data = cylindoData();
const { articleId, entityId } = data;
const initialTemplateData = data.templateData;

const ImageViewerComponent: FC = () => {
  const [isValidCylindoProduct, setIsValidCylindoProduct] = useState<
    boolean | undefined
  >();
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [savingState, setSavingState] = useState<"none" | "saving" | "saved">(
    "none"
  );
  const [activeTemplateId, setActiveTemplateId] = useState<
    string | undefined
  >();
  const [templateData, setTemplateData] =
    useState<ITemplate[]>(initialTemplateData);

  useEffect(() => {
    loadIsValidCylindoProduct();
  }, []);

  const loadIsValidCylindoProduct = async () => {
    const response = await fetch(
      buildCylindoUrl(articleId, "1", undefined, 1, 1)
    );
    setIsValidCylindoProduct(response.ok);
  };

  const handleTemplateAdd = () => {
    const template = createTemplate(defaultTemplate);

    setActiveTemplateId(template.id);
    setTemplateData([...templateData, template]);
    setIsDirty(true);
  };

  const handlePresetAdd = (template: ITemplate) => {
    template = createTemplate(template);
    setTemplateData([...templateData, template]);
    setIsDirty(true);
  };

  const handleImageCropChange = (cropArea: ICropArea) => {
    setTemplateData(
      templateData.map((data, index) => {
        if (data.id === activeTemplateId) {
          return {
            ...data,
            cropArea: cropArea,
          };
        }
        return data;
      })
    );
    setIsDirty(true);
  };
  const handleDelete = (id: string) => {
    const index = templateData.findIndex((t) => t.id === id);
    const td = templateData.slice();
    td.splice(index, 1);
    setTemplateData(td);
    setIsDirty(true);
  };
  const handleReorder = (templates: ITemplate[]) => {
    setTemplateData(templates);
    setIsDirty(true);
  };
  const handleDropdownChange = (e) => {
    setTemplateData(
      templateData.map((template, index) => {
        if (template.id === activeTemplateId) {
          if (e.target.name === "frameId") {
            template.frame = e.target.value;
          } else if (e.target.name === "orientationId") {
            const orientation = orientations.find(
              (o) => o.value === e.target.value
            );
            template.cropArea.width = orientation.width;
            template.cropArea.height = orientation.height;
          }
        }
        return template;
      })
    );
    setIsDirty(true);
  };

  const saveApi = () => {
    setSavingState("saving");
    let requestBody = [];
    for (let i = 1; i <= data.maxCrops; i++) {
      const item = templateData[i - 1];
      let cropValue = "";
      let frameValue = "";
      if (item) {
        const { x, y, width, height } = item.cropArea;
        cropValue = `${Math.round(x)},${Math.round(y)},${Math.round(
          width
        )},${Math.round(height)}`;
        frameValue = item.frame;
      }
      requestBody.push(
        {
          fieldTypeId: `ArticleCylindoImage${i}Crop`,
          value: cropValue,
        },
        {
          fieldTypeId: `ArticleCylindoImage${i}Frame`,
          value: frameValue,
        }
      );
    }
    var url = `${process.env.REACT_APP_INRIVER_API_URL}entities/${entityId}/fieldvalues`;
    const headers: HeadersInit = {
      "Content-type": "application/json; charset=UTF-8",
    };
    if (process.env.NODE_ENV !== "production") {
      headers["x-inriver-apikey"] = process.env.REACT_APP_INRIVER_API_KEY;
    }
    const options: RequestInit = {
      method: "PUT",
      credentials:
        process.env.NODE_ENV === "production" ? "include" : undefined,
      headers,
      body: JSON.stringify(requestBody),
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        setIsDirty(false);
        setSavingState("saved");
        setTimeout(() => setSavingState("none"), 3000);
      })
      .catch((err) => {
        console.error(err);
        setSavingState("none");
      });
  };

  const getCurrentTemplate = (): ITemplate | undefined => {
    if (!activeTemplateId) {
      return undefined;
    }

    return templateData.find((t) => t.id === activeTemplateId);
  };

  const getCurrentFrame = (): Frame | undefined => {
    return getCurrentTemplate()?.frame;
  };

  const getCurrentOrientation = (): Orientation | undefined => {
    const currentTemplate = getCurrentTemplate();
    if (!currentTemplate) {
      return;
    }

    if (currentTemplate.cropArea.width > currentTemplate.cropArea.height) {
      return "landscape";
    } else if (
      currentTemplate.cropArea.height > currentTemplate.cropArea.width
    ) {
      return "portrait";
    } else {
      return "square";
    }
  };

  const handleTemplateClick = (id: string) => {
    setActiveTemplateId(id);
  };

  if (isValidCylindoProduct === false) {
    return <p>Please check that Cylindo is enabled for this article.</p>;
  }
  if (typeof isValidCylindoProduct === "undefined") {
    return <p>Loading...</p>;
  }

  const currentTemplate = getCurrentTemplate();
  return (
    <div className="main-content">
      <div className="fixed-top header-bar">
        <button
          type="button"
          className={`btn btn-primary btn-lg btn-save ${
            savingState === "saving" || savingState === "saved"
              ? "btn-loading"
              : ""
          }`}
          onClick={saveApi}
          disabled={!isDirty}
        >
          {savingState === "saving" && (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          )}
          {savingState === "saved" && (
            <div className="loader-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 122.88 109.76"
                width={30}
                height={27}
              >
                <path
                  d="M0 52.88l22.68-.3a84.1 84.1 0 0 1 23.35 19.86C63.49 43.49 83.55 19.77 105.6 0h17.28C92.05 34.25 66.89 70.92 46.77 109.76 36.01 86.69 20.96 67.27 0 52.88h0z"
                  fillRule="evenodd"
                  fill="#ffffff"
                />
              </svg>
            </div>
          )}
          <span className="btn-text">Save</span>
        </button>
      </div>
      <div className="row">
        <div className="crops-panel col-sm-7 py-5">
          <ImageTemplateComponent
            presetsData={presetsData}
            templateData={templateData}
            handleTemplateClick={handleTemplateClick}
            handleTemplateAdd={handleTemplateAdd}
            handlePresetClick={handlePresetAdd}
            activeTemplateId={activeTemplateId}
            handleDelete={handleDelete}
            handleReorder={handleReorder}
            articleId={articleId}
          />
        </div>
        <div className="col-sm-5 py-5">
          {currentTemplate && (
            <div className="row">
              <div className="form-group col-sm-6">
                <label style={{ float: "left" }}>Frame:</label>
                <DropdownComponent
                  data={framesData}
                  selected={getCurrentFrame()}
                  onChange={handleDropdownChange}
                  name="frameId"
                />
              </div>
              <div className="form-group col-sm-6">
                <label style={{ float: "left" }}>Orientation:</label>
                <DropdownComponent
                  data={orientations}
                  selected={getCurrentOrientation()}
                  onChange={handleDropdownChange}
                  name="orientationId"
                />
              </div>
              <div className="form-group col-sm-12">
                <div id="hubble-container" className="hubble-container">
                  <ImageCropper
                    cropArea={getCurrentTemplate().cropArea}
                    frame={getCurrentFrame()}
                    articleId={articleId}
                    baseImageSize={baseImageSize}
                    handleChange={handleImageCropChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageViewerComponent;
