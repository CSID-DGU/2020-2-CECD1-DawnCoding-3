import pandas as pd
import pandas as pd
from difflib import SequenceMatcher
from konlpy.tag import Okt
from jamo import h2j, j2hcj

def makeJamo(tokenList):
    jamoList = []
    
    for token in tokenList:
        jamoList.append(j2hcj(h2j(token)))
        
    result = ""
    for jamo in jamoList:
        result += jamo
        result += " "
    return result

def querySelector(voice):
    df = pd.read_csv("command.csv", encoding='cp949')

    commandList = df['command'].tolist()
    queryList = df['query'].tolist()
    
    okt = Okt()
    tokenizeList = []
    tokenizeList.append(okt.morphs(commandList[0]))
    tokenizeList.append(okt.morphs(commandList[1]))
#     print(tokenizeList)
    
    index = 0
    best_match_rate = 0.0
    qa = (makeJamo(voice))
    for i, token in enumerate(tokenizeList):
        jamo = makeJamo(token)
        match_rate = float(f'{SequenceMatcher(None, jamo, qa).ratio()*100:.2f}')
#         print(match_rate)
        if match_rate > best_match_rate:
            best_match_rate = match_rate
            index = i
    return queryList[index]

result = querySelector("1번 명령어 입니다")
print(result)