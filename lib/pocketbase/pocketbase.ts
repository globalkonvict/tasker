import PocketBase from "pocketbase";
import { PB_URL } from "../conts";
import { SortOrder } from "antd/es/table/interface";

const pb = new PocketBase(PB_URL);

type ParamsType = {
  [key: string]: any;
};

type FieldConfig = {
  type: "string" | "number" | "date";
  range?: boolean;
};

const fieldConfigs: { [key: string]: FieldConfig } = {
  title: { type: "string" },
  status: { type: "string" },
  assignedTo: { type: "string" },
  startDate: { type: "date", range: true },
  endDate: { type: "date", range: true },
};

/**
 * Generates the filter string for querying pocketbase
 * @param params
 * @returns pocketbase filter string
 */
export function generatePBFilter<T extends ParamsType>(
  params: Partial<T>
): string {
  const filters: string[] = [];

  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      const config = fieldConfigs[key];
      if (config) {
        switch (config.type) {
          case "string":
          case "number":
            filters.push(`${key}='${params[key]}'`);
            break;
          case "date":
            if (config.range) {
              if (key === "startDate") {
                filters.push(`${key} >= '${params[key]}T00:00:00.000Z'`);
              } else if (key === "endDate") {
                filters.push(`${key} <= '${params[key]}T00:00:00.000Z'`);
              }
            } else {
              filters.push(`${key}='${params[key]}'`);
            }
            break;
        }
      }
    }
  }

  return filters.join(" && ");
}

/**
 * Generates the sort string
 * @param sort
 */
export function generatePBSort(sort: Record<string, SortOrder>) {
  const sortStr = Object.entries(sort).reduce((prev, [k, v]) => {
    const order = v === "ascend" ? "+" : "-";
    prev += `${order}${k}`;
    return prev;
  }, "");
  return sortStr;
}

export default pb;
