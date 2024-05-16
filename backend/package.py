# 打包编译后的文件

# 删除system_apps

import sqlite3

from libs.utils.tools import delete_folder, copy, copy_dir


def clear_apps():
    # 数据库文件路径
    db_file_path = 'main.dist/data/database.db'
    conn = sqlite3.connect(db_file_path)
    cursor = conn.cursor()
    sql_command = """
    DROP TABLE IF EXISTS system_apps;
    """
    cursor.execute(sql_command)
    conn.commit()
    cursor.close()
    conn.close()
    print("Table 'system_apps' has been dropped if it existed.")


clear_apps()
# 删除旧数据
delete_folder('./main.dist/react_app/backup')
delete_folder('./main.dist/react_app/img')
delete_folder('./main.dist/react_app/assets/web')


copy('default/data/database.db', './main.dist/data/database.db', True)
copy_dir('./default/assets', './main.dist/react_app/assets')
copy_dir('./default/img', './main.dist/react_app/img')
