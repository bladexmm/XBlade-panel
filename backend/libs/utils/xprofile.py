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
        print(f"函数 {func.__name__} 执行时间：{execution_time}")
        return result
    
    return wrapper
