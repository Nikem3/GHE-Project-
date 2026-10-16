const csvCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`
const csvRows = rows => rows.map(r => r.map(csvCell).join(',')).join('\n')

export function buildReportCsv(report, from, to) {
  const t = report.totals
  return [
    csvRows([['Enquiry report', from, to]]),
    csvRows([['Totals'], ['Total', 'Open', 'In progress', 'Resolved', 'Unassigned', 'Avg response (h)'],
      [t.total, t.open, t.in_progress, t.resolved, t.unassigned, t.avgResponseHours]]),
    csvRows([['By course'], ['Course', 'Count'], ...report.byCourse.map(r => [r.course, r.count])]),
    csvRows([['By day'], ['Day', 'Count'], ...report.byDay.map(r => [r.day, r.count])]),
    csvRows([['By staff'], ['Staff', 'Replies', 'Assigned'], ...(report.byStaff ?? []).map(r => [r.staff, r.replies, r.assigned])]),
  ].join('\n\n') + '\n'
}
