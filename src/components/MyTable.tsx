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
import { Title } from "./Title";

export default function MyTable() {
  return (
    <div className="flex flex-col items-center pt-40 gap-5 w-4/5 min-h-screen">
      <Title
        title="Bounty's"
        description="You can access active bounty program using this table."
      />
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
