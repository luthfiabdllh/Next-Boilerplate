'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Users as UsersIcon,
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Can } from '@/components/shared/role-guard';
import { UserFormDialog } from './user-form-dialog';
import { useUsers } from '../api/use-queries';
import { useDeleteUser } from '../api/use-mutations';
import type { UserEntity, UserFilterDTO } from '../types';
import type { Dictionary } from '@/lib/dictionaries/en';

interface UserTableProps {
  dict: Dictionary['users'];
}

export function UserTable({ dict }: UserTableProps) {
  const [filters, setFilters] = React.useState<Partial<UserFilterDTO>>({
    page: 1,
    limit: 5,
    search: '',
    role: 'all',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [formOpen, setFormOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserEntity | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<UserEntity | null>(null);

  const { data, isLoading } = useUsers(filters);
  const deleteMutation = useDeleteUser();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleRoleChange = (role: string) => {
    setFilters((prev) => ({
      ...prev,
      role: role as UserFilterDTO['role'],
      page: 1,
    }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status as UserFilterDTO['status'],
      page: 1,
    }));
  };

  const handleLimitChange = (limitStr: string) => {
    setFilters((prev) => ({ ...prev, limit: Number(limitStr), page: 1 }));
  };

  const handleEdit = (user: UserEntity) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setFormOpen(true);
  };

  const handleDeletePrompt = (user: UserEntity) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteMutation.mutateAsync(userToDelete.id);
      toast.success(dict.toasts.deleted);
      setUserToDelete(null);
    } catch {
      // Handled in mutation
    }
  };

  const meta = data?.meta ?? { page: 1, limit: 5, total: 0, totalPages: 1 };
  const items = data?.items ?? [];
  const startItem = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const endItem = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative min-w-48 sm:w-72">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={dict.searchPlaceholder}
              value={filters.search ?? ''}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>

          {/* Role Filter */}
          <div className="w-36">
            <Select
              value={filters.role ?? 'all'}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={dict.filterRole} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{dict.allRoles}</SelectItem>
                <SelectItem value="admin">{dict.roles.admin}</SelectItem>
                <SelectItem value="moderator">{dict.roles.moderator}</SelectItem>
                <SelectItem value="user">{dict.roles.user}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-36">
            <Select
              value={filters.status ?? 'all'}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={dict.filterStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{dict.allStatuses}</SelectItem>
                <SelectItem value="active">{dict.statuses.active}</SelectItem>
                <SelectItem value="inactive">{dict.statuses.inactive}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Button: Add User (RBAC Guarded) */}
        <Can permission="users:create">
          <Button onClick={handleCreate} className="gap-1.5 shrink-0">
            <Plus size={16} />
            <span>{dict.addNewUser}</span>
          </Button>
        </Can>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-xl border shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dict.columns.name}</TableHead>
              <TableHead>{dict.columns.email}</TableHead>
              <TableHead>{dict.columns.role}</TableHead>
              <TableHead>{dict.columns.status}</TableHead>
              <TableHead className="hidden md:table-cell">
                {dict.columns.createdAt}
              </TableHead>
              <TableHead className="w-16 text-right">
                {dict.columns.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton loading state
              Array.from({ length: filters.limit ?? 5 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell>
                    <div className="bg-muted h-4 w-32 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="bg-muted h-4 w-40 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="bg-muted h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="bg-muted h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="bg-muted h-4 w-24 rounded" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="bg-muted ml-auto h-6 w-6 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UsersIcon className="text-muted-foreground/50 h-8 w-8" />
                    <p className="text-muted-foreground text-sm font-medium">
                      No users match your criteria.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === 'admin'
                          ? 'default'
                          : user.role === 'moderator'
                            ? 'secondary'
                            : 'outline'
                      }
                      className="capitalize"
                    >
                      {user.role === 'admin' && (
                        <ShieldCheck className="mr-1 h-3 w-3" />
                      )}
                      {dict.roles[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.status === 'active'
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'border-muted text-muted-foreground'
                      }
                    >
                      {dict.statuses[user.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden text-xs md:table-cell">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Actions"
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Can permission="users:update">
                          <DropdownMenuItem
                            onClick={() => handleEdit(user)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>{dict.dialog.submitEdit}</span>
                          </DropdownMenuItem>
                        </Can>
                        <Can permission="users:delete">
                          <DropdownMenuItem
                            onClick={() => handleDeletePrompt(user)}
                            className="text-destructive cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>{dict.dialog.deleteConfirm}</span>
                          </DropdownMenuItem>
                        </Can>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Toolbar */}
        <div className="flex flex-col gap-3 border-t p-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{dict.pagination.showing}</span>
            <span className="font-medium text-foreground">
              {startItem}-{endItem}
            </span>
            <span>{dict.pagination.of}</span>
            <span className="font-medium text-foreground">{meta.total}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5">
              <span>{dict.pagination.perPage}:</span>
              <div className="w-16">
                <Select
                  value={String(filters.limit ?? 5)}
                  onValueChange={handleLimitChange}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.max(1, (prev.page ?? 1) - 1),
                  }))
                }
                disabled={meta.page <= 1 || isLoading}
                aria-label={dict.pagination.prev}
              >
                <ChevronLeft size={14} />
              </Button>
              <span className="px-2">
                {dict.pagination.page} {meta.page} {dict.pagination.of} {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.min(meta.totalPages, (prev.page ?? 1) + 1),
                  }))
                }
                disabled={meta.page >= meta.totalPages || isLoading}
                aria-label={dict.pagination.next}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Dialog for Create & Edit */}
      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={selectedUser}
        dict={dict}
      />

      {/* Confirm Dialog for Deletion */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={dict.dialog.deleteTitle}
        description={dict.dialog.deleteDescription}
        confirmLabel={dict.dialog.deleteConfirm}
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
