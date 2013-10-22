from pymongo import *

con = Connection("mongodb://localhost:27017")
db = con.airports
airportsCol = db.airports

f = open("airports.dat")
line = f.readline()

while line:
	l = line.split(",")

	try:
		d = {
			"AirportID"	: int(l[0]),
			"Name"		: l[1].replace("\"", ""),
			"City"		: l[2].replace("\"", ""),
			"Country"	: l[3].replace("\"", ""),
			"IATA"		: l[4].replace("\"", ""),
			"ICAO"		: l[5].replace("\"", ""),
			"Coordinate": [float(l[6]), float(l[7])],
			"Altitude"	: int(l[8]),
			"Timezone"	: int(l[9]),
			"DST"		: l[10].replace("\n", "").replace("\"", "")
		}

		airportsCol.insert(d)
	except:
		pass

	line = f.readline()

f.close()