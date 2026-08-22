export const siteConfig = {
  name: "MoonAir",
  panelName: "Technician Panel",
  company: "MoonAir Home Appliances Private Limited",
  cin: "U74999UP2021PTC154127",
  gstin: "09AAPCM0906P1ZV",
  tagline: "Made for Indian heat. Backed through ownership.",
  description:
    "Internal service operations platform for MoonAir field technicians.",
  storefrontUrl: "https://moonair.in",
  customerHubUrl: "https://moonair.in/profile",
  /** Official brand logo — sourced from moonair.in */
  logoSrc: "/logo.png",
  logoSourceUrl: "https://www.moonair.in/Logo_.png",
  loginPanelImageSrc: "/login-hero.png",
  /** MoonAir service helpline (toll-free) — jobs, customers, profile, service detail */
  serviceCallNumber: "8006686588",
  /** Footer helpline — kept separate from in-app demo contact numbers */
  footerServiceCallNumber: "8005586588",
  supportPhones: ["1800 668 6588"],
  technicianWorkflow: [
    { step: 1, label: "Assigned", description: "Service request assigned" },
    { step: 2, label: "Visit", description: "On-site customer visit" },
    { step: 3, label: "Inspection", description: "Product condition check" },
    { step: 4, label: "Work", description: "Repair and service" },
    { step: 5, label: "Complete", description: "Customer confirmation" },
  ] as const,
  copyrightYear: 2026,
  appVersion: "0.1.0",
  maxContentWidth: 1440,
  sidebarWidth: 250,
  headerHeight: 64,
} as const;
