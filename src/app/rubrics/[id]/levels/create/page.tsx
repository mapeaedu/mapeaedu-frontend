'use client';

import React from 'react';
import { Layout } from '../../../../../components/layout';
import { RubricLevelForm } from '../../../../../features/rubricLevels';
import { useRubric } from '../../../../../features/rubrics';

interface CreateRubricLevelPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CreateRubricLevelPage({ params }: CreateRubricLevelPageProps) {
  const { id: rubricId } = params;
  
  // Fetch the rubric to get the current max level order
  const { data: rubric, isLoading } = useRubric(rubricId);
  
  // Calculate the max order from existing levels
  const maxOrder = rubric?.levels?.reduce((max, level) => 
    level.level_order > max ? level.level_order : max, 0) || 0;
  
  return (
    <Layout title="Create Rubric Level">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Rubric Level</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <RubricLevelForm 
            rubricId={rubricId}
            maxOrder={maxOrder}
          />
        )}
      </div>
    </Layout>
  );
}