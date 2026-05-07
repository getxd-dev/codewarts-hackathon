FROM python:3.11-slim

WORKDIR /app

COPY apps/service ./apps/service
COPY Makefile ./Makefile

ENV PYTHONPATH=/app/apps/service

CMD ["python", "-m", "unittest", "discover", "-s", "apps/service/tests", "-p", "test_*.py"]

