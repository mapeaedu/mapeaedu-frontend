'use client';

import React from 'react';
import {Layout} from '../../../../../../../components/layout';
import {RubricLevelEvidenceForm} from '../../../../../../../features/rubricLevelEvidences';

interface CreateRubricLevelEvidencePageProps {
    params: Promise<{
        id: string;
        levelId: string;
    }>;
}

interface CreateRubricLevelEvidenceClientProps {
    rubricId: string;
    levelId: string;
}

function CreateRubricLevelEvidenceClient({rubricId, levelId}: CreateRubricLevelEvidenceClientProps) {
    return (
        <Layout title="Create Evidence">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Evidence</h1>
                <RubricLevelEvidenceForm
                    rubricId={rubricId}
                    levelId={levelId}
                />
            </div>
        </Layout>
    );
}

export default async function CreateRubricLevelEvidencePage({params}: CreateRubricLevelEvidencePageProps) {
    const {id: rubricId, levelId} = await params;
    return <CreateRubricLevelEvidenceClient rubricId={rubricId} levelId={levelId} />;
}