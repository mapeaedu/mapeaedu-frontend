import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Badge, Table, Modal } from '../../components/ui';
import { useRubric, useDeleteRubric } from './useRubrics';
import { formatDate } from '../../utils/formatters';
import { RubricLevel } from '../../types/rubric';

export interface RubricDetailProps {
  id: string;
}

const RubricDetail: React.FC<RubricDetailProps> = ({ id }) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Fetch rubric data
  const { data: rubric, isLoading, isError } = useRubric(id);
  
  // Delete mutation
  const deleteMutation = useDeleteRubric();
  
  // Handle edit rubric
  const handleEditRubric = () => {
    router.push(`/rubrics/${id}/edit`);
  };
  
  // Handle delete rubric
  const handleDeleteRubric = () => {
    setShowDeleteConfirm(true);
  };
  
  // Confirm delete rubric
  const confirmDeleteRubric = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        router.push('/rubrics');
      },
    });
  };
  
  // Handle add level
  const handleAddLevel = () => {
    router.push(`/rubrics/${id}/levels/create`);
  };
  
  // Handle view level
  const handleViewLevel = (level: RubricLevel) => {
    router.push(`/rubrics/${id}/levels/${level.id}`);
  };
  
  // Handle edit level
  const handleEditLevel = (e: React.MouseEvent, level: RubricLevel) => {
    e.stopPropagation();
    router.push(`/rubrics/${id}/levels/${level.id}/edit`);
  };
  
  // Level columns for the table
  const levelColumns = [
    {
      header: 'Order',
      accessor: (level: RubricLevel) => level.level_order,
      className: 'text-center',
    },
    {
      header: 'Name',
      accessor: (level: RubricLevel) => level.name,
      className: 'font-medium text-gray-900',
    },
    {
      header: 'Description',
      accessor: (level: RubricLevel) => (
        <div className="truncate max-w-md">
          {level.description || 'No description'}
        </div>
      ),
    },
    {
      header: 'Evidences',
      accessor: (level: RubricLevel) => (
        <Badge variant="primary" size="sm">
          {level.evidences?.length || 0} evidences
        </Badge>
      ),
      className: 'text-center',
    },
    {
      header: 'Actions',
      accessor: (level: RubricLevel) => (
        <div className="flex space-x-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => handleEditLevel(e, level)}
          >
            Edit
          </Button>
        </div>
      ),
      className: 'w-32',
    },
  ];
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // Error state
  if (isError || !rubric) {
    return (
      <Card>
        <div className="text-center py-8 text-red-600">
          Error loading rubric. It may have been deleted or you don&apos;t have permission to view it.
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Rubric header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/rubrics')}
            leftIcon={
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
          >
            Back to List
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{rubric.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEditRubric}>
            Edit Rubric
          </Button>
          <Button variant="danger" onClick={handleDeleteRubric}>
            Delete Rubric
          </Button>
        </div>
      </div>
      
      {/* Rubric details */}
      <Card>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-base text-gray-900">
              {rubric.description || 'No description provided.'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1 text-base text-gray-900">
                {rubric.created_at ? formatDate(rubric.created_at) : 'Unknown'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1 text-base text-gray-900">
                {rubric.updated_at ? formatDate(rubric.updated_at) : 'Unknown'}
              </p>
            </div>
          </div>
          
          {rubric.domain_id && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Domain</h3>
              <p className="mt-1 text-base text-gray-900">{rubric.domain_id}</p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Levels section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Levels</h2>
          <Button onClick={handleAddLevel}>Add Level</Button>
        </div>
        
        <Card>
          <Table
            data={rubric.levels || []}
            columns={levelColumns}
            keyExtractor={(level) => level.id}
            onRowClick={handleViewLevel}
            emptyMessage="No levels have been added to this rubric yet."
            hoverable
          />
        </Card>
      </div>
      
      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteRubric}
              isLoading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete this rubric? This will also delete all
          levels and evidences associated with it. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default RubricDetail;