"""
Setup configuration for Background Remover API
"""
from setuptools import setup, find_packages

setup(
    name="background-remover-api",
    version="1.0.0",
    description="AI-powered background removal API using FastAPI and rembg",
    author="Andrew San Antonio",
    author_email="sgandrew290@gmail.com",
    packages=find_packages(),
    python_requires=">=3.12",
    install_requires=[
        "fastapi==0.115.5",
        "uvicorn[standard]==0.32.1",
        "python-multipart==0.0.20",
        "rembg[cpu]==2.0.77",
        "pillow>=12.1.0",
    ],
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3.12",
        "Programming Language :: Python :: 3.13",
        "Programming Language :: Python :: 3.14",
        "Framework :: FastAPI",
    ],
)
