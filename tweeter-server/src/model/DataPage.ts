export class DataPage<T> {
   values: T[];
   hasMorePages: boolean;

   constructor(values: T[], hasMorePages: boolean) {
      this.values = values;
      this.hasMorePages = hasMorePages;
   }
}