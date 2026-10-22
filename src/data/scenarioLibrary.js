/**
 * Local, hand-written futures. Each theme has three paths (bold → cautious),
 * and each path has two outcomes. `likelihood` is the chance of that outcome
 * *within its path*, so each pair sums to 100.
 *
 * Text may use {action}: the user's own decision, rephrased in second person
 * (e.g. "move to a new city where you know no one").
 */

export const TONES = {
  bright: { label: 'Flourishing' },
  mixed: { label: 'Mixed' },
  shadow: { label: 'Hard lesson' },
};

export const themes = {
  career: {
    label: 'Career',
    keywords: ['job', 'quit', 'career', 'company', 'startup', 'start-up', 'business', 'boss', 'promotion', 'salary', 'freelance', 'founder', 'resign', 'employer', 'manager'],
    branches: [
      {
        title: 'Make the leap',
        tag: 'Bold',
        description:
          'You hand in your notice and give the new direction your full attention. Savings become runway, and every week is measured in progress, not paychecks.',
        steps: ['Calculate 12 months of runway before resigning', 'Line up two or three people who will pay or vouch early', 'Set a hard checkpoint date to re-evaluate'],
        outcomes: [
          {
            title: 'Momentum takes hold',
            description:
              'Early customers turn into referrals. By month eighteen the work pays you a modest salary, and the freedom feels worth every lean month.',
            likelihood: 35,
            timeframe: '18–24 months',
            tone: 'bright',
            signals: ['Strangers start finding you without outreach', 'Revenue covers costs three months in a row'],
          },
          {
            title: 'The runway runs out',
            description:
              'Progress is real but slower than the savings. You return to employment with sharper skills, a stronger network and no lingering what-ifs.',
            likelihood: 65,
            timeframe: '9–14 months',
            tone: 'shadow',
            signals: ['You are extending deadlines instead of hitting them', 'Most interest is polite rather than paying'],
          },
        ],
      },
      {
        title: 'Build it on the side',
        tag: 'Balanced',
        description:
          'You keep the stable income and build in evenings and weekends. You only jump once the new path proves it can carry its own weight.',
        steps: ['Protect two fixed blocks of focused time each week', 'Define the exact number that would justify quitting', 'Check your contract for side-project clauses'],
        outcomes: [
          {
            title: 'Proof earns the jump',
            description:
              'Slow, steady traction crosses the threshold you set. You leave on your own terms, with savings intact and real evidence behind you.',
            likelihood: 45,
            timeframe: '12–20 months',
            tone: 'bright',
            signals: ['Side income reaches half your salary', 'You resent the day job hours, not the side work'],
          },
          {
            title: 'A slow fade',
            description:
              'Energy splits two ways and the project stalls after a promising start. The skills stay with you, but the window you hoped for quietly closes.',
            likelihood: 55,
            timeframe: '6–12 months',
            tone: 'mixed',
            signals: ['Weeks pass without touching the project', 'You talk about it more than you work on it'],
          },
        ],
      },
      {
        title: 'Reshape the current role',
        tag: 'Cautious',
        description:
          'You stay, but renegotiate. You pitch a new project, a new title or a flexible schedule that gives the restless part of you somewhere to go.',
        steps: ['Write down exactly what is missing from the role', 'Bring a concrete proposal, not a complaint', 'Agree on a six-month review'],
        outcomes: [
          {
            title: 'A new chapter inside',
            description:
              'Leadership says yes to more than you expected. You get ownership and room to experiment without giving up stability.',
            likelihood: 50,
            timeframe: '3–9 months',
            tone: 'bright',
            signals: ['Your proposal gets a budget, not just praise', 'Mondays start to feel lighter'],
          },
          {
            title: 'The itch returns louder',
            description:
              'Small changes help for a season, then the same questions come back with more urgency. You will likely face this decision again within a year.',
            likelihood: 50,
            timeframe: '6–12 months',
            tone: 'mixed',
            signals: ['You browse job boards on lunch breaks', 'Wins at work feel flat'],
          },
        ],
      },
    ],
  },

  place: {
    label: 'Place',
    keywords: ['move', 'city', 'country', 'abroad', 'relocate', 'relocation', 'town', 'live in', 'emigrate', 'overseas', 'neighbourhood', 'neighborhood'],
    branches: [
      {
        title: 'Move now',
        tag: 'Bold',
        description:
          'You pack up and land somewhere new while the motivation is fresh. Everything is unfamiliar: the streets, the routines, the faces.',
        steps: ['Secure housing for the first three months', 'Join one recurring group in week one', 'Keep a buffer for an emergency trip home'],
        outcomes: [
          {
            title: 'A life that fits',
            description:
              'Routines create friendships faster than expected. Within a year the city feels like yours, and new opportunities open that would not have reached you before.',
            likelihood: 55,
            timeframe: '9–15 months',
            tone: 'bright',
            signals: ['Someone recognises you at your regular café', 'You stop converting prices in your head'],
          },
          {
            title: 'A lonely first winter',
            description:
              'Isolation peaks around month four. You either push through and build a circle slowly, or decide the old place held more than you realised.',
            likelihood: 45,
            timeframe: '3–8 months',
            tone: 'mixed',
            signals: ['Weekends go by without plans', 'Calls home get longer and more frequent'],
          },
        ],
      },
      {
        title: 'Scout before committing',
        tag: 'Balanced',
        description:
          'You spend a few weeks living there first: a short rental, remote work and ordinary weekdays instead of a holiday version of the place.',
        steps: ['Book a month-long stay outside tourist areas', 'Test the commute, the cost of groceries, the winter', 'Meet three locals who are not in hospitality'],
        outcomes: [
          {
            title: 'An informed yes',
            description:
              'The trial confirms the pull. You move with realistic expectations, a shortlist of neighbourhoods and a few contacts already waiting.',
            likelihood: 60,
            timeframe: '4–8 months',
            tone: 'bright',
            signals: ['You leave the trial already planning the move', 'The ordinary days felt good, not just the weekends'],
          },
          {
            title: 'The spark dims',
            description:
              'You realise you wanted change, not that particular place. The energy goes into reshaping life where you are, and nothing is wasted.',
            likelihood: 40,
            timeframe: '1–3 months',
            tone: 'mixed',
            signals: ['You miss home routines within days', 'The appeal was the idea of leaving'],
          },
        ],
      },
      {
        title: 'Stay and redraw the map',
        tag: 'Cautious',
        description:
          'You stay put but change what you can: a new neighbourhood, new circles and a few trips that scratch the itch for something different.',
        steps: ['Name what the move was meant to fix', 'Change one big local variable this season', 'Plan two trips to places that stretch you'],
        outcomes: [
          {
            title: 'Roots deepen',
            description:
              'Familiar ground feels new again. Relationships compound, and the restlessness turns into a steady sense of belonging.',
            likelihood: 45,
            timeframe: '6–12 months',
            tone: 'bright',
            signals: ['Your calendar fills with people, not errands', 'You recommend your city to others'],
          },
          {
            title: 'What-if lingers',
            description:
              'Life stays comfortable but the question keeps returning, louder at each birthday. The window to move becomes harder to open.',
            likelihood: 55,
            timeframe: '1–3 years',
            tone: 'shadow',
            signals: ['You keep saving apartment listings elsewhere', 'Friends who moved seem more alive'],
          },
        ],
      },
    ],
  },

  growth: {
    label: 'Learning',
    keywords: ['school', 'degree', 'master', 'masters', 'study', 'university', 'college', 'course', 'phd', 'mba', 'learn', 'bootcamp', 'education', 'class'],
    branches: [
      {
        title: 'Enroll full-time',
        tag: 'Bold',
        description:
          'You step out of work and into study completely: deep focus, a new peer group and a deliberate pause in your earnings.',
        steps: ['Compare total cost against realistic salary uplift', 'Talk to three recent graduates of the program', 'Apply for every scholarship you qualify for'],
        outcomes: [
          {
            title: 'A pivot unlocked',
            description:
              'The credential and the network open doors that were firmly shut. You land in a field that fits better, and the cost pays back within a few years.',
            likelihood: 55,
            timeframe: '2–3 years',
            tone: 'bright',
            signals: ['Classmates refer you to roles before graduation', 'Professors invite you onto real projects'],
          },
          {
            title: 'Debt outpaces payoff',
            description:
              'The learning is real, but the job market moves differently than promised. You carry the debt longer than planned while the advantage slowly materialises.',
            likelihood: 45,
            timeframe: '3–5 years',
            tone: 'shadow',
            signals: ['Graduates of the program struggle to place', 'Starting salaries match what you already earned'],
          },
        ],
      },
      {
        title: 'Study while working',
        tag: 'Balanced',
        description:
          'You enroll part-time and keep your income. Progress is slower, but each module can be applied at work the following Monday.',
        steps: ['Ask your employer about tuition support', 'Block study time as non-negotiable', 'Choose a program with flexible pacing'],
        outcomes: [
          {
            title: 'Steady compounding',
            description:
              'New skills show up in your work almost immediately. A promotion or better offer arrives before you even graduate.',
            likelihood: 50,
            timeframe: '2–4 years',
            tone: 'bright',
            signals: ['You bring coursework ideas into meetings', 'Your manager asks what you are studying'],
          },
          {
            title: 'A burnout detour',
            description:
              'Work deadlines and exams collide. You pause the program to recover, returning later with clearer priorities and a lighter load.',
            likelihood: 50,
            timeframe: '6–18 months',
            tone: 'mixed',
            signals: ['Sleep becomes the first thing you cut', 'Assignments feel like obligations, not curiosity'],
          },
        ],
      },
      {
        title: 'Learn without the degree',
        tag: 'Cautious',
        description:
          'You skip the formal program and build skills directly through courses, certificates, mentors and a public portfolio of real work.',
        steps: ['Pick one skill employers actually screen for', 'Ship a visible project every month', 'Find a mentor already doing the job'],
        outcomes: [
          {
            title: 'The portfolio speaks',
            description:
              'Demonstrated work beats paper credentials in your field. Opportunities arrive through what you have built, at a fraction of the cost.',
            likelihood: 45,
            timeframe: '1–2 years',
            tone: 'bright',
            signals: ['People share your projects without being asked', 'Interviews focus on your work, not your résumé'],
          },
          {
            title: 'The credential ceiling',
            description:
              'Skills grow, but certain doors require the degree regardless. You may enroll later, now knowing exactly why and what you want from it.',
            likelihood: 55,
            timeframe: '1–3 years',
            tone: 'mixed',
            signals: ['Applications stall at automated screening', 'Senior roles list the degree as mandatory'],
          },
        ],
      },
    ],
  },

  heart: {
    label: 'Heart',
    keywords: ['feel', 'love', 'tell', 'relationship', 'partner', 'marry', 'marriage', 'break up', 'breakup', 'date', 'dating', 'crush', 'friend', 'confess', 'divorce', 'boyfriend', 'girlfriend', 'propose'],
    branches: [
      {
        title: 'Say it plainly',
        tag: 'Bold',
        description:
          'You choose honesty over safety and say what you feel, clearly and kindly, without demanding an answer on the spot.',
        steps: ['Pick a calm, private moment rather than a charged one', 'Say how you feel, not what they should do', 'Give them space to respond in their own time'],
        outcomes: [
          {
            title: 'It is mutual',
            description:
              'They had been wondering too. The conversation is awkward for ten minutes and then becomes the start of something new.',
            likelihood: 40,
            timeframe: 'Days to weeks',
            tone: 'bright',
            signals: ['They ask follow-up questions instead of changing the subject', 'They make the next plan'],
          },
          {
            title: 'A kind no, clear air',
            description:
              'The feeling is not returned. It stings for a few weeks, but the uncertainty is gone, and the friendship can settle into something honest.',
            likelihood: 60,
            timeframe: '2–8 weeks',
            tone: 'mixed',
            signals: ['They thank you for telling them', 'Things feel normal again sooner than you feared'],
          },
        ],
      },
      {
        title: 'Let it show gradually',
        tag: 'Balanced',
        description:
          'You create more one-on-one time and let your interest show in small ways, reading the signals before saying anything outright.',
        steps: ['Suggest a plan that is just the two of you', 'Notice whether they start initiating too', 'Decide in advance how long you will wait'],
        outcomes: [
          {
            title: 'Signals align',
            description:
              'Small moments build into an unmistakable pattern. When words finally come, they confirm what you both already knew.',
            likelihood: 45,
            timeframe: '1–3 months',
            tone: 'bright',
            signals: ['They remember small details you mentioned', 'Conversations run long without effort'],
          },
          {
            title: 'Stuck in maybe',
            description:
              'Hints get lost in friendliness and months pass in ambiguity. Eventually you will need to say it plainly or let it go.',
            likelihood: 55,
            timeframe: '3–6 months',
            tone: 'mixed',
            signals: ['You analyse every message they send', 'Nothing changes after a month of effort'],
          },
        ],
      },
      {
        title: 'Keep it to yourself',
        tag: 'Cautious',
        description:
          'You protect what you have and keep the feelings private, putting your energy into your own life and seeing what time does.',
        steps: ['Talk it through with one trusted friend', 'Invest in plans that have nothing to do with them', 'Check in with yourself in three months'],
        outcomes: [
          {
            title: 'Feelings settle',
            description:
              'With distance and a full life, the intensity fades. The connection stays warm, and you are glad nothing was strained.',
            likelihood: 50,
            timeframe: '2–6 months',
            tone: 'mixed',
            signals: ['You think about them less each week', 'Other people start catching your attention'],
          },
          {
            title: 'The window closes',
            description:
              'They begin seeing someone else. You are left wondering what might have happened, a lesson you will carry into the next crossroads.',
            likelihood: 50,
            timeframe: '1–6 months',
            tone: 'shadow',
            signals: ['They mention someone new', 'The unsaid words feel heavier, not lighter'],
          },
        ],
      },
    ],
  },

  general: {
    label: 'Crossroads',
    keywords: [],
    branches: [
      {
        title: 'Commit fully',
        tag: 'Bold',
        description:
          'You decide to {action} and arrange the next few months around it, accepting the risk in exchange for momentum.',
        steps: ['Write down what success looks like in 6 months', 'Remove one obstacle immediately', 'Tell someone who will hold you to it'],
        outcomes: [
          {
            title: 'It pays off',
            description:
              'Commitment creates its own luck. Early wins build confidence, and in hindsight the hesitation looks smaller than it felt.',
            likelihood: 45,
            timeframe: '6–12 months',
            tone: 'bright',
            signals: ['Each step makes the next one easier', 'People around you start to invest in it too'],
          },
          {
            title: 'A costly lesson',
            description:
              'The bet does not land the way you hoped. It costs time and comfort, but you learn precisely what matters to you.',
            likelihood: 55,
            timeframe: '3–9 months',
            tone: 'shadow',
            signals: ['You are forcing it more than enjoying it', 'The costs keep surprising you'],
          },
        ],
      },
      {
        title: 'Run a small experiment',
        tag: 'Balanced',
        description:
          'Before going all-in, you test what it would mean to {action} on a small scale for 30 days, with a clear exit if the evidence says no.',
        steps: ['Define a 30-day trial with one measurable signal', 'Keep your current commitments intact', 'Review honestly when the 30 days end'],
        outcomes: [
          {
            title: 'Evidence says go',
            description:
              'The trial outperforms your expectations. You scale up with confidence, knowing it holds up beyond the excitement of the idea.',
            likelihood: 55,
            timeframe: '1–4 months',
            tone: 'bright',
            signals: ['You look forward to the trial tasks', 'The signal you defined is clearly met'],
          },
          {
            title: 'Evidence says not yet',
            description:
              'The experiment reveals friction you had not seen. You step back with little lost and a sharper sense of timing.',
            likelihood: 45,
            timeframe: '1–2 months',
            tone: 'mixed',
            signals: ['The trial feels like a chore by week two', 'Hidden costs emerge early'],
          },
        ],
      },
      {
        title: 'Hold your ground',
        tag: 'Cautious',
        description:
          'You decide not to {action} for now. You protect what is working and set a date to revisit the question with fresh eyes.',
        steps: ['Put a revisit date in your calendar', 'Note what would change your mind', 'Invest the saved energy somewhere visible'],
        outcomes: [
          {
            title: 'Stability compounds',
            description:
              'Staying the course lets existing efforts mature. When you revisit, the question has either answered itself or become easier.',
            likelihood: 50,
            timeframe: '6–12 months',
            tone: 'bright',
            signals: ['You rarely think about the road not taken', 'Current projects visibly improve'],
          },
          {
            title: 'Regret builds quietly',
            description:
              'The unexplored path stays on your mind. Months later the cost of waiting feels higher than the risk you avoided.',
            likelihood: 50,
            timeframe: '6–18 months',
            tone: 'shadow',
            signals: ['The idea resurfaces every few weeks', 'You envy people who took similar leaps'],
          },
        ],
      },
    ],
  },
};
