/**
 * Recommendations received on LinkedIn (and anonymous peer reviews from Twitch).
 *
 * LinkedIn offers no API for these, so they are maintained by hand. Order here doesn't
 * matter: the site shows them newest first, by `date`.
 */
export interface Recommendation {
  name: string;
  role: string;
  company: string;
  /**
   * When it was written (YYYY-MM-DD), as listed on LinkedIn. Never shown; only used for ordering.
   * Anonymous reviews use the last day of the month I left that company.
   * An empty string means the date isn't known yet; those count as the oldest.
   */
  date: string;
  text: string;
}

const all: Recommendation[] = [
  {
    name: "Matt Burdick",
    role: "Senior Engineering Manager",
    company: "LinkedIn",
    date: "2026-06-25",
    text: "Jordan was a key contributor to my UI Infra team, consistently demonstrating care and thoughtfulness in his work. He led several complex infrastructure initiatives, including in one instance an analysis of our repo structure. His recommendation to consolidate our numerous repositories into a leaner, more efficient set substantially increased iteration speed for a 60-developer team, significantly boosting overall productivity. He also organized regular tech meetups. I highly recommend him, as I truly valued his exceptional communication skills and meticulous attention to detail across all his projects.",
  },
  {
    name: "Victor Correa",
    role: "Staff Software Engineer",
    company: "LinkedIn",
    date: "2026-05-22",
    text: "I had the chance to work with Jordan for almost 4 years at LinkedIn and he was a reference for me since the beginning. His vast and deep knowledge of web development, sense of community building, and enthusiasm for engaging in technical and process discussions made him a person I could trust and rely on for partnering on greater initiatives. Most recently, I witnessed firsthand how he was able to adapt to a new scope (and type) of work, which took us both away from front-end development and into backend/prompt tuning tasks. Jordan was able to ramp up quickly and still find ways to improve future onboarding for others by automating tasks and documenting knowledge. He delivered high-quality work that was key to driving insights about user behavior and helping focus on initiatives that had a higher impact. I learned a lot from Jordan as a teammate and as a person. He doesn't shy away from healthy discussions to make things better and supports others in bringing their own perspectives and contributions forward. Any team and company will be lucky to have him, not only for his technical expertise but also for the way he builds community.",
  },
  {
    name: "Abilash Badri",
    role: "Software Engineering Manager",
    company: "LinkedIn",
    date: "2026-05-20",
    text: "I had the pleasure of managing Jordan Hawker directly, and I would highly recommend him. Jordan brings deep expertise in UI infrastructure, especially around Ember, where he was a go-to subject matter expert for the team. During his time reporting to me, he consistently focused on improving developer experience, code quality, and engineering velocity. He is a strong communicator, highly professional. Jordan was often the first person engineers went to with Ember-related questions, and he always made time to help others understand the system better. Beyond his technical depth, Jordan strongly advocated for engineering craft. He led and supported several code cleanup and quality initiatives that helped improve the maintainability of the codebase. He also mentored junior engineers and interns, contributing meaningfully to their growth and confidence. Jordan would be a strong addition to any team looking for a thoughtful, experienced UI engineer who cares deeply about craft, developer productivity, and helping others succeed.",
  },
  {
    name: "Victoria Shi",
    role: "Senior Software Engineer",
    company: "LinkedIn",
    date: "2026-05-15",
    text: "Jordan has been my teammate at LinkedIn for many years. When I think about what makes working with Jordan special, it's not just that he's deeply knowledgeable in all things frontend and web (although he is), or that he is passionate about maintaining high code quality and craftsmanship (although he is), or that he's a team player, a hard worker, and outspoken about the things that matter (although, of course, all these things are true). In my opinion, what makes Jordan exceptional is his generosity with people. He is the first person to jump on a general question on Slack, sharing his knowledge to unblock others. He is a person who junior engineers feel comfortable to approach to ask their questions. He shares his technical expertise and his time with people, whether on his team or not, in his organization or not. I have learned from him communication and project management skills, not just engineering knowledge. He makes everyone better at their job, and that's invaluable. I highly recommend him for any role.",
  },
  {
    name: "Phil Zhang",
    role: "Senior Software Engineer",
    company: "LinkedIn",
    date: "2026-05-14",
    text: "Jordan is an engineer I’ve learned a lot from, both in engineering craft and in how to approach work with care. He has a strong commitment to quality, pays close attention to details, and consistently raises the bar for the team. What stands out to me is not only his technical depth, but also how much he cares about people, collaboration, and building things the right way. I really enjoyed working with him and would highly recommend him to any team.",
  },
  {
    name: "Zhuowei Li",
    role: "Staff Software Engineer",
    company: "LinkedIn",
    date: "2026-05-13",
    text: "During our time working together, Jorden consistently delivered high-quality work. I especially appreciated his attention to detail, thoughtful communication, and willingness to collaborate closely with cross-functional partners. I’m happy to work with him and highly recommend him to any team in future.",
  },
  {
    name: "Yang Piao",
    role: "Staff Software Engineer",
    company: "LinkedIn",
    date: "2026-05-13",
    text: "I’ve had the pleasure of working with Jordan on the same team for over 4 years, and he is one of the people that I’ve had the most fun working with. Jordan has exceptional technical skills in web development. He was seen by many as the go-to person to consult about UI development and the Ember.js ecosystem, because he's not just knowledgeable but also very good at teaching/mentoring others and helping them grow. Many engineers, including me, have learned great things from him and are very grateful. Jordan is passionate about code quality and craft. His willingness to tackle \"unattractive\" work to improve the infrastructure and health of our code base is inspiring to me. His attention to details is also outstanding. He's definitely a great teammate that'll help a team succeed. Outside of work, Jordan's fun to talk to. I've had good times chatting with him on various topics, and I think I'll particularly miss his BBQ talks. I enjoyed working with Jordan. May our paths cross again.",
  },
  {
    name: "Alex Vovchuk",
    role: "Staff Software Engineer",
    company: "LinkedIn",
    date: "2026-05-13",
    text: "I had the pleasure of working with Jordan Hawker at LinkedIn Talent Solutions, and he is one of the strongest engineers I’ve worked with. Jordan is the go-to person for solving complex technical problems and for architectural guidance. If a problem is unclear or challenging, he’s the one people turn to - he consistently finds the right solution, balancing deep technical insight with practical judgment. He played a key role in shaping dependency management and AI productivity systems within LinkedIn Hiring Solutions, raising the bar for both architecture and execution. What stands out most is his clarity of thought - discussing complex problems with him is always efficient and insightful, and he reliably drives toward the best outcome.",
  },
  {
    name: "Kevin Suen",
    role: "Staff Frontend Engineer",
    company: "LinkedIn",
    date: "2026-05-13",
    text: "A bright spot in a storm sea. I worked with Jordan in the Talent Solutions organization where he was a subject matter expert in Ember/JavaScript he helped drive several complex migrations and continued to support a application in constant transition. He consistently provided clear guidance to complex problems often times outside his domain of expertise. I would recommend him for any team and not just frontend, his capability, flexibility, and communication skills effortless outclassed many other I've worked with in the past.",
  },
  {
    name: "Jason Edelman",
    role: "Senior UI Engineer",
    company: "LinkedIn",
    date: "2025-02-02",
    text: "Working with Jordan was an absolute pleasure. He's extremely knowledgeable and will bend over backwards to help you should you need it. With his support, I was able to push org-level code that affected the hygiene of the codebase. Can't recommend him enough!",
  },
  {
    name: "Nikko Bautista",
    role: "Director, Product Security",
    company: "Confluent",
    date: "2025-01-17",
    text: "I worked with Jordan at LinkedIn as he was one of our most senior FE engineers in the Talent Solutions organization. Jordan provided a clear vision of what our FE landscape should look like, based on his vast experience which made him an incredible asset to the organization. He mentored and worked with multiple FE engineers from my team on Ember.js fundamentals and helped accelerate their growth and execution. Would full heartedly recommend working with Jordan! I enjoyed my team collaborating with him at Linkedin.",
  },
  {
    name: "Eric Shirley",
    role: "Founding Engineer",
    company: "Stealth Startup",
    date: "2025-01-08",
    text: "I had the pleasure of working with Jordan at LinkedIn. Jordan possesses strong opinions grounded in experience, making him a valuable resource for technical discussions. He was an exceptional teacher, patiently explaining concepts and guiding me through challenging initiatives. His extensive network within the Ember.js ecosystem facilitated collaborations and accelerated our team's projects. As my mentor, Jordan helped choose projects that challenged me and introduced me to key individuals within the Ember community. As my teammate, we worked together on large infrastructure projects such as migrating large swaths of code to new paradigms, conducting developer surveys to improve our infra team alignment with the engineers we served, and rolling out code quality improvements for fixing linting issues.",
  },
  {
    name: "Chris Krycho",
    role: "Principal Software Engineer",
    company: "Vanta",
    date: "2025-01-08",
    text: "Jordan is a passionate developer who is always looking for ways to imporve the product he works on, especially by leveling up other developers and their tools—including a willingness to take on unglamorous projects that can take months to get across the finish line but have a huge impact on developer productivity and engineering efficiency.",
  },
  {
    name: "Peter Shatara",
    role: "Software Engineer Technical Lead",
    company: "Snap Inc",
    date: "2024-12-20",
    text: "I had the pleasure of working with Jordan for 2 years while at LinkedIn, and can confidently say that he's the type of engineer any organization would benefit from having on their team. He's an all around fantastic team mate, who has identified and solved large scale infrastructure challenges, that had far reaching benefits to the LinkedIn Talent Solutions organization. He's an expert at understanding the needs of an organization and translating that into impactful engineering initiatives. As a mentor, Jordan is passionate about his craft, and found every opportunity he could to share his knowledge with the team at large. Both in large forums, or one on one, Jordan's an excellent communicator who works tirelessly to up-level his teammates. He's a wealth of information, and has a talent for looking at a topic from multiple angles; patiently working with his teammates to ensure they've developed a deep understanding of a problem space, options for approaching that problem, and weighing out solutions. He has helped me personally to rethink how I approach problem solving, considering more broadly the long term business and technical impact of my decision making. I am absolutely a better engineer for having the opportunity to work with Jordan.",
  },
  {
    name: "Agustin Vaca",
    role: "Software Engineer",
    company: "Microsoft",
    date: "2024-12-16",
    text: "I was lucky to have Jordan as my mentor during my internship at LinkedIn, and he was without a doubt the biggest driver of my growth and success. He is not only an outstanding engineer but also a remarkable mentor. I was a complete beginner to many of the technologies we were using. His mastery of frontend technologies was evident during every interaction. The constant guidance he offered helped me navigate all of the challenges I faced, and his constructive feedback pushed me to better myself. Beyond technical ability, what struck me the most was his patience and dedication. Despite a demanding schedule, he always made time to answer my questions, review my code, and offer general advice. He created a safe and encouraging environment that allowed me to experiment, learn, and grow. Also, his ability to communicate is a skill I'll strive to gain during my career. He was consistently clear, empathic, and confident when expressing himself. I am immensely grateful for the opportunity to learn from Jordan. His passion and care for his work and those he mentors truly sets him apart as an amazing professional.",
  },
  {
    name: "Biing-Yann Hsiung",
    role: "Engineering Director",
    company: "OKX",
    date: "2024-12-15",
    text: "I had the pleasure of getting to know Jordan Hawker when we both worked as web engineers at LinkedIn (circa 2018–2021). Even before he joined, I recall being impressed by his depth of computer science knowledge during the interview process. I initially recommended considering him for a Senior Engineer role, but after seeing his breadth of understanding and skill, I urged the team to scale the position up to Staff level. One interesting point about Jordan is his background in the Ember.js community—back then, Twitch (where he was heavily involved) was known to use Ember extensively. His passion for Ember and the broader web ecosystem made LinkedIn a natural fit, given its active engineering community and extensive frontend frameworks. Although we didn’t work together on any specific product features at LinkedIn, Jordan found other ways to stand out. He helped me set up my open-source Ember form validation project, guiding me through everything from choosing the right license to establishing a documentation site and configuring the CI pipeline on GitHub. His willingness to share his knowledge and mentor others—me included—was remarkable, and it contributed significantly to the success of that project. Jordan’s technical acuity, strong mentoring skills, and community-driven spirit made him not only deserving of a Staff-level role at LinkedIn but a standout engineer in the team. I highly recommend him for any role that values deep technical insight, open-source contribution, and collaborative leadership.",
  },
  {
    name: "Rob Graeber",
    role: "Founder",
    company: "Stimulating AI Inc",
    date: "2024-12-14",
    text: "Jordan was one of the most dedicated and efficient staff software engineers I had the pleasure of working with at LinkedIn. He has a very strong work ethic, unparalleled analytical and problem-solving skills, and understands complex matters even when outside his direct area of expertise. Jordan is an organized and team-oriented perfectionist who has no problem working hard when necessary. He is self-motivated, methodical, and always ready to deal with difficult situations, solving problems on time. His ability to mentor junior developers and share knowledge across teams has been invaluable to our organization. Jordan consistently delivers high-quality code while maintaining excellent documentation practices and fostering a collaborative environment. His strategic thinking and technical leadership have been instrumental in driving several critical initiatives to successful completion.",
  },
  {
    name: "Kacey Lewis",
    role: "Senior Engineering Manager",
    company: "Vanta",
    date: "2024-12-13",
    text: "Jordan has always been a delight to work with. I worked with Jordan as a cross-functional partner, and he was one of the best advocates for best practices and developer productivity. I could always rely on him to do the right thing - whether it was a tedious migration chore, or a greenfield feature ask, Jordan was game to get it done and/or make sure the right folks were on it. Jordan is also a great frontend and UI engineer; able to go deep technically and root cause an annoying data layer issue, or brainstorm about improvements in the UI/UX. He also is a wonderful culture carrier, putting in extra effort to ensure team culture is healthy and all voices are heard.",
  },
  {
    name: "Carlos Alba",
    role: "Full Stack Software Engineer",
    company: "DoorDash",
    date: "2024-12-12",
    text: "I had the opportunity to work with Jordan for nearly three years at LinkedIn. He was one of the individuals who carried a significant amount of responsibility on the web infrastructure side of our organization. I deeply valued the many conversations we had about technical topics, as I always felt I could learn something from him. He was consistently a bar raiser, in my opinion, in terms of how we could improve things on a large scale. I think he truly combines strong technical leadership with a high level of approachability. I never felt like I couldn’t reach out to him for feedback or questions on any topic, whether it was LinkedIn-specific or related to the broader open-source community. I would love the opportunity to work with him again someday!",
  },
  {
    name: "Tyler Becks",
    role: "CTO, Cofounder",
    company: "Gobi",
    date: "2024-12-12",
    text: "Jordan has been one of the most influential mentors in my career, profoundly shaping my growth as an engineer during our five years working together. His technical leadership was instrumental in transforming our frontend architecture from microservices to a monorepo, while his guidance proved invaluable during my first major initiative - the Ember Octane migration, which he helped architect. What sets Jordan apart is not just his exceptional technical abilities, but his unique talent for elevating entire engineering teams. He consistently offers innovative perspectives while remaining genuinely receptive to others' ideas and feedback. His rare combination of deep technical expertise and broad architectural vision is matched only by his dedication to mentoring others. I've witnessed firsthand how he empowers his peers to reach their full potential, always taking time to share knowledge and provide thoughtful guidance. Having had the privilege of working closely with Jordan, I can confidently say that any team would be fortunate to have him. I would jump at the opportunity to work together again.",
  },
  {
    name: "Michael Calvillo, PhD",
    role: "Senior UX Researcher",
    company: "Bayer Crop Science",
    date: "2023-07-06",
    text: "What can I say? Jordan is a rare, top shelf talent! He asks the right questions. He listens. He evaluates. He delivers!",
  },
  {
    name: "Dave Laird",
    role: "Product Engineer",
    company: "Moonset Health",
    date: "2018-10-05",
    text: "Jordan comes highly commended. He cultivates a culture of craftsmanship and performant code. Quickly after joining Twitch, Jordan played a significant role in getting the frontend application at Twitch under tests. He built tools that allowed me and other developers to be successful in adding their well-tested features. Jordan is also a delight on a team not just his immediate team but each team he interacts with. Have a look at the open source projects that Jordan maintains this also shows his commitment to the developer community as a whole. ",
  },
  {
    name: "Anonymous",
    role: "Software Engineer",
    company: "Twitch",
    date: "2018-09-30",
    text: "Jordan has a great depth of experience and institutional knowledge. If there is some process or problem with existing systems, he is the go-to person. This knowledge and experience also gives him unique insight into future problems and decisions.",
  },
  {
    name: "Anonymous",
    role: "Software Engineer",
    company: "Twitch",
    date: "2018-09-30",
    text: "Jordan’s greatest strength is architectural knowledge and his ability to independently own & work on a codebase to meet business needs.",
  },
  {
    name: "Anonymous",
    role: "Software Engineer",
    company: "Twitch",
    date: "2018-09-30",
    text: "Jordan's greatest strength is his passion. It drives his many other strengths, like his deep understanding of tech, his willingness to take on work that others don't want, and his ability to work on pieces of code that users don't see, and he'll get no recognition for.",
  },
  {
    name: "Anonymous",
    role: "Software Engineer",
    company: "Twitch",
    date: "2018-09-30",
    text: "Jordan has the ability to take apart a company-specific problem and back it out to a reasonable incremental solution. He can, with his history at a company, usually reason about why something was built a particular way and how to get it to a stable state, and ultimately where it needs to be. He is incredibly great at taking that work (if it is assigned to him and his team) and going heads down on it, until it is in a stable state.",
  },
  {
    name: "Anonymous",
    role: "Software Engineer",
    company: "Twitch",
    date: "2018-09-30",
    text: "I would always want Jordan on my team if I needed a JS/Ember expert. He's able to get issues surfaced, prioritized, and worked on. He's able to work efficiently across teams/orgs. And he's always available to help architect front end features and give feedback on how to make it better. I couldn't imagine the company being good with Ember without him.",
  },
  {
    name: "Brian Petrocelli",
    role: "Product Marketing Lead",
    company: "WeightWatchers",
    date: "2018-02-12",
    text: "Jordan is an amazingly passionate person who never fails to advocate for the customer. He's got a great eye for customer experience and does whatever it takes to make sure they never have to suffer through a poorly thought out product decision. He'd make a great addition to any team where failure is not an option!",
  },
  {
    name: "Noëlle Plat",
    role: "Director of Localization",
    company: "Twitch",
    date: "2018-01-10",
    text: "I have lead Localization and Internationalization efforts at Twitch in San Francisco for 1.5 year, and Jordan has successfully helped my team solve major internationalization issues on various occasions. \nJordan always struck me as a brilliant and very passionate professional. Once dedicated to an issue he will do what it takes to solve it. \nJordan is also a very independent thinker who always looks at all aspects of a problem in a very logical and very detailed way.\nFinally, Jordan is a very friendly and knowledgeable person to work with. He is a well travelled and cultured individual whose open mindedness would be a great addition to any team. \nI highly and warmly recommend him.",
  },
  {
    name: "Braxton Colagross",
    role: "Senior DevOps Engineer",
    company: "Lastmile Retail",
    date: "2015-11-30",
    text: "Jordan is actively involved in the Ember.js community and passionate about code quality. As a DevOps engineer, I'm happy to have people like Jordan around excited about front end problems and technologies.",
  },
  {
    name: "Adam Scott",
    role: "Staff Software Engineer",
    company: "PTC",
    date: "2015-11-09",
    text: "Jordan is very detail oriented and knows Javascript very well. He's very knowledgable about Ember.js and is always striving to produce high quality code and an outstanding product. In addition, he's very involved in the open source community and tries to help others as much as possible. Jordan was a pleasure to work with and would make a great addition to any team.",
  },
  {
    name: "Sunny Shah",
    role: "CTO",
    company: "Juno Tax",
    date: "2015-04-05",
    text: "Jordan has a keen eye for detail, he is well versed in his craft and willing to learn new ones to bring projects to fruition. I've had the pleasure of working with Jordan on Hackday projects at Yahoo and would highly recommend him to be an invaluable asset to any team and organization. I've enjoyed working with him and look forward to when our paths cross again.",
  },
  {
    name: "Monish Subherwal",
    role: "Senior Principal Product Designer",
    company: "Oracle",
    date: "2015-04-02",
    text: "I had the pleasure of working with Jordan on the Signals project at Yahoo. Collaborating with Jordan was fun and easy - and it felt like a perfect partnership between 2 disciplines, design and development. Jordan is always willing to help out and he works hard at pushing the envelope on his work. I recommend Jordan to all opportunities coming his way. :)",
  },
  {
    name: "S. Miria Jo",
    role: "Staff User Experience Designer",
    company: "VIAVI Solutions",
    date: "2015-03-31",
    text: "Jordan is a skilled front-end engineer with a great eye for design and a talent for building cutting-edge user interfaces. I could always count on him to have the answers I needed. I appreciated his knowledge and insights and would love to work with him again.",
  },
  {
    name: "Ken Bower",
    role: "Founder",
    company: "TRACE Laboratories, Inc",
    date: "2005-08-30",
    text: "I had the pleasure of working with Jordan Hawker at a busy time in a large multi-institutional project execution. In order to contribute to the project Jordan took the initiative to learn a sophisticated engineering software package and design and draw some package schematics. We found Jordan to be pleasant to work with, a quick learner willing to take initiative, and a fine engineer all around.",
  },
  {
    name: "Joerg Weingarten",
    role: "Senior QA Engineer",
    company: "Renewed Vision",
    date: "2015-03-23",
    text: "Jordan maintains a high sense of quality in his work. He is an excellent team communicator and is always willing to help with anything. His collaboration on several Hack Day projects as well as projects outside of his day to day\r\nwork show how much he cares about the companies success.\r\n\r\nWhile having a deep understanding of Ember his technical expertise is not limited to that. He is very resourceful in finding the right tool that gets the job done. \r\nI thoroughly enjoy working with Jordan and hope that our path cross again. ",
  },
  {
    name: "Mark Cabonce, MS, DABT",
    role: "Principal Biocompatibility Scientist",
    company: "Abbott",
    date: "2014-04-04",
    text: "As a colleague of Jordan I found him to be an enthusiastic team mate. He was a productive developer who understood concepts of complex regulated agricultural field trial workflows and business requirements. He consistently provided positive feedback during story boarding session and very good ideas on improving layouts that impacted the user experience. He was a cooperative team player that worked with a sense of urgency as project deadlines dictated. One attribute that I appreciated was his unique ability to positively impact the attitude and demeanor of the team during high stress situations.",
  },
  {
    name: "Nemanja Djuric",
    role: "Principal Software Engineer, Tech Lead Manager",
    company: "Aurora",
    date: "2015-03-20",
    text: "Jordan is an extremely thorough developer with very strong analytical skills. In addition, he is very creative in his approach to solving problems. When working on our queryCategorizr project which was published at the top-tier International World Wide Web (WWW 2015) conference in Florence, he was always aware of the bigger picture and how individual items in the product affected the whole, and was critical to the project success. In addition to his engineering skills, Jordan always brings enthusiasm and positivity to the table, and I must say that he is a true pleasure to work with.",
  },
  {
    name: "Prasang Chhetri",
    role: "Principal Member of Technical Staff",
    company: "Oracle",
    date: "2014-03-12",
    text: "I had the pleasure of working with Jordan as an intern. Throughout my internship, I admired his ethics and competency while striving to match his caliber. His extraordinary ability to mentally traverse all possible outcomes of a decision yet to be made, helped the team identify potential issues and pitfalls ahead of time. \r\n\r\nHe has the ability to put himself in users' shoes and suggest excellent design decisions because of it. He is keen on working with the different facets of business to set expectations on deliverables, meet and often exceed set expectations.\r\n\r\nHe is also very sociable, and personally guided and supported me throughout my internship. He never hesitates to have an educated discussion about best practices, and will share his knowledge with fellow co-workers with unwavering enthusiasm. The quality of his tech-talks prove that he is a master of his craft. He is an excellent asset to any team, as he was certainly ours.",
  },
  {
    name: "Carlos Rodarte",
    role: "Senior Software Development Engineer",
    company: "Amazon",
    date: "2013-04-15",
    text: "Jordan is a great software developer that manages to strike a perfect balance between velocity & detail orientation. \r\n\r\nHe has extraordinary communication skills & is always on the outlook of helping not only his peers directly but his team as a whole. He's always thinking (and acting!) on making his team better at what they do, not only on request but on personal initiative.\r\n\r\nI am very glad of having been working with Jordan.",
  },
  {
    name: "Vladan Radosavljevic",
    role: "Machine Learning Chapter Lead",
    company: "Spotify",
    date: "2015-03-20",
    text: 'Jordan is one of the most talented UI developers I have worked with at Yahoo. He has very deep understanding of the state-of-the-art technologies, impressive attention to details, and an amazing intuition about the features that make a great product truly great. His work was crucial in many award winning products at Yahoo, including queryCategorizr project that will also be presented as a demo at a top tier conference WWW 2015 "QueryCategorizr: A Large-Scale Semi-Supervised System for Categorization of Web Search Queries", http://youtu.be/RSQ7mK-xpH8',
  },
  {
    name: "John Sullivan",
    role: "Sr. Research Manager",
    company: "Mastercard",
    date: "2013-04-15",
    text: "Jordan is a strong developer I had the pleasure to work with on a number of efforts. He provides a strong focus on UI fit and finish. He was open to feedback and took initiative to explore potential options or unique ways to solve a challenge. I recommend Jordan for a variety of efforts and I investigate his availability whenever an intensive UI project needs resourcing.",
  },
  {
    name: "John Grese",
    role: "Staff Software Engineer",
    company: "Illumio",
    date: "2015-03-16",
    text: "I had the pleasure of working with Jordan at Yahoo. Jordan was always very upbeat, passionate about his work, and dedicated to getting things completed on time. Jordan is a very creative individual, and I have always really valued his input about product & design decisions. Jordan is also a true 'team player', his outgoing personality elevates everyone on the team.\r\n\r\nJordan has a unique gift of being able to explain very complicated concepts in a way that can be understood by anyone. This can really come in handy when explaining complex product requirements to non-engineering audiences. Jordan's outgoing personality, diligent work-ethic, creativity, and communication skills made him a very valuable asset to our team. These qualities helped him excel as an engineer, and I also believe that they would help him excel in management roles as well.\r\n",
  },
  {
    name: "Luke Poeling",
    role: "Senior Developer",
    company: "Bayer Crop Science",
    date: "2013-03-11",
    text: "Few people that I know have excelled so quickly in their career development as I've seen with Jordan. Working on him on the Release Authorization website I watched him quickly master development in our Rich Internet Application architecture which included Backbone, SlickGrid, JQuery, and underscore. He also quickly adapted to our REST service backend, making changes to the service and JPA layer.\r\n\r\nJordan also showed a keen interest in usability when he worked with our usability expert to hone our custom SlickGrid filtering implementation which received rave reviews. Jordan contributed this feature and others to our reusable UI component library.\r\n\r\nOne of the most impressive things about Jordan is his desired to learn the Business domain and to work hand and hand with the business to design a usable system. I know this will serve him well in the future.",
  },
  {
    name: "John Quaresma",
    role: "Senior Software Engineer",
    company: "Apple",
    date: "2015-03-14",
    text: "Jordan and I worked together on various CEO challenges and hack projects at Yahoo. He's always been a great person to work with and has a strong passion for his craft. Jordan cares greatly for the people he works with and gets heavily involved in the development community. It's rare to find an engineer who has strong skills, deep community involvement, and a charismatic personality. Jordan has all of that and more. I recommend Jordan for any position where strong skills, a strong voice, and a collaborative spirit are encouraged and appreciated. I'd love the chance to work with Jordan again in the future.",
  },
  {
    name: "Jay Demetillo",
    role: "Design on User Voice",
    company: "Canva",
    date: "2015-03-08",
    text: "Jordan was a genius UI Engineer I worked with on the side at Yahoo. He had multiple ideas and took action on every front. Whether it was hacks, projects, or side business, Jordan was talented at getting it done with the utmost skill and succeeding x 1,000. He is super intelligent and came up with new ways to look at things. I highly recommend Jordan for any company as he can bring fresh ideas, energy, and a sense of humor to any situation.",
  },
  {
    name: "Ameya Virkar",
    role: "VP Engineering",
    company: "BirdEye Inc",
    date: "2015-03-09",
    text: "Jordan is technically strong developer with in-depth skills in frontend development. He has been a lead contributor on multi-dimensional projects and feature development on Yahoo advertising platform. He has been very influential developer in enhancing Ember.js, a very rich open source web application framework built using Javascript. Jordan can comprehend complex technical situations well and deliver solutions. He has provided technical expertise and mentoring and has provided specialized technical guidance to teams through code reviews. He shows professional attitude with other co-workers and also encourages others to perform better. Jordan is great team player and works very well with UI/API/Backend teams. He is a very strong asset to have within the team.\r\n",
  },
  {
    name: "Nikolay Laptev",
    role: "AI Research Scientist",
    company: "Meta",
    date: "2015-03-06",
    text: "Jordan was instrumental to an award-winning project within Yahoo. His ability to work as a team, his insightful knowledge of the UI and some of the back-end components really made a difference and won a lot of recognition within the company from the upper management. ",
  },
  {
    name: "Vishesh Joshi",
    role: "Engineering Manager",
    company: "Instagram",
    date: "2015-03-06",
    text: "I worked with Jordan on the UI of Yahoo's Ad Buying Platform, which is built using Ember.js. Jordan is a pleasure to work with and is super enthusiastic about his work. He is proactive and seeks responsibility. \r\nHe has strong experience building UI and is always available to help.\r\nI strongly recommend him, if you need team players with good experience.",
  },
  {
    name: "Josh Weihnacht",
    role: "Staff Interaction Designer",
    company: "Google",
    date: "2015-03-06",
    text: "I had the pleasure of working with Jordan on Ad Manager Plus. Jordan has good user experience instincts and is an effective partner for design. He comes up with valuable suggestions based both on his knowledge of our UI components and his first hand experience of using a feature as it is being built. In the best cases, his input and collaboration result in a final result that is much stronger, if noticeably different, than the original design. I’d love to see more developers work like this.",
  },
  {
    name: "Pragya Pherwani",
    role: "Senior UI Engineer",
    company: "Netflix",
    date: "2015-03-09",
    text: "I worked with Jordan for a few months at Yahoo as a co-worker in the YAM+ UI team. Jordan is a great co-worker, always willing to take up tough challenging tasks and creates an energetic atmosphere in any team he is a part of. I really enjoyed working with him and hope to work with him in the future.",
  },
  {
    name: "Kadambari Khanwale",
    role: "Software Engineering Manager",
    company: "Netflix",
    date: "2015-03-10",
    text: "I worked with Jordan on Yahoo Ad Manager Plus. I was new to Ember and Jordan was very helpful in answering my questions. \r\nHe is strong in Ember and Qunit. He helped me understand how QUnit works and how to use it. \r\nHe also code reviewed my pull requests and many others, he is very detail oriented, responsive on mail/messenger. ",
  },
  {
    name: "Fei Niu",
    role: "Principal Engineer",
    company: "Roblox",
    date: "2015-03-10",
    text: "I worked with Jordan in Yahoo's demand side advertising platform team for months. Jordan has a deep understanding on Ember.js and most importantly he loves what he had been doing and could spread his enthusiasm to the whole team! He was also willing to share his knowledge.\r\nIn addition, Jordan is pretty open to people. He can always express his idea and thought in a natural way.\r\nIn all, Jordan is a great team player with strong technical skills and I enjoyed working with him.\r\n",
  },
];

/** Newest first; undated ones ("") last, keeping their order from the list above */
export function byNewest(a: Recommendation, b: Recommendation): number {
  if (!a.date || !b.date) return Number(!a.date) - Number(!b.date);

  return b.date.localeCompare(a.date);
}

export const recommendations = all.toSorted(byNewest);

/** Short enough to rotate through on the home page; newest first */
export const highlightedRecommendations = recommendations.filter(
  (recommendation) => recommendation.name !== "Anonymous" && recommendation.text.length <= 420,
);
