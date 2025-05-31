import os
import django
import csv
import sys


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()


from api.models import UserAddress
from django.conf import settings


csv_path = os.path.join(settings.BASE_DIR, 'api','data', 'locations.csv')

with open(csv_path, newline='', encoding="utf-8", errors='replace') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row)