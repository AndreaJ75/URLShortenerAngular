import { Injectable } from '@angular/core';
import {SortableColumn} from '../sortable-column';

@Injectable({
  providedIn: 'root'
})
export class CustomSortingService {

  column: SortableColumn;
  constructor() { }

  public getSortableColumn(sortableColumns: SortableColumn[]): SortableColumn {

    sortableColumns.forEach(sortableColumn => {
        if (sortableColumn.direction != null) {
          this.column = sortableColumn;
        } else {
          this.column.direction = 'desc';
          this.column.name = 'expirationDate';
          this.column.title = 'Expiration Date';
        }
      }
    );
    return this.column;
  }

  public clearPreviousSorting(chosenColumn: SortableColumn, sortableColumns: SortableColumn[]) {
    sortableColumns.filter(
      column => column !== chosenColumn
    ).forEach(
      column => column.direction = null
    );
  }
}
