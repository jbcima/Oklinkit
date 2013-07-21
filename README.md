#Oklinkit

Leveraging your social networks for the greater good. 

There are a million problems in the world. You may not be able to solve them all - but you can enlist the help of your friends. We've all heard the phrase, "it's who you know that matters". Finding a job isn't just about what you know, it's about who you're connected with. Getting a website built can't be done as easily as making a posting on craigslist, you need to find the right person.

But your first degree contacts may not be able to help you. However, they may know someone who can. We're the engine within which those introductions occur, by providing a platform where people can request for help, offer to help, or, seek out people in their networks to help.



####Import dummy data

Make sure your mongo daemon is running, and go to the top level of your directory, and type
```
mongoimport --collection catchall --file db/collection.json --db oklinkit --upsert
```

This should insert the documents into the catchall collection within the oklinkit database
