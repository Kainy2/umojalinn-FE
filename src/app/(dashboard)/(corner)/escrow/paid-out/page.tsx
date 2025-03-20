"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useGetWallet } from "@/tanstack/hooks/useProject";
import { UmojalinnWalletTransaction } from "@/types/project";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uuidToBase62Safe } from "@/lib/uuid";
import { capitalizeFirstLetter, getCurrencySymbol } from "@/lib/string";
import { formatCurrencyValue } from "@/lib/number";
import { formatDate } from "date-fns";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<UmojalinnWalletTransaction>[] = [
  {
    accessorKey: "projectName",
    header: "Project Name",
    accessorFn: (row) => {
      const user = row?.project?.buyer?.user;
      return (
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              className="object-cover"
              src={user?.profilePhotoUri || ""}
              alt={user?.firstName}
            />
            <AvatarFallback>
              {user?.firstName?.[0]?.toLocaleUpperCase?.()}
              {user?.lastName?.[0]?.toLocaleUpperCase?.()}
            </AvatarFallback>
          </Avatar>
          <div className="text-foreground-body">
            <p className="font-semibold">{row?.project?.title}</p>
            <p className="text-sm">#{uuidToBase62Safe(row?.projectId)}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    accessorFn: (row) =>
      `${getCurrencySymbol(row?.currency)}${formatCurrencyValue(row?.amount)}`,
  },
  {
    accessorKey: "date",
    header: "Date",
    accessorFn: (row) => formatDate(row?.createdAt, "MMM dd, yyyy"),
  },
  {
    accessorKey: "status",
    header: "Status",
    accessorFn: (row) => (
      <p
        className={cn(
          "p-2 text-sm [&>svg]:size-4",
          row?.status === "PENDING" && "text-warning bg-warning-25",
          row?.status === "SUCCESS" && "text-success bg-success-25",
          row?.status === "FAILED" && "text-error bg-error-25",
        )}
      >
        {{ PENDING: <></>, SUCCESS: <Check />, FAILED: <X /> }[row?.status]}{" "}
        {capitalizeFirstLetter(row?.status)?.replaceAll("-", " ")}
      </p>
    ),
  },
];

const EscrowPaidOut = () => {
  const { data: walletData, isPending: loading } = useGetWallet();

  const transactionPaidOutData = walletData?.data?.data?.transactions;

  const table = useReactTable({
    data: transactionPaidOutData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border overflow-scroll">
      <Table>
        <TableHeader className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-foreground-body">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : loading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-44 text-center text-muted-foreground"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-44 text-center text-muted-foreground"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4 px-8">
        <div className="flex-1 text-sm text-muted-foreground">Page 1 of 1</div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EscrowPaidOut;
