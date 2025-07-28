import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Table, Badge } from '../../components/ui';
import { TextField } from '../../components/forms';
import { useRubrics, useDeleteRubric } from './useRubrics';
import { Rubric } from '../../types/rubric';
import { formatDate } from '../../utils/formatters';

export interface RubricsListProps {
  domainId?: string;
}

const RubricsList: React.FC<RubricsListProps> = ({ domainId }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Fetch rubrics
  const { data: rubrics, isLoading, isError } = useRubrics({ domain_id: domainId });
  
  // Delete mutation
  const deleteMutation = useDeleteRubric();
  
  // Filter rubrics by search term
  const filteredRubrics = rubrics?.filter(rubric => 
    rubric.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rubric.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle view rubric
  const handleViewRubric = (rubric: Rubric) => {
    router.push(`/rubrics/${rubric.id}`);
  };
  
  // Handle create rubric
  const handleCreateRubric = () => {
    router.push('/rubrics/create');
  };
  
  // Handle edit rubric
  const handleEditRubric = (e: React.MouseEvent, rubric: Rubric) => {
    e.stopPropagation();
    router.push(`/rubrics/${rubric.id}/edit`);
  };
  
  // Handle delete rubric
  const handleDeleteRubric = (e: React.MouseEvent, rubricId: string) => {
    e.stopPropagation();
    setShowDeleteConfirm(rubricId);
  };
  
  // Confirm delete rubric
  const confirmDeleteRubric = (rubricId: string) => {
    deleteMutation.mutate(rubricId, {
      onSuccess: () => {
        setShowDeleteConfirm(null);
      },
    });
  };
  
  // Cancel delete rubric
  const cancelDeleteRubric = () => {
    setShowDeleteConfirm(null);
  };
  
  // Table columns
  const columns = [
    {
      header: 'Name',
      accessor: (rubric: Rubric) => rubric.name || 'Unnamed Rubric',
      className: 'font-medium text-gray-900',
    },
    {
      header: 'Description',
      accessor: (rubric: Rubric) => (
        <div className="truncate max-w-md">
          {rubric.description || 'No description'}
        </div>
      ),
    },
    {
      header: 'Levels',
      accessor: (rubric: Rubric) => (
        <Badge variant="primary" size="sm">
          {rubric.levels?.length || 0} levels
        </Badge>
      ),
      className: 'text-center',
    },
    {
      header: 'Created',
      accessor: (rubric: Rubric) => rubric.created_at ? formatDate(rubric.created_at) : 'Unknown',
    },
    {
      header: 'Actions',
      accessor: (rubric: Rubric) => (
        <div className="flex space-x-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => handleEditRubric(e, rubric)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => handleDeleteRubric(e, rubric.id || '')}
          >
            Delete
          </Button>
        </div>
      ),
      className: 'w-48',
    },
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Rubrics</h1>
        <Button onClick={handleCreateRubric}>Create Rubric</Button>
      </div>
      
      <Card>
        <div className="mb-4">
          <TextField
            placeholder="Search rubrics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </div>
        
        <Table
          data={filteredRubrics || []}
          columns={columns}
          keyExtractor={(rubric) => rubric.id || ''}
          onRowClick={handleViewRubric}
          isLoading={isLoading}
          emptyMessage={isError ? 'Error loading rubrics' : 'No rubrics found'}
          hoverable
        />
      </Card>
      
      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-black">Confirm Delete</h2>
            <p className="mb-6 text-black">Are you sure you want to delete this rubric? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelDeleteRubric}>
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={() => confirmDeleteRubric(showDeleteConfirm)}
                isLoading={deleteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RubricsList;