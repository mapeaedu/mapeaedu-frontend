'use client';

import React from 'react';
import {Layout} from '../../../../../../components/layout';
import {RubricLevelForm} from '../../../../../../features/rubricLevels';
import {useRubric} from '../../../../../../features/rubrics';
import {useRubricLevel} from '../../../../../../features/rubricLevels';

interface EditRubricLevelPageProps {
    params: Promise<{
        id: string;
        levelId: string;
    }>;
}

interface EditRubricLevelClientProps {
    id: string;
    levelId: string;
}

function EditRubricLevelClient({id, levelId}: EditRubricLevelClientProps) {
    // Fetch the rubric to get all levels
    const {data: rubric, isLoading: isRubricLoading} = useRubric(id);

    // Fetch the level being edited
    const {data: level, isLoading: isLevelLoading, isError} = useRubricLevel(levelId);

    // Calculate the max order from existing levels (excluding the current level)
    const maxOrder = rubric?.levels?.reduce((max, l) =>
        l.id !== levelId && l.level_order > max ? l.level_order : max, 0) || 0;

    const isLoading = isRubricLoading || isLevelLoading;

    return (
        <Layout title="Edit Rubric Level">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Rubric Level</h1>

                {isLoading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                )}

                {isError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        Error loading rubric level. It may have been deleted or you don&apos;t have permission to edit it.
                    </div>
                )}

                {level && !isLoading && (
                    <RubricLevelForm
                        rubricId={id}
                        level={level}
                        isEdit={true}
                        maxOrder={maxOrder}
                    />
                )}
            </div>
        </Layout>
    );
}

export default async function EditRubricLevelPage({params}: EditRubricLevelPageProps) {
    const {id, levelId} = await params;
    
    return <EditRubricLevelClient id={id} levelId={levelId} />;
}