import os
import datetime

from libs.utils.settings import LOG_LEVEL


class Logger:
    # 默认日志配置
    config = LOG_LEVEL

    @classmethod
    def _log(cls, level, message):
        # 检查日志级别是否应该被记录
        if not cls.config.get(level.upper(), False):
            return

        # 获取当前日期
        now = datetime.datetime.now()
        date_str = now.strftime("%Y/%m/%d")

        # 构造日志文件路径
        log_dir = os.path.join("logs", now.strftime("%Y"), now.strftime("%m"))
        log_file = os.path.join(log_dir, now.strftime("%d") + ".log")

        # 确保日志目录存在
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)

        # 记录日志消息
        with open(log_file, "a", encoding = "utf-8") as file:
            timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
            log_entry = f"[{timestamp}] - {level.upper()} - {message}\n"
            file.write(log_entry)

    @classmethod
    def debug(cls, message):
        cls._log("DEBUG", message)

    @classmethod
    def info(cls, message):
        cls._log("INFO", message)

    @classmethod
    def warning(cls, message):
        cls._log("WARNING", message)

    @classmethod
    def error(cls, message):
        cls._log("ERROR", message)

    @classmethod
    def critical(cls, message):
        cls._log("CRITICAL", message)
