import { useEffect, useState } from "react";
import LeaveCard from "./LeaveCard";
import { getMyLeaves } from "../utils/Leave";
import { CalendarDays, FileText, Loader2 } from "lucide-react";

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await getMyLeaves();
      setLeaves(res.leaves || []);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-accent animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            LOADING LEAVES...
          </p>
        </div>
      </div>
    );
  }

  if (leaves.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <CalendarDays className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          No leave applications found
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Apply for leave using the form above
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {leaves.map((leave) => (
        <LeaveCard key={leave._id} leave={leave} />
      ))}
    </div>
  );
};

export default LeaveList;
