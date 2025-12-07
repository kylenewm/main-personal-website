// Auto-generated from interview transcripts
// Source: data/processed/clean_transcript.txt
// Run: python3 scripts/build_transcript_pipeline.py

export interface InterviewChunk {
  id: string;
  category: "professional" | "education" | "personal" | "projects";
  topic: string;
  content: string;
  priority: 1 | 2 | 3 | 4 | 5; // 1=PM role, 2=Associate DS, 3=Personal projects, 4=Analyst work, 5=Education/Other
}

export const interviewChunks: InterviewChunk[] = [
  {
    id: "education-cu-boulder",
    category: "education",
    topic: "Undergraduate and Graduate Studies at University of Colorado Boulder",
    priority: 5,
    content: `Yeah, for sure. I went to the University of Colorado Boulder, where I did my undergrad in math and a master's in data science. My math degree had a concentration in statistics. I really enjoyed my undergrad. My favorite class was probably probability theory. For my master's, my favorite class might have been data mining. In this data mining course, I was really in the weeds, building a lot of algorithms from scratch. It was also a traditional machine learning course, learning about things like supervised learning, unsupervised learning, and deep learning. I enjoyed getting into the weeds and being able to handwrite neural nets from scratch, doing backpropagation by hand—those sorts of tasks. It was also really cool to learn about the evolution of machine learning over time.

I think that foundation is really critical because a lot of times, especially now, people jump into generative AI without really understanding how things work underneath the hood. This course started with things like RNNs, LSTMs, and then moved into more modern architectures, teaching how these models work under the hood and when to leverage each of them. That course was really foundational in my education and further ingrained my passion for data science and AI as a whole. That passion has continued. You can see it in a lot of the products I'm building right now. I'm building a massive product suite with the end goal of automating as much of my role as possible and providing a set of tools for my company to automate a lot of their day-to-day work—not necessarily all of it, but also to augment certain aspects.`,
  },
  {
    id: "professional-cnet-analyst",
    category: "professional",
    topic: "Data Analyst Role - CNET Overview & Product Ranking",
    priority: 4,
    content: `From there, I moved to Red Ventures, where I've been for the past two and a half years. I started as a data analyst working on a team called CNET, which is a tech and media site focused on displaying the best products available in different tech areas, like TVs and phones. CNET gets around 50 million monthly visitors globally who come to learn about what's going on in the tech space. On that team, I was a traditional data analyst focusing on some machine learning and enabling our site experience analysts, customer experience analysts, and editors to work with our data and leverage it effectively. I also helped with personalization and the growth of personalization testing on our platform. The biggest project was a product ranking model using reinforcement learning to optimize product ordering. When a customer comes to the site, we have a set of features, and the model determines what product order to show. Reinforcement learning is running in the background. This was on our most profitable page type, the "best list." I worked on that and did the first deployment, but moved off the team after transferring to the AI products team.`,
  },
  {
    id: "professional-cnet-infrastructure",
    category: "professional",
    topic: "Data Analyst Role - Database Migration & Video Analytics",
    priority: 4,
    content: `On my old team, I also developed code for a large database migration. The business had been around for about 20 years, and we had everything in Redshift, a data warehouse, and needed to migrate to BigQuery. I built a comprehensive validation notebook used for hundreds of tables, some with terabytes of data. This allowed us to do the migration without manual work, saving the team a lot of time.

Another smaller project was updating our video player, which was outdated. We wanted a better solution, and my role was to ensure we had all the right eventing for the video player, capturing all necessary information for both short and long-term needs. I worked with data engineering, front-end, and back-end teams to make sure everything was in place and helped build out a plan to get it all completed. That was another project I was wrapping up as I moved to my new team.`,
  },
  {
    id: "professional-cnet-personalization-training",
    category: "professional",
    topic: "Data Analyst Role - Personalization Training",
    priority: 4,
    content: `Lastly, because of all the personalization testing at our company—what we call Journey Optimization—I gave presentations and training sessions to about 20 business stakeholders per session on how to enable personalization across the platform. I started at a high level, explaining what journey optimization is, how to leverage it, and how to test and run with it, making sure they understood model capabilities without going into too much technical detail.`,
  },
  {
    id: "professional-compass-overview",
    category: "professional",
    topic: "Career Overview - Transition to AI Products & PM Role",
    priority: 1,
    content: `From there, I moved to Charlotte, where I started as a data analyst. About a year in, I transferred to the AI products team, working on a product called Compass—a sales center transformation platform within Red Ventures' AI products division. I started as a data analyst there briefly before being promoted to Associate Data Scientist, and now I'm working as a Data Science Product Manager, leading the Conversational AI experience on Compass. I'm ramping up now, and especially in Q1, I'll be leading an R&D team to help overhaul a lot of our core architecture and expand on many of the new developments in the space over the past year.`,
  },
  {
    id: "professional-compass-leadership",
    category: "professional",
    topic: "PM Role - R&D Leadership & Platform Expansion",
    priority: 1,
    content: `Within Compass, I'm running the lead collection part of the platform, and I'll also be leading the R&D efforts to expand and take calls that are 15 to 20 minutes long, end to end. Right now, it's mostly focused on lead collection for two- to three-minute calls, collecting a lot of information, and owning many of the platform capabilities, including underlying models like our text-to-speech and automatic speech recognition models.

Now, I'm pivoting to leading the R&D efforts to expand further into the call—being able to take end-to-end calls, from welcoming someone to one of our sites to closing the deal on products, mostly focused on internet and energy products. The goal by the end of next year is to have this deployed and running on hundreds of thousands to millions of sales calls from greeting the customer to closing the deal.`,
  },
  {
    id: "professional-compass-technical-details",
    category: "professional",
    topic: "PM Role - Technical Challenges & Sales Bot Vision",
    priority: 1,
    content: `So I work for a product called Compass. I own the conversational AI side of it. We're currently on five different businesses and actively in partnerships to continue expanding, including operating with multiple Fortune 500 companies. I own the conversational AI part, which is mostly focused on lead collection right now, but I'm going to be spearheading an R&D team to expand our capabilities—really focused on building speech-to-speech systems and expanding our agent and AI capabilities. There are all sorts of different models operating as tools under the hood. I can't go into too much detail about how this works, but that's how the product works at a high level.

The goal is to automate a large portion of our calls—not all of them, since we still need our sales agents for a segment of traffic—but for a solid segment across the businesses, the goal is to eventually roll out the sales bot. The really cool thing about a product like this is the calls can be 15 to 25 minutes long. Some of the challenges within voice AI are the complexity, especially compared to traditional AI. With voice, you have to deal with interruptions, audio handling nuances, and the low latency environment needed to make the conversation sound natural.

What makes this really difficult is you're on a long call, so the model has to understand the context of the entire conversation and do all these complex operations in real time, in a low latency environment, to sound natural. You see this product added to a lot of companies for customer support, but to scale this to millions of calls with a sales bot, instead of just customer support, is an even greater challenge. Not only do you need to answer questions in a low latency environment, but the bar is much higher because people are making purchases with your product.

Currently, the product is focused on Internet and energy products. The way it operates is the caller comes in through our site, we ask them a handful of questions, and that's the current format. Where I'll be expanding is probing into why they're calling, what they want, asking about products they're interested in, finalizing a product, and then executing the sale. There's a ton of complexity because of all the different integrations involved.`,
  },
  {
    id: "professional-compass-strategy-execution",
    category: "professional",
    topic: "PM Role - Strategy, Team Leadership & Scalability",
    priority: 1,
    content: `Right now, I'm planning out and building all the requirements, strategy, and roadmap for this expansion and R&D effort for all of next year, hopefully rolling out in the second half of 2026. That's my core focus for the remainder of the year. I also own the product strategy and execution for a team of 10+ contributors. That includes analysts, engineers, and data scientists working across our conversational AI platform to make code improvements and integrate new features.

For example, we just improved our early listening capability. If you're speaking while the AI agent is speaking, it will be able to capture that information. That sounds easy, but there are a lot of nuances to running that effectively and at scale. Those are the sorts of tweaks I work on. I'll either make code improvements, run or optimize models offline, or sometimes add things and deploy them into production—it really depends.

Aside from that, I'm leading a few large initiatives. The biggest ones are scalability—how can we set ourselves up for future success? That means taking our current architecture and platform and making them transferable, both from a learnings perspective and so the platform itself can move over to a new architecture. We're revamping a lot of our data architecture and some processes within our code to reduce latency. We've already reduced latency by 20%, and we're hoping to expand further over the coming weeks and months.

The challenge with a lot of this work is that we started as a zero-to-one product, operating on a small scale, but expanding and growing presents new challenges with refactoring and scalability. For example, when building a data model, you might have a deterministic flow, but when you move to a model without a specific label and it's a back-and-forth conversation, you have to make sure the model can transfer over, or else your data restructuring improvements aren't useful. Reporting, dashboards, ETL—all of that has to answer your questions in the short and long run. I'm working with a few engineers, a data engineer, and a few analysts to build this out.`,
  },
  {
    id: "professional-compass-latency-optimizations",
    category: "professional",
    topic: "PM Role - Latency Reduction & 3rd Party Integrations",
    priority: 2,
    content: `Another big focus is latency, which comes down to implementing earlier active recognition. That's different from early listening—early listening captures something before a customer is done speaking, while early active recognition parses the response while they're speaking, removing latency by capturing information earlier.

Other initiatives include optimizations within the code, migrating certain pieces of code, and integrating third-party vendors to improve collection rates. For example, when a customer says something, the ASR model doesn't always transcribe the text as well as needed. It does well for common words, but struggles with pronouns or names that sound the same phonetically. You might have a name like John spelled J-O-H-N versus Jon. You can take a phone number or address you've already collected and create a model that uses third-party data to see if it's similar enough, and if so, use that instead of the original name provided and transcribed. We use that in a few parts of our flow to boost collection rates, which allows us to get more accurate information when sending it to the agent, so they no longer have to do the lead collection.

In the future, this will be expanded to the sales bot, where at certain points we want to make sure transcription accuracy is really high and we're passing the right information to the customer or agent. In those cases, you'll do a similar process, matching third-party data to the customer.

We've also done testing on third-party evaluation for ASR models. We've looked at a few different ASR models to see if they were better than our current one, and realized that fine-tuning our current model on our own data is better than using some of the other cutting-edge models where fine-tuning isn't supported or is limited, and also better than using some of the open-source models available.`,
  },
  {
    id: "projects-automation-suite",
    category: "projects",
    topic: "Personal Project - PM Automation Suite",
    priority: 3,
    content: `I'm passionate about AI and spend a lot of my free time building tools to augment my day-to-day. I'm starting to bring these tools to my team and figuring out ways to integrate them into our products and workflows. For example, over the weekend, I built a deep research tool with a lot of intricacies, and I'm talking to our team about how we can leverage it to automate or augment lot of the initial research we do.

Right now, I'm building out a PM automation suite, which is a series of tools to help automate and augment the day-to-day work of product managers.

For example, I built an AI-powered monitoring and briefing system. It goes to the newsletter I follow the most, parses the URLs, scrapes the web for all the information, prioritizes what's most relevant to me, and gives me a more detailed summary in a digestible format. I also have AI search running in the background, with three agents running simultaneously to pull different pieces of information and bring them back to me in a digestible format. There are other features, like you can look at the diagram I have on my README for more detail. It also has evaluation frameworks in place, so if the original searcher doesn't return sufficient results, the agent will adjust the query and give feedback to improve the search. It also goes to my favorite podcasts, transcribes them, and gives me a summary of the most critical information.`,
  },
  {
    id: "projects-podcast-newsletter",
    category: "projects",
    topic: "Personal Project - AI Morning Briefing",
    priority: 3,
    content: `Another cool element is that I listen to a lot of podcasts— TWIML AI, Lenny's, and a few others. To speed up the process of digesting information more quickly and effectively, I've created a podcast transcription system that parses the web, scrapes the feeds, summarizes the podcasts, and then injects those summaries into the newsletter. It runs on a daily basis each morning. The reason for 9:30 specifically is because the newsletter I pull from runs between 8:45 and 9:15, so I have it set for 9:30, with a fallback if that first time fails.

Looking ahead, I'm building out this deep search integration as the core piece of the suite. I'm bringing in Andrej Karpathy's LLMs council idea, where if you have a few different models talking to each other to evaluate, you'll end up with a better decision than a single model working in isolation. I have that throughout the review process at different points to make sure the LLM is making the right decisions and giving feedback as needed to improve the quality of the research. After all that runs, I have a verification framework built out that creates a set of embeddings, checks for similarity, and then verifies that content. There are some limitations if you're using an LLM as a judge, but I also have some entity boosting to make sure we're comprehensively getting all the sources needed.`,
  },
  {
    id: "projects-product-impact",
    category: "projects",
    topic: "Associate DS Role - 75% Conversion Lift & Breakage Analysis",
    priority: 1,
    content: `Yeah, so the way I was able to increase customer conversion by 75% was based on when we first launched one of our core businesses. Our revenue per gross call was slightly under 13$, and I was able to boost that number up to over 21$ from a series of optmiziatinos. The way that was done was I made a series of optimizations to the code to improve many of the steps, the quality of the logic, and things like scripting and the ways the models operate on the given steps. Over the course of three months, I made a large set of optimizations. I was able to drive over $1 million a month in profit, which the real number is probably much higher since I had made plent of others prior to this business launching and scaling, but that's just the lower number I'm going to give because there were other optimizations further down the call that I don't want to discredit.

I also drove a strategic transformation of our platform. This was done by figuring out where all the breakage points were in our flow. I simulated the conversation offline with our current - like of our entity extraction, our ASR models—and then I was able to simulate all that and determine what points in the flow needed to be optimized based on that offline simulation. Then we went in and made the necessary fixes to improve it. That became a large part ofour roadmap in 2025 for the first half of the year, which I built out in Q4 of 2024.`,
  },
  {
    id: "projects-tts-asr-address",
    category: "projects",
    topic: "Associate DS Role - TTS Vendor Research & Phonetic Matching",
    priority: 2,
    content: `In terms of the TTS vendor research, there were a few different models we looked into. That was really about figuring out which models we wanted to leverage for our platform, analyzing the pros and cons of each, selecting the models, and then running a split test on these different models to determine which ones performed best on our platform from both a latency and throughput perspective. We also checked if the results were statistically significant enough to warrant entering a full-time contract with a new platform. 
    What we realized from this was there certain voice that perfomed slighlt better than rest but as not as critical of a component as initially believed, and we also realized that having the ability to cache our audio was critical. When we're synthesizing audio, it's really important if we can synthesize the audio beforehand and cache it, rather than having to resynthesize it, because that can waste a few hundred milliseconds. While that doesn't sound like a lot, in a low latency environment, especially when you're trying to build out an AI sales agent that needs to sound natural and conversational, it becomes really critical.

Another thing I built was the phonetic matching model to validate addresses in real time. This includes a similarity algorithm between what the customer said and what the API returned, so we're not sending false positives to confirmation or giving them the wrong address. The API has a fuzzy matching capability, which allows us to decide if a partial match is sufficient to send the confirmation. It's not always the case that the address is a 100% match—maybe it's a 90% match, but there are one or two letters off. This allows us to handle that. I'm also using an LLM as a judge as a backup option if the original API fails.`,
  },
  {
    id: "projects-self-optimizing-ai",
    category: "projects",
    topic: "Associate DS Role - Self-Optimizing AI Workflow",
    priority: 1,
    content: `In terms of the self-optimizing AI workflow, I built an offline model with a few different agents that optimize the prompt itself on historical data. It determines if the new prompt is better than the original prompt after optimizing as much as it can and the evaluating on a holdout set and updating the prompt. There is a human in the loop there and some other elements as well, but that's what it is at a high level.`,
  },
  {
    id: "projects-ai-productivity-tools",
    category: "projects",
    topic: "Personal Project - AI Productivity Tools",
    priority: 3,
    content: `We're at a pivotal point in time where you can now build and generate things really easily. I can build and deploy a working product that can be used as an internal tool within a week, even just in my free time. For example, building a suite with a centralized dashboard where you can manage a large portion of your product workflow, whether it's creating tickets, doing research on your behalf, and handling tasks that require deeper research, like generating a PRD or learning about something. Having features like guardrails and auto fact-checking within the tool has become really easy to build. It's shocking how much easier it is for me to build now than it was a couple of years ago.

Another thing is that I'm always trying to find ways to cut out and optimize parts of my day-to-day. Anywhere I find myself spending more than a certain amount of time, and I think there's a way I can leverage AI or an AI tool to streamline that process, I plan to build something to streamline that process.`,
  },
  {
    id: "personal-hobbies-chess-poker",
    category: "personal",
    topic: "Chess, Poker, and Analytical Hobbies",
    priority: 5,
    content: `Yeah, I have a few different hobbies. I've always really enjoyed chess, being able to take something that needs so simple but is also so complex to play makes it a lot of fun.
     Besides chess, I've always loved poker, since I have always loved probability and statistics but also the element of being able to read the room and make decisions under pressure based on so many factors.

In chess, you have to plan a few steps ahead—thinking about what your opponent will do, considering all the options three, four, or five moves ahead, and optimizing for 15 turns later, not just the first few. It becomes a really cool puzzle to understand this game of strategy that seems simple, where pieces can only move in certain ways, but can get so complex. I grew up playing chess all the time.

Poker—I started playing when I was about three, and I was always really good at it. I haven't kept up with it as much recently because there aren't many places to casually play poker for fun, so that's something that's fallen off a bit. But growing up, I'd always watch the World Series of Poker every year. I was in poker club at school growing up as well.`,
  },
  {
    id: "personal-hobbies-action-sports",
    category: "personal",
    topic: "Action Sports: Skiing and Surfing Experiences",
    priority: 5,
    content: `I also really enjoy action sports—really anything that involes things quickly or moving fast. I've always been really into skiing. That's one of the reasons I enjoyed Boulder—I could wake up on a Saturday morning and go skiing all day and was such a cool luxury, probably something I'll never have again, but I absolutely loved it. I also started picking up surfing. I did a surf camp in Portugal over the summer in a spot called Ericeira. That trip was a ton of fun—it was a week long, and I got to the point where I was getting up on four-, five-, or six-foot waves and started getting the hang of it. I definitely think that's something I'll keep up over time. I haven't been snowboarding or skiing out in New York yet, but that's something I definitely want to do this winter.`,
  },
  {
    id: "personal-hobbies-drums",
    category: "personal",
    topic: "Drumming and Musical Background",
    priority: 5,
    content: `I also grew up playing the drums, and still listen to tons of classic nad more modern rock. I wasn't been able to bring my drum kit with me, but hoping to bring an electronic kit with me here soon.`,
  },
  {
    id: "personal-hobbies-tinkering",
    category: "personal",
    topic: "Tinkering, Building, and Learning",
    priority: 5,
    content: `Outside of work, similar to my day-to-day, I love building and optimizing things. You can see a lot of the projects I've built on the side—one reason is to learn, and the other is that I just like to build and see what is really possible. The field is moving so quickly that the capabilities I have now, even compared to six months ago, have changed drastically. It's really fun to push myself and figure out what I can and can't do.`
  },
  {
    id: "strengths-work-ethic",
    category: "professional",
    topic: "Work Ethic and Synthesis of Information",
    priority: 3,
    content: `I'd say my biggest strength is my work ethic. On my current team, I'm definitely known as the hardest worker. In my past two annual reviews, the main feedback was actually for me to slow down and work less. Both my managers literally told me I need to work less, which is probably unusual to hear, but I pride myself on putting everything I have into my day-to-day. For me, even outside of promotions or taking on more responsibility, I always want to be growing, and outworking everyone else feels like the quickest way for me to keep growing.

Another strength is my ability to work with a lot of different pieces of information and synthesize them in a way that lets me build something. For example, with our current products, there are so many different features and tools you can incorporate. Understanding the complexity of all those items and building out a strategy and implementation plan, and then actually implementing it, is something I'm really strong at and is the reason I was given the opportunity to lead the R&D efforts for next year.`,
  },
  {
    id: "strengths-weaknesses-communication",
    category: "professional",
    topic: "Communication Weakness and Fast-Paced Work Style",
    priority: 3,
    content: `In terms of weaknesses, that's a good question. I know I have things to work on. One is my communication—it's not as good as I'd like. I have a tendency to ramble and be more verbose than I should, and being more concise is something I'm actively working on. I also tend to move really quickly and sometimes leave people behind, especially when working in a product capacity versus data science. I can be a few steps ahead before others are even at step two. Whether it's through how I talk or what I do day to day, I need to slow down, take a breath, and spend more time in the planning phase to make sure everyone is on the same page before moving on.`,
  },
  {
    id: "strengths-work-ethic-details",
    category: "professional",
    topic: "Work Intensity and Growth Mindset",
    priority: 3,
    content: `Yeah, for sure. I've had three annual reviews, and in every single one, I've been told explicitly that I need to be working less. I still view this as a strength because, in that environment, working 50 hours is normal, but not many people are putting in 60 or 70 hours or working at the intensity I do at my currnet company. That's something I personally pride myself on. I understand they want me to work less, but I think that's what allows me to grow quicker and develop a stronger skill set, and it's something I really pride myself on.

The other strength is my working memory. I have a strong ability to synthesize large amounts of information and figure out how to build something with it. For our current products, there are tons of different tools at our disposal, and new things are coming out every day. Figuring out what's most useful for our platform, how to build it, and actually building it is something I'm really strong at, and it's one of the driving forces for me leading this project in Q1 of next year.`,
  }
];
