import { api } from "../lib/api";
import type {
  CreateProjectPayload,
  ProjectDetail,
  ProjectFilters,
  ProjectListResponse,
} from "../types/project";

export const projectService = {
  async list(filters: ProjectFilters): Promise<ProjectListResponse> {
    // Drop undefined/empty values so we don't send ?category=&q= noise.
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && v !== null) params[k] = String(v);
    });
    const { data } = await api.get<ProjectListResponse>("/projects", { params });
    return data;
  },

  async getById(id: string): Promise<ProjectDetail> {
    const { data } = await api.get<ProjectDetail>(`/projects/${id}`);
    return data;
  },

  async create(payload: CreateProjectPayload): Promise<ProjectDetail> {
    const { data } = await api.post<ProjectDetail>("/projects", payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
