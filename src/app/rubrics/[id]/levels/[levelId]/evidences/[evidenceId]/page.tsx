'use client';

import React from 'react';
import {Layout} from '../../../../../../../components/layout';
import {RubricLevelEvidenceDetail} from '../../../../../../../features/rubricLevelEvidences';

interface RubricLevelEvidenceDetailPageProps {
    params: Promise<{
        id: string;
        levelId: string;
        evidenceId: string;
    }>;
}

interface RubricLevelEvidenceDetailClientProps {
    rubricId: string;
    levelId: string;
    evidenceId: string;
}

function RubricLevelEvidenceDetailClient({rubricId, levelId, evidenceId}: RubricLevelEvidenceDetailClientProps) {
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

export default async function RubricLevelEvidenceDetailPage({params}: RubricLevelEvidenceDetailPageProps) {
    const {id: rubricId, levelId, evidenceId} = await params;
    return <RubricLevelEvidenceDetailClient rubricId={rubricId} levelId={levelId} evidenceId={evidenceId} />;
}