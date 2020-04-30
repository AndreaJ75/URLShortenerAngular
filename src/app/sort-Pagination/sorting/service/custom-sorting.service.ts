import { Injectable } from '@angular/core';
import {SortableColumn} from '../sortable-column';

@Injectable({
  providedIn: 'root'
})
export class CustomSortingService {

  column: SortableColumn;
  constructor() { }

  public getSortableColumn(sortableColumns: SortableColumn[]): SortableColumn {

    sortableColumns.forEach(column => {
        if (column.direction != null) {
          this.column = column;
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
