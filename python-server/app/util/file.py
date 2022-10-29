import sys
import os

def writeCSV(filePath,header,results):
    try:
        import unicodecsv
    except ImportError:
        print("[+] Install the unicodecsv module to write the CSV report")
        sys.exit(1)

    with open(os.path.join(filePath), "wb") as csvfile:
        writer = unicodecsv.writer(csvfile, delimiter=',', encoding='utf-8')
        writer.writerow(header)
        for row in results:
            writer.writerow(list(row))