'use client';

import React from 'react';
import {Layout} from '../../../components/layout';
import {RubricDetail} from '../../../features/rubrics';

interface RubricDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

interface RubricDetailClientProps {
    id: string;
}

function RubricDetailClient({id}: RubricDetailClientProps) {
    return (
        <Layout title="Rubric Details">
            <RubricDetail id={id}/>
        </Layout>
    );
}

export default async function RubricDetailPage({params}: RubricDetailPageProps) {
    const {id} = await params;
    return <RubricDetailClient id={id} />;
}