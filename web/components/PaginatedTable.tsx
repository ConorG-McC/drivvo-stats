"use client";

import { ReactNode, useMemo, useState } from "react";
import { Button } from "@/components/retroui/Button";
import { Table } from "@/components/retroui/Table";

interface Column<T> {
  readonly key: string;
  readonly header: ReactNode;
  readonly className?: string;
  readonly headerClassName?: string;
  readonly cellClassName?: string;
  readonly render: (row: T) => ReactNode;
}

interface Props<T> {
  readonly rows: T[];
  readonly columns: Column<T>[];
  readonly getRowKey: (row: T) => string | number;
  readonly pageSize?: number;
  readonly emptyMessage?: string;
}

export default function PaginatedTable<T>({
  rows,
  columns,
  getRowKey,
  pageSize = 10,
  emptyMessage = "No records",
}: Props<T>) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(Math.ceil(rows.length / pageSize), 1);
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * pageSize;
  const visibleRows = useMemo(
    () => rows.slice(start, start + pageSize),
    [pageSize, rows, start],
  );

  function goPrevious() {
    setPage((current) => Math.max(current - 1, 0));
  }

  function goNext() {
    setPage((current) => Math.min(current + 1, pageCount - 1));
  }

  return (
    <div>
      <Table className="border-0 shadow-none">
        <Table.Header>
          <Table.Row className="bg-secondary hover:bg-secondary">
            {columns.map((column) => (
              <Table.Head
                key={column.key}
                className={column.headerClassName ?? column.className ?? "text-secondary-foreground"}
              >
                {column.header}
              </Table.Head>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {visibleRows.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={columns.length} className="text-muted-foreground">
                {emptyMessage}
              </Table.Cell>
            </Table.Row>
          ) : (
            visibleRows.map((row) => (
              <Table.Row key={getRowKey(row)}>
                {columns.map((column) => (
                  <Table.Cell key={column.key} className={column.cellClassName ?? column.className?.replace("text-secondary-foreground", "")}>
                    {column.render(row)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      {rows.length > pageSize && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Showing {start + 1}-{Math.min(start + pageSize, rows.length)} of {rows.length}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={goPrevious} disabled={safePage === 0}>
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {safePage + 1} of {pageCount}
            </span>
            <Button size="sm" onClick={goNext} disabled={safePage >= pageCount - 1}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
