import cv2
import imutils
import requests
from tkinter import *
from tkinter import ttk
import time 

def mainProcess():
    face_cascade = cv2.CascadeClassifier('haarcascade_files/haarcascade_frontalface_default.xml')

    eye_cascade = cv2.CascadeClassifier('haarcascade_files/haarcascade_eye.xml')

    cv2.namedWindow('Student Attention Detector')

    cap = cv2.VideoCapture(0)

    timeCounter = [0 , 0 , 0]

    currTime = time.time()
    prev = 0
    curr = 0


    while 1:
        try:
            if cap!=None:
                ret, frame = cap.read()
                frame = imutils.resize(frame,width=400)
            
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = face_cascade.detectMultiScale(gray,scaleFactor=1.1,minNeighbors=5,minSize=(30,30),flags=cv2.CASCADE_SCALE_IMAGE)

                
                if (len(faces)==0):
                    curr = 2
                    if (curr != prev):
                        timeCounter[prev] += time.time() - currTime
                        currTime = time.time()
                    prev = curr
                    cv2.putText(frame, "Not-Attentive (student unavailable)", (10, 23),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.45,(0, 0, 255), 2)


                for (x,y,w,h) in faces:
                    cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
                    roi = gray[y:y+h, x:x+w]
                    roi_color = frame[y:y+h, x:x+w]
                    
                    eyes = eye_cascade.detectMultiScale(roi)
                    for (ex,ey,ew,eh) in eyes[:2]:
                        cv2.rectangle(roi_color,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)
                        
                    label = ""
                    attentive = True
                    if (len (eyes)>=1):
                        attentive = True;
                    else:
                        label = "Sleeping"
                        attentive = False
                    
                    if (attentive):
                        curr = 0
                        if (curr != prev):
                            timeCounter[prev] += time.time() - currTime
                            currTime = time.time()
                        prev = curr
                        label_text = "Attentive"
                    else:
                        curr = 1
                        if (curr != prev):
                            timeCounter[prev] += time.time() - currTime
                            currTime = time.time()
                        prev = curr
                        label_text = "Not-Attentive ("+label+")"
                        
                    cv2.putText(frame, label_text, (x, y - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)

                cv2.imshow('Student Attention Detector',frame)
                if cv2.waitKey(1) & 0xFF == ord('c'):
                    break
        except:
            break
            print ("Exiting")

    cv2.destroyAllWindows()
    cap.release()

    timeCounter[curr] = time.time() - currTime

    url = "http://localhost:8080/api/record/add?regNo=" + regno.get()

    data = {
        "attention" : timeCounter[0],
        "noAttentionSleepy" : timeCounter[1] , 
        "noAttentionDistracted" : timeCounter[2]
    }

    response = requests.post(url , json = data)


root = Tk()
regno = StringVar()
ttk.Label(root , text = "Enter your registration number").pack()
ttk.Entry(root , textvariable=regno).pack()
ttk.Button(root , text = "Submit" , command = mainProcess).pack()
root.mainloop()
