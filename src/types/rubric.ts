// Core data interfaces
export interface Rubric {
  id?: string;
  domain_id?: string | null;
  name?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  levels?: RubricLevel[]; // For nested data
}

export interface RubricLevel {
  id: string;
  rubric_id: string | null;
  level_order: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  evidences?: RubricLevelEvidence[]; // For nested data
}

export interface RubricLevelEvidence {
  id: string;
  rubric_level_id: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

// Request/Response types
export interface RubricsResponse {
  data: Rubric[];
  message: string;
  success: boolean;
}

export interface RubricResponse {
  data: Rubric;
  message: string;
  success: boolean;
}

export interface RubricLevelsResponse {
  data: RubricLevel[];
  message: string;
  success: boolean;
}

export interface RubricLevelResponse {
  data: RubricLevel;
  message: string;
  success: boolean;
}

export interface RubricLevelEvidencesResponse {
  data: RubricLevelEvidence[];
  message: string;
  success: boolean;
}

export interface RubricLevelEvidenceResponse {
  data: RubricLevelEvidence;
  message: string;
  success: boolean;
}

// Generic API response type
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Form input types (for creating/updating)
export type RubricInput = Omit<Rubric, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'levels'>;
export type RubricLevelInput = Omit<RubricLevel, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'evidences'>;
export type RubricLevelEvidenceInput = Omit<RubricLevelEvidence, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

// Update types (for partial updates)
export type RubricUpdate = Partial<RubricInput>;
export type RubricLevelUpdate = Partial<RubricLevelInput>;
export type RubricLevelEvidenceUpdate = Partial<RubricLevelEvidenceInput>;