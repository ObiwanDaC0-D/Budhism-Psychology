/* Mind Explorer Learning Lab — educational content and assessments.
   Multiple-choice questions are conceptual learning checks, not clinical or spiritual assessments. */
window.MindLabData = {
  tracks: [
    {id:"beginner",label:"Foundations",level:"01 · Begin here",description:"Get oriented: why the Buddha taught, what changes, and how training begins.",ids:["four-truths","dukkha","impermanence","mindfulness","eightfold"]},
    {id:"intermediate",label:"Understanding Experience",level:"02 · Build insight",description:"Investigate how sensations, interpretations, impulses, and habits condition reactions.",ids:["aggregates","feeling","craving","clinging","three-poisons"]},
    {id:"advanced",label:"Integration & Liberation",level:"03 · Connect ideas",description:"Examine conditionality, identification, and the balance of compassion and equanimity.",ids:["dependent","non-self","compassion","equanimity"]}
  ],
  nodes: {
    "four-truths":[110,85],"dukkha":[110,250],
    "impermanence":[325,80],"aggregates":[325,255],"non-self":[325,435],
    "dependent":[535,72],"feeling":[535,205],"craving":[535,338],"clinging":[535,473],
    "three-poisons":[748,93],"mindfulness":[748,267],"equanimity":[748,445],
    "compassion":[945,176],"eightfold":[945,374]
  },
  edges: [
    ["four-truths","dukkha","recognizes"],
    ["four-truths","eightfold","sets out the path"],
    ["impermanence","dukkha","reveals unreliability"],
    ["impermanence","non-self","supports investigation"],
    ["aggregates","non-self","investigated as not-self"],
    ["dependent","feeling","explains conditions"],
    ["feeling","craving","can condition"],
    ["craving","clinging","can condition"],
    ["clinging","dukkha","sustains distress"],
    ["three-poisons","craving","greed encourages"],
    ["mindfulness","feeling","recognizes"],
    ["mindfulness","three-poisons","observes tendencies"],
    ["eightfold","mindfulness","includes"],
    ["eightfold","compassion","supports cultivation"],
    ["compassion","equanimity","balanced by"],
    ["equanimity","mindfulness","supports clear awareness"]
  ],
  chain: [
    {id:"contact",label:"Contact",description:"A sight, sound, thought, or other sense impression meets awareness.",example:"A colleague offers unexpected criticism.",related:"dependent"},
    {id:"feeling",label:"Feeling tone",description:"The experience is felt as pleasant, unpleasant, or neutral.",example:"An unpleasant tightness appears.",related:"feeling"},
    {id:"craving",label:"Craving / aversion",description:"An urge may arise to make the experience change or go away.",example:"You want the discomfort and criticism to stop.",related:"craving"},
    {id:"clinging",label:"Clinging",description:"The mind may hold tight to an identity, view, or desired outcome.",example:"You feel you must be seen as competent.",related:"clinging"},
    {id:"dukkha",label:"Added distress",description:"Rumination, fixation, or resistance can intensify the original pain.",example:"You replay the conversation all evening.",related:"dukkha"},
    {id:"response",label:"Wise response",description:"Awareness can support a thoughtful response rather than an automatic reaction.",example:"You listen, clarify, set boundaries if needed, and act wisely.",related:"mindfulness"}
  ],
  questions: {
    "four-truths":[
      ["Which task belongs to the First Noble Truth?",["Understand dukkha","Abandon compassion","Eliminate all physical pain","Acquire a permanent identity"],0,"The First Noble Truth points to understanding dukkha. The remaining truths concern origin, cessation, and the path."],
      ["What does the Fourth Noble Truth identify?",["The five aggregates","The Noble Eightfold Path","Four types of meditation","A fixed social identity"],1,"The fourth truth identifies a path of practice, expressed as the Noble Eightfold Path."]
    ],
    "dukkha":[
      ["Which best captures the breadth of dukkha?",["Only severe bodily pain","A prohibition on enjoying life","Stress and unreliability in conditioned experience","An unchanging emotional trait"],2,"Dukkha includes obvious pain, dissatisfaction connected with change, and the unreliability of conditioned experience."],
      ["Why can a pleasant experience relate to dukkha?",["It is morally wrong to enjoy it","It never actually occurs","It proves pleasure causes illness","It changes and cannot guarantee lasting security"],3,"The point is not that pleasure is bad, but that changing conditions cannot provide permanent satisfaction."]
    ],
    "impermanence":[
      ["What does anicca describe?",["Conditioned phenomena change","Nothing matters ethically","All choices have identical effects","Feelings are always unpleasant"],0,"Anicca concerns the changing nature of conditioned phenomena; ethics and care remain meaningful."],
      ["Which practice directly illustrates impermanence?",["Demand that an emotion disappear","Notice how a sensation shifts over time","Assume a feeling predicts the future","Suppress all bodily awareness"],1,"Observing the changing character of sensations gives a concrete way to investigate impermanence."]
    ],
    "mindfulness":[
      ["In classical Buddhist practice, mindfulness is best understood as:",["Relaxation alone","Distraction from discomfort","Clear remembering and attentive awareness with discernment","A guarantee of calm"],2,"Sati operates alongside ethical discernment, effort, and insight, not merely relaxation."],
      ["Which is one of the four establishments of mindfulness?",["Collecting possessions","Establishing a fixed self","Avoiding all emotions","Observing feeling tone"],3,"Contemplation of feeling (vedanā) is one of the four establishments described in the Satipaṭṭhāna teaching."]
    ],
    "eightfold":[
      ["Which factor is included in the Noble Eightfold Path?",["Right speech","Right social rank","Right appearance","Right possessions"],0,"Right speech is one of the eight factors and belongs to the ethical-conduct grouping."],
      ["How should the eight path factors be approached?",["As an instant personality test","As mutually supportive aspects of training","As eight unconnected religions","As a ranking of other people"],1,"The eight factors support each other across wisdom, ethics, and mental cultivation."]
    ],
    "aggregates":[
      ["Which of these is one of the five aggregates?",["Permanent essence","Independent controller","Perception","Social status"],2,"Perception (saññā) is an aggregate, alongside form, feeling, fabrications, and consciousness."],
      ["In the aggregates framework, feeling (vedanā) principally refers to:",["A complex personality trait","A lasting identity","A complete story about an event","Pleasant, unpleasant, or neutral tone"],3,"Vedanā means the hedonic quality of experience rather than a complex emotion or biography."]
    ],
    "feeling":[
      ["Which are the three basic tones of feeling in this teaching?",["Pleasant, unpleasant, and neutral","Fear, joy, and shame","Past, present, and future","Body, speech, and mind"],0,"Vedanā is commonly classified as pleasant, unpleasant, or neither-pleasant-nor-unpleasant."],
      ["Why notice feeling tone before reacting?",["To make all feelings identical","To recognize the transition toward craving or aversion","To prove emotions are imaginary","To eliminate the need for action"],1,"Noticing the tone can help reveal the urge to grasp or push away before it becomes habitual reaction."]
    ],
    "craving":[
      ["Which example most clearly describes taṇhā?",["Choosing to exercise","Offering help to a friend","Insisting happiness depends on praise","Planning a responsible budget"],2,"Craving is characterized by grasping thirst, not every ordinary goal or wholesome intention."],
      ["Which is a traditional type of craving?",["Craving for perfect grammar","Craving for equal weather","Craving for four aggregates","Craving for becoming"],3,"Bhava-taṇhā, craving for becoming, is one of three classic kinds alongside sense pleasure and non-becoming."]
    ],
    "clinging":[
      ["What does upādāna emphasize?",["Grasping at experiences, views, or identity","A moment of neutral sensation","An unavoidable genetic reflex","A temporary visual impression"],0,"Clinging takes hold of experiences, beliefs, habits, or self-conceptions as something to secure."],
      ["Which is a classic form of clinging?",["Clinging to musical pitch","Clinging to views","Clinging to daily weather","Clinging to body temperature"],1,"Clinging to views is among the traditional four kinds of upādāna."]
    ],
    "three-poisons":[
      ["Which triad names the unskillful roots?",["Pain, change, and peace","Form, speech, and livelihood","Greed, aversion, and delusion","Joy, calm, and insight"],2,"Lobha, dosa, and moha are greed, aversion, and delusion: the unskillful roots."],
      ["Which is a wholesome opposite to aversion?",["Resentment","Control","Avoidance","Goodwill"],3,"Non-aversion includes goodwill; cultivating it can weaken hostile responses."]
    ],
    "dependent":[
      ["What is the core emphasis of dependent origination?",["Phenomena arise in dependence on conditions","Everything happens without any causes","Each mental event has one identical trigger","Outcomes are permanently fixed"],0,"Dependent origination describes conditional arising and cessation, not randomness or strict determinism."],
      ["In the classic formulation, what can feeling condition?",["The abolition of ethics","Craving","An unchanging self","The absence of contact"],1,"The familiar linkage is contact → feeling → craving → clinging, within a broader twelve-link teaching."]
    ],
    "non-self":[
      ["Which statement fits anattā most accurately?",["People never make meaningful choices","Experience is controlled by a permanent inner owner","Changing aggregates are not a secure permanent self","Ethical consequences do not exist"],2,"Anattā examines the aggregates as changing, conditioned, and unsuitable to identify with as a permanent self."],
      ["What is a responsible application of non-self?",["Denying your needs","Ignoring harmful conduct","Treating your history as meaningless","Noticing 'I am a failure' as a passing thought"],3,"It can loosen rigid identification while preserving responsibility, care, and appropriate boundaries."]
    ],
    "compassion":[
      ["What is karuṇā?",["The wish that beings be free from suffering","Avoidance of all other people","Agreement with every action","A demand to solve every problem"],0,"Karuṇā involves a wish to relieve suffering, tempered by wisdom about helpful action."],
      ["Which action is compatible with compassion?",["Ignoring danger","Setting a caring boundary against harm","Denying another person's suffering","Abandoning all self-care"],1,"Compassion can include protective action and boundaries; it does not require permitting harm."]
    ],
    "equanimity":[
      ["What best describes upekkhā?",["Emotional numbness","Withdrawal from moral choices","Balanced steadiness without indifference","Control over other people's decisions"],2,"Upekkhā means balanced care and steadiness, not apathy or emotional suppression."],
      ["How can equanimity support compassion?",["By prohibiting caring action","By making feelings permanent","By requiring guaranteed outcomes","By reducing compulsive control over outcomes"],3,"Equanimity can keep care sustainable without insisting that every result must be controlled."]
    ]
  }
};