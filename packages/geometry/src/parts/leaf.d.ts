import type { TransferGeometry, Vec2 } from "@plantarium/types";
export default function (shape: Vec2[], { res, xCurvature, yCurvature }?: {
    res?: number;
    xCurvature?: number;
    yCurvature?: number;
}): TransferGeometry;
