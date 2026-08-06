import {
  Building2,
  User,
  Pencil,
  Trash2,
  CalendarDays,
  Users,
  MapPin,
  Clock,
} from "lucide-react";

const DepartmentCard = ({ department, onEdit, onDelete, isAdmin = false }) => {
  // Helper function to get status color
  const getStatusConfig = (status) => {
    const statusMap = {
      Active: {
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-400",
        dot: "bg-emerald-500 dark:bg-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800/30",
      },
      Inactive: {
        bg: "bg-rose-100 dark:bg-rose-900/30",
        text: "text-rose-700 dark:text-rose-400",
        dot: "bg-rose-500 dark:bg-rose-400",
        border: "border-rose-200 dark:border-rose-800/30",
      },
      Pending: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-400",
        dot: "bg-amber-500 dark:bg-amber-400",
        border: "border-amber-200 dark:border-amber-800/30",
      },
    };
    return statusMap[status] || statusMap.Active;
  };

  const statusConfig = getStatusConfig(department.status);

  return (
    <div
      className="
        group
        bg-white
        dark:bg-slate-900
        border
        border-slate-200
        dark:border-slate-800
        rounded-2xl
        shadow-md
        hover:shadow-xl
        hover:-translate-y-1
        hover:border-slate-300
        dark:hover:border-slate-700
        transition-all
        duration-300
        overflow-hidden
        relative
      "
    >
      {/* Decorative gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="p-4 sm:p-5 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div
              className="
                w-11 h-11 sm:w-12 sm:h-12
                rounded-xl sm:rounded-2xl
                bg-gradient-to-br from-blue-100 to-indigo-100
                dark:from-blue-900/30 dark:to-indigo-900/30
                flex
                items-center
                justify-center
                text-blue-600
                dark:text-blue-400
                flex-shrink-0
                group-hover:scale-105
                transition-transform
                duration-300
              "
            >
              <Building2 size={22} className="sm:w-[26px] sm:h-[26px]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  className="
                    text-lg sm:text-xl
                    font-bold
                    text-slate-800
                    dark:text-white
                    truncate
                  "
                >
                  {department.name}
                </h2>
                {department.code && (
                  <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg text-slate-500 dark:text-slate-400">
                    {department.code}
                  </span>
                )}
              </div>
              <p
                className="
                  text-xs sm:text-sm
                  text-slate-500
                  dark:text-slate-400
                  truncate
                "
              >
                Code: {department.code || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={`
                inline-flex items-center gap-1.5
                px-2.5 sm:px-3
                py-1
                rounded-full
                text-[10px] sm:text-xs
                font-semibold
                border
                ${statusConfig.bg}
                ${statusConfig.text}
                ${statusConfig.border}
                transition-all
                duration-300
                group-hover:scale-105
              `}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}
              ></span>
              {department.status || "Active"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div
          className="
            mt-4 sm:mt-5
            p-3 sm:p-4
            rounded-xl sm:rounded-2xl
            bg-gradient-to-br from-slate-50 to-slate-100/50
            dark:from-slate-800/60 dark:to-slate-800/30
            border border-slate-200/50
            dark:border-slate-700/50
            relative
            overflow-hidden
          "
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-2xl"></div>
          <p
            className="
              text-xs sm:text-sm
              leading-relaxed
              text-slate-600
              dark:text-slate-300
              relative
              z-10
            "
          >
            {department.description || "No description available"}
          </p>
        </div>

        {/* Manager & Details Grid */}
        <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Manager */}
          <div
            className="
              flex
              items-center
              gap-3
              p-3
              rounded-xl
              bg-slate-50
              dark:bg-slate-800/40
              border border-slate-200/50
              dark:border-slate-700/50
              transition-all
              duration-300
              group/manager
              hover:bg-slate-100
              dark:hover:bg-slate-800/60
            "
          >
            <div
              className="
                w-8 h-8 sm:w-9 sm:h-9
                rounded-xl
                bg-gradient-to-br from-indigo-100 to-purple-100
                dark:from-indigo-900/30 dark:to-purple-900/30
                flex
                items-center
                justify-center
                text-indigo-600
                dark:text-indigo-400
                flex-shrink-0
                group-hover/manager:scale-105
                transition-transform
                duration-300
              "
            >
              <User size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[10px] sm:text-xs
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                  uppercase
                  tracking-wider
                "
              >
                Manager
              </p>
              <p
                className="
                  text-xs sm:text-sm
                  font-semibold
                  text-slate-800
                  dark:text-white
                  truncate
                "
              >
                {department.manager?.user?.name ||
                  department.manager?.name ||
                  "Not Assigned"}
              </p>
            </div>
          </div>

          {/* Department Stats */}
          <div
            className="
              flex
              items-center
              gap-3
              p-3
              rounded-xl
              bg-slate-50
              dark:bg-slate-800/40
              border border-slate-200/50
              dark:border-slate-700/50
              transition-all
              duration-300
              group/stats
              hover:bg-slate-100
              dark:hover:bg-slate-800/60
            "
          >
            <div
              className="
                w-8 h-8 sm:w-9 sm:h-9
                rounded-xl
                bg-gradient-to-br from-emerald-100 to-teal-100
                dark:from-emerald-900/30 dark:to-teal-900/30
                flex
                items-center
                justify-center
                text-emerald-600
                dark:text-emerald-400
                flex-shrink-0
                group-hover/stats:scale-105
                transition-transform
                duration-300
              "
            >
              <Users size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[10px] sm:text-xs
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                  uppercase
                  tracking-wider
                "
              >
                Employees
              </p>
              <p
                className="
                  text-xs sm:text-sm
                  font-semibold
                  text-slate-800
                  dark:text-white
                "
              >
                {department.employeeCount || 0} members
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            mt-4 sm:mt-5
            pt-4 sm:pt-5
            border-t
            border-slate-200
            dark:border-slate-800
            flex
            flex-col
            sm:flex-row
            justify-between
            items-start
            sm:items-center
            gap-3 sm:gap-4
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2 sm:gap-3
              text-[10px] sm:text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            <div className="flex items-center gap-1.5">
              <CalendarDays size={14} className="sm:w-[15px] sm:h-[15px]" />
              <span>
                Created: {new Date(department.createdAt).toLocaleDateString()}
              </span>
            </div>
            {department.updatedAt && (
              <>
                <span className="hidden xs:inline text-slate-300 dark:text-slate-600">
                  •
                </span>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="sm:w-[15px] sm:h-[15px]" />
                  <span>
                    Updated:{" "}
                    {new Date(department.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </>
            )}
          </div>

          {isAdmin && (
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => onEdit(department)}
                className="
                  flex-1 sm:flex-none
                  inline-flex
                  items-center
                  justify-center
                  gap-1.5 sm:gap-2
                  px-3 sm:px-4
                  py-2
                  rounded-xl
                  bg-gradient-to-r from-blue-500 to-blue-600
                  hover:from-blue-600 hover:to-blue-700
                  text-white
                  text-xs sm:text-sm
                  font-medium
                  transition-all
                  duration-300
                  shadow-md
                  shadow-blue-500/20
                  hover:shadow-lg
                  hover:shadow-blue-500/30
                  active:scale-95
                  group/btn
                "
              >
                <Pencil
                  size={14}
                  className="sm:w-[15px] sm:h-[15px] group-hover/btn:rotate-12 transition-transform duration-300"
                />
                <span>Edit</span>
              </button>

              <button
                onClick={() => onDelete(department._id)}
                className="
                  flex-1 sm:flex-none
                  inline-flex
                  items-center
                  justify-center
                  gap-1.5 sm:gap-2
                  px-3 sm:px-4
                  py-2
                  rounded-xl
                  bg-gradient-to-r from-rose-500 to-rose-600
                  hover:from-rose-600 hover:to-rose-700
                  text-white
                  text-xs sm:text-sm
                  font-medium
                  transition-all
                  duration-300
                  shadow-md
                  shadow-rose-500/20
                  hover:shadow-lg
                  hover:shadow-rose-500/30
                  active:scale-95
                  group/btn
                "
              >
                <Trash2
                  size={14}
                  className="sm:w-[15px] sm:h-[15px] group-hover/btn:rotate-12 transition-transform duration-300"
                />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;
