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
        print(f"Function: {func.__name__} executed：{execution_time}")
        return result
    
    return wrapper
