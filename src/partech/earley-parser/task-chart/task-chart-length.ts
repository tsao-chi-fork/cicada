import * as TaskChart from "../task-chart"

export function length(chart: TaskChart.TaskChart): number {
  return chart.task_sets.length
}
