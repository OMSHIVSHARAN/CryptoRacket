import logging

def get_logger(n):
  log = logging.getLogger(n)
  ch = logging.StreamHandler()
  ch.setLevel(logging.DEBUG)
  formatter = logging.Formatter('%(asctime)s|%(name)s|%(levelname)s|%(message)s')
  ch.setFormatter(formatter)
  log.addHandler(ch)
  log.setLevel(logging.DEBUG)
  return log

def set_logger(logger):
  global log
  log = logger
