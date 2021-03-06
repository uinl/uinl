#!/usr/bin/env python3

"""Classic Shepard, Hovland, & Jenkins (1961) categorization task."""


#########################################################
# STAP formatting, constants, and stdio functions
import json,sys

if 'raw_input' in vars(__builtins__): input = raw_input		#Fix for Python 2.x raw_input

def send(d): print(json.dumps(d)); sys.stdout.flush()
def recv(): return json.loads(input())

CLEAR=None

def obj(id=None,value=NotImplemented,**options):
	if id is not None: options['id']=id
	if value is not NotImplemented: options['v']=value
	return options
#########################################################


import random


MAXTRIALS=32
TIME_BETWEEN_TRIALS=.5 #seconds
CONDITIONS=[ #response should be CATEGORY_NAMES[1]
	[(0,0,0),(0,0,1),(0,1,0),(0,1,1)],	#type I
	[(0,0,0),(0,0,1),(1,1,0),(1,1,1)],	#type II
	[(0,0,0),(0,0,1),(0,1,0),(1,0,0)],	#type IV
	[(0,0,0),(1,0,1),(1,1,0),(0,1,1)],	#type VI
]
CURRENT_CONDITION=random.choice(CONDITIONS)
DIM2VIS=[0,1,2]; random.shuffle(DIM2VIS)
VAL2VIS=[random.randrange(2),random.randrange(2),random.randrange(2)]
CATEGORY_NAMES=["Greeble","Groble"]; random.shuffle(CATEGORY_NAMES)


def checkCorrect(s,r): return (s in CURRENT_CONDITION) == CATEGORY_NAMES.index(r)

def stimulus(dimVals):
	#visual representation of the 3-feature stimulus
	vis=[int(not dimVals[dim]) if VAL2VIS[dim] else dimVals[dim] for dim in DIM2VIS]
	return dict(w=40,h=40,lw=10,
		bg=vis[0],
		lc=vis[1]+2,
		shape=vis[2])

def main():
	send({
		#announce required options
		"require":{'options':['T','R','in','onin','df','*','bg','lc','shape'],'shapes':2,'colors':4},
		#announce task conditions
		"task":{
			#let participant know to seek the state when feedback field is Correct
			"good":[('feedback','Correct')],
			#let participant know to avoid the state when feedback field is Incorrect
			"bad":[('feedback','Incorrect')],
			#let participant know that the task will end when the title field Trial reaches its max
			"end":[('Trial',MAXTRIALS)],
		},
		#default item properties
		"df":{
			#once any button is clicked, all buttons should become disabled (to avoid duplicate clicks)
			"onin":{				#behavior upon input (i.e. button-click)
				"*":{"scope":2},	#select everything
				"in":0				#disable buttons/inputs
			}
		}
	})
	#loop through trials
	correctTrials=[]
	for trial in range(1,MAXTRIALS+1):
		#create random stimulus
		s=random.randrange(2),random.randrange(2),random.randrange(2)
		send([
			CLEAR,
			#set Trial field in title bar to current trial number
			obj("Trial", trial, **{"<=":MAXTRIALS}),
			#add the stimulus to the canvas
			obj("Is this object a Greeble or a Groble?", [stimulus(s)] ),
			#add category buttons
			obj(value=[obj(btnName,False) for btnName in CATEGORY_NAMES])
			])
		#collect response
		ums,response,_ = recv()
		#check if correct
		correctTrials.append(checkCorrect(s,response))
		#send reward
		send([ obj('feedback', ('Correct' if correctTrials[-1] else 'Incorrect'), title='') ])
		#wait specified amount of milliseconds before beginning next trial
		send({ "T":TIME_BETWEEN_TRIALS, "R":[] })
		recv()
	#summary screen
	send([
		CLEAR,
		'Thank you for your participation.',
		obj('Experiment Summary', [
			obj('Category Structure Type', ['I','II','IV','VI'][CONDITIONS.index(CURRENT_CONDITION)]),
			obj(CATEGORY_NAMES[1], [stimulus(s) for i,s in enumerate(CURRENT_CONDITION)]),
			obj('Score', [
				obj('First Half', sum(correctTrials[:(MAXTRIALS//2)])),
				obj('Second Half', sum(correctTrials[(MAXTRIALS//2):])) ]) ]) ])

if __name__=='__main__': main()
