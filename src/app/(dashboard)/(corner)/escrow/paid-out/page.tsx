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
import { useGetInfiniteTransactions } from "@/tanstack/hooks/useProject";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { capitalizeFirstLetter, getCurrencySymbol } from "@/lib/string";
import { formatCurrencyValue } from "@/lib/number";
import { formatDate } from "date-fns";
import { cn } from "@/lib/utils";
import { useInfiniteData } from "@/hooks/use-infinite-data";
import { UmojaLinnTransaction } from "@/types/transaction";

const columns: ColumnDef<UmojaLinnTransaction>[] = [
  {
    accessorKey: "projectName",
    header: "Project Name",

    cell: (cell) => {
      const row = cell?.row?.original;
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
            {/* <p className="text-sm">#{uuidToBase62Safe(row?.projectId)}</p> */}
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
    cell: (cell) => {
      const row = cell?.row?.original;
      const isCompleted = row?.transactionType === "MILESTONE_COMPLETED";
      return (
        <p
          className={cn(
            "p-2 text-sm flex items-center gap-2 w-fit [&>svg]:size-4 ",
            isCompleted 
            ? "text-success bg-success-25"
            : "text-warning bg-warning-25",
            // row?.status === "FAILED" && "text-error bg-error-25"
          )}
        >
          {/* {{ PENDING: <></>, SUCCESS: <Check />, FAILED: <X /> }[row?.status]}{" "}
          {capitalizeFirstLetter(row?.status)} */}

          {capitalizeFirstLetter(isCompleted? "Released" : "Pending")}
        </p>
      );
    },

  },
];

const EscrowPaidOut = () => {
  const {
    data: allTransactions,
    isPending: loading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
   } = useGetInfiniteTransactions({
    transactionType: "MILESTONE_COMPLETED,FUND_ESCROW",
    activeProjects: false
   });
   const transactionPaidOutData = useInfiniteData(allTransactions)

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
         {loading && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-44 text-center text-muted-foreground"
              >
                Loading...
              </TableCell>
            </TableRow>
          )}
          <div></div>
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
          {hasNextPage && (
            <button
              onClick={()=> hasNextPage && fetchNextPage()}
              className="text-primary text-sm text-right block w-full mt-4 py-2 hover:text-primary/70 transition"
            >
              {isFetchingNextPage
                ? "loading more..."
                : "Show more"}
            </button>
          )}
      </div>
    </div>
  );
};

export default EscrowPaidOut;
