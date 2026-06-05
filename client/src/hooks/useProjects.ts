import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { projectService } from "../services/project.service";
import type { CreateProjectPayload, ProjectFilters } from "../types/project";

export function useProjects(filters: ProjectFilters) {
  return useQuery({
    // filters are part of the key, so changing a filter refetches + caches
    // each combination separately.
    queryKey: ["projects", filters],
    queryFn: () => projectService.list(filters),
    // keep showing the old page while the next one loads -> no flicker
    placeholderData: keepPreviousData,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => projectService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectService.create(payload),
    onSuccess: (project) => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      navigate(`/projects/${project.id}`);
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (id: string) => projectService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      navigate("/projects");
    },
  });
}
