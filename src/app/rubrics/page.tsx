'use client';

import React from 'react';
import { Layout } from '../../components/layout';
import { RubricsList } from '../../features/rubrics';

export default function RubricsPage() {
  return (
    <Layout title="Rubrics Management System">
      <RubricsList />
    </Layout>
  );
}