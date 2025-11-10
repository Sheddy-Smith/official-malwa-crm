export const calculateJobStats = (jobs) => {
  const jobsArray = Array.isArray(jobs) ? jobs : Object.values(jobs || {});

  return {
    total: jobsArray.length,
    inProgress: jobsArray.filter(j => j.status === 'in_progress' || j.status === 'inspection' || j.status === 'estimate' || j.status === 'jobsheet').length,
    completed: jobsArray.filter(j => j.status === 'completed').length,
    pendingApprovals: jobsArray.filter(j => j.estimate?.approvalNeeded).length
  };
};

export const calculateRevenue = (jobs) => {
  const jobsArray = Array.isArray(jobs) ? jobs : Object.values(jobs || {});
  return jobsArray
    .filter(j => j.status === 'completed')
    .reduce((sum, job) => sum + (parseFloat(job.total_amount) || 0), 0);
};

export const calculateExpenses = (jobs, labours, vendors, suppliers) => {
  const jobsArray = Array.isArray(jobs) ? jobs : Object.values(jobs || {});
  const laboursArray = Array.isArray(labours) ? labours : Object.values(labours || {});
  const vendorsArray = Array.isArray(vendors) ? vendors : Object.values(vendors || {});
  const suppliersArray = Array.isArray(suppliers) ? suppliers : Object.values(suppliers || {});

  let total = 0;

  jobsArray.forEach(job => {
    try {
      const jobsheetData = typeof job.jobsheet_data === 'string'
        ? JSON.parse(job.jobsheet_data)
        : job.jobsheet_data;

      if (jobsheetData && jobsheetData.items) {
        jobsheetData.items.forEach(item => {
          total += parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1);
        });
      }

      if (jobsheetData && jobsheetData.extraWork) {
        jobsheetData.extraWork.forEach(item => {
          total += parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1);
        });
      }
    } catch (e) {
      console.error('Error parsing jobsheet data:', e);
    }
  });

  return total;
};

export const calculateMonthlyRevenue = (jobs) => {
  const jobsArray = Array.isArray(jobs) ? jobs : Object.values(jobs || {});
  const monthlyData = {};

  jobsArray
    .filter(j => j.status === 'completed' && j.job_date)
    .forEach(job => {
      const date = new Date(job.job_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, revenue: 0 };
      }

      monthlyData[monthKey].revenue += parseFloat(job.total_amount) || 0;
    });

  return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
};

export const calculateExpenseBreakdown = (jobs, labours, vendors) => {
  const jobsArray = Array.isArray(jobs) ? jobs : Object.values(jobs || {});

  const breakdown = {
    labour: 0,
    vendor: 0,
    materials: 0
  };

  jobsArray.forEach(job => {
    try {
      const jobsheetData = typeof job.jobsheet_data === 'string'
        ? JSON.parse(job.jobsheet_data)
        : job.jobsheet_data;

      if (jobsheetData && jobsheetData.items) {
        jobsheetData.items.forEach(item => {
          const cost = parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1);

          if (item.workBy === 'Labour') {
            breakdown.labour += cost;
          } else if (item.workBy === 'Vendor') {
            breakdown.vendor += cost;
          } else {
            breakdown.materials += cost;
          }
        });
      }
    } catch (e) {
      console.error('Error parsing jobsheet data:', e);
    }
  });

  return [
    { name: 'Labour', value: breakdown.labour },
    { name: 'Vendors', value: breakdown.vendor },
    { name: 'Materials', value: breakdown.materials }
  ].filter(item => item.value > 0);
};

export const formatCurrency = (amount) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toFixed(0)}`;
};
