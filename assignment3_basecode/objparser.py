objFile = open('camera.obj', 'r')
finalFace = open('Faces.txt', 'w')
finalVertex = open('Vertices.txt', 'w')

vertexList = []
faceList = []

for line in objFile:
	split = line.split()

	#if blank line, skip
	if not len(split):
		continue

	if split[0] == "v":
		vertexList.append("new Vector(" + split[1] + ", " + split[2] + ", " + split[3] + "),")

	if split[0] == "f":
		ss = "["
		for i in range(len(split)-1):
			removeSlash = split[i+1].split('/')
			ss += removeSlash[0]
			if i+1 < len(split)-1:
				ss += ","
		ss += "],"
		faceList.append(ss)


vertexCount = 0
faceCount = 0
for item in vertexList:
	finalVertex.write(item)
	finalVertex.write('\n')
	vertexCount += 1

for item in faceList:
	finalFace.write(item)
	finalFace.write('\n')
	faceCount += 1


print("Vertices: " + str(vertexCount))
print("Faces: " + str(faceCount))
objFile.close()
finalVertex.close()