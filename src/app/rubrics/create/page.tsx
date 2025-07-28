'use client';

import React from 'react';
import { Layout } from '../../../components/layout';
import { RubricForm } from '../../../features/rubrics';

export default function CreateRubricPage() {
  return (
    <Layout title="Create Rubric">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Rubric</h1>
        <RubricForm />
      </div>
    </Layout>
  );
}