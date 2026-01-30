# Add New MicroSim

!!! prompt
add the new microsim @docs/sims/us-state-quality-map to the            
mkdocs.yml MicroSim in alphabetical order and also add the section     
to the @docs/sims/index.md for this microsim 


  ⎿  Listed directory docs/sims/us-state-quality-map/                    
  ⎿  Read docs/sims/index.md (209 lines)                                 
                                                                         
⏺ I'll read the necessary files to add the new microsim in the right     
  places.                                                                
                                                                         
⏺ Read 2 files (ctrl+o to expand)                                        
                                                                         
⏺ Now I'll add the new microsim to both files. In mkdocs.yml it should go
   between "US Oceans" and "US Water Features" alphabetically. Same for  
  the index.md.                                                          
                                                                         
⏺ Update(mkdocs.yml)                                                     
  ⎿  Added 1 line                                                        
      81      - Tornado Alley: sims/tornado-alley/index.md               
      82      - Transportation Networks: sims/transportation-netwo       
          rks/index.md                                                   
      83      - US Oceans: sims/us-oceans/index.md                       
      84 +    - US State Quality Map: sims/us-state-quality-map/in       
         +dex.md                                                         
      85      - US Water Features: sims/us-water-features/index.md       
      86      - Weather vs Climate: sims/weather-climate/index.md        
      87    - Learning Graph:                                            
                                                                         
⏺ Update(docs/sims/index.md)                                             
  ⎿  Added 6 lines                                                       
      193                                                                
      194      Interactive map showing the four bodies of water th       
           at border America - Atlantic, Pacific, Gulf of Mexico,        
           and Arctic.                                                   
      195                                                                
      196 +-   **[US State Quality Map](./us-state-quality-map/ind       
          +ex.md)**                                                      
      197 +                                                              
      198 +    ![US State Quality Map](./us-state-quality-map/us-s       
          +tate-quality-map.png)                                         
      199 +                                                              
      200 +    Interactive choropleth map grading all 50 US states       
          + on 8 quality of life metrics including income, educati       
          +on, health, crime, and housing costs.                         
      201 +                                                              
      202  -   **[US Water Features](./us-water-features/index.md)       
           **                                                            
      203                                                                
      204      ![US Water Features](./us-water-features/us-water-f       
           eatures.png)                                                  
        
  Done. I added the US State Quality Map microsim to both files in       
  alphabetical order:                                                    
                                                                         
  1. mkdocs.yml - Added US State Quality Map:                            
  sims/us-state-quality-map/index.md between US Oceans and US Water      
  Features                                                               
  2. docs/sims/index.md - Added the card entry with title, image, and    
  description between US Oceans and US Water Features     