export type EventItems= {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItems[] = [
  {
    title: "React Summit",
    image: "/images/event-full.png",
    slug: "react-summit-2026",
    location: "Amsterdam, NL (also online)",
    date: "March 12–14, 2026",
    time: "09:00 - 18:00 CET"
  },
  {
    title: "JSConf EU",
    image: "/images/event1.png",
    slug: "jsconf-eu-2026",
    location: "Berlin, Germany",
    date: "April 22–24, 2026",
    time: "10:00 - 17:30 CEST"
  },
  {
    title: "KubeCon + CloudNativeCon",
    image: "/images/event2.png",
    slug: "kubecon-cloudnative-2026",
    location: "San Diego, CA, USA",
    date: "May 5–8, 2026",
    time: "09:00 - 18:00 PDT"
  },
  {
    title: "HackMIT",
    image: "/images/event3.png",
    slug: "hackmit-fall-2025",
    location: "Cambridge, MA, USA",
    date: "November 22–24, 2025",
    time: "All day"
  },
  {
    title: "NodeConf EU",
    image: "/images/event4.png",
    slug: "nodeconf-eu-2026",
    location: "Dublin, Ireland",
    date: "June 10–12, 2026",
    time: "09:30 - 17:00 IST"
  },
  {
    title: "DevOpsDays",
    image: "/images/event5.png",
    slug: "devopsdays-global-2026",
    location: "Multiple cities / virtual",
    date: "Various dates 2026",
    time: "Varies by city"
  },
  {
    title: "GraphQL Summit",
    image: "/images/event6.png",
    slug: "graphql-summit-2026",
    location: "San Francisco, CA, USA",
    date: "September 8–9, 2026",
    time: "09:00 - 17:00 PDT"
  }
];