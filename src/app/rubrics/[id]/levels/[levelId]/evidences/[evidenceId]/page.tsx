'use client';

import React from 'react';
import { Layout } from '../../../../../../../components/layout';
import { RubricLevelEvidenceDetail } from '../../../../../../../features/rubricLevelEvidences';

interface RubricLevelEvidenceDetailPageProps {
  params: {
    id: string;
    levelId: string;
    evidenceId: string;
  };
}

export default function RubricLevelEvidenceDetailPage({ params }: RubricLevelEvidenceDetailPageProps) {
  const unwrappedParams = React.use(params);
  const { id: rubricId, levelId, evidenceId } = unwrappedParams;
  
  return (
    <Layout title="Evidence Details">
      <RubricLevelEvidenceDetail 
        id={evidenceId} 
        rubricId={rubricId} 
        levelId={levelId} 
      />
    </Layout>
  );
}