import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { Page } from '../../../pagination/page';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html'
})
export class CustomPaginationComponent implements OnInit {
  @Input() page: Page<any>;
  @Output() nextPageEvent = new EventEmitter();
  @Output() previousPageEvent = new EventEmitter();
  @Output() pageSizeEvent: EventEmitter<number> = new EventEmitter<number>();

  pageSizeForm;
  constructor(private formBuilder: FormBuilder) {
    this.pageSizeForm = this.formBuilder.group(
      {
        pageSize : ''
      }
    );
  }

  ngOnInit() {
  }

  nextPage(): void {
    this.nextPageEvent.emit(null);
  }

  previousPage(): void {
    this.previousPageEvent.emit(null);
  }

  updatePageSize(pageSize: number): void {
    this.pageSizeEvent.emit(pageSize);
  }
}
