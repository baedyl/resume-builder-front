export const metadata = {
  title: "Turn Tasks Into Wins: The Bullet Formula That Gets Interviews",
  excerpt: "Master the STAR/PAR formula to transform boring task lists into quantified achievements. Learn the action–impact structure, discover metrics for every domain, and use ProAI to convert responsibilities into interview-winning bullets.",
  author: "Emmanuel Dylan",
  authorTitle: "Career Coach & Resume Expert",
  date: "November 3, 2025",
  readTime: "10 min read",
  category: "resume-tips",
  image: "https://res.cloudinary.com/dssnz4eum/image/upload/v1761843850/3_rv7jjp.svg",
  rating: 4.8,
  ratingCount: 142,
  tableOfContents: [
    "Why Task Lists Kill Your Chances",
    "The Bullet Formula: Action + Metric + Outcome",
    "Choosing the Right Metrics",
    "STAR vs. PAR: Pick Your Framework",
    "Domain Examples: Sales, Ops, Engineering",
    "The 15-Metric Cheat Sheet",
    "Verbs to Numbers: The Transformation",
    "ProAI Rewrite Workflow",
    "Before/After Bullet Transformations",
    "Common Mistakes to Avoid",
    "FAQ",
    "Call to Action"
  ]
};

export const content = `
<div class="mb-8">
  <p class="text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-300">Hiring managers scan your resume for about 7 seconds. If all they see is a list of responsibilities — "managed projects," "worked with team," "responsible for tasks" — your resume goes straight to the reject pile. The difference between job seekers who get interviews and those who don't? <strong>Quantified achievements instead of vague duties</strong>.</p>
  <p class="text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-300">This guide teaches you a simple bullet formula that converts every responsibility into a win: <strong>Action + Metric + Outcome</strong>. You'll learn how to choose metrics, apply STAR/PAR frameworks, see real examples across sales, operations, and engineering, and discover how <strong>ProAI Resume Online</strong> automates the entire rewrite process in minutes.</p>
</div>

<div class="mb-10">
  <figure class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <div class="w-full overflow-x-auto">
      <svg viewBox="0 0 1000 200" class="w-full h-48" role="img" aria-label="The bullet formula pipeline: Responsibility to Action to Metric to Outcome">
        <defs>
          <linearGradient id="grad-task" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ef4444"/>
            <stop offset="100%" stop-color="#dc2626"/>
          </linearGradient>
          <linearGradient id="grad-action" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6"/>
            <stop offset="100%" stop-color="#2563eb"/>
          </linearGradient>
          <linearGradient id="grad-metric" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#8b5cf6"/>
            <stop offset="100%" stop-color="#7c3aed"/>
          </linearGradient>
          <linearGradient id="grad-outcome" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#10b981"/>
            <stop offset="100%" stop-color="#059669"/>
          </linearGradient>
          <marker id="arrow-bullet" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
            <polygon points="0 0, 10 5, 0 10" fill="#94a3b8" />
          </marker>
          <filter id="shadow-bullet" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.15"/>
          </filter>
        </defs>
        <rect x="0" y="0" width="1000" height="200" fill="transparent" />
        <g transform="translate(50,50)" font-family="Inter, system-ui, sans-serif">
          <g filter="url(#shadow-bullet)">
            <rect x="0" y="0" width="180" height="100" rx="14" fill="url(#grad-task)"/>
            <text x="90" y="45" text-anchor="middle" fill="#ffffff" font-weight="700" font-size="14">Responsibility</text>
            <text x="90" y="65" text-anchor="middle" fill="#ffffff" fill-opacity="0.9" font-size="11">Managed team</text>
          </g>
          <g stroke="#94a3b8" stroke-width="2.5" fill="none" marker-end="url(#arrow-bullet)">
            <line x1="180" y1="50" x2="210" y2="50"/>
          </g>
          <g filter="url(#shadow-bullet)" transform="translate(210,0)">
            <rect x="0" y="0" width="180" height="100" rx="14" fill="url(#grad-action)"/>
            <text x="90" y="45" text-anchor="middle" fill="#ffffff" font-weight="700" font-size="14">Action</text>
            <text x="90" y="65" text-anchor="middle" fill="#ffffff" fill-opacity="0.9" font-size="11">Led cross-functional</text>
          </g>
          <g stroke="#94a3b8" stroke-width="2.5" fill="none" marker-end="url(#arrow-bullet)" transform="translate(210,0)">
            <line x1="180" y1="50" x2="210" y2="50"/>
          </g>
          <g filter="url(#shadow-bullet)" transform="translate(420,0)">
            <rect x="0" y="0" width="180" height="100" rx="14" fill="url(#grad-metric)"/>
            <text x="90" y="45" text-anchor="middle" fill="#ffffff" font-weight="700" font-size="14">Metric</text>
            <text x="90" y="65" text-anchor="middle" fill="#ffffff" fill-opacity="0.9" font-size="11">12-person team</text>
          </g>
          <g stroke="#94a3b8" stroke-width="2.5" fill="none" marker-end="url(#arrow-bullet)" transform="translate(420,0)">
            <line x1="180" y1="50" x2="210" y2="50"/>
          </g>
          <g filter="url(#shadow-bullet)" transform="translate(630,0)">
            <rect x="0" y="0" width="180" height="100" rx="14" fill="url(#grad-outcome)"/>
            <text x="90" y="45" text-anchor="middle" fill="#ffffff" font-weight="700" font-size="14">Outcome</text>
            <text x="90" y="65" text-anchor="middle" fill="#ffffff" fill-opacity="0.9" font-size="11">+28% velocity</text>
          </g>
        </g>
      </svg>
    </div>
    <figcaption class="text-sm text-gray-600 dark:text-gray-300 p-4">Transform vague responsibilities into interview-winning bullets with the Action + Metric + Outcome formula.</figcaption>
  </figure>
</div>

<div class="mb-12">
  <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Why Task Lists Kill Your Chances</h2>
  <p class="text-lg leading-relaxed mb-4 text-gray-700 dark:text-gray-300">Most resumes read like job descriptions: "Responsible for managing client relationships," "Assisted with data analysis," "Coordinated team meetings." These phrases tell recruiters <em>what you did</em> but not <em>what changed because you did it</em>.</p>
  <div class="grid md:grid-cols-2 gap-6">
    <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-red-900 dark:text-red-200 mb-3">Task-based bullets</h3>
      <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>Generic, forgettable, interchangeable</li>
        <li>No proof of impact or value</li>
        <li>Fails ATS keyword matching for outcomes</li>
        <li>Doesn't differentiate you from other candidates</li>
      </ul>
    </div>
    <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-green-900 dark:text-green-200 mb-3">Achievement-based bullets</h3>
      <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>Specific, memorable, credible</li>
        <li>Quantifies results and outcomes</li>
        <li>Matches employer ROI expectations</li>
        <li>Proves you deliver measurable value</li>
      </ul>
    </div>
  </div>
</div>

<div class="mb-12">
  <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">The Bullet Formula: Action + Metric + Outcome</h2>
  <p class="text-lg leading-relaxed mb-4 text-gray-700 dark:text-gray-300">Every strong resume bullet follows this three-part structure:</p>
  <div class="space-y-4">
    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">1. Action</h3>
      <p class="text-gray-700 dark:text-gray-300 mb-2">Start with a strong verb that shows ownership: <em>Led, Built, Increased, Reduced, Launched, Optimized, Designed</em>. Avoid passive verbs like "Responsible for," "Assisted with," "Helped."</p>
      <p class="text-sm text-gray-600 dark:text-gray-400 italic">Example: "Led" not "Was responsible for leading"</p>
    </div>
    <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-2">2. Metric</h3>
      <p class="text-gray-700 dark:text-gray-300 mb-2">Add scope, scale, or size: team size, budget, volume, users, projects. This shows the magnitude of your work.</p>
      <p class="text-sm text-gray-600 dark:text-gray-400 italic">Example: "8-person cross-functional team" or "$2.4M marketing budget"</p>
    </div>
    <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">3. Outcome</h3>
      <p class="text-gray-700 dark:text-gray-300 mb-2">Quantify the result: percentage increase/decrease, time saved, revenue generated, efficiency gained. This is your proof of impact.</p>
      <p class="text-sm text-gray-600 dark:text-gray-400 italic">Example: "+32% conversion rate" or "Reduced processing time from 4 days to 6 hours"</p>
    </div>
  </div>
  <div class="mt-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-6 border-l-4 border-blue-600">
    <p class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Complete Example</p>
    <p class="text-gray-700 dark:text-gray-300">"<strong>Led</strong> <span class="text-blue-600 dark:text-blue-400">8-person cross-functional team</span> to launch redesigned checkout flow, <span class="text-green-600 dark:text-green-400">increasing conversion rate by 32%</span> and adding <span class="text-green-600 dark:text-green-400">$1.2M annual revenue</span>."</p>
  </div>
</div>

<div class="mb-12">
  <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Choosing the Right Metrics</h2>
  <p class="text-lg leading-relaxed mb-4 text-gray-700 dark:text-gray-300">The best metrics depend on your role, but every job has quantifiable elements. Here's how to find them:</p>
  <div class="grid md:grid-cols-3 gap-6">
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Scope metrics</h3>
      <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm">
        <li>Team size (people managed/influenced)</li>
        <li>Budget size ($X managed/allocated)</li>
        <li>Project count (launched X initiatives)</li>
        <li>User base (served X customers)</li>
      </ul>
    </div>
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Efficiency metrics</h3>
      <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm">
        <li>Time saved (reduced from X to Y)</li>
        <li>Cost reduction (cut expenses by X%)</li>
        <li>Process improvement (X% faster)</li>
        <li>Error reduction (decreased bugs by X%)</li>
      </ul>
    </div>
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Growth metrics</h3>
      <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm">
        <li>Revenue increase (+$X or +X%)</li>
        <li>User growth (+X% MoM/YoY)</li>
        <li>Engagement lift (+X% sessions)</li>
        <li>Conversion improvement (+X% rate)</li>
      </ul>
    </div>
  </div>
  <div class="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border-l-4 border-amber-600">
    <p class="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">Pro tip</p>
    <p class="text-gray-700 dark:text-gray-300 text-sm">Don't have exact numbers? Use reasonable estimates like "~15% faster," "managed team of 6-8," or "handled 200+ client requests monthly." Approximate scale beats no metric.</p>
  </div>
</div>

<div class="mb-12">
  <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">STAR vs. PAR: Pick Your Framework</h2>
  <p class="text-lg leading-relaxed mb-4 text-gray-700 dark:text-gray-300">Both STAR and PAR help structure achievement bullets. Use whichever feels more natural — they work the same way.</p>
  <div class="grid md:grid-cols-2 gap-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-700 p-6">
      <h3 class="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-4">STAR Method</h3>
      <ul class="space-y-3 text-gray-700 dark:text-gray-300">
        <li><strong class="text-blue-600 dark:text-blue-400">S</strong>ituation: Context or challenge</li>
        <li><strong class="text-blue-600 dark:text-blue-400">T</strong>ask: Your specific role</li>
        <li><strong class="text-blue-600 dark:text-blue-400">A</strong>ction: What you did</li>
        <li><strong class="text-blue-600 dark:text-blue-400">R</strong>esult: Quantified outcome</li>
      </ul>
      <div class="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded p-3">
        <p class="text-sm text-gray-700 dark:text-gray-300"><strong>Example:</strong> Facing 40% cart abandonment (S), owned checkout redesign (T), led A/B tests across 3 variations (A), cut abandonment to 24% and added $800K revenue (R).</p>
      </div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-200 dark:border-purple-700 p-6">
      <h3 class="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4">PAR Method</h3>
      <ul class="space-y-3 text-gray-700 dark:text-gray-300">
        <li><strong class="text-purple-600 dark:text-purple-400">P</strong>roblem: The challenge or gap</li>
        <li><strong class="text-purple-600 dark:text-purple-400">A</strong>ction: Your solution or initiative</li>
        <li><strong class="text-purple-600 dark:text-purple-400">R</strong>esult: Measurable impact</li>
      </ul>
      <div class="mt-4 bg-purple-50 dark:bg-purple-900/20 rounded p-3">
        <p class="text-sm text-gray-700 dark:text-gray-300"><strong>Example:</strong> Manual data entry caused 48-hour reporting delays (P), built automated Python pipeline on Snowflake (A), reduced delays to 2 hours and saved 15 hours/week (R).</p>
      </div>
    </div>
  </div>
</div>

<div class="mb-12">
  <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Domain Examples: Sales, Ops, Engineering</h2>
  <p class="text-lg leading-relaxed mb-4 text-gray-700 dark:text-gray-300">Here's how to apply the bullet formula across different job families:</p>
  
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Sales</h3>
      <div class="space-y-3">
        <div class="border-l-4 border-red-500 pl-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Before (task-based)</p>
          <p class="text-gray-700 dark:text-gray-300">"Responsible for managing client accounts."</p>
        </div>
        <div class="border-l-4 border-green-500 pl-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">After (achievement-based)</p>
          <p class="text-gray-700 dark:text-gray-300">"<strong>Managed</strong> portfolio of 35 enterprise accounts ($4.2M ARR), driving <strong>22% upsell revenue</strong> and achieving <strong>118% of quota</strong> for 3 consecutive quarters."</p>
        </div>
      </div>
      <div class="mt-4 space-y-3">
        <div class="border-l-4 border-red-500 pl-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Before</p>
          <p class="text-gray-700 dark:text-gray-300">"Worked on lead generation campaigns."</p>
        </div>
        <div class="border-l-4 border-green-500 pl-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">After</p>
          <p class="text-gray-700 dark:text-gray-300">"<strong>Launched</strong> outbound sequences targeting C-suite in fintech, generating <strong>180+ qualified leads</strong> and converting <strong>12 to closed-won</strong> ($620K pipeline)."</p>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Operations</h3>
      <div class="space-y-3">
        <div class="border-l-4 border-red-500 pl-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Before</p>
          <p class="text-gray-700 dark:text-gray-300">"Handled supply chain coordination."</p>
        </div>
        <div class="border-l-4 border-green-500 pl-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">After</p>
          <p class="text-gray-700 dark:text-gray-300">"<strong>Optimized</strong> supply chain routing across 4 distribution centers, cutting <strong>delivery times by 18%</strong> and reducing <strong>logistics costs by $340K annually</strong>."</p>
        </div>
      </div>
      <div class="mt-4 space-y-3">
        <div class="border-l-4 border-red-500 pl-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Before</p>
          <p class="text-gray-700 dark:text-gray-300">"Assisted with process improvements."</p>
        </div>
        <div class="border-l-4 border-green-500 pl-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">After</p>
          <p class="text-gray-700 dark:text-gray-300">"<strong>Redesigned</strong> onboarding workflow using Lean Six Sigma, reducing <strong>new hire ramp time from 8 weeks to 5 weeks</strong> and improving <strong>90-day retention by 14%</strong>."</p>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Engineering</h3>
      <div class="space-y-3">
        <div class="border-l-4 border-red-500 pl-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Before</p>
          <p class="text-gray-700 dark:text-gray-300">"Developed new features for the platform."</p>
        </div>
        <div class="border-l-4 border-green-500 pl-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">After</p>
          <p class="text-gray-700 dark:text-gray-300">"<strong>Built</strong> real-time notification service using Node.js and Redis, supporting <strong>2M+ daily events</strong> with <strong>99.97% uptime</strong> and <strong>sub-200ms latency</strong>."</p>
        </div>
      </div>
      <div class="mt-4 space-y-3">
        <div class="border-l-4 border-red-500 pl-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Before</p>
          <p class="text-gray-700 dark:text-gray-300">"Worked on improving code quality."</p>
        </div>
        <div class="border-l-4 border-green-500 pl-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">After</p>
          <p class="text-gray-700 dark:text-gray-300">"<strong>Refactored</strong> legacy authentication module (12K+ lines) to microservices architecture, reducing <strong>security vulnerabilities by 83%</strong> and cutting <strong>CI/CD build time from 18 to 6 minutes</strong>."</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="mb-12">
  <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">The 15-Metric Cheat Sheet</h2>
  <p class="text-lg leading-relaxed mb-4 text-gray-700 dark:text-gray-300">Keep this list handy when rewriting bullets. Pick 1–2 metrics per bullet for maximum impact:</p>
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <table class="w-full text-left">
      <thead class="bg-gray-100 dark:bg-gray-700">
        <tr>
          <th class="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Metric Type</th>
          <th class="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Examples</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Revenue</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">+$1.2M ARR, +18% revenue growth, $450K cost savings</td>
        </tr>
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Time</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Reduced from 4 days to 6 hours, saved 12 hours/week</td>
        </tr>
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Percentage Gains</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">+32% conversion, +45% engagement, -22% churn</td>
        </tr>
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Volume</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Processed 5K+ tickets/month, served 200K+ users</td>
        </tr>
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Team/Scope</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Led 8-person team, managed $2.4M budget</td>
        </tr>
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Quality/Accuracy</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">99.8% uptime, reduced errors by 67%, 95% CSAT</td>
        </tr>
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Frequency</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Weekly, monthly, quarterly cadence</td>
        </tr>
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">User Growth</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">+28% MAU, grew base from 10K to 45K</td>
        </tr>
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Efficiency</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">40% faster processing, 3x throughput</td>
        </tr>
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Ranking/Position</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Top 5% performer, #2 in region, promoted in 18 months</td>
        </tr>
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Projects Delivered</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Shipped 7 features, launched 12 campaigns</td>
        </tr>
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Adoption/Usage</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">80% team adoption, 3x session length</td>
        </tr>
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Scale</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Managed 200+ SKUs, handled 50M+ API calls/day</td>
        </tr>
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Customer Impact</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">4.8/5 NPS, +35% retention, -40% support tickets</td>
        </tr>
        <tr>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">Cross-functional</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">Collaborated with 5 departments, aligned 3 stakeholders</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div class="mb-12">
  <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Verbs to Numbers: The Transformation</h2>
  <p class="text-lg leading-relaxed mb-4 text-gray-700 dark:text-gray-300">Pair powerful action verbs with concrete numbers to create unstoppable bullets. Here's the visual:</p>
  <div class="mt-6">
    <figure class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div class="w-full overflow-x-auto">
        <svg viewBox="0 0 1000 400" class="w-full" role="img" aria-label="Verbs to numbers transformation showing weak and strong bullet pairs">
          <defs>
            <filter id="shadow-transform" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.12"/>
            </filter>
            <marker id="arrow-transform" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <polygon points="0 0, 10 5, 0 10" fill="#10b981" />
            </marker>
          </defs>
          <rect x="0" y="0" width="1000" height="400" fill="transparent" />
          <g transform="translate(60,40)" font-family="Inter, system-ui">
            <text x="0" y="0" font-size="18" font-weight="800" fill="#1f2937">Weak Verbs</text>
            <text x="500" y="0" font-size="18" font-weight="800" fill="#1f2937">Strong Verbs + Numbers</text>
            
            <g transform="translate(0,30)">
              <rect x="0" y="0" width="400" height="60" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="2" filter="url(#shadow-transform)"/>
              <text x="20" y="38" font-size="14" fill="#991b1b">Responsible for client relationships</text>
            </g>
            <g stroke="#10b981" stroke-width="2.5" fill="none" marker-end="url(#arrow-transform)">
              <line x1="400" y1="60" x2="480" y2="60"/>
            </g>
            <g transform="translate(500,30)">
              <rect x="0" y="0" width="400" height="60" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="2" filter="url(#shadow-transform)"/>
              <text x="20" y="38" font-size="14" fill="#065f46" font-weight="600">Managed 35 enterprise accounts ($4.2M ARR)</text>
            </g>

            <g transform="translate(0,110)">
              <rect x="0" y="0" width="400" height="60" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="2" filter="url(#shadow-transform)"/>
              <text x="20" y="38" font-size="14" fill="#991b1b">Worked on improving processes</text>
            </g>
            <g stroke="#10b981" stroke-width="2.5" fill="none" marker-end="url(#arrow-transform)">
              <line x1="400" y1="140" x2="480" y2="140"/>
            </g>
            <g transform="translate(500,110)">
              <rect x="0" y="0" width="400" height="60" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="2" filter="url(#shadow-transform)"/>
              <text x="20" y="38" font-size="14" fill="#065f46" font-weight="600">Reduced processing time by 62% (4 days → 6 hrs)</text>
            </g>

            <g transform="translate(0,190)">
              <rect x="0" y="0" width="400" height="60" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="2" filter="url(#shadow-transform)"/>
              <text x="20" y="38" font-size="14" fill="#991b1b">Helped with marketing campaigns</text>
            </g>
            <g stroke="#10b981" stroke-width="2.5" fill="none" marker-end="url(#arrow-transform)">
              <line x1="400" y1="220" x2="480" y2="220"/>
            </g>
            <g transform="translate(500,190)">
              <rect x="0" y="0" width="400" height="60" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="2" filter="url(#shadow-transform)"/>
              <text x="20" y="38" font-size="14" fill="#065f46" font-weight="600">Launched 5 campaigns, +28% leads, +$840K pipeline</text>
            </g>

            <g transform="translate(0,270)">
              <rect x="0" y="0" width="400" height="60" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="2" filter="url(#shadow-transform)"/>
              <text x="20" y="38" font-size="14" fill="#991b1b">Developed features for the platform</text>
            </g>
            <g stroke="#10b981" stroke-width="2.5" fill="none" marker-end="url(#arrow-transform)">
              <line x1="400" y1="300" x2="480" y2="300"/>
            </g>
            <g transform="translate(500,270)">
              <rect x="0" y="0" width="400" height="60" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="2" filter="url(#shadow-transform)"/>
              <text x="20" y="38" font-size="14" fill="#065f46" font-weight="600">Built API serving 50M+ requests/day, 99.9% uptime</text>
            </g>
          </g>
        </svg>
      </div>
      <figcaption class="text-sm text-gray-600 dark:text-gray-300 p-4">Replace weak, passive verbs with strong action verbs backed by concrete numbers and outcomes.</figcaption>
    </figure>
  </div>
</div>

<div class="mb-12">
  <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">ProAI Rewrite Workflow</h2>
  <p class="text-lg leading-relaxed mb-4 text-gray-700 dark:text-gray-300">Rewriting every bullet manually takes hours. <strong>ProAI Resume Online</strong> automates the transformation in minutes. Here's the flow:</p>
  <ol class="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
    <li><strong>Upload your resume</strong> or paste existing bullets</li>
    <li><strong>Select weak bullets</strong> — ProAI flags task-based language</li>
    <li><strong>Choose your domain</strong> (sales, ops, engineering, etc.)</li>
    <li><strong>Generate suggestions</strong> — ProAI rewrites using Action + Metric + Outcome</li>
    <li><strong>Add context</strong> (team size, budget, timeframe) if missing</li>
    <li><strong>Review and refine</strong> — pick the strongest version or blend multiple suggestions</li>
    <li><strong>Export your new resume</strong> with quantified, interview-winning bullets</li>
  </ol>
  <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-l-4 border-blue-600">
    <p class="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">ProAI advantage</p>
    <p class="text-gray-700 dark:text-gray-300 text-sm">ProAI learns from thousands of high-performing resumes. It suggests metrics you might not think of, catches vague phrasing, and ensures every bullet follows the proven Action + Metric + Outcome formula.</p>
  </div>
</div>

<div class="mb-12">
  <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Before/After Bullet Transformations</h2>
  <p class="text-lg leading-relaxed mb-4 text-gray-700 dark:text-gray-300">See the difference quantified bullets make across roles:</p>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="grid md:grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
        <div class="p-6 bg-red-50/50 dark:bg-red-900/10">
          <p class="text-sm font-semibold text-red-900 dark:text-red-200 mb-3">Before</p>
          <p class="text-gray-700 dark:text-gray-300">"Managed social media accounts for the company."</p>
        </div>
        <div class="p-6 bg-green-50/50 dark:bg-green-900/10">
          <p class="text-sm font-semibold text-green-900 dark:text-green-200 mb-3">After</p>
          <p class="text-gray-700 dark:text-gray-300">"<strong>Grew</strong> Instagram and LinkedIn followers from 2.4K to 18K in 9 months, driving <strong>+45% website traffic</strong> and generating <strong>240+ inbound leads</strong>."</p>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="grid md:grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
        <div class="p-6 bg-red-50/50 dark:bg-red-900/10">
          <p class="text-sm font-semibold text-red-900 dark:text-red-200 mb-3">Before</p>
          <p class="text-gray-700 dark:text-gray-300">"Coordinated team meetings and project timelines."</p>
        </div>
        <div class="p-6 bg-green-50/50 dark:bg-green-900/10">
          <p class="text-sm font-semibold text-green-900 dark:text-green-200 mb-3">After</p>
          <p class="text-gray-700 dark:text-gray-300">"<strong>Led</strong> agile ceremonies for 10-person product team, delivering <strong>8 features on schedule</strong> and improving <strong>sprint velocity by 35%</strong>."</p>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="grid md:grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
        <div class="p-6 bg-red-50/50 dark:bg-red-900/10">
          <p class="text-sm font-semibold text-red-900 dark:text-red-200 mb-3">Before</p>
          <p class="text-gray-700 dark:text-gray-300">"Provided customer support via email and phone."</p>
        </div>
        <div class="p-6 bg-green-50/50 dark:bg-green-900/10">
          <p class="text-sm font-semibold text-green-900 dark:text-green-200 mb-3">After</p>
          <p class="text-gray-700 dark:text-gray-300">"<strong>Resolved</strong> 150+ customer inquiries weekly across email, chat, and phone, maintaining <strong>98% CSAT</strong> and reducing <strong>avg response time from 6 hours to 45 minutes</strong>."</p>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="grid md:grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
        <div class="p-6 bg-red-50/50 dark:bg-red-900/10">
          <p class="text-sm font-semibold text-red-900 dark:text-red-200 mb-3">Before</p>
          <p class="text-gray-700 dark:text-gray-300">"Built dashboards to track key metrics."</p>
        </div>
        <div class="p-6 bg-green-50/50 dark:bg-green-900/10">
          <p class="text-sm font-semibold text-green-900 dark:text-green-200 mb-3">After</p>
          <p class="text-gray-700 dark:text-gray-300">"<strong>Designed</strong> Tableau dashboards tracking 25+ KPIs for C-suite, enabling <strong>data-driven decisions</strong> that improved <strong>customer retention by 12%</strong>."</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="mb-12">
  <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Common Mistakes to Avoid</h2>
  <div class="space-y-4">
    <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border-l-4 border-red-600">
      <h3 class="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">❌ Using passive voice</h3>
      <p class="text-gray-700 dark:text-gray-300 mb-2">"Was responsible for managing..." → Start with an action verb instead.</p>
      <p class="text-sm text-green-700 dark:text-green-300">✅ "Managed..."</p>
    </div>
    <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border-l-4 border-red-600">
      <h3 class="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">❌ Listing duties without outcomes</h3>
      <p class="text-gray-700 dark:text-gray-300 mb-2">"Sent weekly newsletters" → What happened because you sent them?</p>
      <p class="text-sm text-green-700 dark:text-green-300">✅ "Launched weekly newsletters to 12K subscribers, boosting open rates from 18% to 34%"</p>
    </div>
    <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border-l-4 border-red-600">
      <h3 class="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">❌ Over-inflating or lying</h3>
      <p class="text-gray-700 dark:text-gray-300 mb-2">If you contributed to a team win, say "Contributed to..." Don't claim sole credit. Be honest and specific.</p>
    </div>
    <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border-l-4 border-red-600">
      <h3 class="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">❌ Too many metrics in one bullet</h3>
      <p class="text-gray-700 dark:text-gray-300 mb-2">1–2 strong metrics per bullet. More than that dilutes impact.</p>
    </div>
    <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border-l-4 border-red-600">
      <h3 class="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">❌ Ignoring context</h3>
      <p class="text-gray-700 dark:text-gray-300 mb-2">"Increased sales by 200%" sounds great — but if it went from $1K to $3K, provide scale. If it's $1M to $3M, lead with revenue.</p>
    </div>
  </div>
</div>

<div class="mb-12">
  <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">FAQ</h2>
  <div class="space-y-4">
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">What if I don't have exact numbers?</h3>
      <p class="text-gray-700 dark:text-gray-300">Use reasonable estimates: "~20% faster," "managed team of 5-7," "handled 100+ requests/week." Approximations are better than no metrics.</p>
    </div>
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Can I use this formula for entry-level roles?</h3>
      <p class="text-gray-700 dark:text-gray-300">Absolutely. Focus on internships, projects, volunteer work, or school activities. Example: "Led 4-person team to build campus event app, used by 600+ students in first month."</p>
    </div>
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">How many bullets per job?</h3>
      <p class="text-gray-700 dark:text-gray-300">3–5 bullets for recent roles, 2–3 for older roles. Prioritize the most impressive, relevant wins.</p>
    </div>
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Should every bullet have a number?</h3>
      <p class="text-gray-700 dark:text-gray-300">Ideally yes, but 1–2 bullets can describe leadership, cross-functional work, or strategic initiatives if numbers aren't applicable. Just make sure most bullets quantify impact.</p>
    </div>
  </div>
</div>

<div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-center text-white mb-4">
  <h2 class="text-2xl md:text-3xl font-bold mb-3">Turn Your Tasks Into Wins — Instantly</h2>
  <p class="text-lg mb-6 opacity-90">Paste your resume bullets into ProAI and watch them transform into quantified achievements that recruiters can't ignore. Action + Metric + Outcome, done for you.</p>
  <a href="/resume" class="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Try ProAI Resume Online</a>
</div>
`;

