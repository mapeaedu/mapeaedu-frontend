'use client';

import React from 'react';
import {Layout} from '../../../../components/layout';
import {RubricForm, useRubric} from '../../../../features/rubrics';

interface EditRubricPageProps {
    params: {
        id: string;
    };
}

export default function EditRubricPage({params}: EditRubricPageProps) {
    const {id} = params;
    const {data: rubric, isLoading, isError} = useRubric(id);

    return (
        <Layout title="Edit Rubric">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Rubric</h1>

                {isLoading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                )}

                {isError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        Error loading rubric. It may have been deleted or you don't have permission to edit it.
                    </div>
                )}

                {rubric && (
                    <RubricForm
                        rubric={rubric}
                        isEdit={true}
                    />
                )}
            </div>
        </Layout>
    );
}