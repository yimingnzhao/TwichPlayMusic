from pysine import sine
import sys

sine(frequency=float(sys.argv[1]), duration=float(sys.argv[2]))
print(sys.argv[1] + " " + sys.argv[2])