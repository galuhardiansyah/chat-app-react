○ Date of submission: 
- 10 December 2023

○ Instructions to run assignment locally
 - go to client and run npm run dev.
 - go to server and run node server.

○ Time spent
- I am working on this yesterday, so it's about 18 hours

○ Assumptions made
- first i am assuming that i need to make a login so user save in database and if you want to go to room than just use the id of that room, but i see that you need to enter username so i think that you don't need to have a login, just save the username to room collection, as i see that you need to have a persistent message than i need to have a message collection  that store all the message on that conversation. as i see there is an exit button than user can exit from that room and in database remove that user on that room. but in the instruction, there is no instruction to make that, so i am not going to make that. user can chat each other real time so i am assuming using socket io, but i am not sure if the instruction wants me to make it so the message persist only or make the user in that conversation persist too, like if user is refreshing, user still can chat each other. I am tried to implement that but no success so i will just stick to persist message only. Also i find that in the figma does not have a create room so how can a user access a room if there is no room, so i just make a simple modal that show the generated room id and it can be copy so it will be fast.

○ Shortcuts/Compromises made
- i think that you can add user so it can track user that is in the room, and also in the message it become much more organize, like this message from this user id and in this conversation room. you can save the message in the room collection but i think in the long run it will be a problem so i just seperate it into other collection. 
- also i think you can applied reconnect to the room if user refresh that room.
- add middleware or guard, so the user can access the routing without join first.
- have a toast if other user into that room or out of that room.
- if you want to go into production i think you need to have a login and user profile. so other user can access that user profile not like right now just show a username only, you can also add an image into the conversation.

○ Assume your application will go into production...

- What would be your approach to ensuring the application is ready for production
(testing)?
 add testing right now i dont have a testing, like testing the socket connection if it connect or not if the data that you save is present in the collection or not, security, route guard right now i dont have a guard or middleware at al.

■ How would you ensure a smooth user experience as 1000’s of users start using your
app simultaneously?
 - i would stress test if the server is working for 1000 user or more
 - check the storage if it is ok, especially in message collection as it will grow bigger and bigger.  

■ What key steps would you take to ensure application security?
 - if i have alogin i can check if the user is authenticated and add middleware to api so if someone want to access a room but dont have an account then that user can access. 
 - xss attack or sql injection, i am probably going to ensure thata the input value that send to api is clean there is no value that have an indication of xss attack or sql injection

○ What did you not include in your solution that you want us to know about? Were you
short on time and not able to include something that you want us to know about? Please
list it here so that we know that you considered it.
-at least i want to have a guard to room.
- make when the user refresh is work.

○ Other information about your submission that you feel it's important that we know if
applicable. 
- nothing i am already explain that on other questiong.

○ Your feedback on this technical challenge
- i think that make the figma more descriptive like if you want to have an exit function just add like text, user can exit like that so other participant know that you must have an exit function. and also create room id is missing in figma. 
