'use client';

import React from 'react';
import {Layout} from '../../../components/layout';
import {RubricDetail} from '../../../features/rubrics';

interface RubricDetailPageProps {
    params: {
        id: string;
    };
}

export default function RubricDetailPage({params}: RubricDetailPageProps) {
    const {id} = params;
    return (
        <Layout title="Rubric Details">
            <RubricDetail id={id}/>
        </Layout>
    );
}