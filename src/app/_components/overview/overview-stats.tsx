"use client";

import OverviewStatCard from "@/components/stat/overview-stat-card";
import { Calendar, Scissor, Profile2User, Money } from "iconsax-react";

const OverviewStats = () => {
  return (
    <div className="px-1 w-full py-1">
      <div
        className="flex items-center mx-auto my-2 p-2 bg-white rounded-xl shadow-lg
                   lg:flex-nowrap overflow-x-auto divide-x divide-gray-200"
      >
        {/* Carte 1 */}
        <div className="flex-1 px-2 min-w-[180px]">
          <OverviewStatCard
            icon={Calendar}
            value="753"
            label="Appointment"
            percentage={25}
            color="#A785F8"
          />
        </div>

        {/* Carte 2 */}
        <div className="flex-1 px-2 min-w-[180px]">
          <OverviewStatCard
            icon={Scissor}
            value="150"
            label="Operations"
            percentage={20}
            color="#F8C785"
          />
        </div>

        {/* Carte 3 */}
        <div className="flex-1 px-2 min-w-[180px]">
          <OverviewStatCard
            icon={Profile2User}
            value="153"
            label="New Patients"
            percentage={10}
            color="#85C7F8"
          />
        </div>

        {/* Carte 4 */}
        <div className="flex-1 px-2 min-w-[180px]">
          <OverviewStatCard
            icon={Money}
            value="$30,862"
            label="Total Income"
            percentage={10}
            color="#85F8A0"
          />
        </div>
      </div>
    </div>
  );
};

export default OverviewStats;
