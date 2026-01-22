import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  @Input() data: any[] | null = [];
  @Input() headers: string[] = [];
  @Input() meta: any = null;
  @Input() loading: boolean = false;
  @Input() minWidth: string = 'min-w-[1000px]';

  @Output() pageChange = new EventEmitter<number>();
  @Output() rowClick = new EventEmitter<any>();

  // This allows the parent to send a custom template for rows
  @ContentChild('rowTemplate') rowTemplate!: TemplateRef<any>;

  onPageChange(page: number) {
    if (page >= 1 && page <= this.meta?.totalPages) {
      this.pageChange.emit(page);
    }
  }

  // Reuse your logic from before
  getVisiblePages(current: number, total: number): number[] {
    const maxVisible = 5;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }
}
