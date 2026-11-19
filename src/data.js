// All resume content lives here; components only render it.

export const profile = {
  name: ["Onkar", "Singh"],
  roles: ["Major Incident", "Problem", "Change Manager"],
  location: "Gurugram, Haryana, India",
  email: "onkarsingh.k161@gmail.com",
  phone: { display: "+91 96677 15804", value: "+919667715804" },
  linkedin: { display: "linkedin.com/in/onkar-singh", url: "https://www.linkedin.com/in/onkar-singh/" },
  lede: "8+ years keeping enterprise services running for clients in the Americas, Europe and Asia. When a P1 hits, I run the bridge, drive it to root cause, and make sure the next change doesn't cause the next outage.",
};

export const nav = [
  ["profile", "Profile"], ["experience", "Experience"], ["skills", "Skills"],
  ["reach", "Clients"], ["education", "Education"], ["contact", "Contact"],
];

// Sample P1 bridge for the hero console. `min` = minutes since the P1 was raised.
export const consoleLog = [
  { t: "02:14", min: 0, html: '<span class="p1">P1</span> raised · payments API latency' },
  { t: "02:16", min: 2, html: "Bridge opened · 9 resolver teams joined" },
  { t: "02:23", min: 9, html: '<span class="ac">Splunk</span>: error spike traced to latest change' },
  { t: "02:31", min: 17, html: '<span class="wc">Emergency CAB</span> approves rollback' },
  { t: "02:56", min: 42, html: '<span class="okc">Service restored</span> · stakeholders updated', restored: true },
  { t: "03:05", min: 42, html: "Problem record opened · PIR scheduled" },
];

export const industries = [
  "Pharma", "Healthcare", "Banking", "Insurance", "E-commerce", "Automotive", "Retail", "Telecom",
  "Hotel chains & resorts", "Supply chain management", "Cloud & data centre providers",
];
export const marqueeIndustries = [
  "Pharma", "Healthcare", "Banking", "Insurance", "E-commerce", "Automotive", "Retail", "Telecom",
  "Hotels & Resorts", "Supply Chain", "Cloud & Data Centres",
];

export const stats = [
  { n: 8, plus: true, text: "Years in IT operations, all at Genpact" },
  { n: 4, text: "Promotions up the escalation path, P5 to P1" },
  { n: 3, text: "Continents of clients, around the clock" },
  { n: 11, text: "Industries, from pharma to data centres" },
];

export const summary = [
  "Detail-oriented IT Operations professional focused on ", { em: "service continuity" },
  " and keeping business disruption to a minimum. I coordinate cross-functional teams through high-severity incidents with timely communication, efficient resolution and strict SLA adherence, then use data to spot trends, tune processes and drive ",
  { em: "continuous improvement" }, " across IT service delivery.",
];

export const tools = [
  ["ServiceNow", "ITSM · admin"], ["Jira", "tracking"], ["Splunk", "logs · RCA"], ["AppDynamics", "APM"],
  ["Nagios", "monitoring"], ["SolarWinds", "monitoring"], ["ITIL v4", "framework"],
];

