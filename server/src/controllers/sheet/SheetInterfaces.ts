export interface StatusInterface {
  name: string;
  type: string;
  value: Array<{
    name: string;
    color: string;
    current: number;
    limit: number;
  }>;
}

export interface SkillsInterface {
  name: string;
  type: string;
  limitOfPoints: number;
  value: Array<{
    name: string;
    value: number;
    modifier?: number;
  }>;
}

export interface InventoryInterface {
  name: string;
  type: string;
  value: Array<{
    name: string;
    image?: string;
    description?: string;
  }>;
}

export interface ListInterface {
  name: string;
  type: string;
  value: Array<string>;
}

export interface SubListInterface {
  name: string;
  type: string;
  value: Array<{
    title: string;
    value: Array<any>;
  }>;
}

export interface NumList {
  name: string;
  type: string;
  value: Array<{
    name: string;
    value: number;
  }>;
}

export interface NameListInterface {
  name: string;
  type: string;
  value: Array<{
    name: string;
    value: string;
  }>;
}

export interface MultiSelectListInterface {
  name: string;
  type: string;
  value: Array<{
    name: string;
    isSelected: boolean;
  }>;
}

export interface TextAreaInterface {
  name: string;
  type: string;
  value: string;
}

export interface NumListLimitInterface {
  name: string;
  type: string;
  value: Array<{
    current: number;
    limit: number;
  }>;
}

export interface TableInterface {
  name: string;
  type: string;
  columns: Array<{
    name: string;
    type: string;
  }>;
  value: Array<any>;
}
