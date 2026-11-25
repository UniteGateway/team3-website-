"""Long-form content for TEAM3 Solutions: Insights articles and legal policies.

Paragraph strings may contain simple inline HTML (<b>, <a>). Lists are given as
Python lists inside a section's body.
"""

ARTICLES = [
    {
        'slug': 'insight-ai-agents-business-operations',
        'cat': 'ARTIFICIAL INTELLIGENCE',
        'title': 'How AI agents are transforming business operations',
        'cover': 'art-red', 'photo': 'robot_pepper', 'photo2': ('team_office', 'Agents take on repetitive work so teams can focus on judgement and relationships.'),
        'mins': 6,
        'lead': 'Chatbots answer questions. AI agents get work done. Here is what changes when software can research, decide and act — and how to adopt it without losing control.',
        'body': [
            ('From answers to actions', [
                'For most organisations, the first encounter with generative AI was a chat window: ask a question, get a well-written answer. Useful, but limited. The answer still has to be copied somewhere, checked, turned into an email, a report or a task — by a person.',
                'An AI agent closes that gap. It combines a language model with access to tools — your CRM, documents, email, spreadsheets, APIs — and a goal. Instead of producing a paragraph, it can gather information, compare options, draft the output and move it to the next step of a workflow.',
            ]),
            ('Where agents create value first', [
                'The best early candidates are tasks that are frequent, rules-based enough to describe, and tedious enough that people postpone them:',
                ['<b>Research and intelligence</b> — monitoring competitors, summarising markets, preparing briefing notes before meetings.',
                 '<b>Sales support</b> — qualifying inbound leads, enriching records, drafting personalised follow-ups for a salesperson to approve.',
                 '<b>Customer service</b> — answering routine queries from an approved knowledge base and handing complex cases to people with full context.',
                 '<b>Procurement and finance</b> — comparing supplier quotations, reconciling documents and flagging exceptions.',
                 '<b>Management reporting</b> — collecting numbers from several systems into a consistent weekly view.'],
            ]),
            ('Many agents, one team', [
                'Real business processes cross departments, so the next step is <b>multi-agent orchestration</b>: specialist agents — research, sales, finance, marketing — coordinated by an orchestrator that plans the work, delegates tasks and assembles the result. Each agent stays focused and testable, while the system as a whole handles end-to-end workflows.',
            ]),
            ('Governance is not optional', [
                'Agents that can act must be governed. In every TEAM3 deployment we design for control from day one:',
                ['Human approval before sensitive actions such as sending external communications, committing spend or changing records.',
                 'Role-based permissions so an agent can only reach the systems and data its task requires.',
                 'Audit trails that record what each agent did, with which data, and why.',
                 'Ongoing monitoring of quality, cost and performance, with clear owners for each agent.'],
                'Automation should increase accountability, not hide it.',
            ]),
            ('How to start', [
                'Pick one workflow with a measurable outcome — hours saved, response time, conversion rate. Map it step by step, decide where a person must stay in the loop, and pilot a single agent with real but limited data. Measure, refine, then extend to the next workflow. A digital workforce is built one reliable colleague at a time.',
            ]),
        ],
    },
    {
        'slug': 'insight-brand-strategy',
        'cat': 'BRANDING',
        'title': 'Why every business needs a strong brand strategy',
        'cover': 'art-gold', 'photo': 'palette', 'photo2': ('whiteboard', 'Strategy first: positioning workshops turn insight into a clear brand direction.'),
        'mins': 5,
        'lead': 'A logo is a signature. A brand is a reputation. Strategy is what connects the two — and it matters as much to a five-person startup as to an established enterprise.',
        'body': [
            ('A brand lives in the customer’s mind', [
                'A brand is more than a name, symbol or colour. It is the experience, trust and perception that a business creates in the minds of its customers. Every touchpoint — a website, a proposal, a phone call, a delivery — either strengthens that perception or weakens it.',
                'Brand strategy is the deliberate decision about what that perception should be, and the plan to make every touchpoint deliver it consistently.',
            ]),
            ('What a brand strategy defines', [
                ['<b>Positioning</b> — who you serve, what you offer them, and why you rather than the alternatives.',
                 '<b>Audience</b> — the specific people whose decisions matter most, and what they care about.',
                 '<b>Architecture</b> — how the company, its divisions and its products relate to each other.',
                 '<b>Personality and voice</b> — how the brand speaks, so communication feels like one organisation.',
                 '<b>Story</b> — the narrative that explains where you came from and where you are going.'],
            ]),
            ('Why it pays back', [
                'A clear strategy makes every later decision faster: designers know what to express, marketers know whom to target, sales teams know what to emphasise. It allows a business to compete on value rather than price alone, makes recruitment easier, and gives investors and partners a coherent picture of the company.',
                'It also protects consistency as a business grows. When new products, regions or channels are added, the strategy tells you how they fit — instead of each one inventing its own identity.',
            ]),
            ('Signs you need to revisit yours', [
                ['Customers describe you differently from how you describe yourself.',
                 'Your materials look and sound different across teams or channels.',
                 'You have added services or markets that the current brand does not explain.',
                 'Competitors are winning on perception even where your offer is stronger.'],
            ]),
            ('From strategy to market', [
                'At TEAM3 we treat brand strategy as the first step of a complete brand-to-market programme: research and positioning, then naming and identity, then the website, applications and campaigns that bring it to life. The result is a brand that is not only distinctive, but consistently delivered.',
            ]),
        ],
    },
    {
        'slug': 'insight-idea-to-digital-product',
        'cat': 'TECHNOLOGY',
        'title': 'From business idea to scalable digital product',
        'cover': 'art-mesh', 'photo': 'wireframe_tablet', 'photo2': ('ux_sketch', 'Sketches and prototypes test the idea with real users before code is written.'),
        'mins': 6,
        'lead': 'Most failed apps were not badly built — they were built before the idea was tested. A disciplined product process reduces risk at every stage, from first sketch to scale.',
        'body': [
            ('Start with the problem, not the features', [
                'Every successful digital product solves a specific problem for a specific group of people well enough that they change their behaviour. Before writing code, it is worth answering three questions honestly: who has this problem, how do they solve it today, and why would they switch?',
            ]),
            ('The eight stages we follow', [
                ['<b>Idea & feasibility</b> — validate the business opportunity with research and conversations with real users.',
                 '<b>Product strategy</b> — define the core features, the commercial model and what success looks like.',
                 '<b>UI/UX design</b> — map user journeys, build wireframes and test interactive prototypes.',
                 '<b>Architecture</b> — design a technical foundation that can grow: data model, integrations, security.',
                 '<b>Development</b> — build in short iterations so working software can be reviewed early and often.',
                 '<b>Quality assurance</b> — test performance, security and usability, not just whether features work.',
                 '<b>Deployment</b> — launch across the selected platforms with monitoring in place.',
                 '<b>Growth & maintenance</b> — learn from real usage, improve and scale continuously.'],
            ]),
            ('Build the smallest valuable product', [
                'The first release should be the smallest version that delivers real value to a real user — not a demo, and not the complete roadmap. It gets the product into the market sooner, produces evidence about what users actually need, and keeps budget available for what that evidence reveals.',
            ]),
            ('Design for scale without over-building', [
                'Scalability is mostly about sound decisions early: a clean data model, clear separation between components, secure authentication and role-based access, and infrastructure that can grow with demand. For SaaS products, multi-tenancy, subscription billing and onboarding are worth planning from the start, even if they are switched on later.',
            ]),
            ('Where AI fits', [
                'Many new products now include AI features — intelligent search, document understanding, recommendations, assistants. The same discipline applies: start with the user problem, choose the model and approach that fit the requirement and budget, and measure whether the feature genuinely improves the outcome.',
            ]),
            ('The partner question', [
                'Turning an idea into a product requires strategy, design, engineering and marketing working together. Whether you build in-house, with a partner, or both, insist on transparency at each stage — clear milestones, working software you can see, and decisions explained in business terms.',
            ]),
        ],
    },
    {
        'slug': 'insight-ai-customer-acquisition',
        'cat': 'DIGITAL MARKETING',
        'title': 'The future of AI-powered customer acquisition',
        'cover': 'art-ink', 'photo': 'dm_tiles', 'photo2': ('analytics_laptop', 'Faster learning loops: campaigns measured and improved against real conversion data.'),
        'mins': 5,
        'lead': 'AI is changing how customers search, discover and decide. The businesses that win will combine automation with genuine relevance — and respect for the customer’s attention and consent.',
        'body': [
            ('Search is changing shape', [
                'Customers increasingly ask AI assistants for recommendations as well as typing keywords into search engines. Visibility now depends on being a clear, credible, well-structured source of information: content that answers real questions, consistent business information across the web, and a website that is fast, accessible and technically sound.',
            ]),
            ('Personalisation at scale', [
                'AI makes it practical to tailor messages to segments that would once have been too small to address individually — by industry, role, stage of the buying journey or past behaviour. Done well, this means fewer, more relevant messages rather than more noise.',
                ['Audience segmentation based on behaviour and intent, not only demographics.',
                 'AI-assisted content creation, reviewed by people for accuracy and brand voice.',
                 'Automated campaign workflows that respond to what each prospect actually does.',
                 'Customer journey optimisation using real conversion data.'],
            ]),
            ('Faster learning loops', [
                'The real advantage of AI in marketing is speed of learning. Creative variations, landing pages and audience hypotheses can be produced and tested faster, so budgets move towards what works sooner. The discipline of clear goals and honest measurement matters more, not less.',
            ]),
            ('Trust is the constraint', [
                'Every channel — email, WhatsApp Business, social, paid media — depends on permission and trust. Consent-based communication, transparent use of data and respect for frequency are not just compliance requirements; they are what keep channels effective over time.',
            ]),
            ('What to do now', [
                ['Audit how your business appears in search and AI assistant answers today.',
                 'Consolidate customer data so personalisation is based on reliable information.',
                 'Pilot AI-assisted content and campaign automation on one channel, with human review.',
                 'Define the metrics that matter — qualified leads, cost per acquisition, lifetime value — and report on them consistently.'],
                'AI will not replace a clear proposition or a strong brand. It amplifies whichever one you have.',
            ]),
        ],
    },
]


