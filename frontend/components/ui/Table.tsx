import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Composable table primitives — shadcn-style.
 * Usage:
 *   <Table>
 *     <THead><TR><TH>Name</TH></TR></THead>
 *     <TBody><TR><TD>…</TD></TR></TBody>
 *   </Table>
 */

export const Table = forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

export const THead = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500", className)}
    {...props}
  />
));
THead.displayName = "THead";

export const TBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-gray-100", className)}
    {...props}
  />
));
TBody.displayName = "TBody";

export const TR = forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("transition-colors hover:bg-gray-50", className)}
    {...props}
  />
));
TR.displayName = "TR";

export const TH = forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("px-4 py-3 font-semibold", className)}
    {...props}
  />
));
TH.displayName = "TH";

export const TD = forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-4 py-3 align-middle text-gray-700", className)}
    {...props}
  />
));
TD.displayName = "TD";

export const TableEmpty = ({
  colSpan,
  children = "No results.",
}: {
  colSpan: number;
  children?: React.ReactNode;
}) => (
  <tr>
    <td
      colSpan={colSpan}
      className="px-4 py-10 text-center text-sm text-gray-500"
    >
      {children}
    </td>
  </tr>
);
