'use client';

import React from 'react';
import {Layout} from '../../../../../components/layout';
import {RubricLevelDetail} from '../../../../../features/rubricLevels';

interface RubricLevelDetailPageProps {
    params: Promise<{
        id: string;
        levelId: string;
    }>;
}

interface RubricLevelDetailClientProps {
    rubricId: string;
    levelId: string;
}

function RubricLevelDetailClient({rubricId, levelId}: RubricLevelDetailClientProps) {
    return (
        <Layout title="Rubric Level Details">
            <RubricLevelDetail id={levelId} rubricId={rubricId}/>
        </Layout>
    );
}

export default async function RubricLevelDetailPage({params}: RubricLevelDetailPageProps) {
    const {id: rubricId, levelId} = await params;
    return <RubricLevelDetailClient rubricId={rubricId} levelId={levelId} />;
}