LEGAL = [
    ('privacy', 'Privacy Policy', [
        ('Who we are', ['This website is operated by TEAM3 Solutions, Hyderabad, India (“TEAM3”, “we”, “us”). This policy explains how we collect, use and protect personal data when you visit this website or contact us. We aim to comply with applicable data protection law, including India’s Digital Personal Data Protection Act, 2023.']),
        ('What we collect', ['We collect only the information you choose to give us through our forms — for example your name, company, email address, phone or WhatsApp number, location, the service you are interested in, your message, and any portfolio or profile links you share. We do not ask for sensitive personal data through this website.',
                             'Our web host may automatically record standard technical information such as IP address, browser type and pages requested, for security and reliability purposes.']),
        ('How we use it', [['To respond to enquiries, meeting requests, partner registrations and career profiles.', 'To prepare proposals and deliver services you have requested.', 'To keep records of our communication with you.', 'To protect the website against misuse and fraud.'],
                           'We do not sell your personal data. We will only send you marketing communication where you have agreed to receive it, and you can withdraw that consent at any time.']),
        ('Sharing', ['We may share data with service providers who help us operate the website, forms and communication tools, under obligations of confidentiality. We may also disclose data where required by law.']),
        ('International visitors', ['We welcome enquiries from around the world. If you contact us from outside India — including from the European Economic Area or the United Kingdom — your details are processed in India for the purpose of responding to you. Where laws such as the EU/UK General Data Protection Regulation apply, we process enquiry data on the basis of your consent and our legitimate interest in responding to business requests, and you may exercise the rights those laws give you by contacting us.']),
        ('Retention', ['We keep enquiry and recruitment data only for as long as needed for the purpose it was provided for, or as required by law, and then delete or anonymise it.']),
        ('Your rights', ['Subject to applicable law, you may ask to access, correct or erase your personal data, withdraw consent, or raise a grievance about how it has been handled. To do so, please contact us through the <a class="red" href="contact.html">contact page</a>.']),
        ('Changes', ['We may update this policy from time to time. The latest version will always be published on this page.']),
    ]),
    ('terms', 'Terms of Use', [
        ('Acceptance', ['By using this website you agree to these terms. If you do not agree, please do not use the website.']),
        ('Website content', ['Content on this website is provided for general information about TEAM3 and its services. It does not constitute a binding offer. Services, timelines and commercial terms are agreed only in a written proposal or contract.',
                             'Tools such as the project scope estimator and service recommender give indicative guidance only.']),
        ('Intellectual property', ['The TEAM3 name, footprint symbol, logo, tagline “Step beyond imagination.”, and the design and content of this website are the property of TEAM3 Solutions or its licensors. They may not be copied or used without our written permission. Names of clients and third-party products belong to their respective owners.']),
        ('Acceptable use', ['You agree not to misuse the website — for example by attempting unauthorised access, submitting false information, sending spam through our forms, or interfering with its operation.']),
        ('Photography and imagery', ['Stock photography on this website is sourced from Unsplash and used under the Unsplash License, which permits free commercial use. Product interface images are illustrative designs created by TEAM3. Archive photographs and publications are from the TEAM3 company archive.']),
        ('Third-party links', ['The website may link to third-party sites. We are not responsible for their content or practices.']),
        ('Liability', ['We take care to keep the website accurate and available, but it is provided “as is”. To the extent permitted by law, TEAM3 is not liable for losses arising from use of, or inability to use, the website.']),
        ('Governing law', ['These terms are governed by the laws of India. The courts at Hyderabad, Telangana shall have jurisdiction.']),
    ]),
    ('cookies', 'Cookie Policy', [
        ('Our approach', ['This website does not use advertising or tracking cookies, and does not set cookies for analytics.']),
        ('Third-party services', ['This website makes no requests to third-party servers: fonts, images and scripts are all served from our own domain. Because no non-essential cookies or trackers are used, no cookie banner is required. If we add analytics or other third-party services in the future, we will update this policy and, where required, ask for your consent first.']),
        ('Browser storage', ['The website does not store personal data in your browser. The TEAM3 Assistant keeps its conversation only in the open page and discards it when you leave.']),
        ('Managing cookies', ['You can block or delete cookies at any time through your browser settings.']),
    ]),
    ('responsible-ai', 'Responsible AI Policy', [
        ('Our commitment', ['TEAM3 develops sustainable and ethical solutions. We use artificial intelligence to amplify people, not to replace accountability. Every AI system and agent we deliver is designed around the following principles.']),
        ('Principles', [['<b>Human oversight</b> — human approval for sensitive actions, and clear owners for every AI system.',
                         '<b>Least privilege</b> — role-based permissions so agents access only the data and systems their task requires.',
                         '<b>Traceability</b> — audit trails that record what an agent did, with which data, and why.',
                         '<b>Data protection</b> — confidentiality and privacy by design; client data is not used to train third-party models without explicit agreement.',
                         '<b>Transparency</b> — people are told when they are interacting with an AI system, and outcomes are explained where possible.',
                         '<b>Fairness and safety</b> — testing for bias, errors and misuse before and after deployment.',
                         '<b>Continuous monitoring</b> — ongoing measurement of quality, cost and performance, with the ability to pause any agent.']]),
        ('Model selection', ['We select AI technologies based on each client’s business requirements, security needs, budget and operational objectives, and we document those choices.']),
        ('This website', ['The TEAM3 Assistant on this website is a guided enquiry tool. It follows pre-written rules to point you to relevant services and does not store your conversation.']),
    ]),
]