export const experience = [
  {
    sev: "p1", tag: "P1 · P2 · Problem · Change", when: "Feb 2023 – Present", current: true,
    title: "Major Incident, Problem & Change Manager", org: "Genpact",
    points: [
      "Lead end-to-end Major Incident, Problem and Change Management for swift restoration and strict SLA adherence.",
      "Prioritise P1 and P2 incidents, coordinating rapid triage, escalation and stakeholder communication.",
      "Monitor infrastructure and applications with Nagios and AppDynamics to stop risks before they escalate.",
      "Work with End User Support, SecOps and Digital Desk, using ServiceNow, Jira and Splunk for tracking, RCA and reporting.",
      "Run bridge calls, post-incident reviews and CAB evaluations with clear risk assessment and preventive actions.",
      "Maintain incident documentation, escalation protocols and process improvements for service resilience.",
    ],
  },
  {
    sev: "p2", tag: "Major incidents", when: "Apr 2022 – Feb 2023",
    title: "Major Incident Manager", org: "Genpact",
    points: [
      "Streamlined incident communication for real-time stakeholder updates during major outages.",
      "Partnered with Problem and Change teams to turn post-incident learnings into lower change risk.",
      "Built incident trend dashboards and metrics to surface recurring issues and improve reliability.",
      "Kept detailed records in ServiceNow and Jira for accurate reporting and ITIL compliance.",
    ],
  },
  {
    sev: "p3", tag: "P3 · P4 · Problem", when: "Apr 2021 – Apr 2022",
    title: "Incident & Problem Manager", org: "Genpact",
    points: [
      "Managed P3–P4 incidents and problem records within SLA and ITIL standards.",
      "Maintained incident and problem workflows in ServiceNow and Jira for audit readiness.",
      "Ran root cause analysis with infrastructure, network and application teams for long-term fixes.",
      "Escalated high-impact cases with clear status reporting across technical teams.",
      "Maintained knowledge articles and validated problem resolutions for trend dashboards.",
    ],
  },
  {
    sev: "p4", tag: "P5 · Monitoring", when: "Jun 2018 – Apr 2021",
    title: "Incident Manager", org: "Genpact",
    points: [
      "Resolved P5 incidents within priority frameworks and SLAs.",
      "Monitored systems in SolarWinds: alerts, dashboards and log checks for early detection.",
      "Mentored L1 analysts on escalation and SOPs; supported L2/L3 teams in major incident triage and RCA.",
    ],
  },
];

export const skills = [
  { size: "b-wide", hot: true, icon: "siren", title: "Major Incident Command",
    text: "Leading bridge calls and crisis coordination for P1/P2 outages: getting the right resolver teams on, keeping stakeholders updated, and handling escalations until service is restored.",
    chips: ["Bridge call leadership", "Crisis coordination", "Escalation handling", "Cross-functional teams"] },
  { size: "b-small", icon: "search", title: "Problem & RCA", text: "Finding the real cause behind recurring incidents and tracking the permanent fix." },
  { size: "b-mid", icon: "branch", title: "Change Management & CAB",
    text: "Coordinating the Change Advisory Board with risk assessment and impact analysis before anything ships.",
    flow: ["RFC", "Risk & impact", "CAB", "Deploy"] },
  { size: "b-mid", icon: "pulse", title: "Monitoring & Observability",
    text: "Automated infrastructure monitoring, application performance and log analytics for early detection.",
    chips: ["Nagios", "AppDynamics", "Splunk", "SolarWinds"] },
  { size: "b-small", icon: "gauge", title: "SLA / KPI Tracking", text: "Measuring response and resolution against targets, and reporting the trends." },
  { size: "b-small", icon: "clipboard", title: "Post-Incident Review", text: "Blameless PIRs that turn every outage into preventive actions." },
  { size: "b-small", icon: "layers", title: "ITIL & ServiceNow", text: "ITIL v4 framework and ServiceNow administration for clean, auditable workflows." },
];

export const regions = [
  { city: "New York", name: "Americas", tz: "America/New_York" },
  { city: "London", name: "Europe", tz: "Europe/London" },
  { city: "Gurugram", name: "Asia", tz: "Asia/Kolkata" },
];

export const education = [
  { title: "PGP, Data Science & Business Analytics", school: "Great Lakes Institute of Management", when: "2021 – 2022" },
  { title: "PGDM", school: "IILM Graduate School of Management", when: "2016 – 2018" },
  { title: "BCA", school: "Comm-IT Career Academy", when: "2012 – 2016" },
];

export const certifications = [
  { seal: "ITIL", title: "ITIL v4 Certification", text: "IT service management" },
  { seal: "AZ", title: "AZ-900: Microsoft Azure Fundamentals", text: "Cloud concepts and services" },
];
