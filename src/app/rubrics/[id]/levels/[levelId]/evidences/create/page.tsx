'use client';

import React from 'react';
import {Layout} from '../../../../../../../components/layout';
import {RubricLevelEvidenceForm} from '../../../../../../../features/rubricLevelEvidences';

interface CreateRubricLevelEvidencePageProps {
    params: {
        id: string;
        levelId: string;
    };
}

export default function CreateRubricLevelEvidencePage({params}: CreateRubricLevelEvidencePageProps) {
    const {id: rubricId, levelId} = params;
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