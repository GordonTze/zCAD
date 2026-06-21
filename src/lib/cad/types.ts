// CAD Kernel - Type definitions for parametric modeling

export type WorkspaceType = 'part' | 'assembly' | 'drawing' | 'simulation';
export type ViewMode = 'shaded' | 'wireframe' | 'shaded-with-edges' | 'section' | 'transparent';

// Sketch entities
export type SketchEntityType =
  | 'line'
  | 'circle'
  | 'arc'
  | 'rectangle'
  | 'polygon'
  | 'spline'
  | 'ellipse'
  | 'slot'
  | 'point'
  | 'centerline';

export interface Point2D { x: number; y: number; }

export interface SketchEntity {
  id: string;
  type: SketchEntityType;
  construction: boolean;
  params: Record<string, number | Point2D[]>;
  color?: string;
}

export type ConstraintType =
  | 'coincident'
  | 'parallel'
  | 'perpendicular'
  | 'tangent'
  | 'equal'
  | 'symmetric'
  | 'horizontal'
  | 'vertical'
  | 'fixed'
  | 'concentric'
  | 'midpoint';

export interface Constraint {
  id: string;
  type: ConstraintType;
  entities: string[];
  params?: Record<string, number>;
}

export type DimensionType = 'linear' | 'angular' | 'radial' | 'diameter';
export interface Dimension {
  id: string;
  type: DimensionType;
  entityId: string;
  value: number;
  driven: boolean;
  expression?: string;
}

export interface Sketch {
  id: string;
  name: string;
  plane: 'xy' | 'xz' | 'yz';
  entities: SketchEntity[];
  constraints: Constraint[];
  dimensions: Dimension[];
  fullyDefined: boolean;
}

export type FeatureType =
  | 'sketch'
  | 'extrude'
  | 'revolve'
  | 'sweep'
  | 'loft'
  | 'shell'
  | 'draft'
  | 'fillet'
  | 'chamfer'
  | 'mirror'
  | 'pattern-linear'
  | 'pattern-circular'
  | 'boolean-union'
  | 'boolean-subtract'
  | 'boolean-intersect'
  | 'hole'
  | 'rib'
  | 'plane'
  | 'axis';

export type FeatureStatus = 'regenerated' | 'stale' | 'failed' | 'suppressed';

export interface Feature {
  id: string;
  type: FeatureType;
  name: string;
  visible: boolean;
  suppressed: boolean;
  status: FeatureStatus;
  parameters: Record<string, number | string | boolean | string[]>;
  sketchId?: string;
  error?: string;
  createdAt: number;
}

export interface ParametricParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  expression?: string;
  comment?: string;
}

export interface Part {
  id: string;
  name: string;
  partNumber: string;
  material: string;
  color: string;
  features: Feature[];
  sketches: Sketch[];
  parameters: ParametricParameter[];
  mass: number;
  volume: number;
  surfaceArea: number;
  bbox: { min: [number, number, number]; max: [number, number, number] };
}

export type MateType = 'revolute' | 'slider' | 'ball' | 'cylindrical' | 'planar' | 'fixed' | 'gear' | 'rack-pinion';

export interface Mate {
  id: string;
  name: string;
  type: MateType;
  partA: string;
  partB: string;
  offset: number;
  limits?: { min: number; max: number };
  enabled: boolean;
}

export interface AssemblyInstance {
  id: string;
  partId: string;
  name: string;
  transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
  };
  visible: boolean;
  explodedOffset: [number, number, number];
}

export interface Assembly {
  id: string;
  name: string;
  instances: AssemblyInstance[];
  mates: Mate[];
  exploded: boolean;
  explodedFactor: number;
}

export interface DrawingSheet {
  id: string;
  name: string;
  size: 'A4' | 'A3' | 'A2' | 'A1' | 'A0';
  orientation: 'portrait' | 'landscape';
  scale: string;
  views: DrawingView[];
  dimensions: DrawingDimension[];
  annotations: DrawingAnnotation[];
  bom: BOMItem[];
  titleBlock: TitleBlock;
}

export interface DrawingView {
  id: string;
  name: string;
  type: 'iso' | 'front' | 'top' | 'right' | 'section' | 'detail' | 'auxiliary';
  position: { x: number; y: number };
  scale: number;
  partId: string;
  sectionLine?: { start: Point2D; end: Point2D };
}

export interface DrawingDimension {
  id: string;
  type: DimensionType;
  value: string;
  position: Point2D;
  tolerance?: string;
}

export interface DrawingAnnotation {
  id: string;
  type: 'note' | 'gdnt' | 'surface-finish' | 'weld' | 'leader';
  text: string;
  position: Point2D;
}

export interface BOMItem {
  id: string;
  itemNo: number;
  partNumber: string;
  description: string;
  qty: number;
  material: string;
  mass: number;
}

export interface TitleBlock {
  company: string;
  title: string;
  drawnBy: string;
  checkedBy: string;
  approvedBy: string;
  date: string;
  scale: string;
  size: string;
  drawingNumber: string;
  revision: string;
}

export type SimulationType = 'static-stress' | 'thermal' | 'modal' | 'buckling' | 'fatigue' | 'fluid';
export type SimulationStatus = 'idle' | 'meshing' | 'running' | 'completed' | 'failed';

export interface SimulationStudy {
  id: string;
  name: string;
  type: SimulationType;
  status: SimulationStatus;
  material: string;
  meshSize: number;
  elementCount: number;
  loads: Load[];
  fixtures: Fixture[];
  results?: SimulationResults;
  progress: number;
}

export interface Load {
  id: string;
  type: 'force' | 'pressure' | 'torque' | 'gravity' | 'thermal';
  magnitude: number;
  direction?: [number, number, number];
  faceId?: string;
}

export interface Fixture {
  id: string;
  type: 'fixed' | 'sliding' | 'hinge';
  faceId?: string;
}

export interface SimulationResults {
  maxStress: number;
  minStress: number;
  maxDisplacement: number;
  safetyFactor: number;
  mass: number;
  heatmap: 'stress' | 'displacement' | 'strain';
}

export interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string;
  cursor?: { x: number; y: number };
  selection?: string;
  active: boolean;
  editingFeature?: string;
}

export interface VersionEntry {
  id: string;
  timestamp: number;
  author: string;
  message: string;
  parentId: string;
  branch: string;
}

export type ToolId =
  | 'select'
  | 'sketch-line'
  | 'sketch-rectangle'
  | 'sketch-circle'
  | 'sketch-arc'
  | 'sketch-polygon'
  | 'sketch-spline'
  | 'sketch-slot'
  | 'sketch-point'
  | 'sketch-construction'
  | 'dim-linear'
  | 'dim-angular'
  | 'dim-radial'
  | 'dim-diameter'
  | 'feature-extrude'
  | 'feature-revolve'
  | 'feature-sweep'
  | 'feature-loft'
  | 'feature-fillet'
  | 'feature-chamfer'
  | 'feature-shell'
  | 'feature-draft'
  | 'feature-mirror'
  | 'feature-pattern-linear'
  | 'feature-pattern-circular'
  | 'feature-hole'
  | 'boolean-union'
  | 'boolean-subtract'
  | 'boolean-intersect'
  | 'measure'
  | 'section-plane'
  | 'camera-orbit'
  | 'camera-pan'
  | 'camera-zoom'
  | 'camera-fit';
