import csv
import json
from itertools import groupby
from operator import itemgetter

data = []

with open('IEEE VIS papers 1990-2014 - Main dataset.csv', 'rb') as csvfile:
  lines = csv.reader(csvfile)
  for line in lines:
    venue = line[0]
    year = line[1]
    title = line[2]
    ty = line[9]
    abstract = line[10]
    authors = line[11]
    
    if ty == 'T' or ty == 'C':
      data.append((venue, year, title, authors, abstract))

data.sort(key =lambda r: r[0] + r[1])
for key, group in groupby(data, key=lambda r: r[0] + r[1]):
  with open(key + '.json', 'w') as jsonfile:
    json.dump(list(map(lambda x: {"title": x[2], "authors": x[3], "abstract": x[4]}, group)), jsonfile, indent=2)
