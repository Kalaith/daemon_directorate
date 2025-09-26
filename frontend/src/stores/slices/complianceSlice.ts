// stores/slices/complianceSlice.ts - Compliance system management
import type { StateCreator } from 'zustand';
import type { ComplianceTask } from '../../types/game';

export interface ComplianceState {
  complianceTasks: ComplianceTask[];
  complianceDeadlines: Record<string, number>;
  completedAudits: number;
  hrReviewsCompleted: number;
}

export interface ComplianceActions {
  completeComplianceTask: (taskId: string) => void;
  addComplianceTask: (task: ComplianceTask) => void;
  removeComplianceTask: (taskId: string) => void;
  getOverdueTasks: (currentDay: number) => ComplianceTask[];
  getUpcomingTasks: (currentDay: number) => ComplianceTask[];
  getComplianceScore: () => number;
}

export type ComplianceSlice = ComplianceState & ComplianceActions;

export const createComplianceSlice: StateCreator<
  ComplianceSlice,
  [],
  [],
  ComplianceSlice
> = (set, get) => ({
  // Initial state
  complianceTasks: [],
  complianceDeadlines: {},
  completedAudits: 0,
  hrReviewsCompleted: 0,

  // Actions
  completeComplianceTask: (taskId: string) => {
    set(state => {
      const task = state.complianceTasks.find(t => t.id === taskId);
      const updatedTasks = state.complianceTasks.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      );

      // Track completion metrics
      let newCompletedAudits = state.completedAudits;
      let newHrReviews = state.hrReviewsCompleted;

      if (task?.type === 'audit') {
        newCompletedAudits += 1;
      } else if (task?.type === 'performance_review') {
        newHrReviews += 1;
      }

      return {
        complianceTasks: updatedTasks,
        completedAudits: newCompletedAudits,
        hrReviewsCompleted: newHrReviews,
      };
    });
  },

  addComplianceTask: (task: ComplianceTask) => {
    set(state => ({
      complianceTasks: [...state.complianceTasks, task],
    }));
  },

  removeComplianceTask: (taskId: string) => {
    set(state => ({
      complianceTasks: state.complianceTasks.filter(task => task.id !== taskId),
    }));
  },

  getOverdueTasks: (currentDay: number) => {
    const { complianceTasks } = get();
    return complianceTasks.filter(
      task => !task.completed && currentDay >= task.deadline
    );
  },

  getUpcomingTasks: (currentDay: number) => {
    const { complianceTasks } = get();
    return complianceTasks.filter(
      task => !task.completed && currentDay < task.deadline
    );
  },

  getComplianceScore: () => {
    const { complianceTasks } = get();
    const totalTasks = complianceTasks.length;
    const completedTasks = complianceTasks.filter(
      task => task.completed
    ).length;

    return totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 100;
  },
});
