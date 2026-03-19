"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import axios from "axios";

import GroupStats from "@/components/superadmin/groups/GroupStats";
import GroupsTable from "@/components/superadmin/groups/GroupsTable";
import GroupsCardGrid from "@/components/superadmin/groups/GroupsCardGrid";
import GroupFormModal from "@/components/superadmin/groups/GroupFormModal";
import AssignGroupAdminModal from "@/components/superadmin/groups/AssignGroupAdminModal";
import { Pagination } from "@/components/ui/Pagination";
import DataToolbar from "@/components/common/DataToolbar";

import { HospitalGroup } from "@/types/groups";
import { useGroups } from "@/hooks/groups/useGroups";

const ITEMS_PER_PAGE = 4;

const filterConfig = [
  {
    key: "status",
    label: "Operating Status",
    options: [
      { label: "All Statuses", value: "All" },
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ],
  },
  {
    key: "subscription",
    label: "Subscription",
    options: [
      { label: "All Subscriptions", value: "All" },
      { label: "Valid / Active", value: "Valid" },
      { label: "Expired", value: "Expired" },
    ],
  },
];

export default function GroupsClient() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState<HospitalGroup | undefined>(
    undefined,
  );
  const [editingGroup, setEditingGroup] = useState<HospitalGroup | undefined>(
    undefined,
  );

  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<Record<string, string>>({
    search: "",
    status: "All",
    subscription: "All",
  });

  // 🔥 Memoize query params
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: filters.search || undefined,
      status: filters.status !== "All" ? filters.status : undefined,
      subscription:
        filters.subscription !== "All" ? filters.subscription : undefined,
    }),
    [currentPage, filters],
  );

  // 🔥 TanStack Query Hook
  const { data, isLoading, isFetching } = useGroups(queryParams);

  const groups: HospitalGroup[] = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;
  const totalItems = data?.total || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreate = () => {
    setEditingGroup(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (group: HospitalGroup) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleAssignAdmin = (group: HospitalGroup) => {
    setSelectedGroup(group);
    setIsAssignOpen(true);
  };

  return (
    <main className="p-6 space-y-6 min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospital Groups</h1>
          <p className="text-muted-foreground">
            Manage organizations, subscriptions, and global settings.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Group
        </button>
      </div>

      {/* Stats */}
      <GroupStats />

      {/* Filters & View Toggle */}
      <DataToolbar
        searchPlaceholder="Search groups..."
        viewMode={viewMode}
        setViewMode={setViewMode}
        filters={filters}
        setFilters={setFilters}
        filterConfig={filterConfig}
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-muted-foreground">Loading hospital groups...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <div className="bg-primary/10 p-6 rounded-full mb-4">
            <Plus className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            No Hospital Groups Found
          </h2>
          <p className="text-muted-foreground mt-2 mb-6">
            Try adjusting filters or create a new hospital group.
          </p>
        </div>
      ) : (
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === "table" ? (
            <GroupsTable
              data={groups}
              onAssignAdmin={handleAssignAdmin}
              onEdit={handleEdit}
            />
          ) : (
            <GroupsCardGrid
              data={groups}
              onAssignAdmin={handleAssignAdmin}
              onEdit={handleEdit}
            />
          )}

          {/* Pagination */}
          <div className="pt-4 border-t border-border">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            {isFetching && (
              <p className="text-sm text-muted-foreground mt-2">
                Updating data...
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Create/Edit Modal */}
      <GroupFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={editingGroup ? "edit" : "create"}
        defaultValues={editingGroup}
      />

      {/* Assign Admin Modal */}
      <AssignGroupAdminModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        group={selectedGroup}
      />
    </main>
  );
}
