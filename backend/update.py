import os
import shutil

delete_files = [
    'main.dist/data/database.db'
]

for file in delete_files:
    if os.path.exists(file):
        os.remove(file)


def get_subfolders(directory):
    subfolders = [f.path for f in os.scandir(directory) if f.is_dir()]
    return subfolders


def delete_folder(directory):
    if os.path.exists(directory) and os.path.isdir(directory):
        shutil.rmtree(directory)
        print(f"The folder '{directory}' has been deleted.")
    else:
        print(f"The folder '{directory}' does not exist or is not a directory.")


# 示例用法
directory = 'main.dist/react_app/assets/wallpapers'
subfolders = get_subfolders(directory)
for folder in subfolders:
    delete_folder(folder)
