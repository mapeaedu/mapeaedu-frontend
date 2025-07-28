import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Modal } from '../../components/ui';
import { useRubricLevelEvidence, useDeleteRubricLevelEvidence } from './useRubricLevelEvidences';
import { formatDate } from '../../utils/formatters';

export interface RubricLevelEvidenceDetailProps {
  id: string;
  rubricId: string;
  levelId: string;
}

const RubricLevelEvidenceDetail: React.FC<RubricLevelEvidenceDetailProps> = ({ 
  id, 
  rubricId, 
  levelId 
}) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Fetch evidence data
  const { data: evidence, isLoading, isError } = useRubricLevelEvidence(id);
  
  // Delete mutation
  const deleteMutation = useDeleteRubricLevelEvidence();
  
  // Handle edit evidence
  const handleEditEvidence = () => {
    router.push(`/rubrics/${rubricId}/levels/${levelId}/evidences/${id}/edit`);
  };
  
  // Handle delete evidence
  const handleDeleteEvidence = () => {
    setShowDeleteConfirm(true);
  };
  
  // Confirm delete evidence
  const confirmDeleteEvidence = () => {
    deleteMutation.mutate(
      { id, rubricLevelId: levelId },
      {
        onSuccess: () => {
          router.push(`/rubrics/${rubricId}/levels/${levelId}`);
        },
      }
    );
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // Error state
  if (isError || !evidence) {
    return (
      <Card>
        <div className="text-center py-8 text-red-600">
          Error loading evidence. It may have been deleted or you don't have permission to view it.
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Evidence header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/rubrics/${rubricId}/levels/${levelId}`)}
            leftIcon={
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
          >
            Back to Level
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Evidence Details</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEditEvidence}>
            Edit Evidence
          </Button>
          <Button variant="danger" onClick={handleDeleteEvidence}>
            Delete Evidence
          </Button>
        </div>
      </div>
      
      {/* Evidence details */}
      <Card>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-base text-gray-900">
              {evidence.description}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1 text-base text-gray-900">
                {evidence.created_at ? formatDate(evidence.created_at) : 'Unknown'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1 text-base text-gray-900">
                {evidence.updated_at ? formatDate(evidence.updated_at) : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </Card>
      
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
              onClick={confirmDeleteEvidence}
              isLoading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-black">
          Are you sure you want to delete this evidence? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default RubricLevelEvidenceDetail;