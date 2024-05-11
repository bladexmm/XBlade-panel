import linecache
import time
import dis


# 自制性能分析工具
def profile(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        execution_time = end_time - start_time

        # 获取函数的源代码和行号
        source_lines, first_line = linecache.getlines(func.__code__.co_filename), func.__code__.co_firstlineno
        last_line = len(source_lines) - 1
        for lineno in range(first_line, last_line):
            print(source_lines[lineno])

        return result

    return wrapper
