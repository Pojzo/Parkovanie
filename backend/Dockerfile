FROM python:3.12
WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
COPY . /app/

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

CMD ["python", "main.py"]