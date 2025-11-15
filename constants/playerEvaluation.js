export const PLAYER_EVALUATION_GROUPS = [
  {
    title: 'Physical',
    description: 'Speed, strength, and overall athletic capacity.',
    metrics: [
      { key: 'speed', label: 'Speed', description: 'Straight-line pace to separate in attack or recover defensively.' },
      { key: 'quickness', label: 'Quickness', description: 'First-step burst and ability to change gears instantly.' },
      { key: 'strength', label: 'Strength', description: 'Holds off challenges and wins shoulder-to-shoulder duels.' },
      { key: 'size', label: 'Size', description: 'Overall frame/presence when shielding or contesting in the air.' },
      { key: 'endurance', label: 'Endurance', description: 'Capacity to stay lively across full LIJSL match loads.' },
      { key: 'balance', label: 'Balance / Coordination', description: 'Body control while twisting, receiving, and absorbing contact.' },
    ],
  },
  {
    title: 'Technical',
    description: 'Ability with the ball at their feet under pressure.',
    metrics: [
      { key: 'firstTouch', label: 'First Touch', description: 'Quality of initial control to set up the next action.' },
      { key: 'passing', label: 'Passing', description: 'Accuracy and weight of passes over varied distances.' },
      { key: 'dribbling', label: 'Dribbling', description: 'Confidence carrying at defenders to unbalance lines.' },
      { key: 'weakFoot', label: 'Weak Foot', description: 'Reliability using the weaker foot for touches, passes, and strikes.' },
      { key: 'shotPower', label: 'Shot Power', description: 'Velocity and drive behind strikes from range or in the box.' },
      { key: 'finishing', label: 'Finishing', description: 'Composure turning chances into goals with different surfaces.' },
      { key: 'ballControl', label: 'Ball Control', description: 'Comfort manipulating the ball in tight areas under pressure.' },
    ],
  },
  {
    title: 'Tactical / IQ',
    description: 'Decision-making and team oriented awareness.',
    metrics: [
      { key: 'vision', label: 'Vision', description: 'Identifies teammates/space before the ball arrives.' },
      { key: 'positioning', label: 'Positioning', description: 'Occupies intelligent pockets relative to ball and opponents.' },
      { key: 'awareness', label: 'Awareness', description: 'Constant scanning to track runners and match cues.' },
      { key: 'decisionMaking', label: 'Decision-making', description: 'Chooses the best option quickly under pressure.' },
      { key: 'usingTeammates', label: 'Using Teammates', description: 'Combines via give-and-go play and overload patterns.' },
      { key: 'makingRuns', label: 'Making Runs', description: 'Times movement to create passing lanes or stretch lines.' },
      { key: 'defensiveIq', label: 'Defensive IQ', description: 'Understands angles, shape, and pressing triggers.' },
    ],
  },
  {
    title: 'Mental / Intangibles',
    description: 'Mindset, coachability, and competitive motor.',
    metrics: [
      { key: 'workRate', label: 'Work Rate', description: 'Consistency of effort on both sides of the ball.' },
      { key: 'aggressiveness', label: 'Aggressiveness', description: 'Willingness to engage in duels and 50/50s.' },
      { key: 'focus', label: 'Focus', description: 'Stays locked in regardless of scoreline or fatigue.' },
      { key: 'coachability', label: 'Coachability', description: 'Implements feedback and adjustments quickly.' },
      { key: 'effort', label: 'Effort', description: 'Shows grit fighting through tough stretches.' },
      { key: 'confidence', label: 'Confidence', description: 'Believes in ability and plays assertively.' },
      { key: 'growthMindset', label: 'Growth Mindset', description: 'Embraces challenges and trackable goals.' },
    ],
  },
  {
    title: 'Role-Specific',
    description: 'Tools tied to positional responsibilities.',
    metrics: [
      { key: 'oneVOneAttacking', label: '1v1 Attacking', description: 'Beats defenders to create shots or slip teammates in.' },
      { key: 'oneVOneDefending', label: '1v1 Defending', description: 'Body shape and timing to delay or win the ball.' },
      { key: 'transitionPlay', label: 'Transition Play', description: 'Reactiveness when the ball turns over in either phase.' },
      { key: 'distribution', label: 'Distribution', description: 'Starts play with clean outlets, switches, and restarts.' },
      { key: 'holdUpPlay', label: 'Hold-up Play', description: 'Secures the ball to bring midfielders into the attack.' },
      { key: 'aerialAbility', label: 'Aerial Ability', description: 'Wins headers offensively and defensively.' },
    ],
  },
];

export const DEFAULT_EVALUATION_VALUE = 0;
export const EVALUATION_SCALE = { min: 0, target: 50 };

export const PLAYER_EVALUATION_METRIC_MAP = PLAYER_EVALUATION_GROUPS.reduce((map, group) => {
  group.metrics.forEach((metric) => {
    map[metric.key] = { ...metric, group: group.title };
  });
  return map;
}, {});
