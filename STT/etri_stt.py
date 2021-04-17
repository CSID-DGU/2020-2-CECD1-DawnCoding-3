
#-*- coding:utf-8 -*-
import urllib3
import json
import base64
from pydub import AudioSegment

openApiURL = "http://aiopen.etri.re.kr:8000/WiseASR/Recognition"
accessKey = "6b5cac7a-18e2-42ac-b75c-e274734082ff"
audioFilePath = "./file.wav"
languageCode = "korean"

AudioSegment.from_wav("file.wav").export("file.wav", format="wav", bitrate="16k")

file = open(audioFilePath, "rb")
audioContents = base64.b64encode(file.read()).decode("utf8")
file.close()
 
requestJson = {
    "access_key": accessKey,
    "argument": {
        "language_code": languageCode,
        "audio": audioContents
    }
}
 
http = urllib3.PoolManager()
response = http.request(
    "POST",
    openApiURL,
    headers={"Content-Type": "application/json; charset=UTF-8"},
    body=json.dumps(requestJson)
)
 
print("[responseCode] " + str(response.status))
print("[responBody]")
print(str(response.data,"utf-8"))