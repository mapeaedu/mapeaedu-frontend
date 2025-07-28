'use client';

import React from 'react';
import {Layout} from '../../../../../components/layout';
import {RubricLevelDetail} from '../../../../../features/rubricLevels';

interface RubricLevelDetailPageProps {
    params: {
        id: string;
        levelId: string;
    };
}

export default function RubricLevelDetailPage({params}: RubricLevelDetailPageProps) {
    const {id: rubricId, levelId} = params;

    return (
        <Layout title="Rubric Level Details">
            <RubricLevelDetail id={levelId} rubricId={rubricId}/>
        </Layout>
    );
}