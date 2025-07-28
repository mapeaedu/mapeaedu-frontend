'use client';

import React from 'react';
import { Layout } from '../../../../../../../../components/layout';
import { RubricLevelEvidenceForm } from '../../../../../../../../features/rubricLevelEvidences';
import { useRubricLevelEvidence } from '../../../../../../../../features/rubricLevelEvidences';

interface EditRubricLevelEvidencePageProps {
  params: {
    id: string;
    levelId: string;
    evidenceId: string;
  };
}

export default function EditRubricLevelEvidencePage({ params }: EditRubricLevelEvidencePageProps) {
  const unwrappedParams = React.use(params);
  const { id: rubricId, levelId, evidenceId } = unwrappedParams;
  
  // Fetch the evidence being edited
  const { data: evidence, isLoading, isError } = useRubricLevelEvidence(evidenceId);
  
  return (
    <Layout title="Edit Evidence">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Evidence</h1>
        
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error loading evidence. It may have been deleted or you don't have permission to edit it.
          </div>
        )}
        
        {evidence && !isLoading && (
          <RubricLevelEvidenceForm 
            rubricId={rubricId}
            levelId={levelId}
            evidence={evidence}
            isEdit={true}
          />
        )}
      </div>
    </Layout>
  );
}