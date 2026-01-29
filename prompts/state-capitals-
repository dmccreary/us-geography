# State Capitals Quiz

## The pedagogy sound plan

Create a new microsim that will help 5th graders learn the capitals    
of each state.  Before you do, think deeply about the pedagogy of      
this process.  Avoid having the student get frustrated.  Allow them    
to control how long a quiz they want to take (3 states, 5 state or 10  
state quiz or all 50 states).  Use liberal celebration animations.     
Come up with a plan first that we can review together.  

## Claude Opus 4.5 Response

I'll think through the pedagogy carefully before we build this. Let me 
outline a plan that prioritizes learning and minimizes frustration for 
5th graders.                                                           
                                                                         
### State Capitals Quiz MicroSim - Design Plan                             
                                                                         
#### Pedagogical Principles                                                 
                                                                         
1. Reduce Cognitive Load & Frustration

- Multiple choice format (4 options) - recognition is easier than      
recall                                                                 
- Map highlights the state being asked about - visual reinforcement    
- No time pressure - self-paced learning reduces anxiety               
- Encouraging feedback on wrong answers - show correct answer without  
shaming                                                                
                                                                         
2. Scaffolded Learning                                                 
- Variable quiz lengths: 3, 5, 10, or 50 states                        
- Start with short quizzes to build confidence                         
- Progress to longer quizzes as mastery develops                       
                                                                         
3. Positive Reinforcement (Celebration Animations)                     
- Small celebration for each correct answer (confetti burst)           
- Medium celebration at quiz completion                                
- Big celebration for perfect scores                                   
- Encouraging messages throughout                                      
                                                                         
4. Growth Mindset Messaging                                            
- Correct: "Great job!", "You got it!", "Excellent!"                   
- Incorrect: "Good try! The capital of [State] is [Capital]. You'll get
it next time!"                                                        
- Completion: "You completed the quiz! You knew X out of Y capitals!"  
                                                                         
### Proposed User Flow                                                     
                                                                         
  ┌─────────────────────────────────────┐                                
  │         START SCREEN                │                                
  │                                     │                                
  │   🏛️ State Capitals Quiz 🏛️        │                                 
  │                                     │                                
  │   How many states?                  │                                
  │   [3] [5] [10] [All 50]            │                                 
  │                                     │                                
  │        [Start Quiz]                 │                                
  └─────────────────────────────────────┘                                
              │                                                          
              ▼                                                          
  ┌─────────────────────────────────────┐                                
  │         QUIZ SCREEN                 │                                
  │  ┌─────────────────────────┐       │                                 
  │  │                         │       │                                 
  │  │    [Map with state      │       │                                 
  │  │     highlighted]        │       │                                 
  │  │                         │       │                                 
  │  └─────────────────────────┘       │                                 
  │                                     │                                
  │  What is the capital of Texas?      │                                
  │                                     │                                
  │  [Austin]      [Houston]           │                                 
  │  [Dallas]      [San Antonio]       │                                 
  │                                     │                                
  │  Question 3 of 10    Score: 2/2    │                                 
  └─────────────────────────────────────┘                                
              │                                                          
              ▼                                                          
  ┌─────────────────────────────────────┐                                
  │       FEEDBACK (brief)              │                                
  │                                     │                                
  │  ✓ Correct! Great job!             │                                 
  │     [confetti animation]            │                                
  │                                     │                                
  │  OR                                 │                                
  │                                     │                                
  │  Good try! The capital of Texas    │                                 
  │  is Austin. You'll remember next   │                                 
  │  time!                              │                                
  │        [Next Question]              │                                
  └─────────────────────────────────────┘                                
              │                                                          
              ▼                                                          
  ┌─────────────────────────────────────┐                                
  │         RESULTS SCREEN              │                                
  │                                     │                                
  │   🎉 Quiz Complete! 🎉              │                                
  │                                     │                                
  │   You got 8 out of 10!             │                                 
  │   That's 80% - Great work!          │                                
  │                                     │                                
  │   [big celebration animation]       │                                
  │                                     │                                
  │   [Try Again] [New Quiz] [Menu]    │                                 
  └─────────────────────────────────────┘                                
                                                                         
### Technical Implementation                                               
                                                                         
- Leaflet.js for the map (per project instructions)                    
- Natural Earth GeoJSON for state boundaries                           
- p5.js canvas for celebration animations overlaid on the page         
- States randomized for each quiz                                      
- Wrong answer choices are plausible (other state capitals, not random 
cities)                                                                
                                                                         
### Questions for You                                                      
                                                                         
1. Difficulty option? Should we offer "Easy" (3 choices) vs "Regular"  
(4 choices)?                                                           
2. Regional quizzes? Would you like options like "Midwest States Only" 
or "West Coast States Only" in addition to the count-based options?    
3. Learning mode? A separate "Study Mode" that shows state → capital   
flashcard-style before quizzing?                                       
4. Progress tracking? Should it remember which states the student      
struggles with for future quizzes? (This adds complexity but improves  
learning)                                                              
                                                                         
Let me know your thoughts on this plan and any adjustments you'd like! 
                        
## Answers

I like this plan!.  Let's keep it to three difficulty levels.  No      
  regional quizzes for this first version.  Yes on the Learning Mode     
  and Quiz Mode.  Do not worry about progress tracking for version       
  1.  For the celebration animations, I have added some animation        
  examples using p5.js here: @docs/sims/shared/animations/*.js - I       
  will let you decide if you want to use the p5.js animations or         
  stick to simple svg animations.  Please use the microsim-generator     
  with the map guide and create a new MicroSim at                        
  @docs/sims/capitals

  For the detailed session log, see:

  