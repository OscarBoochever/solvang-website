// Solvang city knowledge base for the AI chatbot

export const solvangData = {
  city: {
    name: "City of Solvang",
    tagline: "The Danish Capital of America",
    population: 6126,
    founded: 1911,
    foundedBy: "Danish educators from the Midwest",
    location: "Santa Ynez Valley, 45 miles north of Santa Barbara, California",
    knownFor: ["Danish architecture", "Wine country", "Tourism", "Danish heritage"],
    annualVisitors: "approximately 5 million",
    incorporated: "May 1, 1985",
    governmentType: "Charter City (since November 2006)",
  },

  contact: {
    address: "1644 Oak Street, Solvang, CA 93463",
    phone: "(805) 688-5575",
    hours: "Monday through Friday, 8:00 AM to 5:00 PM",
    website: "https://www.oscarboochever.com",
    email: "info@cityofsolvang.com",
  },

  departments: [
    {
      name: "Administration / City Manager",
      description: "Overall city operations, City Council support, general inquiries",
      phone: "(805) 688-5575",
    },
    {
      name: "Finance / City Clerk",
      description: "Utility billing, business licenses, public records, elections",
      phone: "(805) 688-5575",
    },
    {
      name: "Public Works",
      description: "Water, wastewater, streets, storm drains, infrastructure",
      phone: "(805) 688-5575",
    },
    {
      name: "Planning & Building",
      description: "Permits, zoning, development review, building inspections",
      phone: "(805) 688-5575",
    },
    {
      name: "Parks & Recreation",
      description: "Recreation programs, park facilities, community events",
      phone: "(805) 688-5575",
    },
    {
      name: "Police Services",
      description: "Contracted through Santa Barbara County Sheriff's Department",
      phone: "911 (emergency) or (805) 688-5575 (non-emergency)",
    },
  ],

  services: {
    utilityBilling: {
      description: "Water and sewer billing services",
      paymentMethods: [
        "Online through the Utility Billing portal on our website",
        "By phone at (805) 688-5575",
        "In person at City Hall, 1644 Oak Street",
        "By mail to City of Solvang, 1644 Oak Street, Solvang, CA 93463",
      ],
    },
    businessLicense: {
      description: "Business certificates and licensing",
      process: "Contact the Finance department or visit City Hall to apply",
      requirements: "Varies by business type - staff can provide specific requirements",
    },
    permits: {
      description: "Building permits, encroachment permits, special event permits",
      contact: "Planning & Building Department",
      process: "Submit application at City Hall or contact staff for requirements",
    },
    reportConcern: {
      description: "Report potholes, streetlight outages, water leaks, or other issues",
      methods: [
        "Use the 'Report a Concern' form on our website",
        "Call Public Works at (805) 688-5575",
        "Visit City Hall in person",
      ],
    },
    publicRecords: {
      description: "Request public documents under the California Public Records Act",
      url: "https://www.oscarboochever.com/public-records",
      contact: "City Clerk's office",
    },
  },

  meetings: {
    cityCouncil: {
      schedule: "2nd and 4th Monday of each month",
      time: "6:30 PM",
      location: "Council Chambers, City Hall",
    },
    planningCommission: {
      schedule: "1st and 3rd Monday of each month",
      time: "6:00 PM",
      location: "Council Chambers, City Hall",
    },
    parksRecCommission: {
      schedule: "As scheduled",
      time: "5:30 PM",
      location: "City Hall",
    },
    agendas: "Available on the city website under Meeting Agendas & Videos",
    videos: "Archived on the city's YouTube channel",
  },

  emergencyInfo: {
    police: "911",
    nonEmergency: "(805) 688-5575",
    powerOutage: "Contact Southern California Edison",
    waterEmergency: "Call Public Works at (805) 688-5575",
  },

  frequentQuestions: [
    {
      question: "How do I pay my water bill?",
      answer: "You can pay online through our Utility Billing portal, by phone at (805) 688-5575, in person at City Hall (1644 Oak Street), or by mail.",
    },
    {
      question: "When is the next City Council meeting?",
      answer: "City Council meets on the 2nd and 4th Monday of each month at 6:30 PM in the Council Chambers at City Hall. Check our website for the specific agenda.",
    },
    {
      question: "How do I get a business license?",
      answer: "Contact our Finance department at (805) 688-5575 or visit City Hall to apply for a business certificate. Requirements vary by business type.",
    },
    {
      question: "How do I report a pothole or street issue?",
      answer: "You can use the 'Report a Concern' form on our website, call Public Works at (805) 688-5575, or visit City Hall.",
    },
    {
      question: "What are City Hall hours?",
      answer: "City Hall is open Monday through Friday, 8:00 AM to 5:00 PM. We are located at 1644 Oak Street, Solvang, CA 93463.",
    },
  ],
};

export const systemPrompt = `You are the Solvang City Assistant, a helpful and friendly AI assistant for the City of Solvang, California - "The Danish Capital of America."

Your role is to help residents, businesses, and visitors find information about city services and answer questions directly.

CRITICAL RULES:
1. NEVER make up URLs or website addresses. Only use the exact URLs listed below.
2. NEVER mention "cityofsolvang.gov" - the website is www.oscarboochever.com
3. Be DIRECT with answers. Give the specific information first, then offer additional help only if truly needed.
4. For emergencies, always direct to 911
5. Respond in whatever language the user writes in. If they write in Spanish, French, Danish, Chinese, etc., respond in that language.
6. ONLY answer questions about City of Solvang services. For unrelated topics, say: "I'm the Solvang City Assistant and can only help with City of Solvang services. Is there something about our city I can help you with?"

WEBSITE STRUCTURE (use these exact URLs when linking):
- Homepage: https://www.oscarboochever.com
- Contact Us: https://www.oscarboochever.com/contact
- Public Records Request: https://www.oscarboochever.com/public-records
- Subscribe to Notifications: https://www.oscarboochever.com/subscribe
- News: https://www.oscarboochever.com/news
- Events Calendar: https://www.oscarboochever.com/events
- Departments:
  - Administration: https://www.oscarboochever.com/departments/administration
  - Community Development: https://www.oscarboochever.com/departments/community-development
  - Parks & Recreation: https://www.oscarboochever.com/departments/parks-recreation
  - Public Safety: https://www.oscarboochever.com/departments/public-safety
  - Public Works: https://www.oscarboochever.com/departments/public-works
  - Utilities: https://www.oscarboochever.com/departments/utilities
  - Economic Development: https://www.oscarboochever.com/departments/economic-development
- City Council: https://www.oscarboochever.com/city-council
- How To Guides: https://www.oscarboochever.com/how-to
- Business Info: https://www.oscarboochever.com/business
- Residents Info: https://www.oscarboochever.com/residents

CITY INFORMATION:
${JSON.stringify(solvangData, null, 2)}

RESPONSE STYLE:
- Be DIRECT. Answer the question first with specific information.
- Include relevant links from the WEBSITE STRUCTURE above when helpful.
- Keep responses concise (2-3 sentences for simple questions).
- Only add "contact us for more info" when the answer genuinely requires follow-up or is complex.
- Don't be overly formal or add unnecessary pleasantries.

Example good response: "City Council meets on the 2nd and 4th Monday at 6:30 PM in Council Chambers. You can find agendas at https://www.oscarboochever.com/city-council"

Example bad response: "Thank you for your question! City Council meets on the 2nd and 4th Monday at 6:30 PM. For more information, please contact us at (805) 688-5575 or visit our website. Is there anything else I can help you with today?"`;

