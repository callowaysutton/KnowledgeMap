## What it does
KnowledgeMap creates a mapping of the areas and concepts that would probably be best to learn about in order to be a master in the prompt provided. Each node provides a nice and well documented summarization of the concept and each node builds off of the other in order to provide a strategic study plan so that people can self teach themselves pretty much anything.

Play with it at: https://knowledgemap.tech

## How we built it
We used the Bloom LLM as well as the Davinci text model to analyze prompts and come up with similar/related concepts and then mapped those similar concepts onto a plane with branches going to paths where the next steps are needed. Each node's summary gives a short and sweet description of the skill and then gives some resources like articles, books or websites to learn more about the given prompt and concept.

## Challenges we ran into
My teammates were new to web development but we were able to all learn how to efficiently create this project in a tiny amount of time. 3 hours to be exact!

## Accomplishments that we're proud of
We designed our entire system with no frameworks and code written from scratch and from idea to fruition it only took us around 6-8 hours to develop the entire platform. Of course there are bugs that need to be squashed, but this is a ready to go platform that can easily be expanded on through various means and I think there is a good chance I personally will continue working on this in the future.

## What we learned
I think we all learned that Flask is a really good framework for building web applications out of. Also that Redis and caching is very helpful for speeding up requests!

## What's next for KnowledgeMap
Personally, I am wanting to potentially expand it to include a small quiz for each node that can be passed for points and to mark a node as "done." I feel like this would be useful for anyone wanting to learn more about a particular field or activity.
