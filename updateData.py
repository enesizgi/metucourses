#!/usr/bin/python3

import os
import shutil

os.chdir('../')
codeDir = os.getcwd()
shutil.copyfile(f'{codeDir}/crawler-server/courses.json', f'crawler-assets/courses.json')
shutil.copyfile(f'{codeDir}/crawler-server/departments.json', f'crawler-assets/departments.json')

os.chdir(f'{codeDir}/crawler-assets/')
print(os.getcwd())
os.system('git add .')
os.system('git commit -m "Update data"')
os.system('git push')
