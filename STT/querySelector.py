from difflib import SequenceMatcher
from konlpy.tag import Okt
from jamo import h2j, j2hcj

def makeJamo(tokenList):
    result = ""
    for token in tokenList:
        # jamoList.append(j2hcj(h2j(token)))
        result += j2hcj(h2j(token))
        result += " "
    return result

queryList = ['임계상태를 초과한 센서의 번호를 알려줘', '상한값 초과한 디바이스 리스트를 알려줘']
command = '임계삼대를 조과함 셈서의 벙호를 아려줘'
okt = Okt()
tokenList = []
jamaoList = []

# 토크나이징
for query in queryList:
    tokenList.append(okt.morphs(query))

# 자모음화
# for jamo in 
# query1 = makeJamo(tokenList[0])
# print(query1)

