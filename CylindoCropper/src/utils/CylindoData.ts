import { TestData } from "./testData";
import { ITemplate } from "./types";
import { v4 as uuidv4 } from "uuid";

declare global {
  /* tslint:disable */
  interface Window {
    /* tslint:enable */
    data: any;
  }
}

export function createTemplate(template?: ITemplate): ITemplate {
  return { ...template, id: uuidv4() };
}

export function cylindoData(): {
  templateData: ITemplate[];
  entityId: string;
  articleId: string;
  maxCrops: number;
} {
  if (!window.data) {
    window.data = TestData().data;
  }

  var cylindoData = window.data;
  let templateData: ITemplate[] = [];
  Object.keys(cylindoData[0].fields).forEach((fieldId) => {
    const regex = /articleCylindoImage(\d+)(Frame|Crop)/;
    const result = regex.exec(fieldId);
    if (!result) {
      return;
    }

    const value = cylindoData[0].fields[fieldId].value;
    const count = Number(result[1]) - 1;
    templateData[count] = templateData[count] || createTemplate();
    if (result[2] === "Frame") {
      templateData[count].frame = value;
    } else if (result[2] === "Crop") {
      const [x, y, width, height] = value.split(",").map((v) => parseFloat(v));
      templateData[count].cropArea = {
        x,
        y,
        width,
        height,
      };
    }
  });
  const maxCrops = templateData.length;
  templateData = templateData.filter((t) => t.frame);

  const articleId = cylindoData[0].fields.articleArticleId?.value;
  const entityId = window.data[0].id;
  return { templateData, entityId, articleId, maxCrops };
}
