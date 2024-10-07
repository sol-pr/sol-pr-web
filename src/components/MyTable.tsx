"use client";
import React, { Key, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Link,
  Button,
} from "@nextui-org/react";
import { Title } from "./Title";
import { SmartContractService } from "@/services/SmartContractService";
import { GithubRepo } from "@/Schema/Repository";
import { repoSchemaToModel } from "@/services/utils";
import { useRouter } from "next/navigation";
import {
  Github,
  GitPullRequestArrow,
  SquareArrowOutUpRight,
} from "lucide-react";

export default function MyTable() {
  const [repos, setRepos] = useState<GithubRepo[] | null>();
  const smartContractService = new SmartContractService();
  const router = useRouter();
  useEffect(() => {
    async function getRepos() {
      const repos = await smartContractService.getAllRepositories();
      setRepos(repos);
    }

    getRepos();
  }, []);

  const columns = [
    {
      key: "repo_name",
      label: "Repo Name",
    },
    {
      key: "repo_description",
      label: "Repo Description",
    },
    {
      key: "pull_request_limit",
      label: "Min PR for Reward",
    },
    {
      key: "reward_per_pull_request",
      label: "Reward Amount",
    },
    {
      key: "total_pull_requests",
      label: "Total PR's",
    },
    {
      key: "repo_url",
      label: "REPO URL",
    },
    {
      key: "id",
      label: "View Details",
    },
  ];

  const renderCell = React.useCallback(
    (repos: GithubRepo, columnKey: React.Key) => {
      const repoModel = repoSchemaToModel(repos);

      const cellValue = repoModel[columnKey as keyof typeof repoModel];

      switch (columnKey) {
        case "pull_request_limit":
          return (
            <div className="flex justify-center gap-2">
              <span> {cellValue} RR / </span>
              <span className="opacity-25"> reward</span>
            </div>
          );
        case "repo_description":
          return <span>{cellValue.toString()}</span>;
        case "reward_per_pull_request":
          return (
            <div className="flex justify-center gap-2">
              <span> {cellValue}</span>
              <span className="opacity-25"> SOL</span>
            </div>
          );
        case "repo_url":
          return (
            <Button
              size="sm"
              radius="lg"
              color="success"
              variant="ghost"
              isIconOnly
              className="opacity-50"
              onClick={() => {
                router.push(cellValue.toString());
              }}
            >
              <SquareArrowOutUpRight size={12} />
            </Button>
            // <Link href={cellValue.toString()} target="blank">
            // </Link>
          );
        case "id":
          return (
            <Button
              size="sm"
              radius="lg"
              color="primary"
              variant="shadow"
              onClick={() => {
                router.push(`/bounty/${cellValue}`);
              }}
            >
              Detail
            </Button>
          );
        default:
          return <span>{cellValue}</span>;
      }
    },
    []
  );

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(repos ? repos.length : 1 / rowsPerPage);

  const calculateRepo = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return repos ? repos.slice(start, end) : repos;
  }, [page, repos]);

  return (
    <div className="flex flex-col items-center pt-40 gap-5 w-4/5 min-h-screen">
      <Title
        title="Bounty's"
        description="You can access active bounty program using this table."
      />
      <Table
        aria-label="Example empty table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              itemScope
              isCompact
              showControls
              isDisabled={repos == null}
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={
                column.key === "reward_per_pull_request" ||
                column.key === "repo_url"
                  ? "center"
                  : "start"
              }
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        {calculateRepo != null ? (
          <TableBody items={calculateRepo}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        ) : (
          <TableBody emptyContent={"There is no data yet"}>{[]}</TableBody>
        )}
      </Table>
    </div>
  );
}
