import DS from 'ember-data';

const { RESTAdapter } = DS;

export default RESTAdapter.extend({
  findAll() {
    return {
      "recommendations": [{
        "id": 7,
        "text": "Jordan is an amazingly passionate person who never fails to advocate for the customer. He's got a great eye for customer experience and does whatever it takes to make sure they never have to suffer through a poorly thought out product decision. He'd make a great addition to any team where failure is not an option!",
        "firstName": "Brian",
        "lastName": "Petrocelli",
        "role": "Product Marketing Manager",
        "company": "Twitch"
      }, {
        "id": 6,
        "text": "I have lead Localization and Internationalization efforts at Twitch in San Francisco for 1.5 year, and Jordan has successfully helped my team solve major internationalization issues on various occasions. \n" +
          "Jordan always struck me as a brilliant and very passionate professional. Once dedicated to an issue he will do what it takes to solve it. \n" +
          "Jordan is also a very independent thinker who always looks at all aspects of a problem in a very logical and very detailed way.\n" +
          "Finally, Jordan is a very friendly and knowledgeable person to work with. He is a well travelled and cultured individual whose open mindedness would be a great addition to any team. \n" +
          "I highly and warmly recommend him.",
        "firstName": "Noëlle",
        "lastName": "Plat",
        "role": "Senior Localization Manager",
        "company": "Twitch"
      }, {
        "id": 5,
        "text": "Jordan is actively involved in the Ember.js community and passionate about code quality. As a DevOps engineer, I'm happy to have people like Jordan around excited about front end problems and technologies.",
        "firstName": "Braxton",
        "lastName": "Colagross",
        "role": "DevOps Engineer",
        "company": "Telmate"
      }, {
        "id": 4,
        "text": "Jordan is very detail oriented and knows Javascript very well. He's very knowledgable about Ember.js and is always striving to produce high quality code and an outstanding product. In addition, he's very involved in the open source community and tries to help others as much as possible. Jordan was a pleasure to work with and would make a great addition to any team.",
        "firstName": "Adam",
        "lastName": "Scott",
        "role": "Software Engineer",
        "company": "Zinc, Inc"
      }, {
        "id": 3,
        "text": "Jordan has a keen eye for detail, he is well versed in his craft and willing to learn new ones to bring projects to fruition. I've had the pleasure of working with Jordan on Hackday projects at Yahoo and would highly recommend him to be an invaluable asset to any team and organization. I've enjoyed working with him and look forward to when our paths cross again.",
        "firstName": "Sunny",
        "lastName": "Shah",
        "role": "Software Engineer III",
        "company": "Yahoo"
      }, {
        "id": 2,
        "text": "I had the pleasure of working with Jordan on the Signals project at Yahoo. Collaborating with Jordan was fun and easy - and it felt like a perfect partnership between 2 disciplines, design and development. Jordan is always willing to help out and he works hard at pushing the envelope on his work. I recommend Jordan to all opportunities coming his way. :)",
        "firstName": "Monish",
        "lastName": "Subherwal",
        "role": "Digital Experience Manager",
        "company": "IEEE Computer Society"
      }, {
        "id": 1,
        "text": "Jordan is a skilled front-end engineer with a great eye for design and a talent for building cutting-edge user interfaces. I could always count on him to have the answers I needed. I appreciated his knowledge and insights and would love to work with him again.",
        "firstName": "S. Miria",
        "lastName": "Jo",
        "role": "Staff User Experience Designer",
        "company": "Spirent Communications"
      }, {
        "id": 24167445,
        "text": "I had the pleasure of working with Jordan Hawker at a busy time in a large multi-institutional project execution. In order to contribute to the project Jordan took the initiative to learn a sophisticated engineering software package and design and draw some package schematics. We found Jordan to be pleasant to work with, a quick learner willing to take initiative, and a fine engineer all around.",
        "firstName": "Ken",
        "lastName": "Bower",
        "role": "Founder",
        "company": "TRACE Laboratories, Inc"
      }, {
        "id": 553666164,
        "text": "Jordan maintains a high sense of quality in his work. He is an excellent team communicator and is always willing to help with anything. His collaboration on several Hack Day projects as well as projects outside of his day to day\r\nwork show how much he cares about the companies success.\r\n\r\nWhile having a deep understanding of Ember his technical expertise is not limited to that. He is very resourceful in finding the right tool that gets the job done. \r\nI thoroughly enjoy working with Jordan and hope that our path cross again. ",
        "firstName": "Joerg",
        "lastName": "Weingarten",
        "role": "Senior QA Developer",
        "company": "Yahoo"
      }, {
        "id": 532504011,
        "text": "As a colleague of Jordan I found him to be an enthusiastic team mate. He was a productive developer who understood concepts of complex regulated agricultural field trial workflows and business requirements. He consistently provided positive feedback during story boarding session and very good ideas on improving layouts that impacted the user experience. He was a cooperative team player that worked with a sense of urgency as project deadlines dictated. One attribute that I appreciated was his unique ability to positively impact the attitude and demeanor of the team during high stress situations.",
        "firstName": "Mark",
        "lastName": "Cabonce, MS, DABT",
        "role": "Director, Regulatory Toxicology",
        "company": "WuXi AppTec"
      }, {
        "id": 567616171,
        "text": "Jordan is an extremely thorough developer with very strong analytical skills. In addition, he is very creative in his approach to solving problems. When working on our queryCategorizr project which was published at the top-tier International World Wide Web (WWW 2015) conference in Florence, he was always aware of the bigger picture and how individual items in the product affected the whole, and was critical to the project success. In addition to his engineering skills, Jordan always brings enthusiasm and positivity to the table, and I must say that he is a true pleasure to work with.",
        "firstName": "Nemanja",
        "lastName": "Djuric",
        "role": "Senior Applied Scientist - Machine Learning Tech Lead",
        "company": "Uber Advanced Technologies Group"
      }, {
        "id": 529273981,
        "text": "I had the pleasure of working with Jordan as an intern. Throughout my internship, I admired his ethics and competency while striving to match his caliber. His extraordinary ability to mentally traverse all possible outcomes of a decision yet to be made, helped the team identify potential issues and pitfalls ahead of time. \r\n\r\nHe has the ability to put himself in users' shoes and suggest excellent design decisions because of it. He is keen on working with the different facets of business to set expectations on deliverables, meet and often exceed set expectations.\r\n\r\nHe is also very sociable, and personally guided and supported me throughout my internship. He never hesitates to have an educated discussion about best practices, and will share his knowledge with fellow co-workers with unwavering enthusiasm. The quality of his tech-talks prove that he is a master of his craft. He is an excellent asset to any team, as he was certainly ours.",
        "firstName": "Prasang",
        "lastName": "Chhetri",
        "role": "Software Engineer",
        "company": "Cerner Corporation"
      }, {
        "id": 45961081,
        "text": "Jordan is a great software developer that manages to strike a perfect balance between velocity & detail orientation. \r\n\r\nHe has extraordinary communication skills & is always on the outlook of helping not only his peers directly but his team as a whole. He's always thinking (and acting!) on making his team better at what they do, not only on request but on personal initiative.\r\n\r\nI am very glad of having been working with Jordan.",
        "firstName": "Carlos",
        "lastName": "Rodarte",
        "role": "Senior Software Engineer",
        "company": "Amazon"
      }, {
        "id": 567577801,
        "text": "Jordan is one of the most talented UI developers I have worked with at Yahoo. He has very deep understanding of the state-of-the-art technologies, impressive attention to details, and an amazing intuition about the features that make a great product truly great. His work was crucial in many award winning products at Yahoo, including queryCategorizr project that will also be presented as a demo at a top tier conference WWW 2015 \"QueryCategorizr: A Large-Scale Semi-Supervised System for Categorization of Web Search Queries\", http://youtu.be/RSQ7mK-xpH8",
        "firstName": "Vladan",
        "lastName": "Radosavljevic",
        "role": "Senior Applied Scientist",
        "company": "Uber Advanced Technologies Group"
      }, {
        "id": 45947351,
        "text": "Jordan is a strong developer I had the pleasure to work with on a number of efforts. He provides a strong focus on UI fit and finish. He was open to feedback and took initiative to explore potential options or unique ways to solve a challenge. I recommend Jordan for a variety of efforts and I investigate his availability whenever an intensive UI project needs resourcing.",
        "firstName": "John",
        "lastName": "Sullivan",
        "role": "Platform Design Lead",
        "company": "Monsanto"
      }, {
        "id": 567233991,
        "text": "I had the pleasure of working with Jordan at Yahoo. Jordan was always very upbeat, passionate about his work, and dedicated to getting things completed on time. Jordan is a very creative individual, and I have always really valued his input about product & design decisions. Jordan is also a true 'team player', his outgoing personality elevates everyone on the team.\r\n\r\nJordan has a unique gift of being able to explain very complicated concepts in a way that can be understood by anyone. This can really come in handy when explaining complex product requirements to non-engineering audiences. Jordan's outgoing personality, diligent work-ethic, creativity, and communication skills made him a very valuable asset to our team. These qualities helped him excel as an engineer, and I also believe that they would help him excel in management roles as well.\r\n",
        "firstName": "John",
        "lastName": "Grese",
        "role": "Senior Software Development Engineer",
        "company": "Yahoo"
      }, {
        "id": 44794082,
        "text": "Few people that I know have excelled so quickly in their career development as I've seen with Jordan. Working on him on the Release Authorization website I watched him quickly master development in our Rich Internet Application architecture which included Backbone, SlickGrid, JQuery, and underscore. He also quickly adapted to our REST service backend, making changes to the service and JPA layer.\r\n\r\nJordan also showed a keen interest in usability when he worked with our usability expert to hone our custom SlickGrid filtering implementation which received rave reviews. Jordan contributed this feature and others to our reusable UI component library.\r\n\r\nOne of the most impressive things about Jordan is his desired to learn the Business domain and to work hand and hand with the business to design a usable system. I know this will serve him well in the future.",
        "firstName": "Luke",
        "lastName": "Poeling",
        "role": "Senior Developer",
        "company": "Monsanto"
      }, {
        "id": 567111951,
        "text": "Jordan and I worked together on various CEO challenges and hack projects at Yahoo. He's always been a great person to work with and has a strong passion for his craft. Jordan cares greatly for the people he works with and gets heavily involved in the development community. It's rare to find an engineer who has strong skills, deep community involvement, and a charismatic personality. Jordan has all of that and more. I recommend Jordan for any position where strong skills, a strong voice, and a collaborative spirit are encouraged and appreciated. I'd love the chance to work with Jordan again in the future.",
        "firstName": "John",
        "lastName": "Quaresma",
        "role": "Senior Software Engineer",
        "company": "Apple"
      }, {
        "id": 566624061,
        "text": "Jordan was a genius UI Engineer I worked with on the side at Yahoo. He had multiple ideas and took action on every front. Whether it was hacks, projects, or side business, Jordan was talented at getting it done with the utmost skill and succeeding x 1,000. He is super intelligent and came up with new ways to look at things. I highly recommend Jordan for any company as he can bring fresh ideas, energy, and a sense of humor to any situation.",
        "firstName": "Jay",
        "lastName": "Demetillo",
        "role": "Lead UX/Visual Designer",
        "company": "Grab"
      }, {
        "id": 566660311,
        "text": "Jordan is technically strong developer with in-depth skills in frontend development. He has been a lead contributor on multi-dimensional projects and feature development on Yahoo advertising platform. He has been very influential developer in enhancing Ember.js, a very rich open source web application framework built using Javascript. Jordan can comprehend complex technical situations well and deliver solutions. He has provided technical expertise and mentoring and has provided specialized technical guidance to teams through code reviews. He shows professional attitude with other co-workers and also encourages others to perform better. Jordan is great team player and works very well with UI/API/Backend teams. He is a very strong asset to have within the team.\r\n",
        "firstName": "Ameya",
        "lastName": "Virkar",
        "role": "VP Engineering",
        "company": "BirdEye Inc"
      }, {
        "id": 566572671,
        "text": "Jordan was instrumental to an award-winning project within Yahoo. His ability to work as a team, his insightful knowledge of the UI and some of the back-end components really made a difference and won a lot of recognition within the company from the upper management. ",
        "firstName": "Nikolay",
        "lastName": "Laptev",
        "role": "Engineering Lead",
        "company": "Facebook"
      }, {
        "id": 566571071,
        "text": "I worked with Jordan on the UI of Yahoo's Ad Buying Platform, which is built using Ember.js. Jordan is a pleasure to work with and is super enthusiastic about his work. He is proactive and seeks responsibility. \r\nHe has strong experience building UI and is always available to help.\r\nI strongly recommend him, if you need team players with good experience.",
        "firstName": "Vishesh",
        "lastName": "Joshi",
        "role": "Software Engineer",
        "company": "Facebook"
      }, {
        "id": 552304934,
        "text": "I had the pleasure of working with Jordan on Ad Manager Plus. Jordan has good user experience instincts and is an effective partner for design. He comes up with valuable suggestions based both on his knowledge of our UI components and his first hand experience of using a feature as it is being built. In the best cases, his input and collaboration result in a final result that is much stronger, if noticeably different, than the original design. I’d love to see more developers work like this.",
        "firstName": "Josh",
        "lastName": "Weihnacht",
        "role": "UX Manager",
        "company": "Google"
      }, {
        "id": 566711051,
        "text": "I worked with Jordan for a few months at Yahoo as a co-worker in the YAM+ UI team. Jordan is a great co-worker, always willing to take up tough challenging tasks and creates an energetic atmosphere in any team he is a part of. I really enjoyed working with him and hope to work with him in the future.",
        "firstName": "Pragya",
        "lastName": "Pherwani",
        "role": "Senior UI Engineer",
        "company": "Netflix"
      }, {
        "id": 566825571,
        "text": "I worked with Jordan on Yahoo Ad Manager Plus. I was new to Ember and Jordan was very helpful in answering my questions. \r\nHe is strong in Ember and Qunit. He helped me understand how QUnit works and how to use it. \r\nHe also code reviewed my pull requests and many others, he is very detail oriented, responsive on mail/messenger. ",
        "firstName": "Kadambari",
        "lastName": "Khanwale",
        "role": "Senior Software Engineer",
        "company": "Netflix"
      }, {
        "id": 566787821,
        "text": "I worked with Jordan in Yahoo's demand side advertising platform team for months. Jordan has a deep understanding on Ember.js and most importantly he loves what he had been doing and could spread his enthusiasm to the whole team! He was also willing to share his knowledge.\r\nIn addition, Jordan is pretty open to people. He can always express his idea and thought in a natural way.\r\nIn all, Jordan is a great team player with strong technical skills and I enjoyed working with him.\r\n",
        "firstName": "Fei",
        "lastName": "Niu",
        "role": "Software Engineer",
        "company": "Apple"
      }]
    };
  }
});
