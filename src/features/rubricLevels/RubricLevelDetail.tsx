import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Badge, Table, Modal } from '../../components/ui';
import { useRubricLevel, useDeleteRubricLevel } from './useRubricLevels';
import { formatDate } from '../../utils/formatters';
import { RubricLevelEvidence } from '../../types/rubric';

export interface RubricLevelDetailProps {
  id: string;
  rubricId: string;
}

const RubricLevelDetail: React.FC<RubricLevelDetailProps> = ({ id, rubricId }) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Fetch level data
  const { data: level, isLoading, isError } = useRubricLevel(id);
  
  // Delete mutation
  const deleteMutation = useDeleteRubricLevel();
  
  // Handle edit level
  const handleEditLevel = () => {
    router.push(`/rubrics/${rubricId}/levels/${id}/edit`);
  };
  
  // Handle delete level
  const handleDeleteLevel = () => {
    setShowDeleteConfirm(true);
  };
  
  // Confirm delete level
  const confirmDeleteLevel = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        router.push(`/rubrics/${rubricId}`);
      },
    });
  };
  
  // Handle add evidence
  const handleAddEvidence = () => {
    router.push(`/rubrics/${rubricId}/levels/${id}/evidences/create`);
  };
  
  // Handle view evidence
  const handleViewEvidence = (evidence: RubricLevelEvidence) => {
    router.push(`/rubrics/${rubricId}/levels/${id}/evidences/${evidence.id}`);
  };
  
  // Handle edit evidence
  const handleEditEvidence = (e: React.MouseEvent, evidence: RubricLevelEvidence) => {
    e.stopPropagation();
    router.push(`/rubrics/${rubricId}/levels/${id}/evidences/${evidence.id}/edit`);
  };
  
  // Evidence columns for the table
  const evidenceColumns = [
    {
      header: 'Description',
      accessor: (evidence: RubricLevelEvidence) => (
        <div className="truncate max-w-md">
          {evidence.description || 'No description'}
        </div>
      ),
    },
    {
      header: 'Created',
      accessor: (evidence: RubricLevelEvidence) => 
        evidence.created_at ? formatDate(evidence.created_at) : 'Unknown',
    },
    {
      header: 'Actions',
      accessor: (evidence: RubricLevelEvidence) => (
        <div className="flex space-x-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => handleEditEvidence(e, evidence)}
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
  if (isError || !level) {
    return (
      <Card>
        <div className="text-center py-8 text-red-600">
          Error loading rubric level. It may have been deleted or you don't have permission to view it.
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Level header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/rubrics/${rubricId}`)}
            leftIcon={
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
          >
            Back to Rubric
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{level.name}</h1>
          <Badge variant="primary" size="md">Level {level.level_order}</Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEditLevel}>
            Edit Level
          </Button>
          <Button variant="danger" onClick={handleDeleteLevel}>
            Delete Level
          </Button>
        </div>
      </div>
      
      {/* Level details */}
      <Card>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-base text-gray-900">
              {level.description || 'No description provided.'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1 text-base text-gray-900">
                {level.created_at ? formatDate(level.created_at) : 'Unknown'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1 text-base text-gray-900">
                {level.updated_at ? formatDate(level.updated_at) : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Evidences section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Evidences</h2>
          <Button onClick={handleAddEvidence}>Add Evidence</Button>
        </div>
        
        <Card>
          <Table
            data={level.evidences || []}
            columns={evidenceColumns}
            keyExtractor={(evidence) => evidence.id}
            onRowClick={handleViewEvidence}
            emptyMessage="No evidences have been added to this level yet."
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
              onClick={confirmDeleteLevel}
              isLoading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-black">
          Are you sure you want to delete this level? This will also delete all
          evidences associated with it. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default RubricLevelDetail;