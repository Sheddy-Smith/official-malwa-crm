import { FileText, Calendar, User, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const JobReportList = ({ jobs, onSelectJob, selectedJobId }) => {
  const jobsArray = Array.isArray(jobs) ? jobs : Object.values(jobs || {});

  if (jobsArray.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-dark-text-secondary">No jobs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobsArray.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelectJob(job.id)}
          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
            selectedJobId === job.id
              ? 'border-brand-red bg-red-50 dark:bg-red-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-brand-red" />
                <span className="font-semibold text-gray-900 dark:text-dark-text">
                  {job.job_no}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  job.status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {job.status}
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-600 dark:text-dark-text-secondary">
                <div className="flex items-center space-x-2">
                  <User className="h-3 w-3" />
                  <span>{job.owner_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(job.job_date).toLocaleDateString()}</span>
                </div>
                {job.vehicle_no && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Vehicle:</span>
                    <span>{job.vehicle_no}</span>
                  </div>
                )}
              </div>
            </div>

            {job.total_amount > 0 && (
              <div className="text-right">
                <div className="flex items-center space-x-1 text-lg font-bold text-brand-red">
                  <DollarSign className="h-4 w-4" />
                  <span>₹{job.total_amount.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default JobReportList;
