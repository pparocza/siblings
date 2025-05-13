import { IS_MeshVisualizer } from "./IS_MeshVisualizer.js";
import { IS_WireFrameVisualizer } from "./IS_WireFrameVisualizer.js";
import { IS_BufferGeometryVisualizer } from "./IS_BufferGeometryVisualizer.js";
import { IS_LineVisualizer } from "./IS_LineVisualizer.js";
import { IS_NetworkVisualizer } from "./IS_NetworkVisualizer.js"

export const Mesh = new IS_MeshVisualizer();
export const WireFrame = IS_WireFrameVisualizer;
export const BufferGeometry = IS_BufferGeometryVisualizer;
export const Line = IS_LineVisualizer;
export const Network = IS_NetworkVisualizer;