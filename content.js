/*
  All editable content for the site lives in this file.
  main.js reads window.CONTENT and renders every section from it.
  See README.md for how to add a project.
*/
window.CONTENT = {
  about: {
    paragraphs: [
      "I'm a second year Technical Computer Science student at the University of Twente and the cofounder and technical lead of Hive Setting, a three person startup. I built all of our automation: an AI agent that answers inbound social media DMs, qualifies leads and books sales calls for creators and coaches.",
      "I like work where software replaces a manual process and the result is measurable. I'm looking for internships and roles in AI engineering, automation and software development."
    ],
    languages: "English, Romanian, Russian and basic German"
  },

  // Newest first. "end" can be any text, for example "now".
  timeline: [
    {
      start: "Mar 2026",
      end: "now",
      role: "Cofounder and technical lead",
      org: "Hive Setting",
      detail: "Built the AI appointment setter that has booked 4,300 sales calls for creators and coaches."
    },
    {
      start: "Sep 2025",
      end: "Aug 2028",
      role: "BSc Technical Computer Science",
      org: "University of Twente, Enschede",
      detail: "GPA 8.34 / 10"
    }
  ],

  /*
    Projects render in this order.
    - featured: true gives a project the wide case study layout.
    - status: optional short label, for example "In progress".
    - image: path to a screenshot (16:9 works best). Leave it out to show no image.
    - links: only the links you fill in are shown. Keys: demo, github, caseStudy.
  */
  projects: [
    {
      title: "Hive Setting",
      status: "Case study",
      featured: true,
      summary: "An AI appointment setter for creators and coaches. It answers inbound social media DMs, qualifies leads and books sales calls, and almost every chat runs without a person stepping in.",
      details: [
        {
          heading: "The problem",
          text: "Creators and coaches get more DMs than they can answer. Every slow or missed reply is a sales call that never happens."
        },
        {
          heading: "What I built",
          text: "All of the automation behind the company: an AI agent in Node.js on Linux that holds the conversation, asks qualifying questions and sends a booking link, plus a comment to DM funnel that reaches new commenters within 1 hour."
        },
        {
          heading: "What I fixed",
          text: "Funnel analytics showed that 26% of qualified leads never booked after getting the link. I fixed it with live A/B tests on the opener and the script."
        }
      ],
      // Shown under the funnel bar.
      results: [
        { value: "74%", text: "of leads reply" },
        { value: "99.7%", text: "of chats run without a human taking over" }
      ],
      funnel: {
        total: 30900,
        totalLabel: "30,900+ conversations",
        done: 4300,
        doneLabel: "4,300 booked calls"
      },
      tags: ["JavaScript", "Node.js", "Linux", "LLM APIs", "A/B testing"],
      links: {}
    },
    {
      title: "Mochi",
      image: "assets/mochi.svg",
      imageAlt: "Illustration of a web app with a sign in form and a profile page",
      summary: "A full stack web app built by a team of six at the University of Twente. I integrated everyone's parts, built the authentication module with JUnit tests above 80% coverage, and built the profile page.",
      tags: ["Java", "REST", "Vue.js", "PostgreSQL"],
      links: {}
    }
  ],

  // Number of empty "Coming soon" cards shown after the projects. Set to 0 to hide them.
  comingSoon: 3,

  skills: [
    { group: "Languages", items: ["JavaScript", "Python", "Java", "SQL", "C++"] },
    { group: "Tools and platforms", items: ["Node.js", "Vue.js", "PostgreSQL", "Linux", "Git", "Raspberry Pi"] },
    { group: "Practices", items: ["AI agents", "Automation", "REST APIs", "Testing", "Scrum"] }
  ],

  contact: {
    // The address is stored in parts and assembled in the browser, so it never
    // appears in the page source as a plain address.
    email: ["costelb033", "gmail", "com"],
    linkedin: "https://www.linkedin.com/in/constantinbalan",
    github: "https://github.com/tweekmd",
    cv: "assets/Constantin_Balan_CV.pdf",
    location: "Based in Enschede, Netherlands"
  },

  // The numbers under the hero buttons.
  heroStats: [
    { value: "4,300", label: "sales calls booked" },
    { value: "30,900+", label: "conversations handled" },
    { value: "99.7%", label: "run without a human" }
  ],

  // The simulated conversation in the hero.
  heroChat: {
    lead: { name: "Maya", note: "New follower" },
    messages: [
      { from: "lead", text: "Hey, saw your reel about meal prep. How does your coaching work?" },
      { from: "agent", text: "Glad it helped! Before I explain, what's your main goal right now?" },
      { from: "lead", text: "Lose 8 kg before summer. I always fall off after two weeks" },
      { from: "agent", text: "That's common, and very fixable. Would you want to start in the next month?" },
      { from: "lead", text: "Yes, as soon as possible" },
      { from: "agent", text: "Then a quick call with me is the best next step. Pick a time that suits you:" }
    ],
    slots: ["Wed 11:00", "Thu 14:30", "Fri 16:00"],
    picked: 1,
    booked: { title: "Call booked", detail: "Thursday 14:30, 30 minutes" },
    caption: "A simulated conversation. My agent has run 30,900+ like it and booked 4,300 calls."
  }
};
