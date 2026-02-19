import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

const DiseaseHeader = ({ user }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          AutoAntibody Database
        </h1>
        <p className="text-gray-600 text-sm">
          Search and explore disease-related autoantibody, autoantigen, and
          epitope data
        </p>
      </div>
      {(user?.role === 'superAdmin' || user?.role === 'Admin') && (
        <Link
          href="/dashboard/disease/add-disease"
          className="inline-flex items-center gap-2 px-4 py-2 text-blue-500 rounded-lg  hover:border-blue-500 hover:border-2 hover:font-bold focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus size={18} />
          Add New Disease
        </Link>
      )}
    </div>
  );
};

export default DiseaseHeader;

