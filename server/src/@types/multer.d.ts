declare namespace Express{
  declare namespace Multer{
    export interface File{
      key: string;
      location?: string;
    }
  }
}