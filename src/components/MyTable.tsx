import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@nextui-org/react";

export default function MyTable() {
  return (
    <div className="flex flex-col items-center pt-40 gap-5 w-4/5 min-h-screen">
      <div className="flex-col self-start gap-2">
        <h1 className="text-3xl font-bold">Bounty's</h1>
        <p className="text-gray-400">
          You can access active bounty program using this table.
        </p>
      </div>
      <Table aria-label="Example empty table">
        <TableHeader>
          <TableColumn>Repo Name</TableColumn>
          <TableColumn>Owner</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Last Commit</TableColumn>
          <TableColumn>$ Bounty</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
      </Table>
      <Pagination showControls total={3} initialPage={1} />
    </div>
  );
}
