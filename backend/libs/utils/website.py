import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import concurrent.futures
import mimetypes
import urllib.request
from urllib.parse import urlparse

from libs.utils.settings import USER_AGENT, MAX_DOWNLOAD_IMG_WORK

headers = {
    'User-Agent'     : USER_AGENT,
    'Accept'         : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
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
        response = requests.get(url, verify = False, proxies = proxies, timeout = 5, headers = headers)
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
        filepath = filepath.replace('react_app', '')
        return filepath

    except Exception as e:
        print("Error occurred while downloading image:", e)
        return None


def get_domain(url):
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    return domain.replace(":", ".")


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


def is_image_content_type(headers):
    """根据响应头判断内容是否为图片"""
    content_type = headers.get('Content-Type', '').lower()
    image_types = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp']
    return any(content_type.startswith(t) for t in image_types)


def download_image_if_valid(url):
    proxies = {"http": None, "https": None}
    system_proxies = urllib.request.getproxies()
    if system_proxies:
        proxies.update({"http": system_proxies['http'], "https": system_proxies['http']})
    """如果链接指向的是图片，则下载图片"""
    try:
        response = requests.head(url, verify = False, proxies = proxies, headers = headers,
                                 allow_redirects = True, timeout = 5)
        if response.status_code == 200 and is_image_content_type(response.headers):
            return True
    except requests.RequestException as e:
        return False
    return False


def get_page_info(url, download_folder):
    try:
        proxies = {"http": None, "https": None}
        system_proxies = urllib.request.getproxies()
        if system_proxies:
            proxies.update({"http": system_proxies['http'], "https": system_proxies['http']})
        response = requests.get(url, verify = False, proxies = proxies, timeout = 10,
                                headers = headers)
        response.raise_for_status()  # 如果请求不成功，则抛出异常
        # 使用BeautifulSoup解析网页内容
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string.strip()
        image_link_header = []
        download_image_links = []
        image_downloaded = []

        head_links = [link['href'] for link in soup.head.find_all(href = True)]
        if not os.path.exists(download_folder):
            os.makedirs(download_folder)
        for link in head_links:
            abs_link = urljoin(url, link)
            image_link_header.append(abs_link)

        # 多线程判断链接文件格式
        with concurrent.futures.ThreadPoolExecutor(max_workers = MAX_DOWNLOAD_IMG_WORK) as executor:
            future_to_link = {executor.submit(download_image_if_valid, link): link for
                              link in image_link_header}
            for future in concurrent.futures.as_completed(future_to_link):
                link = future_to_link[future]
                try:
                    if future.result():
                        download_image_links.append(link)
                except Exception as exc:
                    print(f'Generated an exception: {exc}')

        # 获取网页所有图片链接
        img_tags = soup.find_all('img')
        for img_tag in img_tags:
            img_src = img_tag.get('src')
            if img_src:
                img_url = urljoin(url, img_src)
                download_image_links.append(img_url)

        with concurrent.futures.ThreadPoolExecutor(max_workers = MAX_DOWNLOAD_IMG_WORK) as executor:
            # 修改这里以正确保存future与图片链接之间的关系
            future_to_download_link = {
                executor.submit(download_image, download_image_link, download_folder): download_image_link
                for download_image_link in download_image_links
            }
            for future_img in concurrent.futures.as_completed(future_to_download_link):
                download_image_link = future_to_download_link[future_img]  # 这里是原始链接
                try:
                    local_img_path = future_img.result()  # future_img.result()应该直接给出本地路径或结果
                    if local_img_path:  # 假设download_image函数返回的是None或错误信息时为False
                        print(local_img_path)
                        image_downloaded.append(local_img_path)
                    else:
                        print(f"Failed to download or invalid result for {download_image_link}")
                except Exception as exc:
                    print(f'Generated an exception while downloading {download_image_link}: {exc}')

        return title, image_downloaded

    except Exception as e:
        print("Error occurred:", e)
        return None, None
