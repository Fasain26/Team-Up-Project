import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { engagementService } from "../services/engagement.service";

export function useDashboard() {
  return useQuery({ queryKey: ["dashboard"], queryFn: engagementService.dashboard });
}

export function useMyApplications() {
  return useQuery({ queryKey: ["my-applications"], queryFn: engagementService.myApplications });
}

export function useMyScore(projectId: string) {
  return useQuery({
    queryKey: ["my-score", projectId],
    queryFn: () => engagementService.myScore(projectId),
    enabled: !!projectId,
  });
}

export function useProjectApplicants(projectId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["applicants", projectId],
    queryFn: () => engagementService.projectApplicants(projectId),
    enabled: enabled && !!projectId,
  });
}

export function useApply(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (message?: string) => engagementService.apply(projectId, message),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-applications"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDecide(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACCEPTED" | "REJECTED" }) =>
      engagementService.decide(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applicants", projectId] });
      qc.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
}
