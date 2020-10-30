import re
import csv
import pandas as pd

df = pd.read_excel("C:\\Users\\4whom\\Desktop\\2020-2학기\\종설\\ieds.xlsx")

types = df['type']
names = df['name']
uniques = df['unique']
statuses = df['status']
scada0s = df['scada0']
scada1s = df['scada1']

f = open('data.csv', 'w', encoding='utf-8')
arr = []
devices = []

class Device:
    def __init__(self, type, name, unique, status, scada0, scada1):
        self.type = type
        self.name = name
        self.unique = unique
        self.status = status
        self.scada0 = scada0
        self.scada1 = scada1

def sanitize(target):
    target = target.replace(" ", '')
    target = target.replace("\n", '')
    target = target.replace('"', '')
    return target

for i in range(0, len(types)):

    if not pd.isna(statuses[i]):
        sanitized = sanitize(statuses[i])
        if re.fullmatch("([0-9]+[^0-9]+){1,}", sanitized) != None:
            elem = [uniques[i], sanitized]
            print(elem)
            arr.append(elem)

w = csv.writer(f)
w.writerows(arr)
f.close()