# Products built by TEAM3 (Collabiz & Unite Group platforms).
# (slug, name, tagline, category, icon, description, features, audience)
PRODUCTS = [
    ('collabiz', 'COLLABIZ', 'Intelligent business collaboration platform', 'Collaboration', 'users',
     'A shared workspace where businesses, partners and freelancers discover opportunities, form teams and deliver projects together.',
     ['Opportunity discovery and protected leads', 'Partner onboarding and profiles', 'Project collaboration workspaces', 'Commission and referral tracking'],
     'Agencies, consultants and partner networks'),
    ('leaddna', 'LeadDNA', 'Business opportunity and lead intelligence', 'Sales intelligence', 'search',
     'Finds, enriches and scores business opportunities, so sales teams spend their time on the leads most likely to convert.',
     ['AI-assisted lead discovery', 'Company and contact enrichment', 'Lead scoring and intent signals', 'CRM export and alerts'],
     'B2B sales and business development teams'),
    ('solbid', 'SOLBID', 'Solar procurement and bidding marketplace', 'Renewable energy', 'sun',
     'Connects solar buyers with installers and suppliers through transparent, structured bidding.',
     ['Post project requirements once', 'Comparable bids from listed vendors', 'Side-by-side quotation comparison', 'Procurement workflow and documents'],
     'Homeowners, businesses and solar EPC companies'),
    ('adbuz', 'ADBUZ', 'Influencer and advertising marketplace', 'Marketing', 'megaphone',
     'Brings brands, creators and media owners together to plan, buy and measure campaigns.',
     ['Creator and media discovery', 'Campaign briefs and bidding', 'Content review and approvals', 'Campaign performance reporting'],
     'Brands, agencies, creators and media owners'),
    ('unite-exim', 'UNITE EXIM', 'International trade and sourcing platform', 'Global trade', 'globe',
     'Helps importers and exporters find buyers, suppliers and markets, and manage trade enquiries in one place.',
     ['Buyer and supplier discovery', 'Product sourcing requests', 'Market and trade research', 'Enquiry and RFQ management'],
     'Importers, exporters and sourcing teams'),
    ('bizo', 'BIZO', 'AI-powered business intelligence', 'Analytics & AI', 'chart',
     'Turns data from across the business into dashboards, forecasts and plain-language answers.',
     ['Unified business dashboards', 'Demand and sales forecasting', 'Ask-your-data AI assistant', 'Automated management reports'],
     'Business owners, management and finance teams'),
    ('sungate', 'SUNGATE', 'Community energy management platform', 'Energy', 'bulb',
     'Lets communities, campuses and housing societies monitor, share and optimise solar generation and energy use.',
     ['Real-time generation and consumption monitoring', 'Community energy overview', 'Alerts and maintenance tracking', 'Savings and performance reports'],
     'Housing societies, campuses and energy communities'),
    ('prizo', 'PRIZO', 'Intelligent buyer-side negotiation platform', 'Procurement & AI', 'bank',
     'Helps buyers secure better prices by comparing quotes and negotiating with suppliers, supported by data and AI.',
     ['Multi-supplier quote requests', 'Price benchmarking', 'AI negotiation assistant', 'Approval workflows and savings tracking'],
     'Procurement teams and growing businesses'),
    ('hnw', 'HNW', 'Health and wealth membership ecosystem', 'Membership', 'heart',
     'A membership platform that brings health and financial-wellbeing services together for members and their families.',
     ['Membership plans and digital cards', 'Network of partner services', 'Member app and benefits', 'Renewals and member engagement'],
     'Individuals, families and employers'),
    ('beyou', 'BEYOU', 'Inclusive community support platform', 'Community', 'shield',
     'A safe, inclusive space where people can find community, support and resources.',
     ['Community groups', 'Resource and support directory', 'Moderated, privacy-first design', 'Events and programmes'],
     'Individuals, support organisations and NGOs'),
]
