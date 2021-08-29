export interface GenericBlock {
  id: string;
  name: string;
  type: string;
  value: Array<{ name?: string }>;
}

export interface SubListItem {
  id?: string;
  title?: string;
  value: Array<FieldSubListInterface>;
}

export interface SubListInterface {
  id: string;
  name: string;
  type: string;
  value: Array<SubListItem>;
}

interface FieldSubListInterface {
  name: string;
  type: string;
  value: number | string | Array<any>;
}

export interface TableInterface {
  id: string;
  name: string;
  type: string;
  columns?: Array<{
    name: string;
    type: string;
  }>;
  value: Array<any>;
}
