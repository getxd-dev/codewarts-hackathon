.PHONY: test lint validate-factory

test:
	PYTHONPATH=apps/service python3 -m unittest discover -s apps/service/tests -p 'test_*.py'

lint:
	python3 -m py_compile apps/service/software_factory_sample/*.py

validate-factory:
	python3 scripts/validate_factory.py
