import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import mimetypes

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br'
}


def download_image(url, folder):
    try:
        # 发送HTTP请求获取图片内容
        proxies = {"http": None, "https": None}
        system_proxies = urllib.request.getproxies()
        if system_proxies:
            proxies.update({"http": system_proxies['http'], "https": system_proxies['http']})
        # 发送HTTP请求获取图片内容
        response = requests.get(url, verify=False, proxies=proxies, timeout=5, headers=headers)
        response.raise_for_status()  # 如果请求不成功，则抛出异常

        # 获取文件名
        parsed_url = urlparse(url)
        filename = os.path.basename(parsed_url.path)
        # 如果文件名没有后缀，则根据内容类型获取后缀
        if '.' not in filename:
            content_type = response.headers.get('content-type')
            ext = mimetypes.guess_extension(content_type)
            if ext:
                filename += ext

        # 拼接保存路径
        filepath = os.path.join(folder, filename)

        # 保存图片到本地
        with open(filepath, 'wb') as f:
            f.write(response.content)

        return filepath.replace('react_app', '')

    except Exception as e:
        print("Error occurred while downloading image:", e)
        return None


from urllib.parse import urlparse


def get_domain(url):
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    return domain.replace(":",".")


import hashlib


def get_domain_md5(url):
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    domain_md5 = hashlib.md5(domain.encode()).hexdigest()
    return domain_md5


def md5(input_string):
    # 创建MD5对象
    md5_hash = hashlib.md5()

    # 将字符串编码为字节，并更新MD5对象
    md5_hash.update(input_string.encode())

    # 获取MD5摘要
    encrypted_string = md5_hash.hexdigest()

    return encrypted_string


import urllib.request


def get_page_info(url, download_folder):
    try:
        proxies = {"http": None, "https": None}
        system_proxies = urllib.request.getproxies()
        if system_proxies:
            proxies.update({"http": system_proxies['http'], "https": system_proxies['http']})
        response = requests.get(url, verify=False, proxies=proxies, timeout=10, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'})
        response.raise_for_status()  # 如果请求不成功，则抛出异常

        # 使用BeautifulSoup解析网页内容
        soup = BeautifulSoup(response.text, 'html.parser')

        # 获取网页标题
        title = soup.title.string.strip()

        # 获取网页所有图片链接
        image_links = []
        img_tags = soup.find_all('img')

        for img_tag in img_tags:
            img_src = img_tag.get('src')
            if img_src:
                # 将相对路径转换为绝对路径
                img_url = urljoin(url, img_src)
                # 下载图片
                img_url = download_image(img_url, download_folder)
                image_links.append(img_url)

        # 获取网页图标链接
        icon_link = None
        icon_tag = soup.find('link', rel='icon')
        if icon_tag:
            icon_link = urljoin(url, icon_tag['href'])
            icon_link = download_image(icon_link, download_folder)

        return title, icon_link, image_links

    except Exception as e:
        print("Error occurred:", e)
        return None, None, None
