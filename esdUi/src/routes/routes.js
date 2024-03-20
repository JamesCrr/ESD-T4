import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import Listings from "@/pages/Listings.vue";
import Bids from "@/pages/Bids.vue";
import CreateAuction from "@/pages/CreateAuction.vue";


const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "user",
        name: "User Profile",
        component: UserProfile,
      },
      {
        path: "listings",
        name: "Listings",
        component: Listings,
      },
      {
        path: "bids",
        name: "Bids",
        component: Bids,
      },
      {
        path: "createAuction",
        name: "CreateAuction",
        component: CreateAuction,
      },
    ],
  },
];

export default routes;
