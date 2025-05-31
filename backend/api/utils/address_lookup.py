import csv
from django.conf import settings
import os

CSV_path = os.path.join(settings.BASE_DIR, 'api', 'data', 'locations.csv')


def get_location_by_area(area_name):
    with open(CSV_path, encoding='utf-8', errors='replace') as f:
        reader = csv.DictReader(f)
        for row in reader:
            print(row)
            if row['Area'].strip().lower() == area_name.strip().lower():
                return {
                    'city': row['City'],
                    'pin_code': row['Pincode']
                }

    return None 