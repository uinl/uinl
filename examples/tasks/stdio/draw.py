#!/usr/bin/env python3

'''Drawing task'''


#########################################################
# STAP constants and stdio
import json,sys

if 'raw_input' in vars(__builtins__): input = raw_input		#Fix for Python 2.x raw_input

def send(d): print(json.dumps(d)); sys.stdout.flush()
def recv(): return json.loads(input())

MOUSEDOWN,MOUSEUP,MOUSEMOVE = 42,43,44
#########################################################


INSTRUCTIONS="Draw a smiley face"


send([ [INSTRUCTIONS, {'type':'path','e':[MOUSEDOWN],'w':400,'h':300,'bg':'white'}], ['Clear'], ['Done'] ])

key=None
while key!='Done':
	msg=recv()
	if len(msg)==3:
		ums,key,val=msg
		if isinstance(val,list):
			if val[0]==MOUSEDOWN:
				send([ [INSTRUCTIONS, ['M',val[1],val[2]], {'e':[MOUSEMOVE,MOUSEUP]}] ])
			elif val[0]==MOUSEUP:
				send([ [INSTRUCTIONS, {'e':[MOUSEDOWN]}] ])
			elif val[0]==MOUSEMOVE:
				send([ [INSTRUCTIONS, [val[1],val[2]]] ])
		elif key=='Clear':
				send([ [INSTRUCTIONS, '', {'e':[MOUSEDOWN]}] ])

