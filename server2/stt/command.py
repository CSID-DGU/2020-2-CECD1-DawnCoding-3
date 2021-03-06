import pandas as pd
from difflib import SequenceMatcher
from konlpy.tag import Okt
from jamo import h2j, j2hcj
from STT_test import makeQuery


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
    df = pd.read_csv("command.csv", encoding='utf-8')

    commandList = df['command'].tolist()
    queryList = df['query'].tolist()

    okt = Okt()
    tokenizeList = []
    for command in commandList:
        tokenizeList.append(okt.morphs(command))
    # print(tokenizeList)

    index = 0
    best_match_rate = 0.0
    qa = (makeJamo(voice))
    for i, token in enumerate(tokenizeList):
        jamo = makeJamo(token)
        match_rate = float(
            f'{SequenceMatcher(None, jamo, qa).ratio()*100:.2f}')
        print(match_rate)
#         print(match_rate)
        if match_rate > best_match_rate:
            best_match_rate = match_rate
            index = i
    return commandList[index], queryList[index]


def start():
    command = makeQuery()
    return querySelector(command)
