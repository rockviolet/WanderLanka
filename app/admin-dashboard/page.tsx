"use client";
import React, { useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  MapPin,
  Star,
  ScrollText,
  UserRoundCog,
  PanelLeft,
} from "lucide-react";
import AdminClients from "../(components)/admin/AdminClients";
import AdminGuides from "../(components)/admin/AdminGuides";
import AdminDestinations from "../(components)/admin/AdminDestinations";
import AdminReviews from "../(components)/admin/AdminReviews";
import AdminGuideReviews from "../(components)/admin/AdminGuideReviews";

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("clients");

  const sidebarItems = [
    {
      value: "clients",
      label: "Client Management",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      value: "tourGuides",
      label: "Tour Guide Management",
      icon: <UserRoundCog className="mr-2 h-4 w-4" />,
    },
    {
      value: "destinations",
      label: "Destination Management",
      icon: <MapPin className="mr-2 h-4 w-4" />,
    },
    {
      value: "reviews",
      label: "Review Management",
      icon: <Star className="mr-2 h-4 w-4" />,
    },
    {
      value: "guideReviews",
      label: "Guide Reviews",
      icon: <ScrollText className="mr-2 h-4 w-4" />,
    },
  ];

  const renderContent = () => {
    const contentMap = {
      clients: <AdminClients />,
      tourGuides: <AdminGuides />,
      destinations: <AdminDestinations />,
      reviews: <AdminReviews />,
      guideReviews: <AdminGuideReviews />,
    };

    return contentMap[activeTab];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-md p-4">
        <div className="flex items-center mb-8">
          <PanelLeft className="mr-2 h-6 w-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={`
                w-full flex items-center p-2 rounded-lg transition-colors duration-200
                ${
                  activeTab === item.value
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-hidden">
        <ScrollArea className="h-full w-full pr-4">
          {renderContent()}
        </ScrollArea>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
