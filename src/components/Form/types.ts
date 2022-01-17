export interface Process {
  id: number;
  name: string;
  active: boolean;
}

export interface Material {
  id: number;
  processId: number;
  name: string;
  color: Array<string>;
  infill: Array<string>;
  tolerance: Partial<{
    default: number;
    options: Array<number>;
  }>;
  active: boolean;
  isCustom?: boolean;
}

export interface Finish {
  id: number;
  processId: number;
  name: string;
  restrictedMaterials: Array<number>;
  isCustom: boolean;
}

export interface Features {
  processes: Array<Process>;
  materials: Array<Material>;
  finishes: Array<Finish>;
}

export interface Values {
  processId: number;
  materialId?: number;
  finishId?: number;
  quantity: number;
  inserts: number;
  threads: number;
}
