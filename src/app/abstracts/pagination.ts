import {isNullOrUndefined} from "util";

export class Pagination {
  currentPage: number;
  itemsPerPage: number;
  lastPage: boolean;

  public loadMoreRecords(records, loadMoreFunction) {
    if (!isNullOrUndefined(records) && records.length > 0) {
      const totalSize = records.length;
      const nextStart = this.currentPage * this.itemsPerPage;

      if (nextStart < totalSize) {
        const nextEnd = (this.currentPage + 1) * this.itemsPerPage;
        loadMoreFunction(records, nextStart, nextEnd);
        this.currentPage = this.currentPage + 1;

        this.lastPage = (this.currentPage * this.itemsPerPage) > totalSize;
      }
    }
  }
}
